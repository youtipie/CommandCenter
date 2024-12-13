import database from "../database";
import {Q} from "@nozbe/watermelondb";

const waypoints = database.collections.get("waypoints");

export default {
    observeWaypoint: (waypointId) => waypoints.findAndObserve(waypointId),
    observeWaypointsByOrder: (missionId) => waypoints.query(Q.where("mission_id", missionId), Q.sortBy("order", Q.asc)),
    getHighestOrder: async (mission) => {
        const waypointsForMission = await waypoints
            .query(Q.where('mission_id', mission.id))
            .fetch();
        return waypointsForMission.reduce((max, waypoint) => {
            return waypoint.order > max ? waypoint.order : max;
        }, 0);
    },
    addWaypoint: async (mission, command, param1, param2, param3, param4, x, y, z, order) => {
        await database.write(async () => {
            await waypoints.create(waypoint => {
                waypoint.mission.set(mission);
                waypoint.command = command;
                waypoint.param1 = param1;
                waypoint.param2 = param2;
                waypoint.param3 = param3;
                waypoint.param4 = param4;
                waypoint.x = x;
                waypoint.y = y;
                waypoint.z = z;
                waypoint.order = order;
            })
        });
    }
};
