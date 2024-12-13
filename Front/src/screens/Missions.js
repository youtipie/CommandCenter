import {colors, fonts} from "../constants/styles";
import {FlatList, Text, View, StyleSheet} from "react-native";
import {moderateScale} from "../utils/metrics";
import {withObservables} from "@nozbe/watermelondb/react";
import MissionDAO from "../database/DAO/MissionDAO";
import MissionCard from "../components/MissionCard";

const Missions = ({missions}) => {

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
                    <MissionCard mission={itemData.item}/>
                )}
                style={{width: "100%"}}
            />
        </View>
    );
};

const enhance = withObservables([], () => ({
    missions: MissionDAO.observeMissions(),
}));

export default enhance(Missions);

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