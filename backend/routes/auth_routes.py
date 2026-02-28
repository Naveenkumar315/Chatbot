from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
from passlib.context import CryptContext
import hashlib
from services.jwt_service import create_access_token, create_refresh_token
import random
from services.db_service import get_db
from services.email_service import send_email
import threading
from model.models import SignupRequest, LoginRequest, ForgotPasswordRequest, UpdatePasswordRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ================= CONFIG =================

SECRET_KEY = "CHATBOT_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 12

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):

    # pre-hash to avoid 72-byte bcrypt limit
    sha256_password = hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()

    return pwd_context.hash(sha256_password)


def verify_password(plain_password: str, hashed_password: str):

    sha256_password = hashlib.sha256(
        plain_password.encode("utf-8")
    ).hexdigest()

    return pwd_context.verify(
        sha256_password,
        hashed_password
    )


# ================= SIGNUP =================

@router.post("/signup")
def signup(req: SignupRequest, conn=Depends(get_db)):

    print(f"Signup attempt for email: {req.email}")

    if req.password != req.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM Users WHERE email=?",
        (req.email,)
    )

    if cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    password_hash = hash_password(req.password)

    cursor.execute("""
        INSERT INTO Users(email, password_hash)
        VALUES (?, ?)
    """, (
        req.email,
        password_hash
    ))

    conn.commit()

    return {"message": "Signup successful"}


# ================= LOGIN =================

@router.post("/login")
def login(req: LoginRequest, conn=Depends(get_db)):

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, password_hash
        FROM Users
        WHERE email=?
    """, (req.email,))

    user = cursor.fetchone()

    if not user:
        return {"message": "Invalid credentials"}

    user_id, password_hash = user

    if not verify_password(req.password, password_hash):
        return {"message": "Invalid credentials"}

    token_data = {
        "email": req.email
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "email": req.email
    }


def get_verification_email(code: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#f4f7fb; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
            <tr>
                <td align="center">
                    <table width="420" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background:linear-gradient(135deg,#24A1DD,#1a78a8); padding:28px; border-radius:12px 12px 0 0;">
                                <h1 style="margin:0; color:#fff; font-size:22px; font-weight:bold;">✦ Chatbot Genie</h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td align="center" style="padding: 36px 40px;">
                                <p style="margin:0 0 6px; color:#333; font-size:18px; font-weight:bold;">Your Verification Code</p>
                                <p style="margin:0 0 24px; color:#888; font-size:13px;">Use the code below to reset your password</p>

                                <!-- Code -->
                                <div style="background:#f0f8ff; border:2px dashed #24A1DD; border-radius:10px; padding:18px 40px; display:inline-block;">
                                    <p style="margin:0; color:#24A1DD; font-size:38px; font-weight:bold; letter-spacing:12px;">{code}</p>
                                </div>

                                <p style="margin:24px 0 0; color:#aaa; font-size:12px;">⏱ Valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding:16px; border-top:1px solid #eee;">
                                <p style="margin:0; color:#ccc; font-size:11px;">© 2026 Chatbot Genie · All rights reserved</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, conn=Depends(get_db)):

    print(f"Password reset requested for email: {req.email}")

    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM Users WHERE email=?",
        (req.email,)
    )

    user = cursor.fetchone()

    if not user:
        # Don't reveal user existence (security)
        return {"message": "user not found"}

    # generate 6-digit code
    code = str(random.randint(100000, 999999))

    expiry = datetime.now() + timedelta(minutes=10)

    cursor.execute("""
        UPDATE Users
        SET reset_code=?, reset_code_expiry=?
        WHERE email=?
    """, (code, expiry, req.email))

    conn.commit()

    # TODO: Send email here
    print(f"Reset code for {req.email}: {code}")

    html_body = get_verification_email(code)
    thread = threading.Thread(
        target=send_email,
        args=(req.email, "Your Verification Code - Chatbot Genie", html_body)
    )
    thread.daemon = True
    thread.start()

    return {"message": "Verification code sent"}


@router.post("/update-password")
def update_password(req: UpdatePasswordRequest, conn=Depends(get_db)):

    cursor = conn.cursor()

    print(
        f"Password update attempt for email: {req.email} with code: {req.code}")

    cursor.execute("""
        SELECT reset_code, reset_code_expiry
        FROM Users
        WHERE email=?
    """, (req.email,))

    user = cursor.fetchone()

    if not user:
        raise HTTPException(400, "Invalid request")

    stored_code, expiry = user

    if not stored_code or stored_code != req.code:
        return {"message": "Invalid verification code"}

    # Parse expiry if it's a string
    if isinstance(expiry, str):
        expiry = datetime.strptime(expiry, "%Y-%m-%d %H:%M:%S.%f")

    if expiry < datetime.now():
        return {"message": "Code expired"}

    new_password_hash = hash_password(req.password)

    cursor.execute("""
        UPDATE Users
        SET password_hash=?,
            reset_code=NULL,
            reset_code_expiry=NULL
        WHERE email=?
    """, (new_password_hash, req.email))

    conn.commit()

    return {"message": "Password updated successfully"}
