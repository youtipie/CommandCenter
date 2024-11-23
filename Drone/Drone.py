import time
from typing import Optional, Iterable

from dronekit import connect, LocationGlobalRelative, Command, CommandSequence

from .GuidedControl import GuidedControl
from .MissionControl import MissionControl
from .utils import update_last_used


class Drone:
    def __init__(self, connection_string: str) -> None:
        self.vehicle = connect(connection_string, heartbeat_timeout=15, wait_ready=True)
        self.__guided_control = GuidedControl(self.vehicle)
        self.__mission_control = MissionControl(self.vehicle)
        self.last_used = time.time()

    def is_inactive(self, timeout: int) -> bool:
        return (time.time() - self.last_used) > timeout

    @update_last_used
    def take_off(self, alt: float = 100, wait_for: bool = False) -> None:
        return self.__guided_control.take_off(alt, wait_for)

    @update_last_used
    def return_to_launch(self, wait_for: bool = False) -> None:
        return self.__guided_control.return_to_launch(wait_for)

    @update_last_used
    def go_to(self, lat: float, lon: float, alt: float, airspeed: Optional[float] = None,
              groundspeed: Optional[float] = None, wait_for: bool = False) -> None:
        return self.__guided_control.go_to(LocationGlobalRelative(lat, lon, alt), airspeed, groundspeed, wait_for)

    @update_last_used
    def start_mission(self, commands: Iterable[Command]) -> str:
        self.take_off(3)
        return self.__mission_control.start_mission(commands)

    @update_last_used
    def get_status(self) -> dict:
        return {
            "location": {
                "lat": self.vehicle.location.global_frame.lat,
                "log": self.vehicle.location.global_frame.lon,
                "alt": self.vehicle.location.global_frame.alt,
                "relative_alt": self.vehicle.location.global_relative_frame.alt,
            },
            "attitude": {
                "yaw": self.vehicle.attitude.yaw,
                "roll": self.vehicle.attitude.roll,
                "pitch": self.vehicle.attitude.pitch
            },
            "gps": {
                "fix_type": self.vehicle.gps_0.fix_type,
                "satellites_visible": self.vehicle.gps_0.satellites_visible
            },
            "battery": {
                "voltage": self.vehicle.battery.voltage,
                "level": self.vehicle.battery.level
            },
            "ekf_ok": self.vehicle.ekf_ok,
            "last_heartbeat": self.vehicle.last_heartbeat,
            "home_location": {
                "lat": self.vehicle.home_location.lat,
                "log": self.vehicle.home_location.lon,
                "alt": self.vehicle.home_location.alt
            },
            "system_status": self.vehicle.system_status.state,
            "heading": self.vehicle.heading,
            "vertical_speed": -self.vehicle.velocity[-1],
            "groundspeed": self.vehicle.groundspeed,
            **self.__mission_control.get_mission_status(),
            **self.__guided_control.get_guided_status()
        }

    def disconnect(self) -> None:
        self.vehicle.close()
