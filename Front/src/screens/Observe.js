import {useEffect} from "react";
import {View, StyleSheet, Text} from "react-native";
import {colors, fonts, headerStyle} from "../constants/styles";
import {StatusBar} from 'expo-status-bar';
import ScalableText from "../components/ScalableText";
import {horizontalScale, moderateScale} from "../utils/metrics";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faBatteryEmpty,
    faBatteryFull,
    faBatteryHalf,
    faBatteryQuarter,
    faBatteryThreeQuarters, faSignal, faTowerBroadcast
} from "@fortawesome/free-solid-svg-icons";
import Map from "../components/Map";

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

const Observe = ({route, navigation}) => {
    const droneId = route.params?.droneId;
    const mockDroneData = {
        lat: 50.45466,
        lon: 30.5238,
        alt: 50,
        bearing: 330,
        groundSpeed: 20,
        name: "DJi mavick pro 15",
        airSpeed: 0,
        distToRTL: 1500,
        battery: 50,
        ETA: 8270,
        currentWP: 11,
        totalWP: 36,
        homeLocation: {
            lat: 50.451315474871315,
            log: 30.521252652618028,
            alt: 587.18
        }
    };

    let batteryIcon = faBatteryFull;
    switch (mockDroneData.battery) {
        case mockDroneData.battery <= 5:
            batteryIcon = faBatteryEmpty;
            break;
        case mockDroneData.battery <= 25:
            batteryIcon = faBatteryQuarter;
            break;
        case mockDroneData.battery <= 50:
            batteryIcon = faBatteryHalf;
            break
        case mockDroneData.battery <= 75:
            batteryIcon = faBatteryThreeQuarters;
            break
    }

    useEffect(() => {
        navigation.setOptions({
            title: mockDroneData.name,
            headerBackground: () => <View style={{flex: 1, backgroundColor: headerStyle.headerStyle.backgroundColor}}/>,
            headerTransparent: true,
        });
    }, []);

    return (
        <Map
            waypoints={WAYPOINTS}
            droneId={droneId}
            droneData={mockDroneData}
        >
            <StatusBar translucent hidden/>
            <View style={styles.telemetryContainer}>
                <View style={styles.telemetryHeader}>
                    <View style={styles.telemetryHeaderBlock}>
                        <FontAwesomeIcon
                            icon={batteryIcon}
                            size={moderateScale(12)}
                            color={colors.secondaryText200}
                        />
                        <Text style={styles.telemetryHeaderText}>{mockDroneData.battery}%</Text>
                    </View>
                    <View style={styles.telemetryHeaderBlock}>
                        <FontAwesomeIcon
                            icon={faSignal}
                            size={moderateScale(12)}
                            color={colors.secondaryText200}
                        />
                        <Text style={styles.telemetryHeaderText}>100%</Text>
                    </View>
                    <View style={styles.telemetryHeaderBlock}>
                        <FontAwesomeIcon
                            icon={faTowerBroadcast}
                            size={moderateScale(12)}
                            color={colors.secondaryText200}
                        />
                        <Text style={styles.telemetryHeaderText}>6</Text>
                    </View>
                </View>
                <View style={styles.telemetryBodyWrapper}>
                    <View style={styles.telemetryColumn}>
                        <View style={styles.telemetryBlock}>
                            <Text style={styles.telemetryText}>Altitude(m)</Text>
                            <ScalableText>{mockDroneData.alt}</ScalableText>
                        </View>
                        <View style={styles.telemetryBlock}>
                            <Text style={styles.telemetryText}>Dist to WP (m)</Text>
                            <ScalableText>650000,00</ScalableText>
                        </View>
                        <View style={styles.telemetryBlock}>
                            <Text style={styles.telemetryText}>VerticalSpeed (m/s)</Text>
                            <ScalableText>{mockDroneData.airSpeed}</ScalableText>
                        </View>
                    </View>
                    <View style={styles.telemetryColumn}>
                        <View style={styles.telemetryBlock}>
                            <Text style={styles.telemetryText}>GroundSpeed (m/s)</Text>
                            <ScalableText>{mockDroneData.groundSpeed}</ScalableText>
                        </View>
                        <View style={styles.telemetryBlock}>
                            <Text style={styles.telemetryText}>Yaw (deg)</Text>
                            <ScalableText>{mockDroneData.bearing}</ScalableText>
                        </View>
                        <View style={styles.telemetryBlock}>
                            <Text style={styles.telemetryText}>DistToRTL</Text>
                            <ScalableText>{mockDroneData.distToRTL}</ScalableText>
                        </View>
                    </View>
                </View>
            </View>
        </Map>
    );
};

export default Observe;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    map: {
        flex: 1,
        height: "100%",
    },
    overlayContainer: {
        position: "absolute",
        flexDirection: "row",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    telemetryContainer: {
        backgroundColor: colors.primary200,
        width: "30%",
        padding: moderateScale(10)
    },
    telemetryHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    telemetryHeaderBlock: {
        flexDirection: "row",
        alignItems: "center"
    },
    telemetryHeaderText: {
        marginLeft: horizontalScale(5),
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(12),
        color: colors.secondaryText200
    },
    telemetryBodyWrapper: {
        flex: 1,
        flexDirection: "row",
    },
    telemetryColumn: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
    },
    telemetryBlock: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    telemetryText: {
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(12),
        color: colors.primaryText200
    }
});