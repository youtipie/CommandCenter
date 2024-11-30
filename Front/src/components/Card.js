import {View, StyleSheet, Text} from "react-native";
import {colors, commonIcons, fonts} from "../constants/styles";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {moderateScale} from "../utils/metrics";
import PopUpMenu from "./PopUpMenu";

const Card = ({item, popUpOptions}) => {
    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <FontAwesomeIcon icon={item.icon} color={item.color} size={moderateScale(64)}/>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>{item.title}</Text>
                    <PopUpMenu options={popUpOptions}>
                        <FontAwesomeIcon
                            icon={commonIcons.dotsVertical}
                            size={moderateScale(20)}
                            color={colors.primaryText200}
                        />
                    </PopUpMenu>
                </View>
                <Text style={styles.description}>Status: {item.description}</Text>
            </View>
        </View>
    );
};

export default Card;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary100,
        padding: moderateScale(15),
        borderRadius: moderateScale(8),
        marginBottom: moderateScale(15),
    },
    iconContainer: {
        marginRight: moderateScale(15),
    },
    detailsContainer: {
        flex: 1,
        height: "100%",
        justifyContent: "space-between",
    },
    titleWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        flex: 1,
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(20),
        color: colors.primaryText200,
    },
    description: {
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(16),
        color: colors.secondaryText200,
    }
});