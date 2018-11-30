from pyvirtualdisplay import Display
import pandas as pd
import os
import glob
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

dir_name="images"
df_artworks=pd.DataFrame({"Rank":[],"IllustID":[],"Filename":[],"Downloaded":[]})
display=Display(visible=0,size=(800,600))
display.start()

driver=webdriver.Firefox()
driver.get("https://www.pixiv.net/ranking.php?mode=daily&content=illust")

def prepare_dir(dir_name):
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
    else:
        files=glob.glob(dir_name+"/*")
        for f in files:
            os.remove(f)

def large_img_url(url):
    substr="c/600x600/"
    x=url.find(substr)
    newurl=url[:x]+url[x+len(substr):]
    return newurl

def download_image(url,all_cookies,img_name,referer):
    headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
             'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
             'Accept-Encoding': 'none',
             'Accept-Language': 'en-US,en;q=0.8',
             'Connection': 'keep-alive',
             'Referer': referer}
    cookies = {}  
    for s_cookie in all_cookies:
        cookies[s_cookie["name"]]=s_cookie["value"]
    response=requests.get(url,cookies=cookies,headers=headers)
    with open(dir_name+"/"+img_name,"wb") as f:
        f.write(response.content)

prepare_dir(dir_name)
  
medium_urls=[]
illust_ids=[]
artworks=driver.find_elements_by_class_name("ranking-item")

for artwork in artworks:
    illust_ids.append(artwork.get_attribute("data-id"))
    medium_urls.append(artwork.find_element_by_class_name("_work").get_attribute("href"))

for i,url in enumerate(medium_urls):
    driver.get(url)
    illustid=illust_ids[i]
    rank=i+1
    print("Downloading image ranking {}".format(rank))
    try:
        img_url=driver.find_element_by_class_name("_work").find_element_by_tag_name("img").get_attribute("src")
        downloaded=True
    except:
        downloaded=False
        df_artworks=df_artworks.append({"Rank":rank,"IllustID":illustid,"Filename":"","Downloaded":downloaded},ignore_index=True)
        print("Unable to download image ranking {}".format(rank))
        continue
    output_name="{}_d.{}".format(rank,img_url.split(".")[-1])
    download_image(large_img_url(img_url),driver.get_cookies(),output_name,driver.current_url)
    df_artworks=df_artworks.append({"Rank":rank,"IllustID":illustid,"Filename":output_name,"Downloaded":downloaded},ignore_index=True)

driver.quit()

display.stop()

df_artworks.to_csv("artwork_info.csv",index=False)
