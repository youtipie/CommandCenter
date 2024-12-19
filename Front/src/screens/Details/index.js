import {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Image} from "react-native";
import MapboxGL from '@rnmapbox/maps';
import {colors, commonIcons, missionPopUpIcons} from "../../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../../utils/metrics";
import {statuses} from "../../constants/statuses";
import Section from "./components/Section";
import SectionText from "./components/SectionText";
import {secondsToTimeStr} from "../../utils/secondsToTimeStr";
import MissionCard from "./components/MissionCard";
import Modal from "../../components/Modals/Modal";
import PreflightCheckModal from "../../components/Modals/PreflightCheckModal";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import PopUpMenu from "../../components/PopUpMenu";
import dronePopUpOptions from "../../constants/dronePopUpOptions";
import useDroneData from "../../hooks/useDroneData";
import {compose, withObservables} from "@nozbe/watermelondb/react";
import DroneDAO from "../../database/DAO/DroneDAO";
import HistoryDAO from "../../database/DAO/HistoryDAO";
import {useModal} from "../../components/SocketModalProvider";
import axios from "axios";
import {SERVER_URL} from "../../services/socket";
import ErrorModal from "../../components/Modals/ErrorModal";

const droneImg = require("../../../assets/drone-big.png");

const Details = ({drone, missions, history, historyLength, navigation}) => {
    const {openModal, closeModal} = useModal();

    const droneData = useDroneData({
        connectionString: drone.uri,
        verbose: true
    });

    const [lastMission, setLastMission] = useState(null);

    const status = droneData ?
        droneData.have_mission && !droneData.is_mission_finished && droneData.mode === "AUTO" ? statuses["1"].description : statuses["2"].description
        : null;

    useEffect(() => {
        (async () => setLastMission(await drone.getLastMission()))()
    }, [history.length]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => (
                <PopUpMenu
                    options={dronePopUpOptions(drone, droneData, openModal, closeModal, navigation)}
                >
                    <FontAwesomeIcon
                        icon={commonIcons.dotsVertical}
                        size={moderateScale(20)}
                        color={tintColor}
                        style={{
                            marginRight: horizontalScale(15)
                        }}
                    />
                </PopUpMenu>
            )
        })
    }, [navigation, droneData]);

    const startMission = (mission) => {
        openModal(() => (
            <PreflightCheckModal
                droneData={droneData}
                onStartMission={async () => {
                    const commands = (await mission.waypoints).sort((a, b) => a.order - b.order)
                        .map(waypoint => ({
                            command: waypoint.command,
                            param1: waypoint.param1,
                            param2: waypoint.param2,
                            param3: waypoint.param3,
                            param4: waypoint.param4,
                            param5: waypoint.x,
                            param6: waypoint.y,
                            param7: waypoint.z,
                        }));
                    try {
                        await axios.post(SERVER_URL + "/drone/start_mission", {
                            "connection_string": drone.uri,
                            "commands": commands
                        });
                        await HistoryDAO.addHistory(mission, drone);
                    } catch (e) {
                        openModal(() => <ErrorModal text={e.response.data.errors?.join(" ")}/>);
                    }
                }}
            />
        ));
    }

    const deleteMission = (history) => {
        openModal(() => (
                <Modal
                    title="Confirm action"
                    content="This action cannot be undone!"
                    buttonText="Confirm"
                    buttonColor={colors.error300}
                    onPress={
                        async () => {
                            await history.delete();
                            closeModal();
                        }
                    }
                />
            )
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.root}>
            {droneData &&
                <>
                    <Section title="Current Position">
                        <MapboxGL.MapView
                            zoomEnabled={false}
                            scrollEnabled={false}
                            logoEnabled={false}
                            scaleBarEnabled={false}
                            attributionEnabled={false}
                            pitchEnabled={false}
                            compassEnabled={false}
                            rotateEnabled={false}
                            style={styles.map}
                        >
                            <MapboxGL.Camera
                                zoomLevel={10}
                                centerCoordinate={[droneData.location.lon, droneData.location.lat]}
                                animationDuration={0}
                            />
                            <MapboxGL.MarkerView coordinate={[droneData.location.lon, droneData.location.lat]}>
                                <Image source={droneImg}
                                       style={{
                                           width: moderateScale(70),
                                           height: moderateScale(70),
                                           transform: [{rotate: `${droneData.heading}deg`}]
                                       }}/>
                            </MapboxGL.MarkerView>
                        </MapboxGL.MapView>
                        <SectionText>Latitude: {droneData.location.lat.toFixed(6)};</SectionText>
                        <SectionText>Longitude: {droneData.location.lon.toFixed(6)};</SectionText>
                        <SectionText>Altitude: {droneData.location.relative_alt.toFixed(2)} m;</SectionText>
                        <SectionText>Ground Speed: {droneData.groundspeed.toFixed(2)} m/s;</SectionText>
                        <SectionText>Air Speed: {droneData.vertical_speed.toFixed(2)} m/s;</SectionText>
                        <SectionText>Distance to RTL: {droneData.dist_to_home.toFixed(2)} m;</SectionText>
                    </Section>
                    <Section title="Properties">
                        <SectionText>Name: {drone.title};</SectionText>
                        <SectionText>Status: {status};</SectionText>
                        {status === statuses["1"].description && lastMission &&
                            <SectionText>Mission: {lastMission.title};</SectionText>}
                        <SectionText>Battery Power: {droneData.battery.level}%;</SectionText>
                        <SectionText>Progress: {droneData.mission_progress.toFixed(2) * 100}%;</SectionText>
                    </Section>
                    <Section title="Mission History">
                        {history.map((history, index) => {
                            const mission = missions.find(mission => mission.id === history.mission.id);

                            return (
                                <MissionCard
                                    key={index}
                                    missionId={historyLength - index}
                                    title={mission.title}
                                    timestamp={history.timestamp}
                                    popUpOptions={[
                                        {
                                            label: "Start Mission",
                                            icon: missionPopUpIcons.startMission,
                                            onSelect: () => startMission(mission)
                                        },
                                        {
                                            label: "Delete",
                                            icon: missionPopUpIcons.deleteMission,
                                            onSelect: () => deleteMission(history)
                                        }
                                    ]}
                                />
                            )
                        })}
                    </Section>
                </>
            }
        </ScrollView>
    );
};

const enhance = compose(
    withObservables(["route"], ({route}) => ({
        drone: DroneDAO.observeById(route.params.droneId),
        history: HistoryDAO.observeHistoryForDrone(route.params.droneId),
        historyLength: HistoryDAO.observeHistoryForDrone(route.params.droneId).observeCount()
    })),
    withObservables(["drone"], ({drone}) => ({
        missions: drone.missions,
    })),
);

export default enhance(Details);

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        backgroundColor: colors.primary200,
        padding: moderateScale(20),
    },
    map: {
        width: "100%",
        height: verticalScale(250)
    }
});