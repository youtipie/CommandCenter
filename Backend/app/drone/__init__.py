from flask import Blueprint

bp = Blueprint("drone", __name__, url_prefix="/drone")

from . import routes
