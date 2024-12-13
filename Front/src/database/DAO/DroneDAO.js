import database from "../database";

const drones = database.collections.get("drones");

export default {
    getDrones: () => drones.query().fetch(),
    observeDrones: () => drones.query().observe(),
    addDrone: async (title, uri) => {
        await database.write(async () => {
            await drones.create(drone => {
                drone.title = title;
                drone.uri = uri;
            });
        });
    }
};
