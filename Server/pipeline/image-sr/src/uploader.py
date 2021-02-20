import re
import json
from error_handlers import exception_handler
from google.cloud import storage


def upload_image(source_file_name, url):
    bucket, object_path = re.findall("gs://(.*?)/(.*)", url)[0]
    upload_blob(bucket, source_file_name, object_path)


def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""

    storage_client = storage.Client.from_service_account_json(
        'service_account.json')
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(f"File {source_file_name} uploaded to {destination_blob_name}.")


if __name__ == "__main__":
    try:
        with open("data.json", "r") as f:
            list_data = json.load(f)
        print("JSON file parsed")
    except:
        exception_handler("Read JSON failed")

    if(len(list_data) == 0):
        print("No image to upload, exiting...")
        exit(0)

    try:
        for data in list_data:
            upload_image(data["enhanced_file"], data["output_file"])
        print("Image upload complete")
    except:
        exception_handler("Cannot establish connection to GCS")
