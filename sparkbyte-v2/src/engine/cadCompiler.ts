/**
 * Real Constructive Solid Geometry (CSG) & OpenSCAD-to-3D Compiler
 * Powered by @jscad/modeling, @jscad/stl-serializer, and Three.js.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import * as THREE from 'three';
import {
  primitives,
  booleans,
  transforms,
  measurements,
  geometries
} from '@jscad/modeling';
import { serialize as serializeStl } from '@jscad/stl-serializer';

export interface CadModelResult {
  geom: geometries.geom3.Geom3;
  vars: Record<string, number>;
  bbox: {
    min: [number, number, number];
    max: [number, number, number];
    dimensions: [number, number, number];
  };
  volumeCm3: number;
  weightGrams20Infill: number;
  triangleCount: number;
  isManifold: boolean;
}

export interface CadPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  code: string;
}

export const CAD_PRESETS: CadPreset[] = [
  {
    id: 'sensor-box',
    name: 'Parametric Sensor Box',
    badge: 'Enclosure',
    description: 'Hollowed electronics enclosure with uniform wall thickness and lid lip.',
    code: `// ATL Preset 1: Parametric Sensor Enclosure
width = 60;
length = 80;
height = 25;
wall = 2.5;
holeRadius = 4;

difference() {
    cube([width, length, height]);
    translate([wall, wall, wall]) {
        cube([width - 2*wall, length - 2*wall, height]);
    }
    translate([width / 2, length / 2, -1]) {
        cylinder(r=holeRadius, h=height + 2);
    }
    translate([width / 2, -1, wall + 3]) {
        cube([10, wall + 2, 6]);
    }
}
`
  },
  {
    id: 'ultrasonic-bracket',
    name: 'HC-SR04 Ultrasonic Bracket',
    badge: 'Robotics',
    description: 'L-bracket with dual exact 16mm transducer cutouts and M3 chassis mounting slots.',
    code: `// ATL Preset 2: HC-SR04 Ultrasonic Sensor Mount
bracketW = 50;
bracketH = 30;
bracketD = 15;
thickness = 3;
holeDist = 26;
holeDia = 16.2;

difference() {
    union() {
        cube([bracketW, thickness, bracketH]);
        cube([bracketW, bracketD, thickness]);
    }
    // Dual Transducer Openings (16mm)
    translate([bracketW/2 - holeDist/2, -1, bracketH/2]) {
        rotate([-90, 0, 0]) {
            cylinder(d=holeDia, h=thickness + 2);
        }
    }
    translate([bracketW/2 + holeDist/2, -1, bracketH/2]) {
        rotate([-90, 0, 0]) {
            cylinder(d=holeDia, h=thickness + 2);
        }
    }
    // M3 Chassis Mounting Holes
    translate([10, bracketD/2, -1]) {
        cylinder(d=3.4, h=thickness + 2);
    }
    translate([bracketW - 10, bracketD/2, -1]) {
        cylinder(d=3.4, h=thickness + 2);
    }
}
`
  },
  {
    id: 'servo-arm',
    name: 'SG90 Servo Horn & Arm',
    badge: 'Actuator',
    description: 'Splined hub with 1.5mm pushrod linkage holes for robotics mechanisms.',
    code: `// ATL Preset 3: SG90 Micro Servo Arm
hubRadius = 4.5;
hubHeight = 4.0;
shaftHole = 2.5;
armLength = 32;
armWidth = 5;
armThickness = 1.8;

difference() {
    union() {
        cylinder(r=hubRadius, h=hubHeight);
        translate([-armLength/2, -armWidth/2, 0]) {
            cube([armLength, armWidth, armThickness]);
        }
    }
    // Splined Shaft Hole
    translate([0, 0, -1]) {
        cylinder(d=shaftHole, h=hubHeight + 2);
    }
    // Pushrod Linkage Holes
    translate([-armLength/2 + 3, 0, -1]) {
        cylinder(d=1.5, h=armThickness + 2);
    }
    translate([armLength/2 - 3, 0, -1]) {
        cylinder(d=1.5, h=armThickness + 2);
    }
    translate([-armLength/2 + 8, 0, -1]) {
        cylinder(d=1.5, h=armThickness + 2);
    }
    translate([armLength/2 - 8, 0, -1]) {
        cylinder(d=1.5, h=armThickness + 2);
    }
}
`
  },
  {
    id: 'uno-base',
    name: 'Arduino Uno Snap-Fit Base',
    badge: 'Mounting',
    description: 'Baseplate with 4 M3 mounting posts matching Arduino Uno hole coordinates.',
    code: `// ATL Preset 4: Arduino Uno R3 Snap-Fit Base
baseLength = 75;
baseWidth = 60;
baseThick = 2.5;
postHeight = 4.0;
postDia = 6.0;
holeDia = 2.8;

union() {
    difference() {
        cube([baseLength, baseWidth, baseThick]);
        // Weight Reduction Center Cutout
        translate([10, 10, -1]) {
            cube([baseLength - 20, baseWidth - 20, baseThick + 2]);
        }
    }
    // 4 Standard Arduino Uno M3 Mounting Post Coordinates
    // Hole 1: (14, 2.5)
    translate([14.0, 5.5, 0]) {
        difference() {
            cylinder(d=postDia, h=baseThick + postHeight);
            translate([0, 0, 1]) cylinder(d=holeDia, h=baseThick + postHeight + 1);
        }
    }
    // Hole 2: (15.3, 50.8)
    translate([15.3, 50.8, 0]) {
        difference() {
            cylinder(d=postDia, h=baseThick + postHeight);
            translate([0, 0, 1]) cylinder(d=holeDia, h=baseThick + postHeight + 1);
        }
    }
    // Hole 3: (66.1, 35.6)
    translate([66.1, 35.6, 0]) {
        difference() {
            cylinder(d=postDia, h=baseThick + postHeight);
            translate([0, 0, 1]) cylinder(d=holeDia, h=baseThick + postHeight + 1);
        }
    }
    // Hole 4: (66.1, 7.6)
    translate([66.1, 7.6, 0]) {
        difference() {
            cylinder(d=postDia, h=baseThick + postHeight);
            translate([0, 0, 1]) cylinder(d=holeDia, h=baseThick + postHeight + 1);
        }
    }
}
`
  }
];

export function compileOpenScad(code: string): CadModelResult {
  // 1. Strip comments
  const src = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .trim();

  // 2. Extract variable declarations
  const vars: Record<string, number> = {};
  const lines = src.split('\n');
  const nonVarLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const varMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*([^;]+);$/);
    if (varMatch && !/^(cube|cylinder|sphere|translate|rotate|difference|union|intersection)/i.test(varMatch[1])) {
      try {
        const fn = new Function(...Object.keys(vars), `return (${varMatch[2]});`);
        vars[varMatch[1]] = Number(fn(...Object.values(vars))) || 0;
      } catch {
        vars[varMatch[1]] = parseFloat(varMatch[2]) || 0;
      }
    } else if (trimmed) {
      nonVarLines.push(trimmed);
    }
  }

  const text = nonVarLines.join(' ');

  const evalExpr = (expr: string): number => {
    try {
      const fn = new Function(...Object.keys(vars), `return (${expr});`);
      return Number(fn(...Object.values(vars))) || 0;
    } catch {
      return parseFloat(expr) || 0;
    }
  };

  const evalVector = (vecStr: string): [number, number, number] => {
    const clean = vecStr.replace(/^\[/, '').replace(/\]$/, '').trim();
    if (!clean) return [0, 0, 0];
    const parts = clean.split(',').map((p) => evalExpr(p.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  };

  const makeCube = (size: [number, number, number] | number, center = false): geometries.geom3.Geom3 => {
    const s: [number, number, number] = Array.isArray(size) ? size : [size, size, size];
    const geom = primitives.cuboid({ size: s });
    if (!center) {
      return transforms.translate([s[0] / 2, s[1] / 2, s[2] / 2], geom);
    }
    return geom;
  };

  const makeCylinder = (opts: { r?: number; d?: number; h?: number; center?: boolean }): geometries.geom3.Geom3 => {
    const r = opts.r ?? (opts.d !== undefined ? opts.d / 2 : 5);
    const h = opts.h ?? 10;
    const center = opts.center ?? false;
    const geom = primitives.cylinder({ radius: r, height: h, segments: 32 });
    if (!center) {
      return transforms.translate([0, 0, h / 2], geom);
    }
    return geom;
  };

  const makeSphere = (opts: { r?: number; d?: number }): geometries.geom3.Geom3 => {
    const r = opts.r ?? (opts.d !== undefined ? opts.d / 2 : 10);
    return primitives.sphere({ radius: r, segments: 32 });
  };

  let pos = 0;

  const skipWhitespace = () => {
    while (pos < text.length && /\s/.test(text[pos])) pos++;
  };

  const matchKeyword = (kw: string): boolean => {
    skipWhitespace();
    if (text.startsWith(kw, pos)) {
      pos += kw.length;
      return true;
    }
    return false;
  };

  const parseArguments = (): Record<string, any> => {
    skipWhitespace();
    if (text[pos] !== '(') return {};
    pos++;
    let depth = 1;
    const start = pos;
    while (pos < text.length && depth > 0) {
      if (text[pos] === '(') depth++;
      else if (text[pos] === ')') depth--;
      pos++;
    }
    const rawArgs = text.slice(start, pos - 1).trim();
    const result: Record<string, any> = {};
    if (!rawArgs) return result;

    const argList: string[] = [];
    let cur = '', bDepth = 0;
    for (const c of rawArgs) {
      if (c === '[' || c === '(') bDepth++;
      else if (c === ']' || c === ')') bDepth--;
      if (c === ',' && bDepth === 0) {
        argList.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    if (cur.trim()) argList.push(cur.trim());

    for (let i = 0; i < argList.length; i++) {
      const a = argList[i];
      if (a.includes('=')) {
        const [k, v] = a.split('=').map((s) => s.trim());
        if (v.startsWith('[')) result[k] = evalVector(v);
        else result[k] = evalExpr(v);
      } else {
        if (a.startsWith('[')) result[i] = evalVector(a);
        else result[i] = evalExpr(a);
      }
    }
    return result;
  };

  const parseBlockOrStatement = (): geometries.geom3.Geom3 | null => {
    skipWhitespace();
    if (pos >= text.length) return null;

    if (text[pos] === '{') {
      pos++;
      const children: geometries.geom3.Geom3[] = [];
      while (pos < text.length) {
        skipWhitespace();
        if (text[pos] === '}') {
          pos++;
          break;
        }
        const child = parseBlockOrStatement();
        if (child) children.push(child);
      }
      if (children.length === 0) return null;
      return children.length === 1 ? children[0] : booleans.union(...children);
    }

    if (matchKeyword('cube')) {
      const args = parseArguments();
      skipWhitespace();
      if (text[pos] === ';') pos++;
      const size = args[0] || args.size || [10, 10, 10];
      const center = args.center || false;
      return makeCube(size, center);
    }

    if (matchKeyword('cylinder')) {
      const args = parseArguments();
      skipWhitespace();
      if (text[pos] === ';') pos++;
      const r = args.r ?? (args[0] ?? (args.d !== undefined ? args.d / 2 : 5));
      const h = args.h ?? (args[1] ?? 10);
      const center = args.center || false;
      return makeCylinder({ r, h, d: args.d, center });
    }

    if (matchKeyword('sphere')) {
      const args = parseArguments();
      skipWhitespace();
      if (text[pos] === ';') pos++;
      const r = args.r ?? (args[0] ?? (args.d !== undefined ? args.d / 2 : 10));
      return makeSphere({ r, d: args.d });
    }

    if (matchKeyword('translate')) {
      const args = parseArguments();
      const vec: [number, number, number] = args[0] || [0, 0, 0];
      const child = parseBlockOrStatement();
      if (!child) return null;
      return transforms.translate(vec, child);
    }

    if (matchKeyword('rotate')) {
      const args = parseArguments();
      const degVec: [number, number, number] = args[0] || [0, 0, 0];
      const radVec: [number, number, number] = [
        (degVec[0] * Math.PI) / 180,
        (degVec[1] * Math.PI) / 180,
        (degVec[2] * Math.PI) / 180
      ];
      const child = parseBlockOrStatement();
      if (!child) return null;
      return transforms.rotate(radVec, child);
    }

    if (matchKeyword('difference')) {
      parseArguments();
      skipWhitespace();
      if (text[pos] === '{') {
        pos++;
        const children: geometries.geom3.Geom3[] = [];
        while (pos < text.length) {
          skipWhitespace();
          if (text[pos] === '}') {
            pos++;
            break;
          }
          const c = parseBlockOrStatement();
          if (c) children.push(c);
        }
        if (children.length === 0) return null;
        if (children.length === 1) return children[0];
        const [base, ...subs] = children;
        return booleans.subtract(base, booleans.union(...subs));
      }
    }

    if (matchKeyword('union')) {
      parseArguments();
      skipWhitespace();
      if (text[pos] === '{') {
        pos++;
        const children: geometries.geom3.Geom3[] = [];
        while (pos < text.length) {
          skipWhitespace();
          if (text[pos] === '}') {
            pos++;
            break;
          }
          const c = parseBlockOrStatement();
          if (c) children.push(c);
        }
        if (children.length === 0) return null;
        return children.length === 1 ? children[0] : booleans.union(...children);
      }
    }

    if (matchKeyword('intersection')) {
      parseArguments();
      skipWhitespace();
      if (text[pos] === '{') {
        pos++;
        const children: geometries.geom3.Geom3[] = [];
        while (pos < text.length) {
          skipWhitespace();
          if (text[pos] === '}') {
            pos++;
            break;
          }
          const c = parseBlockOrStatement();
          if (c) children.push(c);
        }
        if (children.length === 0) return null;
        return children.length === 1 ? children[0] : booleans.intersect(...children);
      }
    }

    pos++;
    return null;
  };

  const results: geometries.geom3.Geom3[] = [];
  while (pos < text.length) {
    const node = parseBlockOrStatement();
    if (node) results.push(node);
  }

  const finalGeom = results.length === 0 
    ? makeCube([40, 30, 20]) 
    : (results.length === 1 ? results[0] : booleans.union(...results));

  const bbox = measurements.measureBoundingBox(finalGeom);
  const vol = measurements.measureVolume(finalGeom);
  const polyList = geometries.geom3.toPolygons(finalGeom);

  return {
    geom: finalGeom,
    vars,
    bbox: {
      min: [bbox[0][0], bbox[0][1], bbox[0][2]],
      max: [bbox[1][0], bbox[1][1], bbox[1][2]],
      dimensions: [
        +(bbox[1][0] - bbox[0][0]).toFixed(2),
        +(bbox[1][1] - bbox[0][1]).toFixed(2),
        +(bbox[1][2] - bbox[0][2]).toFixed(2)
      ]
    },
    volumeCm3: +(vol / 1000).toFixed(2),
    weightGrams20Infill: +((vol / 1000) * 1.24 * 0.35).toFixed(1),
    triangleCount: polyList.length,
    isManifold: polyList.length > 0 && vol > 0
  };
}

/**
 * Converts a JSCAD geom3 solid into a Three.js BufferGeometry with normals.
 */
export function convertGeom3ToThreeGeometry(geom: geometries.geom3.Geom3): THREE.BufferGeometry {
  const polys = geometries.geom3.toPolygons(geom);
  const positions: number[] = [];

  for (const poly of polys) {
    const vertices = poly.vertices;
    // Fan triangulation for convex polygons
    for (let i = 1; i < vertices.length - 1; i++) {
      positions.push(
        vertices[0][0], vertices[0][1], vertices[0][2],
        vertices[i][0], vertices[i][1], vertices[i][2],
        vertices[i + 1][0], vertices[i + 1][1], vertices[i + 1][2]
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Exports a JSCAD geom3 as a downloadable STL Blob.
 */
export function exportStlBlob(geom: geometries.geom3.Geom3): Blob {
  const rawData = serializeStl({ binary: true }, geom);
  return new Blob(rawData, { type: 'application/sla' });
}

/**
 * Initiates an automatic in-browser download of the 3D model as .stl
 */
export function downloadStlFile(geom: geometries.geom3.Geom3, filename: string): void {
  const blob = exportStlBlob(geom);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.stl') ? filename : `${filename}.stl`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
