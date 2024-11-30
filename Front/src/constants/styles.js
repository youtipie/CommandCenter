import {
    faCaretDown,
    faCaretUp,
    faCheck,
    faCheckCircle,
    faCircleExclamation,
    faCircleInfo,
    faCircleMinus,
    faCirclePlus,
    faCircleXmark,
    faEllipsis,
    faEllipsisVertical,
    faEye,
    faGamepad,
    faHelicopterSymbol,
    faListCheck,
    faLocationDot,
    faMagnifyingGlass,
    faMapMarkedAlt,
    faPaperPlane,
    faPen,
    faRecycle,
    faReplyAll,
    faShareNodes,
    faSliders,
    faTrashCan,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import {moderateScale} from "../utils/metrics";
import {faCirclePlay, faMinusSquare, faPenToSquare} from "@fortawesome/free-regular-svg-icons";

export const colors = {
    primary100: "#121212",
    primary200: "#1E1E1E",
    accent100: "#BB86FC",
    accent200: "#FF6F61",
    accent300: "#03DAC5",
    accent400: "#4CAF50",
    primaryText100: "#FFFFFF",
    primaryText200: "#E0E0E0",
    secondaryText100: "#B0B0B0",
    secondaryText200: "#A3A3A3",
    success100: "#4CAF50",
    success200: "#81C784",
    warning100: "#FFC107",
    warning200: "#FFEB3B",
    error100: "#CF6679",
    error200: "#FF5252",
    error300: "#B0504C",
}

export const fonts = {
    primaryRegular: "montserrat-regular",
    primaryBold: "montserrat-bold",
}

export const drawerIcons = {
    commandCenter: faEye,
    drones: faHelicopterSymbol,
    missions: faPaperPlane,
    about: faCircleInfo
}

export const headerStyle = {
    headerStyle: {
        backgroundColor: colors.primary100,
    },
    headerTitleStyle: {
        fontSize: moderateScale(24),
        fontFamily: fonts.primaryBold,
    },
    headerTitleContainerStyle: {
        width: "100%",
    },
    headerTintColor: colors.primaryText100,
};


export const commonIcons = {
    addCircle: faCirclePlus,
    minusCircle: faCircleMinus,
    minusSquare: faMinusSquare,
    editSquare: faPenToSquare,
    dotsHorizontal: faEllipsis,
    dotsVertical: faEllipsisVertical,
    check: faCheck,
    edit: faPen,
    share: faShareNodes,
    restore: faRecycle,
    trash: faTrashCan,
    confirmCircle: faCheckCircle,
    crossCircle: faCircleXmark,
    cross: faXmark,
    optionsDown: faCaretDown,
    optionsUp: faCaretUp,
    info: faCircleExclamation,
    options: faSliders,
    instructions: faListCheck,
    mission: faMapMarkedAlt
}

export const dronePopUpIcons = {
    startMission: faCirclePlay,
    observeDrone: faMagnifyingGlass,
    RTL: faReplyAll,
    guidedControl: faGamepad,
    renameDrone: faPenToSquare,
    deleteDrone: faTrashCan
}

export const missionPopUpIcons = {
    startMission: faCirclePlay,
    editMission: faLocationDot,
    renameMission: faPenToSquare,
    deleteMission: faTrashCan
}