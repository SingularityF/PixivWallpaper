#!/bin/bash
python3 download.py && php upload.php
kill `pgrep Xvfb`
kill `pgrep geckodriver`
