from fastapi import APIRouter, Depends, HTTPException, status, Body
from pydantic import BaseModel
from controllers.user_controller import get_all_users, update_user_role
from dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

def is_admin(user):
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")

class RoleUpdateRequest(BaseModel):
    role: str

@router.get("/", response_model=list)
async def get_all_users_route(current_user: dict = Depends(get_current_user)):
    is_admin(current_user)
    return get_all_users()

@router.patch("/{user_id}/role")
async def update_user_role_route(user_id: str, data: RoleUpdateRequest = Body(...), current_user: dict = Depends(get_current_user)):
    is_admin(current_user)
    if data.role not in ["admin", "user", "core_member"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    result = update_user_role(user_id, data.role)
    if result == "admin_locked":
        raise HTTPException(status_code=403, detail="Cannot change role of admin user")
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result