import {useState} from "react";
import {colors, commonIcons, fonts, missionPopUpIcons} from "../constants/styles";
import {useModal} from "../components/Modals/ModalProvider";
import {FlatList, Text, View, StyleSheet} from "react-native";
import Card from "../components/Card";
import {moderateScale} from "../utils/metrics";
import Modal from "../components/Modals/Modal";
import RenameModal from "../components/Modals/RenameModal";
import SelectModal from "../components/Modals/SelectModal";
import PreflightCheckModal from "../components/Modals/PreflightCheckModal";
import missionPopUpOptions from "../constants/missionPopUpOptions";

const Missions = ({navigation}) => {
    const {openModal, closeModal} = useModal();

    const [missions, setMissions] = useState([
        {
            id: 10,
            title: "Mission 1",
            description: "15 waypoints, 1500 meters",
            color: colors.secondaryText100,
            icon: commonIcons.mission
        },
        {
            id: 11,
            title: "Very long mission name so it wont fit, right?",
            description: "150 waypoints, 15000 meters",
            color: colors.secondaryText100,
            icon: commonIcons.mission
        }
    ]);

    const onDeletion = (missionId) => {
        setMissions(missions.filter(mission => mission.id !== missionId));
    }

    return (
        <View style={styles.root}>
            <FlatList
                data={missions}
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
                        onPress={() => (
                            navigation.navigate("Mission", {missionId: itemData.item.id, editable: false})
                        )}
                        popUpOptions={missionPopUpOptions(itemData.item.id, openModal, closeModal, navigation, onDeletion)}
                    />
                )}
                style={{width: "100%"}}
            />
        </View>
    );
};

export default Missions;

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