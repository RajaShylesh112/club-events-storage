from datetime import datetime
from typing import Optional, Union
from bson import ObjectId

class Event:
    def __init__(
        self,
        title: str,
        description: Optional[str],
        organizer_id: Union[str, ObjectId],
        start_time: datetime,
        end_time: datetime,
        status: str,
        created_at: datetime,
        updated_at: datetime,
        _id: Optional[Union[str, ObjectId]] = None,
    ):
        self._id = ObjectId(_id) if isinstance(_id, str) else _id
        self.title = title
        self.description = description
        self.organizer_id = ObjectId(organizer_id) if isinstance(organizer_id, str) else organizer_id
        self.start_time = start_time
        self.end_time = end_time
        self.status = status
        self.created_at = created_at
        self.updated_at = updated_at

    def to_dict(self) -> dict:
        return {
            "_id": self._id,
            "title": self.title,
            "description": self.description,
            "organizer_id": self.organizer_id,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    def __str__(self):
        return f"{self.title} ({self.status})"