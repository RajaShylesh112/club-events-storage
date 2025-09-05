from flask import request, jsonify
from src.models.event import Event
from src.utils import validate_event_data

class EventController:
    @staticmethod
    def create_event():
        data = request.get_json()
        if not validate_event_data(data):
            return jsonify({"error": "Invalid event data"}), 400
        
        event = Event(**data)
        event.save()
        return jsonify(event.to_dict()), 201

    @staticmethod
    def update_event(event_id):
        data = request.get_json()
        event = Event.find_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        
        if not validate_event_data(data):
            return jsonify({"error": "Invalid event data"}), 400
        
        event.update(**data)
        return jsonify(event.to_dict()), 200

    @staticmethod
    def delete_event(event_id):
        event = Event.find_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        
        event.delete()
        return jsonify({"message": "Event deleted"}), 204

    @staticmethod
    def get_event(event_id):
        event = Event.find_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404
        
        return jsonify(event.to_dict()), 200

    @staticmethod
    def get_all_events():
        events = Event.find_all()
        return jsonify([event.to_dict() for event in events]), 200