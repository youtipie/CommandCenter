import Modal from "./Modal";
import {StyleSheet, Text, View} from "react-native";
import {colors, fonts} from "../../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../../utils/metrics";
import {useState} from "react";
import SelectField from "../SelectField";

const SelectModal = ({title, onSelect, options}) => {
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);

    const handleSelect = () => {
        if (!selected) {
            setError("This field cannot be empty!");
            return;
        }

        onSelect(selected);
    }

    return (
        <Modal
            title={title}
            buttonColor={colors.accent400}
            buttonText="Confirm"
            onPress={handleSelect}
            content={
                <View style={styles.container}>
                    {error &&
                        <Text style={styles.error}>{error}</Text>
                    }
                    <SelectField
                        onSelect={setSelected}
                        options={options}
                        wrapperStyle={styles.wrapperStyle}
                    />
                </View>
            }
        />
    );
};

export default SelectModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        marginTop: verticalScale(-15),
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(16),
        textAlign: "center",
        color: colors.error200,
    },
    wrapperStyle: {
        width: horizontalScale(300)
    }
});