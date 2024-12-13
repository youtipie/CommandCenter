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

const createGeoJSONCircle = (center, radiusInMeters, points = 64) => {
    const coords = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[]],
        },
    };

    const earthRadius = 6371000;

    for (let i = 0; i <= points; i++) {
        const angle = (i / points) * (2 * Math.PI);
        const dx = radiusInMeters * Math.cos(angle);
        const dy = radiusInMeters * Math.sin(angle);

        const latitude = center[1] + (dy / earthRadius) * (180 / Math.PI);
        const longitude =
            center[0] +
            (dx / (earthRadius * Math.cos((center[1] * Math.PI) / 180))) *
            (180 / Math.PI);

        coords.geometry.coordinates[0].push([longitude, latitude]);
    }

    return coords;
};

const MarkerLines = ({waypointsWithCoordinates}) => {
    const lineCoordinates = waypointsWithCoordinates
        .filter(waypoint => waypoint.command !== 201)
        .map(waypoint => [
            waypoint.y,
            waypoint.x,
        ]);

    const midpointsAndAngles = calculateMidpointsAndAngles(lineCoordinates);

    const circlesData = waypointsWithCoordinates
        .filter(waypoint => waypoint.command === 18)
        .map(waypoint => createGeoJSONCircle([waypoint.y, waypoint.x], waypoint.param3));

    return (
        <>
            {waypointsWithCoordinates.length > 1 && (
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
            )}
            {circlesData.length > 0 && (
                <MapboxGL.ShapeSource
                    id="circlesSource"
                    shape={{
                        type: 'FeatureCollection',
                        features: circlesData
                    }}
                >
                    <MapboxGL.LineLayer
                        id="circlesLayer"
                        style={{
                            lineColor: colors.error200,
                            lineWidth: 2,
                        }}
                    />
                </MapboxGL.ShapeSource>
            )}
        </>
    );
};

export default MarkerLines;