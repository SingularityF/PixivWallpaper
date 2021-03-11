## How to run

1. Copy service account json credential to this folder, rename to `service_account.json`

2. Edit `config_template.yaml`, rename as `config.yaml`

3. Install docker

4. Add database connection credentials to `upload_user.php`

5. Run the following commands

`docker build -t pixivwallpaper .`


`docker run -d -it --privileged --name pw pixivwallpaper`

6. Run `crontab -e` and add the line in file `cron`

7. Schedule task to start instance every hour at 5 minutes (in cron term, `5 * * * *`)
