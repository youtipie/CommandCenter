import {Model, Q} from '@nozbe/watermelondb'
import {lazy, text, writer} from "@nozbe/watermelondb/decorators";

export default class Drone extends Model {
    static table = "drones";
    static associations = {
        history_missions: {type: 'has_many', foreignKey: 'drone_id'},
    }

    @text("title") title
    @text("uri") uri

    @lazy
    missions = this.collections
        .get('missions')
        .query(Q.on('history_missions', 'drone_id', this.id));

    @writer
    async changeTitle(title) {
        await this.update(folder => {
            folder.title = title
        })
    }

    @writer
    async delete() {
        const historyMissions = await this.collections.get("history_missions").query(Q.where("drone_id", this.id));
        await historyMissions.destroyAllPermanently?.();
        await this.destroyPermanently();
        return true;
    }
}