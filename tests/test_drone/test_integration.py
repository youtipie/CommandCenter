import pytest
import requests
from dronekit import Command
from pymavlink import mavutil

from Drone.GuidedControl import GuidedControl
from Drone.MissionControl import MissionControl
from Drone.utils import get_distance_metres


@pytest.mark.timeout(150)
def test_guided_control_take_off(sitl_instance):
    guided_control = GuidedControl(sitl_instance)
    target_altitude = 3

    guided_control.take_off(alt=target_altitude, wait_for=True)

    assert sitl_instance.location.global_relative_frame.alt >= target_altitude * 0.95


@pytest.mark.timeout(150)
def test_guided_control_rtl(sitl_instance):
    guided_control = GuidedControl(sitl_instance)

    guided_control.return_to_launch(wait_for=True)

    distance_to_home = get_distance_metres(
        sitl_instance.location.global_frame, sitl_instance.home_location
    )
    assert distance_to_home <= 2


@pytest.mark.timeout(300)
def test_start_and_complete_mission(sitl_instance):
    mission_control = MissionControl(sitl_instance)
    waypoint1 = Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
                        mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, 0, 0,
                        0, 0, 0, 0, 35.001, 45.001, 10)

    waypoint2 = Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
                        mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, 0, 0,
                        0, 0, 0, 0, 35.002, 45.002, 20)

    commands = [waypoint1, waypoint2]

    response = mission_control.start_mission(commands)
    assert response == "Started mission"

    assert sitl_instance.mode.name == "AUTO"
    assert sitl_instance.armed

    while not mission_control._MissionControl__is_mission_finished():
        status = mission_control.get_mission_status()
        print(f"Mission progress: {status['mission_progress']:.2f}")

    assert mission_control._MissionControl__is_mission_finished()


@pytest.mark.timeout(300)
def test_rtl_command(sitl_instance):
    mission_control = MissionControl(sitl_instance)
    rtl_command = Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
                          mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH, 0, 0,
                          0, 0, 0, 0, 0, 0, 0)

    mission_control.start_mission([rtl_command])

    assert sitl_instance.mode.name == "AUTO"
    assert sitl_instance.armed

    while not mission_control._MissionControl__is_mission_finished():
        status = mission_control.get_mission_status()
        print(f"Mission progress: {status['mission_progress']:.2f}")

    assert mission_control._MissionControl__is_mission_finished()


@pytest.mark.timeout(300)
def test_get_mission_status(sitl_instance):
    mission_control = MissionControl(sitl_instance)
    waypoint = Command(0, 0, 0, mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
                       mavutil.mavlink.MAV_CMD_NAV_WAYPOINT, 0, 0,
                       0, 0, 0, 0, 35.001, 45.001, 10)

    mission_control.start_mission([waypoint])

    status = mission_control.get_mission_status()
    assert status["have_mission"] is True
    assert status["mission_progress"] < 1
    assert status["is_mission_finished"] is False

    while not mission_control._MissionControl__is_mission_finished():
        pass

    status = mission_control.get_mission_status()
    assert status["mission_progress"] == 1
    assert status["is_mission_finished"] is True


def test_start_stream_status_with_active_drone(client, sitl_instance):
    room, connection_string = "room", "tcp:127.0.0.1:5762"
    requests.post("http://localhost:5000/drone/connect", json={"connection_string": connection_string})
    responses = []

    @client.on(f"drone_status_{room}")
    def handle_response(data):
        responses.append(data)

    client.emit("start_stream_status", {"room": room, "connection_string": connection_string})

    client.sleep(1)
    assert len(responses) > 0
    assert responses[0]["ip"] == connection_string
    assert responses[0]["success"]
