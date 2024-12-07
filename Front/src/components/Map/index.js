import {useEffect, useRef, useState} from "react";
import {Image, StyleSheet, View} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import {horizontalScale, moderateScale, verticalScale} from "../../utils/metrics";
import droneImg from "../../../assets/drone-small.png";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faAngleUp,
    faHelicopterSymbol,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {colors} from "../../constants/styles";
import getMidpoint from "../../utils/getMidpoint";
import getBearing from "../../utils/getBearing";
import OverlayButtons from "../OverlayButtons";
import WaypointsLog from "../WaypointsLog";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import {useNavigation} from "@react-navigation/native";

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
                        <>
                            <MapboxGL.MarkerView
                                coordinate={[droneData.lon, droneData.lat]}
                                allowOverlap
                            >
                                <Image source={droneImg}
                                       style={{
                                           width: moderateScale(70),
                                           height: moderateScale(70),
                                           transform: [{rotate: `${droneData.bearing}deg`}]
                                       }}/>
                            </MapboxGL.MarkerView>
                            <MapboxGL.MarkerView
                                coordinate={[droneData.homeLocation.log, droneData.homeLocation.lat]}
                                allowOverlap
                            >
                                <FontAwesomeIcon
                                    icon={faHelicopterSymbol}
                                    size={moderateScale(32)}
                                    color={colors.accent100}
                                />
                            </MapboxGL.MarkerView>
                        </>
                    }
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
                            layerIndex={100}
                        />
                    </MapboxGL.ShapeSource>
                    {droneData &&
                        <MapboxGL.ShapeSource
                            id="dottedLineSource"
                            shape={{
                                type: "Feature",
                                geometry: {
                                    type: "LineString",
                                    coordinates: [
                                        [waypointsWithCoordinates[0].y, waypointsWithCoordinates[0].x],
                                        [droneData.homeLocation.log, droneData.homeLocation.lat],
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
                    }
                    {waypointsWithCoordinates.map((waypoint, index) => (
                        <MapboxGL.PointAnnotation
                            id={`${index}-annotation`}
                            key={`${index}-${selectedWaypoint}`}
                            coordinate={[waypoint.y, waypoint.x]}
                            anchor={{x: 0.5, y: 1}}
                            allowOverlap
                            draggable={isEditable}
                            onSelected={() => handleSelectWaypoint(index)}
                            onDragEnd={(payload) => handleMarkerDragEnd(payload, index)}
                        >
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                color={index === waypointsWithCoordinates.indexOf(waypoints[selectedWaypoint]) ? colors.accent300 : colors.accent100}
                                size={moderateScale(32)}
                            />
                        </MapboxGL.PointAnnotation>
                    ))}
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