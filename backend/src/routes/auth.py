from fastapi import APIRouter, Request, Depends, Query
from typing import Optional
from controllers.auth_controller import AuthController
from dependencies import get_current_user
from models.user import AuthResponse, AuthUrlResponse, UserResponse, MessageResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/login", response_model=AuthUrlResponse)
async def google_login(request: Request):
    """Initiate Google OAuth2 login"""
    controller = AuthController()
    return await controller.google_login_url(request)

@router.get("/callback", response_model=AuthResponse)
async def google_callback(
    request: Request,
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """Handle Google OAuth2 callback"""
    controller = AuthController()
    return await controller.google_callback(code, state, request)

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    controller = AuthController()
    return await controller.get_user_profile(current_user)

@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Logout endpoint (client should delete JWT token)"""
    return {"message": "Logged out successfully. Please delete your token."}