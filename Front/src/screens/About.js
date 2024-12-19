import {ScrollView, StyleSheet, Text, View} from "react-native";
import {colors, commonIcons, fonts} from "../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../utils/metrics";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBook, faCircle} from "@fortawesome/free-solid-svg-icons";
import commands from "../constants/commands";

const About = () => {
    return (
        <ScrollView contentContainerStyle={styles.root}>
            <View style={styles.section}>
                <View style={styles.titleWrapper}>
                    <FontAwesomeIcon icon={commonIcons.info} color={colors.accent300} size={moderateScale(24)}/>
                    <Text style={styles.title}>About App</Text>
                </View>
                <Text style={styles.text}>This mobile application is designed for convenient real-time control and
                    monitoring of unmanned aerial vehicles (drones). It allows users to connect to drones via a SITL
                    emulator or real drones, providing flight control, monitoring of parameters (altitude, speed,
                    battery status, GPS coordinates) and automatic missions. The application supports map-based flight
                    planning, a return home function, and the ability to program a flight by Waypoints.</Text>
            </View>
            <View style={styles.section}>
                <View style={styles.titleWrapper}>
                    <FontAwesomeIcon icon={commonIcons.instructions} color={colors.accent300} size={moderateScale(24)}/>
                    <Text style={styles.title}>Instructions</Text>
                </View>
                <Text style={styles.text}>Connecting to the drone: Select your drone from the list of available devices
                    or connect via the SITL emulator.</Text>
                <Text style={styles.text}>Flight monitoring: Once connected, you will see a panel with information about
                    the drone's altitude, speed, battery level, and GPS coordinates.</Text>
                <Text style={styles.text}>Drone control: Use the controls to take off, land, or re-route in real
                    time.</Text>
                <Text style={styles.text}>Route planning: Select a point route on the map to fly your drone
                    automatically.</Text>
                <Text style={styles.text}>Complete missions: You can set up and fly automatic missions, such as
                    surveying an area or taking pictures of objects.</Text>
                <Text style={styles.text}>Returning home: If necessary, activate the drone's automatic return to the
                    starting point.</Text>
            </View>
            <View style={styles.section}>
                <View style={styles.titleWrapper}>
                    <FontAwesomeIcon icon={faBook} color={colors.accent300} size={moderateScale(24)}/>
                    <Text style={styles.title}>Commands overview</Text>
                </View>
                {Object.values(commands).map((command, index) => (
                    <View key={index}>
                        <Text style={styles.text}>{command.name}</Text>
                        <Text style={styles.text}>{command.description}</Text>
                        <View style={styles.bulletList}>
                            {Object.entries(command).map(([key, value]) => {
                                if (key.startsWith('param')) {
                                    return (
                                        <View key={key} style={styles.listItem}>
                                            <FontAwesomeIcon
                                                icon={faCircle}
                                                style={[styles.text, styles.bulletPoint]}
                                                color={colors.primaryText200}
                                                size={moderateScale(10)}
                                            />
                                            <Text style={[styles.text, styles.smallText]}>
                                                {`${value.name}: ${value.description}`}
                                            </Text>
                                        </View>
                                    );
                                }
                                return null;
                            })}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default About;

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        backgroundColor: colors.primary200,
        padding: moderateScale(20),
    },
    titleWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: verticalScale(10)
    },
    title: {
        marginLeft: horizontalScale(5),
        color: colors.accent300,
        fontSize: moderateScale(24),
        fontFamily: fonts.primaryRegular,
    },
    text: {
        color: colors.primaryText200,
        fontSize: moderateScale(20),
        fontFamily: fonts.primaryRegular,
        marginBottom: verticalScale(10),
    },
    smallText: {
        fontSize: moderateScale(16),
    },
    bulletList: {
        paddingLeft: horizontalScale(10),
    },
    bulletPoint: {
        marginRight: horizontalScale(5),
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
    }
});