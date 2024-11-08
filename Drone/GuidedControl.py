import time
from typing import Iterator, Optional

from dronekit import VehicleMode, Vehicle, LocationGlobalRelative

from Drone.utils import get_distance_metres


class GuidedControl:
    def __init__(self, vehicle: Vehicle):
        self.vehicle = vehicle

    def __arm_if_not_armed(self) -> Iterator[str]:
        timeout = time.time() + 60
        while not self.vehicle.is_armable:
            if time.time() > timeout:
                yield "Vehicle is not armable"
                break
            yield "Vehicle is not armable, retrying..."
            time.sleep(1)

        try:
            self.vehicle.mode = VehicleMode("GUIDED")
            yield "Arming vehicle..."
            self.vehicle.arm(wait=True, timeout=30)
            yield "Vehicle armed."

        except TimeoutError as e:
            print(e)
            yield "Some error occurred while arming the vehicle."

    def take_off(self, alt: float = 100) -> Iterator[str]:
        for msg in self.__arm_if_not_armed():
            yield msg

        yield "Taking off..."
        self.vehicle.simple_takeoff(alt)

        while True:
            if self.vehicle.location.global_relative_frame.alt >= alt * 0.95:
                yield "Reached target altitude."
                break

    def return_to_launch(self) -> Iterator[str]:
        try:
            self.vehicle.mode = VehicleMode("RTL")
            yield "Returning to launch..."
            while 1 < get_distance_metres(self.vehicle.location.global_frame, self.vehicle.home_location):
                time.sleep(1)
            yield "Arrived at launch point."
        except Exception as e:
            print(e)
            yield "Something went wrong..."

    def go_to(self, location: LocationGlobalRelative, airspeed: Optional[float] = None,
              groundspeed: Optional[float] = None) -> Iterator[str]:
        self.vehicle.simple_goto(location, airspeed, groundspeed)
        yield f"Going to location: {location}"
        while 5 < get_distance_metres(self.vehicle.location.global_relative_frame, location):
            time.sleep(1)
        yield "Reached target location"

    # TODO: Add another commands in guided mode control
