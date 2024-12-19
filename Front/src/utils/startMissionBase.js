import MissionDAO from "../database/DAO/MissionDAO";
import DroneDAO from "../database/DAO/DroneDAO";
import SelectModal from "../components/Modals/SelectModal";
import PreflightCheckModal from "../components/Modals/PreflightCheckModal";
import axios from "axios";
import {SERVER_URL} from "../services/socket";
import ErrorModal from "../components/Modals/ErrorModal";
import HistoryDAO from "../database/DAO/HistoryDAO";

export default async (type, openModal, closeModal, drone, droneData, mission) => {
    const data = type === 'mission' ? await MissionDAO.getMissions() : await DroneDAO.getDrones();
    const options = data.map(item => ({id: item.id, label: item.title}));

    openModal(() => (
        <SelectModal
            title={`Select ${type}`}
            options={options}
            onSelect={async (selectedItem) => {
                const selectedData = data.find(item => item.id === selectedItem.id);
                closeModal();
                openModal(() => (
                    <PreflightCheckModal
                        drone={type === 'mission' ? drone : selectedData}
                        droneData={type === 'mission' ? droneData : undefined}
                        onStartMission={async () => {
                            if (type === 'mission') {
                                mission = selectedData;
                            }
                            const commands = (await mission.waypoints).sort((a, b) => a.order - b.order)
                                .map(waypoint => ({
                                    command: waypoint.command,
                                    param1: waypoint.param1,
                                    param2: waypoint.param2,
                                    param3: waypoint.param3,
                                    param4: waypoint.param4,
                                    param5: waypoint.x,
                                    param6: waypoint.y,
                                    param7: waypoint.z,
                                }));
                            try {
                                await axios.post(SERVER_URL + "/drone/start_mission", {
                                    "connection_string": type === 'mission' ? drone.uri : selectedData.uri,
                                    "commands": commands
                                });
                                await HistoryDAO.addHistory(mission, type === 'mission' ? drone : selectedData);
                            } catch (e) {
                                openModal(() => <ErrorModal text={e.response.data.errors?.join(" ")}/>);
                            }
                        }}
                    />
                ));
            }}
        />
    ));
};
