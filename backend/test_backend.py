#!/usr/bin/env python3
"""
Test script for the FastAPI backend with Google OAuth2 and JWT authentication.
Run this to verify your setup is working correctly.
"""

import sys
import os
import requests
import json

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

def test_backend():
    """Test the backend endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing FastAPI Backend with Google OAuth2 + JWT")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:5000")
        return False
    
    # Test auth login endpoint
    try:
        response = requests.get(f"{base_url}/auth/login")
        if response.status_code == 200:
            data = response.json()
            if "auth_url" in data:
                print("✅ Google OAuth login URL generation working")
                print(f"🔗 Login URL: {data['auth_url'][:100]}...")
            else:
                print("❌ Login endpoint doesn't return auth_url")
                return False
        else:
            print(f"❌ Login endpoint failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Login endpoint error: {str(e)}")
        return False
    
    # Test auth/me endpoint without token (should fail)
    try:
        response = requests.get(f"{base_url}/auth/me")
        if response.status_code == 401:
            print("✅ Protected endpoint correctly requires authentication")
        else:
            print(f"❌ Protected endpoint should return 401, got {response.status_code}")
    except Exception as e:
        print(f"❌ Protected endpoint test error: {str(e)}")
    
    print("\n🎉 Basic backend tests passed!")
    print("\nNext steps:")
    print("1. Set up Google OAuth2 credentials")
    print("2. Configure your .env file")
    print("3. Test the full OAuth flow in a browser")
    
    return True

def check_environment():
    """Check if environment is properly configured"""
    print("\n🔍 Checking Environment Configuration")
    print("=" * 40)
    
    # Check for .env file
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_file):
        print("✅ .env file found")
    else:
        print("⚠️  .env file not found. Copy .env.example to .env and configure it")
    
    # Check for client_secret.json
    client_secret_file = os.path.join(os.path.dirname(__file__), 'client_secret.json')
    if os.path.exists(client_secret_file):
        print("✅ client_secret.json found")
    else:
        print("⚠️  client_secret.json not found. Download from Google Cloud Console")
    
    # Check required environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = ['DB_URI', 'JWT_SECRET', 'SESSION_SECRET_KEY']
    for var in required_vars:
        if os.getenv(var):
            print(f"✅ {var} is set")
        else:
            print(f"⚠️  {var} is not set in environment")

if __name__ == "__main__":
    check_environment()
    
    # Ask user if they want to start the server
    start_server = input("\n🚀 Start the FastAPI server for testing? (y/N): ").lower().strip()
    
    if start_server == 'y':
        print("\nStarting FastAPI server...")
        print("You can test the endpoints at:")
        print("- Main API: http://localhost:8000")
        print("- API Docs: http://localhost:8000/docs")
        print("- Alternative Docs: http://localhost:8000/redoc")
        print("Open another terminal and run the test again to verify endpoints")
        
        # Import and run the FastAPI app
        import uvicorn
        import os
        os.chdir('src')
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    else:
        print("\nTo test the endpoints, first start the server:")
        print("cd src && uvicorn main:app --host 127.0.0.1 --port 8000 --reload")
        print("Or: python src/main.py")
        print("\nThen run this test script again")
