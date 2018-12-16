from uuid import getnode
import hashlib
import webbrowser

url="https://singf.space/pixiv/pick_paper.php"

uuid=str(getnode())
# Prevent trying random uuid, ensure the validity of uuid
validate=hashlib.md5(uuid.encode("ascii")) 

webbrowser.open("{}?uuid={}&valid={}".format(url,uuid,validate.hexdigest()[:10]))