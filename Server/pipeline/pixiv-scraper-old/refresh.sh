#!/bin/bash
gcsfuse --key-file /usr/local/PixivWallpaper/service_account.json image_cache ./images
python3 download.py
if [ $? -eq 0 ]
then
  echo "Download successful, continuing"
  kill `pgrep Xvfb`
  kill `pgrep geckodriver`
else
  echo "Download failed, exiting" >&2
  kill `pgrep Xvfb`
  kill `pgrep geckodriver`
  exit 1
fi
node data_upload/index.js
php upload.php
