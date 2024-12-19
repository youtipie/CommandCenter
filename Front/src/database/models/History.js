import {Model, Q} from '@nozbe/watermelondb'
import {field, relation, writer} from "@nozbe/watermelondb/decorators";

export default class HistoryMission extends Model {
    static table = "history_missions";
    static associations = {
        missions: {type: 'belongs_to', key: 'mission_id'},
        drones: {type: 'belongs_to', key: 'drone_id'},
    }

    @field("timestamp") timestamp
    @relation("missions", "mission_id") mission
    @relation("drones", "drone_id") drone

    @writer
    async delete() {
        await this.destroyPermanently();
        return true;
    }
}