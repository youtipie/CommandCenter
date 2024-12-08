import MapboxGL from "@rnmapbox/maps";
import getMidpoint from "../../../utils/getMidpoint";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {colors} from "../../../constants/styles";
import {moderateScale} from "../../../utils/metrics";
import getBearing from "../../../utils/getBearing";

const MarkerLines = ({waypointsWithCoordinates}) => {
    return (
        waypointsWithCoordinates.length > 0 &&
        <>
            {waypointsWithCoordinates.slice(0, -1).map((waypoint, index) => (
                <MapboxGL.MarkerView
                    key={index}
                    coordinate={getMidpoint(waypoint.x, waypoint.y, waypointsWithCoordinates[index + 1].x, waypointsWithCoordinates[index + 1].y)}
                    allowOverlap
                >
                    <FontAwesomeIcon
                        icon={faAngleUp}
                        color={colors.error200}
                        size={moderateScale(25)}
                        style={{transform: [{rotate: `${getBearing(waypoint.x, waypoint.y, waypointsWithCoordinates[index + 1].x, waypointsWithCoordinates[index + 1].y)}deg`}]}}
                    />
                </MapboxGL.MarkerView>
            ))}
            <MapboxGL.ShapeSource
                id="markersLineSource"
                shape={{
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: waypointsWithCoordinates.map(waypoint => [waypoint.y, waypoint.x]),
                    },
                }}
            >
                <MapboxGL.LineLayer
                    id="markersLineLayer"
                    style={{
                        lineColor: colors.error200,
                        lineWidth: 4,
                    }}
                    layerIndex={100}
                />
            </MapboxGL.ShapeSource>
        </>
    );
};

export default MarkerLines;