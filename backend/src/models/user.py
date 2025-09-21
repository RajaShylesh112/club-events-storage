from typing import Optional, Union
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
from pydantic import ConfigDict
from datetime import datetime

# Pydantic schemas for API requests/responses
class UserResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    picture: Optional[str] = None
    role: str = "user"
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AuthUrlResponse(BaseModel):
    auth_url: str

class MessageResponse(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

# MongoDB User model
class User:
    def __init__(
        self,
        name: str,
        email: str,
        role: str,
        google_sub: str,
        created_at: str,
        password: str = "",  # Default empty for OAuth users
        picture: str = "",
        _id: Optional[Union[str, ObjectId]] = None,
    ):
        self._id = ObjectId(_id) if isinstance(_id, str) else _id
        self.name = name
        self.email = email
        self.role = role
        self.google_sub = google_sub
        self.created_at = created_at
        self.password = password
        self.picture = picture

    def verify_password(self, password: str) -> bool:
        # For OAuth users, password verification is not needed
        if not self.password:
            return False
        return self.password == password

    def to_dict(self) -> dict:
        return {
            "_id": self._id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "google_sub": self.google_sub,
            "created_at": self.created_at,
            "password": self.password,
            "picture": self.picture,
        }

    def __str__(self):
        return f"{self.name} ({self.email})"