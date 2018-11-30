# Server application setup guide

You can split the application into multiple parts handled by different servers or you can run all of the scripts in a single server if you think that's powerful enough. 

## Configure the database server

Use the `pixiv_db_schema.sql` file as a guide to create a new database. The RDBMS I'm using is MariaDB(MySQL). You should create two users, one has SELECT and INSERT privilege while the other has SELECT privilege, used by `upload_user.php` and `paper_user.php` respectively.

## Configure the pixiv server

This server will download illustrations from Pixiv and process the images then upload them into the database.

Scripts `download.py`, `gradient.php`, `upload.php`, `upload_user.php` will be needed for this server.

1. Disable SELinux, Firewall, etc. to make sure the scripts will run correctly

2. Install python3 and php (developed on php7)

3. Install extensions for php

    - `PDO`
    - `GD`
    - `MySQL`
  
4. Install packages for python3

    - `selenium`
    - `pyvirtualdisplay`
    - `pandas`
    - `requests`
    
5. Make sure your server has `Xvfb` and `geckodriver` installed, don't forget to update your Firefox as well to be compatible with the installed `geckodriver`
  
6. Add database login information to `upload_user.php`

7. Call `download.py` and `upload.php` from cron every day when the rankings refresh (https://www.pixiv.net/info.php?id=311), remember to `cd` to the directory first
