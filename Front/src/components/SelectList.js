import {ScrollView, Text} from "react-native";
import PopUpMenu from "./PopUpMenu";
import {MenuOption} from "react-native-popup-menu";
import {verticalScale} from "../utils/metrics";

const SelectList = ({disabled, options, onSelect, textStyle, children}) => {

    return (
        disabled ? children
            :
            <PopUpMenu
                textStyle={textStyle}
                customBody={() => (
                    <ScrollView style={{maxHeight: verticalScale(200)}}>
                        {options.map((item, index) => (
                            <MenuOption onSelect={() => onSelect(item.value)} key={item.value}>
                                <Text style={textStyle}>{item.label}</Text>
                            </MenuOption>
                        ))}
                    </ScrollView>
                )}
            >
                {children}
            </PopUpMenu>
    );
};

export default SelectList;