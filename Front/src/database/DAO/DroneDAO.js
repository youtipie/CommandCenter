import database from "../database";
import {Q} from "@nozbe/watermelondb";

const drones = database.collections.get("drones");

export default {
    getDrones: () => drones.query().fetch(),
    observeDrones: () => drones.query().observe(),
    observeById: (droneId) => drones.findAndObserve(droneId),
    checkConnectionStringUniqueness: async (connectionString) => (await drones.query(Q.where("uri", connectionString)).fetchCount()) === 0,
    addDrone: async (title, uri) => {
        await database.write(async () => {
            await drones.create(drone => {
                drone.title = title;
                drone.uri = uri;
            });
        });
    }
};
