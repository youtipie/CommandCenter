import time
from typing import Optional

from dronekit import VehicleMode, Vehicle, LocationGlobalRelative

from Drone.utils import get_distance_metres


class GuidedControl:
    def __init__(self, vehicle: Vehicle):
        self.vehicle = vehicle
        self.next_waypoint: Optional[LocationGlobalRelative] = None

    def __arm_if_not_armed(self) -> None:
        if self.vehicle.armed and self.vehicle.mode.name == "GUIDED":
            return

        timeout = time.time() + 60
        while not self.vehicle.is_armable:
            if time.time() > timeout:
                break
            time.sleep(1)

        try:
            self.vehicle.mode = VehicleMode("GUIDED")
            self.vehicle.arm(wait=True, timeout=30)

        except TimeoutError as e:
            print(e)

    def take_off(self, alt: float = 100, wait_for: bool = False):
        self.__arm_if_not_armed()
        self.next_waypoint = LocationGlobalRelative(
            self.vehicle.home_location.lat, self.vehicle.home_location.lon, alt
        )
        self.vehicle.simple_takeoff(alt)

        if wait_for:
            while True:
                if self.vehicle.location.global_relative_frame.alt >= alt * 0.95:
                    break

    def return_to_launch(self, wait_for: bool = False) -> None:
        try:
            self.vehicle.mode = VehicleMode("RTL")
            self.next_waypoint = LocationGlobalRelative(
                self.vehicle.home_location.lat, self.vehicle.home_location.lot, 0
            )
            if wait_for:
                while 1 < get_distance_metres(self.vehicle.location.global_frame, self.vehicle.home_location):
                    time.sleep(1)
        except Exception as e:
            print(e)

    def go_to(self, location: LocationGlobalRelative, airspeed: Optional[float] = None,
              groundspeed: Optional[float] = None, wait_for: bool = False) -> None:
        self.__arm_if_not_armed()
        self.next_waypoint = location
        self.vehicle.simple_goto(location, airspeed, groundspeed)
        if wait_for:
            while 5 < get_distance_metres(self.vehicle.location.global_relative_frame, location):
                time.sleep(1)

    def get_distance_to_next_waypoint(self) -> float:
        if not self.next_waypoint:
            return 0

        distance_to_point = get_distance_metres(self.vehicle.location.global_relative_frame, self.next_waypoint)
        return distance_to_point

    def get_guided_status(self) -> dict:
        distance_to_next_waypoint = self.get_distance_to_next_waypoint()
        return {
            "distance_to_guided_waypoint": distance_to_next_waypoint
        } if distance_to_next_waypoint else {}

    # TODO: Add another commands in guided mode control
