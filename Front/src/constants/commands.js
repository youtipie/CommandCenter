export default {
    16: {
        "description": "Navigate to the specified position",
        "name": "NAV_WAYPOINT",
        "param1": {
            "description": "Hold time at mission waypoint in integer seconds - MAX 65535 seconds.",
            "name": "Delay"
        },
        "param5": {
            "description": "Target latitude. If zero, the Copter will hold at the current latitude.",
            "name": "Lat"
        },
        "param6": {
            "description": "Target longitude. If zero, the Copter will hold at the current longitude.",
            "name": "Lon"
        },
        "param7": {
            "description": "Target altitude. If zero, the Copter will hold at the current altitude.",
            "name": "Alt"
        }
    },
    17: {
        "description": "Loiter at the specified location for an unlimited amount of time.",
        "name": "NAV_LOITER_UNLIM",
        "param5": {
            "description": "Target latitude. If zero, the vehicle will loiter at the current latitude",
            "name": "Lat"
        },
        "param6": {
            "description": "Target longitude. If zero, the vehicle will loiter at the current longitude",
            "name": "Lon"
        },
        "param7": {
            "description": "Target altitude. If zero, the vehicle will loiter at the current altitude",
            "name": "Alt"
        }
    },
    18: {
        "description": "Loiter (circle) the specified location for at least the specified number of complete turns, and then proceed to the next command upon intersection of the course to it with the circle’s perimeter. If zero is specified for a latitude/longitude/altitude parameter then the current location value for the parameter will be used. Fractional turns between 0 and 1 are supported, while turns greater than 1 must be integers.",
        "name": "NAV_LOITER_TURNS",
        "param1": {
            "description": "Number of turns (N x 360°)",
            "name": "Turns"
        },
        "param3": {
            "description": "Loiter radius around the waypoint. Units are in meters. Values over 255 will be rounded to units of 10 meters. and values greater than 2550 will be clamped to 2550 m. Negative values indicate counter-clockwise turns. If zero, vehicle will pirouette at location",
            "name": "Radius"
        },
        "param5": {
            "description": "Target latitude. If zero, the vehicle will loiter at the current latitude",
            "name": "Lat"
        },
        "param6": {
            "description": "Target longitude. If zero, the vehicle will loiter at the current longitude",
            "name": "Lon"
        },
        "param7": {
            "description": "Target altitude. If zero, the vehicle will loiter at the current altitude",
            "name": "Alt"
        }
    },
    19: {
        "description": "Fly/Drive to the specified location and then loiter there for the specified number of seconds — where loiter means “wait in place” (rather than “circle”). The timer starts when the waypoint is reached; when it expires the waypoint is complete. If zero is specified for a latitude/longitude/altitude parameter then the current location value for the parameter will be used.",
        "name": "NAV_LOITER_TIME",
        "param1": {
            "description": "Time to loiter at waypoint (seconds - decimal)",
            "name": "Time s"
        },
        "param5": {
            "description": "Target latitude. If zero, the vehicle will loiter at the current latitude",
            "name": "Lat"
        },
        "param6": {
            "description": "Target longitude. If zero, the vehicle will loiter at the current longitude",
            "name": "Lon"
        },
        "param7": {
            "description": "Target altitude. If zero, the vehicle will loiter at the current altitude",
            "name": "Alt"
        }
    },
    20: {
        "description": "Return to the home location or the nearest Rally Point, if closer. The home location is where the vehicle was last armed (or when it first gets GPS lock after arming if the vehicle configuration allows this).",
        "name": "NAV_RTL"
    },
    21: {
        "description": "The copter will land at its current location or proceed at current altitude to the lat/lon coordinates provided (if non-zero) and land. This is the mission equivalent of the LAND flight mode.",
        "name": "NAV_LAND",
        "param5": {
            "description": "Target latitude. If zero, the Copter will land at the current latitude.",
            "name": "Lat"
        },
        "param6": {
            "description": "Longitude",
            "name": "Lon"
        }
    },
    22: {
        "description": "Takeoff (either from the ground or by hand-launch). It should be the first command of nearly all Plane and Copter missions",
        "name": "NAV_TAKEOFF",
        "param7": {
            "description": "Altitude",
            "name": "Alt"
        }
    },
    82: {
        "description": "Fly to the target location using a Spline path, then wait (hover) for a specified time before proceeding to the next command.",
        "name": "NAV_SPLINE_WP",
        "param5": {
            "description": "Target latitude. If zero, the Copter will hold at the current latitude.",
            "name": "Lat"
        },
        "param6": {
            "description": "Target longitude. If zero, the Copter will hold at the current longitude.",
            "name": "Lon"
        },
        "param7": {
            "description": "Target altitude. If zero, the Copter will hold at the current altitude.",
            "name": "Alt"
        }
    },
    93: {
        "description": "After reaching this waypoint, delay the execution of the next mission command until either the time in seconds has elapsed or the time entered(in the future) is reached. Execution of the next mission item then occurs. For Copters, they will loiter until then, and Rovers hold position.",
        "name": "NAV_DELAY",
        "param1": {
            "description": "Delay in seconds (integer)",
            "name": "Time (sec)"
        },
        "param2": {
            "description": "Delay until this hour",
            "name": "Time hours(1-24)"
        },
        "param3": {
            "description": "Delay until this minute",
            "name": "Time minutes(0-59)"
        },
        "param4": {
            "description": "Delay until this second",
            "name": "Time seconds (0-59)"
        }
    },
    94: {
        "description": "After reaching this waypoint, the vehicle will descend up to the maximum descent value. If the payload has not touched the ground before this limit is reached, the vehicle will climb back up to the waypoint altitude and continue to the next mission item. If it reaches the ground, it will automatically release the gripper if enabled, and optionally wait a period, re-grip, and ascend back to the waypoint altitude and continue the mission. Numerous parameters that control the payload touch-down detection, wait period, etc. are prefaced with PLDP_.",
        "name": "NAV_PAYLOAD_PLACE",
        "param1": {
            "description": "meters",
            "name": "Maximum Descent"
        },
        "param5": {
            "description": "Latitude",
            "name": "Lat"
        },
        "param6": {
            "description": "Longitude",
            "name": "Long"
        },
        "param7": {
            "description": "Altitude",
            "name": "Alt"
        }
    },
    177: {
        "description": "Jump to the specified command in the mission list. The jump command can be repeated either a specified number of times before continuing the mission, or it can be repeated indefinitely.",
        "name": "DO_JUMP",
        "param1": {
            "description": "The command index/sequence number of the command to jump to",
            "name": "WP#"
        },
        "param2": {
            "description": "Number of times that the DO_JUMP command will execute before moving to the next sequential command. If the value is zero the next command will execute immediately. A value of -1 will cause the command to repeat indefinitely.",
            "name": "Repeat#"
        }
    },
    178: {
        "description": "Sets the desired maximum speed in meters/second (only). Both the speed-type and throttle settings are ignored.",
        "name": "DO_CHANGE_SPEED",
        "param1": {
            "description": "Speed type (0,1=Ground Speed, 2=Climb Speed, 3=Descent Speed).",
            "name": "Type"
        },
        "param2": {
            "description": "Target speed (m/s).",
            "name": "speed in m/s"
        }
    },
    201: {
        "description": "Points the camera gimbal at the “region of interest”, and also rotates the nose of the vehicle if the mount type does not support a yaw feature.",
        "name": "DO_SET_ROI",
        "param5": {
            "description": "Latitude (x) of the fixed ROI",
            "name": "Lat"
        },
        "param6": {
            "description": "Longitude (y) of the fixed ROI",
            "name": "Long"
        },
        "param7": {
            "description": "Altitude of the fixed ROI",
            "name": "Alt"
        }
    },
    203: {
        "description": "Trigger the camera shutter once. This command takes no additional arguments.",
        "name": "DO_DIGICAM_CONTROL",
        "param1": {
            "description": "Session control (on/off or show/hide lens): 0: Turn off the camera / hide the lens 1: Turn on the camera /Show the lens",
            "name": "On/Off"
        },
        "param4": {
            "description": "Focus Locking, Unlocking or Re-locking: 0: Ignore 1: Unlock 2: Lock",
            "name": "Focus Lock"
        },
        "param5": {
            "description": "Shooting Command. Any non-zero value triggers the camera.",
            "name": "Shutter Cmd"
        }
    },
    206: {
        "description": "Trigger the camera shutter at regular distance intervals. This command is useful in camera survey missions. To trigger the camera once, immediately after passing the DO command, set param3 to 1. Trigger immediately Parameter is available from ArduPilot 4.1 onwards.",
        "name": "DO_SET_CAM_TRIGG_DIST",
        "param1": {
            "description": "Camera trigger distance interval (meters). Zero to turn off distance triggering.",
            "name": "Dist (m)"
        },
        "param3": {
            "description": "Trigger once instantly. One is on, zero is off.",
            "name": "?"
        }
    },
    211: {
        "description": "Mission command to operate EPM gripper.",
        "name": "DO_GRIPPER",
        "param1": {
            "description": "Gripper number (from 1 to maximum number of grippers on the vehicle).",
            "name": "Gripper No"
        },
        "param2": {
            "description": "Gripper action: 0:Release 1:Grab",
            "name": "drop(0)/grab(1)"
        }
    }
};

export const notDisplayedCommands = [22, 20, 93, 177, 178, 203, 206, 211];