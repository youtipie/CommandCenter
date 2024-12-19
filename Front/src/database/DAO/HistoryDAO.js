import database from "../database";
import {Q} from "@nozbe/watermelondb";

const history = database.collections.get("history_missions");

export default {
    observeHistoryForDrone: (droneId) => history.query(Q.where("drone_id", droneId), Q.sortBy("timestamp", Q.desc)),
    addHistory: async (mission, drone) => {
        await database.write(async () => {
            await history.create(history => {
                history.timestamp = Date.now();
                history.mission.set(mission);
                history.drone.set(drone);
            });
        });
    }
};