from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    """
    Application factory pattern
    """
    app = FastAPI(
        title="Club Event Storage API",
        description="FastAPI backend with Google OAuth2 and JWT authentication",
        version="1.0.0"
    )

    # Configure CORS from env or use sane defaults for localhost
    cors_env = os.getenv("BACKEND_CORS_ORIGINS", "").strip()
    if cors_env == "*":
        # Wildcard cannot be used with credentials; disable credentials if using '*'
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=False,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        default_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8080",
            "http://127.0.0.1:8080",
        ]
        extra = [o.strip() for o in cors_env.split(",") if o.strip()]
        allow_origins = default_origins + extra
        app.add_middleware(
            CORSMiddleware,
            allow_origins=allow_origins,
            allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Add session middleware
    app.add_middleware(
        SessionMiddleware,
        secret_key=os.getenv("SESSION_SECRET_KEY", "your-default-secret-key-change-in-production"),
        max_age=3600,  # 1 hour
        same_site='lax',  # Allow cross-site requests for OAuth
        https_only=False  # Set to True in production with HTTPS
    )

    # Include routers
    from routes.users import router as users_router
    from routes.auth import router as auth_router
    from routes.events import router as events_router
    
    app.include_router(auth_router)
    app.include_router(users_router)
    app.include_router(events_router)

    @app.get("/")
    async def root():
        return {"message": "Club Event Storage API - FastAPI Version"}

    @app.get("/health")
    async def health():
        return {"status": "healthy"}

    return app

# Create the app instance for uvicorn
app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)