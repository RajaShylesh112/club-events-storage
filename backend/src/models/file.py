from mongoengine import Document, StringField, ReferenceField, IntField, DateTimeField

class File(Document):
    event_id = ReferenceField('Event', required=True)
    uploader_id = ReferenceField('User', required=True)
    filename = StringField(required=True)
    storage_key = StringField(required=True)
    mime_type = StringField(required=True)
    size = IntField(required=True)
    uploaded_at = DateTimeField(required=True)

    def __str__(self):
        return f"{self.filename} ({self.mime_type})"