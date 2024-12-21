import {withObservables} from "@nozbe/watermelondb/react";
import missionPopUpOptions from "../constants/missionPopUpOptions";
import Card from "./Card";
import {colors, commonIcons} from "../constants/styles";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {useModal} from "./SocketModalProvider";

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
            setDistance((await mission.getDistance()).toFixed(2))
        })()
    }, [waypointsCount]);

    return (
        <Card
            testID={"MissionCard"}
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