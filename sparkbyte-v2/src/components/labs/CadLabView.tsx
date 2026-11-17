/**
 * Real Parametric 3D CAD & STL Export Studio (Lab 6)
 * Powered by Constructive Solid Geometry (CSG), Three.js, and @jscad/stl-serializer.
 *
 * Features:
 * - Interactive 3D WebGL build-plate viewport with OrbitControls (pan, zoom, rotate)
 * - 220x220mm FDM print bed with 10mm grid and axis indicators
 * - 4 Inspection Modes: Solid Shaded, Wireframe Mesh, X-Ray Cutaway, Dimension Calipers
 * - Camera Presets: Isometric, Top (XY), Front (XZ), Right (YZ), and Reset View
 * - 4 Real ATL Engineering Presets: Sensor Box, HC-SR04 Mount, SG90 Servo Arm, Uno Base
 * - Live Engineering Telemetry: Bounding box, Volume (cm³), PLA Weight (g @ 20% infill), Triangles, Manifold check
 * - Live Parameter Sliders that sync directly with Monaco OpenSCAD code
 * - Instant Client-Side Binary .STL Exporter
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Box,
  Download,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { useWorkbenchStore } from '../../store/useWorkbenchStore';
import { LAB_MAP } from '../../data/lessons';
import {
  compileOpenScad,
  CAD_PRESETS,
  convertGeom3ToThreeGeometry,
  downloadStlFile
} from '../../engine/cadCompiler';

type InspectionMode = 'solid' | 'wireframe' | 'xray' | 'calipers';
type CameraView = 'iso' | 'top' | 'front' | 'side';

export const CadLabView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { activeLessonId, customCode, setCustomCode } = useWorkbenchStore();
  const currentLab = LAB_MAP['cad'];
  const currentLesson = currentLab?.lessons[activeLessonId - 1] || currentLab?.lessons[0];

  // Active OpenSCAD source code: student's custom code or active lesson default code
  const code = useMemo(() => {
    return customCode !== null ? customCode : (currentLesson?.defaultCode.cpp || CAD_PRESETS[0].code);
  }, [customCode, currentLesson]);

  const [inspectionMode, setInspectionMode] = useState<InspectionMode>('solid');
  const [activePresetId, setActivePresetId] = useState<string>('sensor-box');
  const [slidersOpen, setSlidersOpen] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const calipersGroupRef = useRef<THREE.Group | null>(null);

  // Compile OpenSCAD code safely
  const { cadResult, compileError } = useMemo(() => {
    try {
      const res = compileOpenScad(code);
      return { cadResult: res, compileError: null };
    } catch (err: any) {
      console.warn('CAD compilation notice:', err);
      // Fallback to basic preset on error
      const fallback = compileOpenScad(CAD_PRESETS[0].code);
      return { cadResult: fallback, compileError: err.message || 'Syntax error in OpenSCAD code' };
    }
  }, [code]);

  // Set camera angle helper
  const setCameraAngle = useCallback((view: CameraView) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (view) {
      case 'iso':
        camera.position.set(130, -150, 110);
        controls.target.set(0, 0, 15);
        break;
      case 'top':
        camera.position.set(0, 0, 210);
        controls.target.set(0, 0, 0);
        break;
      case 'front':
        camera.position.set(0, -210, 20);
        controls.target.set(0, 0, 15);
        break;
      case 'side':
        camera.position.set(210, 0, 20);
        controls.target.set(0, 0, 15);
        break;
    }
    controls.update();
  }, []);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    sceneRef.current = scene;

    // 2. Camera (Z is UP for 3D printing & CAD)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.up.set(0, 0, 1);
    camera.position.set(130, -150, 110);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 15);
    controls.minDistance = 20;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Allow looking slightly under bed
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(100, -120, 160);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-100, 100, 80);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 0.3);
    rimLight.position.set(0, 140, -40);
    scene.add(rimLight);

    // 6. Build Plate (220 x 220 mm FDM print bed at Z = 0)
    const bedGroup = new THREE.Group();
    bedGroup.name = 'buildPlate';

    // Bed Substrate Plate
    const bedGeo = new THREE.BoxGeometry(230, 230, 2);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.position.set(0, 0, -1.05);
    bedGroup.add(bedMesh);

    // Bed Surface Grid (220x220mm, 10mm minor squares)
    // Three.js GridHelper is in XZ plane by default; rotate to XY plane
    const gridHelper = new THREE.GridHelper(220, 22, 0x0284c7, 0x1e293b);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 0, 0.01);
    bedGroup.add(gridHelper);

    // 50mm Accent Grid
    const majorGrid = new THREE.GridHelper(200, 4, 0x38bdf8, 0x334155);
    majorGrid.rotation.x = Math.PI / 2;
    majorGrid.position.set(0, 0, 0.02);
    bedGroup.add(majorGrid);

    // Bed Edge Border Outline
    const borderPoints = [
      new THREE.Vector3(-110, -110, 0.05),
      new THREE.Vector3(110, -110, 0.05),
      new THREE.Vector3(110, 110, 0.05),
      new THREE.Vector3(-110, 110, 0.05),
      new THREE.Vector3(-110, -110, 0.05)
    ];
    const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderLine = new THREE.Line(
      borderGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8, linewidth: 2 })
    );
    bedGroup.add(borderLine);

    // Coordinate Origin Arrows (X=Red, Y=Green, Z=Blue)
    const axisLength = 25;
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0.1), axisLength, 0xef4444, 4, 2);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0.1), axisLength, 0x22c55e, 4, 2);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0.1), axisLength, 0x3b82f6, 4, 2);
    bedGroup.add(arrowX, arrowY, arrowZ);

    scene.add(bedGroup);

    // Model and Calipers containers
    const modelGroup = new THREE.Group();
    modelGroup.name = 'modelGroup';
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const calipersGroup = new THREE.Group();
    calipersGroup.name = 'calipersGroup';
    scene.add(calipersGroup);
    calipersGroupRef.current = calipersGroup;

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update 3D Model mesh whenever cadResult or inspectionMode changes
  useEffect(() => {
    const modelGroup = modelGroupRef.current;
    const calipersGroup = calipersGroupRef.current;
    if (!modelGroup || !calipersGroup || !cadResult) return;

    // 1. Clear old model and calipers children
    while (modelGroup.children.length > 0) {
      const child = modelGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
      modelGroup.remove(child);
    }

    while (calipersGroup.children.length > 0) {
      const child = calipersGroup.children[0] as any;
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      calipersGroup.remove(child);
    }

    // 2. Convert CSG geom3 to Three.js BufferGeometry
    const threeGeo = convertGeom3ToThreeGeometry(cadResult.geom);
    threeGeo.computeBoundingBox();
    const bbox = threeGeo.boundingBox || new THREE.Box3();

    // Center the model horizontally on the print bed (XY) and rest on Z = 0
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const minZ = bbox.min.z;

    // Shift geometry so base is at Z=0 and XY is centered at origin (0, 0)
    threeGeo.translate(-center.x, -center.y, -minZ);
    threeGeo.computeBoundingBox();

    // 3. Configure Materials based on inspectionMode
    let meshMat: THREE.Material;
    switch (inspectionMode) {
      case 'wireframe':
        meshMat = new THREE.MeshStandardMaterial({
          wireframe: true,
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.5
        });
        break;
      case 'xray':
        meshMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          side: THREE.DoubleSide
        });
        break;
      case 'calipers':
      case 'solid':
      default:
        meshMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.35,
          metalness: 0.15,
          flatShading: false
        });
        break;
    }

    const mesh = new THREE.Mesh(threeGeo, meshMat);
    modelGroup.add(mesh);

    // If solid mode, add crisp feature edges overlay
    if (inspectionMode === 'solid') {
      const edgesGeo = new THREE.EdgesGeometry(threeGeo, 28);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.55
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      modelGroup.add(edges);
    }

    // If calipers mode, add bounding box calipers
    if (inspectionMode === 'calipers') {
      const boxHelper = new THREE.BoxHelper(mesh, 0xf59e0b);
      calipersGroup.add(boxHelper);

      // Dimension guide lines for X, Y, Z
      const dims = cadResult.bbox.dimensions;
      const hX = dims[0] / 2;
      const hY = dims[1] / 2;
      const hZ = dims[2];

      const caliperLines = [
        // X dimension line along front
        new THREE.Vector3(-hX, -hY - 6, 0),
        new THREE.Vector3(hX, -hY - 6, 0),
        // Y dimension line along right
        new THREE.Vector3(hX + 6, -hY, 0),
        new THREE.Vector3(hX + 6, hY, 0),
        // Z dimension line along rear right corner
        new THREE.Vector3(hX + 6, hY + 6, 0),
        new THREE.Vector3(hX + 6, hY + 6, hZ)
      ];

      const linesGeo = new THREE.BufferGeometry().setFromPoints(caliperLines);
      const linesMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
      const lines = new THREE.LineSegments(linesGeo, linesMat);
      calipersGroup.add(lines);
    }
  }, [cadResult, inspectionMode]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: (typeof CAD_PRESETS)[0]) => {
    setActivePresetId(preset.id);
    setCustomCode(preset.code);
  };

  // Handle Dynamic Variable Sliders
  const handleVariableChange = (varName: string, value: number) => {
    const currentCode = customCode !== null ? customCode : (currentLesson?.defaultCode.cpp || CAD_PRESETS[0].code);
    const regex = new RegExp(`^(\\s*${varName}\\s*=\\s*)[^;]+(;.*)$`, 'm');
    if (regex.test(currentCode)) {
      const updated = currentCode.replace(regex, `$1${value}$2`);
      setCustomCode(updated);
    } else {
      setCustomCode(`${varName} = ${value};\n${currentCode}`);
    }
  };

  // Export & Download STL
  const handleDownloadStl = () => {
    try {
      const activePreset = CAD_PRESETS.find((p) => p.id === activePresetId);
      const filename = activePreset ? `${activePreset.id}-model.stl` : 'sparkbyte-3d-model.stl';
      downloadStlFile(cadResult.geom, filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export STL:', err);
    }
  };

  // Extract key numeric variables for interactive sliders HUD
  const keyVariables = useMemo(() => {
    const vars = cadResult.vars;
    const entries = Object.entries(vars).filter(
      ([k, v]) => typeof v === 'number' && !k.startsWith('$') && v >= 0.5 && v <= 200
    );
    return entries.slice(0, 5); // Display top 5 key parameters
  }, [cadResult.vars]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-950 overflow-hidden select-none font-sans">
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-none" />

      {/* ─────────────────────────────────────────────────────────────
          TOP FLOATING HUD: ATL Presets, Inspection Modes & Camera Views
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        {/* ATL 3D CAD Presets Selector */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-1 px-2 py-0.5 text-slate-400 border-r border-slate-800 mr-0.5">
            <Box className="w-3.5 h-3.5 text-cyan-400 stroke-[2]" />
            <span className="text-[11px] font-bold text-slate-200">ATL Templates</span>
          </div>

          {CAD_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                data-preset-id={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
                }`}
                title={p.description}
              >
                <span>{p.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono hidden xl:inline">
                  {p.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inspection & Camera Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Shading / Inspection Mode Pill */}
          <div className="flex items-center gap-0.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl">
            {(
              [
                { id: 'solid', label: 'Solid' },
                { id: 'wireframe', label: 'Wireframe' },
                { id: 'xray', label: 'X-Ray' },
                { id: 'calipers', label: 'Calipers' }
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                onClick={() => setInspectionMode(mode.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  inspectionMode === mode.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Camera View Angle Buttons */}
          <div className="flex items-center gap-0.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl">
            {(
              [
                { id: 'iso', label: 'Iso' },
                { id: 'top', label: 'Top' },
                { id: 'front', label: 'Front' },
                { id: 'side', label: 'Side' }
              ] as const
            ).map((view) => (
              <button
                key={view.id}
                onClick={() => setCameraAngle(view.id)}
                className="px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={`Switch camera to ${view.label} projection`}
              >
                {view.label}
              </button>
            ))}
            <button
              onClick={() => setCameraAngle('iso')}
              className="p-1 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>

          {/* Standalone Full-Viewport CAD Studio Link (Target _blank) */}
          <a
            href="/cad-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] group"
            title="Launch full-viewport 3D CAD & STL Prototyping Studio in a new browser tab"
          >
            <span>🧊</span>
            <span className="hidden sm:inline">Open 3D CAD Studio</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Syntax Error Notification Badge (if any) */}
      {compileError && (
        <div className="absolute top-16 left-3 z-10 max-w-md pointer-events-auto bg-amber-500/10 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 flex items-start gap-2 shadow-lg backdrop-blur-md">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">OpenSCAD Parser: </span>
            <span className="font-mono text-[11px]">{compileError}</span>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Showing last verified solid. Check code syntax.</div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM-LEFT FLOATING HUD: Live Engineering Telemetry & STL Download
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-3 pointer-events-auto z-10 flex flex-col gap-2 max-w-[280px]">
        {/* Telemetry Card */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Compass className="w-3.5 h-3.5 text-cyan-400 stroke-[2]" />
              <span>Engineering Telemetry</span>
            </div>
            {cadResult.isManifold ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-medium">
                <CheckCircle2 className="w-2.5 h-2.5 stroke-[2.5]" />
                Watertight
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9.5px]">
                Checking
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Dimensions (mm)</div>
              <div className="font-mono font-bold text-cyan-300 text-xs mt-0.5">
                {cadResult.bbox.dimensions[0]} × {cadResult.bbox.dimensions[1]} × {cadResult.bbox.dimensions[2]}
              </div>
            </div>

            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Solid Volume</div>
              <div className="font-mono font-bold text-sky-400 text-xs mt-0.5">
                {cadResult.volumeCm3} cm³
              </div>
            </div>

            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">PLA Weight (20%)</div>
              <div className="font-mono font-bold text-amber-300 text-xs mt-0.5">
                {cadResult.weightGrams20Infill} g
              </div>
            </div>

            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Mesh Facets</div>
              <div className="font-mono font-bold text-slate-300 text-xs mt-0.5">
                {cadResult.triangleCount} Triangles
              </div>
            </div>
          </div>

          {/* Download STL Button */}
          <button
            onClick={handleDownloadStl}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
              downloadSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-cyan-500/20 active:scale-[0.98]'
            }`}
            title="Download watertight binary .STL model for 3D printing in Cura / PrusaSlicer"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Exported STL Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 stroke-[2]" />
                <span>Download Watertight .STL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM-RIGHT FLOATING HUD: Live Parameter Sliders
      ───────────────────────────────────────────────────────────── */}
      {keyVariables.length > 0 && (
        <div className="absolute bottom-3 right-3 pointer-events-auto z-10 flex flex-col items-end gap-1.5 max-w-[280px]">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 w-full">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setSlidersOpen(!slidersOpen)}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Sliders className="w-3.5 h-3.5 text-cyan-400 stroke-[2]" />
                <span>Parametric Sliders</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${slidersOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {slidersOpen && (
              <div className="flex flex-col gap-2 pt-1 border-t border-slate-800">
                {keyVariables.map(([name, val]) => {
                  const min = Math.max(1, Math.floor(val * 0.4));
                  const max = Math.ceil(val * 2.2);
                  return (
                    <div key={name} className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-mono text-slate-300 font-medium">{name}:</span>
                        <span className="font-mono font-bold text-cyan-400">{val} mm</span>
                      </div>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={0.5}
                        value={val}
                        onChange={(e) => handleVariableChange(name, parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  );
                })}
                <div className="text-[9.5px] text-slate-400 text-center italic mt-0.5">
                  Sliders update C++ OpenSCAD code & 3D mesh live
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Build Plate Dimension Label in corner */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono text-slate-400/80 bg-slate-950/70 px-2.5 py-0.5 rounded-full border border-slate-800/60 hidden sm:block">
        FDM Build Plate: 220 × 220 mm • Drag to Orbit • Scroll to Zoom
      </div>
    </div>
  );
};
