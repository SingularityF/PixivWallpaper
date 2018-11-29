import requests
import os
import sys
import win32api, win32con, win32gui
import tkinter

def setWallpaper(path):
    key = win32api.RegOpenKeyEx(win32con.HKEY_CURRENT_USER,"Control Panel\\Desktop",0,win32con.KEY_SET_VALUE)
    win32gui.SystemParametersInfo(win32con.SPI_SETDESKWALLPAPER, path, 1+2)

# May not work for multiple monitor setups
root = tkinter.Tk()
width = root.winfo_screenwidth()
height = root.winfo_screenheight()

url="http://ga.singf.space/pixiv/select_paper.php"

r = requests.post(url, data = {"ar":float(width)/float(height)})

with open("wallpaper.jpg","wb") as f:
    f.write(r.content)

ext=r.headers["Content-Type"].split("/")[1]
    
path = os.path.abspath("wallpaper."+ext)
setWallpaper(path)