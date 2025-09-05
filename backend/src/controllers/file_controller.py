from flask import request, jsonify
from src.models.file import File
from src.utils import validate_file_upload

class FileController:
    @staticmethod
    def upload_file():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if not validate_file_upload(file):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Logic to save the file to the database and storage service
        new_file = File(filename=file.filename, file_type=file.content_type)
        new_file.save()  # Assuming save method handles DB interaction
        
        return jsonify({'message': 'File uploaded successfully', 'file_id': new_file.id}), 201

    @staticmethod
    def get_file(file_id):
        file = File.find_by_id(file_id)  # Assuming find_by_id method retrieves the file
        
        if not file:
            return jsonify({'error': 'File not found'}), 404
        
        return jsonify({'filename': file.filename, 'file_type': file.file_type}), 200

    @staticmethod
    def delete_file(file_id):
        file = File.find_by_id(file_id)
        
        if not file:
            return jsonify({'error': 'File not found'}), 404
        
        file.delete()  # Assuming delete method handles DB interaction
        
        return jsonify({'message': 'File deleted successfully'}), 200