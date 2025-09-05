from flask import Flask
from config.db import initialize_db
from routes.auth import auth_routes
from routes.users import user_routes
from routes.events import event_routes
from routes.files import file_routes

def create_app():
    app = Flask(__name__)
    
    # Load configuration from environment variables
    app.config.from_envvar('APP_SETTINGS', silent=True)

    # Initialize the database
    initialize_db(app)

    # Register routes
    app.register_blueprint(auth_routes)
    app.register_blueprint(user_routes)
    app.register_blueprint(event_routes)
    app.register_blueprint(file_routes)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)