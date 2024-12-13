import {missionPopUpIcons} from "./styles";
import Modal from "../components/Modals/Modal";
import RenameModal from "../components/Modals/RenameModal";
import SelectModal from "../components/Modals/SelectModal";
import PreflightCheckModal from "../components/Modals/PreflightCheckModal";
import {colors} from "./styles";

export default (mission, openModal, closeModal, navigation) => {
    const startMission = () => {
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
                            onStartMission={() => console.log(`Started mission${mission.id} for drone${drone.id}`)}
                        />
                    ));
                }}
            />
        ));
    }

    const editMission = () => {
        navigation.navigate("Mission", {missionId: mission.id, editable: true});
    }

    const renameMission = () => {
        openModal(() => (
            <RenameModal
                onRename={(text) => (
                    mission.changeTitle(text)
                )}
            />
        ));
    }

    const deleteMission = () => {
        openModal(() => (
                <Modal
                    title="Confirm action"
                    content="This action cannot be undone!"
                    buttonText="Confirm"
                    buttonColor={colors.error300}
                    onPress={
                        async () => {
                            await mission.delete();
                            closeModal();
                        }
                    }
                />
            )
        );
    }

    return [
        {
            label: "Start Mission",
            icon: missionPopUpIcons.startMission,
            onSelect: () => startMission()
        },
        {
            label: "Edit",
            icon: missionPopUpIcons.editMission,
            onSelect: () => editMission()
        },
        {
            label: "Rename",
            icon: missionPopUpIcons.renameMission,
            onSelect: () => renameMission()
        },
        {
            label: "Delete",
            icon: missionPopUpIcons.deleteMission,
            onSelect: () => deleteMission()
        }
    ];
}