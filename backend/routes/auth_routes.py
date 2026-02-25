from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from services.jwt_service import create_access_token, create_refresh_token

from services.db_service import get_db

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
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


# ================= MODELS =================

class SignupRequest(BaseModel):
    email: str
    username: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ================= SIGNUP =================

@router.post("/signup")
def signup(req: SignupRequest, conn=Depends(get_db)):

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
        INSERT INTO Users(email, username, password_hash)
        VALUES (?, ?, ?)
    """, (
        req.email,
        req.username,
        password_hash
    ))

    conn.commit()

    return {"message": "Signup successful"}


# ================= LOGIN =================

@router.post("/login")
def login(req: LoginRequest, conn=Depends(get_db)):

    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, username, password_hash
        FROM Users
        WHERE email=?
    """, (req.email,))

    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    user_id, username, password_hash = user

    if not verify_password(req.password, password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token_data = {
        "email": req.email
    }

    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": username,
        "email": req.email
    }
