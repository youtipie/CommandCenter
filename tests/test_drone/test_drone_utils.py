from dronekit import LocationGlobal, Command
from pymavlink import mavutil

from Drone.utils import get_distance_metres, check_is_drone_command_allowed, create_command

ALLOWED_COMMANDS = [16, 20, 21]


def test_get_distance_metres():
    location1 = LocationGlobal(35.0, 45.0, 10)
    location2 = LocationGlobal(35.001, 45.001, 20)

    distance = get_distance_metres(location1, location2)
    assert distance > 0
    assert isinstance(distance, float)


def test_get_distance_metres_same_location():
    location1 = LocationGlobal(35.0, 45.0, 10)
    location2 = LocationGlobal(35.0, 45.0, 10)

    distance = get_distance_metres(location1, location2)
    assert distance == 0


def test_check_is_drone_command_allowed():
    allowed_command = Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    disallowed_command = Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0)

    assert check_is_drone_command_allowed(allowed_command) is True
    assert check_is_drone_command_allowed(disallowed_command) is False


def test_create_command():
    command_id = mavutil.mavlink.MAV_CMD_NAV_WAYPOINT
    param1, param2, param3, param4 = 0, 1, 2, 3
    param5, param6, param7 = 4, 5, 6

    command = create_command(command_id, param1, param2, param3, param4, param5, param6, param7)
    assert command.command == command_id
    assert command.param1 == param1
    assert command.param2 == param2
    assert command.param3 == param3
    assert command.param4 == param4
    assert command.x == param5
    assert command.y == param6
    assert command.z == param7
