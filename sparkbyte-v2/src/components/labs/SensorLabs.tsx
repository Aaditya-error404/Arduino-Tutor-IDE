/**
 * Sensor Labs Components (Level 2 & 3)
 * Labs: LDR, Temperature (TMP36), Sonar (HC-SR04), IR (TCRT5000), DHT11, Gas (MQ-2), Soil Moisture
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React from 'react';
import { useWorkbenchStore } from '../../store/useWorkbenchStore';
import { Sun, Thermometer, Radar, Compass, CloudRain, Flame, Sprout } from 'lucide-react';

// ─── 8. PHOTORESISTOR LIGHT SENSOR (LDR) LAB ──────────────────────────
export const LdrLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { ldrRaw, ledOn } = hardwareState;

  const lux = Math.round((ldrRaw / 1023.0) * 1000);
  const isLedActive = isRunning && ledOn;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* LDR Optical Cell with ambient photons */}
        <div className="flex flex-col items-center gap-2 relative">
          <div 
            className="w-16 h-16 rounded-full border-4 border-amber-600 flex items-center justify-center shadow-lg transition-colors relative"
            style={{ backgroundColor: `rgb(${Math.round(lux * 0.25)}, ${Math.round(lux * 0.22)}, ${Math.round(lux * 0.15)})` }}
          >
            <Sun className={`w-8 h-8 ${ldrRaw < 400 ? 'text-slate-500' : 'text-amber-400'}`} />
            {isRunning && lux > 100 && (
              <div data-ldr-photons className="absolute inset-0 rounded-full border-2 border-amber-300/40 animate-ping pointer-events-none" />
            )}
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">{lux} Lux</span>
        </div>

        {/* Nightlight LED Driven by C++ Code */}
        <div className="flex flex-col items-center gap-2">
          <wokwi-led color="yellow" value={isLedActive} label="Pin 13 LED" />
          <span className="text-[11px] font-mono text-slate-400">
            {isLedActive ? 'HIGH (LIT)' : isRunning ? 'LOW (DARK)' : 'STANDBY'}
          </span>
        </div>

        {/* Telemetry Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[170px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Raw ADC (A0):</span>
            <span className="font-mono text-sky-400 font-bold">{ldrRaw} / 1023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Code Output:</span>
            <span className={`font-mono font-bold ${isLedActive ? 'text-amber-400' : 'text-slate-500'}`}>
              {isLedActive ? 'digitalWrite(13, HIGH)' : isRunning ? 'digitalWrite(13, LOW)' : 'STANDBY'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Environment:</span>
            <span className={`font-mono font-bold ${ldrRaw < 400 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {ldrRaw < 400 ? 'NIGHT / DARK' : 'DAYLIGHT'}
            </span>
          </div>
        </div>
      </div>

      {/* Ambient Light Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-4 text-xs shadow-xl">
        <Sun className="w-4 h-4 text-amber-400" />
        <span className="text-slate-300 font-medium">Ambient Lux:</span>
        <input
          type="range"
          min="0"
          max="1023"
          value={ldrRaw}
          onChange={(e) => updateHardwareState({ ldrRaw: parseInt(e.target.value, 10) })}
          className="w-48 accent-amber-500 cursor-pointer"
        />
        <span className="font-mono font-bold text-amber-400 w-12 text-right">{lux} lx</span>
      </div>
    </div>
  );
};

// ─── 10. TMP36 ANALOG TEMPERATURE SENSOR LAB ──────────────────────────
export const TempLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { temperatureC, fanActive } = hardwareState;

  const tempF = +((temperatureC * 9/5) + 32).toFixed(1);
  const vOut = +(temperatureC * 0.01 + 0.5).toFixed(3);
  const isFanRunning = isRunning && fanActive;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Thermometer Gauge with Thermal Wave Feedback */}
        <div className="flex flex-col items-center gap-2 relative">
          <div className="w-16 h-28 bg-slate-900 border-2 border-slate-700 rounded-full p-2 flex flex-col justify-end items-center relative overflow-hidden">
            {isRunning && temperatureC > 30 && (
              <div
                data-thermal-waves
                className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-amber-500/10 to-transparent animate-pulse pointer-events-none"
              />
            )}
            <div 
              className={`w-4 rounded-full transition-all ${temperatureC > 35 ? 'bg-red-500' : 'bg-sky-400'}`}
              style={{ height: `${Math.max(10, Math.min(100, ((temperatureC + 20) / 100) * 100))}%` }}
            />
            <div className={`w-8 h-8 rounded-full ${temperatureC > 35 ? 'bg-red-500' : 'bg-sky-400'} absolute -bottom-1 shadow-lg`} />
          </div>
          <span className="text-xs font-mono font-bold text-sky-400">{temperatureC.toFixed(1)} °C</span>
        </div>

        {/* HVAC Cooling Fan Animation (Strictly Gated by isRunning && fanActive) */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-16 h-16 rounded-xl bg-slate-900 border-2 ${isFanRunning ? 'border-sky-500 shadow-lg shadow-sky-500/20' : 'border-slate-700'} flex items-center justify-center ${isFanRunning ? 'animate-spin' : ''}`}>
            <div className="w-12 h-2 bg-slate-500 rounded" />
            <div className="w-2 h-12 bg-slate-500 rounded absolute" />
          </div>
          <span className={`text-[11px] font-mono ${isFanRunning ? 'text-sky-400 font-bold' : 'text-slate-400'}`}>
            {isFanRunning ? 'FAN COOLING' : isRunning ? 'FAN IDLE' : 'FAN STANDBY'}
          </span>
        </div>

        {/* TMP36 Transfer Function Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[190px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Celsius / Fahr:</span>
            <span className="font-mono font-bold text-sky-400">{temperatureC.toFixed(1)}°C / {tempF}°F</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Analog Vout:</span>
            <span className="font-mono font-bold text-amber-400">{vOut} V</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Transfer Eq:</span>
            <span className="font-mono text-slate-400 text-[10px]">(Vout - 0.5) * 100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Threshold:</span>
            <span className="font-mono font-bold text-red-400">30.0 °C (Alarm)</span>
          </div>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-4 text-xs shadow-xl">
        <Thermometer className="w-4 h-4 text-sky-400" />
        <span className="text-slate-300 font-medium">Temperature:</span>
        <input
          type="range"
          min="-20"
          max="80"
          step="0.5"
          value={temperatureC}
          onChange={(e) => updateHardwareState({ temperatureC: parseFloat(e.target.value) })}
          className="w-48 accent-sky-400 cursor-pointer"
        />
        <span className="font-mono font-bold text-sky-400 w-16 text-right">{temperatureC.toFixed(1)}°C</span>
      </div>
    </div>
  );
};

// ─── 11. HC-SR04 ULTRASONIC SONAR LAB ─────────────────────────────────
export const SonarLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { distanceCm } = hardwareState;

  const durationUs = Math.round(distanceCm * 58.2);
  const isHazard = isRunning && distanceCm < 15.0;

  // Normalized visual offset for obstacle target (from 20px to 120px)
  const obstacleX = Math.round(20 + Math.min(100, (distanceCm / 200) * 100));

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-8 mb-6">
        {/* HC-SR04 Transducers and Ultrasonic Wave Propagation */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center p-3 bg-slate-900 border border-slate-800 rounded-2xl">
            <wokwi-hc-sr04 />

            {/* Ultrasonic Acoustic Waves Wavefront */}
            {isRunning && (
              <div
                data-sonar-wave
                className="absolute left-28 flex items-center gap-1.5 pointer-events-none"
              >
                <div className="w-1.5 h-8 rounded-full border-r-2 border-sky-400/80 animate-ping" />
                <div className="w-2 h-12 rounded-full border-r-2 border-sky-400/60 animate-ping delay-75" />
                <div className="w-2.5 h-16 rounded-full border-r-2 border-sky-400/40 animate-ping delay-150" />
              </div>
            )}

            {/* Target Obstacle Visualizer */}
            <div
              className={`w-6 h-16 rounded-lg border-2 flex items-center justify-center transition-all ${
                isHazard
                  ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/30'
                  : 'bg-slate-800 border-slate-600'
              }`}
              style={{ marginLeft: `${obstacleX}px` }}
              title={`Obstacle at ${distanceCm.toFixed(1)} cm`}
            >
              <div className="w-1 h-8 bg-slate-500 rounded" />
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400">
            HC-SR04: {distanceCm.toFixed(1)} cm ({isRunning ? 'ECHO ACTIVE' : 'STANDBY'})
          </span>
        </div>

        {/* Echolocation Telemetry Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[200px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Echo Pulse:</span>
            <span className="font-mono font-bold text-amber-400">{isRunning ? `${durationUs} µs` : '0 µs'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Calculated Dist:</span>
            <span className="font-mono font-bold text-sky-400">{distanceCm.toFixed(1)} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Speed of Sound:</span>
            <span className="font-mono text-slate-300">343 m/s (0.0343 cm/µs)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Proximity Zone:</span>
            <span className={`font-mono font-bold ${
              !isRunning ? 'text-slate-500' : isHazard ? 'text-red-400 animate-pulse' : 'text-emerald-400'
            }`}>
              {!isRunning ? 'SIMULATION PAUSED' : isHazard ? 'HAZARD OBSTACLE' : 'CLEAR PATH'}
            </span>
          </div>
        </div>
      </div>

      {/* Distance Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-4 text-xs shadow-xl">
        <Radar className="w-4 h-4 text-sky-400" />
        <span className="text-slate-300 font-medium">Obstacle Distance:</span>
        <input
          type="range"
          min="2"
          max="200"
          value={distanceCm}
          onChange={(e) => updateHardwareState({ distanceCm: parseFloat(e.target.value) })}
          className="w-48 accent-sky-400 cursor-pointer"
        />
        <span className="font-mono font-bold text-sky-400 w-16 text-right">{distanceCm.toFixed(1)} cm</span>
      </div>
    </div>
  );
};

// ─── 12. TCRT5000 INFRARED LINE TRACKER LAB ───────────────────────────
export const IrLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { irReflectRaw, ledOn } = hardwareState;

  const threshold = 500;
  const onBlackLine = irReflectRaw > threshold;
  const isLedActive = isRunning && ledOn;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-8 mb-6">
        {/* Optical TCRT5000 Sensor Visual with 940nm Dual Ray Path */}
        <div className="w-36 h-28 bg-slate-900 border-2 border-slate-700 rounded-xl p-3 flex flex-col items-center justify-between gap-2 shadow-xl relative">
          <div className="flex gap-6 relative">
            {/* 940nm IR Emitter */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-indigo-500 animate-pulse shadow-md shadow-indigo-500/50' : 'bg-slate-700'}`} title="940nm IR Emitter" />
              <span className="text-[9px] font-mono text-indigo-400">TX (IR)</span>
            </div>
            {/* Phototransistor Receiver */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full border ${isRunning && !onBlackLine ? 'bg-amber-400 border-amber-300 shadow-md shadow-amber-400/50' : 'bg-slate-900 border-slate-600'}`} title="Phototransistor Receiver" />
              <span className="text-[9px] font-mono text-slate-400">RX (Photo)</span>
            </div>
          </div>

          {/* 940nm Optical Ray Path Animation */}
          {isRunning && (
            <div data-ir-beam className="w-full flex justify-center items-center py-1">
              <svg width="60" height="24" viewBox="0 0 60 24" className="overflow-visible">
                {/* Outgoing IR ray */}
                <line x1="12" y1="0" x2="30" y2="20" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 3" className="animate-pulse" />
                {/* Reflected ray (bounces back if white floor, absorbs if black line) */}
                {onBlackLine ? (
                  <circle cx="30" cy="20" r="3" fill="#ef4444" className="animate-ping" />
                ) : (
                  <line x1="30" y1="20" x2="48" y2="0" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" className="animate-pulse" />
                )}
              </svg>
            </div>
          )}

          <span className="text-[10px] font-mono text-slate-400">TCRT5000 Opto</span>
        </div>

        {/* Track Surface Simulation */}
        <div className={`w-28 h-20 border-2 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
          onBlackLine ? 'bg-black text-white border-slate-600' : 'bg-white text-slate-950 border-slate-300'
        }`}>
          {onBlackLine ? 'BLACK TAPE' : 'WHITE FLOOR'}
        </div>

        {/* Code Output Indicator LED */}
        <div className="flex flex-col items-center gap-2">
          <wokwi-led color="red" value={isLedActive} label="Pin 13 LED" />
          <span className="text-[11px] font-mono text-slate-400">
            {isLedActive ? 'HIGH (LIT)' : isRunning ? 'LOW (DARK)' : 'STANDBY'}
          </span>
        </div>

        {/* Digital Comparator Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[180px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Reflectivity:</span>
            <span className="font-mono font-bold text-sky-400">{irReflectRaw} / 1023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sensor Pin 2:</span>
            <span className={`font-mono font-bold ${onBlackLine ? 'text-red-400' : 'text-emerald-400'}`}>
              {onBlackLine ? 'HIGH (Absorbed)' : 'LOW (Reflected)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Code Output:</span>
            <span className={`font-mono font-bold ${isLedActive ? 'text-red-400' : 'text-slate-500'}`}>
              {isLedActive ? 'digitalWrite(13, HIGH)' : isRunning ? 'digitalWrite(13, LOW)' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* Track Surface Presets */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-3 text-xs shadow-xl">
        <Compass className="w-4 h-4 text-sky-400" />
        <span className="text-slate-300 font-medium">Test Surface:</span>
        <button
          onClick={() => updateHardwareState({ irReflectRaw: 120 })}
          className={`px-3 py-1 rounded font-semibold ${irReflectRaw < 300 ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-400'}`}
        >
          White Surface (120)
        </button>
        <button
          onClick={() => updateHardwareState({ irReflectRaw: 850 })}
          className={`px-3 py-1 rounded font-semibold ${irReflectRaw >= 300 ? 'bg-black text-white border border-slate-700' : 'bg-slate-800 text-slate-400'}`}
        >
          Black Line (850)
        </button>
      </div>
    </div>
  );
};

// ─── 14. DHT11 / DHT22 CLIMATE TELEMETRY LAB ──────────────────────────
export const DhtLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { temperatureC, humidityPct } = hardwareState;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Wokwi DHT22 Component with ambient air flow */}
        <div className="flex flex-col items-center gap-2 relative">
          <div className="relative">
            <wokwi-dht22 />
            {isRunning && (
              <div
                data-dht-flow
                className="absolute inset-0 border border-sky-400/40 rounded animate-pulse pointer-events-none"
              />
            )}
          </div>
          <span className="text-xs font-mono font-bold text-sky-400">
            DHT Sensor ({isRunning ? 'ACQUIRING' : 'IDLE'})
          </span>
        </div>

        {/* Climate Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[200px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Temperature:</span>
            <span className="font-mono font-bold text-amber-400">{temperatureC.toFixed(1)} °C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Relative Humidity:</span>
            <span className="font-mono font-bold text-sky-400">{humidityPct.toFixed(1)} %</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">1-Wire Bus:</span>
            <span className={`font-mono ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isRunning ? 'Digital Handshake OK' : 'BUS STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Sliders (Temp & Humidity) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300 font-medium">Temp:</span>
          <input
            type="range"
            min="-10"
            max="60"
            value={temperatureC}
            onChange={(e) => updateHardwareState({ temperatureC: parseFloat(e.target.value) })}
            className="w-28 accent-amber-500 cursor-pointer"
          />
          <span className="font-mono text-amber-400 w-12">{temperatureC.toFixed(0)}°C</span>
        </div>

        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-sky-400" />
          <span className="text-slate-300 font-medium">Humidity:</span>
          <input
            type="range"
            min="10"
            max="95"
            value={humidityPct}
            onChange={(e) => updateHardwareState({ humidityPct: parseFloat(e.target.value) })}
            className="w-28 accent-sky-400 cursor-pointer"
          />
          <span className="font-mono text-sky-400 w-12">{humidityPct.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

// ─── 15. MQ-2 COMBUSTIBLE GAS & SMOKE LAB ─────────────────────────────
export const GasLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { gasPpm, buzzerActive, ledOn } = hardwareState;

  const isAlarm = isRunning && (buzzerActive || ledOn);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* MQ-2 Steel Mesh Chamber with Gas Diffusion Particles */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center shadow-xl relative">
            <Flame className={`w-8 h-8 ${isAlarm ? 'text-red-500 animate-bounce' : 'text-amber-500'}`} />
            {isAlarm && <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />}
            {isRunning && gasPpm > 150 && (
              <div
                data-gas-particles
                className="absolute -top-3 w-8 h-8 rounded-full bg-slate-400/20 animate-ping pointer-events-none"
              />
            )}
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">MQ-2 SnO2 Cell</span>
        </div>

        {/* Hazard Alert Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[200px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Concentration:</span>
            <span className={`font-mono font-bold ${isAlarm ? 'text-red-400' : 'text-slate-200'}`}>{gasPpm} PPM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Code Actuators:</span>
            <span className={`font-mono font-bold ${isAlarm ? 'text-red-400' : 'text-slate-400'}`}>
              {isAlarm ? 'BUZZER / LED ACTIVE' : isRunning ? 'QUIET / IDLE' : 'STANDBY'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Safety Status:</span>
            <span className={`font-mono font-bold ${
              !isRunning ? 'text-slate-500' : isAlarm ? 'text-red-400 animate-pulse' : 'text-emerald-400'
            }`}>
              {!isRunning ? 'STANDBY' : isAlarm ? 'HAZARD LEAK DETECTED' : 'NORMAL / CLEAN'}
            </span>
          </div>
        </div>
      </div>

      {/* Gas Concentration Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-4 text-xs shadow-xl">
        <Flame className="w-4 h-4 text-amber-400" />
        <span className="text-slate-300 font-medium">LPG / Smoke PPM:</span>
        <input
          type="range"
          min="50"
          max="800"
          value={gasPpm}
          onChange={(e) => updateHardwareState({ gasPpm: parseInt(e.target.value, 10) })}
          className="w-48 accent-red-500 cursor-pointer"
        />
        <span className="font-mono font-bold text-amber-400 w-16 text-right">{gasPpm} PPM</span>
      </div>
    </div>
  );
};

// ─── 18. CAPACITIVE SMART SOIL MOISTURE LAB ───────────────────────────
export const SoilLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { soilMoisturePct, relayActive, ledOn } = hardwareState;

  // Real actuator gated by simulation running state
  const isPumpOn = isRunning && (relayActive || ledOn);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Capacitive Probe & Plant Pot */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-24 bg-amber-950/80 border-2 border-amber-900 rounded-b-2xl p-2 flex flex-col justify-end items-center relative shadow-xl overflow-hidden">
            <Sprout className="w-10 h-10 text-emerald-400 -mt-6" />
            
            {/* Water droplet stream when irrigation pump active */}
            {isPumpOn && (
              <div
                data-water-flow
                className="absolute top-8 w-1.5 h-6 bg-sky-400 rounded-full animate-bounce pointer-events-none"
              />
            )}

            <div 
              className="w-full bg-blue-600/40 rounded-b-xl transition-all"
              style={{ height: `${soilMoisturePct}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">{soilMoisturePct.toFixed(0)}% Moisture</span>
        </div>

        {/* 12V Water Pump Indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-16 h-16 rounded-xl bg-slate-900 border-2 ${isPumpOn ? 'border-sky-500 shadow-lg shadow-sky-500/30' : 'border-slate-700'} flex items-center justify-center`}>
            <span className={`text-xs font-bold font-mono ${isPumpOn ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`}>
              {isPumpOn ? 'PUMP ACTIVE' : isRunning ? 'PUMP IDLE' : 'PUMP STANDBY'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">12V Water Pump</span>
        </div>

        {/* Irrigation Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[190px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Moisture:</span>
            <span className="font-mono font-bold text-sky-400">{soilMoisturePct.toFixed(1)} %</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Relay / Code:</span>
            <span className={`font-mono font-bold ${isPumpOn ? 'text-sky-400' : 'text-slate-400'}`}>
              {isPumpOn ? 'digitalWrite(RELAY, HIGH)' : isRunning ? 'digitalWrite(RELAY, LOW)' : 'STANDBY'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Relay State:</span>
            <span className={`font-mono font-bold ${isPumpOn ? 'text-sky-400' : 'text-slate-400'}`}>
              {isPumpOn ? 'ENERGIZED (WATERING)' : isRunning ? 'DE-ENERGIZED' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>

      {/* Soil Moisture Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-4 text-xs shadow-xl">
        <Sprout className="w-4 h-4 text-emerald-400" />
        <span className="text-slate-300 font-medium">Soil Moisture:</span>
        <input
          type="range"
          min="5"
          max="95"
          value={soilMoisturePct}
          onChange={(e) => updateHardwareState({ soilMoisturePct: parseFloat(e.target.value) })}
          className="w-48 accent-emerald-500 cursor-pointer"
        />
        <span className="font-mono font-bold text-emerald-400 w-14 text-right">{soilMoisturePct.toFixed(0)}%</span>
      </div>
    </div>
  );
};
