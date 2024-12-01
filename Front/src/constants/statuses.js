import {faPlane, faPlaneCircleCheck, faPlaneCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {colors} from "./styles";

export const statuses = {
    1: {description: "Mission in progress", icon: faPlane, color: colors.success100},
    2: {description: "Waiting for orders", icon: faPlaneCircleCheck, color: colors.success100},
    3: {description: "Offline", icon: faPlaneCircleXmark, color: colors.error200},
};