import {Model} from '@nozbe/watermelondb'
import {field, immutableRelation} from "@nozbe/watermelondb/decorators";

export default class HistoryMission extends Model {
    static table = "history_missions";
    static associations = {
        missions: {type: 'belongs_to', key: 'mission_id'},
        drones: {type: 'belongs_to', key: 'drone_id'},
    }

    @field("timestamp") timestamp
    @immutableRelation("missions", "mission_id") mission
    @immutableRelation("drones", "drone_id") drone
}