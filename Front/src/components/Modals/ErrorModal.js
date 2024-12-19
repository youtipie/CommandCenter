import {colors} from "../../constants/styles";
import Modal from "./Modal";
import {useModal} from "../SocketModalProvider";

const ErrorModal = ({text}) => {
    const {closeModal} = useModal();

    return (
        <Modal
            title="Some error occured"
            buttonColor={colors.accent400}
            buttonText="Ok"
            buttonStyle={{width: "30%"}}
            onPress={closeModal}
            content={text || "Couldn't connect to drone. Make sure it is running and try again later."}
        />
    );
};

export default ErrorModal;