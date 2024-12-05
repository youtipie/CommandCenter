import {useEffect, useState, useRef} from "react";
import {View, StyleSheet, Text, Image, TouchableWithoutFeedback, Pressable} from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from "expo-navigation-bar";
import {colors, fonts, headerStyle} from "../constants/styles";
import OverlayButtons from "../components/OverlayButtons";
import {StatusBar} from 'expo-status-bar';
import ScalableText from "../components/ScalableText";
import {horizontalScale, moderateScale, verticalScale} from "../utils/metrics";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faAngleUp,
    faBatteryEmpty,
    faBatteryFull,
    faBatteryHalf,
    faBatteryQuarter,
    faBatteryThreeQuarters, faChevronUp, faHelicopterSymbol, faLocationDot, faSignal, faTowerBroadcast
} from "@fortawesome/free-solid-svg-icons";
import WaypointsLog from "../components/WaypointsLog";
import droneImg from "../../assets/drone-small.png";
import MapboxGL from "@rnmapbox/maps";

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

const styleURLs = [MapboxGL.StyleURL.Satellite, MapboxGL.StyleURL.SatelliteStreet, MapboxGL.StyleURL.Outdoors, MapboxGL.StyleURL.Street];

// Function to get the midpoint between two latitude/longitude pairs
function getMidpoint(lat1, lon1, lat2, lon2) {
    // Convert degrees to radians
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const lat1Rad = toRad(lat1);
    const lon1Rad = toRad(lon1);
    const lat2Rad = toRad(lat2);
    const lon2Rad = toRad(lon2);

    const dLon = lon2Rad - lon1Rad;

    const bx = Math.cos(lat2Rad) * Math.cos(dLon);
    const by = Math.cos(lat2Rad) * Math.sin(dLon);

    const midLat = Math.atan2(
        Math.sin(lat1Rad) + Math.sin(lat2Rad),
        Math.sqrt((Math.cos(lat1Rad) + bx) ** 2 + by ** 2)
    );
    const midLon = lon1Rad + Math.atan2(by, Math.cos(lat1Rad) + bx);

    return [toDeg(midLon), toDeg(midLat)];
}

// Function to calculate the bearing (rotation in degrees) from point 1 to point 2
function getBearing(lat1, lon1, lat2, lon2) {
    // Convert degrees to radians
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    const dLon = toRad(lon2 - lon1);

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
        Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    const bearing = Math.atan2(y, x);
    return (toDeg(bearing) + 360) % 360; // Normalize to 0-360 degrees
}

const Observe = ({route, navigation}) => {
    const droneId = route.params?.droneId;
    const cameraRef = useRef();

    const waypointsWithCoordinates = WAYPOINTS.filter(waypoint => (
        waypoint.x !== undefined &&
        waypoint.y !== undefined &&
        waypoint.z !== undefined
    ));

    const [headerShown, setHeaderShown] = useState(true);
    const [styleURL, setStyleURL] = useState(styleURLs[styleURLs.length - 1]);
    const [selectedWaypoint, setSelectedWaypoint] = useState();

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        NavigationBar.setBehaviorAsync('overlay-swipe')
        NavigationBar.setVisibilityAsync("hidden");
        navigation.setOptions({headerShown: false});

        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            NavigationBar.setVisibilityAsync("visible");
        }
    }, []);

    const handlePress = () => {
        if (selectedWaypoint !== null && selectedWaypoint !== undefined) {
            setSelectedWaypoint(null);
            return;
        }
        navigation.setOptions({headerShown: headerShown});
        setHeaderShown(!headerShown);
    }

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
        <View style={styles.root}>
            <StatusBar hidden={true} translucent/>
            <View style={styles.map}>
                <MapboxGL.MapView
                    styleURL={styleURL}
                    logoEnabled={false}
                    attributionEnabled={false}
                    compassEnabled={true}
                    compassPosition={{left: horizontalScale(5), top: verticalScale(30)}}
                    style={styles.map}
                >
                    <MapboxGL.Camera
                        ref={cameraRef}
                        zoomLevel={15}
                        centerCoordinate={[mockDroneData.lon, mockDroneData.lat]}
                        animationDuration={0}
                    />
                    <MapboxGL.MarkerView
                        coordinate={[mockDroneData.lon, mockDroneData.lat]}
                        allowOverlap
                    >
                        <Image source={droneImg}
                               style={{
                                   width: moderateScale(70),
                                   height: moderateScale(70),
                                   transform: [{rotate: `${mockDroneData.bearing}deg`}]
                               }}/>
                    </MapboxGL.MarkerView>
                    <MapboxGL.MarkerView
                        coordinate={[mockDroneData.homeLocation.log, mockDroneData.homeLocation.lat]}
                        allowOverlap
                    >
                        <FontAwesomeIcon
                            icon={faHelicopterSymbol}
                            size={moderateScale(32)}
                            color={colors.accent100}
                        />
                    </MapboxGL.MarkerView>
                    {waypointsWithCoordinates.slice(0, -1).map((waypoint, index) => (
                        <MapboxGL.MarkerView
                            key={index}
                            coordinate={getMidpoint(waypoint.x, waypoint.y, waypointsWithCoordinates[index + 1].x, waypointsWithCoordinates[index + 1].y)}
                            allowOverlap
                        >
                            <FontAwesomeIcon
                                icon={faAngleUp}
                                color={colors.error200}
                                size={moderateScale(25)}
                                style={{transform: [{rotate: `${getBearing(waypoint.x, waypoint.y, waypointsWithCoordinates[index + 1].x, waypointsWithCoordinates[index + 1].y)}deg`}]}}
                            />
                        </MapboxGL.MarkerView>
                    ))}
                    <MapboxGL.ShapeSource
                        id="markersLineSource"
                        shape={{
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: waypointsWithCoordinates.map(waypoint => [waypoint.y, waypoint.x]),
                            },
                        }}
                    >
                        <MapboxGL.LineLayer
                            id="markersLineLayer"
                            style={{
                                lineColor: colors.error200,
                                lineWidth: 4,
                            }}
                        />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource
                        id="dottedLineSource"
                        shape={{
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: [
                                    [waypointsWithCoordinates[0].y, waypointsWithCoordinates[0].x],
                                    [mockDroneData.homeLocation.log, mockDroneData.homeLocation.lat],
                                    [waypointsWithCoordinates[waypointsWithCoordinates.length - 1].y, waypointsWithCoordinates[waypointsWithCoordinates.length - 1].x],
                                ],
                            },
                        }}
                    >
                        <MapboxGL.LineLayer
                            id="dottedLineLayer"
                            style={{
                                lineColor: colors.error200,
                                lineWidth: 4,
                                lineDasharray: [2, 4],
                            }}
                        />
                    </MapboxGL.ShapeSource>
                    {waypointsWithCoordinates.map((waypoint, index) => (
                        <MapboxGL.MarkerView
                            key={index}
                            coordinate={[waypoint.y, waypoint.x]}
                            anchor={{x: 0.5, y: 1}}
                            allowOverlap
                        >
                            <Pressable onPress={() => setSelectedWaypoint(index)}>
                                <FontAwesomeIcon
                                    icon={faLocationDot}
                                    color={index === selectedWaypoint ? colors.accent300 : colors.accent100}
                                    size={moderateScale(32)}
                                />
                            </Pressable>
                        </MapboxGL.MarkerView>
                    ))}
                </MapboxGL.MapView>
                <View style={styles.overlayContainer}>
                    <OverlayButtons
                        droneId={droneId}
                        cameraRef={cameraRef}
                        onStyleURLChange={setStyleURL}
                        styleURLs={styleURLs}
                        centerLocation={[mockDroneData.lon, mockDroneData.lat]}
                    />
                </View>
            </View>
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
            <View style={styles.overlayContainer}>
                <WaypointsLog
                    waypoints={WAYPOINTS}
                    selectedIndex={selectedWaypoint}
                    onSelectedIndex={setSelectedWaypoint}
                />
            </View>
        </View>
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