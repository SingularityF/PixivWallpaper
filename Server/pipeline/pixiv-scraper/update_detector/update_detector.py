import requests
from bs4 import BeautifulSoup
import googleapiclient.discovery
import traceback
import json
import os

URL_RANKING = "https://www.pixiv.net/ranking.php?mode=daily&content=illust"
API_URL = os.getenv("API_URL")
PROJECT = os.getenv("PROJECT")
ZONE = os.getenv("ZONE")
INSTANCE_NAME = os.getenv("INSTANCE_NAME")


def get_pipeline_timestamp():
    res = requests.get(API_URL, timeout=90)
    json_res = res.json()
    timestamp = json_res['latest']
    return timestamp


def get_pixiv_timestamp():
    res = requests.get(URL_RANKING, timeout=90, headers={
                       "Accept-Language": "en-US"})
    soup = BeautifulSoup(res.text, "html.parser")
    page_title = soup.find('title').getText()
    timestamp = page_title.split(" ")[-1].replace('/', '-')
    return timestamp


def start_instance():
    compute = googleapiclient.discovery.build(
        'compute', 'v1', cache_discovery=False)
    command = compute.instances().start(
        project=PROJECT, zone=ZONE, instance=INSTANCE_NAME)
    json_res = json.dumps(command.execute())
    return(json_res)


def main(request):
    try:
        latest_timestamp = get_pipeline_timestamp()
        pixiv_timestamp = get_pixiv_timestamp()
        if pixiv_timestamp == latest_timestamp:
            print("No update detected")
        else:
            print("Update detected")
            start_instance()
        return "Success"
    except Exception as e:
        print(e)
        print(traceback.print_exc())
        return str(e)


if __name__ == "__main__":
    print(main(""))