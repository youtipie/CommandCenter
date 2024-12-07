import {useEffect} from "react";
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
import {useModal} from "../../components/Modals/ModalProvider";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import PopUpMenu from "../../components/PopUpMenu";
import dronePopUpOptions from "../../constants/dronePopUpOptions";

const droneImg = require("../../../assets/drone-big.png");

const Details = ({route, navigation}) => {
    const {openModal, closeModal} = useModal();

    // Fetch drone later...
    const droneId = route.params?.droneId;

    const mockDroneData = {
        lat: 50.45466,
        lon: 30.5238,
        alt: 50,
        bearing: 330,
        groundSpeed: 20,
        airSpeed: 0,
        distToRTL: 1500,
        name: "DJi mavick pro 15",
        status: statuses["1"].description,
        mission: "User mission 1",
        battery: 50,
        ETA: 8270,
        currentWP: 11,
        totalWP: 36
    };

    const mockMissionHistory = [
        {
            id: 1,
            title: "Mission 1",
            description: "3 km in 360 minutes",
            timestamp: 1735617575000
        },
        {
            id: 2,
            title: "Mission 2",
            description: "3 km in 360 minutes",
            timestamp: 1735617575000
        },
        {
            id: 3,
            title: "Mission 3",
            description: "3 km in 360 minutes",
            timestamp: 1735617575000
        },
        {
            id: 4,
            title: "Mission 4",
            description: "3 km in 360 minutes",
            timestamp: 1735617575000
        }
    ];

    const startMission = (missionId) => {
        openModal(() => (
            <PreflightCheckModal
                onStartMission={() => console.log(`Started mission${missionId} for drone${droneId}`)}
            />
        ));
    }

    const onDeletion = () => {
        navigation.navigate("Drawer", {screen: "Drones"});
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => (
                <PopUpMenu options={dronePopUpOptions(droneId, openModal, closeModal, navigation, onDeletion)}>
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
    }, [navigation]);

    const deleteMission = (missionId) => {
        openModal(() => (
                <Modal
                    title="Confirm action"
                    content="This action cannot be undone!"
                    buttonText="Confirm"
                    buttonColor={colors.error300}
                    onPress={
                        () => {
                            console.log(`Deleted mission${missionId} from history of drone${droneId}`);
                            closeModal();
                        }
                    }
                />
            )
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.root}>
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
                        centerCoordinate={[mockDroneData.lon, mockDroneData.lat]}
                        animationDuration={0}
                    />
                    <MapboxGL.MarkerView coordinate={[mockDroneData.lon, mockDroneData.lat]}>
                        <Image source={droneImg}
                               style={{
                                   width: moderateScale(70),
                                   height: moderateScale(70),
                                   transform: [{rotate: `${mockDroneData.bearing}deg`}]
                               }}/>
                    </MapboxGL.MarkerView>
                </MapboxGL.MapView>
                <SectionText>Latitude: {mockDroneData.lat};</SectionText>
                <SectionText>Longitude: {mockDroneData.lon};</SectionText>
                <SectionText>Altitude: {mockDroneData.alt} m;</SectionText>
                <SectionText>Ground Speed: {mockDroneData.groundSpeed} m/s;</SectionText>
                <SectionText>Air Speed: {mockDroneData.airSpeed} m/s;</SectionText>
                <SectionText>Distance to RTL: {mockDroneData.distToRTL} m;</SectionText>
            </Section>
            <Section title="Properties">
                <SectionText>Name: {mockDroneData.name};</SectionText>
                <SectionText>Status: {mockDroneData.status};</SectionText>
                <SectionText>Mission: {mockDroneData.mission};</SectionText>
                <SectionText>Battery Power: {mockDroneData.battery}%;</SectionText>
                <SectionText>ETA: {secondsToTimeStr(mockDroneData.ETA)};</SectionText>
                <SectionText>Progress: {mockDroneData.currentWP}/{mockDroneData.totalWP};</SectionText>
            </Section>
            <Section title="Mission History">
                {mockMissionHistory.map((mission, index) => (
                    <MissionCard
                        key={index}
                        missionId={mission.id}
                        title={mission.title}
                        description={mission.description}
                        timestamp={mission.timestamp}
                        onPress={() => (
                            navigation.navigate("Mission", {missionId: mission.id, editable: false})
                        )}
                        popUpOptions={[
                            {
                                label: "Start Mission",
                                icon: missionPopUpIcons.startMission,
                                onSelect: () => startMission(mission.id)
                            },
                            {
                                label: "Delete",
                                icon: missionPopUpIcons.deleteMission,
                                onSelect: () => deleteMission(mission.id)
                            }
                        ]}
                    />
                ))}
            </Section>
        </ScrollView>
    );
};

export default Details;

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