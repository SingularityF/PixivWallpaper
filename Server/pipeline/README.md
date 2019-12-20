## How to run

1. Mount cloud storage to `mount-location` with FUSE

2. Install docker

3. Add database connection credentials to `upload_user.php`

4. Run the following commands

`docker build -t pixivwallpaper .`


`docker run -d -it --mount type=bind,src=mount-location,target=/usr/local/PixivWallpaper/images --name pw pixivwallpaper`

5. Run `crontab -e` and add the line in file `cron`
