import MapboxGL from "@rnmapbox/maps";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {colors} from "../../../constants/styles";
import {moderateScale} from "../../../utils/metrics";


const Markers = ({
                     isEditable,
                     waypoints,
                     waypointsWithCoordinates,
                     selectedWaypoint,
                     handleSelectWaypoint,
                     handleMarkerDragEnd
                 }) => {
    return (
        <>
            {waypointsWithCoordinates.map((waypoint, index) => (
                <MapboxGL.PointAnnotation
                    id={`${index}-annotation`}
                    key={`${index}-${selectedWaypoint}`}
                    coordinate={[waypoint.y, waypoint.x]}
                    anchor={{x: 0.5, y: 1}}
                    allowOverlap
                    draggable={isEditable}
                    onSelected={() => handleSelectWaypoint(index)}
                    onDragEnd={(payload) => handleMarkerDragEnd(payload, index)}
                >
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        color={index === waypointsWithCoordinates.indexOf(waypoints[selectedWaypoint]) ? colors.accent300
                            :
                            waypoint.command === 201 ? colors.warning200
                                :
                                colors.accent100}
                        size={moderateScale(32)}
                    />
                </MapboxGL.PointAnnotation>
            ))}
        </>
    );
};

export default Markers;