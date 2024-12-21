import {View, StyleSheet, Text, TextInput} from "react-native";
import Modal from "./Modal";
import {colors, fonts} from "../../constants/styles";
import {useState} from "react";
import {horizontalScale, moderateScale} from "../../utils/metrics";
import {useModal} from "../SocketModalProvider";

const RenameModal = ({onRename}) => {
    const {closeModal} = useModal();
    const [error, setError] = useState(null);
    const [text, setText] = useState("");

    const handleRename = () => {
        if (text.length === 0) {
            setError("Name cannot be empty!");
            return;
        }

        onRename(text);
        closeModal();
    }

    return (
        <Modal
            title="Choose new name"
            buttonColor={colors.accent400}
            buttonText="Confirm"
            onPress={handleRename}
            content={
                <View style={styles.container}>
                    {error &&
                        <Text testID="RenameError" style={styles.error}>{error}</Text>
                    }
                    <TextInput
                        testID="RenameField"
                        style={styles.input}
                        onChangeText={setText}
                        value={text}
                        placeholder="Enter new name"
                        placeholderTextColor={colors.secondaryText200}
                        cursorColor={colors.secondaryText200}
                        multiline={false}
                        autoFocus={true}
                        maxLength={100}
                        underlineColorAndroid="transparent"
                    />
                </View>
            }
        />
    );
};

export default RenameModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(16),
        textAlign: "center",
        color: colors.error200,
    },
    input: {
        width: horizontalScale(300),
        height: moderateScale(50),
        borderBottomWidth: 1,
        borderColor: colors.primaryText200,
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(18),
        color: colors.primaryText200,
    }
});