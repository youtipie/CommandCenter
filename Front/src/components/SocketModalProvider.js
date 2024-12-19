import {createContext, useContext, useEffect, useState} from "react";
import {SERVER_URL, socket} from "../services/socket";
import LoadingSpinner from "./LoadingSpinner";
import ErrorModal from "./Modals/ErrorModal";
import {BackHandler, Pressable, StyleSheet} from "react-native";

const SocketModalContext = createContext(null);

const serverLoadingMsg = "Trying to connect to server...";
export const droneLoadingMsg = "Trying to connect to drone...";

const SocketModalProvider = ({children}) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState(serverLoadingMsg);
    const [modals, setModals] = useState([]);

    const openModal = (modal) => {
        setModals((prev) => [...prev, modal]);
    };

    const closeModal = () => {
        setModals((prev) => prev.slice(0, -1));
    };

    useEffect(() => {
        const handleBack = BackHandler.addEventListener("hardwareBackPress", () => {
            if (modals.length > 0) {
                closeModal();
                return true;
            }

            return false;
        });

        return () => handleBack.remove();
    }, [modals]);

    useEffect(() => {
        socket.connect();

        function handleConnect() {
            console.debug("Connected socket to", SERVER_URL)
            setIsConnected(true);
            setLoadingMessage(null);
            setError(null);
        }

        function handleDisconnect() {
            console.debug("Disconnected socket from", SERVER_URL)
            setLoadingMessage(serverLoadingMsg);
            setIsConnected(false);
        }

        function handleError(value) {
            console.log("Error", Object.entries(value));
            setLoadingMessage(serverLoadingMsg);
            setError(true);
            socket.connect();
        }

        function handleTimeout(value) {
            console.log("Timeout", value);
            setLoadingMessage(serverLoadingMsg);
            setError(true);
            socket.connect();
        }

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleError);
        socket.on('connect_timeout', handleTimeout);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleError);
            socket.off('connect_timeout', handleTimeout);
        };
    }, []);

    useEffect(() => {
        if (!isConnected || error) {
            setLoadingMessage(serverLoadingMsg);
        }
        if (!isConnected && error) {
            openModal(() => <ErrorModal
                text="There is error occured trying to connect to the server. Please wait while we try to reconnect."/>);
        }
    }, [isConnected, error]);

    return (
        <SocketModalContext.Provider value={{isConnected, socket, setLoadingMessage, openModal, closeModal}}>
            {children}
            {loadingMessage &&
                <LoadingSpinner label={loadingMessage} onDiscard={() => {
                }}/>}
            {modals.map((Modal, index) => (
                <Pressable key={index} onPress={closeModal} style={styles.modalBackdrop}>
                    <Modal/>
                </Pressable>
            ))}
        </SocketModalContext.Provider>
    );
};

export const useModal = () => {
    const {openModal, closeModal} = useContext(SocketModalContext);
    return {openModal, closeModal}
};
export const useSocket = () => useContext(SocketModalContext);

export default SocketModalProvider;

const styles = StyleSheet.create({
    modalBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000
    }
});