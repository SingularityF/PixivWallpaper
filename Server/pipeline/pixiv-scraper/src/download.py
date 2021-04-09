from pyvirtualdisplay import Display
import os
import sys
import json
import shutil
import glob
import time
import requests
import datetime
import cv2
from error_handlers import exception_handler
from google.cloud import storage
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile


def clear_dir(dir_name):
    files = glob.glob(dir_name + "/*")
    for f in files:
        os.remove(f)


def rm_cache(timestamp):
    date_latest = datetime.datetime.strptime(timestamp, '%m-%d-%Y')
    folders = [
        os.path.basename(f.path) for f in os.scandir(OUTPUT_BASE_DIR)
        if f.is_dir()
    ]
    for folder in folders:
        date = datetime.datetime.strptime(folder, '%m-%d-%Y')
        date_diff = date_latest - date
        if date_diff.days >= KEEP_DAYS:
            folder_path = Path(OUTPUT_BASE_DIR) / folder
            folder_path = str(folder_path.resolve())
            clear_dir(folder_path)
            os.rmdir(folder_path)


def process_thumb_prefix(thumb_urls):
    # Remove thumbnail placeholders
    thumb_urls = [url for url in thumb_urls if 'transparent' not in url]
    sample_thumb_url = thumb_urls[0]
    return sample_thumb_url.split('img-master')[0]


def large_img_url(url):
    processed_url = 'https://i.pximg.net/img-master' + \
        url.split('img-master')[1]
    return processed_url


def thumb_img_url(url, thumb_prefix):
    processed_url = thumb_prefix + 'img-master' + url.split('img-master')[1]
    return processed_url


def orig_img_url(url):
    substr2 = "img-master"
    substr3 = "_master1200"
    substr4 = ".jpg"
    x2 = url.find(substr2)
    x3 = url.find(substr3)
    x4 = url.find(substr4)
    newurl1 = url[:x2]+"img-original" + \
        url[x2+len(substr2):x3]+url[x3+len(substr3):]
    newurl2 = url[:x2]+"img-original" + \
        url[x2+len(substr2):x3]+url[x3+len(substr3):x4]+".png"
    newurl3 = url[:x2]+"img-original" + \
        url[x2+len(substr2):x3]+url[x3+len(substr3):x4]+".gif"
    return [newurl1, newurl2, newurl3]


def download_image(urls, all_cookies, img_name, referer, dir_name):
    """Try downloading from url, try backup url if fails
    Send request with cookies, referer and UA
    """
    headers = {
        'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
        'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
        'Accept-Encoding': 'none',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive',
        'Referer': referer
    }
    cookies = {}
    for s_cookie in all_cookies:
        cookies[s_cookie["name"]] = s_cookie["value"]
    for url in urls:
        try:
            response = requests.get(url,
                                    cookies=cookies,
                                    headers=headers,
                                    timeout=120)
        except:
            print("Failed to download image {} because conection timed out".
                  format(img_name))
            return ""
        ext = url.split(".")[-1]
        if response.status_code != 404:
            break
    output_name = img_name + "." + ext
    output_path = Path(dir_name) / output_name
    output_path = str(output_path.resolve())
    Path(output_path).parent.absolute().mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(response.content)
    return output_path


def load_and_retry(driver, url, retries):
    for _ in range(retries):
        try:
            driver.get(url)
        except:
            print("Web page failed to load, trying again")
            print(url)
            time.sleep(30)
            continue
        return
    print("Page load reached max retries, exiting")
    raise Exception('Page load failure')


def detect_safe_search_uri(uri):
    """Detects unsafe features in the file located in Google Cloud Storage or
    on the Web."""
    from google.cloud import vision
    client = vision.ImageAnnotatorClient.from_service_account_json(
        "service_account.json")
    image = vision.Image()
    image.source.image_uri = uri
    response = client.safe_search_detection(image=image)
    safe = response.safe_search_annotation
    # Names of likelihood from google.cloud.vision.enums
    likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE',
                       'LIKELY', 'VERY_LIKELY')
    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))
    return likelihood_name[safe.adult]


def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""

    storage_client = storage.Client.from_service_account_json(
        'service_account.json')
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(f"File {source_file_name} uploaded to {destination_blob_name}.")


if __name__ == '__main__':
    OUTPUT_BASE_DIR = "imgs"
    OUTPUT_CSV = "artwork_info.csv"
    URL_RANKING = "https://www.pixiv.net/ranking.php?mode=daily&content=illust"
    MAX_RETRIES = 3
    KEEP_DAYS = 7
    project_id = os.environ['GCP_PROJ']
    bucket_name = os.environ['DOWNLOAD_BUCKET_NAME']
    BUCKET_URL_PREFIX = f"https://storage.googleapis.com/{bucket_name}"
    json_data = []

    print("Initializing")
    try:
        display = Display(visible=0, size=(800, 600))
        display.start()

        firefox_profile = FirefoxProfile()
        firefox_profile.set_preference(
            'dom.ipc.plugins.enabled.libflashplayer.so', 'false')
        driver = webdriver.Firefox(firefox_profile)
        driver.set_page_load_timeout(90)
        driver.implicitly_wait(30)
    except:
        driver.quit()
        display.stop()
        exception_handler("Initialization failed")

    print("Loading Pixiv daily rankings")
    try:
        load_and_retry(driver, URL_RANKING, MAX_RETRIES)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
        page_title = driver.title
        # Slash not allowed in folder names
        timestamp = page_title.split(" ")[-1].replace('/', '-')
        print("Rankings loaded {}".format(timestamp))

        # ----- Prepare Output Path -----
        output_dir = Path('.') / OUTPUT_BASE_DIR / timestamp
        output_dir = str(output_dir.resolve())

        # ----- Detect Duplicate Download -----
        if os.path.exists(output_dir):
            # Is previous download successful?
            if os.path.exists("./data.json"):
                print("Already downloaded, exiting")
                exit(0)
            else:
                clear_dir(output_dir)
        else:
            Path(output_dir).mkdir(parents=True, exist_ok=True)
        # ----- Remove Old Image Cache -----
        rm_cache(timestamp)
    except:
        driver.quit()
        display.stop()
        exception_handler("Pixiv daily rankings failed to load")

    print("Download started")
    try:
        medium_urls = []
        illust_ids = []
        thumb_urls = []
        artworks = driver.find_elements_by_class_name("ranking-item")
        # Only get top 50
        artworks = artworks[:50]
        for artwork in artworks:
            illust_ids.append(artwork.get_attribute("data-id"))
            thumb_urls.append(artwork.find_element_by_class_name("_work").
                              find_element_by_class_name("_layout-thumbnail").
                              find_element_by_class_name("_thumbnail").
                              get_attribute("data-src"))
            medium_urls.append(
                artwork.find_element_by_class_name("_work").get_attribute(
                    "href"))
        thumb_prefix = process_thumb_prefix(thumb_urls)
        for i, url in enumerate(medium_urls):
            illustid = illust_ids[i]
            rank = i + 1
            thumb_url = thumb_urls[i]
            print("\nAnalyzing links of image ranking {}".format(rank))
            downloaded = True
            output_name_c = "compressed/{}_c".format(rank)
            output_name_t = "thumbnail/{}_t".format(rank)
            output_name_o = "original/{}_o".format(rank)
            print("Downloading image ranking {}".format(rank))
            compressed_path = download_image([large_img_url(thumb_url)],
                                             driver.get_cookies(), output_name_c,
                                             url, output_dir)
            upload_blob(bucket_name, compressed_path,
                        f"{timestamp}/compressed/{os.path.basename(compressed_path)}")
            thumbnail_path = download_image([thumb_url],
                                            driver.get_cookies(), output_name_t,
                                            url, output_dir)
            upload_blob(bucket_name, thumbnail_path,
                        f"{timestamp}/thumbnail/{os.path.basename(thumbnail_path)}")
            original_path = download_image(orig_img_url(large_img_url(thumb_url)),
                                           driver.get_cookies(), output_name_o,
                                           url, output_dir)
            upload_blob(bucket_name, original_path,
                        f"{timestamp}/original/{os.path.basename(original_path)}")
            compressed_shape = cv2.imread(compressed_path).shape
            thumbnail_shape = cv2.imread(thumbnail_path).shape
            original_shape = cv2.imread(original_path).shape
            compressed = f"{BUCKET_URL_PREFIX}/{timestamp}/compressed/{os.path.basename(compressed_path)}"
            thumbnail = f"{BUCKET_URL_PREFIX}/{timestamp}/thumbnail/{os.path.basename(thumbnail_path)}"
            original = f"{BUCKET_URL_PREFIX}/{timestamp}/original/{os.path.basename(original_path)}"
            json_data.append(
                {
                    "Rank": rank,
                    "IllustID": illustid,
                    "Compressed": compressed,
                    "CompressedHeight": compressed_shape[0],
                    "CompressedWidth": compressed_shape[1],
                    "Thumbnail": thumbnail,
                    "ThumbnailHeight": thumbnail_shape[0],
                    "ThumbnailWidth": thumbnail_shape[1],
                    "Original": original,
                    "OriginalHeight": original_shape[0],
                    "OriginalWidth": original_shape[1],
                    "Adult": detect_safe_search_uri(thumbnail),
                    "AspectRatio": original_shape[1]/original_shape[0],
                    "Downloaded": downloaded,
                    "Timestamp": timestamp
                })
        with open("data.json","w") as f:
            json.dump(json_data, f)
    except:
        driver.quit()
        display.stop()
        exception_handler("Download failed")
