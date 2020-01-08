# Server application setup guide

The server side applications are mainly divided into three parts, namely database, pipeline and web services.

## Configure the database server

Use the `pixiv_db_schema.sql` file as a guide to create a new database. The RDBMS I'm using is MariaDB(MySQL). You should create two users, the two should have SELECT and INSERT privilege, used by `upload_user.php` and `paper_user.php` respectively.

## Configure the web services server

This server will handle the client requests and provide GUI for users.

For backend, just set up the server as a web server that runs php and add database login information to `paper_user.php`.

To provide GUI for users, you have to compile the angular project first, then copy the compiled files to where you want the URL to be. This application uses routing, so you may want to copy `.htaccess` file to where you placed the files if you're using apache. Also change the base-url in the compiled `index.html` if you're not using the root path.

Notice that some links are hardcoded to my domain, you will have to change them if you want to set up your version of user interface.

## Configure pipeline server

Follow the guides in the `pipeline` folder.
