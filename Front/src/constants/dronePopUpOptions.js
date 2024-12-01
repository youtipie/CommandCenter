import {dronePopUpIcons} from "./styles";
import Modal from "../components/Modals/Modal";
import RenameModal from "../components/Modals/RenameModal";
import SelectModal from "../components/Modals/SelectModal";
import PreflightCheckModal from "../components/Modals/PreflightCheckModal";
import {colors} from "./styles";

export default (droneId, openModal, closeModal, onDeletion) => {
    const startMission = () => {
        const options = [
            {id: 10, label: "Mission 1"},
            {id: 11, label: "Very long mission name so it wont fit, right?"}
        ];
        openModal(() => (
            <SelectModal
                title="Select mission"
                options={options}
                onSelect={(mission) => {
                    closeModal();
                    openModal(() => (
                        <PreflightCheckModal
                            onStartMission={() => console.log(`Started mission ${mission.id} for drone ${droneId}`)}
                        />
                    ));
                }}
            />
        ));
    };

    const observeDrone = () => console.log("observe", droneId);

    const RTL = () => {
        openModal(() => (
            <Modal
                title="Confirm action"
                content="Drone won't be able to continue its mission."
                buttonText="Confirm"
                buttonColor={colors.error300}
                onPress={() => {
                    console.log("RTL", droneId);
                    closeModal();
                }}
            />
        ));
    };

    const guidedControl = () => console.log("guidedControl", droneId);

    const renameDrone = () => {
        openModal(() => (
            <RenameModal
                onRename={(text) => console.log("rename", droneId, text)}
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
                onPress={() => {
                    onDeletion(droneId);
                    closeModal();
                }}
            />
        ));
    };

    return [
        {
            label: "Start Mission",
            icon: dronePopUpIcons.startMission,
            onSelect: () => startMission(droneId)
        },
        {
            label: "Observe",
            icon: dronePopUpIcons.observeDrone,
            onSelect: () => observeDrone(droneId)
        },
        {
            label: "RTL",
            icon: dronePopUpIcons.RTL,
            onSelect: () => RTL(droneId)
        },
        {
            label: "Guided Control",
            icon: dronePopUpIcons.guidedControl,
            onSelect: () => guidedControl(droneId)
        },
        {
            label: "Rename",
            icon: dronePopUpIcons.renameDrone,
            onSelect: () => renameDrone(droneId)
        },
        {
            label: "Delete",
            icon: dronePopUpIcons.deleteDrone,
            onSelect: () => deleteDrone(droneId)
        }
    ];
}