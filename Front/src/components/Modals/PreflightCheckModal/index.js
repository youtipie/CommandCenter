import {colors} from "../../../constants/styles";
import {View, StyleSheet} from "react-native";
import Modal from "../Modal";
import Section from "./components/Section";
import {useModal} from "../../SocketModalProvider";
import useDroneData from "../../../hooks/useDroneData";

const PreflightCheckModal = ({drone, droneData, onStartMission}) => {
    const {openModal, closeModal} = useModal();

    if (!droneData) {
        droneData = useDroneData({
            connectionString: drone.uri,
            verbose: true
        });
    }

    const stats = [
        {
            label: "GPS status",
            expected: 3,
            actual: droneData?.gps.fix_type,
        },
        {
            label: "GPS SAT count",
            expected: 10,
            actual: droneData?.gps.satellites_visible,
        },
        {
            label: "Telemetry status",
            expected: 95,
            actual: droneData?.link_quality,
            sign: "%"
        },
        {
            label: "Battery power",
            expected: 10,
            actual: droneData?.battery.voltage,
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
    ];

    const canProceed = !stats.some(
        (stat) => stat.actual !== undefined && stat.expected !== undefined && stat.actual < stat.expected
    );

    const handleProceed = () => {
        if (!canProceed) {
            openModal(() => (
                <Modal
                    testID="ConfirmModal"
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
        droneData &&
        <Modal
            testID='PreflightCheckModal'
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