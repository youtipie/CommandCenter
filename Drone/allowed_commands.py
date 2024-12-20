from pymavlink import mavutil

ALLOWED_COMMANDS = {
    mavutil.mavlink.MAV_CMD_NAV_TAKEOFF: {
        "name": "NAV_TAKEOFF",
        "description": "Takeoff (either from the ground or by hand-launch). It should be the first command of nearly all Plane and Copter missions",
        "param7": {
            "name": "Alt",
            "description": "Altitude"
        }
    },
    mavutil.mavlink.MAV_CMD_NAV_WAYPOINT: {
        "name": "NAV_WAYPOINT",
        "description": "Navigate to the specified position",
        "param1": {
            "name": "Delay",
            "description": "Hold time at mission waypoint in integer seconds - MAX 65535 seconds."
        },
        "param5": {
            "name": "Lat",
            "description": "Target latitude. If zero, the Copter will hold at the current latitude."
        },
        "param6": {
            "name": "Lon",
            "description": "Target longitude. If zero, the Copter will hold at the current longitude."
        },
        "param7": {
            "name": "Alt",
            "description": "Target altitude. If zero, the Copter will hold at the current altitude."
        }
    },
    mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH: {
        "name": "NAV_RTL",
        "description": "Return to the home location or the nearest Rally Point, if closer. The home location is where the vehicle was last armed (or when it first gets GPS lock after arming if the vehicle configuration allows this).",
    },
    mavutil.mavlink.MAV_CMD_NAV_SPLINE_WAYPOINT: {
        "name": "NAV_SPLINE_WP",
        "description": "Fly to the target location using a Spline path, then wait (hover) for a specified time before proceeding to the next command.",
        "param5": {
            "name": "Lat",
            "description": "Target latitude. If zero, the Copter will hold at the current latitude."
        },
        "param6": {
            "name": "Lon",
            "description": "Target longitude. If zero, the Copter will hold at the current longitude."
        },
        "param7": {
            "name": "Alt",
            "description": "Target altitude. If zero, the Copter will hold at the current altitude."
        }
    },
    mavutil.mavlink.MAV_CMD_NAV_LOITER_TURNS: {
        "name": "NAV_LOITER_TURNS",
        "description": "Loiter (circle) the specified location for at least the specified number of complete turns, and then proceed to the next command upon intersection of the course to it with the circle’s perimeter. If zero is specified for a latitude/longitude/altitude parameter then the current location value for the parameter will be used. Fractional turns between 0 and 1 are supported, while turns greater than 1 must be integers.",
        "param1": {
            "name": "Turns",
            "description": "Number of turns (N x 360°)"
        },
        "param3": {
            "name": "Radius",
            "description": "Loiter radius around the waypoint. Units are in meters. Values over 255 will be rounded to units of 10 meters. and values greater than 2550 will be clamped to 2550 m. Negative values indicate counter-clockwise turns. If zero, vehicle will pirouette at location"
        },
        "param5": {
            "name": "Lat",
            "description": "Target latitude. If zero, the vehicle will loiter at the current latitude"
        },
        "param6": {
            "name": "Lon",
            "description": "Target longitude. If zero, the vehicle will loiter at the current longitude"
        },
        "param7": {
            "name": "Alt",
            "description": "Target altitude. If zero, the vehicle will loiter at the current altitude"
        }
    },
    mavutil.mavlink.MAV_CMD_NAV_LOITER_UNLIM: {
        "name": "NAV_LOITER_UNLIM",
        "description": "Loiter at the specified location for an unlimited amount of time.",
        "param3": {
            "name": "Radius",
            "description": "Loiter radius around the waypoint. Units are in meters. Values over 255 will be rounded to units of 10 meters. and values greater than 2550 will be clamped to 2550 m. Negative values indicate counter-clockwise turns. If zero, vehicle will pirouette at location"
        },
        "param5": {
            "name": "Lat",
            "description": "Target latitude. If zero, the vehicle will loiter at the current latitude"
        },
        "param6": {
            "name": "Lon",
            "description": "Target longitude. If zero, the vehicle will loiter at the current longitude"
        },
        "param7": {
            "name": "Alt",
            "description": "Target altitude. If zero, the vehicle will loiter at the current altitude"
        }
    },
    mavutil.mavlink.MAV_CMD_NAV_LOITER_TIME: {
        "name": "NAV_LOITER_TIME",
        "description": "Fly/Drive to the specified location and then loiter there for the specified number of seconds — where loiter means “wait in place” (rather than “circle”). The timer starts when the waypoint is reached; when it expires the waypoint is complete. If zero is specified for a latitude/longitude/altitude parameter then the current location value for the parameter will be used.",
        "param1": {
            "name": "Time s",
            "description": "Time to loiter at waypoint (seconds - decimal)"
        },
        "param3": {
            "name": "Radius",
            "description": "Loiter radius around the waypoint. Units are in meters. Values over 255 will be rounded to units of 10 meters. and values greater than 2550 will be clamped to 2550 m. Negative values indicate counter-clockwise turns. If zero, vehicle will pirouette at location"
        },
        "param5": {
            "name": "Lat",
            "description": "Target latitude. If zero, the vehicle will loiter at the current latitude"
        },
        "param6": {
            "name": "Lon",
            "description": "Target longitude. If zero, the vehicle will loiter at the current longitude"
        },
        "param7": {
            "name": "Alt",
            "description": "Target altitude. If zero, the vehicle will loiter at the current altitude"
        }
    },
    mavutil.mavlink.MAV_CMD_NAV_LAND: {
        "name": "NAV_LAND",
        "description": "The copter will land at its current location or proceed at current altitude to the lat/lon coordinates provided (if non-zero) and land. This is the mission equivalent of the LAND flight mode.",
        "param5": {
            "name": "Lat",
            "description": "Target latitude. If zero, the Copter will land at the current latitude."
        },
        "param6": {
            "name": "Lon",
            "description": "Longitude"
        },
    },
    mavutil.mavlink.MAV_CMD_NAV_DELAY: {
        "name": "NAV_DELAY",
        "description": "After reaching this waypoint, delay the execution of the next mission command until either the time in seconds has elapsed or the time entered(in the future) is reached. Execution of the next mission item then occurs. For Copters, they will loiter until then, and Rovers hold position.",
        "param1": {
            "name": "Time (sec)",
            "description": "Delay in seconds (integer)"
        },
        "param2": {
            "name": "Time in hours(1-24)",
            "description": "Delay until this hour"
        },
        "param3": {
            "name": "Time in minutes(0-59)",
            "description": "Delay until this minute"
        },
        "param4": {
            "name": "Time in seconds (0-59)",
            "description": "Delay until this second"
        },
    },
    mavutil.mavlink.MAV_CMD_NAV_PAYLOAD_PLACE: {
        "name": "NAV_PAYLOAD_PLACE",
        "description": "After reaching this waypoint, the vehicle will descend up to the maximum descent value. If the payload has not touched the ground before this limit is reached, the vehicle will climb back up to the waypoint altitude and continue to the next mission item. If it reaches the ground, it will automatically release the gripper if enabled, and optionally wait a period, re-grip, and ascend back to the waypoint altitude and continue the mission. Numerous parameters that control the payload touch-down detection, wait period, etc. are prefaced with PLDP_.",
        "param1": {
            "name": "Maximum Descent",
            "description": "meters"
        },
        "param5": {
            "name": "Lat",
            "description": "Latitude"
        },
        "param6": {
            "name": "Long",
            "description": "Longitude"
        },
        "param7": {
            "name": "Alt",
            "description": "Altitude"
        }
    },
    mavutil.mavlink.MAV_CMD_DO_SET_ROI: {
        "name": "DO_SET_ROI",
        "description": "Points the camera gimbal at the “region of interest”, and also rotates the nose of the vehicle if the mount type does not support a yaw feature.",
        "param5": {
            "name": "Lat",
            "description": "Latitude (x) of the fixed ROI"
        },
        "param6": {
            "name": "Long",
            "description": "Longitude (y) of the fixed ROI"
        },
        "param7": {
            "name": "Alt",
            "description": "Altitude of the fixed ROI"
        }
    },
    mavutil.mavlink.MAV_CMD_DO_JUMP: {
        "name": "DO_JUMP",
        "description": "Jump to the specified command in the mission list. The jump command can be repeated either a specified number of times before continuing the mission, or it can be repeated indefinitely.",
        "param1": {
            "name": "WP#",
            "description": "The command index/sequence number of the command to jump to"
        },
        "param2": {
            "name": "Repeat#",
            "description": "Number of times that the DO_JUMP command will execute before moving to the next sequential command. If the value is zero the next command will execute immediately. A value of -1 will cause the command to repeat indefinitely."
        },
    },
    mavutil.mavlink.MAV_CMD_DO_CHANGE_SPEED: {
        "name": "DO_CHANGE_SPEED",
        "description": "Sets the desired maximum speed in meters/second (only). Both the speed-type and throttle settings are ignored.",
        "param1": {
            "name": "Type",
            "description": "Speed type (0,1=Ground Speed, 2=Climb Speed, 3=Descent Speed)."
        },
        "param2": {
            "name": "speed in m/s",
            "description": "Target speed (m/s)."
        },
    },
    mavutil.mavlink.MAV_CMD_DO_SET_CAM_TRIGG_DIST: {
        "name": "DO_SET_CAM_TRIGG_DIST",
        "description": "Trigger the camera shutter at regular distance intervals. This command is useful in camera survey missions. To trigger the camera once, immediately after passing the DO command, set param3 to 1. Trigger immediately Parameter is available from ArduPilot 4.1 onwards.",
        "param1": {
            "name": "Dist (m)",
            "description": "Camera trigger distance interval (meters). Zero to turn off distance triggering."
        },
        "param3": {
            "name": "?",
            "description": "Trigger once instantly. One is on, zero is off."
        },
    },
    mavutil.mavlink.MAV_CMD_DO_DIGICAM_CONTROL: {
        "name": "DO_DIGICAM_CONTROL",
        "description": "Trigger the camera shutter once. This command takes no additional arguments.",
        "param1": {
            "name": "On/Off",
            "description": "Session control (on/off or show/hide lens): 0: Turn off the camera / hide the lens 1: Turn on the camera /Show the lens"
        },
        "param4": {
            "name": "Focus Lock",
            "description": "Focus Locking, Unlocking or Re-locking: 0: Ignore 1: Unlock 2: Lock"
        },
        "param5": {
            "name": "Shutter Cmd",
            "description": "Shooting Command. Any non-zero value triggers the camera."
        },
    },
    mavutil.mavlink.MAV_CMD_DO_GRIPPER: {
        "name": "DO_GRIPPER",
        "description": "Mission command to operate EPM gripper.",
        "param1": {
            "name": "Gripper No",
            "description": "Gripper number (from 1 to maximum number of grippers on the vehicle)."
        },
        "param2": {
            "name": "drop(0)/grab(1)",
            "description": "Gripper action: 0:Release 1:Grab"
        },
    },
}

ALLOWED_COMMANDS = {str(key): value for key, value in ALLOWED_COMMANDS.items()}
