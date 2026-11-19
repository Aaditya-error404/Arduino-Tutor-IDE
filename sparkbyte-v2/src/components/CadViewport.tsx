/**
 * Industrial-Grade CAD & Hardware Simulation Viewport
 *
 * Anti-"AI Slop" Engineering Disciplines:
 * - Subtle engineering dot-grid background (radial-gradient(#27272A 1px, transparent 1px))
 * - Real Three.js WebGL 3D Assembly Viewport with interactive OrbitControls, Pan, Measure, and Wireframe
 * - Camera Presets: ISO, TOP, FRONT, and RESET
 * - Synchronized Real-Time Kinematics: 3D SG90 Servo horn rotation driven by AVR PWM clock ticks
 * - Dual-Mode Viewport Toggle: [ 3D CAD ASSEMBLY ] vs [ CIRCUIT STAGE ]
 * - Bottom-right tabular telemetry overlay card (monospaced metrics ready for avr8js Web Worker)
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Compass,
  Move,
  Ruler,
  Box,
  RotateCcw,
  Gauge,
  PanelRightClose,
  ExternalLink,
  Layers,
  Cpu
} from 'lucide-react';
import { LabSpec, LAB_INDEX_TO_STORE_ID } from '../data/mockCurriculum';
import { LabStageRenderer } from './labs';
import { useWorkbenchStore } from '../store/useWorkbenchStore';

interface CadViewportProps {
  currentLab: LabSpec;
  servoAngle: number; // 0..180 degrees
  pwmDutyPct: number; // 0..100%
  pulseWidthUs: number; // e.g. 1500us
  currentMa: number; // e.g. 142.5mA
  busVoltage: number; // e.g. 5.02V
  isRunning: boolean;
  onManualAngleChange?: (angle: number) => void;
  onToggleMinimize?: () => void;
}

export type CadTool = 'orbit' | 'pan' | 'measure' | 'wireframe';
export type CameraView = 'ISO' | 'TOP' | 'FRONT';
export type ViewportMode = 'cad' | 'circuit';

export const CadViewport: React.FC<CadViewportProps> = ({
  currentLab,
  servoAngle,
  pwmDutyPct,
  pulseWidthUs,
  currentMa,
  busVoltage,
  isRunning,
  onManualAngleChange,
  onToggleMinimize
}) => {
  const storeLabId = LAB_INDEX_TO_STORE_ID[currentLab.id] || 'servo';
  const { hardwareState } = useWorkbenchStore();

  // Mode: CAD 3D Viewport vs 2D Circuit Stage
  const [viewportMode, setViewportMode] = useState<ViewportMode>(() => {
    return storeLabId === 'servo' || storeLabId === 'cad' || storeLabId === 'slicer' ? 'cad' : 'circuit';
  });

  // Switch default view when switching to CAD or Slicer lab
  useEffect(() => {
    if (storeLabId === 'cad' || storeLabId === 'slicer') {
      setViewportMode('cad');
    }
  }, [storeLabId]);

  const [activeTool, setActiveTool] = useState<CadTool>('orbit');
  const [cameraView, setCameraView] = useState<CameraView>('ISO');
  const [isWireframe, setIsWireframe] = useState(false);

  // Three.js References
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const hornGroupRef = useRef<THREE.Group | null>(null);
  const calipersGroupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. INITIALIZE THREE.JS WEBGL VIEWPORT & 3D SG90 / CAD ASSEMBLY
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (viewportMode !== 'cad' || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Z is UP for CAD/EDA)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.up.set(0, 0, 1);
    camera.position.set(130, -150, 110);
    camera.lookAt(0, 0, 15);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 15);
    controls.minDistance = 25;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(100, -120, 160);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 0.4);
    fillLight.position.set(-100, 100, 80);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.35);
    rimLight.position.set(0, 140, -40);
    scene.add(rimLight);

    // 6. Machined Engineering Build Plate (200x200mm at Z = 0)
    const bedGroup = new THREE.Group();
    const bedGeo = new THREE.BoxGeometry(220, 220, 2);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.position.set(0, 0, -1.05);
    bedGroup.add(bedMesh);

    // Bed Grid
    const gridHelper = new THREE.GridHelper(200, 20, 0x06b6d4, 0x27272a);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 0, 0.01);
    bedGroup.add(gridHelper);

    // Coordinate Origin Arrows
    const axisLength = 22;
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0.1), axisLength, 0xef4444, 4, 2);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0.1), axisLength, 0x10b981, 4, 2);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0.1), axisLength, 0x06b6d4, 4, 2);
    bedGroup.add(arrowX, arrowY, arrowZ);
    scene.add(bedGroup);

    // 7. Mechanical Assembly Group
    const assemblyGroup = new THREE.Group();
    const sceneMeshes: THREE.Mesh[] = [];

    // Anodized Aluminum Mounting Fixture
    const mountGeo = new THREE.BoxGeometry(70, 36, 4);
    const mountMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.8 });
    const mountMesh = new THREE.Mesh(mountGeo, mountMat);
    mountMesh.position.set(0, 0, 2);
    assemblyGroup.add(mountMesh);
    sceneMeshes.push(mountMesh);

    // SG90 Blue Polycarbonate Servo Housing
    const bodyGeo = new THREE.BoxGeometry(23, 12, 28);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: 0.92
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.set(0, 0, 18);
    assemblyGroup.add(bodyMesh);
    sceneMeshes.push(bodyMesh);

    // Top Stepped Gear Cylinder
    const gearHousingGeo = new THREE.CylinderGeometry(5.8, 5.8, 5, 32);
    const gearHousingMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.3 });
    const gearHousingMesh = new THREE.Mesh(gearHousingGeo, gearHousingMat);
    gearHousingMesh.rotation.x = Math.PI / 2;
    gearHousingMesh.position.set(-3.5, 0, 34);
    assemblyGroup.add(gearHousingMesh);
    sceneMeshes.push(gearHousingMesh);

    // Brass Spline Output Shaft
    const shaftGeo = new THREE.CylinderGeometry(2.4, 2.4, 4, 24);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.7 });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.rotation.x = Math.PI / 2;
    shaftMesh.position.set(-3.5, 0, 37.5);
    assemblyGroup.add(shaftMesh);
    sceneMeshes.push(shaftMesh);

    // Mounting Tabs with Eyelets
    const earGeo = new THREE.BoxGeometry(32, 12, 2.5);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 });
    const earMesh = new THREE.Mesh(earGeo, earMat);
    earMesh.position.set(0, 0, 23);
    assemblyGroup.add(earMesh);
    sceneMeshes.push(earMesh);

    // 3-Wire Colored Ribbon Cable (Orange / Red / Brown)
    const cableColors = [0xea580c, 0xdc2626, 0x78350f];
    cableColors.forEach((color, i) => {
      const cableGeo = new THREE.CylinderGeometry(0.8, 0.8, 25, 12);
      const cableMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
      const cableMesh = new THREE.Mesh(cableGeo, cableMat);
      cableMesh.position.set(12, -2 + i * 2, 10);
      cableMesh.rotation.x = Math.PI / 3;
      assemblyGroup.add(cableMesh);
      sceneMeshes.push(cableMesh);
    });

    // 8. Rotating Nylon Servo Horn (Driven Live by servoAngle)
    const hornGroup = new THREE.Group();
    hornGroup.position.set(-3.5, 0, 39.5);

    // White Nylon Hub
    const hubGeo = new THREE.CylinderGeometry(4.2, 4.2, 2.2, 24);
    const nylonMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4, metalness: 0.05 });
    const hubMesh = new THREE.Mesh(hubGeo, nylonMat);
    hubMesh.rotation.x = Math.PI / 2;
    hornGroup.add(hubMesh);
    sceneMeshes.push(hubMesh);

    // 2-Arm Nylon Cross Horn Linkage
    const armGeo = new THREE.BoxGeometry(32, 5.5, 1.8);
    const armMesh = new THREE.Mesh(armGeo, nylonMat);
    hornGroup.add(armMesh);
    sceneMeshes.push(armMesh);

    // Horn Tip Indicator Pin (Red Pointer)
    const tipGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.rotation.x = Math.PI / 2;
    tipMesh.position.set(13.5, 0, 0.5);
    hornGroup.add(tipMesh);
    sceneMeshes.push(tipMesh);

    assemblyGroup.add(hornGroup);
    hornGroupRef.current = hornGroup;
    scene.add(assemblyGroup);

    // 9. Caliper Measurement Lines Group
    const calipersGroup = new THREE.Group();
    const caliperBoxGeo = new THREE.BoxGeometry(24, 13, 29);
    const caliperWireGeo = new THREE.WireframeGeometry(caliperBoxGeo);
    const caliperMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
    const caliperLine = new THREE.LineSegments(caliperWireGeo, caliperMat);
    caliperLine.position.set(0, 0, 18);
    calipersGroup.add(caliperLine);
    calipersGroup.visible = false;
    calipersGroupRef.current = calipersGroup;
    scene.add(calipersGroup);

    meshesRef.current = sceneMeshes;

    // 10. Animation & Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 11. Resize Observer for Split-Pane Dragging
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          if (cameraRef.current) {
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
          }
          if (rendererRef.current) {
            rendererRef.current.setSize(w, h);
          }
        }
      }
    });
    observer.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [viewportMode]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. LIVE ANGLE SYNCHRONIZATION WITH SIMULATION TICKS
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (hornGroupRef.current) {
      // Rotate 3D horn around Z axis smoothly matching live servoAngle
      hornGroupRef.current.rotation.z = THREE.MathUtils.degToRad(servoAngle - 90);
    }
  }, [servoAngle]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. TOOLBAR CONTROLS: ORBIT, PAN, MEASURE, WIREFRAME, CAMERA PRESETS
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (activeTool === 'orbit') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
    } else if (activeTool === 'pan') {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
    }
  }, [activeTool]);

  useEffect(() => {
    meshesRef.current.forEach((m) => {
      if (m.material) {
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => {
            if ('wireframe' in mat) (mat as THREE.MeshStandardMaterial).wireframe = isWireframe;
          });
        } else if ('wireframe' in m.material) {
          (m.material as THREE.MeshStandardMaterial).wireframe = isWireframe;
        }
      }
    });
  }, [isWireframe]);

  useEffect(() => {
    if (calipersGroupRef.current) {
      calipersGroupRef.current.visible = activeTool === 'measure';
    }
  }, [activeTool]);

  const setCameraPreset = (view: CameraView) => {
    setCameraView(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (view) {
      case 'ISO':
        camera.position.set(130, -150, 110);
        controls.target.set(0, 0, 15);
        break;
      case 'TOP':
        camera.position.set(0, 0, 220);
        controls.target.set(0, 0, 0);
        break;
      case 'FRONT':
        camera.position.set(0, -220, 15);
        controls.target.set(0, 0, 15);
        break;
    }
    controls.update();
  };

  const handleResetCamera = () => {
    setCameraPreset('ISO');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#09090B] overflow-hidden select-none flex flex-col font-sans"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. SUBTLE ENGINEERING DOT-GRID BACKGROUND
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#27272A 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Axis Marker at Center-Origin */}
      <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-1 font-mono text-[9px] text-[#71717A] z-10">
        <span>X: +120.0mm</span>
        <span>Y: +045.5mm</span>
        <span>Z: +000.0mm</span>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="w-2 h-[2px] bg-[#EF4444]" />
          <span className="w-2 h-[2px] bg-[#10B981]" />
          <span className="w-2 h-[2px] bg-[#06B6D4]" />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING CAD HUD TOOLBAR (TOP-LEFT)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#121215]/95 border border-[#27272A] rounded-sm p-1 shadow-none backdrop-blur-none">
        {/* VIEWPORT MODE SELECTOR: 3D CAD vs CIRCUIT */}
        <div className="flex items-center gap-0.5 bg-[#18181B] p-0.5 rounded-sm border border-[#27272A] font-mono text-[10px]">
          <button
            onClick={() => setViewportMode('cad')}
            className={`px-2 py-0.5 rounded-sm flex items-center gap-1 transition-colors ${
              viewportMode === 'cad'
                ? 'bg-[#F59E0B] text-[#09090B] font-bold'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
            title="3D WebGL Mechanical CAD Assembly Viewport"
          >
            <Box className="w-3 h-3" strokeWidth={1.5} />
            <span>3D CAD</span>
          </button>
          <button
            onClick={() => setViewportMode('circuit')}
            className={`px-2 py-0.5 rounded-sm flex items-center gap-1 transition-colors ${
              viewportMode === 'circuit'
                ? 'bg-[#06B6D4] text-[#09090B] font-bold'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
            }`}
            title="2D Interactive Electronic Circuit Stage"
          >
            <Cpu className="w-3 h-3" strokeWidth={1.5} />
            <span>CIRCUIT</span>
          </button>
        </div>

        <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />

        {/* Tool: ORBIT */}
        <button
          onClick={() => {
            setViewportMode('cad');
            setActiveTool('orbit');
          }}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            activeTool === 'orbit' && viewportMode === 'cad'
              ? 'bg-[#27272A] text-[#F59E0B] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Orbit 3D Assembly Camera (Left Click Drag)"
        >
          <Compass className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>ORBIT</span>
        </button>

        {/* Tool: PAN */}
        <button
          onClick={() => {
            setViewportMode('cad');
            setActiveTool('pan');
          }}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            activeTool === 'pan' && viewportMode === 'cad'
              ? 'bg-[#27272A] text-[#F59E0B] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Pan Viewport Plane (Left Click Drag to Move)"
        >
          <Move className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>PAN</span>
        </button>

        {/* Tool: MEASURE */}
        <button
          onClick={() => {
            setViewportMode('cad');
            setActiveTool(activeTool === 'measure' ? 'orbit' : 'measure');
          }}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            activeTool === 'measure' && viewportMode === 'cad'
              ? 'bg-[#27272A] text-[#06B6D4] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Caliper Dimension Measurement Overlays"
        >
          <Ruler className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>MEASURE</span>
        </button>

        <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />

        {/* Tool: WIREFRAME */}
        <button
          onClick={() => {
            setViewportMode('cad');
            setIsWireframe(!isWireframe);
          }}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            isWireframe && viewportMode === 'cad'
              ? 'bg-[#27272A] text-[#06B6D4] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Toggle Wireframe CAD Mesh"
        >
          <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{isWireframe ? 'WIREFRAME' : 'SHADED'}</span>
        </button>

        <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />

        {/* Camera Views: ISO, TOP, FRONT */}
        <div className="flex items-center gap-0.5 font-mono text-[10px]">
          {(['ISO', 'TOP', 'FRONT'] as CameraView[]).map((cam) => (
            <button
              key={cam}
              onClick={() => {
                setViewportMode('cad');
                setCameraPreset(cam);
              }}
              className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                cameraView === cam && viewportMode === 'cad'
                  ? 'bg-[#F59E0B] text-[#09090B] font-bold'
                  : 'bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5] border border-[#27272A]'
              }`}
              title={`Switch camera view to ${cam}`}
            >
              {cam}
            </button>
          ))}

          {/* Reset Camera Button */}
          <button
            onClick={() => {
              setViewportMode('cad');
              handleResetCamera();
            }}
            className="px-1.5 py-0.5 rounded-sm bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5] border border-[#27272A] transition-colors flex items-center gap-0.5"
            title="Reset Camera View to Default"
          >
            <RotateCcw className="w-2.5 h-2.5" strokeWidth={1.5} />
            <span>RESET</span>
          </button>
        </div>

        {/* Open Standalone CAD Studio Button */}
        <a
          href="/cad-studio"
          target="_blank"
          rel="noreferrer"
          className="px-1.5 py-0.5 rounded-sm bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#06B6D4] font-mono text-[10px] flex items-center gap-1 transition-colors"
          title="Open Full Parametric CAD Studio with CSG Booleans & STL Export"
        >
          <span>CAD STUDIO</span>
          <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
        </a>

        {onToggleMinimize && (
          <>
            <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />
            <button
              onClick={onToggleMinimize}
              className="px-1.5 py-0.5 rounded-sm text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#18181B] font-mono text-[10px] flex items-center gap-1 transition-colors"
              title="Minimize CAD Viewport"
            >
              <PanelRightClose className="w-3 h-3" strokeWidth={1.5} />
              <span>MINIMIZE</span>
            </button>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MECHANICAL CAD SIMULATION CANVAS vs CIRCUIT STAGE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
        {viewportMode === 'cad' ? (
          /* 3D WEBGL CAD VIEWPORT */
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* 3D WebGL Canvas */}
            <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-none" />

            {/* Manual Angle Jog Slider (Overlaid at bottom-left) */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2.5 bg-[#121215]/95 border border-[#27272A] px-2.5 py-1.5 rounded-sm font-mono text-xs shadow-none">
              <span className="text-[10px] text-[#A1A1AA] uppercase shrink-0 font-bold">
                JOG SERVO:
              </span>
              <input
                type="range"
                min="0"
                max="180"
                value={servoAngle}
                onChange={(e) => onManualAngleChange && onManualAngleChange(Number(e.target.value))}
                className="w-28 accent-[#F59E0B] cursor-pointer h-1 bg-[#27272A] rounded-sm"
              />
              <span className="text-[11px] tabular-nums font-bold text-[#F59E0B] w-[42px] text-right">
                {servoAngle.toFixed(1)}°
              </span>
            </div>
          </div>
        ) : (
          /* 2D INTERACTIVE CIRCUIT STAGE (ALL 22 LABS) */
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-auto p-4">
            <div className="font-mono text-[10px] text-[#71717A] tracking-wider uppercase mb-2 flex items-center gap-2">
              <span>CIRCUIT SCHEMATIC & ACTUATION STAGE</span>
              <span>//</span>
              <span className="text-[#06B6D4]">{currentLab.code}: {currentLab.title}</span>
            </div>
            <div className="flex-1 w-full flex items-center justify-center overflow-auto">
              <LabStageRenderer labId={storeLabId} />
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM-RIGHT LIVE ACTUATOR & SENSOR TELEMETRY OVERLAY CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-3 right-3 z-20 w-[270px] bg-[#121215] border border-[#27272A] rounded-sm p-2.5 font-mono text-xs select-none">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#27272A] text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-[#F59E0B]" strokeWidth={1.5} />
            {viewportMode === 'cad' ? 'ACTUATOR TELEMETRY' : 'CIRCUIT TELEMETRY'}
          </span>
          <span className="text-[#06B6D4]">
            {storeLabId === 'servo' ? 'AVR D9 PWM' : `${currentLab.code}`}
          </span>
        </div>

        {/* Big Tabular Displacement / Primary Metric */}
        {storeLabId === 'servo' || viewportMode === 'cad' ? (
          <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
            <span className="text-[10px] text-[#71717A] uppercase">ANGLE DISPLACEMENT</span>
            <div className="text-right">
              <span className="text-xl font-bold text-[#F4F4F5] tabular-nums">
                {String(Math.round(servoAngle)).padStart(3, '0')}.0
              </span>
              <span className="text-[#F59E0B] text-xs font-semibold ml-0.5">°</span>
            </div>
          </div>
        ) : (
          <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
            <span className="text-[10px] text-[#71717A] uppercase">STAGE STATUS</span>
            <div className="text-right">
              <span className="text-sm font-bold text-[#10B981] tabular-nums uppercase">
                {isRunning ? 'ACTIVE RUN' : 'STANDBY'}
              </span>
            </div>
          </div>
        )}

        {/* Tabular Telemetry Matrix */}
        <div className="pt-2 space-y-1.5 text-[10.5px]">
          <div className="flex items-center justify-between">
            <span className="text-[#71717A]">PWM PULSE WIDTH</span>
            <span className="text-[#F4F4F5] tabular-nums font-semibold">
              {(pulseWidthUs / 1000).toFixed(3)} ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#71717A]">PWM DUTY CYCLE</span>
            <span className="text-[#06B6D4] tabular-nums font-semibold">
              {pwmDutyPct.toFixed(1)}% (50Hz)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#71717A]">CURRENT DRAW</span>
            <span className="text-[#F59E0B] tabular-nums font-semibold">
              {(hardwareState.currentMa ?? currentMa).toFixed(1)} mA
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#71717A]">SUPPLY VOLTAGE</span>
            <span className="text-[#10B981] tabular-nums font-semibold">
              +{(hardwareState.voltage ?? busVoltage).toFixed(2)} V DC
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#27272A]/60 text-[9.5px]">
            <span className="text-[#52525B]">CARRIER PERIOD</span>
            <span className="text-[#A1A1AA] tabular-nums">20.00 ms (50.0 Hz)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadViewport;
