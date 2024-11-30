import {View, StyleSheet, FlatList, Text} from "react-native";
import {colors, dronePopUpIcons, fonts} from "../constants/styles";
import {faPlane, faPlaneCircleCheck, faPlaneCircleXmark} from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import {moderateScale} from "../utils/metrics";
import {useModal} from "../components/ModalProvider";
import {useState} from "react";
import Modal from "../components/Modal";
import RenameModal from "../components/RenameModal";

const statuses = {
    1: {description: "Mission in progress", icon: faPlane, color: colors.success100},
    2: {description: "Waiting for orders", icon: faPlaneCircleCheck, color: colors.success100},
    3: {description: "Offline", icon: faPlaneCircleXmark, color: colors.error200},
};

const Drones = () => {
    const {openModal, closeModal} = useModal();

    const [drones, setDrones] = useState([
        {
            id: 10,
            title: "DJi mavick pro 15",
            ...statuses["1"]
        },
        {
            id: 11,
            title: "DJi mavick pro 15",
            ...statuses["2"]
        },
        {
            id: 12,
            title: "DJi mavick pro 15",
            ...statuses["3"]
        }
    ]);

    const startMission = (droneId) => {
        console.log("startMission", droneId);
    }

    const observeDrone = (droneId) => {
        console.log("observe", droneId);
    }

    const RTL = (droneId) => {
        openModal(() => (
                <Modal
                    title="Confirm action"
                    content="Drone wont be able to continue it's mission."
                    buttonText="Confirm"
                    buttonColor={colors.error300}
                    onPress={
                        () => {
                            console.log("RTL", droneId);
                            closeModal();
                        }
                    }
                />
            )
        );
    }

    const guidedControl = (droneId) => {
        console.log("guidedControl", droneId);
    }

    const renameDrone = (droneId) => {
        openModal(() => (
            <RenameModal
                onRename={(text) => (
                    console.log("rename", droneId, text)
                )}
            />
        ));
    }

    const deleteDrone = (droneId) => {
        openModal(() => (
                <Modal
                    title="Confirm action"
                    content="This action cannot be undone!"
                    buttonText="Confirm"
                    buttonColor={colors.error300}
                    onPress={
                        () => {
                            setDrones(drones.filter(drone => drone.id !== droneId));
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
                data={drones}
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
                        popUpOptions={[
                            {
                                label: "Start Mission",
                                icon: dronePopUpIcons.startMission,
                                onSelect: () => startMission(itemData.item.id)
                            },
                            {
                                label: "Observe",
                                icon: dronePopUpIcons.observeDrone,
                                onSelect: () => observeDrone(itemData.item.id)
                            },
                            {
                                label: "RTL",
                                icon: dronePopUpIcons.RTL,
                                onSelect: () => RTL(itemData.item.id)
                            },
                            {
                                label: "Guided Control",
                                icon: dronePopUpIcons.guidedControl,
                                onSelect: () => guidedControl(itemData.item.id)
                            },
                            {
                                label: "Rename",
                                icon: dronePopUpIcons.renameDrone,
                                onSelect: () => renameDrone(itemData.item.id)
                            },
                            {
                                label: "Delete",
                                icon: dronePopUpIcons.deleteDrone,
                                onSelect: () => deleteDrone(itemData.item.id)
                            }
                        ]}
                    />
                )}
                style={{width: "100%"}}
            />
        </View>
    );
};

export default Drones;

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