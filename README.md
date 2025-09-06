# 🚀 Club Event Storage - FastAPI Backend

A complete FastAPI backend with Google OAuth2 authentication, JWT tokens, and MongoDB integration for managing club events and file storage.

## ✨ Features

- 🔐 **Google OAuth2 Authentication** - Secure login with Google accounts
- 🎟️ **JWT Token Management** - Stateless authentication for API access
- 🗄️ **MongoDB Integration** - Scalable document database with schema validation
- 📚 **Interactive API Documentation** - Auto-generated Swagger UI and ReDoc
- ⚡ **Async FastAPI** - High-performance async endpoints
- 🛡️ **Security Best Practices** - CORS, session management, input validation
- 🧪 **Comprehensive Testing** - Built-in test suite and validation scripts

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.py        # MongoDB connection
│   │   ├── jwt_config.py # JWT token handling
│   │   └── storage.py   # File storage config
│   ├── controllers/      # Business logic
│   │   └── auth_controller.py
│   ├── models/          # Data models and schemas
│   │   ├── user.py      # User model + Pydantic schemas
│   │   ├── event.py     # Event model
│   │   └── file.py      # File model
│   ├── routes/          # API endpoints
│   │   ├── auth.py      # Authentication routes
│   │   ├── events.py    # Event management
│   │   └── files.py     # File handling
│   ├── services/        # External service integrations
│   │   ├── google_oauth.py    # Google OAuth service
│   │   └── backblaze_service.py # File storage
│   ├── dependencies.py  # FastAPI dependencies
│   └── main.py         # Application entry point
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── client_secret.json.example # Google OAuth template
├── SETUP_GUIDE.md      # Detailed setup instructions
└── test_backend.py     # Testing script
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/RajaShylesh112/club-events-storage.git
cd club-events-storage/backend
```

### 2. Create Virtual Environment
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Setup
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual values

# Copy and configure Google OAuth credentials
cp client_secret.json.example client_secret.json
# Edit client_secret.json with your Google Cloud credentials
```

### 5. Run the Application
```bash
# From the src directory
cd src
uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# Or run directly
python src/main.py
```

### 6. Access the API
- **API Documentation**: http://127.0.0.1:8000/docs
- **Alternative Docs**: http://127.0.0.1:8000/redoc
- **Health Check**: http://127.0.0.1:8000/health

## 🔧 Configuration

### Environment Variables (.env)
```env
# MongoDB
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
DB_NAME=your-database-name

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Google OAuth2
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback

# FastAPI
SECRET_KEY=your-app-secret-key
SESSION_SECRET_KEY=your-session-secret
ENVIRONMENT=development
```

### Google OAuth2 Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Enable Google+ API and OAuth2 API
4. Create OAuth2 credentials
5. Add `http://localhost:8000/auth/callback` to authorized redirect URIs
6. Download the JSON file and save as `client_secret.json`

## 🔐 Authentication Flow

1. **Login**: `GET /auth/login` - Returns Google OAuth URL
2. **Callback**: `GET /auth/callback` - Handles Google redirect
3. **Profile**: `GET /auth/me` - Get current user (requires JWT token)
4. **Logout**: `POST /auth/logout` - Logout endpoint

### Example Usage
```bash
# Get login URL
curl http://localhost:8000/auth/login

# Get user profile (with JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/auth/me
```

## 🧪 Testing

Run the test script to verify your setup:
```bash
python test_backend.py
```

## 📦 Deployment

### Docker (Recommended)
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src/ .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Environment
- Set `ENVIRONMENT=production` in .env
- Use HTTPS with proper SSL certificates
- Configure session security settings
- Set up proper MongoDB indexes
- Use Redis for session storage (recommended)

## 🛠️ Development

### Adding New Endpoints
1. Create route in `routes/`
2. Add business logic in `controllers/`
3. Define models in `models/`
4. Add tests in test files

### Database Models
All models use MongoDB with schema validation. See `update_schema.py` for database setup.

## 📝 API Documentation

The API automatically generates documentation available at:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Run `python test_backend.py` to diagnose problems
- Open an issue on GitHub

---

**Built with ❤️ using FastAPI, MongoDB, and Google OAuth2**
