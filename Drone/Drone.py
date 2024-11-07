import math
import time
from typing import Iterator, Optional

from dronekit import connect, VehicleMode, LocationGlobalRelative, LocationGlobal, Command

from Drone.GuidedControl import GuidedControl
from Drone.MissionControl import MissionControl


class Drone:
    def __init__(self, connection_string: str) -> None:
        self.vehicle = connect(connection_string, heartbeat_timeout=15, wait_ready=True)
        self.__guided_control = GuidedControl(self.vehicle)
        self.__mission_control = MissionControl(self.vehicle)

    def take_off(self, alt: float = 100) -> Iterator[str]:
        return self.__guided_control.take_off(alt)

    def return_to_launch(self) -> Iterator[str]:
        return self.__guided_control.return_to_launch()

    def go_to(self, location: LocationGlobalRelative, airspeed: Optional[float] = None,
              groundspeed: Optional[float] = None) -> Iterator[str]:
        return self.__guided_control.go_to(location, airspeed, groundspeed)

    def start_mission(self) -> str:
        for _ in self.take_off(3):
            pass
        return self.__mission_control.start_mission()

    def clear_mission(self) -> None:
        self.__mission_control.clear_mission()

    def add_command(self, command: Command) -> None:
        self.__mission_control.add_command(command)

    def upload_commands(self) -> None:
        self.__mission_control.upload_commands()

    def get_mission_progress(self) -> float:
        return self.__mission_control.get_mission_progress()

    def get_distance_to_next_waypoint(self) -> None:
        return self.__mission_control.get_distance_to_next_waypoint()

    def listen_for_attributes(self, attr_name, cb) -> None:
        self.vehicle.add_attribute_listener(attr_name, cb)

    def remove_listener(self, attr_name, cb) -> None:
        self.vehicle.remove_attribute_listener(attr_name, cb)

    def get_attributes(self) -> dict:
        return {
            "location": {
                "lat": self.vehicle.location.global_frame.lat,
                "log": self.vehicle.location.global_frame.lon,
                "alt": self.vehicle.location.global_frame.alt
            },
            "attitude": {
                "yaw": self.vehicle.attitude.yaw,
                "roll": self.vehicle.attitude.roll,
                "pitch": self.vehicle.attitude.pitch
            },
            "velocity": self.vehicle.velocity,
            "gps": self.vehicle.gps_0,
            "gimbal": self.vehicle.gimbal,
            "battery": self.vehicle.battery,
            "rangefinder": self.vehicle.rangefinder.distance,
            "ekf_ok": self.vehicle.ekf_ok,
            "last_heartbeat": self.vehicle.last_heartbeat,
            "home_location": self.vehicle.home_location,
            "system_status": self.vehicle.system_status.state,
            "heading": self.vehicle.heading,
            "is_armable": self.vehicle.is_armable,
            "airspeed": self.vehicle.airspeed,
            "groundspeed": self.vehicle.groundspeed,
            "armed": self.vehicle.armed,
            "mode": self.vehicle.mode.name
        }

    def disconnect(self) -> None:
        self.vehicle.close()
