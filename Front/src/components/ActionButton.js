import {Text, TouchableOpacity, StyleSheet} from "react-native";
import {moderateScale} from "../utils/metrics";
import {colors, fonts} from "../constants/styles";

const ActionButton = ({color, text, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: color}]}>
            <Text style={styles.text}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default ActionButton;

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        padding: moderateScale(5),
        borderRadius: 3,
    },
    text: {
        fontSize: moderateScale(16),
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText200
    }
});