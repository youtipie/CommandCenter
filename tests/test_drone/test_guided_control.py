from unittest.mock import MagicMock, PropertyMock

import pytest
from dronekit import VehicleMode

from Drone.GuidedControl import GuidedControl


@pytest.fixture
def guided_control(mock_vehicle):
    return GuidedControl(vehicle=mock_vehicle)


def test_arm_if_not_armed(guided_control, mock_vehicle):
    mode_mock = PropertyMock(return_value=VehicleMode("AUTO"))
    type(mock_vehicle).mode = mode_mock

    guided_control._GuidedControl__arm_if_not_armed()

    mode_mock.assert_called_with(VehicleMode("GUIDED"))
    mock_vehicle.arm.assert_called_once()


def test_take_off(mock_vehicle, guided_control):
    mock_vehicle.arm = MagicMock()
    mock_vehicle.simple_takeoff = MagicMock()

    guided_control.take_off(alt=100, wait_for=False)

    mock_vehicle.arm.assert_called_once_with(wait=True, timeout=30)
    mock_vehicle.simple_takeoff.assert_called_once_with(100)

    assert guided_control._GuidedControl__next_waypoint.lat == 35.0
    assert guided_control._GuidedControl__next_waypoint.lon == 45.0
    assert guided_control._GuidedControl__next_waypoint.alt == 100


def test_return_to_launch(mock_vehicle, guided_control):
    mode_mock = PropertyMock(return_value=VehicleMode("AUTO"))
    type(mock_vehicle).mode = mode_mock
    guided_control.return_to_launch(wait_for=True)

    mode_mock.assert_called()

    assert guided_control._GuidedControl__next_waypoint.lat == 35.0
    assert guided_control._GuidedControl__next_waypoint.lon == 45.0
    assert guided_control._GuidedControl__next_waypoint.alt == 0
