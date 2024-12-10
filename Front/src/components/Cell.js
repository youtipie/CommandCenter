import ScalableText from "./ScalableText";
import {TextInput, View} from "react-native";
import {useState} from "react";
import {colors} from "../constants/styles";

const Cell = ({isEditing, onChange, style, children}) => {
    const [value, setValue] = useState(children.toString());

    const handleValueChange = (value) => {
        const decimalRegex = /^-?\d*\.?\d*$/;
        if (decimalRegex.test(value)) {
            if (value === "") {
                setValue("0");
                onChange?.(0);
            } else {
                setValue(value);
                onChange?.(value);
            }
        }
    }

    return (
        isEditing ?
            <View>
                <TextInput
                    style={style}
                    value={value}
                    onChangeText={handleValueChange}
                    cursorColor={colors.secondaryText200}
                    multiline={false}
                    autoFocus={false}
                    maxLength={15}
                    underlineColorAndroid="transparent"
                />
            </View>
            :
            <ScalableText style={style}>{children}</ScalableText>
    );
};

export default Cell;