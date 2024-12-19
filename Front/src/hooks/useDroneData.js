import {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {droneLoadingMsg, useModal, useSocket} from "../components/SocketModalProvider";
import {nanoid} from "nanoid/non-secure";
import {connectDrone} from "../services/api";
import ErrorModal from "../components/Modals/ErrorModal";

const UseDroneData = ({
                          connectionString,
                          onInvalidUri,
                          onConnect,
                          onBeforeConnect,
                          onDisconnect,
                          onError,
                          onTimeout,
                          onStreamStatus,
                          verbose
                      }) => {
    const {openModal} = useModal();
    const {socket, isConnected, setLoadingMessage} = useSocket();
    const [roomId] = useState(nanoid());
    const [droneData, setDroneData] = useState(null);

    useFocusEffect(useCallback(() => {
        if (isConnected) {
            verbose && setLoadingMessage(droneLoadingMsg);
            socket.emit("start_stream_status", {room: roomId, connection_string: connectionString});

            socket.on(`drone_status_${roomId}`, (data) => setDroneData(data));

            return () => {
                socket.emit("stop_stream_status", {room: roomId});
                socket.off(`drone_status_${roomId}`);
            }
        }
    }, [isConnected]));

    useFocusEffect(useCallback(() => {
        if (droneData?.success === true) {
            verbose && setLoadingMessage(null);
        } else {
            verbose && setLoadingMessage(droneLoadingMsg);
            const isSuccessful = (async () => await connectDrone(connectionString))();
            if (!isSuccessful && verbose) {
                openModal(() => <ErrorModal/>);
            }
        }
    }, [droneData]))

    return droneData?.status;
};

export default UseDroneData;