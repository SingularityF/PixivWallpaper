## How to run

1. Mount cloud storage to `mount-location` with FUSE

2. Install docker

3. Add database connection credentials to `upload_user.php`

4. Run the following commands

`docker build -t pixivwallpaper .`


`docker run -d -it --mount type=bind,src=mount-location,target=/usr/local/PixivWallpaper/images --name pw pixivwallpaper`

5. Run `crontab -e` and add the line in file `cron`, replace `COMMAND_TO_MOUNT` with command in step 1

6. Schedule task to start instance every hour at 5 minutes (in cron term, `5 * * * *`)
