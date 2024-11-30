import {createContext, useState, useContext, useEffect} from 'react';
import {BackHandler, Pressable, StyleSheet, TouchableWithoutFeedback} from "react-native";

const ModalContext = createContext(null);

const ModalProvider = ({children}) => {
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

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            {modals.map((Modal, index) => (
                <Pressable key={index} onPress={closeModal} style={styles.modalBackdrop}>
                    <Modal/>
                </Pressable>
            ))}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
export default ModalProvider;

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