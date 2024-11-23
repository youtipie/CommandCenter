from typing import Iterable

from dronekit import Vehicle, LocationGlobalRelative, Command, CommandSequence, VehicleMode
from pymavlink import mavutil

from .utils import get_distance_metres, check_is_drone_command_allowed, create_command


class MissionControl:
    def __init__(self, vehicle: Vehicle):
        self.vehicle = vehicle
        self.__download_mission()

    def __download_mission(self) -> None:
        cmds = self.vehicle.commands
        cmds.download()
        cmds.wait_ready()

    def __clear_mission(self) -> None:
        self.vehicle.commands.clear()
        self.__upload_commands()

    def __add_command(self, command: Command) -> None:
        if not check_is_drone_command_allowed(command):
            raise ValueError("Command not allowed.")
        self.vehicle.commands.add(command)

    def __upload_commands(self) -> None:
        self.vehicle.commands.upload()

    def start_mission(self, commands: Iterable[Command]) -> str:
        self.__clear_mission()
        for command in commands:
            self.__add_command(command)

        # Adding dummy command, so we can track when mission is finished
        self.__add_command(create_command(mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH))
        self.__upload_commands()
        self.vehicle.mode = VehicleMode("AUTO")
        return "Started mission"

    def __get_mission_progress(self) -> float:
        num_waypoints = len(self.vehicle.commands)
        if num_waypoints == 0:
            return 1
        current_waypoint = self.vehicle.commands.next
        if not self.vehicle.armed and self.vehicle.mode.name == "AUTO" and current_waypoint == 1:
            return 1
        return current_waypoint / num_waypoints

    def __is_mission_finished(self) -> bool:
        return self.__get_mission_progress() == 1

    def __get_distance_to_next_waypoint(self) -> float:
        next_waypoint = self.vehicle.commands.next
        if next_waypoint == 0:
            return None
        mission_item = self.vehicle.commands[next_waypoint - 1]
        lat = mission_item.x
        lon = mission_item.y
        alt = mission_item.z

        is_exceptional_case = False
        if mission_item.command == mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH:
            lat = self.vehicle.home_location.lat
            lon = self.vehicle.home_location.lon
            alt = 0
            is_exceptional_case = True

        # TODO: SOME COMMANDS MAY HAVE 0, 0, 0 AS XYZ. HANDLE IT
        # Temporary fix
        if not is_exceptional_case:
            if lat == 0:
                lat = self.vehicle.location.global_relative_frame.lat
            if lon == 0:
                lon = self.vehicle.location.global_relative_frame.lon
            if alt == 0:
                alt = self.vehicle.location.global_relative_frame.alt

        targetWaypointLocation = LocationGlobalRelative(lat, lon, alt)
        distance_to_point = get_distance_metres(self.vehicle.location.global_relative_frame, targetWaypointLocation)
        return distance_to_point

    def get_mission_status(self) -> dict:
        return {
            "have_mission": len(self.vehicle.commands) > 0,
            "mission_progress": self.__get_mission_progress(),
            "is_mission_finished": self.__is_mission_finished(),
            "distance_to_next_waypoint": self.__get_distance_to_next_waypoint(),
            "current_waypoint": self.vehicle.commands.next,
            "waypoints": [{
                **dict((name, getattr(command, name)) for name in command.fieldnames)
            } for command in self.vehicle.commands]
        }
