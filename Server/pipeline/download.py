from pyvirtualdisplay import Display
import pandas as pd
import os
import sys
import glob
import time
import requests
import datetime
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile

# ========== Declare Constants ========== #

OUTPUT_BASE_DIR = "images"
OUTPUT_CSV = "artwork_info.csv"
URL_RANKING = "https://www.pixiv.net/ranking.php?mode=daily&content=illust"
BUCKET_URL_PREFIX = "https://storage.googleapis.com/image_cache"
MAX_RETRIES = 3
KEEP_DAYS = 7

# ========== Declare Global Variables ========== #

__error_flag__ = False

df_artworks = pd.DataFrame({
    "Rank": [],
    "IllustID": [],
    "Filename": [],
    "Thumbnail": [],
    "Original": [],
    "Downloaded": [],
    "TimeStamp": []
})


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
    return url


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
    with open(output_path, "wb") as f:
        f.write(response.content)
    return output_path


def load_and_retry(driver, url, retries):
    global __error_flag__
    for _ in range(retries):
        try:
            driver.get(url)
        except:
            print("Web page failed to load, trying again...")
            print(url)
            time.sleep(30)
            continue
        return
    print("Page load reached max retries, exiting...")
    __error_flag__ = True
    raise Exception('Page load failure')


if __name__ == '__main__':
    try:
        # ========== Initial Configurations ========== #

        # ----- Prepare Scraper -----
        print("Initializing...")
        display = Display(visible=0, size=(800, 600))
        display.start()

        firefox_profile = FirefoxProfile()
        # Disable CSS
        # firefox_profile.set_preference('permissions.default.stylesheet', 2)
        # Disable images
        # firefox_profile.set_preference('permissions.default.image', 2)
        # Disable Flash
        firefox_profile.set_preference(
            'dom.ipc.plugins.enabled.libflashplayer.so', 'false')
        driver = webdriver.Firefox(firefox_profile)
        driver.set_page_load_timeout(90)
        driver.implicitly_wait(30)

        print("Loading Pixiv daily rankings")
        load_and_retry(driver, URL_RANKING, MAX_RETRIES)
        page_title = driver.title
        # Slash not allowed in folder names
        timestamp = page_title.split(" ")[-1].replace('/', '-')
        print("Rankings loaded {}".format(timestamp))

        # ----- Prepare Output Path -----
        output_dir = Path('.') / OUTPUT_BASE_DIR / timestamp
        output_dir = str(output_dir.resolve())
        csv_path = Path(output_dir) / OUTPUT_CSV
        csv_path = str(csv_path.resolve())

        # ----- Detect Duplicate Download -----
        if os.path.exists(output_dir):
            # Is previous download successful?
            if os.path.exists(csv_path):
                print("Already downloaded, exiting ...")
                raise Exception('Illustration already downloaded')
            else:
                clear_dir(output_dir)
        else:
            os.makedirs(output_dir)
        # ----- Remove Old Image Cache -----
        rm_cache(timestamp)
        # ========== Begin Downloads ========== #
        medium_urls = []
        illust_ids = []
        thumb_urls = []
        artworks = driver.find_elements_by_class_name("ranking-item")
        for artwork in artworks:
            illust_ids.append(artwork.get_attribute("data-id"))
            thumb_urls.append(artwork.find_element_by_class_name("_work").
                    find_element_by_class_name("_layout-thumbnail").
                    find_element_by_class_name("_thumbnail").
                    get_attribute("src"))
            medium_urls.append(
                artwork.find_element_by_class_name("_work").get_attribute(
                    "href"))
        thumb_prefix = process_thumb_prefix(thumb_urls)
        for i, url in enumerate(medium_urls):
            illustid = illust_ids[i]
            rank = i + 1
            print("\nAnalyzing links of image ranking {}".format(rank))
            load_and_retry(driver, url, MAX_RETRIES)
            try:
                img_url = driver.find_element_by_css_selector(
                    "img[src*='pximg.net/img-master/img']").get_attribute(
                        "src")
                downloaded = True
            except:
                downloaded = False
                df_artworks = df_artworks.append(
                    {
                        "Rank": rank,
                        "IllustID": illustid,
                        "Filename": "",
                        "Thumbnail": "",
                        "Original": "",
                        "Downloaded": downloaded,
                        "TimeStamp": timestamp
                    },
                    ignore_index=True)
                print(
                    "Unable to download image ranking {} probably because of adult content"
                    .format(rank))
                # break
                continue
            output_name = "{}_d".format(rank)
            output_name_t = "{}_t".format(rank)
            output_name_l = "{}_l".format(rank)
            print("Downloading image ranking {}".format(rank))
            filename_path = download_image([large_img_url(img_url)],
                    driver.get_cookies(), output_name,
                    driver.current_url, output_dir)
            thumbnail_path = download_image([thumb_img_url(img_url, thumb_prefix)],
                    driver.get_cookies(), output_name_t,
                    driver.current_url, output_dir)
            original_path = download_image(orig_img_url(img_url),
                    driver.get_cookies(), output_name_l,
                    driver.current_url, output_dir)
            filename = f"{BUCKET_URL_PREFIX}/{timestamp}/{os.path.basename(filename_path)}"
            thumbnail = f"{BUCKET_URL_PREFIX}/{timestamp}/{os.path.basename(thumbnail_path)}"
            original = f"{BUCKET_URL_PREFIX}/{timestamp}/{os.path.basename(original_path)}"
            df_artworks = df_artworks.append(
                {
                    "Rank": rank,
                    "IllustID": illustid,
                    "Filename": filename,
                    "Thumbnail": thumbnail,
                    "Original": original,
                    "Downloaded": downloaded,
                    "TimeStamp": timestamp
                },
                ignore_index=True)
        df_artworks.to_csv(csv_path, index=False)
        with open('csv_path', 'w') as f:
            f.write(csv_path)
    finally:
        print("Running Garbage Collection")
        driver.quit()
        display.stop()
        if __error_flag__:
            sys.exit(1)