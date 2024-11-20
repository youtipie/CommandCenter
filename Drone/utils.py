import math

from dronekit import LocationGlobal, Command, LocationGlobalRelative
from pymavlink import mavutil

from Drone.allowed_commands import ALLOWED_COMMANDS


def get_distance_metres(location1: LocationGlobal, location2: LocationGlobal) -> float:
    d_lat = location2.lat - location1.lat
    d_long = location2.lon - location1.lon
    plain_distance = math.sqrt((d_lat * d_lat) + (d_long * d_long)) * 1.113195e5
    alt_diff = location2.alt - location1.alt
    return math.sqrt(plain_distance ** 2 + alt_diff ** 2)


def check_is_drone_command_allowed(command: Command) -> bool:
    return command.command in ALLOWED_COMMANDS


def create_command(command: int, param1: float = 0, param2: float = 0, param3: float = 0,
                   param4: float = 0, param5: float = 0, param6: float = 0, param7: float = 0) -> Command:
    return Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, command, 0, 0,
                   param1, param2, param3, param4, param5, param6, param7)
