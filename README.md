## Command Center App

### Description

This is both backend and frontend part of mobile app called **Command Center**.

### Usage

To use the app you have to start SITL first following next instructions:

- **Running SITL**. Start sitl with ```dronekit-sitl copter``` command. You can specify different parameters like home
  location or vehicle: ```dronekit-sitl plane-3.3.0 --home=-35.363261,149.165230,584,353```. Or you can run SITL [by
  yourself](https://ardupilot.org/dev/docs/setting-up-sitl-on-linux.html#setting-up-sitl-on-linux) with ```sim_vehicle.py -v copter```

> **_NOTE_**. There are a number of other useful arguments:
> ```dronekit-sitl -h            #List all parameters to dronekit-sitl.
> dronekit-sitl copter -h     #List additional parameters for the specified vehicle (in this case "copter").
> dronekit-sitl --list        #List all available vehicles.
> dronekit-sitl --reset       #Delete all downloaded vehicle binaries.
> dronekit-sitl ./path [args...]  #Start SITL instance at target file location.```

- **Connecting an additional Ground Station**. In a second terminal spawn an instance of MAVProxy to forward messages
  from
  TCP: ```mavproxy --master tcp:172.17.6.255:5763 --sitl 127.0.0.1:5501 --out 127.0.0.1:14550 --out 127.0.0.1:14551```

You are ready to start app with _main.py_!
