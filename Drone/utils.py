import math
from functools import wraps
from typing import Callable, Iterator

from dronekit import LocationGlobal


# def yield_responses(func: Callable) -> Callable:
#     @wraps(func)
#     def wrapper(self, *args, **kwargs) -> Iterator[str]:
#         for response in func(self, *args, **kwargs):
#             yield response
#
#     return wrapper


def get_distance_metres(location1: LocationGlobal, location2: LocationGlobal) -> float:
    d_lat = location2.lat - location1.lat
    d_long = location2.lon - location1.lon
    plain_distance = math.sqrt((d_lat * d_lat) + (d_long * d_long)) * 1.113195e5
    alt_diff = location2.alt - location1.alt
    return math.sqrt(plain_distance ** 2 + alt_diff ** 2)
