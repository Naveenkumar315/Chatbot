from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    email: EmailStr
    # username: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
