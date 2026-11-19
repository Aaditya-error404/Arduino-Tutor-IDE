/**
 * Industrial-Grade CAD & Hardware Simulation Viewport
 *
 * Anti-"AI Slop" Engineering Disciplines:
 * - Subtle engineering dot-grid background (radial-gradient(#27272A 1px, transparent 1px))
 * - Floating machined CAD HUD toolbar (Orbit, Pan, Measure, Wireframe, Camera ISO/TOP/FRONT)
 * - Multi-Lab Circuit Stage: SG90 Kinematics for Lab 02 + LabStageRenderer for all 22 ATL Labs
 * - Bottom-right tabular telemetry overlay card (monospaced metrics ready for avr8js Web Worker)
 */

import React, { useState } from 'react';
import {
  Compass,
  Move,
  Ruler,
  Box,
  Gauge,
  PanelRightClose
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
  const [activeTool, setActiveTool] = useState<CadTool>('orbit');
  const [cameraView, setCameraView] = useState<CameraView>('ISO');
  const [isWireframe, setIsWireframe] = useState(false);

  const { hardwareState } = useWorkbenchStore();
  const storeLabId = LAB_INDEX_TO_STORE_ID[currentLab.id] || 'servo';

  return (
    <div className="relative w-full h-full bg-[#09090B] overflow-hidden select-none flex flex-col font-sans">
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
        {/* Tool: ORBIT */}
        <button
          onClick={() => setActiveTool('orbit')}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            activeTool === 'orbit'
              ? 'bg-[#27272A] text-[#F59E0B] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Orbit 3D Assembly Camera"
        >
          <Compass className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>ORBIT</span>
        </button>

        {/* Tool: PAN */}
        <button
          onClick={() => setActiveTool('pan')}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            activeTool === 'pan'
              ? 'bg-[#27272A] text-[#F59E0B] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Pan Viewport Plane"
        >
          <Move className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>PAN</span>
        </button>

        {/* Tool: MEASURE */}
        <button
          onClick={() => setActiveTool('measure')}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            activeTool === 'measure'
              ? 'bg-[#27272A] text-[#06B6D4] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Caliper Dimension Measurement"
        >
          <Ruler className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>MEASURE</span>
        </button>

        <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />

        {/* Tool: WIREFRAME */}
        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className={`px-2 py-1 rounded-sm flex items-center gap-1 font-mono text-[10.5px] transition-colors ${
            isWireframe
              ? 'bg-[#27272A] text-[#06B6D4] font-semibold border border-[#3F3F46]'
              : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
          }`}
          title="Toggle Wireframe CAD Mesh"
        >
          <Box className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{isWireframe ? 'WIREFRAME' : 'SHADED'}</span>
        </button>

        <div className="h-3 w-[1px] bg-[#27272A] mx-0.5" />

        {/* Camera Views: ISO, TOP, FRONT */}
        <div className="flex items-center gap-0.5 font-mono text-[10px]">
          {(['ISO', 'TOP', 'FRONT'] as CameraView[]).map((cam) => (
            <button
              key={cam}
              onClick={() => setCameraView(cam)}
              className={`px-1.5 py-0.5 rounded-sm transition-colors ${
                cameraView === cam
                  ? 'bg-[#F59E0B] text-[#09090B] font-bold'
                  : 'bg-[#18181B] text-[#A1A1AA] hover:text-[#F4F4F5] border border-[#27272A]'
              }`}
            >
              {cam}
            </button>
          ))}
        </div>

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
          3. MECHANICAL CAD SIMULATION CANVAS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full h-full flex items-center justify-center relative p-4 overflow-auto">
        {/* CASE A: SG90 KINEMATIC SERVO LAB (LAB 02) */}
        {storeLabId === 'servo' ? (
          <div className="relative flex flex-col items-center justify-center transition-transform duration-200">
            {/* Top Title Tag */}
            <div className="font-mono text-[10px] text-[#71717A] tracking-wider uppercase mb-4 flex items-center gap-2">
              <span>KINEMATIC SIMULATION VIEWPORT</span>
              <span>//</span>
              <span className="text-[#F59E0B]">{currentLab.title}</span>
            </div>

            {/* SVG Mechanical Assembly: SG90 Micro Servo */}
            <div className="relative w-[340px] h-[260px] flex items-center justify-center">
              <svg
                viewBox="0 0 340 260"
                className={`w-full h-full drop-shadow-none ${
                  isWireframe ? 'stroke-[#06B6D4] fill-none' : ''
                }`}
              >
                {/* Mounting Plate / Breadboard Base */}
                <rect
                  x="20"
                  y="180"
                  width="300"
                  height="50"
                  rx="2"
                  fill="#121215"
                  stroke="#27272A"
                  strokeWidth="1.5"
                />
                <circle cx="35" cy="205" r="4" fill="#09090B" stroke="#27272A" />
                <circle cx="305" cy="205" r="4" fill="#09090B" stroke="#27272A" />
                <text x="45" y="210" fill="#52525B" fontSize="9" fontFamily="monospace">
                  TOWERPRO SG90 MOUNTING FIXTURE // M2.5 HARDWARE
                </text>

                {/* Cable Jumper Wire Ribbon */}
                <path
                  d="M 50 145 C 30 145, 20 120, 20 80"
                  fill="none"
                  stroke="#B45309"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 50 150 C 26 150, 16 120, 16 80"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 50 155 C 22 155, 12 120, 12 80"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <text x="10" y="70" fill="#71717A" fontSize="8" fontFamily="monospace">
                  PWM D9 (ORANGE) / 5V (RED) / GND (BROWN)
                </text>

                {/* SG90 Servo Plastic Body */}
                <rect
                  x="80"
                  y="90"
                  width="170"
                  height="90"
                  rx="3"
                  fill={isWireframe ? 'none' : '#1E293B'}
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Mounting Ears */}
                <rect
                  x="55"
                  y="105"
                  width="25"
                  height="15"
                  rx="1"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <circle cx="65" cy="112.5" r="2.5" fill="#09090B" stroke="#475569" />

                <rect
                  x="250"
                  y="105"
                  width="25"
                  height="15"
                  rx="1"
                  fill="#1E293B"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <circle cx="265" cy="112.5" r="2.5" fill="#09090B" stroke="#475569" />

                {/* Towerpro Label Badge */}
                <rect x="95" y="115" width="140" height="40" rx="1" fill="#0F172A" stroke="#1E293B" />
                <text x="105" y="132" fill="#F8FAFC" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  TOWER PRO SG90
                </text>
                <text x="105" y="146" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                  9g SUB-MICRO SERVO 180°
                </text>

                {/* Brass Output Gear Spline Shaft */}
                <circle cx="135" cy="90" r="16" fill="#78350F" stroke="#D97706" strokeWidth="1.5" />
                <circle cx="135" cy="90" r="8" fill="#F59E0B" />
                <circle cx="135" cy="90" r="3" fill="#451A03" />

                {/* ROTATING NYLON SERVO HORN (Driven by live servoAngle) */}
                <g
                  transform={`rotate(${servoAngle - 90}, 135, 90)`}
                  style={{
                    transition: isRunning ? 'transform 80ms linear' : 'transform 200ms ease-out'
                  }}
                >
                  <path
                    d="M 135 78 C 190 78, 205 85, 205 90 C 205 95, 190 102, 135 102 C 80 102, 65 95, 65 90 C 65 85, 80 78, 135 78 Z"
                    fill="#F1F5F9"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />
                  <circle cx="135" cy="90" r="4.5" fill="#334155" stroke="#0F172A" />
                  <line x1="132" y1="87" x2="138" y2="93" stroke="#94A3B8" strokeWidth="1" />

                  {/* Horn Linkage Holes */}
                  <circle cx="155" cy="90" r="1.5" fill="#475569" />
                  <circle cx="170" cy="90" r="1.5" fill="#475569" />
                  <circle cx="185" cy="90" r="1.5" fill="#475569" />
                  <circle cx="198" cy="90" r="1.8" fill="#EF4444" stroke="#B91C1C" />

                  <circle cx="115" cy="90" r="1.5" fill="#475569" />
                  <circle cx="100" cy="90" r="1.5" fill="#475569" />
                  <circle cx="85" cy="90" r="1.5" fill="#475569" />
                  <circle cx="72" cy="90" r="1.8" fill="#475569" />

                  {/* Visual Forward Vector Pointer */}
                  <line
                    x1="135"
                    y1="90"
                    x2="215"
                    y2="90"
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                </g>

                {/* Degrees Arc Guide */}
                <path
                  d="M 55 90 A 80 80 0 0 1 215 90"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                />
                <text x="45" y="94" fill="#64748B" fontSize="9" fontFamily="monospace">
                  0°
                </text>
                <text x="130" y="25" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  90°
                </text>
                <text x="220" y="94" fill="#64748B" fontSize="9" fontFamily="monospace">
                  180°
                </text>
              </svg>
            </div>

            {/* Manual Angle Jog Slider */}
            <div className="w-[300px] mt-4 flex items-center gap-3 bg-[#121215] border border-[#27272A] px-3 py-1.5 rounded-sm">
              <span className="font-mono text-[10px] text-[#A1A1AA] uppercase shrink-0">
                MANUAL JOG:
              </span>
              <input
                type="range"
                min="0"
                max="180"
                value={servoAngle}
                onChange={(e) => onManualAngleChange && onManualAngleChange(Number(e.target.value))}
                className="flex-1 accent-[#F59E0B] cursor-pointer h-1 bg-[#27272A] rounded-sm"
              />
              <span className="font-mono text-[11px] tabular-nums font-bold text-[#F59E0B] w-[45px] text-right">
                {servoAngle.toFixed(1)}°
              </span>
            </div>
          </div>
        ) : (
          /* CASE B: ALL OTHER 21 LABS — RENDER SPECIALIZED HARDWARE STAGE */
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="font-mono text-[10px] text-[#71717A] tracking-wider uppercase mb-3 flex items-center gap-2">
              <span>HARDWARE SIMULATION STAGE</span>
              <span>//</span>
              <span className="text-[#F59E0B]">{currentLab.code}: {currentLab.title}</span>
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
            {storeLabId === 'servo' ? 'ACTUATOR TELEMETRY' : 'HARDWARE TELEMETRY'}
          </span>
          <span className="text-[#06B6D4]">
            {storeLabId === 'servo' ? 'AVR D9 PWM' : `${currentLab.code}`}
          </span>
        </div>

        {/* Big Tabular Displacement / Primary Metric */}
        {storeLabId === 'servo' ? (
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
          {storeLabId === 'servo' ? (
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
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">ACTIVE TARGET</span>
                <span className="text-[#06B6D4] tabular-nums font-semibold uppercase">
                  {storeLabId.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717A]">CORE CLOCK</span>
                <span className="text-[#F4F4F5] tabular-nums font-semibold">
                  16.000000 MHz
                </span>
              </div>
            </>
          )}

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
