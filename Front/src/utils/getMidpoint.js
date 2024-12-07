export default (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const lat1Rad = toRad(lat1);
    const lon1Rad = toRad(lon1);
    const lat2Rad = toRad(lat2);
    const lon2Rad = toRad(lon2);

    const dLon = lon2Rad - lon1Rad;

    const bx = Math.cos(lat2Rad) * Math.cos(dLon);
    const by = Math.cos(lat2Rad) * Math.sin(dLon);

    const midLat = Math.atan2(
        Math.sin(lat1Rad) + Math.sin(lat2Rad),
        Math.sqrt((Math.cos(lat1Rad) + bx) ** 2 + by ** 2)
    );
    const midLon = lon1Rad + Math.atan2(by, Math.cos(lat1Rad) + bx);

    return [toDeg(midLon), toDeg(midLat)];
}