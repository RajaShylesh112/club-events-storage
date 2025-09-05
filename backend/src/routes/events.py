from flask import Blueprint, request, jsonify
from controllers.event_controller import EventController

events_bp = Blueprint('events', __name__)
event_controller = EventController()

@events_bp.route('/events', methods=['POST'])
def create_event():
    data = request.json
    event = event_controller.create_event(data)
    return jsonify(event), 201

@events_bp.route('/events/<event_id>', methods=['GET'])
def get_event(event_id):
    event = event_controller.get_event(event_id)
    return jsonify(event), 200

@events_bp.route('/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    updated_event = event_controller.update_event(event_id, data)
    return jsonify(updated_event), 200

@events_bp.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    event_controller.delete_event(event_id)
    return jsonify({'message': 'Event deleted successfully'}), 204