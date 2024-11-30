import {View, StyleSheet, Text, TextInput} from "react-native";
import {horizontalScale, moderateScale, verticalScale} from "../utils/metrics";
import {colors, fonts} from "../constants/styles";
import {useState} from "react";

const InputWithErrors = ({label, error, onChangeValue}) => {
    const [text, setText] = useState("");

    const handleValueChange = (text) => {
        setText(text);
        onChangeValue(text);
    }

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.error, {opacity: error ? 1 : 0}]}>{error}</Text>
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleValueChange}
                        value={text}
                        cursorColor={colors.secondaryText200}
                        multiline={false}
                        autoFocus={false}
                        maxLength={100}
                        underlineColorAndroid="transparent"
                    />
                </View>
            </View>
        </View>
    );
};

export default InputWithErrors;

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: verticalScale(10)
    },
    container: {
        borderWidth: 2,
        borderColor: 'rgba(163, 163, 163, 0.4)',
        padding: moderateScale(2),
    },
    label: {
        fontFamily: fonts.primaryRegular,
        color: colors.secondaryText100,
        fontSize: moderateScale(16),
    },
    inputWrapper: {
        marginTop: verticalScale(-5),
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: horizontalScale(10),
        paddingBottom: verticalScale(10),
    },
    input: {
        width: "100%",
        height: moderateScale(50),
        borderBottomWidth: 1,
        borderColor: colors.accent300,
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(18),
        color: colors.primaryText200,
    },
    error: {
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(20),
        color: colors.error200,
        textAlign: "center"
    }
});