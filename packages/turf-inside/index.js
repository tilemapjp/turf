var invariant = require('@turf/invariant');
var centroid = require('@turf/centroid');
var lineString = require('@turf/helpers').lineString;

// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point resides inside the polygon. The polygon can
 * be convex or concave. The function accounts for holes.
 *
 * @name inside
 * @param {Feature<Point>} point input point
 * @param {Feature<(Polygon|MultiPolygon)>} polygon input polygon or multipolygon
 * @return {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = point([-77, 44]);
 * var poly = polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * var isInside = turf.inside(pt, poly);
 *
 * //=isInside
 */
module.exports = function input(point, polygon) {
    var pt = invariant.getCoord(point);
    var polys = polygon.geometry.coordinates;
    // normalize to multipolygon
    if (polygon.geometry.type === 'Polygon') polys = [polys];

    for (var i = 0, insidePoly = false; i < polys.length && !insidePoly; i++) {
        // check if it is in the outer ring first
        if (inRing(pt, polys[i][0])) {
            var inHole = false;
            var k = 1;
            // check for the point in any of the holes
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k])) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) insidePoly = true;
        }
    }
    return insidePoly;
};

// pt is [x,y] and ring is [[x,y], [x,y],..]
function inRing(pt, ring) {
    var isInside = false;
    if (ring[0][0] == ring[ring.length-1][0] && ring[0][1] == ring[ring.length-1][1]) ring = ring.slice(0, ring.length-1);
    var cent = invariant.getCoord(centroid(lineString(ring)));
    console.log(cent);
    console.log(pt);
    var cent_dx = cent[0] - pt[0];
    var cent_dy = cent[1] - pt[1];
    var theta = Math.atan2(cent_dx, cent_dy);
    console.log([cent_dx, cent_dy]);
    console.log(theta);
    var xc = cent_dy * Math.cos(theta) + cent_dx * Math.sin(theta) + pt[0];
    var yc = cent_dx * Math.cos(theta) - cent_dy * Math.sin(theta) + pt[1];
    console.log(pt);
    console.log([xc, yc]);
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = (ring[i][1] - pt[1]) * Math.cos(theta) + (ring[i][0] - pt[0]) * Math.sin(theta) + pt[0];
        var yi = (ring[i][0] - pt[0]) * Math.cos(theta) - (ring[i][1] - pt[1]) * Math.sin(theta) + pt[1];
        var xj = (ring[j][1] - pt[1]) * Math.cos(theta) + (ring[j][0] - pt[0]) * Math.sin(theta) + pt[0];
        var yj = (ring[j][0] - pt[0]) * Math.cos(theta) - (ring[j][1] - pt[1]) * Math.sin(theta) + pt[1];
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}
