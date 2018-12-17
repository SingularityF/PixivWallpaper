from uuid import getnode
import hashlib
import webbrowser
import tkinter as tk
import set_wallpaper
import time
import threading 

url="https://singf.space/pixiv/controls/ranking"

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


        self.get_btn=tk.Button(self,text="Get wallpaper",command=start_set_paper_thread)
        self.get_btn.grid(row=0,padx=10,pady=10)
        self.enlarge_btn=tk.Button(self,text="Enlarge wallpaper",command=start_enlarge_paper_thread)
        self.enlarge_btn.grid(row=1,padx=10,pady=10)
        #self.pick_btn=tk.Button(self,text="Pick wallpaper")
        #self.pick_btn.grid(row=2,padx=10,pady=10)
        self.update_btn=tk.Button(self,text="Check update",command=start_update_thread)
        self.update_btn.grid(row=3,padx=10,pady=10)

        self.output_text=tk.Text(self,width=50,height=25)
        self.output_text.grid(row=4,padx=10)
    
    def print_log(self,msg):
        self.output_text.insert("1.0",msg+"\n")


if __name__=="__main__":
    root=tk.Tk()
    app=Application(master=root)
    app.mainloop()

#uuid=str(getnode())
# Prevent trying random uuid, ensure the validity of uuid
# validate=hashlib.md5(uuid.encode("ascii")) 


# Request token from server

#webbrowser.open("{}?uuid={}&valid={}".format(url,uuid,validate.hexdigest()[:10]))
