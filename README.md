# PixivWallpaper
Set Windows wallpaper with daily Pixiv high ranking illustrations

## If you want to set your Windows wallpaper with Pixiv high rankers

Download the latest binary from ...

Double click and run it to download the latest Pixiv high ranking illustration that fits your screen size to the same folder and set that as your Windows wallpaper

## If you want to set up a server application that collects images from Pixiv daily rankings

1. Use the sql file as a template for the database that will be used to store images downloaded from Pixiv
2. Make sure the required packages are installed for php and python (try running the scripts), this includes but not limited to python virtual frame buffer, selenium & geckodriver, pandas, gd, pdo ...
3. Disable SELinux, Firewall, etc. to make sure the scripts will run correctly
4. Add database login information to the php scripts
5. Call download.py and upload.php from cron every day when the rankings refresh (https://www.pixiv.net/info.php?id=311)
