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
export type CameraView = 'ISO' | 'TOP' | 'FRONT' | 'SIDE';
export type ViewportMode = 'cad' | 'circuit';

// ─────────────────────────────────────────────────────────────────────────────
// WEBGL DISPOSAL SWEEP HELPERS (0 Memory Leaks)
// ─────────────────────────────────────────────────────────────────────────────
function disposeObject3D(root: THREE.Object3D | null | undefined): void {
  if (!root) return;
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(mesh.material);
        }
      }
    } else if ((obj as THREE.Line).isLine) {
      const line = obj as THREE.Line;
      if (line.geometry) line.geometry.dispose();
      if (line.material) {
        if (Array.isArray(line.material)) line.material.forEach((m) => m.dispose());
        else line.material.dispose();
      }
    }
  });
}

function disposeMaterial(mat: THREE.Material): void {
  mat.dispose();
  const m = mat as unknown as Record<string, unknown>;
  for (const key of Object.keys(m)) {
    const val = m[key];
    if (val && typeof val === 'object' && (val as THREE.Texture).isTexture) {
      const tex = val as THREE.Texture;
      if (tex.name !== 'persistent_lcd' && tex.name !== 'persistent_oled') {
        tex.dispose();
      }
    }
  }
}

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

  // Persistent Display Offscreen Canvases & CanvasTextures (allocated on mount, 0 memory leaks)
  const persistentLcdRef = useRef<{ canvas: HTMLCanvasElement; texture: THREE.CanvasTexture } | null>(null);
  const persistentOledRef = useRef<{ canvas: HTMLCanvasElement; texture: THREE.CanvasTexture } | null>(null);
  const lastLcdTextRef = useRef<{ r0: string; r1: string }>({ r0: '', r1: '' });

  // Responsive HUD container width
  const [containerWidth, setContainerWidth] = useState<number>(600);

  // Allocate persistent display textures once on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!persistentLcdRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#65a30d';
          ctx.fillRect(0, 0, 512, 128);
          ctx.font = 'bold 36px monospace';
          ctx.fillStyle = '#14532d';
          ctx.fillText('SPARKBYTE IDE v2', 20, 50);
          ctx.fillText('16x2 LCD ACTIVE', 20, 100);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.name = 'persistent_lcd';
        texture.minFilter = THREE.LinearFilter;
        persistentLcdRef.current = { canvas, texture };
      }

      if (!persistentOledRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, 256, 128);
          ctx.fillStyle = '#06b6d4';
          ctx.font = 'bold 22px monospace';
          ctx.fillText('SSD1306 OLED', 16, 40);
          ctx.fillText('128x64 GRAPHIC', 16, 75);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.name = 'persistent_oled';
        texture.minFilter = THREE.LinearFilter;
        persistentOledRef.current = { canvas, texture };
      }
    }

    return () => {
      if (persistentLcdRef.current) {
        persistentLcdRef.current.texture.dispose();
        persistentLcdRef.current = null;
      }
      if (persistentOledRef.current) {
        persistentOledRef.current.texture.dispose();
        persistentOledRef.current = null;
      }
    };
  }, []);

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
      // Transient direct read from store state (60fps animation decoupled from React renders)
      const hw = useWorkbenchStore.getState().hardwareState;

      // Update 16x2 LCD display texture in place on change (no new texture allocations)
      if (refs.lcdCanvas && refs.lcdTexture) {
        const r0 = hw.lcdTextRow0 || '';
        const r1 = hw.lcdTextRow1 || '';
        if (r0 !== lastLcdTextRef.current.r0 || r1 !== lastLcdTextRef.current.r1) {
          lastLcdTextRef.current = { r0, r1 };
          const ctx = refs.lcdCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#65a30d'; // Yellow-green backlight
            ctx.fillRect(0, 0, 512, 128);
            ctx.font = 'bold 36px monospace';
            ctx.fillStyle = '#14532d';
            ctx.fillText(r0, 20, 50);
            ctx.fillText(r1, 20, 100);
            refs.lcdTexture.needsUpdate = true;
          }
        }
      }

      // Update 0.96" SSD1306 OLED display texture in place on change (no new texture allocations)
      if (refs.oledCanvas && refs.oledTexture && hw.oledBuffer) {
        const ctx = refs.oledCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, 256, 128);
          ctx.fillStyle = '#06b6d4';
          const buf = hw.oledBuffer;
          for (let r = 0; r < 64; r++) {
            const row = buf[r];
            if (!row) continue;
            for (let c = 0; c < 128; c++) {
              if (row[c]) {
                ctx.fillRect(c * 2, r * 2, 2, 2);
              }
            }
          }
          refs.oledTexture.needsUpdate = true;
        }
      }

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
          setContainerWidth(w);
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

    // Cleanup & WebGL Disposal Sweep (0 Leaks)
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      controls.dispose();
      if (activeAssemblyGroupRef.current) {
        disposeObject3D(activeAssemblyGroupRef.current);
        activeAssemblyGroupRef.current = null;
      }
      if (calipersGroupRef.current) {
        disposeObject3D(calipersGroupRef.current);
        calipersGroupRef.current = null;
      }
      disposeObject3D(bedGroup);
      renderer.forceContextLoss();
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

    // Remove and dispose old assembly from scene (0 WebGL Memory Leaks)
    if (activeAssemblyGroupRef.current) {
      disposeObject3D(activeAssemblyGroupRef.current);
      scene.remove(activeAssemblyGroupRef.current);
      activeAssemblyGroupRef.current = null;
    }

    // Build authentic 3D assembly for this lab, reusing persistent LCD/OLED textures
    const persistentDisplays = {
      lcd: persistentLcdRef.current || undefined,
      oled: persistentOledRef.current || undefined
    };
    const result = buildLab3DAssembly(storeLabId, customCode, persistentDisplays);
    activeAssemblyGroupRef.current = result.group;
    meshesRef.current = result.meshes;
    dynamicRefsRef.current = result.dynamicRefs;
    scene.add(result.group);

    // Update Calipers box
    if (calipersGroupRef.current) {
      disposeObject3D(calipersGroupRef.current);
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
      case 'SIDE':
        camera.position.set(220, 0, 15);
        controls.target.set(0, 0, 15);
        break;
    }
    controls.update();
  };

  const handleResetCamera = () => {
    setCameraPreset('ISO');
  };

  // 4. Keyboard Shortcuts for CAD Viewport (F = Zoom to Fit, 1..4 = Presets, W = Wireframe, M = Measure)
  useEffect(() => {
    if (viewportMode !== 'cad') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const activeEl = document.activeElement as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable ||
        target?.closest('.monaco-editor') !== null ||
        target?.closest('input, textarea, [contenteditable="true"]') !== null ||
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.isContentEditable ||
        activeEl?.closest('.monaco-editor') !== null;

      if (isTyping) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleResetCamera();
      } else if (e.key === '1') {
        setCameraPreset('ISO');
      } else if (e.key === '2') {
        setCameraPreset('TOP');
      } else if (e.key === '3') {
        setCameraPreset('FRONT');
      } else if (e.key === '4') {
        setCameraPreset('SIDE');
      } else if (e.key === 'w' || e.key === 'W') {
        setIsWireframe((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        setActiveTool((prev) => (prev === 'measure' ? 'orbit' : 'measure'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewportMode]);

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

      {/* ─────────────────────────────────────────────────────────────
          ONSHAPE-STYLE INDUSTRIAL VIEWCUBE & AXIS GIZMO (TOP-RIGHT)
      ───────────────────────────────────────────────────────────── */}
      {viewportMode === 'cad' ? (
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5 font-mono select-none">
          {/* ViewCube Box */}
          <div className="bg-[#121215]/95 border border-[#27272A] rounded-sm p-1.5 flex flex-col items-center gap-1 shadow-none backdrop-blur-none">
            {/* 3D Face Selector Matrix */}
            <div className="grid grid-cols-2 gap-1 text-[9px] font-bold">
              <button
                onClick={() => setCameraPreset('TOP')}
                className={`${containerWidth < 460 ? 'w-7 h-5 text-[8px]' : 'w-9 h-6 text-[9px]'} rounded-sm border transition-colors flex items-center justify-center ${
                  cameraView === 'TOP'
                    ? 'bg-[#F59E0B] text-[#09090B] border-[#F59E0B]'
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-[#F4F4F5] hover:border-[#3F3F46]'
                }`}
                title="Top View (XY Plane) [2]"
              >
                TOP
              </button>
              <button
                onClick={() => setCameraPreset('ISO')}
                className={`${containerWidth < 460 ? 'w-7 h-5 text-[8px]' : 'w-9 h-6 text-[9px]'} rounded-sm border transition-colors flex items-center justify-center ${
                  cameraView === 'ISO'
                    ? 'bg-[#F59E0B] text-[#09090B] border-[#F59E0B]'
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-[#F4F4F5] hover:border-[#3F3F46]'
                }`}
                title="Isometric View [1]"
              >
                ISO
              </button>
              <button
                onClick={() => setCameraPreset('FRONT')}
                className={`${containerWidth < 460 ? 'w-7 h-5 text-[8px]' : 'w-9 h-6 text-[9px]'} rounded-sm border transition-colors flex items-center justify-center ${
                  cameraView === 'FRONT'
                    ? 'bg-[#F59E0B] text-[#09090B] border-[#F59E0B]'
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-[#F4F4F5] hover:border-[#3F3F46]'
                }`}
                title="Front View (XZ Plane) [3]"
              >
                FRONT
              </button>
              <button
                onClick={() => setCameraPreset('SIDE')}
                className={`${containerWidth < 460 ? 'w-7 h-5 text-[8px]' : 'w-9 h-6 text-[9px]'} rounded-sm border transition-colors flex items-center justify-center ${
                  cameraView === 'SIDE'
                    ? 'bg-[#F59E0B] text-[#09090B] border-[#F59E0B]'
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-[#F4F4F5] hover:border-[#3F3F46]'
                }`}
                title="Right Side View (YZ Plane) [4]"
              >
                SIDE
              </button>
            </div>

            {/* Quick Zoom-to-Fit Action */}
            <button
              onClick={handleResetCamera}
              className="w-full py-0.5 rounded-sm bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#71717A] hover:text-[#F4F4F5] text-[8.5px] flex items-center justify-center gap-1 transition-colors"
              title="Zoom to Fit Viewport [F]"
            >
              <span>FIT</span>
              <kbd className="text-[8px] text-[#A1A1AA]">[F]</kbd>
            </button>
          </div>

          {/* Coordinate Position Readout - Collapsible on narrow widths */}
          {containerWidth >= 500 && (
            <div className="bg-[#121215]/90 border border-[#27272A] rounded-sm px-2 py-1 text-[9px] text-[#71717A] flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[#EF4444]">X: +120.0</span>
                <span className="text-[#10B981]">Y: +045.5</span>
                <span className="text-[#06B6D4]">Z: +000.0</span>
              </div>
              <span className="text-[8px] text-[#52525B]">PERSPECTIVE • FOV 45°</span>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-1 font-mono text-[9px] text-[#71717A] z-10">
          <span>CIRCUIT EDA VIEW</span>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-[2px] bg-[#06B6D4]" />
            <span className="w-2 h-[2px] bg-[#F59E0B]" />
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING CAD HUD TOOLBAR (TOP-LEFT)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#121215]/95 border border-[#27272A] rounded-sm p-1 shadow-none backdrop-blur-none max-w-[calc(100%-110px)]">
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
            <span className={containerWidth < 460 ? 'hidden' : 'inline'}>3D CAD</span>
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
            <span className={containerWidth < 460 ? 'hidden' : 'inline'}>CIRCUIT</span>
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

            {/* CAMERA PRESETS (Collapsible on narrow viewports) */}
            {containerWidth >= 480 && (
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
              </div>
            )}
            <button
              onClick={handleResetCamera}
              className="p-1 text-[#A1A1AA] hover:text-[#F59E0B] hover:bg-[#18181B] rounded-sm transition-colors ml-0.5"
              title="Reset Camera to ISO Default"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
            </button>
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

          {/* Active 3D Assembly Label - Truncated on narrow viewports */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-[#121215]/90 border border-[#27272A] rounded-sm px-2.5 py-1 font-mono text-[10px] max-w-[200px] truncate">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            <span className="text-[#A1A1AA] hidden sm:inline">3D CAD ASSEMBLY:</span>
            <span className="text-[#F59E0B] font-bold uppercase truncate">{currentLab.code}</span>
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
      <div className="absolute bottom-3 right-3 z-20 w-64 max-w-[calc(100%-24px)] bg-[#121215]/95 border border-[#27272A] rounded-sm p-3 font-mono shadow-none backdrop-blur-none">
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
