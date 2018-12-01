# Server application setup guide

You can split the application into multiple parts handled by different servers or you can run all of the scripts and host database in a single server if you think that's powerful enough. The tasks are mainly divided into three parts, the database, the data processing and web services.

## Configure the database server

Use the `pixiv_db_schema.sql` file as a guide to create a new database. The RDBMS I'm using is MariaDB(MySQL). You should create two users, one has SELECT and INSERT privilege while the other has SELECT privilege, used by `upload_user.php` and `paper_user.php` respectively.

## Configure the data processing server

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

7. Call `download.py` and `upload.php` from `cron` every day when the rankings refresh (https://www.pixiv.net/info.php?id=311), remember to `cd` to the directory first

## Configure the web services server

This server will handle the client requests and provide GUI for users.

Scripts `paper_user.php`, `select_paper.php`, `pick_paper.php` are needed.

Just set up the server as a web server that runs php and add database login information to `paper_user.php`.
