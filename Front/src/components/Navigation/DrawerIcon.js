import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {View, StyleSheet} from "react-native";
import {colors} from "../../constants/styles";

const DrawerIcon = ({icon, color, size, focused}) => {
    return (
        <View style={styles.iconWrapper}>
            <FontAwesomeIcon
                icon={icon}
                color={focused ? colors.accent300 : color}
                size={size}
            />
        </View>
    );
};

export default DrawerIcon;

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
    }
});