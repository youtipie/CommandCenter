import {useState} from "react";
import {colors, commonIcons, fonts, missionPopUpIcons} from "../constants/styles";
import {useModal} from "../components/Modals/ModalProvider";
import {FlatList, Text, View, StyleSheet} from "react-native";
import Card from "../components/Card";
import {moderateScale} from "../utils/metrics";
import Modal from "../components/Modals/Modal";
import RenameModal from "../components/Modals/RenameModal";
import SelectModal from "../components/Modals/SelectModal";
import PreflightCheckModal from "../components/Modals/PreflightCheckModal";

const Missions = ({navigation}) => {
    const {openModal, closeModal} = useModal();

    const [missions, setMissions] = useState([
        {
            id: 10,
            title: "Mission 1",
            description: "15 waypoints, 1500 meters",
            color: colors.secondaryText100,
            icon: commonIcons.mission
        },
        {
            id: 11,
            title: "Very long mission name so it wont fit, right?",
            description: "150 waypoints, 15000 meters",
            color: colors.secondaryText100,
            icon: commonIcons.mission
        }
    ]);

    const startMission = (missionId) => {
        // Fetch later
        const options = [
            {
                id: 10,
                label: "Mavick 14"
            },
            {
                id: 11,
                label: "Mavick 15"
            }
        ];
        openModal(() => (
            <SelectModal
                title="Select drone"
                options={options}
                onSelect={(drone) => {
                    closeModal();
                    openModal(() => (
                        <PreflightCheckModal
                            onStartMission={() => console.log(`Started mission${missionId} for drone${drone.id}`)}
                        />
                    ));
                }}
            />
        ));
    }

    const editMission = (missionId) => {
        console.log("editMission", missionId);
    }

    const renameMission = (missionId) => {
        openModal(() => (
            <RenameModal
                onRename={(text) => (
                    console.log("rename", missionId, text)
                )}
            />
        ));
    }

    const deleteMission = (missionId) => {
        openModal(() => (
                <Modal
                    title="Confirm action"
                    content="This action cannot be undone!"
                    buttonText="Confirm"
                    buttonColor={colors.error300}
                    onPress={
                        () => {
                            setMissions(missions.filter(mission => mission.id !== missionId));
                            closeModal();
                        }
                    }
                />
            )
        );
    }

    return (
        <View style={styles.root}>
            <FlatList
                data={missions}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.contentContainerStyle}
                ListEmptyComponent={
                    <View style={styles.emptyWrapper}>
                        <Text style={styles.emptyText}>There is nothing here...</Text>
                    </View>
                }
                renderItem={(itemData) => (
                    <Card
                        item={itemData.item}
                        onPress={() => (
                            navigation.navigate("Mission", {missionId: itemData.item.id, editable: true})
                        )}
                        popUpOptions={[
                            {
                                label: "Start Mission",
                                icon: missionPopUpIcons.startMission,
                                onSelect: () => startMission(itemData.item.id)
                            },
                            {
                                label: "Edit",
                                icon: missionPopUpIcons.editMission,
                                onSelect: () => editMission(itemData.item.id)
                            },
                            {
                                label: "Rename",
                                icon: missionPopUpIcons.renameMission,
                                onSelect: () => renameMission(itemData.item.id)
                            },
                            {
                                label: "Delete",
                                icon: missionPopUpIcons.deleteMission,
                                onSelect: () => deleteMission(itemData.item.id)
                            }
                        ]}
                    />
                )}
                style={{width: "100%"}}
            />
        </View>
    );
};

export default Missions;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary200,
    },
    contentContainerStyle: {
        padding: moderateScale(20)
    },
    emptyWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyText: {
        color: colors.secondaryText200,
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(16)
    }
});