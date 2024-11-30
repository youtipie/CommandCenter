import {createStackNavigator} from "@react-navigation/stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer, useNavigation} from "@react-navigation/native";
import Drones from "../../screens/Drones";
import {commonIcons, drawerIcons, headerStyle} from "../../constants/styles";
import {horizontalScale, moderateScale} from "../../utils/metrics";
import {colors, fonts} from "../../constants/styles";
import DrawerIcon from "./DrawerIcon";
import DrawerCustomContent from "./DrawerContent";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {TouchableOpacity, View} from "react-native";
import About from "../../screens/About";
import {MenuProvider} from "react-native-popup-menu";
import ModalProvider, {useModal} from "../Modals/ModalProvider";
import Missions from "../../screens/Missions";
import AddDrone from "../../screens/AddDrone";
import RenameModal from "../Modals/RenameModal";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    const navigation = useNavigation();
    const {openModal} = useModal();

    const drawerScreens = [
        {
            name: 'Drones', title: "My Drones", options: {
                headerRight: ({tintColor}) => (
                    <TouchableOpacity onPress={() => navigation.navigate("AddDrone")}>
                        <FontAwesomeIcon
                            icon={commonIcons.addCircle}
                            color={tintColor}
                            size={moderateScale(24)}
                            style={{
                                marginRight: horizontalScale(15)
                            }}
                        />
                    </TouchableOpacity>
                ),
            }, icon: drawerIcons.drones, component: Drones
        },
        {
            name: 'Missions', title: "My Missions", options: {
                headerRight: ({tintColor}) => (
                    <TouchableOpacity onPress={() => (
                        openModal(() => (
                            // Add mission to db later...
                            <RenameModal
                                onRename={(text) => (
                                    console.log("New mission", text)
                                )}
                            />
                        ))
                    )}>
                        <FontAwesomeIcon
                            icon={commonIcons.addCircle}
                            color={tintColor}
                            size={moderateScale(24)}
                            style={{
                                marginRight: horizontalScale(15)
                            }}
                        />
                    </TouchableOpacity>
                ),
            }, icon: drawerIcons.missions, component: Missions
        },
        {name: 'About', title: "About", icon: drawerIcons.about, component: About},
    ];

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerCustomContent {...props} />}
            screenOptions={{
                ...headerStyle,
                drawerActiveBackgroundColor: "transparent",
                drawerActiveTintColor: colors.accent300,
                drawerInactiveTintColor: colors.primaryText200,
                drawerLabelStyle: {
                    fontSize: moderateScale(20),
                    fontFamily: fonts.primaryRegular,
                    marginLeft: -horizontalScale(10),
                },
                drawerItemStyle: {
                    marginHorizontal: 0,
                    marginVertical: 0,
                },
                drawerStyle: {
                    backgroundColor: colors.primary200,
                },
            }}
        >
            {drawerScreens.map((screen, index) => (
                <Drawer.Screen
                    key={index}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        ...screen.options,
                        title: screen.title,
                        drawerItemStyle: {
                            borderRadius: 0,
                            marginHorizontal: horizontalScale(-15),
                        },
                        drawerIcon: ({color, focused}) => (
                            <DrawerIcon
                                icon={screen.icon}
                                size={moderateScale(24)}
                                color={color}
                                focused={focused}
                            />
                        ),
                    }}
                />
            ))}
        </Drawer.Navigator>
    );
}

const Navigation = () => {
    const stackScreens = [
        {name: 'Drawer', options: {headerShown: false}, component: DrawerNavigation},
        {name: 'AddDrone', options: {title: "Add Drone"}, component: AddDrone},
        // {name: 'Details', options: {title: "Details"}, component: null},
        // {name: 'MissionHistory', options: {}, component: null},
        // {name: 'GuidedControl', options: {}, component: null},
        // {name: 'MissionControl', options: {}, component: null},
    ];

    return (
        <NavigationContainer>
            <MenuProvider>
                <ModalProvider>
                    <View style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        backgroundColor: colors.primary200
                    }}/>
                    <Stack.Navigator
                        screenOptions={headerStyle}
                    >
                        {stackScreens.map((screen, index) => (
                            <Stack.Screen
                                key={index}
                                name={screen.name}
                                component={screen.component}
                                options={screen.options}
                            />
                        ))}
                    </Stack.Navigator>
                </ModalProvider>
            </MenuProvider>
        </NavigationContainer>
    );
};

export default Navigation;