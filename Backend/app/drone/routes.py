from functools import wraps

from flask import request, session
from flask_socketio import emit, join_room, leave_room, rooms

from Drone import ALLOWED_COMMANDS, Drone, create_command
from . import bp
from .. import active_drones, socketio
from ..utils import with_validation, validate_cmd_list


def with_drone(func):
    @wraps(func)
    @with_validation({"connection_string": str})
    def wrapper(*args, **kwargs):
        connection_string = request.json["connection_string"]

        drone = active_drones.get(connection_string)
        if not drone:
            return {"message": "Cannot communicate with drone. Connect it first, using /connect route."}, 400
        return func(*args, drone=drone, **kwargs)

    return wrapper


@bp.route("/allowed_commands", methods=["GET"])
def get_allowed_commands():
    return ALLOWED_COMMANDS


@bp.route("/connect", methods=["POST"])
@with_validation({"connection_string": str})
def connect_drone():
    connection_string = request.json["connection_string"]

    try:
        drone = active_drones.get(connection_string)
        if not drone:
            drone = Drone(connection_string)
            active_drones[connection_string] = drone

        return {"message": "Connection successful"}, 200
    except Exception as e:
        print(e)
        return {"message": "Some error occurred while connecting to drone. "
                           "Check your connection string and try again later."}, 400


@bp.route("/disconnect", methods=["POST"])
@with_validation({"connection_string": str})
def disconnect():
    connection_string = request.json["connection_string"]

    if connection_string in active_drones:
        active_drones.get(connection_string).disconnect()
        del active_drones[connection_string]

    return {"message": f"Successfully disconnected."}, 200


@socketio.on("start_stream_status")
def on_join(data):
    room = data["room"]
    connection_string = data["connection_string"]
    join_room(room)
    session["is_active"] = True
    while session.get("is_active") and room in rooms(request.sid):
        try:
            drone = active_drones.get(connection_string)
            if not drone:
                emit(f"drone_status_{room}", {"status": None, "ip": connection_string, "success": False}, to=room)
                continue

            emit(f"drone_status_{room}", {
                "status": drone.get_status(),
                "ip": connection_string,
                "success": True
            }, to=room)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            socketio.sleep(1)
    leave_room(room)
    return {"message": "You have stopped listening.", "success": True}


@socketio.on("stop_stream_status")
def on_leave(data):
    room = data["room"]
    leave_room(room)
    return {"message": "You have stopped listening.", "room": room, "success": True}


@socketio.on("disconnect")
def disconnect():
    session["is_active"] = False
    return {"message", "Successfully left session"}


@bp.route("/start_mission", methods=["POST"])
@with_drone
def start_mission(drone: Drone):
    command_list = request.json.get("commands")
    is_valid, errors = validate_cmd_list(command_list)

    if not is_valid:
        return {"errors": errors}, 400

    commands = [create_command(**command) for command in command_list]
    return {"message": drone.start_mission(commands)}, 200


@bp.route("/takeoff", methods=["POST"])
@with_validation({"alt": float})
@with_drone
def takeoff(drone: Drone):
    alt = request.json["alt"]
    try:
        drone.take_off(alt)
        return {"message": "Command sent successfully."}, 200
    except Exception as e:
        print(e)
        return {"message": "Some error occurred, try again later."}, 500


@bp.route("/rtl", methods=["POST"])
@with_drone
def return_to_launch(drone: Drone):
    try:
        drone.return_to_launch()
        return {"message": "Command sent successfully."}, 200
    except Exception as e:
        print(e)
        return {"message": "Some error occurred, try again later."}, 500
