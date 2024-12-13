import {Model, Q} from '@nozbe/watermelondb'
import {children, lazy, text, writer} from "@nozbe/watermelondb/decorators";
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

    @writer
    async changeTitle(title) {
        await this.update(mission => {
            mission.title = title
        })
    }

    @writer
    async delete() {
        const historyMissions = await this.collections.get("history_missions").query(Q.where("mission_id", this.id));
        await historyMissions.destroyAllPermanently?.();
        await this.waypoints.destroyAllPermanently();
        await this.destroyPermanently();
        return true;
    }
}