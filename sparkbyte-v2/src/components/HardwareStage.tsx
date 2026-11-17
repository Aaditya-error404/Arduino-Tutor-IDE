/**
 * Full-Viewport Hardware Focus Stage
 * Canvas-First Engineering Bench with subtle dot-grid backdrop and floating simulation pill bar.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Gauge, 
  Activity
} from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { LabStageRenderer } from './labs';
import '@wokwi/elements';

export const HardwareStage: React.FC = () => {
  const {
    activeLabId,
    isRunning,
    isPaused,
    speed,
    loopCount,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    stepSimulation,
    setSpeed,
    hardwareState,
    activeInstruction
  } = useWorkbenchStore();

  const handleStartToggle = () => {
    if (!isRunning) {
      startSimulation();
    } else if (isPaused) {
      resumeSimulation();
    } else {
      pauseSimulation();
    }
  };

  const {
    ledOn,
    voltage,
    currentMa
  } = hardwareState;

  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center bg-[#0B1120] overflow-hidden select-none"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          TOP-CENTER FLOATING SIMULATION PILL BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-full px-3.5 py-1.5 shadow-2xl font-sans text-xs">
        {/* Play/Pause/Resume Button */}
        <button
          onClick={handleStartToggle}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs transition-all shadow-sm ${
            isRunning && !isPaused
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
          }`}
          title={isRunning && !isPaused ? 'Pause Simulation (Space)' : 'Start Microcontroller Simulation'}
        >
          {isRunning && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Resume' : 'Start Simulation'}</span>
            </>
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={stepSimulation}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Single-step instruction clock"
        >
          <StepForward className="w-3 h-3 stroke-[2]" />
          <span className="hidden sm:inline text-[11px]">Step</span>
        </button>

        {/* Reset */}
        <button
          onClick={resetSimulation}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Reset microcontroller registers & hardware"
        >
          <RotateCcw className="w-3 h-3 stroke-[1.5]" />
          <span className="hidden sm:inline text-[11px]">Reset</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Clock Speed Multiplier */}
        <div className="flex items-center gap-1 text-slate-400">
          <Gauge className="w-3.5 h-3.5 text-slate-500 stroke-[1.5]" />
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-full px-2 py-0.5 text-[11px] font-mono focus:outline-none"
          >
            <option value="0.5">0.5x (8MHz)</option>
            <option value="1.0">1.0x (16MHz)</option>
            <option value="2.0">2.0x (32MHz)</option>
          </select>
        </div>

        <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

        {/* Loop Cycles & Status Badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isRunning && !isPaused ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <Activity className="w-3 h-3 text-sky-400 stroke-[2]" />
            <span className="text-slate-400 hidden md:inline">Loops:</span>
            <strong className="text-sky-300">{loopCount}</strong>
          </span>

          <span className="text-slate-500 hidden lg:inline">•</span>

          <span className="text-slate-400 text-[10px] hidden lg:inline">
            {voltage.toFixed(1)}V · {currentMa.toFixed(0)}mA
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVE EXECUTION LIVE TICKER STRIP (TOP SUBTLE HUD)
      ───────────────────────────────────────────────────────────── */}
      {activeInstruction && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-slate-900/80 backdrop-blur border border-slate-800/80 rounded-full text-[11px] font-mono text-slate-300 shadow-lg flex items-center gap-2 max-w-[85vw] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping shrink-0" />
          <span className="text-lime-400 font-bold shrink-0">[{activeInstruction.phase.toUpperCase()}]</span>
          <span className="truncate text-slate-200">
            {activeInstruction.plainEnglish || activeInstruction.rawCpp}
          </span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN FULL-BLEED CIRCUIT CANVAS: ARDUINO UNO + ACTUATORS
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full h-full flex flex-col xl:flex-row items-center justify-center p-6 gap-8 overflow-auto z-0">
        {/* Physical Arduino Uno R3 Web Element */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-3xl shadow-2xl shrink-0 transition-transform hover:scale-[1.01]">
          <div className="scale-[0.85] origin-center -m-3">
            <wokwi-arduino-uno />
          </div>
          <div className="flex items-center gap-4 text-[10.5px] font-mono text-slate-400 mt-2">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${ledOn ? 'bg-red-500 shadow-sm shadow-red-500 animate-pulse' : 'bg-slate-700'}`} />
              <span>Pin 13 LED</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>5V Power</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>ATmega328P</span>
            </span>
          </div>
        </div>

        {/* Active Lab Interactive Peripheral & Sensor Stage */}
        <div className="flex-1 flex items-center justify-center min-h-[340px] max-w-[720px] w-full">
          <LabStageRenderer labId={activeLabId} />
        </div>
      </div>
    </div>
  );
};
