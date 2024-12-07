import {View, StyleSheet} from "react-native";
import Map from "../components/Map";
import {StatusBar} from "expo-status-bar";
import {useEffect} from "react";
import {headerStyle} from "../constants/styles";

let WAYPOINTS = [
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 1,
        "frame": 3,
        "command": 22,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "x": 50.4501,
        "y": 30.5234,
        "z": 10
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 2,
        "frame": 3,
        "command": 16,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "x": 50.4515,
        "y": 30.5248,
        "z": 50
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 3,
        "frame": 3,
        "command": 17,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 0,
        "param3": 200,
        "param4": 0,
        "x": 50.4520,
        "y": 30.5250,
        "z": 50
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 4,
        "frame": 3,
        "command": 18,
        "current": 0,
        "autocontinue": 1,
        "param1": 3,
        "param2": 0,
        "param3": 100,
        "param4": 0,
        "x": 50.4530,
        "y": 30.5260,
        "z": 50
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 5,
        "frame": 3,
        "command": 19,
        "current": 0,
        "autocontinue": 1,
        "param1": 10,
        "param2": 0,
        "param3": 100,
        "param4": 0,
        "x": 50.4540,
        "y": 30.5270,
        "z": 50
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 6,
        "frame": 3,
        "command": 20,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "x": 50.4505,
        "y": 30.5239,
        "z": 0
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 7,
        "frame": 3,
        "command": 21,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "x": 50.4507,
        "y": 30.5241,
        "z": 0
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 8,
        "frame": 3,
        "command": 82,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "x": 50.4510,
        "y": 30.5245,
        "z": 50
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 9,
        "frame": 3,
        "command": 93,
        "current": 0,
        "autocontinue": 1,
        "param1": 5,
        "param2": 14,
        "param3": 30,
        "param4": 0,
        "x": 50.4508,
        "y": 30.5237,
        "z": 0
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 10,
        "frame": 3,
        "command": 94,
        "current": 0,
        "autocontinue": 1,
        "param1": 10,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "x": 50.4506,
        "y": 30.5236,
        "z": 10
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 11,
        "frame": 3,
        "command": 177,
        "current": 0,
        "autocontinue": 1,
        "param1": 3,
        "param2": 2,
        "param3": 0,
        "param4": 0,
        "x": 50.4502,
        "y": 30.5232,
        "z": 0
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 12,
        "frame": 3,
        "command": 178,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 5,
        "param3": 0,
        "param4": 0,
        "x": 50.4503,
        "y": 30.5233,
        "z": 0
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 13,
        "frame": 3,
        "command": 201,
        "current": 0,
        "autocontinue": 1,
        "param1": 0,
        "param2": 0,
        "param3": 0,
        "param4": 0,
        "x": 50.4511,
        "y": 30.5246,
        "z": 50
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 14,
        "frame": 3,
        "command": 203,
        "current": 0,
        "autocontinue": 1,
        "param1": 1,
        "param2": 0,
        "param3": 0,
        "param4": 1,
        "x": 50.4509,
        "y": 30.5238,
        "z": 0
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 15,
        "frame": 3,
        "command": 206,
        "current": 0,
        "autocontinue": 1,
        "param1": 20,
        "param2": 0,
        "param3": 1,
        "param4": 0,
        "x": 50.4504,
        "y": 30.5235,
        "z": 0
    },
    {
        "target_system": 1,
        "target_component": 0,
        "seq": 16,
        "frame": 3,
        "command": 211,
        "current": 0,
        "autocontinue": 1,
        "param1": 1,
        "param2": 1,
        "param3": 0,
        "param4": 0,
        "x": 50.4500,
        "y": 30.5230,
        "z": 0
    }
];

const MissionEditor = ({navigation, route}) => {
    const {missionId, editable} = route.params;
    // Feeeetch later...
    const mockMissionData = {
        id: 1,
        title: "Mission 1",
        description: "3 km in 360 minutes",
        timestamp: 1735617575000
    };

    useEffect(() => {
        navigation.setOptions({
            title: mockMissionData.title,
            headerBackground: () => <View style={{flex: 1, backgroundColor: headerStyle.headerStyle.backgroundColor}}/>,
            headerTransparent: true,
        });
    }, []);

    return (
        <Map
            waypoints={WAYPOINTS}
            isEditable={editable}
        >
            <StatusBar translucent hidden/>
        </Map>
    );
};

export default MissionEditor;

const styles = StyleSheet.create({});