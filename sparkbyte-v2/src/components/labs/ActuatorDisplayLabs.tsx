/**
 * Actuator & Display Labs Components
 * Labs: RGB LED, 16x2 I2C LCD, SSD1306 OLED, L298N Motor Driver Rover
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React from 'react';
import { useWorkbenchStore } from '../../store/useWorkbenchStore';
import { Palette, Tv, Monitor, Cog, ArrowUp, ArrowDown, RotateCcw, Shield } from 'lucide-react';

// ─── 9. MULTI-CHANNEL RGB LED MIXING LAB ──────────────────────────────
export const RgbLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { rgbR, rgbG, rgbB } = hardwareState;

  const hexColor = isRunning
    ? `#${((1 << 24) + (rgbR << 16) + (rgbG << 8) + rgbB).toString(16).slice(1)}`
    : '#1e293b';

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* RGB Diffused LED Bulb + Wokwi RGB Element */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <wokwi-rgb-led
              ledRed={isRunning ? rgbR / 255 : 0}
              ledGreen={isRunning ? rgbG / 255 : 0}
              ledBlue={isRunning ? rgbB / 255 : 0}
            />
            <span className="text-[10px] font-mono text-slate-400">
              {isRunning ? 'Wokwi RGB' : 'RGB STANDBY'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-full border-4 border-slate-700 shadow-2xl transition-all flex items-center justify-center"
              style={{
                backgroundColor: hexColor,
                boxShadow: isRunning ? `0 0 35px ${hexColor}80` : 'none'
              }}
            />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase">
              {isRunning ? hexColor : 'OFF'}
            </span>
          </div>
        </div>

        {/* 3-Channel PWM Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[200px] text-xs">
          <div className="flex justify-between items-center">
            <span className="text-red-400 font-bold">Red (Pin ~9):</span>
            <span className="font-mono font-bold text-red-400">{isRunning ? `${rgbR} / 255 (${Math.round(rgbR / 2.55)}%)` : '0 / 255 (0%)'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-400 font-bold">Green (Pin ~10):</span>
            <span className="font-mono font-bold text-emerald-400">{isRunning ? `${rgbG} / 255 (${Math.round(rgbG / 2.55)}%)` : '0 / 255 (0%)'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-400 font-bold">Blue (Pin ~11):</span>
            <span className="font-mono font-bold text-blue-400">{isRunning ? `${rgbB} / 255 (${Math.round(rgbB / 2.55)}%)` : '0 / 255 (0%)'}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800 pt-1">
            <span className="text-slate-400">Driver State:</span>
            <span className={`font-mono font-bold ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isRunning ? 'PWM ACTIVE' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* Triple RGB PWM Sliders (Stimuli Injection) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs shadow-xl">
        <Palette className="w-4 h-4 text-sky-400" />
        <div className="flex items-center gap-1.5">
          <span className="text-red-400 font-bold w-3">R:</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgbR}
            onChange={(e) => updateHardwareState({ rgbR: parseInt(e.target.value, 10) })}
            className="w-24 accent-red-500 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold w-3">G:</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgbG}
            onChange={(e) => updateHardwareState({ rgbG: parseInt(e.target.value, 10) })}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-blue-400 font-bold w-3">B:</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgbB}
            onChange={(e) => updateHardwareState({ rgbB: parseInt(e.target.value, 10) })}
            className="w-24 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// ─── 16. 16x2 I2C CHARACTER DISPLAY LAB ───────────────────────────────
export const LcdLabView: React.FC = () => {
  const { hardwareState, updateHardwareState } = useWorkbenchStore();
  const { lcdTextRow0, lcdTextRow1 } = hardwareState;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-8 mb-6">
        {/* 16x2 HD44780 LCD with Blue Backlight */}
        <div className="w-80 bg-blue-900 border-4 border-slate-700 rounded-xl p-3 shadow-2xl flex flex-col items-center gap-2">
          {/* Bezel */}
          <div className="w-full bg-[#1e3a8a] border-2 border-blue-950 rounded p-2.5 shadow-inner">
            <div className="font-mono text-sm tracking-widest text-[#93c5fd] font-bold h-6 flex items-center overflow-hidden">
              {lcdTextRow0.padEnd(16, ' ').slice(0, 16)}
            </div>
            <div className="font-mono text-sm tracking-widest text-[#93c5fd] font-bold h-6 flex items-center overflow-hidden">
              {lcdTextRow1.padEnd(16, ' ').slice(0, 16)}
            </div>
          </div>
          <div className="flex justify-between w-full px-2 text-[10px] text-blue-200 font-mono">
            <span>I2C ADDR: 0x27</span>
            <span>SDA (A4) · SCL (A5)</span>
          </div>
        </div>

        {/* Bus Protocol Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[180px] text-xs">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
            <Tv className="w-4 h-4" />
            <span>I2C Bus Controller</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Clock (SCL):</span>
            <span className="font-mono text-emerald-400">100 kHz Std</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Driver Chip:</span>
            <span className="font-mono text-slate-300">PCF8574 Backpack</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">CGRAM Glyphs:</span>
            <span className="font-mono text-sky-400">8 Custom Chars</span>
          </div>
        </div>
      </div>

      {/* Interactive Text Input */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs shadow-xl">
        <span className="text-slate-300 font-medium">LCD Text:</span>
        <input
          type="text"
          maxLength={16}
          value={lcdTextRow0}
          onChange={(e) => updateHardwareState({ lcdTextRow0: e.target.value })}
          placeholder="Row 0 Text..."
          className="bg-slate-800 text-sky-400 border border-slate-700 rounded px-2 py-1 font-mono text-xs w-36 focus:outline-none"
        />
        <input
          type="text"
          maxLength={16}
          value={lcdTextRow1}
          onChange={(e) => updateHardwareState({ lcdTextRow1: e.target.value })}
          placeholder="Row 1 Text..."
          className="bg-slate-800 text-sky-400 border border-slate-700 rounded px-2 py-1 font-mono text-xs w-36 focus:outline-none"
        />
      </div>
    </div>
  );
};

// ─── 17. SSD1306 128x64 MONOCHROME OLED LAB ───────────────────────────
export const OledLabView: React.FC = () => {
  const { hardwareState } = useWorkbenchStore();
  const { oledBuffer } = hardwareState;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, 128, 64);

    let activePixels = 0;
    if (oledBuffer && oledBuffer.length === 64) {
      ctx.fillStyle = '#22d3ee';
      for (let r = 0; r < 64; r++) {
        for (let c = 0; c < 128; c++) {
          if (oledBuffer[r][c]) {
            ctx.fillRect(c, r, 1, 1);
            activePixels++;
          }
        }
      }
    }

    if (activePixels === 0) {
      ctx.fillStyle = '#22d3ee';
      ctx.font = '8px monospace';
      ctx.fillText('* SPARKBYTE OLED *', 10, 16);
      ctx.fillText('Adafruit_GFX 128x64', 8, 32);
      ctx.fillText('Awaiting GFX code...', 6, 48);
      ctx.strokeStyle = '#0e7490';
      ctx.strokeRect(0.5, 0.5, 127, 63);
    }
  }, [oledBuffer]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-8 mb-6">
        {/* SSD1306 0.96" OLED Module */}
        <div className="w-72 bg-slate-900 border-4 border-slate-700 rounded-2xl p-3 shadow-2xl flex flex-col items-center gap-2">
          {/* 128x64 Live Canvas Screen */}
          <div className="w-full bg-black border-2 border-slate-800 rounded-lg p-2 flex flex-col items-center justify-center shadow-inner">
            <canvas
              ref={canvasRef}
              width={128}
              height={64}
              className="w-full h-32 rounded bg-black image-render-pixelated shadow-lg"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold">SSD1306 128×64 Monochrome OLED (0x3C)</span>
        </div>

        {/* OLED Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[190px] text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <Monitor className="w-4 h-4" />
            <span>Frame Buffer Telemetry</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Buffer Size:</span>
            <span className="font-mono text-sky-400">1024 Bytes (1KB)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Resolution:</span>
            <span className="font-mono text-slate-200">128 × 64 pixels</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Graphics Lib:</span>
            <span className="font-mono text-emerald-400">Adafruit_GFX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 19. L298N DUAL H-BRIDGE 4-WHEEL ROVER LAB ─────────────────────────
export const MotorLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { motorSpeed, motorDirection } = hardwareState;

  const isMotorActive = isRunning && motorSpeed > 0;

  const handleDrive = (dir: 'FORWARD' | 'BACKWARD' | 'BRAKE') => {
    updateHardwareState({
      motorDirection: dir,
      motorSpeed: dir === 'BRAKE' ? 0 : 200,
      currentMa: dir === 'BRAKE' ? 25.0 : 380.0
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* 4-Wheel Rover Chassis View */}
        <div className="w-64 h-48 bg-slate-900 border-2 border-slate-700 rounded-2xl p-3 relative flex items-center justify-center shadow-2xl overflow-hidden">
          {/* Wheels with tread rotation animation */}
          {[-1, 1].map((sideX) =>
            [-1, 1].map((sideY) => (
              <div
                key={`${sideX}-${sideY}`}
                {...(isMotorActive ? { 'data-tread-rolling': true } : {})}
                className={`w-7 h-16 bg-slate-950 border-2 border-slate-600 rounded-lg absolute flex flex-col justify-around py-1 shadow-lg transition-transform ${isMotorActive
                    ? motorDirection === 'FORWARD'
                      ? 'animate-pulse'
                      : 'animate-pulse'
                    : ''
                  }`}
                style={{
                  left: sideX === -1 ? '4px' : undefined,
                  right: sideX === 1 ? '4px' : undefined,
                  top: sideY === -1 ? '10px' : undefined,
                  bottom: sideY === 1 ? '10px' : undefined
                }}
              >
                {/* Tread bars */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-full h-1 rounded-full transition-colors ${isMotorActive
                        ? motorDirection === 'FORWARD'
                          ? 'bg-emerald-400/80 animate-pulse'
                          : 'bg-blue-400/80 animate-pulse'
                        : 'bg-slate-700'
                      }`}
                  />
                ))}
              </div>
            ))
          )}

          {/* L298N Red Heatsink */}
          <div className="w-24 h-24 bg-red-950/90 border-2 border-red-700 rounded-xl flex flex-col items-center justify-center shadow-xl z-10">
            <Cog className={`w-9 h-9 text-red-400 transition-transform ${isMotorActive ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-mono font-bold text-red-200 mt-1">L298N DUAL</span>
            <span className="text-[8px] font-mono text-amber-400 font-semibold">
              {isMotorActive ? `${motorDirection}` : isRunning ? 'IDLE' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* H-Bridge Driver Diagnostics & Transistor State */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[220px] text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Shield className="w-4 h-4" />
            <span>H-Bridge Transistor State:</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] my-1">
            <div className={`p-1.5 rounded text-center border transition-colors ${isMotorActive && motorDirection === 'FORWARD' ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-bold shadow' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
              Q1 (High L): {isMotorActive && motorDirection === 'FORWARD' ? 'ON' : 'OFF'}
            </div>
            <div className={`p-1.5 rounded text-center border transition-colors ${isMotorActive && motorDirection === 'BACKWARD' ? 'bg-blue-950 border-blue-500 text-blue-400 font-bold shadow' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
              Q2 (High R): {isMotorActive && motorDirection === 'BACKWARD' ? 'ON' : 'OFF'}
            </div>
            <div className={`p-1.5 rounded text-center border transition-colors ${isMotorActive && motorDirection === 'BACKWARD' ? 'bg-blue-950 border-blue-500 text-blue-400 font-bold shadow' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
              Q3 (Low L): {isMotorActive && motorDirection === 'BACKWARD' ? 'ON' : 'OFF'}
            </div>
            <div className={`p-1.5 rounded text-center border transition-colors ${isMotorActive && motorDirection === 'FORWARD' ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-bold shadow' : 'bg-slate-950/60 border-slate-800 text-slate-500'}`}>
              Q4 (Low R): {isMotorActive && motorDirection === 'FORWARD' ? 'ON' : 'OFF'}
            </div>
          </div>

          <div className="flex justify-between border-t border-slate-800 pt-1">
            <span className="text-slate-400">Direction:</span>
            <span className={`font-mono font-bold ${!isRunning ? 'text-slate-500' : motorDirection === 'FORWARD' ? 'text-emerald-400' : motorDirection === 'BACKWARD' ? 'text-blue-400' : 'text-slate-400'
              }`}>{isRunning ? motorDirection : 'STANDBY'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">PWM Speed:</span>
            <span className="font-mono font-bold text-amber-400">{isMotorActive ? `${motorSpeed} / 255` : '0 / 255'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current:</span>
            <span className="font-mono font-bold text-emerald-400">{isMotorActive ? '380 mA' : '25 mA'}</span>
          </div>
        </div>
      </div>

      {/* Rover Drive Controls */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-2 text-xs shadow-xl">
        <button
          onClick={() => handleDrive('FORWARD')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Forward</span>
        </button>
        <button
          onClick={() => handleDrive('BACKWARD')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
        >
          <ArrowDown className="w-4 h-4" />
          <span>Reverse</span>
        </button>
        <button
          onClick={() => handleDrive('BRAKE')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Brake</span>
        </button>
      </div>
    </div>
  );
};
