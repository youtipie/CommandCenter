import eventlet
from eventlet import wsgi

from app import create_app
from config import Config

app = create_app(Config)

if __name__ == "__main__":
    wsgi.server(eventlet.listen(("127.0.0.1", 5000)), app)
    # app.run(debug=True)
