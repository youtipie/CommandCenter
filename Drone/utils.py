import math

from dronekit import LocationGlobal, Command
from pymavlink import mavutil

ALLOWED_COMMANDS = (
    mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
    mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
    mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH,
)


def get_distance_metres(location1: LocationGlobal, location2: LocationGlobal) -> float:
    d_lat = location2.lat - location1.lat
    d_long = location2.lon - location1.lon
    plain_distance = math.sqrt((d_lat * d_lat) + (d_long * d_long)) * 1.113195e5
    alt_diff = location2.alt - location1.alt
    return math.sqrt(plain_distance ** 2 + alt_diff ** 2)


def check_is_drone_command_allowed(command: Command) -> bool:
    return command.command in ALLOWED_COMMANDS
