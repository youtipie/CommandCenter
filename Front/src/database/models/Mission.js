import {Model, Q} from '@nozbe/watermelondb'
import {children, lazy, reader, text, writer} from "@nozbe/watermelondb/decorators";
import getDistance from "../../utils/getDistance";
import {notDisplayedCommands} from "../../constants/commands";

export default class Mission extends Model {
    static table = "missions";
    static associations = {
        waypoints: {type: "has_many", foreignKey: "mission_id"},
        history_missions: {type: 'has_many', foreignKey: 'mission_id'},
    };

    @text("title") title
    @children("waypoints") waypoints

    @lazy
    waypointsWithCoordinates = this.collections.get("waypoints")
        .query(Q.and(
                Q.where("mission_id", this.id),
                Q.where("command", Q.notIn(notDisplayedCommands)),
            ),
            Q.sortBy("order", Q.asc)
        );

    @lazy
    drones = this.collections
        .get('drones')
        .query(Q.on('history_missions', 'mission_id', this.id));

    @reader
    async getDistance() {
        let distance = 0;
        const waypoints = await this.waypointsWithCoordinates.fetch();
        for (let i = 0; i < waypoints.length - 1; i++) {
            distance += getDistance(waypoints[i].x, waypoints[i].y, waypoints[i + 1].x, waypoints[i + 1].y);
        }
        return distance;
    }

    @writer
    async changeTitle(title) {
        await this.update(mission => {
            mission.title = title
        })
    }

    @writer
    async delete() {
        const historyMissions =  this.collections.get("history_missions").query(Q.where("mission_id", this.id));
        await historyMissions.destroyAllPermanently?.();
        await this.waypoints.destroyAllPermanently();
        await this.destroyPermanently();
        return true;
    }
}