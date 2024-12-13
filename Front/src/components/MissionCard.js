import {withObservables} from "@nozbe/watermelondb/react";
import missionPopUpOptions from "../constants/missionPopUpOptions";
import Card from "./Card";
import {colors, commonIcons} from "../constants/styles";
import {useModal} from "./Modals/ModalProvider";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import getDistance from "../utils/getDistance";

const missionStyle = {
    color: colors.secondaryText100,
    icon: commonIcons.mission
};

const MissionCard = ({mission, waypointsCount}) => {
    const {openModal, closeModal} = useModal();
    const navigation = useNavigation();
    const [distance, setDistance] = useState(0);

    useEffect(() => {
        (async () => {
            let distance = 0;
            const waypoints = await mission.waypointsWithCoordinates.fetch();
            for (let i = 0; i < waypoints.length - 1; i++) {
                distance += getDistance(waypoints[i].x, waypoints[i].y, waypoints[i + 1].x, waypoints[i + 1].y);
            }
            setDistance(distance.toFixed(2));
        })()
    }, [waypointsCount]);

    return (
        <Card
            title={mission.title}
            description={`${waypointsCount} waypoints, ${distance} km`}
            icon={missionStyle.icon}
            color={missionStyle.color}
            onPress={() => (
                navigation.navigate("Mission", {missionId: mission.id, editable: false})
            )}
            popUpOptions={missionPopUpOptions(mission, openModal, closeModal, navigation)}
        />
    );
};

const enhance = withObservables(["mission"], ({mission}) => ({
    waypointsCount: mission.waypoints.observeCount(),
}));


export default enhance(MissionCard);