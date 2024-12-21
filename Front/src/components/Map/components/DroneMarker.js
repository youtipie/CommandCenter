import MapboxGL from "@rnmapbox/maps";
import {Image} from "react-native";
import droneImg from "../../../../assets/drone-small.png";
import {moderateScale} from "../../../utils/metrics";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHelicopterSymbol} from "@fortawesome/free-solid-svg-icons";
import {colors} from "../../../constants/styles";

const DroneMarker = ({droneData, waypointsWithCoordinates}) => {
    return (
        <>
            {waypointsWithCoordinates.length > 0 &&
                <MapboxGL.ShapeSource
                    id="dottedLineSource"
                    shape={{
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: [
                                [waypointsWithCoordinates[0].y, waypointsWithCoordinates[0].x],
                                [droneData.home_location.log, droneData.home_location.lat],
                                [waypointsWithCoordinates[waypointsWithCoordinates.length - 1].y, waypointsWithCoordinates[waypointsWithCoordinates.length - 1].x],
                            ],
                        },
                    }}
                >
                    <MapboxGL.LineLayer
                        id="dottedLineLayer"
                        style={{
                            lineColor: colors.error200,
                            lineWidth: 4,
                            lineDasharray: [2, 4],
                        }}
                    />
                </MapboxGL.ShapeSource>
            }
            <MapboxGL.MarkerView
                testID="DroneMarker"
                coordinate={[droneData.location.lon, droneData.location.lat]}
                allowOverlap
            >
                <Image source={droneImg}
                       style={{
                           width: moderateScale(70),
                           height: moderateScale(70),
                           transform: [{rotate: `${droneData.heading}deg`}]
                       }}/>
            </MapboxGL.MarkerView>
            <MapboxGL.MarkerView
                testID="HomeMarker"
                coordinate={[droneData.home_location.log, droneData.home_location.lat]}
                allowOverlap
            >
                <FontAwesomeIcon
                    icon={faHelicopterSymbol}
                    size={moderateScale(32)}
                    color={colors.accent100}
                />
            </MapboxGL.MarkerView>
        </>
    );
};

export default DroneMarker;