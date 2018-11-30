# Server application setup guide

You can split the application into multiple parts handled by different servers or you can run all of the scripts in a single server. 

## Configure the pixiv server

This server will download illustrations from Pixiv and process the images then upload them into the database.

1. Disable SELinux, Firewall, etc. to make sure the scripts will run correctly
2. Install python3 and php (developed on php7)
3. Install extensions for php
  - PDO
  - GD
  - MySQL
4. Install packages for python3
  - selenium
  - pyvirtualdisplay
  - 
5. Add database login information to the php scripts
6. Call download.py and upload.php from cron every day when the rankings refresh (https://www.pixiv.net/info.php?id=311)
