from typing import Optional, Union
from bson import ObjectId

class File:
    def __init__(
        self,
        event_id: Union[str, ObjectId],
        uploader_id: Union[str, ObjectId],
        filename: str,
        storage_key: str,
        mime_type: str,
        size: int,
        uploaded_at: str,
        _id: Optional[Union[str, ObjectId]] = None,
    ):
        self._id = ObjectId(_id) if isinstance(_id, str) else _id
        self.event_id = ObjectId(event_id) if isinstance(event_id, str) else event_id
        self.uploader_id = ObjectId(uploader_id) if isinstance(uploader_id, str) else uploader_id
        self.filename = filename
        self.storage_key = storage_key
        self.mime_type = mime_type
        self.size = size
        self.uploaded_at = uploaded_at

    def to_dict(self) -> dict:
        return {
            "_id": self._id,
            "event_id": self.event_id,
            "uploader_id": self.uploader_id,
            "filename": self.filename,
            "storage_key": self.storage_key,
            "mime_type": self.mime_type,
            "size": self.size,
            "uploaded_at": self.uploaded_at,
        }

    def __str__(self):
        return f"{self.filename} ({self.mime_type})"