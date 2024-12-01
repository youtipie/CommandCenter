import {colors} from "../../../constants/styles";
import {View, StyleSheet} from "react-native";
import Modal from "../Modal";
import {useState} from "react";
import Section from "./components/Section";
import {useModal} from "../ModalProvider";

const PreflightCheckModal = ({onStartMission}) => {
    const {openModal, closeModal} = useModal();

    // Fetch later...
    const [stats, setStats] = useState([
        {
            label: "GPS status",
            expected: 3,
            actual: 6,
        },
        {
            label: "GPS SAT count",
            expected: 10,
            actual: 12,
        },
        {
            label: "Telemetry status",
            expected: 95,
            actual: 100,
            sign: "%"
        },
        {
            label: "Battery power",
            expected: 20,
            actual: 12.5,
            sign: "V"
        },
        {
            label: "All servos respond to input?",
        },
        {
            label: "All servos respond to pitch and roll?",
        },
        {
            label: "Servo linkages are secure?",
        },
        {
            label: "Camera is on and ready to fly?",
        }
    ]);

    const canProceed = !stats.some(
        (stat) => stat.actual !== undefined && stat.expected !== undefined && stat.actual < stat.expected
    );

    const handleProceed = () => {
        if (!canProceed) {
            openModal(() => (
                <Modal
                    title="Confirm action"
                    content="Some of the indicators have not been checked! It is not recommended to start the flight!"
                    buttonColor={colors.error300}
                    onPress={() => {
                        onStartMission();
                        closeModal();
                        closeModal();
                    }}
                    buttonText="Continue anyway"
                />
            ));
            return;
        }
        onStartMission();
        closeModal();
    }

    return (
        <Modal
            title="Preflight Check"
            buttonColor={colors.accent400}
            buttonText="Confirm"
            buttonStyle={{width: "50%"}}
            onPress={handleProceed}
            content={
                <View style={styles.container}>
                    {stats.map((stat, index) => (
                        <Section
                            key={index}
                            label={stat.label}
                            actual={stat.actual}
                            expected={stat.expected}
                            sign={stat.sign}
                        />
                    ))}
                </View>
            }
        />
    );
};

export default PreflightCheckModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
});