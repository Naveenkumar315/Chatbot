# services/jwt_service.py

import os
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


# ================= CONFIG =================

SECRET_KEY = os.environ.get("SECRET_KEY", "secret")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer()


# ================= TOKEN CREATION =================

def create_access_token(data: dict) -> str:
    """
    Create short-lived access token
    """

    payload = {
        **data,
        "type": "access",
        "exp": datetime.utcnow()
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """
    Create long-lived refresh token
    """

    payload = {
        **data,
        "type": "refresh",
        "exp": datetime.utcnow()
        + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ================= TOKEN VERIFY =================

def verify_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


# ================= FASTAPI DEPENDENCY =================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Automatically extracts user from JWT
    """

    token = credentials.credentials
    payload = verify_token(token)

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401,
            detail="Invalid access token"
        )

    return payload
