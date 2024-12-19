import threading
import time
from datetime import datetime

from flask import Flask
from typing import Dict

from flask_socketio import SocketIO

from Drone import Drone

socketio = SocketIO(async_mode=None)

active_drones: Dict[str, Drone] = {}

INACTIVITY_TIMEOUT = 300


def cleanup_inactive_drones():
    while True:
        time.sleep(5)
        inactive_drones = set(
            conn for conn, drone in active_drones.items()
            if drone.is_inactive(INACTIVITY_TIMEOUT)
        )
        for conn, drone in active_drones.items():
            monotonic_time = time.monotonic()
            if monotonic_time - drone.vehicle._heartbeat_lastreceived >= 5:
                inactive_drones.add(conn)
        for conn in inactive_drones:
            print(f"Closing inactive drone connection: {conn}")
            try:
                active_drones[conn].disconnect()
            except Exception as e:
                print(f"Error closing drone connection {conn}: {e}")
            del active_drones[conn]


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    socketio.init_app(app)

    from .drone import bp as drone_bp
    app.register_blueprint(drone_bp)

    cleanup_thread = threading.Thread(target=cleanup_inactive_drones, daemon=True)
    cleanup_thread.start()
    return app
