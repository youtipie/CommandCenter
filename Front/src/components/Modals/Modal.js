import {Text, View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {colors, commonIcons, fonts} from "../../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../../utils/metrics";
import ActionButton from "../ActionButton";

const Modal = ({title, content, buttonStyle, buttonColor, buttonText, onPress, testID="Modal"}) => {
    return (
        <TouchableWithoutFeedback
            testID={testID}
            onPress={() => null}>
            <View style={styles.modal}>
                <View style={styles.header}>
                    <FontAwesomeIcon
                        icon={commonIcons.info}
                        size={moderateScale(18)}
                        color={colors.accent300}
                    />
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.contentWrapper}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>{content}</Text>
                    </View>
                    <View style={styles.buttonsWrapper}>
                        <ActionButton
                            wrapperStyle={buttonStyle}
                            color={buttonColor}
                            onPress={onPress}
                            text={buttonText}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Modal;

const styles = StyleSheet.create({
    modal: {
        padding: moderateScale(10),
        backgroundColor: colors.primary100,
        maxWidth: "90%",
        shadowColor: "black",
        shadowOffset: {width: 0, height: 2,},
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 2,
        borderRadius: 5,
        zIndex: 1001
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: colors.primary200,
        paddingHorizontal: horizontalScale(5),
        paddingVertical: verticalScale(10),
    },
    title: {
        fontSize: moderateScale(18),
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText200,
        marginLeft: horizontalScale(5)
    },
    contentWrapper: {
        padding: moderateScale(10),
    },
    contentContainer: {
        paddingVertical: verticalScale(10),
    },
    content: {
        fontSize: moderateScale(18),
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText200,
        textAlign: "center"
    },
    buttonsWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: verticalScale(5)
    },
    leftButtonContainer: {
        marginHorizontal: horizontalScale(5),
        backgroundColor: colors.error200,
    },
    rightButtonContainer: {
        marginHorizontal: horizontalScale(5),
        backgroundColor: colors.success100,
    }
});