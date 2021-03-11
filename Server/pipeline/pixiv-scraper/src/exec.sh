#!/bin/bash

set -e
set -a

echo "Loading environmental variables"
echo "===================="
. ./script_configs.sh
echo ""

echo "Downloading images"
echo "===================="
python3 download.py
echo ""

echo "Uploading images to database"
echo "===================="
node data_upload/index.js
echo ""

echo "Cleaning up workspace"
echo "===================="
set +e
rm -Rf ./imgs
kill `pgrep Xvfb`
kill `pgrep geckodriver`
echo ""
