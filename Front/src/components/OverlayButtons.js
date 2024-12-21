import {useRef} from "react";
import {TouchableOpacity, View, StyleSheet} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {horizontalScale, moderateScale, verticalScale} from "../utils/metrics";
import {colors, dronePopUpIcons} from "../constants/styles";
import {faArrowsToDot, faLayerGroup} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modals/Modal";
import {useModal} from "./SocketModalProvider";
import axios from "axios";
import {SERVER_URL} from "../services/socket";
import ErrorModal from "./Modals/ErrorModal";

const OverlayButtons = ({drone, cameraRef, centerLocation, onStyleURLChange, styleURLs}) => {
    const isEditing = !Boolean(drone);
    const {openModal, closeModal} = useModal();
    const mapTypes = useRef(styleURLs);

    const RTL = () => {
        openModal(() => (
            <Modal
                testID="RTLModal"
                title="Confirm action"
                content="Drone won't be able to continue its mission."
                buttonText="Confirm"
                buttonColor={colors.error300}
                onPress={async () => {
                    try {
                        await axios.post(SERVER_URL + "/drone/rtl", {
                            "connection_string": drone.uri
                        });
                    } catch (e) {
                        openModal(() => <ErrorModal/>);
                    }
                    closeModal();
                }}
            />
        ));
    }

    const centerOnLocation = () => {
        cameraRef.current?.setCamera({
            zoomLevel: 12,
            centerCoordinate: centerLocation,
            animationDuration: 1
        });
    }

    const changeMapLayer = () => {
        const nextType = mapTypes.current.push(mapTypes.current.shift()) && mapTypes.current[mapTypes.current.length - 1];
        onStyleURLChange(nextType);
    }

    return (
        <View style={styles.container}>
            {!isEditing && (
                <TouchableOpacity testID="RTLButton" style={styles.buttonContainer} onPress={RTL}>
                    <FontAwesomeIcon
                        icon={dronePopUpIcons.RTL}
                        color={colors.primaryText100}
                        size={moderateScale(21)}
                    />
                </TouchableOpacity>
            )}
            <TouchableOpacity testID="CenterButton" style={styles.buttonContainer} onPress={centerOnLocation}>
                <FontAwesomeIcon
                    icon={faArrowsToDot}
                    color={colors.primaryText100}
                    size={moderateScale(21)}
                />
            </TouchableOpacity>
            <TouchableOpacity testID="ChangeLayerButton" style={styles.buttonContainer} onPress={changeMapLayer}>
                <FontAwesomeIcon
                    icon={faLayerGroup}
                    color={colors.primaryText100}
                    size={moderateScale(21)}
                />
            </TouchableOpacity>
        </View>
    );
};

export default OverlayButtons;

const styles = StyleSheet.create({
    container: {
        marginLeft: "auto",
        maxWidth: "99%"
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary100,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateScale(10),
        marginVertical: verticalScale(5),
        marginHorizontal: horizontalScale(15),
    }
});