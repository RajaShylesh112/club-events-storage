from mongoengine import Document, StringField, DateTimeField, ReferenceField

class Event(Document):
    title = StringField(required=True)
    description = StringField()
    organizer_id = ReferenceField('User', required=True)
    start_time = DateTimeField(required=True)
    end_time = DateTimeField(required=True)
    status = StringField(required=True)
    created_at = DateTimeField(required=True)
    updated_at = DateTimeField(required=True)

    def __str__(self):
        return f"{self.title} ({self.status})"