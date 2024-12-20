from unittest.mock import patch

import pytest


@pytest.fixture
def mock_data():
    yield "test_room", "test_connection"


def test_start_stream_status_no_drone(client, mock_data):
    room, connection_string = mock_data
    responses = []

    @client.on(f"drone_status_{room}")
    def handle_response(data):
        responses.append(data)

    client.emit("start_stream_status", {"room": room, "connection_string": connection_string})

    client.sleep(1)

    assert len(responses) > 0
    assert responses[0] == {
        "status": None,
        "ip": connection_string,
        "success": False,
    }


def test_stop_stream_status(client, mock_data):
    room, _ = mock_data

    responses = []

    def handle_response(data):
        responses.append(data)

    client.emit("stop_stream_status", {"room": room}, callback=handle_response)

    client.sleep(1)

    assert len(responses) > 0
    assert responses[0] == {
        "message": "You have stopped listening.",
        "room": room,
        "success": True,
    }
