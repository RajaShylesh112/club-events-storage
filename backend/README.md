# Project Title

## Description
This project is a backend application built using Python, designed to manage users, events, and files. It utilizes MongoDB for data storage and integrates with external services such as Google OAuth for authentication and Backblaze for file storage.

## Project Structure
```
backend/
├── src/
│   ├── main.py                # App entrypoint
│   ├── config/                # Configuration files
│   │   ├── db.py              # Database configuration
│   │   └── storage.py         # External storage configuration
│   ├── models/                # MongoDB Schemas
│   │   ├── user.py            # User schema
│   │   ├── event.py           # Event schema
│   │   └── file.py            # File schema
│   ├── routes/                # API Endpoints
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── users.py           # User management endpoints
│   │   ├── events.py          # Event management endpoints
│   │   └── files.py           # File management endpoints
│   ├── controllers/           # Business logic
│   │   ├── auth_controller.py  # Authentication logic
│   │   ├── event_controller.py # Event management logic
│   │   └── file_controller.py  # File handling logic
│   ├── services/              # External integrations
│   │   ├── google_oauth.py    # Google OAuth integration
│   │   └── backblaze_service.py # Backblaze integration
│   └── utils/                 # Helper functions
├── tests/                     # Unit and integration tests
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary configuration:
   ```
   DB_URI=<your_database_uri>
   B2_KEY=<your_backblaze_key>
   OAUTH_SECRET=<your_oauth_secret>
   ```

5. Run the application:
   ```
   python src/main.py
   ```

## Usage
- The API endpoints can be accessed at `http://localhost:5000/api/`.
- Refer to the individual route files for specific endpoint details.

## Testing
To run the tests, use:
```
pytest tests/
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.