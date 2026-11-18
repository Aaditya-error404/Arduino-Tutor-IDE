---
name: cad-csg-slicer-studio
description: >-
  Playbook for the 3D CAD modeling, OpenSCAD CSG solid geometry engine, Three.js WebGL viewport,
  and G-Code 3D printer slicer. Activate when working on cadCsgEngine.ts, CadStudioPage.tsx,
  CadStudioViewport.tsx, SlicerControls.tsx, or Lab 6 (CAD) / Lab 13 (Slicer).
---

# 3D CAD, CSG Solid Geometry & Toolpath Slicer Skill

## Overview
SparkByte Studio v2 features an integrated parametric **3D CAD Studio** and **3D Printer Toolpath Slicer**. It compiles an OpenSCAD-subset syntax into 3D CSG solid geometries using `@jscad/modeling`, renders them with Three.js, exports binary/ASCII STL files, and visualizes layer-by-layer G-Code toolpaths.

---

## 1. Subsystem Architecture

```
OpenSCAD Script ──► [cadCompiler.ts / cadCsgEngine.ts] ──► @jscad/modeling CSG Polygons
                                                                 │
                                                                 ▼
Three.js Viewport ◄── BufferGeometry & Mesh ◄── Polygon-to-Triangle Tesselation
        │
        ├──► Binary / ASCII STL Exporter (Zero server roundtrip)
        └──► Slicer Toolpath Engine (G0/G1 travel, extrusion, layer stepping)
```

---

## 2. Core CSG & Modeling Rules

1. **CSG Primitives & Booleans (`@jscad/modeling`):**
   - `cube([x, y, z], center = true/false)`
   - `cylinder(h, r, center = true/false)` / `sphere(r)`
   - `union()` &rarr; merges solids
   - `difference()` &rarr; subtracts subsequent shapes from the first base shape
   - `intersection()` &rarr; preserves overlapping solid volumes
2. **BufferGeometry Generation:**
   Convert CSG polygon vertices into indexed Three.js `BufferGeometry`:
   - Compute face normals using `geometry.computeVertexNormals()`
   - Always assign two-sided material (`THREE.DoubleSide`) so internal cutouts remain lit.
3. **Three.js Memory Cleanup & Leaks:**
   When re-evaluating CSG meshes on student code edits:
   - Always call `oldGeometry.dispose()` and `oldMaterial.dispose()`.
   - Remove dead meshes from `scene` before instantiating new geometry to avoid WebGL context exhaustion.

---

## 3. Toolpath Slicer & Kinematics Invariants

1. **G-Code Parser & Layer Stepping:**
   - `G21`: Millimeter units
   - `G90`: Absolute coordinate system
   - `G28`: Auto-home XYZ axes
   - `G1 X.. Y.. Z.. E.. F..`: Controlled linear feed move with extrusion
   - `M104 S.. / M140 S..`: Hotend & Heated bed target temperatures
2. **Interactive Layer Stepping (`slicerState.layer`):**
   - The UI slider controls the active visible layer index `0 .. maxLayers`.
   - The 3D nozzle kinematic coordinates must animate smoothly to the current G1 coordinate without blocking the UI main thread.
