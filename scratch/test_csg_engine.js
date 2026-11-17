const { primitives, booleans, transforms, measurements, geometries } = require('../sparkbyte-v2/node_modules/@jscad/modeling');

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function buildShapeGeometry(shape) {
  const d = shape.dimensions;
  let baseGeom;

  switch (shape.type) {
    case 'cube':
      baseGeom = primitives.cuboid({ size: [d.width, d.depth, d.height] });
      break;
    case 'cylinder':
      baseGeom = primitives.cylinder({ radius: d.radius, height: d.height, segments: 36 });
      break;
    case 'hole':
      baseGeom = primitives.cylinder({ radius: d.radius, height: d.height + 0.4, segments: 36 });
      break;
    case 'sphere':
      baseGeom = primitives.sphere({ radius: d.radius, segments: 24 });
      break;
    case 'cone':
      baseGeom = primitives.cylinderElliptic({
        startRadius: [d.radius, d.radius],
        endRadius: [d.radiusTop || 0.01, d.radiusTop || 0.01],
        height: d.height,
        segments: 36
      });
      break;
    default:
      baseGeom = primitives.cuboid({ size: [20, 20, 20] });
  }

  const rotGeom = transforms.rotate(
    [degToRad(shape.rotation[0]), degToRad(shape.rotation[1]), degToRad(shape.rotation[2])],
    baseGeom
  );
  return transforms.translate([shape.position[0], shape.position[1], shape.position[2]], rotGeom);
}

function computeCsgScene(shapes) {
  const visible = shapes.filter(s => s.visible !== false);
  const solids = visible.filter(s => s.mode === 'solid');
  const holes = visible.filter(s => s.mode === 'hole');

  let finalGeom;
  if (solids.length === 0) {
    finalGeom = primitives.cuboid({ size: [20, 20, 2] });
  } else {
    const solidGeoms = solids.map(buildShapeGeometry);
    const solidUnion = solidGeoms.length === 1 ? solidGeoms[0] : booleans.union(...solidGeoms);
    if (holes.length > 0) {
      const holeGeoms = holes.map(buildShapeGeometry);
      finalGeom = booleans.subtract(solidUnion, ...holeGeoms);
    } else {
      finalGeom = solidUnion;
    }
  }

  const bbox = measurements.measureBoundingBox(finalGeom);
  const volMm3 = Math.max(0, measurements.measureVolume(finalGeom));
  const polyList = geometries.geom3.toPolygons(finalGeom);

  return {
    dims: [
      +(bbox[1][0] - bbox[0][0]).toFixed(1),
      +(bbox[1][1] - bbox[0][1]).toFixed(1),
      +(bbox[1][2] - bbox[0][2]).toFixed(1)
    ],
    volCm3: +(volMm3 / 1000).toFixed(2),
    plaGrams: +((volMm3 / 1000) * 1.24 * 0.35).toFixed(1),
    petgGrams: +((volMm3 / 1000) * 1.27 * 0.35).toFixed(1),
    triangles: polyList.length,
    isManifold: polyList.length > 0 && volMm3 > 0
  };
}

// Test box with subtractive hole
const testShapes = [
  { type: 'cube', mode: 'solid', position: [0, 0, 10], rotation: [0, 0, 0], dimensions: { width: 40, depth: 40, height: 20 } },
  { type: 'hole', mode: 'hole', position: [0, 0, 10], rotation: [0, 0, 0], dimensions: { radius: 5, height: 25 } }
];

console.log('Test Box minus Hole:', computeCsgScene(testShapes));
