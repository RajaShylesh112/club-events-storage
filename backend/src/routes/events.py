from fastapi import APIRouter, Depends, HTTPException, status, Query
from dependencies import get_current_user
from controllers.event_controller import create_event_controller
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from config.db import get_db_connection
from bson import ObjectId

router = APIRouter(prefix="/events", tags=["Events"])

class EventCreateRequest(BaseModel):
    title: str
    description: str = ""
    start_time: datetime
    end_time: datetime

class EventUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

@router.post("/", status_code=201)
async def create_event(request: EventCreateRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["core_member", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    event = await create_event_controller(request, current_user)
    return event

@router.get("/", response_model=List[dict])
async def list_events(status: Optional[str] = Query(None, description="Filter by status"), current_user: dict = Depends(get_current_user)):
    db = get_db_connection()
    query = {}
    if status:
        query["status"] = status
    events = list(db.events.find(query))
    for event in events:
        event["_id"] = str(event["_id"])
    return events

@router.get("/{event_id}", response_model=dict)
async def get_event(event_id: str, current_user: dict = Depends(get_current_user)):
    db = get_db_connection()
    event = db.events.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event["_id"] = str(event["_id"])
    # TODO: Fetch related files if needed
    return event

# PATCH /events/{id} - Organizer (if organizer_id matches) OR Admin
@router.patch("/{event_id}", response_model=dict)
async def update_event(event_id: str, update: EventUpdateRequest, current_user: dict = Depends(get_current_user)):
    db = get_db_connection()
    event = db.events.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if current_user["role"] != "admin" and str(event["organizer_id"]) != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Forbidden")
    update_data = {k: v for k, v in update.dict(exclude_unset=True).items()}
    update_data["updated_at"] = datetime.utcnow().isoformat()
    db.events.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
    event.update(update_data)
    event["_id"] = str(event["_id"])
    return event

# PATCH /events/{id}/approve - Admin only
@router.patch("/{event_id}/approve", response_model=dict)
async def approve_event(event_id: str, current_user: dict = Depends(get_current_user)):
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

# PATCH /events/{id}/archive - Core or Admin
@router.patch("/{event_id}/archive", response_model=dict)
async def archive_event(event_id: str, current_user: dict = Depends(get_current_user)):
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

# DELETE /events/{id} - Admin only
@router.delete("/{event_id}", response_model=dict)
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    db = get_db_connection()
    result = db.events.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}