import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {colors, fonts} from "../constants/styles";
import {horizontalScale, moderateScale} from "../utils/metrics";

const PopUpMenu = ({children, options}) => {
    return (
        <Menu>
            <MenuTrigger customStyles={{TriggerTouchableComponent: TouchableOpacity}}>
                {children}
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.optionsContainerStyle}>
                {options.map((option, index) => (
                    <MenuOption onSelect={option.onSelect} key={index}>
                        <View style={styles.optionWrapper}>
                            <View style={styles.iconWrapper}>
                                <FontAwesomeIcon
                                    icon={option.icon}
                                    color={colors.primaryText200}
                                    size={moderateScale(18)}
                                />
                            </View>
                            <Text style={styles.label}>{option.label}</Text>
                        </View>
                    </MenuOption>
                ))}
            </MenuOptions>
        </Menu>
    );
};

export default PopUpMenu;

const styles = StyleSheet.create({
    optionWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        marginLeft: horizontalScale(5),
        fontSize: moderateScale(18),
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText200
    },
    optionsContainerStyle: {
        backgroundColor: colors.primary100,
        padding: moderateScale(5),
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    iconWrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: moderateScale(20),
    }
});