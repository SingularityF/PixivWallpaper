import requests
from bs4 import BeautifulSoup

URL_RANKING = "https://www.pixiv.net/ranking.php?mode=daily&content=illust"

try:
    res = requests.get(URL_RANKING, timeout = 90, headers={"Accept-Language": "en-US"})
    soup = BeautifulSoup(res.text,"html.parser")
    page_title = soup.find('title').getText()
    timestamp = page_title.split(" ")[-1].replace('/', '-')
    response = timestamp
except Exception as e:
    response = "An error occurred"
    print(e)

print(response)
