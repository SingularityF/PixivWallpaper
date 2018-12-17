import requests
import os
import sys
import win32api, win32con, win32gui
import tkinter
from subprocess import call
from uuid import getnode

## Change this each time during compilation
version="1.2.1"

url="https://singf.space/pixiv/select_paper.php"

download_url="https://github.com/SingularityF/PixivWallpaper/releases/latest"

def check_update():
    try:
        r = requests.get(download_url)
    except:
        return (1,"")
    download_version=r.url.split("/")[-1]
    if download_version==version:
        return (0,"latest")
    else:
        return (0,"obsolete")


def pnf(msg):
    print(msg)
    sys.stdout.flush()

def set_wallpaper(path):
    key = win32api.RegOpenKeyEx(win32con.HKEY_CURRENT_USER,"Control Panel\\Desktop",0,win32con.KEY_SET_VALUE)
    win32gui.SystemParametersInfo(win32con.SPI_SETDESKWALLPAPER, path, 1+2)

def download_and_set(enlarge=False):
    pnf("Gathering machine information...")
    # May not work for multiple monitor setups
    root = tkinter.Tk()
    width = root.winfo_screenwidth()
    height = root.winfo_screenheight()
    root.destroy()
    
    pnf("Fetching wallpaper...")
    uuid=str(getnode())
    try:
        r = requests.post(url, data = {"ar":float(width)/float(height),
            "uuid":uuid,"version":version})
    except:
        return (1,"")
            
    ext=r.headers["Content-Type"].split("/")[1]
    output_file="wallpaper.{}".format(ext)
    
    with open(output_file,"wb") as f:
        f.write(r.content)

    if enlarge==True:
        pnf("Enlarging wallpaper...")
        path_waifu2x = os.path.abspath("waifu2x-caffe/waifu2x-caffe-cui.exe")
        path_input=os.path.abspath(output_file)
        path_output=os.path.abspath("wallpaper2x.{}".format(ext))
        call([path_waifu2x,"-i",path_input,"-o",path_output,"-p","cpu","-m","scale"])
        output_file="wallpaper2x.{}".format(ext)
        
    pnf("Setting wallpaper...")
    path = os.path.abspath(output_file)
    set_wallpaper(path)
    return (0,output_file)

def raise_connection_err():
    pnf("Download failed, check your internet connection")
    input("Press any key to quit...")
    quit()

if __name__ == "__main__":
    pnf("Checking client version...")
    status,msg=check_update()
    if status==1:
        raise_connection_err()
    else:
        if msg=="latest":
            pnf("Client up to date")
        else:
            pnf("New version available!")
    status,_=download_and_set()
    if status==1:
        raise_connection_err()
