# 🚀 Complete FastAPI Backend with Google OAuth2 + JWT

This is a complete Python FastAPI backend that provides:
- ✅ Google OAuth2 authentication
- ✅ JWT tokens for API access  
- ✅ MongoDB integration with PyMongo
- ✅ User profile management
- ✅ Production-ready configuration
- ✅ Interactive API documentation (Swagger UI)

## 📋 Quick Start

### 1. Install Dependencies
```bash
pip install fastapi uvicorn[standard] python-multipart pymongo[srv] python-dotenv pydantic[email] python-jose[cryptography] passlib[bcrypt] google-auth google-auth-oauthlib google-auth-httplib2 requests itsdangerous
```

### 2. Configure Google OAuth2

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create/Select Project**
3. **Enable APIs**: Google+ API, Google OAuth2 API
4. **Create OAuth2 Credentials**:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`
5. **Download JSON** and save as `client_secret.json` in backend folder

### 3. Setup Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
```

### 4. Run the Application
```bash
# Test the setup
python test_backend.py

# Start the server
cd src
uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# Or run directly
python src/main.py
```

## 🌟 FastAPI Features

- **Interactive API Documentation**: Visit `http://127.0.0.1:8000/docs` for Swagger UI
- **Alternative API Documentation**: Visit `http://127.0.0.1:8000/redoc` for ReDoc UI
- **Automatic validation**: Pydantic models ensure data validation
- **Async support**: Built-in async support for better performance

## 🔧 Configuration

### Environment Variables (.env)
```env
# MongoDB
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
DB_NAME=file-system

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth2 (optional if using client_secret.json)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

# Flask Configuration
FLASK_SECRET_KEY=your-super-secret-flask-key-change-this
FLASK_ENV=development
```

## 🌐 API Endpoints

### Authentication Flow

#### 1. **GET /auth/login** - Get Google OAuth2 URL
```bash
curl http://localhost:8000/auth/login
```
```json
{
  "auth_url": "https://accounts.google.com/o/oauth2/auth?client_id=..."
}
```

#### 2. **GET /auth/callback** - OAuth2 Callback (Automatic)
After user logs in with Google, they're redirected here and receive:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe", 
    "email": "john@example.com",
    "picture": "https://lh3.googleusercontent.com/..."
  }
}
```

#### 3. **GET /auth/me** - Get User Profile
```bash
curl -H "Authorization: Bearer <jwt-token>" http://localhost:5000/auth/me
```
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com", 
  "picture": "https://lh3.googleusercontent.com/...",
  "role": "user",
  "created_at": "2025-09-06T10:00:00"
}
```

#### 4. **POST /auth/logout** - Logout
```bash
curl -X POST http://localhost:5000/auth/logout
```

## 🖥️ Frontend Integration

### JavaScript Example
```javascript
// 1. Get Google OAuth2 login URL
async function getLoginUrl() {
  const response = await fetch('http://localhost:5000/auth/login');
  const { auth_url } = await response.json();
  return auth_url;
}

// 2. Redirect to Google OAuth
async function loginWithGoogle() {
  const authUrl = await getLoginUrl();
  window.location.href = authUrl;
}

// 3. After callback, store the JWT token
// (This happens automatically when user returns from Google)

// 4. Use JWT for authenticated requests
async function getProfile(token) {
  const response = await fetch('http://localhost:5000/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}

// 5. Store token securely
localStorage.setItem('auth_token', token);

// 6. Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('auth_token');
}
```

### React Example
```jsx
import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    }
  };

  const loginWithGoogle = async () => {
    const response = await fetch('http://localhost:5000/auth/login');
    const { auth_url } = await response.json();
    window.location.href = auth_url;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.name}!</h1>
        <img src={user.picture} alt="Profile" />
        <p>Email: {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Login Required</h1>
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  );
}

export default App;
```

## 🚀 Production Deployment

### 1. Update Environment Variables
```env
FLASK_ENV=production
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
JWT_SECRET=very-long-random-string-generated-securely
FLASK_SECRET_KEY=another-very-long-random-string
```

### 2. Update Google Cloud Console
- Add production redirect URI: `https://yourdomain.com/auth/callback`
- Add authorized domains

### 3. Security Checklist
- ✅ Use HTTPS in production
- ✅ Set secure session cookies  
- ✅ Use strong, random JWT secrets
- ✅ Implement rate limiting
- ✅ Restrict CORS to specific domains
- ✅ Use environment variables for all secrets
- ✅ Enable MongoDB authentication and SSL

### 4. Deploy with Docker (Optional)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
COPY .env .

EXPOSE 8000
CMD ["python", "src/main.py"]
```

## 📁 Project Structure
```
backend/
├── src/
│   ├── main.py                 # Flask app entry point
│   ├── config/
│   │   ├── db.py              # MongoDB connection
│   │   └── jwt_config.py      # JWT token handling
│   ├── controllers/
│   │   └── auth_controller.py  # Authentication logic
│   ├── models/
│   │   ├── user.py            # User model
│   │   ├── event.py           # Event model  
│   │   └── file.py            # File model
│   ├── routes/
│   │   └── auth.py            # Authentication routes
│   └── services/
│       └── google_oauth.py    # Google OAuth service
├── .env                       # Environment variables
├── .env.example              # Environment template
├── client_secret.json        # Google OAuth credentials
├── client_secret.json.example # Template
├── requirements.txt          # Python dependencies
├── test_backend.py          # Test script
└── README.md               # This file
```

## 🔧 Troubleshooting

### Common Issues

**1. Google OAuth Errors**
- ❌ **redirect_uri_mismatch**: Check Google Cloud Console redirect URIs match exactly
- ❌ **invalid_client**: Verify client_id and client_secret
- ❌ **access_denied**: User denied permissions or app not verified

**2. JWT Token Issues**  
- ❌ **Token expired**: Tokens expire after 24 hours by default
- ❌ **Invalid signature**: JWT_SECRET mismatch between token creation and verification
- ❌ **Missing Authorization header**: Ensure format is `Bearer <token>`

**3. MongoDB Connection**
- ❌ **Connection timeout**: Check MongoDB Atlas network access whitelist
- ❌ **Authentication failed**: Verify username/password in connection string
- ❌ **Database not found**: Ensure database name is correct

**4. Environment Issues**
- ❌ **Module not found**: Run `pip install -r requirements.txt`
- ❌ **Environment variables not loaded**: Check .env file location and format

### Debug Mode
```bash
# Enable debug logging
export FLASK_ENV=development
python src/main.py
```

### Test Endpoints
```bash
# Test health
curl http://localhost:5000/health

# Test login URL generation  
curl http://localhost:5000/auth/login

# Test protected endpoint (should fail without token)
curl http://localhost:5000/auth/me
```

## 📞 Support

If you encounter issues:

1. Check the console output for error messages
2. Verify all environment variables are set correctly
3. Ensure Google Cloud Console is configured properly
4. Test with the provided `test_backend.py` script
5. Check MongoDB Atlas connection and permissions

For production deployments, consider implementing:
- Rate limiting (Flask-Limiter)
- Request logging
- Error monitoring (Sentry)
- Load balancing
- Database connection pooling

---

**🎉 You now have a complete, production-ready Flask backend with Google OAuth2 and JWT authentication!**
