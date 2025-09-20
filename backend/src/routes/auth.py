from fastapi import APIRouter, Request, Depends, Query, HTTPException, status
from typing import Optional
from controllers.auth_controller import AuthController
from dependencies import get_current_user
from models.user import AuthResponse, AuthUrlResponse, UserResponse, MessageResponse
from pydantic import BaseModel, EmailStr
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.get("/login")
async def google_login(request: Request, redirect_uri: str = Query(None)):
    """
    Initiate Google OAuth2 login and return Google OAuth URL
    
    This endpoint returns the Google OAuth URL for the frontend to redirect to.
    """
    # Always use the env variable if not provided
    redirect_uri = redirect_uri or os.getenv("GOOGLE_REDIRECT_URI")
    if not redirect_uri:
        raise HTTPException(status_code=500, detail="GOOGLE_REDIRECT_URI is not set in the environment.")
    controller = AuthController()
    auth_url = await controller.google_login_url(request, redirect_uri)
    return {"auth_url": auth_url}

@router.get("/callback")
async def google_callback(
    request: Request,
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """
    Handle Google OAuth2 callback (internal endpoint)
    
    Google redirects here after authentication.
    This endpoint creates a JWT token and redirects to the frontend.
    """
    controller = AuthController()
    return await controller.handle_google_callback(code, state, request)

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    controller = AuthController()
    return await controller.get_user_profile(current_user)

@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Logout endpoint (client should delete JWT token)"""
    return {"message": "Logged out successfully. Please delete your token."}

@router.post("/register", response_model=UserResponse)
async def register_user(data: RegisterRequest):
    """Register a new user with name, email, password"""
    controller = AuthController()
    return await controller.register_user(data)

@router.post("/password-login", response_model=AuthResponse)
async def password_login(data: LoginRequest):
    """Login with email and password"""
    controller = AuthController()
    return await controller.password_login(data)