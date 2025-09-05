from flask import request, jsonify
from src.models.user import User
from src.models.event import Event
from src.models.file import File
from src.utils import generate_token, validate_user_data

class AuthController:
    @staticmethod
    def register():
        data = request.get_json()
        if not validate_user_data(data):
            return jsonify({"error": "Invalid data"}), 400
        
        user = User(
            name=data['name'],
            email=data['email'],
            role=data.get('role', 'user'),
            google_sub=data.get('google_sub', ''),
            created_at=data.get('created_at')
        )
        user.save()
        
        token = generate_token(str(user.id))
        return jsonify({"token": token}), 201

    @staticmethod
    def login():
        data = request.get_json()
        user = User.objects(email=data['email']).first()
        
        if user and user.verify_password(data['password']):
            token = generate_token(str(user.id))
            return jsonify({"token": token}), 200
        
        return jsonify({"error": "Invalid credentials"}), 401