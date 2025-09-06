import os
import json
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv

load_dotenv()

class GoogleOAuthService:
    def __init__(self):
        # Load Google OAuth credentials from environment or file
        self.client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        
        # Fallback to client_secret.json file if env vars not set
        if not self.client_id or not self.client_secret:
            try:
                with open("client_secret.json", "r") as f:
                    credentials = json.load(f)["web"]
                    self.client_id = credentials["client_id"]
                    self.client_secret = credentials["client_secret"]
            except FileNotFoundError:
                raise ValueError("Google OAuth credentials not found. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables or provide client_secret.json")
        
        self.redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/callback")
    
    def get_auth_url(self, state=None):
        """Generate Google OAuth2 authorization URL"""
        base_url = "https://accounts.google.com/o/oauth2/auth"
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "openid email profile",
            "response_type": "code",
            "access_type": "offline"
        }
        if state:
            params["state"] = state
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
    
    def exchange_code_for_token(self, code):
        """Exchange authorization code for access token"""
        token_url = "https://oauth2.googleapis.com/token"
        
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": self.redirect_uri
        }
        
        response = requests.post(token_url, data=data)
        response.raise_for_status()
        return response.json()
    
    def get_user_info(self, access_token):
        """Get user information from Google"""
        userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        response = requests.get(userinfo_url, headers=headers)
        response.raise_for_status()
        return response.json()
    
    def verify_id_token(self, id_token_str):
        """Verify Google ID token"""
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                id_token_str, google_requests.Request(), self.client_id
            )
            
            # Verify the issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            return idinfo
        except ValueError:
            return None