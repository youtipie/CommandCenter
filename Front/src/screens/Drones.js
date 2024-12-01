import {View, StyleSheet, FlatList, Text} from "react-native";
import {colors, dronePopUpIcons, fonts} from "../constants/styles";
import Card from "../components/Card";
import {moderateScale} from "../utils/metrics";
import {useModal} from "../components/Modals/ModalProvider";
import {useState} from "react";
import Modal from "../components/Modals/Modal";
import RenameModal from "../components/Modals/RenameModal";
import SelectModal from "../components/Modals/SelectModal";
import PreflightCheckModal from "../components/Modals/PreflightCheckModal";
import {useNavigation} from "@react-navigation/native";
import {statuses} from "../constants/statuses";
import dronePopUpOptions from "../constants/dronePopUpOptions";


const Drones = () => {
    const {openModal, closeModal} = useModal();
    const navigation = useNavigation();

    const [drones, setDrones] = useState([
        {
            id: 10,
            title: "DJi mavick pro 15",
            ...statuses["1"]
        },
        {
            id: 11,
            title: "DJi mavick pro 15",
            ...statuses["2"]
        },
        {
            id: 12,
            title: "DJi mavick pro 15",
            ...statuses["3"]
        }
    ]);

    const onDeletion = (droneId) => {
        setDrones(drones.filter(drone => drone.id !== droneId));
    }

    return (
        <View style={styles.root}>
            <FlatList
                data={drones}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.contentContainerStyle}
                ListEmptyComponent={
                    <View style={styles.emptyWrapper}>
                        <Text style={styles.emptyText}>There is nothing here...</Text>
                    </View>
                }
                renderItem={(itemData) => (
                    <Card
                        item={itemData.item}
                        onPress={() => navigation.navigate("Details", {droneId: itemData.item.id})}
                        popUpOptions={dronePopUpOptions(itemData.item.id, openModal, closeModal, onDeletion)}
                    />
                )}
                style={{width: "100%"}}
            />
        </View>
    );
};

export default Drones;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary200,
    },
    contentContainerStyle: {
        padding: moderateScale(20)
    },
    emptyWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyText: {
        color: colors.secondaryText200,
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(16)
    }
});