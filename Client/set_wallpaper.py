import requests
import os
import sys
import win32api, win32con, win32gui
import tkinter

def pnf(msg):
    print(msg)
    sys.stdout.flush()

url="https://singf.space/pixiv/select_paper.php"

def setWallpaper(path):
    key = win32api.RegOpenKeyEx(win32con.HKEY_CURRENT_USER,"Control Panel\\Desktop",0,win32con.KEY_SET_VALUE)
    win32gui.SystemParametersInfo(win32con.SPI_SETDESKWALLPAPER, path, 1+2)

pnf("Gathering machine information...")
# May not work for multiple monitor setups
root = tkinter.Tk()
width = root.winfo_screenwidth()
height = root.winfo_screenheight()

pnf("Fetching wallpaper...")
try:
    r = requests.post(url, data = {"ar":float(width)/float(height)})
except:
    pnf("Download failed, check your internet connection")
    input("Press any key to quit...")
    quit()

ext=r.headers["Content-Type"].split("/")[1]
output_file="wallpaper.{}".format(ext)

with open(output_file,"wb") as f:
    f.write(r.content)
    
pnf("Setting wallpaper...")
path = os.path.abspath(output_file)
setWallpaper(path)
