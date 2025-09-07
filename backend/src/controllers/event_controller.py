from models.event import Event
from config.db import get_db_connection
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException

# CREATE EVENT
async def create_event_controller(request, current_user):
    try:
        db = get_db_connection()
        organizer_id = str(current_user["_id"])
        start_time = request.start_time.isoformat()
        end_time = request.end_time.isoformat()
        now = datetime.utcnow().isoformat()
        event_data = {
            "title": request.title,
            "description": request.description,
            "organizer_id": organizer_id,
            "start_time": start_time,
            "end_time": end_time,
            "status": "draft",
            "created_at": now,
            "updated_at": now,
        }
        result = db.events.insert_one(event_data)
        event_data["_id"] = str(result.inserted_id)
        return event_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Event creation failed: {str(e)}")

# UPDATE EVENT
async def update_event_controller(event_id, update, current_user):
    try:
        db = get_db_connection()
        event = db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if current_user["role"] != "admin" and str(event["organizer_id"]) != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Forbidden")
        allowed_fields = ["title", "description", "start_time", "end_time"]
        update_data = {}
        for field in allowed_fields:
            value = getattr(update, field, None)
            if value is not None:
                if field in ["start_time", "end_time"] and hasattr(value, "isoformat"):
                    value = value.isoformat()
                update_data[field] = value
        update_data["updated_at"] = datetime.utcnow().isoformat()
        db.events.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
        event.update(update_data)
        event["_id"] = str(event["_id"])
        return event
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Event update failed: {str(e)}")

# APPROVE EVENT
async def approve_event_controller(event_id, current_user):
    try:
        if current_user["role"] != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        db = get_db_connection()
        event = db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        update_data = {
            "status": "approved",
            "approved_by": str(current_user["_id"]),
            "updated_at": datetime.utcnow().isoformat()
        }
        db.events.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
        event.update(update_data)
        event["_id"] = str(event["_id"])
        return event
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Event approval failed: {str(e)}")

# ARCHIVE EVENT
async def archive_event_controller(event_id, current_user):
    try:
        if current_user["role"] not in ["core_member", "admin"]:
            raise HTTPException(status_code=403, detail="Forbidden")
        db = get_db_connection()
        event = db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        update_data = {
            "status": "archived",
            "archived_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        db.events.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
        event.update(update_data)
        event["_id"] = str(event["_id"])
        return event
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Event archive failed: {str(e)}")

# DELETE EVENT
async def delete_event_controller(event_id, current_user):
    try:
        if current_user["role"] != "admin":
            raise HTTPException(status_code=403, detail="Forbidden")
        db = get_db_connection()
        result = db.events.delete_one({"_id": ObjectId(event_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"message": "Event deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Event deletion failed: {str(e)}")