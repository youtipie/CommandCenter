import {useEffect, useRef, useState} from "react";
import {StyleSheet, View} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import {horizontalScale, verticalScale} from "../../utils/metrics";
import OverlayButtons from "../OverlayButtons";
import WaypointsLog from "../WaypointsLog";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import {useNavigation} from "@react-navigation/native";
import DroneMarker from "./components/DroneMarker";
import MarkerLines from "./components/MarkerLines";
import Markers from "./components/Markers";

const styleURLs = [MapboxGL.StyleURL.Satellite, MapboxGL.StyleURL.SatelliteStreet, MapboxGL.StyleURL.Outdoors, MapboxGL.StyleURL.Street];


const Map = ({children, waypoints, droneId = null, droneData, isEditable, onDragEnd}) => {
    const cameraRef = useRef();
    const navigation = useNavigation();

    const [headerShown, setHeaderShown] = useState(true);
    const [styleURL, setStyleURL] = useState(styleURLs[styleURLs.length - 1]);
    const [selectedWaypoint, setSelectedWaypoint] = useState();

    const waypointsWithCoordinates = waypoints.filter(waypoint => (
        waypoint.x !== 0 &&
        waypoint.y !== 0
    ));

    const centerCamera = droneData ? [droneData.lon, droneData.lat] : [waypointsWithCoordinates[0].y, waypointsWithCoordinates[0].x];

    const handlePress = () => {
        if (selectedWaypoint !== null && selectedWaypoint !== undefined) {
            setSelectedWaypoint(undefined);
            return;
        }
        navigation.setOptions({headerShown: headerShown});
        setHeaderShown(!headerShown);
    }

    const handleSelectWaypoint = (index) => {
        const marker = waypointsWithCoordinates[index];
        setSelectedWaypoint(waypoints.indexOf(marker));
    }

    const handleMarkerDragEnd = (payload, index) => {
        const {coordinates} = payload.geometry;
        const marker = waypointsWithCoordinates[index];
        onDragEnd?.(coordinates.reverse(), waypoints.indexOf(marker));
    }

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

    return (
        <View style={styles.root}>
            <View style={styles.map}>
                <MapboxGL.MapView
                    styleURL={styleURL}
                    style={styles.map}
                    logoEnabled={false}
                    attributionEnabled={false}
                    compassEnabled={true}
                    rotateEnabled={false}
                    compassPosition={{left: horizontalScale(5), top: verticalScale(30)}}
                    onPress={handlePress}
                >
                    <MapboxGL.Camera
                        ref={cameraRef}
                        zoomLevel={15}
                        centerCoordinate={centerCamera}
                        animationDuration={0}
                    />
                    {droneData &&
                        <DroneMarker droneData={droneData} waypointsWithCoordinates={waypointsWithCoordinates}/>
                    }
                    <MarkerLines waypointsWithCoordinates={waypointsWithCoordinates}/>
                    <Markers
                        isEditable={isEditable}
                        waypoints={waypoints}
                        waypointsWithCoordinates={waypointsWithCoordinates}
                        selectedWaypoint={selectedWaypoint}
                        handleSelectWaypoint={handleSelectWaypoint}
                        handleMarkerDragEnd={handleMarkerDragEnd}
                    />
                </MapboxGL.MapView>
                <View style={styles.overlayContainer}>
                    <OverlayButtons
                        droneId={droneId ?? null}
                        cameraRef={cameraRef}
                        onStyleURLChange={setStyleURL}
                        styleURLs={styleURLs}
                        centerLocation={centerCamera}
                    />
                </View>
            </View>
            {children}
            <View style={styles.overlayContainer}>
                <WaypointsLog
                    waypoints={waypoints}
                    selectedIndex={selectedWaypoint}
                    onSelectedIndex={setSelectedWaypoint}
                />
            </View>
        </View>
    );
};

export default Map;

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
    }
});