import os
import uuid

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or str(uuid.uuid4())
    REDIS_URL = os.environ.get("REDIS_URL") or ""
