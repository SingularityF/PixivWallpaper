#!/bin/bash
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
php upload.php
