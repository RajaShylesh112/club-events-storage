import requests
import os

class BackblazeService:
    def __init__(self):
        self.api_url = "https://api.backblazeb2.com/b2api/v2/"
        self.account_id = os.getenv("B2_ACCOUNT_ID")
        self.application_key = os.getenv("B2_APPLICATION_KEY")
        self.bucket_name = os.getenv("B2_BUCKET_NAME")
        self.auth_token = None
        self.bucket_id = None

    def authenticate(self):
        response = requests.post(
            f"{self.api_url}b2_authorize_account",
            auth=(self.account_id, self.application_key)
        )
        response_data = response.json()
        self.auth_token = response_data['authorizationToken']
        self.bucket_id = self.get_bucket_id()

    def get_bucket_id(self):
        headers = {
            "Authorization": self.auth_token
        }
        response = requests.get(f"{self.api_url}b2_list_buckets", headers=headers)
        buckets = response.json()['buckets']
        for bucket in buckets:
            if bucket['bucketName'] == self.bucket_name:
                return bucket['bucketId']
        return None

    def upload_file(self, file_name, file_path):
        upload_url_response = requests.post(
            f"{self.api_url}b2_get_upload_url",
            headers={"Authorization": self.auth_token},
            json={"bucketId": self.bucket_id}
        )
        upload_url = upload_url_response.json()['uploadUrl']
        upload_auth_token = upload_url_response.json()['authorizationToken']

        with open(file_path, 'rb') as file:
            response = requests.post(
                upload_url,
                headers={
                    "Authorization": upload_auth_token,
                    "Content-Type": "application/octet-stream",
                    "X-Bz-File-Name": file_name,
                    "X-Bz-Content-Sha1": self.calculate_sha1(file)
                },
                data=file
            )
        return response.json()

    def calculate_sha1(self, file):
        import hashlib
        sha1 = hashlib.sha1()
        while chunk := file.read(8192):
            sha1.update(chunk)
        file.seek(0)  # Reset file pointer
        return sha1.hexdigest()

    def download_file(self, file_name):
        # Implementation for downloading a file from Backblaze
        pass

    def delete_file(self, file_name):
        # Implementation for deleting a file from Backblaze
        pass

    # Additional methods for file management can be added here.