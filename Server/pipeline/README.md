## How to run

1. Copy service account json credential to this folder, rename to `service_account.json`

2. Install docker

3. Add database connection credentials to `upload_user.php`

4. Run the following commands

`docker build -t pixivwallpaper .`


`docker run -d -it --privileged --name pw pixivwallpaper`

5. Run `crontab -e` and add the line in file `cron`

6. Schedule task to start instance every hour at 5 minutes (in cron term, `5 * * * *`)
