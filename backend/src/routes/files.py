from flask import Blueprint, request, jsonify
from controllers.file_controller import FileController

files_bp = Blueprint('files', __name__)
file_controller = FileController()

@files_bp.route('/files', methods=['POST'])
def upload_file():
    file = request.files['file']
    response = file_controller.upload_file(file)
    return jsonify(response), response['status']

@files_bp.route('/files/<file_id>', methods=['GET'])
def get_file(file_id):
    response = file_controller.get_file(file_id)
    return jsonify(response), response['status']

@files_bp.route('/files/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    response = file_controller.delete_file(file_id)
    return jsonify(response), response['status']