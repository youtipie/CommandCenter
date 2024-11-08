import time

from pymavlink import mavutil

from Drone import Drone, create_command

vehicle = Drone('127.0.0.1:14550')

# for response in vehicle.take_off(10):
#     print(response)
#
# for response in vehicle.go_to(LocationGlobalRelative(-35.362093, 149.164726, 5)):
#     print(response)
#
# for response in vehicle.return_to_launch():
#     print(response)

commands_list = [
    create_command(mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, param7=10),
    create_command(mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, param5=-35.362093, param6=149.164726, param7=5),
    create_command(mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH)
]

vehicle.start_mission(commands_list)

while True:
    time.sleep(1)
    status = vehicle.get_status()
    for name, value in status.items():
        print(name, value)
    print("~" * 10)
    if vehicle.is_mission_finished():
        break

time.sleep(100000)
