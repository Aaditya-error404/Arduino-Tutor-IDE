/**
 * Advanced Computing & Engineering Labs Components
 * Labs: 3D CAD CSG, 3D Slicer, MPU-6050 IMU, RC522 RFID, ESP32 IoT
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState } from 'react';
import { useWorkbenchStore } from '../../store/useWorkbenchStore';
import { Box, Layers, Navigation, Radio, Wifi, Lock, Unlock, CheckCircle } from 'lucide-react';

// ─── 6. PARAMETRIC 3D CAD CSG STUDIO LAB ──────────────────────────────
export const CadLabView: React.FC = () => {
  const { hardwareState, updateHardwareState } = useWorkbenchStore();
  const dim = hardwareState.cadModel || { x: 40, y: 30, z: 20, holeR: 5 };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Isometric 3D Solid Wireframe */}
        <div className="w-56 h-48 bg-slate-900 border-2 border-slate-700 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
          <svg viewBox="0 0 200 160" className="w-full h-full">
            {/* Isometric Grid Scaled by Code Dims */}
            <path
              d={`M 100 ${50 - dim.z} L ${100 + dim.x * 1.4} ${50 - dim.z + dim.y * 0.7} L 100 ${50 - dim.z + dim.y * 1.4} L ${100 - dim.x * 1.4} ${50 - dim.z + dim.y * 0.7} Z`}
              fill="#0284c7"
              fillOpacity="0.4"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <path
              d={`M ${100 - dim.x * 1.4} ${50 - dim.z + dim.y * 0.7} L 100 ${50 - dim.z + dim.y * 1.4} L 100 ${50 + dim.y * 1.4} L ${100 - dim.x * 1.4} ${50 + dim.y * 0.7} Z`}
              fill="#0369a1"
              fillOpacity="0.6"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <path
              d={`M ${100 + dim.x * 1.4} ${50 - dim.z + dim.y * 0.7} L 100 ${50 - dim.z + dim.y * 1.4} L 100 ${50 + dim.y * 1.4} L ${100 + dim.x * 1.4} ${50 + dim.y * 0.7} Z`}
              fill="#075985"
              fillOpacity="0.8"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Center Bore Hole */}
            <ellipse cx="100" cy={50 - dim.z + dim.y * 0.7} rx={dim.holeR ? dim.holeR * 1.8 : 10} ry={dim.holeR ? dim.holeR * 0.9 : 5} fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px] font-mono text-slate-400 absolute bottom-2">OpenSCAD CSG Solid ({dim.x}x{dim.y}x{dim.z})</span>
        </div>

        {/* CAD Dimension Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[190px] text-xs">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
            <Box className="w-4 h-4" />
            <span>Parametric Coordinates:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Length (X):</span>
            <span className="font-mono font-bold text-sky-400">{dim.x} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Width (Y):</span>
            <span className="font-mono font-bold text-sky-400">{dim.y} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Height (Z):</span>
            <span className="font-mono font-bold text-sky-400">{dim.z} mm</span>
          </div>
          <div className="flex justify-between border-t border-slate-800 pt-1">
            <span className="text-slate-400">Volume:</span>
            <span className="font-mono text-amber-400">{dim.x * dim.y * dim.z} mm³</span>
          </div>
        </div>
      </div>

      {/* Interactive Dimension Sliders */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">X:</span>
          <input
            type="range"
            min="20"
            max="60"
            value={dim.x}
            onChange={(e) => updateHardwareState({ cadModel: { ...dim, x: parseInt(e.target.value, 10) } })}
            className="w-20 accent-sky-400 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Y:</span>
          <input
            type="range"
            min="15"
            max="50"
            value={dim.y}
            onChange={(e) => updateHardwareState({ cadModel: { ...dim, y: parseInt(e.target.value, 10) } })}
            className="w-20 accent-sky-400 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Z:</span>
          <input
            type="range"
            min="10"
            max="40"
            value={dim.z}
            onChange={(e) => updateHardwareState({ cadModel: { ...dim, z: parseInt(e.target.value, 10) } })}
            className="w-20 accent-sky-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// ─── 13. 3D SLICING & G-CODE PREVIEWER LAB ────────────────────────────
export const SlicerLabView: React.FC = () => {
  const { hardwareState, updateHardwareState } = useWorkbenchStore();
  const { slicerState } = hardwareState;
  const layer = slicerState?.layer ?? 42;
  const nozzleX = Math.round(slicerState?.nozzleX ?? 100);
  const nozzleY = Math.round(slicerState?.nozzleY ?? 40);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Slicer 2.5D Toolpath Previewer */}
        <div className="w-56 h-48 bg-slate-900 border-2 border-slate-700 rounded-2xl flex items-center justify-center shadow-2xl relative p-3">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            {/* Build Plate Grid */}
            <rect x="10" y="10" width="140" height="140" fill="#0f172a" stroke="#334155" strokeWidth="1" rx="4" />
            {/* Infill Crosshatch */}
            <path d="M 30 30 L 130 130 M 130 30 L 30 130" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />
            {/* Perimeter Wall */}
            <rect x="40" y="40" width="80" height="80" fill="none" stroke="#38bdf8" strokeWidth="3" rx="4" />
            {/* Live Extruder Hotend Nozzle Position driven by G-Code */}
            <circle cx={Math.max(20, Math.min(140, nozzleX))} cy={Math.max(20, Math.min(140, nozzleY))} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" />
            <circle cx={Math.max(20, Math.min(140, nozzleX))} cy={Math.max(20, Math.min(140, nozzleY))} r="3" fill="#ffffff" />
          </svg>
          <span className="text-[10px] font-mono text-slate-400 absolute bottom-2">Layer {layer} / 250 (X:{nozzleX} Y:{nozzleY})</span>
        </div>

        {/* G-Code Telemetry Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[200px] text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Layers className="w-4 h-4" />
            <span>Extrusion Toolpath:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Height:</span>
            <span className="font-mono font-bold text-sky-400">{(layer * 0.2).toFixed(2)} mm (Z)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Nozzle Position:</span>
            <span className="font-mono font-bold text-emerald-400">X:{nozzleX} Y:{nozzleY}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Nozzle Temp:</span>
            <span className="font-mono font-bold text-red-400">210 °C</span>
          </div>
        </div>
      </div>

      {/* Layer Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-4 text-xs shadow-xl">
        <Layers className="w-4 h-4 text-sky-400" />
        <span className="text-slate-300 font-medium">Layer Height:</span>
        <input
          type="range"
          min="1"
          max="250"
          value={layer}
          onChange={(e) => updateHardwareState({ slicerState: { ...slicerState, layer: parseInt(e.target.value, 10) } })}
          className="w-48 accent-sky-400 cursor-pointer"
        />
        <span className="font-mono font-bold text-sky-400 w-12 text-right">{layer} / 250</span>
      </div>
    </div>
  );
};

// ─── 20. MPU-6050 6-AXIS MOTION SENSOR LAB ────────────────────────────
export const ImuLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { imuPitch, imuRoll } = hardwareState;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* 3D Rotating Gimbal Orientation Cube */}
        <div className="w-44 h-44 flex items-center justify-center" style={{ perspective: 600 }}>
          <div
            className="w-28 h-28 bg-gradient-to-tr from-indigo-700 via-sky-600 to-cyan-400 rounded-2xl border-4 border-white/40 shadow-2xl flex flex-col items-center justify-center transition-transform duration-100"
            style={{
              transform: `rotateX(${-imuPitch}deg) rotateY(${imuRoll}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <Navigation className="w-10 h-10 text-white drop-shadow-md" />
            <span className="text-[10px] font-mono font-bold text-white mt-1">MPU-6050</span>
            <span className="text-[8px] font-mono text-cyan-200">{isRunning ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
        </div>

        {/* Primary Flight Display (PFD) Artificial Horizon */}
        <div
          data-pfd
          className="w-36 h-36 rounded-full border-4 border-slate-700 overflow-hidden relative shadow-2xl bg-sky-600 flex items-center justify-center"
        >
          {/* Ground Horizon Layer tilted by roll and translated by pitch */}
          <div
            className="absolute inset-0 bg-amber-800 transition-transform duration-100"
            style={{
              transform: `rotate(${imuRoll}deg) translateY(${Math.max(-50, Math.min(50, imuPitch))}%)`,
              transformOrigin: 'center center'
            }}
          >
            {/* White Horizon Line */}
            <div className="w-full h-1 bg-white shadow" />
          </div>

          {/* Fixed Aircraft Reticle / Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-16 h-0.5 bg-yellow-400" />
            <div className="w-0.5 h-6 bg-yellow-400 absolute" />
            <div className="w-2 h-2 rounded-full border-2 border-yellow-400 absolute" />
          </div>

          <span className="absolute bottom-1 text-[8px] font-mono font-bold text-white/80 z-20">PFD HORIZON</span>
        </div>

        {/* 6-DoF Inertial Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[200px] text-xs">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
            <Navigation className="w-4 h-4" />
            <span>Complementary Filter:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Pitch (θ):</span>
            <span className="font-mono font-bold text-sky-400">{imuPitch}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Roll (φ):</span>
            <span className="font-mono font-bold text-emerald-400">{imuRoll}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Bus Protocol:</span>
            <span className={`font-mono ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isRunning ? 'I2C (0x68) 400kHz' : 'I2C STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Attitude Sliders */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Pitch:</span>
          <input
            type="range"
            min="-90"
            max="90"
            value={imuPitch}
            onChange={(e) => updateHardwareState({ imuPitch: parseInt(e.target.value, 10) })}
            className="w-28 accent-sky-400 cursor-pointer"
          />
          <span className="font-mono text-sky-400 w-10">{imuPitch}°</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Roll:</span>
          <input
            type="range"
            min="-90"
            max="90"
            value={imuRoll}
            onChange={(e) => updateHardwareState({ imuRoll: parseInt(e.target.value, 10) })}
            className="w-28 accent-emerald-400 cursor-pointer"
          />
          <span className="font-mono text-emerald-400 w-10">{imuRoll}°</span>
        </div>
      </div>
    </div>
  );
};

// ─── 21. RC522 13.56MHz RFID CONTACTLESS LAB ──────────────────────────
export const RfidLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { rfidScannedUid, rfidAuthorized, servoAngle, pinStates, buzzerActive } = hardwareState;

  const isUnlocked = isRunning && (rfidAuthorized || servoAngle > 45 || !!pinStates[6]);
  const isDenied = isRunning && !isUnlocked && (!!pinStates[5] || buzzerActive);
  const accessState = !isRunning ? 'STANDBY' : isUnlocked ? 'GRANTED' : isDenied ? 'DENIED' : 'IDLE';

  const scanCard = (cardUid: string) => {
    updateHardwareState({ rfidScannedUid: cardUid });
  };

  const ejectCard = () => {
    updateHardwareState({ rfidScannedUid: null, rfidAuthorized: false });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* RC522 Reader PCB with 13.56MHz RF Magnetic Resonance Field */}
        <div className="w-48 h-40 bg-blue-900 border-4 border-blue-700 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-2xl relative overflow-hidden">
          {/* 13.56MHz Magnetic Induction Field Ripples */}
          {isRunning && (
            <div data-rfid-field className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 rounded-full border border-sky-400/40 animate-ping" />
              <div className="w-36 h-36 rounded-full border border-blue-400/20 animate-ping delay-100" />
            </div>
          )}

          <Radio className="w-12 h-12 text-blue-300 animate-pulse z-10" />
          <span className="text-xs font-mono font-bold text-white z-10">RC522 13.56MHz</span>
          <span className="text-[10px] font-mono text-blue-200 z-10">SPI (MISO/MOSI/SCK)</span>
          {rfidScannedUid && (
            <span className="text-[10px] font-mono bg-blue-950/80 px-2 py-0.5 rounded text-amber-300 border border-blue-600 z-10">
              CARD IN COIL FIELD
            </span>
          )}
        </div>

        {/* Electric Door Solenoid Latch Driven by C++ Code */}
        <div className={`w-44 h-40 border-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-2xl transition-all ${
          accessState === 'GRANTED'
            ? 'bg-emerald-950/80 border-emerald-500 shadow-emerald-500/20'
            : accessState === 'DENIED'
            ? 'bg-red-950/80 border-red-500 shadow-red-500/20'
            : 'bg-slate-900 border-slate-700'
        }`}>
          {accessState === 'GRANTED' ? (
            <>
              <Unlock className="w-10 h-10 text-emerald-400 animate-bounce" />
              <span className="text-xs font-mono font-bold text-emerald-400">ACCESS GRANTED</span>
              <span className="text-[9px] font-mono text-emerald-300">DEADBOLT RETRACTED (90°)</span>
            </>
          ) : accessState === 'DENIED' ? (
            <>
              <Lock className="w-10 h-10 text-red-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-red-400">ACCESS DENIED</span>
              <span className="text-[9px] font-mono text-red-300">TAMPER ALARM (D5 HIGH)</span>
            </>
          ) : (
            <>
              <Lock className="w-10 h-10 text-slate-500" />
              <span className="text-xs font-mono font-bold text-slate-400">
                {isRunning ? 'DOOR DEADLOCKED' : 'SYSTEM STANDBY'}
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {isRunning ? 'TAP RFID TRANSPONDER' : 'RUN SIMULATION'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive RFID Cards (Tap Card into Antenna RF Field) */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <button
          onClick={() => scanCard('A3 7F 4E 12')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-700/60 text-slate-200 font-semibold shadow-lg transition-transform active:scale-95"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Tap Master Fob (A3 7F 4E 12)</span>
        </button>
        <button
          onClick={() => scanCard('99 00 AA FF')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-red-700/60 text-slate-200 font-semibold shadow-lg transition-transform active:scale-95"
        >
          <Lock className="w-4 h-4 text-red-400" />
          <span>Tap Unauthorized (99 00 AA FF)</span>
        </button>
        {rfidScannedUid && (
          <button
            onClick={ejectCard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-300 font-semibold shadow-lg transition-transform active:scale-95"
          >
            <span>Remove Card</span>
          </button>
        )}
      </div>

      {rfidScannedUid && (
        <div className="mt-3 text-xs font-mono text-slate-400">
          Scanned Card UID: <span className={accessState === 'GRANTED' ? 'text-emerald-400 font-bold' : accessState === 'DENIED' ? 'text-red-400 font-bold' : 'text-slate-300'}>{rfidScannedUid}</span>
        </div>
      )}
    </div>
  );
};

// ─── 22. ESP32 IOT CLOUD TELEMETRY LAB ────────────────────────────────
export const IotLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { iotPacketsSent, iotPayload } = hardwareState;
  const [wifiOn, setWifiOn] = useState(true);

  const publishPacket = () => {
    if (!wifiOn || !isRunning) return;
    const newCount = iotPacketsSent + 1;
    const mockTemp = (24 + Math.random() * 2).toFixed(1);
    const mockLux = Math.round(400 + Math.random() * 150);
    const payload = `{"temp": ${mockTemp}, "lux": ${mockLux}, "seq": ${newCount}}`;
    updateHardwareState({ iotPacketsSent: newCount, iotPayload: payload });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* ESP32 Module with Wi-Fi RF broadcast pulses */}
        <div className="w-52 h-40 bg-slate-900 border-2 border-slate-700 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-2xl relative overflow-hidden">
          {/* RF Broadcast Waves */}
          {isRunning && wifiOn && (
            <div data-iot-wave className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full border-2 border-emerald-400/40 animate-ping" />
              <div className="w-32 h-32 rounded-full border border-sky-400/20 animate-ping delay-150" />
            </div>
          )}

          <div className="w-20 h-10 bg-slate-800 rounded border border-slate-600 flex items-center justify-center z-10">
            <span className="text-[10px] font-mono font-bold text-slate-300">ESP-WROOM-32</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold z-10">
            <Wifi className={`w-4 h-4 ${isRunning && wifiOn ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className={isRunning && wifiOn ? 'text-emerald-400' : 'text-slate-500'}>
              {!isRunning ? 'ESP32 STANDBY' : wifiOn ? 'Wi-Fi Connected' : 'Wi-Fi Disabled'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 z-10">
            {isRunning && wifiOn ? 'RSSI: -58 dBm · IP: 192.168.1.104' : 'Network Disconnected'}
          </span>
        </div>

        {/* MQTT Broker Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[220px] text-xs">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
            <Wifi className="w-4 h-4" />
            <span>MQTT Cloud Broker:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Broker:</span>
            <span className="font-mono text-slate-200">broker.sparkbyte.io</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Topic:</span>
            <span className="font-mono text-emerald-400">atl/station/telemetry</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Packets Sent:</span>
            <span className="font-mono font-bold text-amber-400">{iotPacketsSent} Publishes</span>
          </div>
          <div className="border-t border-slate-800 pt-1.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">Payload Stream:</span>
            <code className="text-[10px] font-mono text-sky-300 bg-slate-950 px-1.5 py-0.5 rounded block truncate">
              {iotPayload || '{"temp": 24.5, "lux": 450, "status": "ONLINE"}'}
            </code>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-3 text-xs shadow-xl">
        <button
          onClick={() => setWifiOn(!wifiOn)}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            wifiOn ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {wifiOn ? 'Wi-Fi: ON' : 'Wi-Fi: OFF'}
        </button>
        <button
          disabled={!wifiOn || !isRunning}
          onClick={publishPacket}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            wifiOn && isRunning
              ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-500/20 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>Publish MQTT Packet</span>
        </button>
      </div>
    </div>
  );
};

