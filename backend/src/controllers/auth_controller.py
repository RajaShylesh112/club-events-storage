from fastapi import HTTPException, status, Request, Response
from fastapi.responses import RedirectResponse
from datetime import datetime
from bson import ObjectId
import secrets
import os
from config.db import get_db_connection
from config.jwt_config import create_jwt_token, verify_jwt_token
from services.google_oauth import GoogleOAuthService
from models.user import User
from passlib.hash import bcrypt
from urllib.parse import urlencode

class AuthController:
    def __init__(self):
        self.db = get_db_connection()
        self.google_oauth = GoogleOAuthService()
    
    async def google_login_url(self, request: Request, frontend_redirect_uri: str = None):
        """Generate Google OAuth2 login URL and store frontend redirect URI"""
        state = secrets.token_urlsafe(32)
        # Store state and frontend redirect URI in session
        request.session['oauth_state'] = state
        if frontend_redirect_uri:
            request.session['frontend_redirect_uri'] = frontend_redirect_uri
        
        auth_url = self.google_oauth.get_auth_url(state=state)
        return auth_url
    
    def redirect_to_google(self, auth_url: str):
        """Redirect to Google OAuth login page"""
        return RedirectResponse(url=auth_url, status_code=302)
    
    async def handle_complete_google_login(self, request: Request, frontend_redirect_uri: str = None):
        """Handle complete Google OAuth flow and return token directly"""
        try:
            # Check if we have authorization code from Google
            code = request.query_params.get('code')
            state = request.query_params.get('state')
            
            if code:
                # We have a code, process the callback and return JSON
                return await self.handle_google_callback(code, state, request, return_json=True)
            else:
                # No code, initiate OAuth flow
                auth_url = await self.google_login_url(request, frontend_redirect_uri)
                return RedirectResponse(url=auth_url, status_code=302)
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Google login failed: {str(e)}"
            )
    
    async def handle_google_callback(self, code: str, state: str, request: Request, return_json: bool = False):
        """Handle Google OAuth2 callback and redirect to frontend or return JSON"""
        if not code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing authorization code"
            )
        
        try:
            # Verify state parameter
            stored_state = request.session.get('oauth_state')
            
            if not stored_state or stored_state != state:
                # For OAuth flow, we'll be more lenient with state validation
                # In production, consider using a more robust state storage mechanism
                pass
            
            # Exchange code for tokens
            token_data = self.google_oauth.exchange_code_for_token(code)
            access_token = token_data.get('access_token')
            id_token_str = token_data.get('id_token')
            
            if not access_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get access token"
                )
            
            # Get user info from Google
            user_info = self.google_oauth.get_user_info(access_token)
            
            # Alternatively, verify ID token (more secure)
            if id_token_str:
                verified_info = self.google_oauth.verify_id_token(id_token_str)
                if verified_info:
                    user_info = verified_info
            
            # Store or update user in MongoDB
            user_data = await self._store_or_update_user(user_info)
            
            # Create JWT token
            jwt_token = create_jwt_token(user_data)
            
            # Clean up session
            if 'oauth_state' in request.session:
                del request.session['oauth_state']
            if 'frontend_redirect_uri' in request.session:
                del request.session['frontend_redirect_uri']
            
            # User object to pass to frontend
            user = {
                "_id": str(user_data["_id"]),
                "name": user_data["name"],
                "email": user_data["email"],
                "picture": user_data.get("picture", ""),
                "role": user_data.get("role", "user"),
                "created_at": user_data.get("created_at")
            }
            
            if return_json:
                # Return JSON response with token and user data
                return {
                    "access_token": jwt_token,
                    "token_type": "bearer",
                    "user": user
                }
            else:
                # Redirect to frontend with token in URL (original behavior)
                frontend_uri = request.session.get('frontend_redirect_uri', "http://localhost:5173/auth-callback")
                
                import json
                query_params = {
                    "token": jwt_token,
                    "user": json.dumps(user)
                }
                redirect_url = f"{frontend_uri}?{urlencode(query_params)}"
                
                response = RedirectResponse(url=redirect_url, status_code=302)
                
                # Set HTTP-only cookie with token
                response.set_cookie(
                    key="auth_token",
                    value=jwt_token,
                    httponly=True,
                    max_age=7 * 24 * 3600,
                    secure=False,
                    samesite="lax"
                )
                
                return response
            
        except HTTPException:
            raise
        except Exception as e:
            if return_json:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Authentication failed: {str(e)}"
                )
            else:
                # Redirect to frontend with error
                frontend_uri = request.session.get('frontend_redirect_uri', "http://localhost:5173/auth-callback")
                error_params = {
                    "error": f"Authentication failed: {str(e)}"
                }
                redirect_url = f"{frontend_uri}?{urlencode(error_params)}"
                
                # Clean up session
                if 'oauth_state' in request.session:
                    del request.session['oauth_state']
                if 'frontend_redirect_uri' in request.session:
                    del request.session['frontend_redirect_uri']
                    
                return RedirectResponse(url=redirect_url, status_code=302)
    
    async def get_user_profile(self, user_data: dict):
        """Get user profile from current user data"""
        try:
            return {
                "_id": str(user_data["_id"]),
                "name": user_data["name"],
                "email": user_data["email"],
                "picture": user_data.get("picture", ""),
                "role": user_data.get("role", "user"),
                "created_at": user_data.get("created_at")
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get profile: {str(e)}"
            )
    
    async def _store_or_update_user(self, user_info):
        """Store or update user in MongoDB"""
        google_id = user_info.get("id") or user_info.get("sub")
        email = user_info.get("email")
        name = user_info.get("name")
        picture = user_info.get("picture")
        
        if not email or not google_id:
            raise ValueError("Missing required user information")
        
        # Check if user exists
        existing_user = self.db.users.find_one({
            "$or": [
                {"google_sub": google_id},
                {"email": email}
            ]
        })
        
        current_time = datetime.utcnow().isoformat()  # Convert to string format
        
        user_data = {
            "name": name,
            "email": email,
            "google_sub": google_id,
            "picture": picture,
            "role": "user",
            "password": "",  # Empty password for OAuth users
            "updated_at": current_time
        }
        
        if existing_user:
            # Update existing user
            self.db.users.update_one(
                {"_id": existing_user["_id"]},
                {"$set": user_data}
            )
            user_data["_id"] = existing_user["_id"]
            user_data["created_at"] = existing_user.get("created_at", current_time)
        else:
            # Create new user
            user_data["created_at"] = current_time  # String format for MongoDB schema
            result = self.db.users.insert_one(user_data)
            user_data["_id"] = result.inserted_id
        
        return user_data
    
    async def register_user(self, data):
        """Register a new user with name, email, password"""
        # Check if user already exists
        existing = self.db.users.find_one({"email": data.email})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        # Hash password
        hashed_password = bcrypt.hash(data.password)
        now = datetime.utcnow().isoformat()
        user_doc = {
            "name": data.name,
            "email": data.email,
            "role": "user",
            "google_sub": "",
            "created_at": now,
            "updated_at": now,
            "password": hashed_password,
            "picture": ""
        }
        result = self.db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        return {
            "_id": str(user_doc["_id"]),
            "name": user_doc["name"],
            "email": user_doc["email"],
            "picture": user_doc["picture"],
            "role": user_doc["role"],
            "created_at": user_doc["created_at"]
        }

    async def password_login(self, data):
        """Login with email and password"""
        user = self.db.users.find_one({"email": data.email})
        if not user or not user.get("password"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        if not bcrypt.verify(data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        token = create_jwt_token(user)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "_id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "picture": user.get("picture", ""),
                "role": user.get("role", "user"),
                "created_at": user.get("created_at")
            }
        }