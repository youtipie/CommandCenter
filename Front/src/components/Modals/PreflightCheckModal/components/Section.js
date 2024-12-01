import {View, StyleSheet, Text} from "react-native";
import {colors, fonts} from "../../../../constants/styles";
import {moderateScale, verticalScale} from "../../../../utils/metrics";

const Section = ({label, expected, actual, sign}) => {
    let borderColor = colors.secondaryText200;

    if (expected && actual) {
        borderColor = actual >= expected ? colors.success100 : colors.error200;
    }

    return (
        <View style={[styles.container, {borderColor: borderColor}]}>
            <Text style={styles.text}>{label}</Text>
            {actual && expected &&
                <Text style={styles.text}>{actual}{sign}>={expected}{sign}</Text>
            }
        </View>
    );
};

export default Section;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: moderateScale(10),
        marginVertical: verticalScale(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
    },
    text: {
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(18),
        color: colors.primaryText200,
    }
});