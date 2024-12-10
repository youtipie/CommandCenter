import {useCallback, useRef} from "react";
import {View, StyleSheet, Text, Pressable, TouchableOpacity} from "react-native";
import Animated, {
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue, withDecay,
} from "react-native-reanimated";
import {PanGestureHandler} from "react-native-gesture-handler";
import {colors, commonIcons, fonts} from "../constants/styles";
import {horizontalScale, moderateScale, verticalScale} from "../utils/metrics";
import ScalableText from "./ScalableText";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import SwipeableItem, {
    OpenDirection,
} from "react-native-swipeable-item";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Cell from "./Cell";
import SelectList from "./SelectList";
import commands from "../constants/commands";

const CELL_HEIGHT = moderateScale(20)

const WaypointsLog = ({waypoints, isEditing, selectedIndex, onSelectedIndex, onWaypointsChange}) => {
    const swipeableRefs = useRef(new Map());
    const MENU_HEIGHT = Math.min(verticalScale(180), (waypoints.length + 1) * CELL_HEIGHT);
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

    const handleWaypointDrag = (data) => {
        onSelectedIndex(undefined);
        onWaypointsChange?.(data);
        [...swipeableRefs.current.entries()].forEach(([key, ref]) => {
            if (ref) ref.close();
        });
    }

    const onParamsEdit = (index, field, value) => {
        onWaypointsChange?.(prev => {
            let data = [...prev];
            data[index] = {
                ...data[index],
                [field]: Number.parseFloat(value),
            };
            return data;
        });
    }

    const onCommandChange = (index, value) => {
        const currentCommand = waypoints[index]?.command;

        if (currentCommand === value) {
            return;
        }

        onWaypointsChange?.(prev => {
            let data = [...prev];
            data[index] = {
                ...data[index],
                command: value,
            };
            return data;
        });
    }

    const renderItem = useCallback(({item, drag, isActive, getIndex}) => {
        const waypoint = item;
        const index = getIndex();

        return (
            <SwipeableItem
                ref={(ref) => swipeableRefs.current.set(index, ref)}
                item={item}
                snapPointsLeft={[horizontalScale(50)]}
                swipeEnabled={isEditing}
                onChange={({openDirection}) => {
                    if (openDirection !== OpenDirection.NONE) {
                        onSelectedIndex(index);
                        [...swipeableRefs.current.entries()].forEach(([key, ref]) => {
                            if (key !== index && ref) ref.close();
                        });
                    }
                }}
                renderUnderlayLeft={() => (
                    <View style={{
                        width: horizontalScale(50),
                        height: "100%",
                        alignSelf: "flex-end",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <TouchableOpacity
                            style={styles.deleteWP}
                            onPress={() => {
                                handleWaypointDrag(waypoints.filter((waypoint) => waypoint !== item));
                            }}
                        >
                            <FontAwesomeIcon
                                icon={commonIcons.trash} size={moderateScale(14)}
                                color={colors.accent200}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            >
                <Pressable
                    style={[styles.row, selectedIndex === index && styles.selectedRow]}
                    onPress={() => onSelectedIndex(index)}
                    onLongPress={(event) => isEditing ? drag(event) : onSelectedIndex(index)}
                >
                    <View style={[styles.cell, styles.cellSmall]}>
                        <ScalableText style={styles.text}>{index + 1}</ScalableText>
                    </View>
                    <View style={[styles.cell, styles.cellMedium]}>
                        <View style={styles.selectWrapper}>
                            <SelectList
                                disabled={!isEditing}
                                textStyle={styles.text}
                                onSelect={(value) => onCommandChange(index, value)}
                                options={Object.entries(commands).map(([key, value]) => ({
                                    value: Number.parseInt(key),
                                    label: value.name,
                                }))}
                            >
                                <Text style={styles.text}>{commands[waypoint.command].name}</Text>
                            </SelectList>
                        </View>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <Cell
                            isEditing={isEditing}
                            onChange={(value) => onParamsEdit(index, "param1", value)}
                            style={styles.text}
                        >
                            {waypoint.param1}</Cell>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <Cell
                            isEditing={isEditing}
                            onChange={(value) => onParamsEdit(index, "param2", value)}
                            style={styles.text}
                        >
                            {waypoint.param2}</Cell>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <Cell
                            isEditing={isEditing}
                            onChange={(value) => onParamsEdit(index, "param3", value)}
                            style={styles.text}
                        >
                            {waypoint.param3}</Cell>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <Cell
                            isEditing={isEditing}
                            onChange={(value) => onParamsEdit(index, "param4", value)}
                            style={styles.text}
                        >
                            {waypoint.param4}
                        </Cell>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <Cell
                            isEditing={isEditing}
                            onChange={(value) => onParamsEdit(index, "x", value)}
                            style={styles.text}
                        >
                            {waypoint.x}
                        </Cell>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <Cell
                            isEditing={isEditing}
                            onChange={(value) => onParamsEdit(index, "y", value)}
                            style={styles.text}
                        >
                            {waypoint.y}
                        </Cell>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <Cell
                            isEditing={isEditing}
                            onChange={(value) => onParamsEdit(index, "z", value)} style={styles.text}
                        >
                            {waypoint.z}
                        </Cell>
                    </View>
                    <View style={[styles.cell, styles.cellExpand]}>
                        <ScalableText style={styles.text}>{waypoint.dist}</ScalableText>
                    </View>
                </Pressable>
            </SwipeableItem>
        );
    }, [selectedIndex])

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
                    onDragEnd={({data}) => handleWaypointDrag(data)}
                    keyExtractor={(item, index) => index}
                    activationDistance={20}
                    renderItem={renderItem}
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