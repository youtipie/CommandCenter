from unittest.mock import patch, MagicMock
from Backend.app.utils import validate_user_data, with_validation
from Backend.app.utils import validate_cmd_list
from pymavlink import mavutil


def test_validate_user_data():
    data = {"connection_string": "valid_string"}
    required_fields = {"connection_string": str}
    assert validate_user_data(data, required_fields) == True

    data = {}
    assert validate_user_data(data, required_fields) == (
        {"message": "Request body must be JSON and contain connection_string."}, 400)

    data = {"connection_string": 123}
    assert validate_user_data(data, required_fields) == ({"message": "Connection_string must be a non-empty str."}, 400)


def test_validate_cmd_list():
    cmd_list = [
        {"command": mavutil.mavlink.MAV_CMD_NAV_TAKEOFF},
        {"command": mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, "param1": 10},
        {"command": mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH}
    ]
    is_valid, errors = validate_cmd_list(cmd_list)
    assert is_valid is True
    assert errors == []

    is_valid, errors = validate_cmd_list([])
    assert is_valid is False
    assert errors == ["Command list cannot be empty."]

    cmd_list = [{"param1": 10}]
    is_valid, errors = validate_cmd_list(cmd_list)
    assert is_valid is False
    assert "Item at index 0 is missing mandatory key 'command'." in errors

    cmd_list = [{"command": "INVALID_COMMAND"}]
    is_valid, errors = validate_cmd_list(cmd_list)
    assert is_valid is False
    assert "Item at index 0 has command that is not allowed: INVALID_COMMAND." in errors

    cmd_list = [{"command": mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, "param1": "not_a_number"}]
    is_valid, errors = validate_cmd_list(cmd_list)
    assert is_valid is False
    assert "Item at index 0 has 'param1' that is not a float: not_a_number." in errors

    cmd_list = [{"command": mavutil.mavlink.MAV_CMD_NAV_WAYPOINT}]
    is_valid, errors = validate_cmd_list(cmd_list)
    assert is_valid is False
    assert "Command list must start with NAV_TAKEOFF command." in errors
    assert "Command list must end with NAV_RTL command." in errors
