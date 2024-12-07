import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {colors, commonIcons, fonts} from "../../../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../../../utils/metrics";
import {timestampToDateStr} from "../../../utils/timestampToDateStr";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import PopUpMenu from "../../../components/PopUpMenu";

const MissionCard = ({missionId, title, description, timestamp, onPress, popUpOptions}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Text style={styles.date}>{timestampToDateStr(timestamp)}</Text>
            <View style={styles.indexContainer}>
                <Text style={styles.index}>№{missionId}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentText}>{title}</Text>
                <Text style={styles.contentText}>{description}</Text>
            </View>
            <View style={styles.optionContainer}>
                <PopUpMenu options={popUpOptions}>
                    <FontAwesomeIcon
                        icon={commonIcons.dotsVertical}
                        color={colors.primaryText200}
                        size={moderateScale(24)}
                    />
                </PopUpMenu>
            </View>
        </TouchableOpacity>
    );
};

export default MissionCard;

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: colors.primary100,
        borderRadius: moderateScale(15),
        paddingVertical: verticalScale(20),
        paddingHorizontal: horizontalScale(15),
        marginVertical: verticalScale(5)
    },
    date: {
        position: "absolute",
        right: horizontalScale(15),
        top: verticalScale(5),
        textAlign: "right",
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(12),
        color: colors.secondaryText200,
    },
    index: {
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(14),
        color: colors.primaryText200,
    },
    indexContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    contentContainer: {
        flex: 1,
        marginHorizontal: horizontalScale(10),
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    contentText: {
        color: colors.primaryText200,
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(14)
    },
    optionContainer: {
        marginLeft: "auto",
        justifyContent: "center",
        alignItems: "center",
    }
});