import axios from "axios";
import {SERVER_URL} from "./socket";

export const connectDrone = async (connectionString) => {
    try {
        await axios.post(SERVER_URL + "/drone/connect", {
            "connection_string": connectionString
        });
        return true;
    } catch (e) {
        console.log("API ERROR:", e);
        return false;
    }
}
