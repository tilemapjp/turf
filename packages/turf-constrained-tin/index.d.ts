import { FeatureCollection, Point, Polygon } from "@turf/helpers";
/**
 * Takes a set of {@link Point|points} and creates a
 * constrained [Triangulated Irregular Network](http://en.wikipedia.org/wiki/Triangulated_irregular_network),
 * or a TIN for short, returned as a collection of Polygons. These are often used
 * for developing elevation contour maps or stepped heat visualizations.
 *
 * If an optional z-value property is provided then it is added as properties called `a`, `b`,
 * and `c` representing its value at each of the points that represent the corners of the
 * triangle.
 *
 * @name constrainedTin
 * @param {FeatureCollection<Point>} points input points
 * @param {Array<Array<number>>} [edges] list of edges
 * @param {Object} [options] option switches
 *   {boolean} [delaunay]: if this flag is set to true, then the resulting triangulation is converted to a Delaunay triangulation by edge flipping.
 *   Otherwise if it is false, then an arbitrary triangulation is returned. (Default true)
 *   {boolean} [interior]: (Default true) if it is false, interior faces are not output.
 *   {boolean} [exterior]: (Default true) if it is false, exterior faces are not output.
 *   {boolean} [infinity]: if it is true, then the triangulation is augmented with a point at infinity represented by the index -1. (Default false)
 *   {String} [z]: name of the property from which to pull z values
 *   This is optional: if not given, then there will be no extra data added to the derived triangles.
 * @returns {FeatureCollection<Polygon>} TIN output
 * @example
 * // generate some random point data
 * var points = turf.randomPoint(30, {bbox: [50, 30, 70, 50]});
 *
 * // add a random property to each point between 0 and 9
 * for (var i = 0; i < points.features.length; i++) {
 *   points.features[i].properties.z = ~~(Math.random() * 9);
 * }
 * var tin = turf.constrainedTin(points, [], {z: 'z'});
 *
 * //addToMap
 * var addToMap = [tin, points]
 * for (var i = 0; i < tin.features.length; i++) {
 *   var properties  = tin.features[i].properties;
 *   properties.fill = '#' + properties.a + properties.b + properties.c;
 * }
 */
export default function constrainedTin(points: FeatureCollection<Point, any>, edges?: number[][], options?: {
    delaunay?: boolean;
    interior?: boolean;
    exterior?: boolean;
    infinity?: boolean;
    z?: string;
}): FeatureCollection<Polygon>;
