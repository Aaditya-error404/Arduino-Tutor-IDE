const jscad = require('../sparkbyte-v2/node_modules/@jscad/modeling');
const { primitives, booleans, transforms, measurements, geometries } = jscad;

// Test basic CSG
const box = transforms.translate([30, 40, 12.5], primitives.cuboid({ size: [60, 80, 25] }));
const inner = transforms.translate([30, 40, 15], primitives.cuboid({ size: [55, 75, 25] }));
const hole = transforms.translate([30, 40, 12.5], primitives.cylinder({ radius: 4, height: 30, segments: 32 }));

const res = booleans.subtract(box, booleans.union(inner, hole));
const polys = geometries.geom3.toPolygons(res);
const bbox = measurements.measureBoundingBox(res);
const vol = measurements.measureVolume(res);

console.log('CSG OK! Polygons:', polys.length);
console.log('BBox:', bbox);
console.log('Volume (mm3):', vol, 'cm3:', (vol / 1000).toFixed(2));
console.log('Filament PLA 20% infill (g):', ((vol / 1000) * 1.24 * 0.35).toFixed(1));
