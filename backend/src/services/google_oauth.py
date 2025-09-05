from flask import Blueprint, request, jsonify
from flask_oauthlib.client import OAuth

google_bp = Blueprint('google', __name__)
oauth = OAuth()

# Configure Google OAuth
google = oauth.remote_app(
    'google',
    consumer_key='YOUR_GOOGLE_CLIENT_ID',
    consumer_secret='YOUR_GOOGLE_CLIENT_SECRET',
    request_token_params={
        'scope': 'email',
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)

@google_bp.route('/login')
def login():
    return google.authorize(callback='http://localhost:5000/google/callback')

@google_bp.route('/callback')
def callback():
    response = google.authorized_response()
    if response is None or 'access_token' not in response:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )

    user_info = google.get('userinfo')
    return jsonify(user_info.data)

@google.tokengetter
def get_google_oauth_token():
    return session.get('google_token')

@google_bp.route('/logout')
def logout():
    session.pop('google_token')
    return redirect(url_for('index'))