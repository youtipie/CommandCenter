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
import {Map} from "../components/Map";
import { withObservables} from "@nozbe/watermelondb/react";
import DroneDAO from "../database/DAO/DroneDAO";
import useDroneData from "../hooks/useDroneData";
import {notDisplayedCommands} from "../constants/commands";

const Observe = ({drone, navigation}) => {
    const droneData = useDroneData({
        connectionString: drone.uri,
        verbose: true,
    });

    let batteryIcon = faBatteryFull;
    switch (droneData?.battery.level) {
        case droneData?.battery.level <= 5:
            batteryIcon = faBatteryEmpty;
            break;
        case droneData?.battery.level <= 25:
            batteryIcon = faBatteryQuarter;
            break;
        case droneData?.battery.level <= 50:
            batteryIcon = faBatteryHalf;
            break
        case droneData?.battery.level <= 75:
            batteryIcon = faBatteryThreeQuarters;
            break
    }

    useEffect(() => {
        navigation.setOptions({
            title: drone.title,
            headerBackground: () => <View style={{flex: 1, backgroundColor: headerStyle.headerStyle.backgroundColor}}/>,
            headerTransparent: true,
        });
    }, []);

    return (
        <>
            {droneData &&
                <Map
                    waypoints={droneData.waypoints}
                    waypointsWithCoordinates={droneData.waypoints.filter(wp => !notDisplayedCommands.includes(wp.command))}
                    isEditable={false}
                    drone={drone}
                    droneData={droneData}
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
                                <Text style={styles.telemetryHeaderText}>{droneData.battery.level}%</Text>
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
                                    <ScalableText>{droneData.location.relative_alt?.toFixed(1)}</ScalableText>
                                </View>
                                <View style={styles.telemetryBlock}>
                                    <Text style={styles.telemetryText}>Dist to WP (m)</Text>
                                    <ScalableText>{droneData.distance_to_next_waypoint?.toFixed(1)}</ScalableText>
                                </View>
                                <View style={styles.telemetryBlock}>
                                    <Text style={styles.telemetryText}>VerticalSpeed (m/s)</Text>
                                    <ScalableText>{droneData.vertical_speed?.toFixed(1)}</ScalableText>
                                </View>
                            </View>
                            <View style={styles.telemetryColumn}>
                                <View style={styles.telemetryBlock}>
                                    <Text style={styles.telemetryText}>GroundSpeed (m/s)</Text>
                                    <ScalableText>{droneData.groundspeed?.toFixed(1)}</ScalableText>
                                </View>
                                <View style={styles.telemetryBlock}>
                                    <Text style={styles.telemetryText}>Yaw (deg)</Text>
                                    <ScalableText>{droneData.heading}</ScalableText>
                                </View>
                                <View style={styles.telemetryBlock}>
                                    <Text style={styles.telemetryText}>DistToRTL</Text>
                                    <ScalableText>{droneData.dist_to_home?.toFixed(0)}</ScalableText>
                                </View>
                            </View>
                        </View>
                    </View>
                </Map>
            }
        </>
    );
};

const enhance = withObservables(["route"], ({route}) => ({
    drone: DroneDAO.observeById(route.params.droneId),
}));

export default enhance(Observe);

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