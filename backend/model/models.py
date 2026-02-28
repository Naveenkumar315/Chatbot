from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    email: EmailStr
    # username: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class UpdatePasswordRequest(BaseModel):
    email: str
    code: str
    password: str
