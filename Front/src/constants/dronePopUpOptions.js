import {dronePopUpIcons} from "./styles";
import Modal from "../components/Modals/Modal";
import RenameModal from "../components/Modals/RenameModal";
import {colors} from "./styles";
import startMissionBase from "../utils/startMissionBase";
import ErrorModal from "../components/Modals/ErrorModal";
import axios from "axios";
import {SERVER_URL} from "../services/socket";

export default (drone, droneData, openModal, closeModal, navigation) => {
    const startMission = async () => {
        startMissionBase("mission", openModal, closeModal, drone, droneData, null);
    };

    const observeDrone = () => navigation.navigate("Observe", {droneId: drone.id});

    const RTL = () => {
        openModal(() => (
            <Modal
                title="Confirm action"
                content="Drone won't be able to continue its mission."
                buttonText="Confirm"
                buttonColor={colors.error300}
                onPress={async () => {
                    try {
                        await axios.post(SERVER_URL + "/drone/rtl", {
                            "connection_string": drone.uri
                        });
                    } catch (e) {
                        openModal(() => <ErrorModal/>);
                    }
                    closeModal();
                }}
            />
        ));
    };

    const guidedControl = () => console.log("guidedControl", drone.id);

    const renameDrone = () => {
        openModal(() => (
            <RenameModal
                onRename={(text) => (
                    drone.changeTitle(text)
                )}
            />
        ));
    };

    const deleteDrone = () => {
        openModal(() => (
            <Modal
                title="Confirm action"
                content="This action cannot be undone!"
                buttonText="Confirm"
                buttonColor={colors.error300}
                onPress={async () => {
                    await drone.delete();
                    navigation.navigate("Drawer", {screen: "Drones"});
                    closeModal();
                }}
            />
        ));
    };

    return [
        {
            label: "Start Mission",
            icon: dronePopUpIcons.startMission,
            onSelect: startMission
        },
        {
            label: "Observe",
            icon: dronePopUpIcons.observeDrone,
            onSelect: observeDrone
        },
        {
            label: "RTL",
            icon: dronePopUpIcons.RTL,
            onSelect: RTL
        },
        // {
        //     label: "Guided Control",
        //     icon: dronePopUpIcons.guidedControl,
        //     onSelect: guidedControl
        // },
        {
            label: "Rename",
            icon: dronePopUpIcons.renameDrone,
            onSelect: renameDrone
        },
        {
            label: "Delete",
            icon: dronePopUpIcons.deleteDrone,
            onSelect: deleteDrone
        }
    ];
}