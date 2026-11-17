const jscad = require('../sparkbyte-v2/node_modules/@jscad/modeling');
const { primitives, booleans, transforms, measurements, geometries } = jscad;

function parseAndCompileOpenScad(code) {
  // 1. Strip comments
  let src = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .trim();

  // 2. Extract variable declarations
  const vars = {};
  const lines = src.split('\n');
  const nonVarLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const varMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*([^;]+);$/);
    if (varMatch && !/^(cube|cylinder|sphere|translate|rotate|difference|union|intersection)/i.test(varMatch[1])) {
      try {
        const fn = new Function(...Object.keys(vars), `return (${varMatch[2]});`);
        vars[varMatch[1]] = fn(...Object.values(vars));
      } catch (e) {
        vars[varMatch[1]] = parseFloat(varMatch[2]) || 0;
      }
    } else if (trimmed) {
      nonVarLines.push(trimmed);
    }
  }

  let text = nonVarLines.join(' ');

  // Evaluate an expression string within the scope of vars
  const evalExpr = (expr) => {
    try {
      const fn = new Function(...Object.keys(vars), `return (${expr});`);
      return fn(...Object.values(vars));
    } catch {
      return parseFloat(expr) || 0;
    }
  };

  const evalVector = (vecStr) => {
    const clean = vecStr.replace(/^\[/, '').replace(/\]$/, '').trim();
    if (!clean) return [0, 0, 0];
    const parts = clean.split(',').map(p => evalExpr(p.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  };

  // Helper primitives
  const makeCube = (size, center = false) => {
    const s = Array.isArray(size) ? size : [size, size, size];
    const geom = primitives.cuboid({ size: s });
    if (!center) {
      return transforms.translate([s[0]/2, s[1]/2, s[2]/2], geom);
    }
    return geom;
  };

  const makeCylinder = (opts) => {
    const r = opts.r ?? (opts.d !== undefined ? opts.d / 2 : 5);
    const h = opts.h ?? 10;
    const center = opts.center ?? false;
    const geom = primitives.cylinder({ radius: r, height: h, segments: 32 });
    if (!center) {
      return transforms.translate([0, 0, h/2], geom);
    }
    return geom;
  };

  const makeSphere = (opts) => {
    const r = opts.r ?? (opts.d !== undefined ? opts.d / 2 : 10);
    return primitives.sphere({ radius: r, segments: 32 });
  };

  // Parser index
  let pos = 0;

  const skipWhitespace = () => {
    while (pos < text.length && /\s/.test(text[pos])) pos++;
  };

  const matchKeyword = (kw) => {
    skipWhitespace();
    if (text.startsWith(kw, pos)) {
      pos += kw.length;
      return true;
    }
    return false;
  };

  const parseArguments = () => {
    skipWhitespace();
    if (text[pos] !== '(') return {};
    pos++; // skip '('
    let depth = 1;
    let start = pos;
    while (pos < text.length && depth > 0) {
      if (text[pos] === '(') depth++;
      else if (text[pos] === ')') depth--;
      pos++;
    }
    const rawArgs = text.slice(start, pos - 1).trim();
    // Parse key-value or positional args
    const result = {};
    if (!rawArgs) return result;

    // Split by comma outside brackets/parens
    const argList = [];
    let cur = '', bDepth = 0;
    for (let c of rawArgs) {
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
        const [k, v] = a.split('=').map(s => s.trim());
        if (v.startsWith('[')) result[k] = evalVector(v);
        else result[k] = evalExpr(v);
      } else {
        if (a.startsWith('[')) result[i] = evalVector(a);
        else result[i] = evalExpr(a);
      }
    }
    return result;
  };

  const parseBlockOrStatement = () => {
    skipWhitespace();
    if (pos >= text.length) return null;

    if (text[pos] === '{') {
      pos++; // skip '{'
      const children = [];
      while (pos < text.length) {
        skipWhitespace();
        if (text[pos] === '}') {
          pos++; // skip '}'
          break;
        }
        const child = parseBlockOrStatement();
        if (child) children.push(child);
      }
      if (children.length === 0) return null;
      return children.length === 1 ? children[0] : booleans.union(...children);
    }

    // Check statements: cube, cylinder, sphere, translate, rotate, difference, union, intersection
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
      const vec = args[0] || [0, 0, 0];
      const child = parseBlockOrStatement();
      if (!child) return null;
      return transforms.translate(vec, child);
    }

    if (matchKeyword('rotate')) {
      const args = parseArguments();
      const degVec = args[0] || [0, 0, 0];
      const radVec = degVec.map(d => d * Math.PI / 180);
      const child = parseBlockOrStatement();
      if (!child) return null;
      return transforms.rotate(radVec, child);
    }

    if (matchKeyword('difference')) {
      parseArguments(); // skip ()
      skipWhitespace();
      if (text[pos] === '{') {
        pos++;
        const children = [];
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
        const children = [];
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
        const children = [];
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

    // Skip unparsed tokens
    pos++;
    return null;
  };

  const results = [];
  while (pos < text.length) {
    const node = parseBlockOrStatement();
    if (node) results.push(node);
  }

  const finalGeom = results.length === 0 ? makeCube([40, 30, 20]) : (results.length === 1 ? results[0] : booleans.union(...results));
  const bbox = measurements.measureBoundingBox(finalGeom);
  const vol = measurements.measureVolume(finalGeom);

  return {
    geom: finalGeom,
    vars,
    bbox: {
      min: bbox[0],
      max: bbox[1],
      dimensions: [
        +(bbox[1][0] - bbox[0][0]).toFixed(2),
        +(bbox[1][1] - bbox[0][1]).toFixed(2),
        +(bbox[1][2] - bbox[0][2]).toFixed(2)
      ]
    },
    volumeCm3: +(vol / 1000).toFixed(2),
    weightGrams20Infill: +((vol / 1000) * 1.24 * 0.35).toFixed(1),
    triangleCount: geometries.geom3.toPolygons(finalGeom).length
  };
}

// Test on Preset 1: Sensor Box
const codeP1 = `
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
}
`;

const res1 = parseAndCompileOpenScad(codeP1);
console.log('Preset 1 Result:', {
  vars: res1.vars,
  dims: res1.bbox.dimensions,
  vol: res1.volumeCm3,
  weight: res1.weightGrams20Infill,
  triangles: res1.triangleCount
});
// Append presets to test_parser_full.js
const fs = require('fs');

const codeP2 = `
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
}
`;

const res2 = parseAndCompileOpenScad(codeP2);
console.log('Preset 2 (Ultrasonic) Result:', {
  vars: res2.vars,
  dims: res2.bbox.dimensions,
  vol: res2.volumeCm3,
  weight: res2.weightGrams20Infill,
  triangles: res2.triangleCount
});
const codeP3 = `
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
    translate([0, 0, -1]) {
        cylinder(d=shaftHole, h=hubHeight + 2);
    }
    translate([-armLength/2 + 3, 0, -1]) {
        cylinder(d=1.5, h=armThickness + 2);
    }
    translate([armLength/2 - 3, 0, -1]) {
        cylinder(d=1.5, h=armThickness + 2);
    }
}
`;

const res3 = parseAndCompileOpenScad(codeP3);
console.log('Preset 3 (Servo Arm) Result:', {
  vars: res3.vars,
  dims: res3.bbox.dimensions,
  vol: res3.volumeCm3,
  weight: res3.weightGrams20Infill,
  triangles: res3.triangleCount
});

const codeP4 = `
baseLength = 75;
baseWidth = 60;
baseThick = 2.5;
postHeight = 4.0;
postDia = 6.0;
holeDia = 2.8;

union() {
    difference() {
        cube([baseLength, baseWidth, baseThick]);
        translate([10, 10, -1]) {
            cube([baseLength - 20, baseWidth - 20, baseThick + 2]);
        }
    }
    translate([14.0, 5.5, 0]) {
        cylinder(d=postDia, h=baseThick + postHeight);
    }
    translate([15.3, 50.8, 0]) {
        cylinder(d=postDia, h=baseThick + postHeight);
    }
    translate([66.1, 35.6, 0]) {
        cylinder(d=postDia, h=baseThick + postHeight);
    }
    translate([66.1, 7.6, 0]) {
        cylinder(d=postDia, h=baseThick + postHeight);
    }
}
`;

const res4 = parseAndCompileOpenScad(codeP4);
console.log('Preset 4 (Uno Base) Result:', {
  vars: res4.vars,
  dims: res4.bbox.dimensions,
  vol: res4.volumeCm3,
  weight: res4.weightGrams20Infill,
  triangles: res4.triangleCount
});
