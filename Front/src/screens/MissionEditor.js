import {View} from "react-native";
import Map from "../components/Map";
import {StatusBar} from "expo-status-bar";
import {useEffect} from "react";
import {commonIcons, headerStyle} from "../constants/styles";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {horizontalScale, moderateScale} from "../utils/metrics";
import PopUpMenu from "../components/PopUpMenu";
import missionPopUpOptions from "../constants/missionPopUpOptions";
import {useModal} from "../components/Modals/ModalProvider";
import {withObservables} from "@nozbe/watermelondb/react";
import MissionDAO from "../database/DAO/MissionDAO";


const MissionEditor = ({navigation, route, mission, waypoints, waypointsWithCoordinates}) => {
    const {editable} = route.params;
    const {openModal, closeModal} = useModal();

    const onMarkerDragEnd = async (coordinates, waypoint) => {
        await waypoint.changeParam("x", coordinates[0]);
        await waypoint.changeParam("y", coordinates[1]);
    }

    useEffect(() => {
        navigation.setOptions({
            title: mission.title,
            headerBackground: () => <View style={{flex: 1, backgroundColor: headerStyle.headerStyle.backgroundColor}}/>,
            headerTransparent: true,
        });
    }, [mission.title]);

    useEffect(() => {
        if (!editable) {
            navigation.setOptions({
                headerRight: ({tintColor}) => (
                    <PopUpMenu options={missionPopUpOptions(mission, openModal, closeModal, navigation)}>
                        <FontAwesomeIcon
                            icon={commonIcons.dotsVertical}
                            color={tintColor}
                            size={moderateScale(24)}
                            style={{
                                marginRight: horizontalScale(15)
                            }}
                        />
                    </PopUpMenu>
                )
            });
        }
        return () => {
            navigation.setOptions({headerRight: null});
        }
    }, [editable]);

    return (
        <Map
            missionId={mission.id}
            isEditable={editable}
            onDragEnd={onMarkerDragEnd}
            onWaypointsChange={() => {
            }}
        >
            <StatusBar translucent hidden/>
        </Map>
    );
};

const enhance =
    withObservables(["route"], ({route}) => ({
            mission: MissionDAO.observeById(route.params?.missionId)
        })
    );

export default enhance(MissionEditor);