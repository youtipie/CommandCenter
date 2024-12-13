import {Model} from '@nozbe/watermelondb'
import {field, relation, writer} from "@nozbe/watermelondb/decorators";

export default class Waypoint extends Model {
    static table = "waypoints";
    static associations = {
        missions: {type: "belongs_to", foreignKey: "mission_id  "}
    };

    @field("command") command
    @field("param1") param1
    @field("param2") param2
    @field("param3") param3
    @field("param4") param4
    @field("x") x
    @field("y") y
    @field("z") z
    @field("order") order
    @relation("missions", "mission_id") mission

    @writer
    async changeOrder(order) {
        await this.update(waypoint => {
            waypoint.order = order
        })
    }
    @writer
    async changeParam(field, value) {
        await this.update(waypoint => {
            waypoint[field] = value;
        })
    }

    @writer
    async delete() {
        await this.destroyPermanently();
    }
}