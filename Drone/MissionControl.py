from dronekit import Vehicle, LocationGlobalRelative, Command, CommandSequence, VehicleMode
from pymavlink import mavutil

from Drone.utils import get_distance_metres


class MissionControl:
    def __init__(self, vehicle: Vehicle):
        self.vehicle = vehicle
        self.download_mission()

    def download_mission(self):
        cmds = self.vehicle.commands
        cmds.download()
        cmds.wait_ready()

    def clear_mission(self) -> None:
        self.vehicle.commands.clear()
        self.upload_commands()

    def add_command(self, command: Command) -> None:
        self.vehicle.commands.add(command)

    def upload_commands(self) -> None:
        self.vehicle.commands.upload()

    def start_mission(self) -> str:
        self.vehicle.mode = VehicleMode("AUTO")
        return "Started mission"

    def get_mission_progress(self) -> float:
        num_waypoints = len(self.vehicle.commands)
        if num_waypoints == 0:
            return 1.0
        current_waypoint = self.vehicle.commands.next
        return current_waypoint / num_waypoints

    def get_distance_to_next_waypoint(self) -> None:
        next_waypoint = self.vehicle.commands.next
        if next_waypoint == 0:
            return None
        mission_item = self.vehicle.commands[next_waypoint - 1]
        lat = mission_item.x
        lon = mission_item.y
        alt = mission_item.z
        targetWaypointLocation = LocationGlobalRelative(lat, lon, alt)
        distance_to_point = get_distance_metres(self.vehicle.location.global_frame, targetWaypointLocation)
        return distance_to_point
