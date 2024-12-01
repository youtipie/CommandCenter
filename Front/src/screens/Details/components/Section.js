import {View, Text, StyleSheet} from "react-native";
import {colors, fonts} from "../../../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../../../utils/metrics";

const Section = ({title, children}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.contentWrapper}>{children}</View>
        </View>
    );
};

export default Section;

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(10)
    },
    title: {
        fontFamily: fonts.primaryBold,
        fontSize: moderateScale(22),
        color: colors.primaryText200
    },
    contentWrapper: {
        paddingHorizontal: horizontalScale(10),
    }
});