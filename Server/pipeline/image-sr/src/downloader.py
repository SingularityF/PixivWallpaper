import uuid
import re
import json
from pathlib import Path
from error_handlers import exception_handler
from google.cloud import storage


def download_image(url):
    bucket, object_path = re.findall("gs://(.*?)/(.*)", url)[0]
    ext = object_path.split(".")[-1]
    save_path = f"./imgs/{uuid.uuid4()}.{ext}"
    download_blob(bucket, object_path, save_path)
    return save_path


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client.from_service_account_json(
        'service_account.json')
    bucket = storage_client.bucket(bucket_name)

    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print("Blob {} downloaded to {}.".format(
        source_blob_name, destination_file_name))


if __name__ == "__main__":
    try:
        with open("data.json", "r") as f:
            list_data = json.load(f)
        print("JSON file parsed")
    except:
        exception_handler("Read JSON failed")

    if(len(list_data) == 0):
        print("No image to process, exiting...")
        exit(0)

    try:
        Path("./imgs").mkdir(parents=True, exist_ok=True)
        list_new_data = []
        for data in list_data:
            save_path = download_image(data["input_file"])
            list_new_data.append({**data, "saved_file": save_path})
        print("Images downloaded")
    except:
        exception_handler("Image download failed")

    try:
        with open('data.json', 'w') as f:
            json.dump(list_new_data, f)
        print("JSON overwritten")
    except:
        exception_handler("Overwriting JSON failed")
