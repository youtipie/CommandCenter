import {useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {colors, commonIcons, fonts} from "../constants/styles";
import {moderateScale, verticalScale} from "../utils/metrics";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import InputWithErrors from "../components/InputWithErrors";
import {useNavigation} from "@react-navigation/native";

const AddDrone = () => {
    const navigation = useNavigation();

    const [form, setForm] = useState({
        name: "",
        ip: "",
        port: ""
    });

    const [errors, setErrors] = useState({
        name: null,
        ip: null,
        port: null
    });

    const handleFormChange = (field, value) => {
        setForm({...form, [field]: value});
    }

    const validateIP = (value) => {
        const ipv4Pattern =
            /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Pattern =
            /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        if (ipv4Pattern.test(value) || ipv6Pattern.test(value)) {
            return true;
        }
        return "IP address is invalid!"
    }

    const validatePort = (value) => {
        value = Number(value);
        if (isNaN(value)) {
            return "Port must be integer number!"
        }
        if (0 < value && value <= 65535) {
            return true;
        }
        return "Port must be in range [1; 65535]!"
    }

    const validateForm = () => {
        let formErrors = {};
        if (!form.name) {
            formErrors.name = "This field cannot be empty!";
        }
        const ipValidation = validateIP(form.ip);
        if (ipValidation !== true) {
            formErrors.ip = ipValidation;
        }
        const portValidation = validatePort(form.port);
        if (portValidation !== true) {
            formErrors.port = portValidation;
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    }

    const handleAddButton = () => {
        if (!validateForm()) {
            return;
        }
        console.log("Added drone!");
        navigation.navigate("Drawer", {screen: "Drones"});
    }

    return (
        <ScrollView contentContainerStyle={styles.root}>
            <Text style={styles.text}><FontAwesomeIcon
                icon={commonIcons.info}
                color={colors.accent300}
                size={moderateScale(20)}
            /> Make sure your drone has internet access so that the app can connect to your drone. The connection is
                made using the UDP protocol, so make sure your drone supports this connection.</Text>
            <InputWithErrors
                label="Name"
                error={errors.name}
                onChangeValue={(value) => handleFormChange("name", value)}

            />
            <InputWithErrors
                label="IP Adress"
                error={errors.ip}
                onChangeValue={(value) => handleFormChange("ip", value)}
            />
            <InputWithErrors
                label="Port"
                error={errors.port}
                onChangeValue={(value) => handleFormChange("port", value)}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddButton}>
                <Text style={[styles.text, styles.buttonText]}>Add Drone</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddDrone;

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        backgroundColor: colors.primary200,
        padding: moderateScale(20),
    },
    text: {
        fontFamily: fonts.primaryRegular,
        fontSize: moderateScale(20),
        color: colors.primaryText200
    },
    button: {
        width: "70%",
        marginHorizontal: "auto",
        paddingVertical: verticalScale(5),
        backgroundColor: colors.accent400,
        borderRadius: moderateScale(25),
    },
    buttonText: {
        fontSize: moderateScale(24),
        textTransform: "uppercase",
        textAlign: "center"
    }
});