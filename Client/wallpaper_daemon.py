import time
from datetime import datetime,timedelta,timezone
from dateutil import tz
from threading import Timer
import sys
import set_wallpaper

target_datetime=None
target_hour=5
timer_interval=60

def run_and_schedule():
    set_wallpaper.download_and_set()
    global target_datetime
    from_zone = tz.tzutc()
    # Check current time
    now=datetime.now(timezone.utc)
    if now.hour<target_hour:
        target_date=now
    else:
        target_date=now+timedelta(days=1)
    # Scheduled task time
    target_datetime=datetime.strptime("{}-{}-{} {}:00:00".format(target_date.year,
        target_date.month,target_date.day,target_hour),"%Y-%m-%d %H:%M:%S")
    target_datetime=target_datetime.replace(tzinfo=from_zone)
    Timer(timer_interval,check_time).start()

def check_time():
    if datetime.now(timezone.utc)>target_datetime:
        run_and_schedule()
    else:
        td=target_datetime-datetime.now(timezone.utc)
        print("{} seconds remaining".format(td.seconds),flush=True)
        Timer(timer_interval,check_time).start()

run_and_schedule()
