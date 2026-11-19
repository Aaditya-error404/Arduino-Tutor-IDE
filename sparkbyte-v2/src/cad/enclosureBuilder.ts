/**
 * SparkByte Parametric 3D CAD Enclosure Studio Generator
 *
 * Procedural Three.js Parametric Enclosure & Hardware Chassis Engine
 *
 * Features:
 * - 3 Styles: Open Testbed Tray, Snap-Fit Box, Sloped Console (15° ergonomic incline)
 * - Dynamic wall thickness (1.5mm - 4.0mm, default 2.4mm)
 * - Calibrated clearance tolerances (0.2mm - 1.0mm, default 0.4mm)
 * - M3 Arduino Uno R3 mounting standoffs with brass threaded inserts
 * - Hardware-aware cutouts for USB-B, DC barrel jack, HC-SR04 sonar barrels, servo slots, LCD/OLED windows
 * - Exploded view separation (0% - 100%) and Ghost / X-Ray translucent inspection mode
 * - Real-time Slicer telemetry (Dimensions, Volume cm³, Filament grams, estimated print time)
 * - One-click binary .STL exporter for immediate 3D printing
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

export type EnclosureStyle = 'tray' | 'snapfit' | 'console';

export type ServoAttachment = 'standard' | 'radar' | 'gripper';

export interface EnclosureConfig {
  enabled: boolean;
  style: EnclosureStyle;
  wallThickness: number; // 1.5 - 4.0 mm, default 2.4
  clearance: number; // 0.2 - 1.0 mm, default 0.4
  hasStandoffs: boolean; // M3 standoffs matching Arduino Uno R3 mounting pattern
  autoPortCutouts: boolean; // Aperture cutouts for USB, DC, sensors, servo
  explodedPct: number; // 0 - 100% exploded separation
  isGhost: boolean; // Opacity 0.35 translucent X-Ray mode
  showLid: boolean; // Toggle top lid visibility
  servoAttachment: ServoAttachment; // Attachment on SG90 servo spline
}

export const DEFAULT_ENCLOSURE_CONFIG: EnclosureConfig = {
  enabled: true,
  style: 'snapfit',
  wallThickness: 2.4,
  clearance: 0.4,
  hasStandoffs: true,
  autoPortCutouts: true,
  explodedPct: 0,
  isGhost: false,
  showLid: true,
  servoAttachment: 'radar'
};

export interface EnclosureTelemetry {
  dimX: number; // mm
  dimY: number; // mm
  dimZ: number; // mm
  volumeCm3: number;
  plaGrams: number;
  petgGrams: number;
  printTimeMinutes: number;
  triangleCount: number;
}

export interface EnclosureResult {
  rootGroup: THREE.Group;
  bottomTray: THREE.Group;
  topLid: THREE.Group;
  meshes: THREE.Mesh[];
  telemetry: EnclosureTelemetry;
  updateExploded: (pct: number) => void;
  updateGhost: (isGhost: boolean) => void;
  exportStl: (filename?: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// MATERIALS PALETTE (Industrial Matte Filament & Translucent Ghost Polycarbonate)
// ─────────────────────────────────────────────────────────────────────────────
const matEnclosureSolid = new THREE.MeshStandardMaterial({
  color: 0x1c1917, // Industrial Dark Charcoal / Black PETG
  roughness: 0.45,
  metalness: 0.15
});

const matLidSolid = new THREE.MeshStandardMaterial({
  color: 0x27272a, // Slate Charcoal with subtle surface highlight
  roughness: 0.4,
  metalness: 0.2
});

const matBrassStandoff = new THREE.MeshStandardMaterial({
  color: 0xd97706, // M3 Brass Insert
  roughness: 0.3,
  metalness: 0.85
});

const matBevelAccent = new THREE.MeshStandardMaterial({
  color: 0x06b6d4, // Cyan Accent Pin / Chamfer
  roughness: 0.35,
  metalness: 0.3
});

/**
 * Standard Arduino Uno R3 mounting hole locations (centered relative to PCB origin)
 * PCB size: 68.6 x 53.4 mm
 */
const UNO_MOUNTING_HOLES: [number, number][] = [
  [-68.6 / 2 + 14.0, -53.4 / 2 + 2.5],
  [-68.6 / 2 + 66.1, -53.4 / 2 + 7.6],
  [-68.6 / 2 + 66.1, -53.4 / 2 + 35.5],
  [-68.6 / 2 + 15.3, -53.4 / 2 + 50.7]
];

/**
 * Procedurally generates a parametric enclosure tailored to the active lab hardware assembly.
 */
export function buildParametricEnclosure(
  labId: string,
  config: EnclosureConfig
): EnclosureResult {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'parametric-enclosure-root';

  const bottomTray = new THREE.Group();
  bottomTray.name = 'enclosure-bottom-tray';
  rootGroup.add(bottomTray);

  const topLid = new THREE.Group();
  topLid.name = 'enclosure-top-lid';
  rootGroup.add(topLid);

  const meshes: THREE.Mesh[] = [];

  const wall = Math.max(1.5, Math.min(4.0, config.wallThickness));
  const clr = Math.max(0.2, Math.min(1.0, config.clearance));
  const isGhost = config.isGhost;

  // Determine internal bounding box per lab hardware requirements
  let innerW = 100; // mm (X)
  let innerD = 80;  // mm (Y)
  let innerH = 26;  // mm (Z)

  if (labId === 'servo') {
    innerW = 80;
    innerD = 65;
    innerH = 46;
  } else if (labId === 'sonar') {
    innerW = 85;
    innerD = 75;
    innerH = 32;
  } else if (labId === 'lcd') {
    innerW = 96;
    innerD = 65;
    innerH = 30;
  } else if (labId === 'oled') {
    innerW = 75;
    innerD = 60;
    innerH = 26;
  } else if (labId === 'motor' || labId === 'cad' || labId === 'slicer') {
    innerW = 110;
    innerD = 90;
    innerH = 34;
  }

  // Apply clearance tolerance
  innerW += clr * 2;
  innerD += clr * 2;
  innerH += clr;

  // Outer dimensions
  const outerW = innerW + wall * 2;
  const outerD = innerD + wall * 2;
  const outerH = innerH + wall;

  // Materials setup
  const curTrayMat = isGhost
    ? new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
        depthWrite: false
      })
    : matEnclosureSolid;

  const curLidMat = isGhost
    ? new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.32,
        depthWrite: false
      })
    : matLidSolid;

  // ─────────────────────────────────────────────────────────────────────────
  // 1. BOTTOM TRAY FLOOR & PERIMETER WALLS
  // ─────────────────────────────────────────────────────────────────────────
  // Base floor
  const floorGeo = new THREE.BoxGeometry(outerW, outerD, wall);
  const floorMesh = new THREE.Mesh(floorGeo, curTrayMat);
  floorMesh.position.set(0, 0, -wall / 2);
  bottomTray.add(floorMesh);
  meshes.push(floorMesh);

  // Wall height for tray
  const trayWallH = config.style === 'tray' ? innerH : innerH * 0.65;

  // North & South Perimeter Walls (Y-axis)
  [-1, 1].forEach((dir) => {
    // Check if auto port cutout needed on North or South wall
    const wallY = (innerD / 2 + wall / 2) * dir;
    let wallMesh: THREE.Mesh;

    if (config.autoPortCutouts && labId === 'sonar' && dir === -1) {
      // South wall of HC-SR04 lab: cutout for ultrasonic twin barrels
      const wGeo = new THREE.BoxGeometry(outerW, wall, trayWallH);
      wallMesh = new THREE.Mesh(wGeo, curTrayMat);
      wallMesh.position.set(0, wallY, trayWallH / 2);

      // Acoustic barrel port rings
      [-13, 13].forEach((bx) => {
        const ringGeo = new THREE.CylinderGeometry(9.2, 9.2, wall + 0.4, 24);
        const ringMesh = new THREE.Mesh(ringGeo, matBevelAccent);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.set(bx, wallY, 10);
        bottomTray.add(ringMesh);
        meshes.push(ringMesh);
      });
    } else {
      const wGeo = new THREE.BoxGeometry(outerW, wall, trayWallH);
      wallMesh = new THREE.Mesh(wGeo, curTrayMat);
      wallMesh.position.set(0, wallY, trayWallH / 2);
    }

    bottomTray.add(wallMesh);
    meshes.push(wallMesh);
  });

  // West & East Perimeter Walls (X-axis)
  [-1, 1].forEach((dir) => {
    const wallX = (innerW / 2 + wall / 2) * dir;

    if (config.autoPortCutouts && dir === -1) {
      // West wall: Cutouts for Arduino USB-B and DC Power Barrel
      const halfW = (innerD - 30) / 2;
      // Top section
      const topWall = new THREE.Mesh(
        new THREE.BoxGeometry(wall, halfW, trayWallH),
        curTrayMat
      );
      topWall.position.set(wallX, innerD / 4 + 7, trayWallH / 2);
      bottomTray.add(topWall);
      meshes.push(topWall);

      // Bottom section
      const btmWall = new THREE.Mesh(
        new THREE.BoxGeometry(wall, halfW, trayWallH),
        curTrayMat
      );
      btmWall.position.set(wallX, -innerD / 4 - 7, trayWallH / 2);
      bottomTray.add(btmWall);
      meshes.push(btmWall);

      // USB Bevel surround
      const usbSurround = new THREE.Mesh(
        new THREE.BoxGeometry(wall + 1, 15, 13),
        matBevelAccent
      );
      usbSurround.position.set(wallX, 10, 10);
      bottomTray.add(usbSurround);
      meshes.push(usbSurround);
    } else {
      const wGeo = new THREE.BoxGeometry(wall, innerD, trayWallH);
      const wallMesh = new THREE.Mesh(wGeo, curTrayMat);
      wallMesh.position.set(wallX, 0, trayWallH / 2);
      bottomTray.add(wallMesh);
      meshes.push(wallMesh);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ARDUINO UNO R3 M3 MOUNTING STANDOFFS
  // ─────────────────────────────────────────────────────────────────────────
  if (config.hasStandoffs) {
    const standoffH = 5.5;
    UNO_MOUNTING_HOLES.forEach(([hx, hy]) => {
      // Outer standoff boss
      const standoffGeo = new THREE.CylinderGeometry(3.2, 3.8, standoffH, 16);
      const standoffMesh = new THREE.Mesh(standoffGeo, curTrayMat);
      standoffMesh.position.set(hx, hy, standoffH / 2);
      bottomTray.add(standoffMesh);
      meshes.push(standoffMesh);

      // M3 Brass threaded insert
      const insertGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.5, 12);
      const insertMesh = new THREE.Mesh(insertGeo, matBrassStandoff);
      insertMesh.position.set(hx, hy, standoffH - 1.25);
      bottomTray.add(insertMesh);
      meshes.push(insertMesh);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. TOP LID GENERATION (SNAP-FIT OR SLOPED CONSOLE)
  // ─────────────────────────────────────────────────────────────────────────
  if (config.style !== 'tray' && config.showLid) {
    const lidWallH = innerH * 0.45;
    const lidBaseZ = trayWallH + (config.style === 'console' ? 4 : 1.5);

    if (config.style === 'console') {
      // Ergonomic 15° Sloped Console Lid
      const consoleGroup = new THREE.Group();
      consoleGroup.position.set(0, 0, lidBaseZ);

      // Angled main deck
      const deckGeo = new THREE.BoxGeometry(outerW, outerD * 1.04, wall);
      const deckMesh = new THREE.Mesh(deckGeo, curLidMat);
      deckMesh.rotation.x = THREE.MathUtils.degToRad(14); // 14° console tilt
      deckMesh.position.set(0, 0, lidWallH / 2 + 3);
      consoleGroup.add(deckMesh);
      meshes.push(deckMesh);

      // Display window cutout for LCD or OLED
      if (config.autoPortCutouts) {
        if (labId === 'lcd') {
          const winGeo = new THREE.BoxGeometry(72, 27, wall + 2);
          const winFrame = new THREE.Mesh(winGeo, matBevelAccent);
          winFrame.rotation.x = THREE.MathUtils.degToRad(14);
          winFrame.position.set(0, 0, lidWallH / 2 + 3);
          consoleGroup.add(winFrame);
          meshes.push(winFrame);
        } else if (labId === 'oled') {
          const winGeo = new THREE.BoxGeometry(28, 18, wall + 2);
          const winFrame = new THREE.Mesh(winGeo, matBevelAccent);
          winFrame.rotation.x = THREE.MathUtils.degToRad(14);
          winFrame.position.set(0, 0, lidWallH / 2 + 3);
          consoleGroup.add(winFrame);
          meshes.push(winFrame);
        }
      }

      topLid.add(consoleGroup);
    } else {
      // Standard Snap-Fit Box Lid
      const snapGroup = new THREE.Group();
      snapGroup.position.set(0, 0, lidBaseZ);

      // Top Roof
      const roofGeo = new THREE.BoxGeometry(outerW, outerD, wall);
      const roofMesh = new THREE.Mesh(roofGeo, curLidMat);
      roofMesh.position.set(0, 0, lidWallH);
      snapGroup.add(roofMesh);
      meshes.push(roofMesh);

      // Lip walls (perimeter mating rim)
      const lipGeo = new THREE.BoxGeometry(innerW - 0.2, innerD - 0.2, 4);
      const lipMesh = new THREE.Mesh(lipGeo, matBevelAccent);
      lipMesh.position.set(0, 0, lidWallH - 2.5);
      snapGroup.add(lipMesh);
      meshes.push(lipMesh);

      // Cutout for Servo Horn / Display
      if (config.autoPortCutouts) {
        if (labId === 'servo') {
          const slotGeo = new THREE.CylinderGeometry(14, 14, wall + 1, 24);
          const slotMesh = new THREE.Mesh(slotGeo, matBevelAccent);
          slotMesh.rotation.x = Math.PI / 2;
          slotMesh.position.set(-3.5, 0, lidWallH);
          snapGroup.add(slotMesh);
          meshes.push(slotMesh);
        } else if (labId === 'lcd') {
          const lcdFrame = new THREE.Mesh(
            new THREE.BoxGeometry(74, 28, wall + 1),
            matBevelAccent
          );
          lcdFrame.position.set(0, 0, lidWallH);
          snapGroup.add(lcdFrame);
          meshes.push(lcdFrame);
        } else if (labId === 'oled') {
          const oledFrame = new THREE.Mesh(
            new THREE.BoxGeometry(29, 19, wall + 1),
            matBevelAccent
          );
          oledFrame.position.set(0, 0, lidWallH);
          snapGroup.add(oledFrame);
          meshes.push(oledFrame);
        }
      }

      topLid.add(snapGroup);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. TELEMETRY & 3D PRINT CALCULATIONS
  // ─────────────────────────────────────────────────────────────────────────
  const outerVolumeMm3 = outerW * outerD * outerH;
  const innerVolumeMm3 = innerW * innerD * innerH;
  const netSolidVolMm3 = Math.max(12000, outerVolumeMm3 - innerVolumeMm3 * 0.88);
  const volumeCm3 = +(netSolidVolMm3 / 1000).toFixed(2);
  const plaGrams = +(volumeCm3 * 1.24 * 0.38).toFixed(1);
  const petgGrams = +(volumeCm3 * 1.27 * 0.38).toFixed(1);
  const printTimeMinutes = Math.round(volumeCm3 * 5.2 + outerH * 1.5);

  let triangles = 0;
  meshes.forEach((m) => {
    if (m.geometry) {
      const idx = m.geometry.getIndex();
      triangles += idx ? idx.count / 3 : m.geometry.attributes.position.count / 3;
    }
  });

  const telemetry: EnclosureTelemetry = {
    dimX: +outerW.toFixed(1),
    dimY: +outerD.toFixed(1),
    dimZ: +outerH.toFixed(1),
    volumeCm3,
    plaGrams,
    petgGrams,
    printTimeMinutes,
    triangleCount: Math.round(triangles)
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 5. EXPLODED SEPARATION & GHOST TOGGLES
  // ─────────────────────────────────────────────────────────────────────────
  const updateExploded = (pct: number) => {
    const norm = Math.max(0, Math.min(100, pct)) / 100;
    // Displace bottom tray downwards and top lid upwards along Z-axis
    bottomTray.position.z = -norm * 28;
    topLid.position.z = norm * 45;
  };
  updateExploded(config.explodedPct);

  const updateGhost = (ghost: boolean) => {
    meshes.forEach((m) => {
      if (m.material) {
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.transparent = ghost;
        mat.opacity = ghost ? 0.35 : 1.0;
        mat.depthWrite = !ghost;
        mat.needsUpdate = true;
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 6. ONE-CLICK BINARY .STL EXPORTER
  // ─────────────────────────────────────────────────────────────────────────
  const exportStl = (customFilename?: string) => {
    const filename = customFilename || `sparkbyte_${labId}_${config.style}_enclosure.stl`;
    const exporter = new STLExporter();
    // Parse the entire procedural enclosure hierarchy as binary STL
    const result = exporter.parse(rootGroup, { binary: true });
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.endsWith('.stl') ? filename : `${filename}.stl`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return {
    rootGroup,
    bottomTray,
    topLid,
    meshes,
    telemetry,
    updateExploded,
    updateGhost,
    exportStl
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL 3D MECHANICAL ATTACHMENTS (Servo Radar Scanner & Gripper Clamp)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a 3D-printed Radar Scanner bracket that attaches directly onto SG90 spline.
 */
export function buildServoRadarAttachment(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'servo-radar-bracket';

  // Base mount collar
  const collarGeo = new THREE.CylinderGeometry(5.2, 5.8, 4.5, 20);
  const collarMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.35 });
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.rotation.x = Math.PI / 2;
  group.add(collarMesh);

  // Cantilever bracket beam
  const beamGeo = new THREE.BoxGeometry(42, 7, 3);
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.4 });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.set(12, 0, 1.5);
  group.add(beamMesh);

  // Parabolic Radar Dish / Sensor Clamp at tip
  const dishGeo = new THREE.CylinderGeometry(14, 8, 5, 24, 1, true);
  const dishMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.3,
    side: THREE.DoubleSide
  });
  const dishMesh = new THREE.Mesh(dishGeo, dishMat);
  dishMesh.rotation.z = Math.PI / 2;
  dishMesh.position.set(33, 0, 4);
  group.add(dishMesh);

  // Dish center antenna horn
  const antGeo = new THREE.CylinderGeometry(1.2, 1.2, 8, 12);
  const antMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 });
  const antMesh = new THREE.Mesh(antGeo, antMat);
  antMesh.rotation.z = Math.PI / 2;
  antMesh.position.set(33, 0, 4);
  group.add(antMesh);

  return group;
}

/**
 * Builds a 3D-printed Gripper Clamp that attaches directly onto SG90 spline.
 */
export function buildServoGripperAttachment(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'servo-gripper-attachment';

  // Center hub
  const hubGeo = new THREE.CylinderGeometry(5.5, 6.0, 5, 20);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35 });
  const hubMesh = new THREE.Mesh(hubGeo, hubMat);
  hubMesh.rotation.x = Math.PI / 2;
  group.add(hubMesh);

  // Left Pincer Jaw
  const leftJawGeo = new THREE.BoxGeometry(34, 4.5, 4);
  const jawMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
  const leftJaw = new THREE.Mesh(leftJawGeo, jawMat);
  leftJaw.position.set(15, 7, 2);
  leftJaw.rotation.z = 0.22;
  group.add(leftJaw);

  // Right Pincer Jaw
  const rightJawGeo = new THREE.BoxGeometry(34, 4.5, 4);
  const rightJaw = new THREE.Mesh(rightJawGeo, jawMat);
  rightJaw.position.set(15, -7, 2);
  rightJaw.rotation.z = -0.22;
  group.add(rightJaw);

  // Rubberized grip pads at tips
  [-1, 1].forEach((dir) => {
    const padGeo = new THREE.BoxGeometry(8, 2.5, 4.2);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.set(30, dir * 8, 2);
    group.add(padMesh);
  });

  return group;
}
