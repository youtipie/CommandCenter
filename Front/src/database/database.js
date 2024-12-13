import {Database} from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from "./schema/schema";
import migrations from "./migrations";
import Mission from "./models/Mission";
import Drone from "./models/Drone";
import Waypoint from "./models/Waypoint";
import History from "./models/History";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";

const adapter = new LokiJSAdapter({
    schema,
    migrations,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
    }
})


const database = new Database({
    adapter,
    modelClasses: [Mission, Drone, Waypoint, History],
})

export default database;