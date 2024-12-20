import time
from typing import Iterable

from dronekit import connect, Command, LocationGlobal

from .GuidedControl import GuidedControl
from .MissionControl import MissionControl
from .utils import update_last_used, get_distance_metres


class Drone:
    def __init__(self, connection_string: str) -> None:
        self.vehicle = connect(connection_string, heartbeat_timeout=5, wait_ready=True)
        self.__guided_control = GuidedControl(self.vehicle)
        self.__mission_control = MissionControl(self.vehicle)
        self.last_used = time.time()

    def get_link_quality(self):
        loss_percentage = 0
        try:
            mav_stats = self.vehicle._handler.master.mav
            total_packets_received = mav_stats.total_packets_received
            total_receive_errors = mav_stats.total_receive_errors
            not_lost_packets = total_packets_received
            lost_packets = total_receive_errors
            total_packets = not_lost_packets + lost_packets

            loss_percentage = (not_lost_packets / total_packets) * 100
        except AttributeError as e:
            print(f"Error accessing MAVLink stats: {e}")
            return None
        except Exception as e:
            print(f"Error getting packet stats: {e}")
            return None
        finally:
            return loss_percentage

    def is_inactive(self, timeout: int) -> bool:
        return (time.time() - self.last_used) > timeout

    @update_last_used
    def take_off(self, alt: float = 100, wait_for: bool = False) -> None:
        return self.__guided_control.take_off(alt, wait_for)

    @update_last_used
    def return_to_launch(self, wait_for: bool = False) -> None:
        return self.__guided_control.return_to_launch(wait_for)

    @update_last_used
    def start_mission(self, commands: Iterable[Command]) -> str:
        self.take_off(3)
        return self.__mission_control.start_mission(commands)

    @update_last_used
    def get_status(self) -> dict:
        dist_to_home = get_distance_metres(
            LocationGlobal(self.vehicle.location.global_frame.lat, self.vehicle.location.global_frame.lon,
                           self.vehicle.location.global_frame.alt),
            LocationGlobal(self.vehicle.home_location.lat, self.vehicle.home_location.lon,
                           self.vehicle.home_location.alt))
        return {
            "location": {
                "lat": self.vehicle.location.global_frame.lat,
                "lon": self.vehicle.location.global_frame.lon,
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
            "dist_to_home": dist_to_home,
            "system_status": self.vehicle.system_status.state,
            "heading": self.vehicle.heading,
            "vertical_speed": -self.vehicle.velocity[-1],
            "mode": self.vehicle.mode.name,
            "groundspeed": self.vehicle.groundspeed,
            "link_quality": self.get_link_quality(),
            **self.__mission_control.get_mission_status(),
        }

    def disconnect(self) -> None:
        self.vehicle.close()
