from uuid import getnode
import hashlib
import webbrowser
import tkinter as tk
import set_wallpaper
import time
import threading 
import os
import subprocess
import win32com.client
import win32pdhutil
from threading import Timer
import psutil

url="https://singf.space/pixiv/controls/ranking"

def launch_picker():
    uuid=str(getnode())
    webbrowser.open("{}/{}".format(url,uuid))

class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.pack()
        self.create_widgets()
        master.geometry("500x500")
        master.iconbitmap("icon.ico")
        master.title("PixivWallpaper")
        #master.config(bg="#f8f8f9")

    def create_widgets(self):
        def set_paper_callback():
            self.print_log("Getting wallpaper...\n")
            status,_=set_wallpaper.download_and_set()
            if status==1:
                self.print_log("Download failed, check your internet connection")
            if status==0:
                self.print_log("Wallpaper was set successfully")
        
        def start_set_paper_thread():
            set_paper_thread=threading.Thread(target=set_paper_callback)
            set_paper_thread.start()

        def enlarge_paper_callback():
            self.print_log("Getting and enlarging wallpaper, may take a minute or so based on your cpu...\n")
            status,_=set_wallpaper.download_and_set(enlarge=True)
            if status==1:
                self.print_log("Download failed, check your internet connection")
            if status==0:
                self.print_log("Wallpaper was set successfully")

        def start_enlarge_paper_thread():
            enlarge_paper_thread=threading.Thread(target=enlarge_paper_callback)
            enlarge_paper_thread.start()
        
        def update_callback():
            self.print_log("Checking for updates...\n")
            status,msg=set_wallpaper.check_update()
            if status==1:
                self.print_log("Download failed, check your internet connection")
            if status==0:
                if msg=="latest":
                    self.print_log("You're running the latest client")
                else:
                    self.print_log("New version available! Download from here:\n{}".format(set_wallpaper.download_url))

        def start_update_thread():
            update_thread=threading.Thread(target=update_callback)
            update_thread.start()

        def add_startup():
            self.print_log("Adding daemon to startup...\nYour wallpaper will now refresh automatically when the system boots or when the ranking updates\nPlease do this each time you move or update the application\n")
            path_loc=os.path.expandvars(r"%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup")
            path_loc = os.path.join(path_loc, "wallpaper_daemon.lnk")
            path_target = os.path.abspath("wallpaper_daemon.exe")
            path_icon = os.path.abspath("icon.ico")
            
            shell = win32com.client.Dispatch("WScript.Shell")
            shortcut = shell.CreateShortCut(path_loc)
            shortcut.Targetpath = path_target
            shortcut.IconLocation = path_icon
            shortcut.WindowStyle = 7 # 7 - Minimized, 3 - Maximized, 1 - Normal
            shortcut.WorkingDirectory= os.path.abspath("")
            shortcut.save()
            subprocess.Popen("explorer /select,{}".format(path_loc))

        def check_daemon():
            status=1
            for proc in psutil.process_iter():
                if "wallpaper_daemon" in proc.name():
                    status=0
                    break
            if status==0:
                self.daemon_label.config(text="Daemon running",fg="green")
            else:
                self.daemon_label.config(text="Daemon not running",fg="red")
            return status

        def switch_daemon():
            status=check_daemon()
            if status==0:
                self.print_log("Stopping daemon...\nTo prevent daemon from running automatically, press Add to startup and delete the shortcut\n")
                os.system("taskkill /F /im wallpaper_daemon.exe")
                self.daemon_label.config(text="Daemon not running",fg="red")
            else:
                self.print_log("Running daemon...\nYour wallpaper will now refresh automatically\nTo make daemon run automatically, press Add to startup\n")
                subprocess.Popen([os.path.abspath("wallpaper_daemon.exe")],stdin=None,stdout=None,stderr=None)
                self.daemon_label.config(text="Daemon running",fg="green")

        self.get_btn=tk.Button(self,text="Get wallpaper",command=start_set_paper_thread)
        self.get_btn.grid(row=0,column=0,padx=10,pady=10)
        self.enlarge_btn=tk.Button(self,text="Enlarge wallpaper",command=start_enlarge_paper_thread)
        self.enlarge_btn.grid(row=1,column=0,padx=10,pady=10)
        self.pick_btn=tk.Button(self,text="Pick wallpaper",command=launch_picker)
        self.pick_btn.grid(row=2,column=0,padx=10,pady=10)
        #self.update_btn=tk.Button(self,text="Check update",command=start_update_thread)
        #self.update_btn.grid(row=0,column=1,padx=10,pady=10)
        self.startup_btn=tk.Button(self,text="Add to startup",command=add_startup)
        self.startup_btn.grid(row=0,column=1,padx=10,pady=10)
        self.daemon_label=tk.Label(self)
        self.daemon_label.grid(row=1,column=1,padx=10,pady=10)
        self.daemon_btn=tk.Button(self,text="Start/Stop daemon",command=switch_daemon)
        self.daemon_btn.grid(row=2,column=1,padx=10,pady=10)
        self.output_text=tk.Text(self,width=62,height=25)
        self.output_text.grid(row=50,columnspan=2)

        update_callback()
        check_daemon()
    
    def print_log(self,msg):
        self.output_text.insert("1.0",msg+"\n")


if __name__=="__main__":
    root=tk.Tk()
    app=Application(master=root)
    app.mainloop()
