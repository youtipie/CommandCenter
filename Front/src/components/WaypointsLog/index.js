import {useRef} from "react";
import {View, StyleSheet, Text} from "react-native";
import Animated, {
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue, withDecay,
} from "react-native-reanimated";
import {PanGestureHandler} from "react-native-gesture-handler";
import {colors, fonts} from "../../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../../utils/metrics";
import ScalableText from "../ScalableText";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import commands from "../../constants/commands";
import WaypointRow, {UnEnhancedWaypointRow} from "./components/WaypointRow";

const CELL_HEIGHT = moderateScale(20)

const WaypointsLog = ({waypoints, isEditing, selectedIndex, onSelectedIndex}) => {
    const swipeableRefs = useRef(new Map());
    const MENU_HEIGHT = verticalScale(180);
    const SCREEN_HEIGHT = MENU_HEIGHT - CELL_HEIGHT;
    const translateY = useSharedValue(SCREEN_HEIGHT);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            translateY.value = Math.min(
                Math.max(ctx.startY + event.translationY, 0),
                SCREEN_HEIGHT
            );
        },
        onEnd: (event) => {
            const threshold = SCREEN_HEIGHT - MENU_HEIGHT / 2;

            translateY.value = withDecay({
                velocity: event.velocityY,
                clamp: [SCREEN_HEIGHT - MENU_HEIGHT, SCREEN_HEIGHT],
            });

            if (translateY.value < threshold) {
                translateY.value = 0;
            } else {
                translateY.value = SCREEN_HEIGHT;
            }
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateY: interpolate(translateY.value, [SCREEN_HEIGHT, 0], [SCREEN_HEIGHT, 0])}],
    }));

    const getColName = (defaultName) => {
        if (isNaN(selectedIndex)) {
            return defaultName;
        }
        const selectedWaypoint = waypoints[selectedIndex];
        const commandSpecs = commands[selectedWaypoint.command];
        return commandSpecs[defaultName.toLowerCase()]?.name;
    }

    const handleWaypointDrag = async (data, from, to) => {
        onSelectedIndex(undefined);
        for (let i = 0; i < data.length; i++) {
            await data[i].changeOrder(i + 1);
        }
        [...swipeableRefs.current.entries()].forEach(([key, ref]) => {
            if (ref) ref.close();
        });
    }

    const onParamsEdit = async (waypoint, field, value) => {
        await waypoint.changeParam(field, Number.parseFloat(value));
    }

    const onCommandChange = async (waypoint, value) => {
        const currentCommand = waypoint.command;

        if (currentCommand === value) {
            return;
        }

        await waypoint.changeParam("command", value);
    }

    return (
        <Animated.View style={[styles.menu, {height: MENU_HEIGHT}, animatedStyle]}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={styles.row}>
                    <View style={[styles.cell, styles.cellSmall]}>
                        <Text style={styles.text}>№</Text>
                    </View>
                    <View style={[styles.cell, styles.cellMedium]}>
                        <ScalableText style={styles.text}>Command</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{getColName("Param1")}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{getColName("Param2")}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{getColName("Param3")}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{getColName("Param4")}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{getColName("Param5")}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{getColName("Param6")}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{getColName("Param7")}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>Dist</ScalableText>
                    </View>
                </Animated.View>
            </PanGestureHandler>
            <View style={styles.log}>
                <DraggableFlatList
                    data={waypoints}
                    onDragEnd={({data, from, to}) => handleWaypointDrag(data, from, to)}
                    keyExtractor={(item, index) => index}
                    activationDistance={20}
                    renderItem={({item, drag, isActive, getIndex}) => {
                        const RowComponent = isEditing ? WaypointRow : UnEnhancedWaypointRow;
                        return (
                            <RowComponent
                                waypoint={item}
                                waypoints={waypoints}
                                index={getIndex()}
                                drag={drag}
                                swipeableRefs={swipeableRefs}
                                isEditing={isEditing}
                                styles={styles}
                                isSelected={getIndex() === selectedIndex}
                                onSelectedIndex={onSelectedIndex}
                                onCommandChange={onCommandChange}
                                onParamsEdit={onParamsEdit}
                            />
                        );
                    }}
                    contentContainerStyle={{paddingBottom: CELL_HEIGHT}}
                />
            </View>
        </Animated.View>
    );
};

export default WaypointsLog;

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.primary200,
        alignItems: 'center',
    },
    log: {
        width: "100%",
    },
    text: {
        fontSize: moderateScale(12),
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText200,
    },
    row: {
        width: "100%",
        height: CELL_HEIGHT,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(18, 18, 18, 0.5)"
    },
    selectedRow: {
        backgroundColor: colors.accent300 + "66",
    },
    cell: {
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "rgba(18, 18, 18, 0.5)",
    },
    cellExpand: {
        flex: 1
    },
    cellSmall: {
        width: horizontalScale(35)
    },
    cellMedium: {
        flex: 2
    },
    deleteWP: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    selectWrapper: {
        width: "100%",
    }
});