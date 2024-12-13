import database from "../database";

const missions = database.collections.get("missions");

export default {
    getMission: () => missions.query().fetch(),
    observeMissions: () => missions.query().observe(),
    observeById: (id) => missions.findAndObserve(id),
    addMission: async (title) => {
        await database.write(async () => {
            await missions.create(mission => {
                mission.title = title;
            });
        });
    }
};
