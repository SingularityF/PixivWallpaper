## How to run

1. Install docker

2. Add database connection credentials to `upload_user.php`

3. Run the following commands

`docker build -t pixivwallpaper .`


`docker run -d -it --name PixivWallpaper pixivwallpaper`

4. In docker, run `refresh.sh`
