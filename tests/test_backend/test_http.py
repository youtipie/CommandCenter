from unittest.mock import patch, MagicMock

import pytest

from Drone import ALLOWED_COMMANDS


@pytest.fixture
def client(app):
    client = app.test_client()
    app.app_context().push()
    return client


@pytest.fixture()
def connection_string():
    return "tcp:127.0.0.1:5763"


@pytest.fixture()
def commands():
    return [
        {
            "command": 22,
            "param7": 10
        },
        {
            "command": 20
        }
    ]


def test_get_allowed_commands(client):
    response = client.get("/drone/allowed_commands")
    assert response.status_code == 200
    assert response.json == ALLOWED_COMMANDS


@patch("Backend.app.drone.routes.Drone")
@patch("Backend.app.active_drones", {})
def test_connect_drone(mock_drone, client, connection_string):
    response = client.post("/drone/connect", json={"connection_string": connection_string})
    mock_drone.assert_called_with(connection_string)
    assert response.status_code == 200
    assert response.json["message"] == "Connection successful"


@patch("Backend.app.drone.routes.Drone")
@patch("Backend.app.active_drones", {})
def test_disconnect_drone(mock_drone, client, connection_string):
    client.post("/drone/connect", json={"connection_string": connection_string})

    response = client.post("/drone/disconnect", json={"connection_string": connection_string})
    assert response.status_code == 200
    assert response.json["message"] == "Successfully disconnected."


@patch("Backend.app.drone.routes.Drone")
@patch("Backend.app.active_drones", {})
def test_start_mission(mock_drone, client, connection_string, commands):
    drone_instance = mock_drone.return_value
    drone_instance.start_mission.return_value = "Mission started successfully."

    client.post("/drone/connect", json={"connection_string": connection_string})
    response = client.post("/drone/start_mission", json={"connection_string": connection_string, "commands": commands})

    assert mock_drone.start_mission.called_with(commands=commands)
    assert response.status_code == 200
    assert response.json["message"] == "Mission started successfully."


@patch("Backend.app.drone.routes.Drone")
@patch("Backend.app.active_drones", {})
def test_takeoff(mock_drone, client, connection_string):
    alt = 10.0
    client.post("/drone/connect", json={"connection_string": connection_string})

    response = client.post("/drone/takeoff", json={"connection_string": connection_string, "alt": alt})

    assert mock_drone.take_off.called_with(alt=alt, wait_ready=False)
    assert response.status_code == 200
    assert response.json["message"] == "Command sent successfully."


@patch("Backend.app.drone.routes.Drone")
@patch("Backend.app.active_drones", {})
def test_return_to_launch(mock_drone, client, connection_string):
    client.post("/drone/connect", json={"connection_string": connection_string})

    response = client.post("/drone/rtl", json={"connection_string": connection_string})

    assert mock_drone.return_to_launch.called_once()
    assert response.status_code == 200
    assert response.json["message"] == "Command sent successfully."
