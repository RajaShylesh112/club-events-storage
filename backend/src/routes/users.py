from flask import Blueprint, request, jsonify
from controllers.auth_controller import AuthController
from controllers.user_controller import UserController

users_bp = Blueprint('users', __name__)

@users_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = UserController.get_user(user_id)
    if user:
        return jsonify(user), 200
    return jsonify({'message': 'User not found'}), 404

@users_bp.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    updated_user = UserController.update_user(user_id, data)
    if updated_user:
        return jsonify(updated_user), 200
    return jsonify({'message': 'User not found or update failed'}), 404

@users_bp.route('/users', methods=['GET'])
def get_all_users():
    users = UserController.get_all_users()
    return jsonify(users), 200

@users_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    new_user = UserController.create_user(data)
    return jsonify(new_user), 201