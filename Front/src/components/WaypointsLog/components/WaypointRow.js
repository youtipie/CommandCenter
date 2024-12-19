import SwipeableItem, {OpenDirection} from "react-native-swipeable-item";
import {horizontalScale, moderateScale} from "../../../utils/metrics";
import {Pressable, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {colors, commonIcons} from "../../../constants/styles";
import ScalableText from "../../ScalableText";
import SelectList from "../../SelectList";
import commands from "../../../constants/commands";
import Cell from "../../Cell";
import {withObservables} from "@nozbe/watermelondb/react";
import getDistance from "../../../utils/getDistance";

const WaypointRow = ({
                         waypoint,
                         waypoints,
                         index,
                         swipeableRefs,
                         drag,
                         isEditing,
                         styles,
                         isSelected,
                         onSelectedIndex,
                         onParamsEdit,
                         onCommandChange
                     }) => {
    const prevWp = waypoints[index - 1];
    const dist = prevWp ? (getDistance(waypoint.x, waypoint.y, prevWp.x, prevWp.y) * 1000).toFixed(0) : 0;

    return (
        <SwipeableItem
            ref={(ref) => swipeableRefs.current.set(index, ref)}
            item={waypoint}
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
                        onPress={async () => {
                            onSelectedIndex(undefined);
                            await waypoint.delete();
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
                style={[styles.row, isSelected && styles.selectedRow]}
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
                            onSelect={(value) => onCommandChange(waypoint, value)}
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
                        onChange={(value) => onParamsEdit(waypoint, "param1", value)}
                        style={styles.text}
                    >
                        {waypoint.param1}
                    </Cell>
                </View>
                <View style={[styles.cell, styles.cellExpand]}>
                    <Cell
                        isEditing={isEditing}
                        onChange={(value) => onParamsEdit(waypoint, "param2", value)}
                        style={styles.text}
                    >
                        {waypoint.param2}
                    </Cell>
                </View>
                <View style={[styles.cell, styles.cellExpand]}>
                    <Cell
                        isEditing={isEditing}
                        onChange={(value) => onParamsEdit(waypoint, "param3", value)}
                        style={styles.text}
                    >
                        {waypoint.param3}
                    </Cell>
                </View>
                <View style={[styles.cell, styles.cellExpand]}>
                    <Cell
                        isEditing={isEditing}
                        onChange={(value) => onParamsEdit(waypoint, "param4", value)}
                        style={styles.text}
                    >
                        {waypoint.param4}
                    </Cell>
                </View>
                <View style={[styles.cell, styles.cellExpand]}>
                    <Cell
                        isEditing={isEditing}
                        onChange={(value) => onParamsEdit(waypoint, "x", value)}
                        style={styles.text}
                    >
                        {waypoint.x}
                    </Cell>
                </View>
                <View style={[styles.cell, styles.cellExpand]}>
                    <Cell
                        isEditing={isEditing}
                        onChange={(value) => onParamsEdit(waypoint, "y", value)}
                        style={styles.text}
                    >
                        {waypoint.y}
                    </Cell>
                </View>
                <View style={[styles.cell, styles.cellExpand]}>
                    <Cell
                        isEditing={isEditing}
                        onChange={(value) => onParamsEdit(waypoint, "z", value)} style={styles.text}
                    >
                        {waypoint.z}
                    </Cell>
                </View>
                <View style={[styles.cell, styles.cellExpand]}>
                    <ScalableText style={styles.text}>{dist}</ScalableText>
                </View>
            </Pressable>
        </SwipeableItem>
    );
};

const enhance = withObservables(["waypoint"], ({waypoint}) => ({
    waypoint: waypoint.observe(),
}))

export const UnEnhancedWaypointRow = WaypointRow;
export default enhance(WaypointRow);