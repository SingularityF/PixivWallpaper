import sys
import traceback


def exception_handler(error_msg):
    print(error_msg, file=sys.stderr)
    traceback.print_exc()
    exit(1)
