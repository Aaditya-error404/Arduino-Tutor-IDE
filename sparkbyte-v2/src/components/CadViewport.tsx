/**
 * Industrial-Grade CAD & Hardware Simulation Viewport for All 22 ATL Labs
 *
 * Anti-"AI Slop" Engineering Disciplines:
 * - Subtle engineering dot-grid background (radial-gradient(#27272A 1px, transparent 1px))
 * - Real Three.js WebGL 3D Assembly Viewport with interactive OrbitControls, Pan, Measure, and Wireframe
 * - Multi-Lab 3D Kinematics: Real-time 3D models for all 22 ATL Labs correlated directly with ATmega328P simulation
 * - Dynamic Telemetry Matrix: Adapts live engineering readouts per lab (monospaced tabular numerals)
 * - Dual-Mode Viewport Toggle: [ 3D CAD ASSEMBLY ] vs [ CIRCUIT STAGE ]
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
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
  Cpu
} from 'lucide-react';
import { LabSpec, LAB_INDEX_TO_STORE_ID } from '../data/mockCurriculum';
import { LabStageRenderer } from './labs';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { buildLab3DAssembly, DynamicAssemblyRefs } from './cad/cadAssemblies';

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
  onManualAngleChange: _onManualAngleChange,
  onToggleMinimize
}) => {
  const storeLabId = LAB_INDEX_TO_STORE_ID[currentLab.id] || 'servo';
  const { hardwareState, customCode } = useWorkbenchStore();

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
  const calipersGroupRef = useRef<THREE.Group | null>(null);
  const activeAssemblyGroupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const dynamicRefsRef = useRef<DynamicAssemblyRefs>({});
  const hardwareStateRef = useRef(hardwareState);
  hardwareStateRef.current = hardwareState;

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. INITIALIZE THREE.JS WEBGL VIEWPORT & BASE BUILD PLATE
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
    controls.minDistance = 20;
    controls.maxDistance = 600;
    controls.maxPolarAngle = Math.PI / 2 + 0.12;
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
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

    // 6. Machined Engineering Build Plate (220x220mm at Z = 0)
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

    // 7. Caliper Measurement Lines Group
    const calipersGroup = new THREE.Group();
    calipersGroup.visible = false;
    scene.add(calipersGroup);
    calipersGroupRef.current = calipersGroup;

    // 8. Animation & Render Loop with Real-Time Kinematics
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();

      const refs = dynamicRefsRef.current;
      const hw = hardwareStateRef.current;

      // Real-time kinematic actuation per lab
      if (refs.hornGroup) {
        refs.hornGroup.rotation.z = THREE.MathUtils.degToRad((hw.servoAngle ?? 90) - 90);
      }

      if (refs.fanGroup) {
        const spd = hw.motorSpeed || (hw.fanActive ? (hw.fanSpeed || 200) : 0);
        if (spd > 0) {
          const dir = hw.motorDirection === 'BACKWARD' ? -1 : 1;
          refs.fanGroup.rotation.z += (spd / 255) * 0.45 * dir;
        }
      }

      if (refs.imuGroup) {
        refs.imuGroup.rotation.x = THREE.MathUtils.degToRad(hw.imuPitch || 0);
        refs.imuGroup.rotation.y = THREE.MathUtils.degToRad(hw.imuRoll || 0);
      }

      if (refs.sonarTarget && refs.sonarBeam) {
        const rawDist = hw.distanceCm != null ? hw.distanceCm : 25;
        const clampedDist = Math.max(4, Math.min(65, rawDist));
        refs.sonarTarget.position.y = -clampedDist;
        refs.sonarBeam.scale.set(clampedDist / 25, clampedDist / 25, clampedDist / 25);
      }

      if (refs.potKnob) {
        const pot = hw.potVal != null ? hw.potVal : 512;
        const angleRad = THREE.MathUtils.degToRad((pot / 1023) * 270 - 135);
        refs.potKnob.rotation.z = -angleRad;
      }

      if (refs.buttonPlunger) {
        refs.buttonPlunger.position.z = hw.buttonPressed ? 9.2 : 10.5;
      }

      if (refs.ledMesh && refs.ledLight) {
        const duty = hw.ledOn ? (hw.pwmDuty ? hw.pwmDuty / 255 : 1) : 0;
        (refs.ledMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15 + duty * 1.8;
        refs.ledLight.intensity = duty * 2.5;
      }

      if (refs.rgbMesh && refs.rgbLight) {
        const r = (hw.rgbR ?? 255) / 255;
        const g = (hw.rgbG ?? 255) / 255;
        const b = (hw.rgbB ?? 255) / 255;
        (refs.rgbMesh.material as THREE.MeshStandardMaterial).emissive.setRGB(r, g, b);
        refs.rgbLight.color.setRGB(r, g, b);
      }

      if (refs.buzzerRings) {
        refs.buzzerRings.visible = Boolean(hw.buzzerActive);
        if (hw.buzzerActive) {
          const s = 1.0 + (Math.sin(Date.now() * 0.02) * 0.15 + 0.15);
          refs.buzzerRings.scale.set(s, s, 1);
        }
      }

      if (refs.slicerNozzle && hw.slicerState) {
        refs.slicerNozzle.position.set(
          hw.slicerState.nozzleX || 0,
          hw.slicerState.nozzleY || 0,
          (hw.slicerState.nozzleZ || 5) + 12
        );
      }

      if (refs.deadboltLatch) {
        const targetX = hw.rfidAuthorized ? 40 : 24;
        refs.deadboltLatch.position.x += (targetX - refs.deadboltLatch.position.x) * 0.1;
      }

      if (refs.relayStatusLed) {
        (refs.relayStatusLed.material as THREE.MeshBasicMaterial).color.setHex(
          hw.relayActive ? 0x22c55e : 0xdc2626
        );
      }

      if (refs.tempBadge) {
        const temp = hw.temperatureC != null ? hw.temperatureC : 25;
        const tNorm = Math.max(0, Math.min(1, (temp - 10) / 40));
        (refs.tempBadge.material as THREE.MeshBasicMaterial).color.setRGB(
          tNorm,
          0.7 * (1 - Math.abs(tNorm - 0.5) * 2),
          1 - tNorm
        );
      }

      if (refs.gasCore && refs.gasLight) {
        const ppm = hw.gasPpm != null ? hw.gasPpm : 220;
        const hot = ppm > 400;
        (refs.gasCore.material as THREE.MeshStandardMaterial).emissiveIntensity = hot ? 1.5 : 0.5;
        refs.gasLight.intensity = hot ? 1.8 : 0.6;
      }

      if (refs.ldrRay) {
        const ldr = hw.ldrRaw != null ? hw.ldrRaw : 500;
        (refs.ldrRay.material as THREE.MeshBasicMaterial).opacity = 0.1 + (ldr / 1023) * 0.6;
      }

      if (refs.irDisc && (hw.motorSpeed || isRunning)) {
        refs.irDisc.rotation.z += 0.05;
      }

      if (refs.iotWaves) {
        const s = 1.0 + (Math.sin(Date.now() * 0.01) * 0.2 + 0.2);
        refs.iotWaves.scale.set(s, s, s);
        if (refs.iotTxLed) {
          (refs.iotTxLed.material as THREE.MeshBasicMaterial).color.setHex(
            Math.random() > 0.6 ? 0x06b6d4 : 0x0e7490
          );
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 9. Resize Observer for Split-Pane Dragging
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          if (cameraRef.current) {
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
          }
          if (rendererRef.current) {
            rendererRef.current.setSize(w, h, false);
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
  // 2. DISPATCH & REBUILD 3D CAD ASSEMBLY WHEN LAB OR CODE CHANGES
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (viewportMode !== 'cad' || !scene) return;

    // Remove old assembly from scene
    if (activeAssemblyGroupRef.current) {
      scene.remove(activeAssemblyGroupRef.current);
    }

    // Build authentic 3D assembly for this lab
    const result = buildLab3DAssembly(storeLabId, customCode);
    activeAssemblyGroupRef.current = result.group;
    meshesRef.current = result.meshes;
    dynamicRefsRef.current = result.dynamicRefs;
    scene.add(result.group);

    // Update Calipers box
    if (calipersGroupRef.current) {
      calipersGroupRef.current.clear();
      const { width: cw, depth: cd, height: ch } = result.caliperDimensions;
      const caliperBoxGeo = new THREE.BoxGeometry(cw, cd, ch);
      const caliperWireGeo = new THREE.WireframeGeometry(caliperBoxGeo);
      const caliperMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
      const caliperLine = new THREE.LineSegments(caliperWireGeo, caliperMat);
      caliperLine.position.set(0, 0, ch / 2);
      calipersGroupRef.current.add(caliperLine);
      calipersGroupRef.current.visible = activeTool === 'measure';
    }

    // Apply wireframe state if active
    result.meshes.forEach((m) => {
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
  }, [storeLabId, customCode, viewportMode]);

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

        {/* CAD NAVIGATION TOOLS (Enabled in 3D CAD Mode) */}
        {viewportMode === 'cad' && (
          <>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setActiveTool('orbit')}
                className={`p-1.5 rounded-sm transition-colors ${
                  activeTool === 'orbit'
                    ? 'bg-[#27272A] text-[#F59E0B]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
                title="Orbit Camera (Left Mouse Rotate)"
              >
                <Compass className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setActiveTool('pan')}
                className={`p-1.5 rounded-sm transition-colors ${
                  activeTool === 'pan'
                    ? 'bg-[#27272A] text-[#F59E0B]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
                title="Pan Viewport (Left Mouse Pan)"
              >
                <Move className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setActiveTool(activeTool === 'measure' ? 'orbit' : 'measure')}
                className={`p-1.5 rounded-sm transition-colors ${
                  activeTool === 'measure'
                    ? 'bg-[#27272A] text-[#06B6D4]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
                title="Dimension Caliper Overlays"
              >
                <Ruler className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setIsWireframe(!isWireframe)}
                className={`p-1.5 rounded-sm transition-colors ${
                  isWireframe
                    ? 'bg-[#27272A] text-[#06B6D4]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
                title="Toggle Wireframe Mesh"
              >
                <Box className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />

            {/* CAMERA PRESETS */}
            <div className="flex items-center gap-0.5 font-mono text-[9px] text-[#A1A1AA]">
              {(['ISO', 'TOP', 'FRONT'] as CameraView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setCameraPreset(view)}
                  className={`px-1.5 py-1 rounded-sm uppercase transition-colors ${
                    cameraView === view
                      ? 'bg-[#27272A] text-[#F4F4F5] font-bold'
                      : 'hover:text-[#F4F4F5] hover:bg-[#18181B]'
                  }`}
                >
                  {view}
                </button>
              ))}
              <button
                onClick={handleResetCamera}
                className="p-1 text-[#A1A1AA] hover:text-[#F59E0B] hover:bg-[#18181B] rounded-sm transition-colors ml-0.5"
                title="Reset Camera to ISO Default"
              >
                <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
          </>
        )}

        {/* CAD Studio Link */}
        <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />
        <a
          href="/cad-studio"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 px-1.5 py-1 text-[10px] font-mono text-[#71717A] hover:text-[#06B6D4] rounded-sm transition-colors"
          title="Open Fullscreen Parametric CAD Studio in new tab"
        >
          <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
          <span className="hidden xl:inline">CAD STUDIO</span>
        </a>

        {/* Panel Minimize / Collapse Button */}
        {onToggleMinimize && (
          <>
            <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />
            <button
              onClick={onToggleMinimize}
              className="p-1 text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#18181B] rounded-sm transition-colors"
              title="Minimize CAD & Simulation Viewport"
            >
              <PanelRightClose className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE VIEWPORT STAGE: 3D CAD vs 2D CIRCUIT
      ───────────────────────────────────────────────────────────── */}
      {viewportMode === 'cad' ? (
        <div className="relative w-full h-full flex-1">
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
          />

          {/* Active 3D Assembly Label */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-[#121215]/90 border border-[#27272A] rounded-sm px-2.5 py-1 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#A1A1AA]">3D CAD ASSEMBLY:</span>
            <span className="text-[#F59E0B] font-bold uppercase">{currentLab.code} // {storeLabId.toUpperCase()}</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col">
          <div className="flex-1 w-full flex flex-col items-center justify-center overflow-auto p-4">
            <div className="font-mono text-[10px] text-[#71717A] tracking-wider uppercase mb-2 flex items-center gap-2">
              <span>CIRCUIT SCHEMATIC & ACTUATION STAGE</span>
              <span>//</span>
              <span className="text-[#06B6D4]">{currentLab.code}: {currentLab.title}</span>
            </div>
            <div className="flex-1 w-full flex items-center justify-center overflow-auto">
              <LabStageRenderer labId={storeLabId} />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM-RIGHT LIVE HARDWARE & CAD TELEMETRY CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-3 right-3 z-20 w-64 bg-[#121215]/95 border border-[#27272A] rounded-sm p-3 font-mono shadow-none backdrop-blur-none">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#27272A] text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-[#F59E0B]" strokeWidth={1.5} />
            {viewportMode === 'cad' ? 'CAD & KINEMATICS' : 'CIRCUIT TELEMETRY'}
          </span>
          <span className="text-[#06B6D4]">
            {currentLab.code}
          </span>
        </div>

        {/* Primary Metric Banner (Lab-Aware) */}
        {renderPrimaryMetric(storeLabId, hardwareState, servoAngle)}

        {/* Tabular Telemetry Matrix (Lab-Aware) */}
        <div className="pt-2 space-y-1.5 text-[10.5px]">
          {renderSecondaryMetrics(storeLabId, hardwareState, currentLab, pulseWidthUs, pwmDutyPct, busVoltage, currentMa)}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: LAB-AWARE PRIMARY METRIC
// ─────────────────────────────────────────────────────────────────────────────
function renderPrimaryMetric(labId: string, hw: any, servoAngle: number) {
  switch (labId) {
    case 'servo':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">ANGLE DISPLACEMENT</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[#F4F4F5] tabular-nums tracking-tight">
              {(hw.servoAngle ?? servoAngle).toFixed(1)}°
            </span>
            <span className="text-[10px] text-[#A1A1AA] ml-1">/ 180°</span>
          </div>
        </div>
      );
    case 'led':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">LED STATE</span>
          <div className="text-right">
            <span className={`text-lg font-bold tabular-nums ${hw.ledOn ? 'text-[#10B981]' : 'text-[#71717A]'}`}>
              {hw.ledOn ? 'ENERGIZED (HIGH)' : 'IDLE (LOW)'}
            </span>
          </div>
        </div>
      );
    case 'button':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">TACTILE CONTACT</span>
          <div className="text-right">
            <span className={`text-lg font-bold tabular-nums ${hw.buttonPressed ? 'text-[#F59E0B]' : 'text-[#71717A]'}`}>
              {hw.buttonPressed ? 'CONTACT CLOSED' : 'CONTACT OPEN'}
            </span>
          </div>
        </div>
      );
    case 'pot':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">ADC 10-BIT VALUE</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[#06B6D4] tabular-nums tracking-tight">
              {hw.potVal ?? 512}
            </span>
            <span className="text-[10px] text-[#A1A1AA] ml-1">/ 1023</span>
          </div>
        </div>
      );
    case 'sonar':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">TARGET DISTANCE</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[#06B6D4] tabular-nums tracking-tight">
              {(hw.distanceCm ?? 24.5).toFixed(1)} cm
            </span>
          </div>
        </div>
      );
    case 'motor':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">MOTOR SPEED</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[#F59E0B] tabular-nums tracking-tight">
              {hw.motorSpeed ?? (hw.fanActive ? hw.fanSpeed : 0)}
            </span>
            <span className="text-[10px] text-[#A1A1AA] ml-1">PWM (8-bit)</span>
          </div>
        </div>
      );
    case 'imu':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">6-DOF ORIENTATION</span>
          <div className="text-right font-bold text-sm text-[#06B6D4] tabular-nums">
            P: {(hw.imuPitch ?? 0).toFixed(1)}° | R: {(hw.imuRoll ?? 0).toFixed(1)}°
          </div>
        </div>
      );
    case 'rgb':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">COLOR SYNTHESIS</span>
          <div className="text-right font-bold text-sm text-[#F4F4F5] tabular-nums">
            R:{hw.rgbR ?? 255} G:{hw.rgbG ?? 255} B:{hw.rgbB ?? 255}
          </div>
        </div>
      );
    case 'temp':
    case 'dht':
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">TEMPERATURE</span>
          <div className="text-right">
            <span className="text-xl font-bold text-[#EF4444] tabular-nums tracking-tight">
              {(hw.temperatureC ?? 25.0).toFixed(1)} °C
            </span>
          </div>
        </div>
      );
    default:
      return (
        <div className="py-2 flex items-baseline justify-between border-b border-[#27272A]">
          <span className="text-[10px] text-[#71717A] uppercase">ACTIVE TELEMETRY</span>
          <div className="text-right">
            <span className="text-base font-bold text-[#10B981] tabular-nums tracking-tight uppercase">
              ONLINE
            </span>
          </div>
        </div>
      );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: LAB-AWARE SECONDARY METRICS MATRIX
// ─────────────────────────────────────────────────────────────────────────────
function renderSecondaryMetrics(
  labId: string,
  hw: any,
  currentLab: LabSpec,
  pulseWidthUs: number,
  pwmDutyPct: number,
  busVoltage: number,
  currentMa: number
) {
  return (
    <>
      {labId === 'servo' && (
        <>
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
        </>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[#71717A]">ACTIVE TARGET</span>
        <span className="text-[#06B6D4] tabular-nums font-semibold uppercase">
          {currentLab.code} // {labId.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#71717A]">CURRENT DRAW</span>
        <span className="text-[#F59E0B] tabular-nums font-semibold">
          {(hw.currentMa ?? currentMa).toFixed(1)} mA
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#71717A]">SUPPLY VOLTAGE</span>
        <span className="text-[#10B981] tabular-nums font-semibold">
          +{(hw.voltage ?? busVoltage).toFixed(2)} V DC
        </span>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-[#27272A]/60 text-[9.5px]">
        <span className="text-[#52525B]">CORE CLOCK</span>
        <span className="text-[#A1A1AA] tabular-nums">16.000000 MHz</span>
      </div>
    </>
  );
}

export default CadViewport;
