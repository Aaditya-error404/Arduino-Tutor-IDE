/**
 * SparkByte Studio v2 · Industrial 3D CAD Assembly Engine for All 22 Labs
 *
 * Anti-"AI Slop" Engineering Disciplines:
 * - Authentic ATL dimensions (mm) and realistic industrial mechanical components
 * - Clean Three.js geometries with proper surface normals and hardware textures
 * - Full kinematic & photonic correlation with virtual ATmega328P execution
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import * as THREE from 'three';
import { compileOpenScad, convertGeom3ToThreeGeometry, CAD_PRESETS } from '../../engine/cadCompiler';

export interface DynamicAssemblyRefs {
  // Servo
  hornGroup?: THREE.Group;
  // Motor / Fan
  fanGroup?: THREE.Group;
  // IMU
  imuGroup?: THREE.Group;
  // Sonar
  sonarBeam?: THREE.Mesh;
  sonarTarget?: THREE.Mesh;
  // Potentiometer
  potKnob?: THREE.Group;
  // Button
  buttonPlunger?: THREE.Mesh;
  // LED
  ledMesh?: THREE.Mesh;
  ledLight?: THREE.PointLight;
  // RGB LED
  rgbMesh?: THREE.Mesh;
  rgbLight?: THREE.PointLight;
  // Buzzer
  buzzerRings?: THREE.Group;
  // Slicer / 3D Printer
  slicerGantry?: THREE.Group;
  slicerNozzle?: THREE.Group;
  slicerToolpathGroup?: THREE.Group;
  // Displays
  lcdCanvas?: HTMLCanvasElement;
  lcdTexture?: THREE.CanvasTexture;
  oledCanvas?: HTMLCanvasElement;
  oledTexture?: THREE.CanvasTexture;
  // Relays / Actuators
  relayArm?: THREE.Mesh;
  relayStatusLed?: THREE.Mesh;
  // RFID Deadbolt
  deadboltLatch?: THREE.Mesh;
  // Sensors
  tempBadge?: THREE.Mesh;
  gasCore?: THREE.Mesh;
  gasLight?: THREE.PointLight;
  ldrRay?: THREE.Mesh;
  irDisc?: THREE.Group;
  iotWaves?: THREE.Group;
  iotTxLed?: THREE.Mesh;
}

export interface BuildAssemblyResult {
  group: THREE.Group;
  meshes: THREE.Mesh[];
  dynamicRefs: DynamicAssemblyRefs;
  caliperDimensions: { width: number; depth: number; height: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. REUSABLE MATERIALS & FIXTURES
// ─────────────────────────────────────────────────────────────────────────────
const matAnodizedBlack = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5, metalness: 0.7 });
const matAluminumBrushed = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.85 });
const matBrass = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.75 });
const matPcbBlue = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 });
const matPcbBlack = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4, metalness: 0.2 });
const matPcbGold = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.8 });
const matSteel = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.25, metalness: 0.9 });
const matNylonWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45, metalness: 0.05 });

export interface PersistentDisplayConfig {
  lcd?: { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture };
  oled?: { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MASTER BUILDER DISPATCHER FOR ALL 22 LABS
// ─────────────────────────────────────────────────────────────────────────────
export function buildLab3DAssembly(
  labId: string,
  customCode?: string | null,
  persistentDisplays?: PersistentDisplayConfig
): BuildAssemblyResult {
  const root = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const refs: DynamicAssemblyRefs = {};

  switch (labId) {
    case 'servo':
      return buildServoAssembly(root, meshes, refs);
    case 'led':
      return buildLedAssembly(root, meshes, refs);
    case 'button':
      return buildButtonAssembly(root, meshes, refs);
    case 'pot':
      return buildPotentiometerAssembly(root, meshes, refs);
    case 'buzzer':
      return buildBuzzerAssembly(root, meshes, refs);
    case 'cad':
      return buildCadSolidAssembly(root, meshes, refs, customCode);
    case 'dmm':
      return buildDmmAssembly(root, meshes, refs);
    case 'ldr':
      return buildLdrAssembly(root, meshes, refs);
    case 'rgb':
      return buildRgbAssembly(root, meshes, refs);
    case 'temp':
      return buildTempAssembly(root, meshes, refs);
    case 'sonar':
      return buildSonarAssembly(root, meshes, refs);
    case 'ir':
      return buildIrAssembly(root, meshes, refs);
    case 'slicer':
      return buildSlicerAssembly(root, meshes, refs);
    case 'dht':
      return buildDhtAssembly(root, meshes, refs);
    case 'gas':
      return buildGasAssembly(root, meshes, refs);
    case 'lcd':
      return buildLcdAssembly(root, meshes, refs, persistentDisplays?.lcd);
    case 'oled':
      return buildOledAssembly(root, meshes, refs, persistentDisplays?.oled);
    case 'soil':
      return buildSoilAssembly(root, meshes, refs);
    case 'motor':
      return buildMotorAssembly(root, meshes, refs);
    case 'imu':
      return buildImuAssembly(root, meshes, refs);
    case 'rfid':
      return buildRfidAssembly(root, meshes, refs);
    case 'iot':
      return buildIotAssembly(root, meshes, refs);
    default:
      return buildServoAssembly(root, meshes, refs);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 01: 5MM DIFFUSED LED & CURRENT-LIMITING RESISTOR
// ─────────────────────────────────────────────────────────────────────────────
function buildLedAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  // Breadboard / Mount plate
  const plateGeo = new THREE.BoxGeometry(60, 40, 4);
  const plate = new THREE.Mesh(plateGeo, matAnodizedBlack);
  plate.position.set(0, 0, 2);
  root.add(plate);
  meshes.push(plate);

  // 5mm LED Body (Cylinder + Hemisphere dome)
  const ledGroup = new THREE.Group();
  ledGroup.position.set(0, 0, 4);

  const cylGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 24);
  const domeGeo = new THREE.SphereGeometry(2.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const lipGeo = new THREE.CylinderGeometry(2.8, 2.8, 1, 24);

  const ledMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.2
  });

  const cyl = new THREE.Mesh(cylGeo, ledMat);
  cyl.rotation.x = Math.PI / 2;
  cyl.position.set(0, 0, 4);
  ledGroup.add(cyl);
  meshes.push(cyl);

  const dome = new THREE.Mesh(domeGeo, ledMat);
  dome.rotation.x = Math.PI / 2;
  dome.position.set(0, 0, 7);
  ledGroup.add(dome);
  meshes.push(dome);

  const lip = new THREE.Mesh(lipGeo, ledMat);
  lip.rotation.x = Math.PI / 2;
  lip.position.set(0, 0, 1);
  ledGroup.add(lip);
  meshes.push(lip);

  // Point light for illumination
  const ledLight = new THREE.PointLight(0xef4444, 0, 40);
  ledLight.position.set(0, 0, 8);
  ledGroup.add(ledLight);

  refs.ledMesh = cyl;
  refs.ledLight = ledLight;

  // 220Ω Resistor
  const resGroup = new THREE.Group();
  resGroup.position.set(16, 0, 5);
  const resBodyGeo = new THREE.CylinderGeometry(1.4, 1.4, 6.5, 16);
  const resBodyMat = new THREE.MeshStandardMaterial({ color: 0xdfbc85, roughness: 0.6 });
  const resMesh = new THREE.Mesh(resBodyGeo, resBodyMat);
  resMesh.rotation.y = Math.PI / 2;
  resGroup.add(resMesh);
  meshes.push(resMesh);

  // Resistor color bands (Red, Red, Brown, Gold)
  const bandMatRed = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
  const bandMatBrown = new THREE.MeshBasicMaterial({ color: 0x78350f });
  const bandMatGold = new THREE.MeshBasicMaterial({ color: 0xd97706 });
  const bandGeo = new THREE.CylinderGeometry(1.42, 1.42, 0.6, 16);

  [-1.8, -0.6].forEach((x) => {
    const b = new THREE.Mesh(bandGeo, bandMatRed);
    b.rotation.y = Math.PI / 2;
    b.position.set(x, 0, 0);
    resGroup.add(b);
  });
  const bBrown = new THREE.Mesh(bandGeo, bandMatBrown);
  bBrown.rotation.y = Math.PI / 2;
  bBrown.position.set(0.6, 0, 0);
  resGroup.add(bBrown);
  const bGold = new THREE.Mesh(bandGeo, bandMatGold);
  bGold.rotation.y = Math.PI / 2;
  bGold.position.set(1.8, 0, 0);
  resGroup.add(bGold);

  root.add(ledGroup);
  root.add(resGroup);

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 60, depth: 40, height: 16 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 02: SG90 MICRO SERVO WITH ROTATING NYLON HORN
// ─────────────────────────────────────────────────────────────────────────────
function buildServoAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  // Aluminum Mounting Fixture
  const mountGeo = new THREE.BoxGeometry(70, 36, 4);
  const mountMesh = new THREE.Mesh(mountGeo, matAnodizedBlack);
  mountMesh.position.set(0, 0, 2);
  root.add(mountMesh);
  meshes.push(mountMesh);

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
  root.add(bodyMesh);
  meshes.push(bodyMesh);

  // Stepped Gear Tower
  const gearGeo = new THREE.CylinderGeometry(5.8, 5.8, 5, 24);
  const gearMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.3 });
  const gearMesh = new THREE.Mesh(gearGeo, gearMat);
  gearMesh.rotation.x = Math.PI / 2;
  gearMesh.position.set(-3.5, 0, 34);
  root.add(gearMesh);
  meshes.push(gearMesh);

  // Brass Spline Shaft
  const shaftGeo = new THREE.CylinderGeometry(2.4, 2.4, 4, 20);
  const shaftMesh = new THREE.Mesh(shaftGeo, matBrass);
  shaftMesh.rotation.x = Math.PI / 2;
  shaftMesh.position.set(-3.5, 0, 37.5);
  root.add(shaftMesh);
  meshes.push(shaftMesh);

  // Mounting Ears
  const earGeo = new THREE.BoxGeometry(32, 12, 2.5);
  const earMesh = new THREE.Mesh(earGeo, bodyMat);
  earMesh.position.set(0, 0, 23);
  root.add(earMesh);
  meshes.push(earMesh);

  // 3-Wire Ribbon Cable
  [0xea580c, 0xdc2626, 0x78350f].forEach((color, i) => {
    const cableGeo = new THREE.CylinderGeometry(0.8, 0.8, 25, 12);
    const cableMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    cableMesh.position.set(12, -2 + i * 2, 10);
    cableMesh.rotation.x = Math.PI / 3;
    root.add(cableMesh);
    meshes.push(cableMesh);
  });

  // Rotating Nylon Servo Horn
  const hornGroup = new THREE.Group();
  hornGroup.position.set(-3.5, 0, 39.5);

  const hubGeo = new THREE.CylinderGeometry(4.2, 4.2, 2.2, 24);
  const hubMesh = new THREE.Mesh(hubGeo, matNylonWhite);
  hubMesh.rotation.x = Math.PI / 2;
  hornGroup.add(hubMesh);
  meshes.push(hubMesh);

  const armGeo = new THREE.BoxGeometry(32, 5.5, 1.8);
  const armMesh = new THREE.Mesh(armGeo, matNylonWhite);
  hornGroup.add(armMesh);
  meshes.push(armMesh);

  const tipGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16);
  const tipMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });
  const tipMesh = new THREE.Mesh(tipGeo, tipMat);
  tipMesh.rotation.x = Math.PI / 2;
  tipMesh.position.set(13.5, 0, 0.5);
  hornGroup.add(tipMesh);
  meshes.push(tipMesh);

  root.add(hornGroup);
  refs.hornGroup = hornGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 32, depth: 12, height: 42 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 03: 12MM TACTILE MOMENTARY PUSHBUTTON
// ─────────────────────────────────────────────────────────────────────────────
function buildButtonAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mountPlate = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 4), matAnodizedBlack);
  mountPlate.position.set(0, 0, 2);
  root.add(mountPlate);
  meshes.push(mountPlate);

  // 12x12mm Switch Base
  const baseGeo = new THREE.BoxGeometry(12, 12, 4);
  const baseMesh = new THREE.Mesh(baseGeo, matPcbBlack);
  baseMesh.position.set(0, 0, 6);
  root.add(baseMesh);
  meshes.push(baseMesh);

  // Metal Top Plate
  const topPlateGeo = new THREE.BoxGeometry(12.2, 12.2, 0.8);
  const topPlateMesh = new THREE.Mesh(topPlateGeo, matAluminumBrushed);
  topPlateMesh.position.set(0, 0, 8.4);
  root.add(topPlateMesh);
  meshes.push(topPlateMesh);

  // Tactile Plunger Cap (Depresses 1.5mm along Z)
  const plungerGeo = new THREE.CylinderGeometry(3.4, 3.4, 4.5, 24);
  const plungerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const plunger = new THREE.Mesh(plungerGeo, plungerMat);
  plunger.rotation.x = Math.PI / 2;
  plunger.position.set(0, 0, 10.5);
  root.add(plunger);
  meshes.push(plunger);
  refs.buttonPlunger = plunger;

  // 4 Gull-wing Terminal Pins
  [-5, 5].forEach((x) => {
    [-6, 6].forEach((y) => {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, 0.6), matSteel);
      pin.position.set(x, y, 4.2);
      root.add(pin);
    });
  });

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 14, depth: 14, height: 13 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 04: 10K ROTARY POTENTIOMETER & KNURLED DIAL KNOB
// ─────────────────────────────────────────────────────────────────────────────
function buildPotentiometerAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mount = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 4), matAnodizedBlack);
  mount.position.set(0, 0, 2);
  root.add(mount);
  meshes.push(mount);

  // 16mm Round Pot Housing
  const bodyGeo = new THREE.CylinderGeometry(8, 8, 9, 24);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.x = Math.PI / 2;
  body.position.set(0, 0, 8.5);
  root.add(body);
  meshes.push(body);

  // Threaded Bushing + Nut
  const bushGeo = new THREE.CylinderGeometry(3.5, 3.5, 6, 20);
  const bush = new THREE.Mesh(bushGeo, matBrass);
  bush.rotation.x = Math.PI / 2;
  bush.position.set(0, 0, 16);
  root.add(bush);
  meshes.push(bush);

  // Rotating Knurled Aluminum Knob Group
  const knobGroup = new THREE.Group();
  knobGroup.position.set(0, 0, 19);

  const knobGeo = new THREE.CylinderGeometry(7.5, 7.5, 12, 32);
  const knobMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.6 });
  const knob = new THREE.Mesh(knobGeo, knobMat);
  knob.rotation.x = Math.PI / 2;
  knobGroup.add(knob);
  meshes.push(knob);

  // White Pointer Tick Mark
  const tickGeo = new THREE.BoxGeometry(1.2, 6, 12.2);
  const tickMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4 });
  const tick = new THREE.Mesh(tickGeo, tickMat);
  tick.position.set(0, 4, 0);
  knobGroup.add(tick);
  meshes.push(tick);

  root.add(knobGroup);
  refs.potKnob = knobGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 18, depth: 18, height: 26 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 05: PIEZO TRANSDUCER BUZZER & ACOUSTIC PRESSURE WAVES
// ─────────────────────────────────────────────────────────────────────────────
function buildBuzzerAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mount = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 4), matAnodizedBlack);
  mount.position.set(0, 0, 2);
  root.add(mount);
  meshes.push(mount);

  // 12mm Buzzer Body
  const cylGeo = new THREE.CylinderGeometry(6, 6, 9, 28);
  const buzzerMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3 });
  const buzzer = new THREE.Mesh(cylGeo, buzzerMat);
  buzzer.rotation.x = Math.PI / 2;
  buzzer.position.set(0, 0, 8.5);
  root.add(buzzer);
  meshes.push(buzzer);

  // Center Sound Aperture
  const holeGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x030712 });
  const hole = new THREE.Mesh(holeGeo, holeMat);
  hole.rotation.x = Math.PI / 2;
  hole.position.set(0, 0, 13.1);
  root.add(hole);

  // Acoustic Pressure Waves (3 Rings that pulse and scale)
  const waveGroup = new THREE.Group();
  waveGroup.position.set(0, 0, 14);

  [6.5, 9.5, 12.5].forEach((r) => {
    const ringGeo = new THREE.RingGeometry(r, r + 0.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    waveGroup.add(ring);
  });
  waveGroup.visible = false;
  root.add(waveGroup);
  refs.buzzerRings = waveGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 14, depth: 14, height: 15 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 06: PARAMETRIC CSG 3D SOLID MODELER
// ─────────────────────────────────────────────────────────────────────────────
function buildCadSolidAssembly(
  root: THREE.Group,
  meshes: THREE.Mesh[],
  refs: DynamicAssemblyRefs,
  customCode?: string | null
): BuildAssemblyResult {
  const code = customCode && customCode.trim().length > 0 ? customCode : CAD_PRESETS[0].code;
  let dims = { width: 40, depth: 30, height: 20 };

  try {
    const compiled = compileOpenScad(code);
    const threeGeo = convertGeom3ToThreeGeometry(compiled.geom);
    const cadMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.25,
      side: THREE.DoubleSide
    });
    const cadMesh = new THREE.Mesh(threeGeo, cadMat);
    cadMesh.position.set(0, 0, 0);
    root.add(cadMesh);
    meshes.push(cadMesh);
    dims = {
      width: compiled.bbox.dimensions[0],
      depth: compiled.bbox.dimensions[1],
      height: compiled.bbox.dimensions[2]
    };
  } catch {
    // Fallback preview cube
    const cube = new THREE.Mesh(new THREE.BoxGeometry(40, 30, 20), matAluminumBrushed);
    cube.position.set(0, 0, 10);
    root.add(cube);
    meshes.push(cube);
  }

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: dims
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 07: INDUSTRIAL DIGITAL MULTIMETER (DMM) & PROBES
// ─────────────────────────────────────────────────────────────────────────────
function buildDmmAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  // Multimeter Enclosure with yellow holster
  const dmmGeo = new THREE.BoxGeometry(50, 80, 18);
  const dmmMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
  const dmm = new THREE.Mesh(dmmGeo, dmmMat);
  dmm.position.set(0, 0, 9);
  root.add(dmm);
  meshes.push(dmm);

  // Yellow Rubber Bumper Edge
  const bumperGeo = new THREE.BoxGeometry(53, 83, 14);
  const bumperMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
  const bumper = new THREE.Mesh(bumperGeo, bumperMat);
  bumper.position.set(0, 0, 7);
  root.add(bumper);
  meshes.push(bumper);

  // LCD Bezel
  const lcdGeo = new THREE.BoxGeometry(36, 20, 2);
  const lcdMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.3 });
  const lcd = new THREE.Mesh(lcdGeo, lcdMat);
  lcd.position.set(0, 22, 18);
  root.add(lcd);
  meshes.push(lcd);

  // Central Rotary Switch
  const knobGeo = new THREE.CylinderGeometry(9, 9, 4, 24);
  const knobMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3 });
  const knob = new THREE.Mesh(knobGeo, knobMat);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0, -6, 19);
  root.add(knob);
  meshes.push(knob);

  // Red & Black Banana Probes
  [-12, 12].forEach((x, i) => {
    const jackGeo = new THREE.CylinderGeometry(2.5, 2.5, 5, 16);
    const jackMat = new THREE.MeshStandardMaterial({ color: i === 0 ? 0xef4444 : 0x18181b });
    const jack = new THREE.Mesh(jackGeo, jackMat);
    jack.rotation.x = Math.PI / 2;
    jack.position.set(x, -28, 18);
    root.add(jack);
  });

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 54, depth: 84, height: 22 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 08: PHOTORESISTOR (LDR) & LIGHT SOURCE RAY
// ─────────────────────────────────────────────────────────────────────────────
function buildLdrAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mount = new THREE.Mesh(new THREE.BoxGeometry(50, 40, 4), matAnodizedBlack);
  mount.position.set(0, 0, 2);
  root.add(mount);
  meshes.push(mount);

  // 5mm CdS Disc
  const discGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.6, 24);
  const discMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = Math.PI / 2;
  disc.position.set(0, 0, 10);
  root.add(disc);
  meshes.push(disc);

  // Dual Connecting Leads
  [-1, 1].forEach((x) => {
    const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 8), matSteel);
    lead.position.set(x, 0, 6);
    root.add(lead);
  });

  // Dynamic Incident Light Ray Cone
  const rayGeo = new THREE.ConeGeometry(8, 24, 16);
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });
  const ray = new THREE.Mesh(rayGeo, rayMat);
  ray.position.set(0, 0, 22);
  ray.rotation.x = Math.PI;
  root.add(ray);
  refs.ldrRay = ray;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 10, depth: 10, height: 26 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 09: 5MM TRI-COLOR RGB LED WITH COLOR SPACE SYNTHESIS
// ─────────────────────────────────────────────────────────────────────────────
function buildRgbAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mount = new THREE.Mesh(new THREE.BoxGeometry(60, 40, 4), matAnodizedBlack);
  mount.position.set(0, 0, 2);
  root.add(mount);
  meshes.push(mount);

  // 5mm Clear RGB LED Dome
  const ledGroup = new THREE.Group();
  ledGroup.position.set(0, 0, 4);

  const cylGeo = new THREE.CylinderGeometry(2.6, 2.6, 6.5, 24);
  const domeGeo = new THREE.SphereGeometry(2.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);

  const rgbMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
    emissive: 0xffffff,
    emissiveIntensity: 0.4
  });

  const cyl = new THREE.Mesh(cylGeo, rgbMat);
  cyl.rotation.x = Math.PI / 2;
  cyl.position.set(0, 0, 4.2);
  ledGroup.add(cyl);
  meshes.push(cyl);

  const dome = new THREE.Mesh(domeGeo, rgbMat);
  dome.rotation.x = Math.PI / 2;
  dome.position.set(0, 0, 7.4);
  ledGroup.add(dome);
  meshes.push(dome);

  // Dynamic Point Light matching RGB color
  const rgbLight = new THREE.PointLight(0xffffff, 1.2, 50);
  rgbLight.position.set(0, 0, 8);
  ledGroup.add(rgbLight);

  refs.rgbMesh = cyl;
  refs.rgbLight = rgbLight;

  // 4 Pins (Common Cathode + R, G, B)
  [-2.4, -0.8, 0.8, 2.4].forEach((x) => {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 10, 8), matSteel);
    pin.position.set(x, 0, -1);
    ledGroup.add(pin);
  });

  root.add(ledGroup);

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 12, depth: 12, height: 18 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 10: TO-92 TEMPERATURE SENSOR (TMP36 / LM35)
// ─────────────────────────────────────────────────────────────────────────────
function buildTempAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mount = new THREE.Mesh(new THREE.BoxGeometry(50, 40, 4), matAnodizedBlack);
  mount.position.set(0, 0, 2);
  root.add(mount);
  meshes.push(mount);

  // TO-92 Package: Cylinder sliced half
  const bodyGeo = new THREE.CylinderGeometry(2.5, 2.5, 5, 24, 1, false, 0, Math.PI);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0, 9);
  root.add(body);
  meshes.push(body);

  // Thermal Indicator Gradient Badge
  const badgeGeo = new THREE.BoxGeometry(4.5, 0.4, 4.5);
  const badgeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
  const badge = new THREE.Mesh(badgeGeo, badgeMat);
  badge.position.set(0, -0.2, 9);
  root.add(badge);
  refs.tempBadge = badge;

  // 3 Pins (VCC, VOUT, GND)
  [-1.5, 0, 1.5].forEach((x) => {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8, 8), matSteel);
    pin.position.set(x, 0, 4);
    root.add(pin);
  });

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 8, depth: 6, height: 14 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 11: HC-SR04 ULTRASONIC RANGEFINDER WITH DYNAMIC TARGET & BEAM
// ─────────────────────────────────────────────────────────────────────────────
function buildSonarAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  // Blue Sensor PCB (45x20x1.6mm)
  const pcbGeo = new THREE.BoxGeometry(45, 20, 1.6);
  const pcb = new THREE.Mesh(pcbGeo, matPcbBlue);
  pcb.position.set(0, 0, 10);
  pcb.rotation.x = Math.PI / 2;
  root.add(pcb);
  meshes.push(pcb);

  // Dual Aluminum Transducer Barrels ("T" and "R")
  [-13, 13].forEach((x) => {
    const barrelGeo = new THREE.CylinderGeometry(8, 8, 12, 28);
    const barrel = new THREE.Mesh(barrelGeo, matAluminumBrushed);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(x, -6, 10);
    root.add(barrel);
    meshes.push(barrel);

    // Inner Mesh Grille
    const grilleGeo = new THREE.CylinderGeometry(6.8, 6.8, 1, 24);
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const grille = new THREE.Mesh(grilleGeo, grilleMat);
    grille.rotation.x = Math.PI / 2;
    grille.position.set(x, -12.1, 10);
    root.add(grille);
  });

  // Dynamic Ultrasonic Conical Acoustic Beam
  const beamGeo = new THREE.ConeGeometry(18, 50, 24, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.x = -Math.PI / 2;
  beam.position.set(0, -37, 10);
  root.add(beam);
  refs.sonarBeam = beam;

  // Obstacle Target Plate
  const targetGeo = new THREE.BoxGeometry(32, 2, 24);
  const targetMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const target = new THREE.Mesh(targetGeo, targetMat);
  target.position.set(0, -62, 10);
  root.add(target);
  meshes.push(target);
  refs.sonarTarget = target;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 45, depth: 75, height: 24 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 12: INFRARED (IR) REFLECTIVE / OPTICAL TACHOMETER
// ─────────────────────────────────────────────────────────────────────────────
function buildIrAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const pcbGeo = new THREE.BoxGeometry(32, 14, 1.6);
  const pcb = new THREE.Mesh(pcbGeo, matPcbBlue);
  pcb.position.set(0, 0, 4);
  root.add(pcb);
  meshes.push(pcb);

  // IR Emitter (Clear Purple) & Phototransistor (Black)
  const txMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.8 });
  const rxMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
  const lensGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 16);

  const tx = new THREE.Mesh(lensGeo, txMat);
  tx.position.set(-4, 0, 7);
  root.add(tx);
  meshes.push(tx);

  const rx = new THREE.Mesh(lensGeo, rxMat);
  rx.position.set(4, 0, 7);
  root.add(rx);
  meshes.push(rx);

  // Rotating Slotted Optical Disc
  const discGroup = new THREE.Group();
  discGroup.position.set(0, 15, 7);
  const discGeo = new THREE.CylinderGeometry(12, 12, 1.5, 24);
  const discMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.rotation.x = Math.PI / 2;
  discGroup.add(disc);
  meshes.push(disc);

  root.add(discGroup);
  refs.irDisc = discGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 32, depth: 30, height: 16 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 13: 3D PRINTER GANTRY & EXTRUDER TOOLPATH SLICER
// ─────────────────────────────────────────────────────────────────────────────
function buildSlicerAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  // Heated Bed (120x120mm)
  const bedGeo = new THREE.BoxGeometry(120, 120, 3);
  const bedMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
  const bed = new THREE.Mesh(bedGeo, bedMat);
  bed.position.set(0, 0, 1.5);
  root.add(bed);
  meshes.push(bed);

  // Aluminum Extrusion Z-Gantry Posts
  [-55, 55].forEach((x) => {
    const postGeo = new THREE.BoxGeometry(8, 8, 80);
    const post = new THREE.Mesh(postGeo, matAluminumBrushed);
    post.position.set(x, 0, 40);
    root.add(post);
    meshes.push(post);
  });

  // X-Gantry Crossbar
  const crossGeo = new THREE.BoxGeometry(118, 8, 8);
  const crossbar = new THREE.Mesh(crossGeo, matAluminumBrushed);
  crossbar.position.set(0, 0, 45);
  root.add(crossbar);
  meshes.push(crossbar);

  // Extruder Nozzle Group (Moves to X, Y, Z)
  const nozzleGroup = new THREE.Group();
  nozzleGroup.position.set(0, 0, 15);

  const blockGeo = new THREE.BoxGeometry(14, 14, 12);
  const block = new THREE.Mesh(blockGeo, matAluminumBrushed);
  nozzleGroup.add(block);
  meshes.push(block);

  const tipGeo = new THREE.ConeGeometry(2.5, 4, 16);
  const tip = new THREE.Mesh(tipGeo, matBrass);
  tip.rotation.x = Math.PI;
  tip.position.set(0, 0, -8);
  nozzleGroup.add(tip);
  meshes.push(tip);

  root.add(nozzleGroup);
  refs.slicerNozzle = nozzleGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 120, depth: 120, height: 80 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 14: DHT11/22 DIGITAL HUMIDITY & TEMPERATURE SENSOR
// ─────────────────────────────────────────────────────────────────────────────
function buildDhtAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mount = new THREE.Mesh(new THREE.BoxGeometry(45, 35, 4), matAnodizedBlack);
  mount.position.set(0, 0, 2);
  root.add(mount);
  meshes.push(mount);

  // Signature Sky-Blue DHT Polymer Housing
  const bodyGeo = new THREE.BoxGeometry(15, 12, 5.5);
  const dhtMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 });
  const body = new THREE.Mesh(bodyGeo, dhtMat);
  body.position.set(0, 0, 9);
  root.add(body);
  meshes.push(body);

  // Wave Ventilation Grille Slots
  [-4, -2, 0, 2, 4].forEach((x) => {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 8, 0.4), matPcbBlack);
    slot.position.set(x, 0, 11.8);
    root.add(slot);
  });

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 16, depth: 14, height: 16 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 15: MQ-SERIES ELECTROCHEMICAL GAS SENSOR
// ─────────────────────────────────────────────────────────────────────────────
function buildGasAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const pcbGeo = new THREE.BoxGeometry(38, 24, 1.6);
  const pcb = new THREE.Mesh(pcbGeo, matPcbBlue);
  pcb.position.set(0, 0, 4);
  root.add(pcb);
  meshes.push(pcb);

  // Stainless Steel Double-Mesh Dome
  const domeGeo = new THREE.CylinderGeometry(8.5, 8.5, 10, 28);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.3,
    metalness: 0.85,
    wireframe: false
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.rotation.x = Math.PI / 2;
  dome.position.set(0, 0, 11);
  root.add(dome);
  meshes.push(dome);

  // Internal Heating Coil Core (Glows orange when energized)
  const coreGeo = new THREE.SphereGeometry(3.5, 16, 16);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xf97316,
    emissiveIntensity: 0.6
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(0, 0, 11);
  root.add(core);
  refs.gasCore = core;

  const gasLight = new THREE.PointLight(0xf97316, 0.8, 30);
  gasLight.position.set(0, 0, 11);
  root.add(gasLight);
  refs.gasLight = gasLight;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 22, depth: 22, height: 20 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 16: HD44780 1602 CHARACTER LCD WITH DYNAMIC CANVAS TEXTURE
// ─────────────────────────────────────────────────────────────────────────────
function buildLcdAssembly(
  root: THREE.Group,
  meshes: THREE.Mesh[],
  refs: DynamicAssemblyRefs,
  persistentLcd?: { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture }
): BuildAssemblyResult {
  // Green PCB (80x36mm)
  const pcbGeo = new THREE.BoxGeometry(80, 36, 1.6);
  const pcbMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });
  const pcb = new THREE.Mesh(pcbGeo, pcbMat);
  pcb.position.set(0, 0, 4);
  root.add(pcb);
  meshes.push(pcb);

  // Metal LCD Bezel
  const bezelGeo = new THREE.BoxGeometry(71, 26, 4);
  const bezel = new THREE.Mesh(bezelGeo, matAnodizedBlack);
  bezel.position.set(0, 0, 6.8);
  root.add(bezel);
  meshes.push(bezel);

  // Canvas-driven LCD Screen (Persistent texture reuse)
  if (persistentLcd) {
    const screenMat = new THREE.MeshBasicMaterial({ map: persistentLcd.texture });
    const screenGeo = new THREE.PlaneGeometry(64.5, 16);
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, 8.9);
    root.add(screen);

    refs.lcdCanvas = persistentLcd.canvas;
    refs.lcdTexture = persistentLcd.texture;
  } else if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#65a30d'; // Yellow-green backlight
      ctx.fillRect(0, 0, 512, 128);
      ctx.font = 'bold 36px monospace';
      ctx.fillStyle = '#14532d';
      ctx.fillText('SPARKBYTE IDE v2', 20, 50);
      ctx.fillText('16x2 LCD ACTIVE', 20, 100);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const screenMat = new THREE.MeshBasicMaterial({ map: texture });
      const screenGeo = new THREE.PlaneGeometry(64.5, 16);
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0, 8.9);
      root.add(screen);

      refs.lcdCanvas = canvas;
      refs.lcdTexture = texture;
    }
  }

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 80, depth: 36, height: 12 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 17: SSD1306 0.96" I2C GRAPHIC OLED DISPLAY
// ─────────────────────────────────────────────────────────────────────────────
function buildOledAssembly(
  root: THREE.Group,
  meshes: THREE.Mesh[],
  refs: DynamicAssemblyRefs,
  persistentOled?: { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture }
): BuildAssemblyResult {
  const pcbGeo = new THREE.BoxGeometry(28, 28, 1.6);
  const pcb = new THREE.Mesh(pcbGeo, matPcbBlack);
  pcb.position.set(0, 0, 4);
  root.add(pcb);
  meshes.push(pcb);

  // Glass Substrate
  const glassGeo = new THREE.BoxGeometry(26, 17, 1);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.9 });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, -2, 5.3);
  root.add(glass);
  meshes.push(glass);

  // Dynamic Canvas Texture for 128x64 pixels (Persistent texture reuse)
  if (persistentOled) {
    const screenGeo = new THREE.PlaneGeometry(24, 14);
    const screenMat = new THREE.MeshBasicMaterial({ map: persistentOled.texture });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, -2, 5.9);
    root.add(screen);

    refs.oledCanvas = persistentOled.canvas;
    refs.oledTexture = persistentOled.texture;
  } else if (typeof document !== 'undefined') {
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

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const screenGeo = new THREE.PlaneGeometry(24, 14);
      const screenMat = new THREE.MeshBasicMaterial({ map: texture });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, -2, 5.9);
      root.add(screen);

      refs.oledCanvas = canvas;
      refs.oledTexture = texture;
    }
  }

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 28, depth: 28, height: 10 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 18: CAPACITIVE SOIL MOISTURE PROBE & 5V SPDT RELAY PUMP
// ─────────────────────────────────────────────────────────────────────────────
function buildSoilAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  // Soil Capacitive Blade
  const bladeGeo = new THREE.BoxGeometry(16, 65, 1.6);
  const blade = new THREE.Mesh(bladeGeo, matPcbBlack);
  blade.position.set(-22, 0, 10);
  root.add(blade);
  meshes.push(blade);

  // Songle 5V Sugar-Cube Relay Module (Blue Box)
  const relayGeo = new THREE.BoxGeometry(22, 16, 15);
  const relayMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const relay = new THREE.Mesh(relayGeo, relayMat);
  relay.position.set(16, 0, 11.5);
  root.add(relay);
  meshes.push(relay);

  // Terminal Block (Green 3-pin)
  const termGeo = new THREE.BoxGeometry(8, 14, 10);
  const termMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
  const term = new THREE.Mesh(termGeo, termMat);
  term.position.set(29, 0, 9);
  root.add(term);
  meshes.push(term);

  // Relay Indicator LED (Red = Off, Green = Energized)
  const ledGeo = new THREE.CylinderGeometry(1.2, 1.2, 2, 16);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.rotation.x = Math.PI / 2;
  led.position.set(10, 6, 19.5);
  root.add(led);
  refs.relayStatusLed = led;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 65, depth: 65, height: 22 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 19: L298N DC GEARED MOTOR WITH ROTATING 3-BLADE FAN
// ─────────────────────────────────────────────────────────────────────────────
function buildMotorAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const mount = new THREE.Mesh(new THREE.BoxGeometry(60, 45, 4), matAnodizedBlack);
  mount.position.set(0, 0, 2);
  root.add(mount);
  meshes.push(mount);

  // Yellow TT Motor Gearbox Case
  const boxGeo = new THREE.BoxGeometry(22, 40, 20);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.set(0, -6, 14);
  root.add(box);
  meshes.push(box);

  // Steel Motor Canister Cylinder
  const canGeo = new THREE.CylinderGeometry(8, 8, 22, 24);
  const can = new THREE.Mesh(canGeo, matSteel);
  can.position.set(0, -22, 14);
  root.add(can);
  meshes.push(can);

  // Output Shaft
  const shaftGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
  const shaft = new THREE.Mesh(shaftGeo, matSteel);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.set(0, 16, 14);
  root.add(shaft);

  // 3-Blade Aerodynamic Propeller Fan Group
  const fanGroup = new THREE.Group();
  fanGroup.position.set(0, 20, 14);

  const hubGeo = new THREE.CylinderGeometry(4.5, 4.5, 3, 24);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.rotation.x = Math.PI / 2;
  fanGroup.add(hub);
  meshes.push(hub);

  // 3 Blades positioned at 120° intervals
  [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((angle) => {
    const bladeGeo = new THREE.BoxGeometry(22, 5, 1.2);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(Math.cos(angle) * 11, Math.sin(angle) * 11, 0);
    blade.rotation.z = angle;
    fanGroup.add(blade);
    meshes.push(blade);
  });

  root.add(fanGroup);
  refs.fanGroup = fanGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 44, depth: 60, height: 44 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 20: MPU6050 6-DOF IMU & ORIENTATION GIMBAL
// ─────────────────────────────────────────────────────────────────────────────
function buildImuAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const gimbalGroup = new THREE.Group();
  gimbalGroup.position.set(0, 0, 15);

  // Blue Breakout Board (21x16x1.6mm)
  const pcbGeo = new THREE.BoxGeometry(21, 16, 1.6);
  const pcb = new THREE.Mesh(pcbGeo, matPcbBlue);
  gimbalGroup.add(pcb);
  meshes.push(pcb);

  // MPU6050 QFN-24 Sensor Chip
  const chipGeo = new THREE.BoxGeometry(5, 5, 1.2);
  const chipMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 });
  const chip = new THREE.Mesh(chipGeo, chipMat);
  chip.position.set(0, 0, 1.2);
  gimbalGroup.add(chip);
  meshes.push(chip);

  // 8-Pin Header
  [-7, -5, -3, -1, 1, 3, 5, 7].forEach((x) => {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), matPcbGold);
    pin.position.set(x, -6.5, -2);
    gimbalGroup.add(pin);
  });

  // Gimbal Coordinate Axes
  const axisX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 2), 16, 0xef4444, 3, 1.5);
  const axisY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 2), 16, 0x10b981, 3, 1.5);
  const axisZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 2), 16, 0x06b6d4, 3, 1.5);
  gimbalGroup.add(axisX, axisY, axisZ);

  root.add(gimbalGroup);
  refs.imuGroup = gimbalGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 22, depth: 18, height: 16 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 21: MFRC522 RFID READER & MECHANICAL DEADBOLT INTERLOCK
// ─────────────────────────────────────────────────────────────────────────────
function buildRfidAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  // RFID Reader Board (60x40x1.6mm)
  const pcbGeo = new THREE.BoxGeometry(60, 40, 1.6);
  const pcb = new THREE.Mesh(pcbGeo, matPcbBlue);
  pcb.position.set(-15, 0, 4);
  root.add(pcb);
  meshes.push(pcb);

  // PCB Trace Antenna Loop (White silk screen border)
  const antennaGeo = new THREE.BoxGeometry(45, 30, 0.2);
  const antennaMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const antenna = new THREE.Mesh(antennaGeo, antennaMat);
  antenna.position.set(-15, 0, 5);
  root.add(antenna);

  // Mechanical Deadbolt Housing (Right Side)
  const lockBoxGeo = new THREE.BoxGeometry(24, 36, 18);
  const lockBox = new THREE.Mesh(lockBoxGeo, matAnodizedBlack);
  lockBox.position.set(30, 0, 11);
  root.add(lockBox);
  meshes.push(lockBox);

  // Sliding Solid Brass Deadbolt Bolt (Slides 18mm along X)
  const boltGeo = new THREE.CylinderGeometry(5, 5, 28, 20);
  const bolt = new THREE.Mesh(boltGeo, matBrass);
  bolt.rotation.z = Math.PI / 2;
  bolt.position.set(24, 0, 11);
  root.add(bolt);
  meshes.push(bolt);
  refs.deadboltLatch = bolt;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 75, depth: 42, height: 22 }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB 22: ESP8266 WI-FI MODULE & TELEMETRY CLOUD GATEWAY
// ─────────────────────────────────────────────────────────────────────────────
function buildIotAssembly(root: THREE.Group, meshes: THREE.Mesh[], refs: DynamicAssemblyRefs): BuildAssemblyResult {
  const pcbGeo = new THREE.BoxGeometry(24, 32, 1.6);
  const pcb = new THREE.Mesh(pcbGeo, matPcbBlue);
  pcb.position.set(0, 0, 4);
  root.add(pcb);
  meshes.push(pcb);

  // Metal RF Shield Can
  const shieldGeo = new THREE.BoxGeometry(16, 18, 3.5);
  const shield = new THREE.Mesh(shieldGeo, matSteel);
  shield.position.set(0, -4, 6.5);
  root.add(shield);
  meshes.push(shield);

  // Serpentine PCB Antenna
  const antGeo = new THREE.BoxGeometry(16, 6, 0.4);
  const ant = new THREE.Mesh(antGeo, matPcbGold);
  ant.position.set(0, 10, 5);
  root.add(ant);

  // Blue Activity / TX Flasher LED
  const ledGeo = new THREE.BoxGeometry(1.6, 1, 0.8);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(6, -10, 5.2);
  root.add(led);
  refs.iotTxLed = led;

  // Radiating Wireless Signal Waves
  const wavesGroup = new THREE.Group();
  wavesGroup.position.set(0, 10, 8);
  [4, 8, 12].forEach((r) => {
    const arcGeo = new THREE.RingGeometry(r, r + 0.6, 24, 1, 0, Math.PI);
    const arcMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.rotation.x = -Math.PI / 2;
    wavesGroup.add(arc);
  });
  root.add(wavesGroup);
  refs.iotWaves = wavesGroup;

  return {
    group: root,
    meshes,
    dynamicRefs: refs,
    caliperDimensions: { width: 26, depth: 34, height: 16 }
  };
}
