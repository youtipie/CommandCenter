import pytest
from dronekit import connect
from socketio import Client

from Backend.app import create_app
from Backend.config import Config


@pytest.fixture
def app():
    config = Config()
    config.TESTING = True
    app = create_app(config)

    yield app


@pytest.fixture
def client(app):
    client = Client()
    client.connect("http://localhost:5000", wait_timeout=10)
    yield client
    client.disconnect()


@pytest.fixture(scope="session")
def sitl_instance():
    # sitl = dronekit_sitl.start_default()
    # connection_string = sitl.connection_string()
    # DOESN'T WORK WITH SITL!!!!
    vehicle = connect("tcp:127.0.0.1:5763", wait_ready=True)
    cmds = vehicle.commands
    cmds.download()
    cmds.wait_ready()
    yield vehicle
    # sitl.stop()
