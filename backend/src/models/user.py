class User:
    def __init__(self, name, email, role, google_sub, created_at, password, _id=None):
        self._id = _id
        self.name = name
        self.email = email
        self.role = role
        self.google_sub = google_sub
        self.created_at = created_at
        self.password = password

    def verify_password(self, password):
        # Implement password verification logic here
        return self.password == password

    def to_dict(self):
        return {
            "_id": self._id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "google_sub": self.google_sub,
            "created_at": self.created_at,
            "password": self.password
        }

    def __str__(self):
        return f"{self.name} ({self.email})"