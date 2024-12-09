import MapboxGL from "@rnmapbox/maps";
import getMidpoint from "../../../utils/getMidpoint";
import {colors} from "../../../constants/styles";
import getBearing from "../../../utils/getBearing";

const calculateMidpointsAndAngles = (coordinates) => {
    return coordinates.slice(0, -1).map((start, index) => {
        const end = coordinates[index + 1];

        const [midLon, midLat] = getMidpoint(start[1], start[0], end[1], end[0]);
        const angle = getBearing(start[1], start[0], end[1], end[0]);

        return {midpoint: [midLon, midLat], angle};
    });
};

const MarkerLines = ({waypointsWithCoordinates}) => {
    const lineCoordinates = waypointsWithCoordinates.map(waypoint => [
        waypoint.y,
        waypoint.x,
    ]);

    const midpointsAndAngles = calculateMidpointsAndAngles(lineCoordinates);

    return (
        waypointsWithCoordinates.length > 1 &&
        <>
            <MapboxGL.Images
                images={{
                    arrow: require("../../../../assets/arrow.png")
                }}
            />
            <MapboxGL.ShapeSource
                id="markersLineSource"
                shape={{
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: lineCoordinates,
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
            <MapboxGL.ShapeSource
                id="arrowsSource"
                shape={{
                    type: 'FeatureCollection',
                    features: midpointsAndAngles.map(({midpoint, angle}, index) => ({
                        type: 'Feature',
                        properties: {
                            rotation: angle,
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: midpoint,
                        },
                    })),
                }}
            >
                <MapboxGL.SymbolLayer
                    id="arrowsLayer"
                    style={{
                        iconImage: 'arrow',
                        iconSize: 0.07,
                        iconRotate: ['get', 'rotation'],
                        iconColor: colors.error200,
                        iconAllowOverlap: true,
                        iconIgnorePlacement: true,
                    }}
                    minZoomLevel={0}
                />
            </MapboxGL.ShapeSource>
        </>
    );
};

export default MarkerLines;