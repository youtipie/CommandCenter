import {missionPopUpIcons} from "./styles";
import Modal from "../components/Modals/Modal";
import RenameModal from "../components/Modals/RenameModal";
import {colors} from "./styles";
import startMissionBase from "../utils/startMissionBase";

export default (mission, openModal, closeModal, navigation) => {
    const startMission = async () => {
        startMissionBase("drone", openModal, closeModal, null, null, mission);
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
            onSelect: startMission
        },
        {
            label: "Edit",
            icon: missionPopUpIcons.editMission,
            onSelect: editMission
        },
        {
            label: "Rename",
            icon: missionPopUpIcons.renameMission,
            onSelect: renameMission
        },
        {
            label: "Delete",
            icon: missionPopUpIcons.deleteMission,
            onSelect: deleteMission
        }
    ];
}