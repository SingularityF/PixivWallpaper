#!/bin/bash

set -e
set -a

echo "Loading environmental variables"
echo "===================="
. ./script_configs.sh
echo ""

echo "Running subscriber"
echo "===================="
python subscriber.py
echo ""

echo "Downloading images"
echo "===================="
python downloader.py
echo ""

echo "Running super-resolution model"
echo "===================="
python model.py
echo ""

echo "Uploading enhanced images to Cloud Storage"
echo "===================="
python uploader.py
echo ""

echo "Cleaning up workspace"
echo "===================="
rm -f data.json
rm -Rf ./imgs
echo ""