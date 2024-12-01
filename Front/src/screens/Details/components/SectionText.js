import {Text, StyleSheet} from "react-native";
import {moderateScale} from "../../../utils/metrics";
import {colors, fonts} from "../../../constants/styles";

const SectionText = ({children}) => {
    return (
        <Text style={styles.text}>{children}</Text>
    );
};

export default SectionText;

const styles = StyleSheet.create({
    text: {
        fontSize: moderateScale(20),
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText200,
        lineHeight: moderateScale(30)
    }
});