import MapboxGL from "@rnmapbox/maps";
import {colors} from "../../../constants/styles";

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
                        <MapboxGL.SymbolLayer
                            id="lineDirectionSymbols"
                            style={{
                                iconImage: "arrow",
                                iconSize: 0.07,
                                symbolPlacement: "line",
                                symbolSpacing: 5,
                                iconRotate: 90,
                                iconColor: colors.error200,
                                iconAllowOverlap: true,
                                iconIgnorePlacement: true,
                            }}
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