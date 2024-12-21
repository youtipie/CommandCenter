import {StyleSheet, Text, View} from "react-native";
import {colors, commonIcons, fonts} from "../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../utils/metrics";
import SelectDropdown from "react-native-select-dropdown";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

const SelectField = ({onSelect, options, wrapperStyle}) => {

    return (
        <SelectDropdown
            testID="SelectField"
            data={options}
            onSelect={onSelect}
            renderButton={(selectedItem) => (
                <View style={[styles.selectWrapper, wrapperStyle]}>
                    <FontAwesomeIcon
                        icon={commonIcons.optionsDown}
                        color={colors.primaryText200}
                        size={moderateScale(20)}
                    />
                    <Text
                        style={styles.label}
                        numberOfLines={1}>{selectedItem ? selectedItem.label : "Select below"}
                    </Text>
                </View>
            )}
            renderItem={(item, index, isSelected) => (
                <View style={styles.optionWrapper}>
                    <Text
                        style={[styles.label, isSelected ? styles.selected : {}]}
                    >
                        {item.label}
                    </Text>
                </View>
            )}
            dropdownStyle={styles.dropdownContainer}
            dropdownOverlayColor="transparent"
        />
    );
};

export default SelectField;

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
    dropdownContainer: {
        marginTop: verticalScale(-30),
        backgroundColor: colors.primary100,
        padding: moderateScale(5),
        borderRadius: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    selected: {
        color: colors.success100,
    },
    selectWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: verticalScale(5),
        borderBottomWidth: 1,
        borderBottomColor: colors.primaryText200,
    }
});