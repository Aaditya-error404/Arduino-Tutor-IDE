/**
 * SparkByte Parametric CAD Controls Floating Drawer
 *
 * Anti-"AI Slop" Machined Glassmorphic Drawer
 * - Industrial 1px borders (#27272A), deep surface (#121215/95)
 * - Monospaced telemetry readouts (X x Y x Z mm, Volume cm3, Filament grams)
 * - One-click binary .STL slicer download
 * - Real-time exploded view slider & X-ray ghost toggle
 *
 * (c) 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState } from 'react';
import {
  Layers,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Cpu,
  Shield,
  Box,
  Radio,
  Printer
} from 'lucide-react';
import {
  EnclosureConfig,
  EnclosureStyle,
  EnclosureTelemetry,
  ServoAttachment
} from '../../cad/enclosureBuilder';

interface ParametricEnclosureDrawerProps {
  labId: string;
  config: EnclosureConfig;
  telemetry: EnclosureTelemetry;
  onChangeConfig: (newConfig: EnclosureConfig) => void;
  onExportStl: () => void;
}

export const ParametricEnclosureDrawer: React.FC<ParametricEnclosureDrawerProps> = ({
  labId,
  config,
  telemetry,
  onChangeConfig,
  onExportStl
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const update = (partial: Partial<EnclosureConfig>) => {
    onChangeConfig({
      ...config,
      ...partial
    });
  };

  return (
    <div className="absolute top-14 left-3 z-20 flex flex-col font-mono select-none">
      {/* ── DRAWER HEADER TRIGGER BUTTON ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-[#121215]/95 hover:bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-[#F4F4F5] text-[10.5px] font-bold tracking-wide transition-all shadow-lg backdrop-blur-md group"
        title="Toggle Parametric 3D CAD Enclosure Controls"
      >
        <Layers className={`w-3.5 h-3.5 ${config.enabled ? 'text-[#06B6D4]' : 'text-[#71717A]'}`} strokeWidth={1.5} />
        <span className="text-[#A1A1AA] group-hover:text-[#F4F4F5]">PARAMETRIC ENCLOSURE</span>
        <span className={`px-1 py-0.2 rounded-sm text-[9px] ${config.enabled ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30' : 'bg-[#27272A] text-[#71717A]'}`}>
          {config.enabled ? config.style.toUpperCase() : 'OFF'}
        </span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-[#71717A] group-hover:text-[#F4F4F5]" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="w-3 h-3 text-[#71717A] group-hover:text-[#F4F4F5]" strokeWidth={1.5} />
        )}
      </button>

      {/* ── EXPANDABLE CONTROL PANEL ── */}
      {isOpen && (
        <div className="mt-1.5 w-72 bg-[#121215]/95 border border-[#27272A] rounded-sm p-3 text-xs shadow-2xl backdrop-blur-md space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto">
          {/* MASTER ENCLOSURE TOGGLE */}
          <div className="flex items-center justify-between pb-2 border-b border-[#27272A]">
            <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#F59E0B]" strokeWidth={1.5} />
              Enclosure Mesh
            </span>
            <button
              onClick={() => update({ enabled: !config.enabled })}
              className={`px-2 py-0.5 rounded-sm text-[10px] font-bold transition-colors ${
                config.enabled
                  ? 'bg-[#10B981] text-[#09090B]'
                  : 'bg-[#27272A] text-[#71717A] hover:text-[#F4F4F5]'
              }`}
            >
              {config.enabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>

          {config.enabled && (
            <>
              {/* ENCLOSURE STYLE SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-[9.5px] text-[#71717A] uppercase font-bold tracking-wider">
                  Chassis Form Factor
                </label>
                <div className="grid grid-cols-3 gap-1 text-[9.5px]">
                  {(
                    [
                      { id: 'tray', label: 'Tray' },
                      { id: 'snapfit', label: 'Snap-Fit' },
                      { id: 'console', label: 'Console' }
                    ] as { id: EnclosureStyle; label: string }[]
                  ).map((style) => (
                    <button
                      key={style.id}
                      onClick={() => update({ style: style.id })}
                      className={`py-1 rounded-sm border transition-colors flex items-center justify-center font-bold ${
                        config.style === style.id
                          ? 'bg-[#F59E0B] text-[#09090B] border-[#F59E0B]'
                          : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-[#F4F4F5]'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WALL THICKNESS SLIDER */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#A1A1AA]">Wall Thickness:</span>
                  <span className="text-[#06B6D4] font-bold tabular-nums">
                    {config.wallThickness.toFixed(1)} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.1"
                  value={config.wallThickness}
                  onChange={(e) => update({ wallThickness: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[#27272A] rounded-sm appearance-none cursor-pointer accent-[#06B6D4]"
                />
              </div>

              {/* CLEARANCE TOLERANCE SLIDER */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#A1A1AA]">Clearance Tolerance:</span>
                  <span className="text-[#F59E0B] font-bold tabular-nums">
                    +{config.clearance.toFixed(2)} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={config.clearance}
                  onChange={(e) => update({ clearance: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-[#27272A] rounded-sm appearance-none cursor-pointer accent-[#F59E0B]"
                />
              </div>

              {/* EXPLODED VIEW SEPARATION SLIDER */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#A1A1AA]">Exploded Separation:</span>
                  <span className="text-[#10B981] font-bold tabular-nums">
                    {Math.round(config.explodedPct)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.explodedPct}
                  onChange={(e) => update({ explodedPct: parseInt(e.target.value, 10) })}
                  className="w-full h-1 bg-[#27272A] rounded-sm appearance-none cursor-pointer accent-[#10B981]"
                />
              </div>

              {/* TOGGLES: STANDOFFS, AUTO-CUTOUTS, GHOST X-RAY, LID */}
              <div className="pt-1 border-t border-[#27272A] space-y-1.5 text-[10px]">
                {/* M3 Standoffs Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Cpu className="w-3 h-3 text-[#71717A]" strokeWidth={1.5} />
                    M3 Uno Standoffs
                  </span>
                  <button
                    onClick={() => update({ hasStandoffs: !config.hasStandoffs })}
                    className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${
                      config.hasStandoffs ? 'bg-[#27272A] text-[#F4F4F5]' : 'text-[#71717A]'
                    }`}
                  >
                    {config.hasStandoffs ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Auto Port Cutouts */}
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    <Box className="w-3 h-3 text-[#71717A]" strokeWidth={1.5} />
                    Auto Port Cutouts
                  </span>
                  <button
                    onClick={() => update({ autoPortCutouts: !config.autoPortCutouts })}
                    className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${
                      config.autoPortCutouts ? 'bg-[#27272A] text-[#06B6D4]' : 'text-[#71717A]'
                    }`}
                  >
                    {config.autoPortCutouts ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Ghost / X-Ray Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] flex items-center gap-1.5">
                    {config.isGhost ? (
                      <Eye className="w-3 h-3 text-[#38BDF8]" strokeWidth={1.5} />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#71717A]" strokeWidth={1.5} />
                    )}
                    Ghost X-Ray (35% Opacity)
                  </span>
                  <button
                    onClick={() => update({ isGhost: !config.isGhost })}
                    className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${
                      config.isGhost ? 'bg-[#38BDF8] text-[#09090B]' : 'bg-[#18181B] text-[#71717A]'
                    }`}
                  >
                    {config.isGhost ? 'ACTIVE' : 'SOLID'}
                  </button>
                </div>

                {/* Show Lid (for Snap-Fit / Console) */}
                {config.style !== 'tray' && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#A1A1AA]">Top Lid</span>
                    <button
                      onClick={() => update({ showLid: !config.showLid })}
                      className={`px-1.5 py-0.5 rounded-sm font-bold text-[9px] ${
                        config.showLid ? 'bg-[#27272A] text-[#F4F4F5]' : 'text-[#71717A]'
                      }`}
                    >
                      {config.showLid ? 'SHOWN' : 'HIDDEN'}
                    </button>
                  </div>
                )}
              </div>

              {/* SERVO LAB ATTACHMENTS (Active when lab is servo) */}
              {labId === 'servo' && (
                <div className="pt-2 border-t border-[#27272A] space-y-1.5">
                  <label className="text-[9.5px] text-[#06B6D4] uppercase font-bold flex items-center gap-1">
                    <Radio className="w-3 h-3" strokeWidth={1.5} />
                    Spline Mechanical Attachment
                  </label>
                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                    {(
                      [
                        { id: 'standard', label: 'Horn' },
                        { id: 'radar', label: 'Radar' },
                        { id: 'gripper', label: 'Clamp' }
                      ] as { id: ServoAttachment; label: string }[]
                    ).map((att) => (
                      <button
                        key={att.id}
                        onClick={() => update({ servoAttachment: att.id })}
                        className={`py-1 rounded-sm border transition-colors font-bold ${
                          config.servoAttachment === att.id
                            ? 'bg-[#06B6D4] text-[#09090B] border-[#06B6D4]'
                            : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-[#F4F4F5]'
                        }`}
                      >
                        {att.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3D PRINT SLICER TELEMETRY CARD */}
              <div className="p-2 bg-[#18181B] border border-[#27272A] rounded-sm space-y-1 text-[10px]">
                <div className="flex items-center justify-between text-[#71717A] uppercase text-[9px] font-bold">
                  <span className="flex items-center gap-1 text-[#F59E0B]">
                    <Printer className="w-3 h-3" strokeWidth={1.5} />
                    Slicer Telemetry
                  </span>
                  <span>{telemetry.triangleCount.toLocaleString()} Tris</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10.5px]">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">Dims:</span>
                    <span className="text-[#F4F4F5] tabular-nums font-bold">
                      {telemetry.dimX}x{telemetry.dimY}x{telemetry.dimZ}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">Vol:</span>
                    <span className="text-[#F4F4F5] tabular-nums font-bold">
                      {telemetry.volumeCm3} cm³
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">PLA:</span>
                    <span className="text-[#10B981] tabular-nums font-bold">
                      ~{telemetry.plaGrams}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">Est Time:</span>
                    <span className="text-[#06B6D4] tabular-nums font-bold">
                      ~{telemetry.printTimeMinutes} min
                    </span>
                  </div>
                </div>
              </div>

              {/* ONE-CLICK BINARY .STL EXPORT BUTTON */}
              <button
                onClick={onExportStl}
                className="w-full py-2 px-3 rounded-sm bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-[#09090B] font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md"
                title="Download watertight binary .STL model for Cura / PrusaSlicer"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={2} />
                <span>EXPORT BINARY .STL</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
