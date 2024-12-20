from unittest.mock import MagicMock

import pytest
from dronekit import Vehicle, LocationGlobalRelative


@pytest.fixture
def mock_vehicle():
    vehicle = MagicMock(spec=Vehicle)
    vehicle.is_armable = True
    vehicle.armed = False
    mock_vehicle.mode = MagicMock()
    vehicle.location.global_relative_frame.alt = 0
    vehicle.location.global_frame = MagicMock()
    vehicle.home_location = LocationGlobalRelative(35.0, 45.0, 0)

    vehicle.commands = MagicMock()
    vehicle.commands.next = 0
    vehicle.commands.__len__.return_value = 0
    vehicle.commands.download = MagicMock()
    vehicle.commands.wait_ready = MagicMock()
    vehicle.commands.clear = MagicMock()
    vehicle.commands.upload = MagicMock()
    vehicle.commands.add = MagicMock()
    return vehicle
