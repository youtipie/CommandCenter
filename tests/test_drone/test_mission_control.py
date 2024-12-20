from unittest.mock import MagicMock, PropertyMock

import pytest
from dronekit import Command, VehicleMode
from pymavlink import mavutil

from Drone import create_command
from Drone.MissionControl import MissionControl


@pytest.fixture
def mission_control(mock_vehicle):
    return MissionControl(vehicle=mock_vehicle)


def test_download_mission(mock_vehicle, mission_control):
    mission_control._MissionControl__download_mission()
    mock_vehicle.commands.download.assert_called()
    mock_vehicle.commands.wait_ready.assert_called()


def test_clear_mission(mock_vehicle, mission_control):
    mission_control._MissionControl__clear_mission()
    mock_vehicle.commands.clear.assert_called_once()
    mock_vehicle.commands.upload.assert_called_once()


def test_add_command(mock_vehicle, mission_control):
    mock_command = MagicMock(spec=Command)
    mock_command.command = 16

    mission_control._MissionControl__add_command(mock_command)
    mock_vehicle.commands.add.assert_called_with(mock_command)


def test_start_mission(mock_vehicle, mission_control):
    mock_command = MagicMock(spec=Command)
    mock_command.command = 16
    mode_mock = PropertyMock(return_value=VehicleMode("STABILIZE"))
    type(mock_vehicle).mode = mode_mock

    commands = [mock_command]

    mission_control.start_mission(commands)

    mock_vehicle.commands.clear.assert_called_once()
    mock_vehicle.commands.add.assert_any_call(mock_command)
    mock_vehicle.commands.add.assert_any_call(
        create_command(mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH)
    )
    mock_vehicle.commands.upload.assert_called()
    mode_mock.assert_called_once_with("AUTO")


def test_get_mission_progress(mock_vehicle, mission_control):
    mock_vehicle.commands.__len__.return_value = 5
    mock_vehicle.commands.next = 2

    progress = mission_control._MissionControl__get_mission_progress()
    assert progress == 2 / 5


def test_is_mission_finished(mock_vehicle, mission_control):
    mock_vehicle.commands.__len__.return_value = 5
    mock_vehicle.commands.next = 5

    finished = mission_control._MissionControl__is_mission_finished()
    assert finished is True


def test_get_distance_to_next_waypoint(mock_vehicle, mission_control):
    mock_vehicle.commands.next = 1
    mock_waypoint = MagicMock(spec=Command)
    mock_waypoint.x, mock_waypoint.y, mock_waypoint.z = 36.0, 46.0, 10
    mock_waypoint.command = 16

    mock_vehicle.commands.__getitem__.return_value = mock_waypoint

    distance = mission_control._MissionControl__get_distance_to_next_waypoint()
    assert distance >= 0


def test_get_mission_status(mock_vehicle, mission_control):
    mock_vehicle.commands.__len__.return_value = 5
    mock_vehicle.commands.next = 2

    status = mission_control.get_mission_status()

    assert status == {
        "have_mission": True,
        "mission_progress": 2 / 5,
        "is_mission_finished": False,
        "distance_to_next_waypoint": mission_control._MissionControl__get_distance_to_next_waypoint(),
        "current_waypoint": 2,
        "waypoints": []
    }
