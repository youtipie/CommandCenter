from flask import request
from pymavlink import mavutil
from functools import wraps
from typing import Tuple, Dict, List

from Drone import ALLOWED_COMMANDS


def validate_user_data(data, required_fields: Dict[str, type]) -> Tuple[Dict[str, str], int]:
    if not data:
        return {"message": f"Request body must be JSON and contain {', '.join(required_fields)}."}, 400

    for field, field_type in required_fields.items():
        if field not in data:
            return {"message": f"{field.capitalize()} is required."}, 400
        field_data = data[field]
        if not isinstance(field_data, field_type) or not str(field_data).strip():
            return {"message": f"{field.capitalize()} must be a non-empty {field_type.__name__}."}, 400

    return True


def with_validation(required_fields: Dict[str, type]):
    def inner(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            validation = validate_user_data(request.json, required_fields)
            if validation != True:
                return validation
            return func(*args, **kwargs)

        return wrapper

    return inner


def validate_cmd_list(cmd_list) -> Tuple[bool, List[str]]:
    errors = []
    if not cmd_list:
        return False, ["Command list cannot be empty."]

    for idx, item in enumerate(cmd_list):
        if not isinstance(item, dict):
            errors.append(f"Item at index {idx} is not a dictionary.")
            continue

        if "command" not in item:
            errors.append(f"Item at index {idx} is missing mandatory key 'command'.")
            continue
        if str(item["command"]) not in ALLOWED_COMMANDS:
            errors.append(f"Item at index {idx} has command that is not allowed: {item['command']}.")

        for param in [f"param{i}" for i in range(1, 8)]:
            if param in item and not isinstance(item[param], (float, int)):
                errors.append(f"Item at index {idx} has '{param}' that is not a float: {item[param]}.")

    if not (isinstance(cmd_list[0], dict) and cmd_list[0].get("command") == mavutil.mavlink.MAV_CMD_NAV_TAKEOFF):
        errors.append("Command list must start with NAV_TAKEOFF command.")
    if not (isinstance(cmd_list[-1], dict) and cmd_list[-1].get(
            "command") == mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH):
        errors.append("Command list must end with NAV_RTL command.")

    is_valid = len(errors) == 0
    return is_valid, errors
