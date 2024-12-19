import database from "../database";

const missions = database.collections.get("missions");

export default {
    getMissionById: async (id) => await missions.find(id),
    getMissions: () => missions.query().fetch(),
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
