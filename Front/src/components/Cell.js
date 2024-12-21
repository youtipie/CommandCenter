import ScalableText from "./ScalableText";
import {TextInput, View} from "react-native";
import {colors} from "../constants/styles";

const Cell = ({isEditing, onChange, style, children, testID = "TableCell"}) => {

    const handleValueChange = (value) => {
        const decimalRegex = /^-?\d*\.?\d*$/;
        if (decimalRegex.test(value)) {
            if (value === "") {
                onChange?.(0);
            } else {
                value = value.replace(/^0/, "");
                onChange?.(value);
            }
        }
    }

    return (
        isEditing ?
            <View>
                <TextInput
                    testID={testID}
                    style={style}
                    defaultValue={children.toString()}
                    onChangeText={handleValueChange}
                    cursorColor={colors.secondaryText200}
                    multiline={false}
                    autoFocus={false}
                    maxLength={15}
                    underlineColorAndroid="transparent"
                />
            </View>
            :
            <ScalableText testID={testID} style={style}>{children}</ScalableText>
    );
};

export default Cell;