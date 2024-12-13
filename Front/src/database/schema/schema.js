import {appSchema, tableSchema} from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "waypoints",
            columns: [
                {name: "mission_id", type: "string"},
                {name: "command", type: "number"},
                {name: "param1", type: "number"},
                {name: "param2", type: "number"},
                {name: "param3", type: "number"},
                {name: "param4", type: "number"},
                {name: "x", type: "number"},
                {name: "y", type: "number"},
                {name: "z", type: "number"},
                {name: "order", type: "number"},
            ]
        }),
        tableSchema({
            name: "missions",
            columns: [
                {name: "title", type: "string"},
            ]
        }),
        tableSchema({
            name: "drones",
            columns: [
                {name: "title", type: "string"},
                {name: "uri", type: "string"},
            ]
        }),
        tableSchema({
            name: "history_missions",
            columns: [
                {name: "mission_id", type: "string"},
                {name: "drone_id", type: "string"},
                {name: "timestamp", type: "number"},
            ]
        }),
    ]
})