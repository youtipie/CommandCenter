import {View, StyleSheet, FlatList, Text} from "react-native";
import {colors, fonts} from "../constants/styles";
import Card from "../components/Card";
import {moderateScale} from "../utils/metrics";
import {useModal} from "../components/SocketModalProvider";
import {statuses} from "../constants/statuses";
import dronePopUpOptions from "../constants/dronePopUpOptions";
import {withObservables} from "@nozbe/watermelondb/react";
import DroneDAO from "../database/DAO/DroneDAO";
import useDroneData from "../hooks/useDroneData";
import {useNavigation} from "@react-navigation/native";


const RenderDroneCard = ({item}) => {
    const navigation = useNavigation();
    const {openModal, closeModal} = useModal();

    const droneData = useDroneData({
        connectionString: item.uri,
        verbose: false
    });

    const status = droneData ?
        droneData.have_mission && !droneData.is_mission_finished && droneData.mode === "AUTO" ? statuses["1"] : statuses["2"]
        : statuses["3"];

    return (
        <Card
            testID={`DroneCard`}
            key={droneData?.system_status}
            title={item.title}
            description={`Status: ${status.description}`}
            icon={status.icon}
            color={status.color}
            onPress={() => navigation.navigate("Details", {droneId: item.id})}
            popUpOptions={dronePopUpOptions(item, null, openModal, closeModal, navigation)}
        />
    );
}

const Drones = ({drones}) => {
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
                renderItem={({item}) => <RenderDroneCard item={item}/>}
                style={{width: "100%"}}
            />
        </View>
    );
};

const enhance = withObservables([], () => ({
    drones: DroneDAO.observeDrones(),
}));

export default enhance(Drones);

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