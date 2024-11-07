import time

from dronekit import LocationGlobalRelative, Command
from pymavlink import mavutil

from Drone.Drone import Drone

vehicle = Drone('tcp:127.0.0.1:5763')
#
for response in vehicle.take_off(10):
    print(response)

for response in vehicle.go_to(LocationGlobalRelative(-35.362093, 149.164726, 5)):
    print(response)

for response in vehicle.return_to_launch():
    print(response)

# commands_list = [
#     Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0, 0, 0, 0, 0,
#             0, 0, 0, 10),
#     Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
#             0, 0, 0, 0, 0,
#             0, -35.362093, 149.164726, 5),
#     Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
#             mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH, 0, 0,
#             0, 0, 0,
#             0, 0, 0, 0)
# ]
#
# vehicle.clear_mission()
# for command in commands_list:
#     vehicle.add_command(command)
# vehicle.upload_commands()
# vehicle.start_mission()

time.sleep(100000)
