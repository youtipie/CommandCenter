import time

from dronekit import connect

vehicle = connect('127.0.0.1:14550', wait_ready=True)

time.sleep(10000)
