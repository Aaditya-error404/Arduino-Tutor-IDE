/**
 * Basics Labs Components (Level 1: Grades 6-8)
 * Labs: LED, Servo, Button, Potentiometer, Buzzer, Digital Multimeter
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState, useEffect } from 'react';
import { useWorkbenchStore } from '../../store/useWorkbenchStore';
import { Compass, Volume2, VolumeX, SlidersHorizontal, ToggleLeft, Activity, Lightbulb } from 'lucide-react';
import { buzzerAudio } from '../../engine/audioEngine';
export { buzzerAudio };

// ─── 1. LED DIGITAL BLINK & PWM FADER LAB ─────────────────────────────
export const LedLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { ledOn, pwmDuty, ledColor, currentMa } = hardwareState;

  const isLit = isRunning ? (ledOn || pwmDuty > 0) : false;
  const dutyPct = Math.round((pwmDuty / 255) * 100);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-8 mb-6">
        {/* Wokwi LED Component */}
        <div className="flex flex-col items-center gap-2">
          <wokwi-led
            color={ledColor || 'red'}
            value={isLit}
            brightness={isLit ? (pwmDuty > 0 ? pwmDuty / 255 : 1.0) : 0.0}
            label="D13"
          />
          <span className="text-xs font-mono font-bold text-slate-300">
            Pin 13 LED ({isLit ? (pwmDuty > 0 ? `${dutyPct}% PWM` : 'HIGH') : isRunning ? 'LOW' : 'STANDBY'})
          </span>
        </div>

        {/* 220Ω Resistor */}
        <div className="flex flex-col items-center gap-2">
          <wokwi-resistor value="220" />
          <span className="text-[10px] font-mono text-slate-400">220Ω Limiter</span>
        </div>

        {/* Telemetry Display */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[150px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">State:</span>
            <span className={`font-mono font-bold ${isLit ? 'text-red-400' : 'text-slate-500'}`}>
              {isLit ? 'CONDUCTION' : isRunning ? 'CUTOFF' : 'STANDBY'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Current:</span>
            <span className="font-mono font-bold text-amber-400">{isLit ? currentMa.toFixed(1) : '0.0'} mA</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">PWM Duty:</span>
            <span className="font-mono font-bold text-sky-400">{pwmDuty}/255 ({dutyPct}%)</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs shadow-xl">
        <button
          onClick={() => updateHardwareState({ ledOn: !ledOn, pwmDuty: ledOn ? 0 : 255 })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            ledOn ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Toggle Pin 13</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">PWM:</span>
          <input
            type="range"
            min="0"
            max="255"
            value={pwmDuty}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              updateHardwareState({ pwmDuty: val, ledOn: val > 0 });
            }}
            className="w-28 accent-red-500 cursor-pointer"
          />
          <span className="font-mono text-slate-300 w-8">{pwmDuty}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Color:</span>
          {['#ef4444', '#22c55e', '#3b82f6', '#eab308'].map((c) => (
            <button
              key={c}
              onClick={() => updateHardwareState({ ledColor: c })}
              className={`w-4 h-4 rounded-full border transition-transform ${ledColor === c ? 'scale-125 border-white' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 2. SG90 MICRO SERVO LAB ──────────────────────────────────────────
export const ServoLabView: React.FC = () => {
  const { hardwareState, updateHardwareState } = useWorkbenchStore();
  const { servoAngle, servoPulseWidthMs, currentMa } = hardwareState;

  const presets = [0, 45, 90, 135, 180];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Wokwi Servo Element */}
        <div className="flex flex-col items-center gap-2">
          <wokwi-servo
            angle={servoAngle}
            hornColor="#f8fafc"
          />
          <span className="text-xs font-mono font-bold text-sky-400">
            SG90 Angle: {Math.round(servoAngle)}°
          </span>
        </div>

        {/* Kinematics Telemetry Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[180px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Angle:</span>
            <span className="font-mono font-bold text-sky-400">{Math.round(servoAngle)}°</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Pulse Width:</span>
            <span className="font-mono font-bold text-amber-400">{servoPulseWidthMs.toFixed(2)} ms</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">PWM Period:</span>
            <span className="font-mono font-bold text-slate-300">20.0 ms (50Hz)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Draw Current:</span>
            <span className="font-mono font-bold text-emerald-400">{currentMa.toFixed(0)} mA</span>
          </div>
        </div>
      </div>

      {/* Interactive Steering & Presets Drawer */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs shadow-xl">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-400" />
          <span className="text-slate-300 font-medium">Angle:</span>
          <input
            type="range"
            min="0"
            max="180"
            value={servoAngle}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              updateHardwareState({
                servoAngle: val,
                servoTargetAngle: val,
                servoPulseWidthMs: 1.0 + (val / 180.0) * 1.0,
                currentMa: 180.0
              });
            }}
            className="w-36 accent-sky-400 cursor-pointer"
          />
          <span className="font-mono font-bold text-sky-400 w-9 text-right">{Math.round(servoAngle)}°</span>
        </div>

        <div className="flex items-center gap-1">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => updateHardwareState({
                servoAngle: p,
                servoTargetAngle: p,
                servoPulseWidthMs: 1.0 + (p / 180.0) * 1.0,
                currentMa: 180.0
              })}
              className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-all ${
                Math.round(servoAngle) === p ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p}°
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 3. TACTILE PUSHBUTTON LAB ────────────────────────────────────────
export const ButtonLabView: React.FC = () => {
  const { hardwareState, updateHardwareState } = useWorkbenchStore();
  const { buttonPressed, ledOn } = hardwareState;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Wokwi Pushbutton */}
        <div className="flex flex-col items-center gap-2">
          <div
            onMouseDown={() => updateHardwareState({ buttonPressed: true })}
            onMouseUp={() => updateHardwareState({ buttonPressed: false })}
            onMouseLeave={() => updateHardwareState({ buttonPressed: false })}
            onTouchStart={() => updateHardwareState({ buttonPressed: true })}
            onTouchEnd={() => updateHardwareState({ buttonPressed: false })}
            className="cursor-pointer active:scale-95 transition-transform"
          >
            <wokwi-pushbutton
              color="blue"
              pressed={buttonPressed}
              label="Pin 2"
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            {buttonPressed ? 'PRESSED (LOW)' : 'RELEASED (HIGH / Pull-Up)'}
          </span>
        </div>

        {/* Response LED */}
        <div className="flex flex-col items-center gap-2">
          <wokwi-led
            color="green"
            value={ledOn}
            label="Pin 13"
          />
          <span className="text-[11px] font-mono text-slate-400">
            Indicator LED: {ledOn ? 'HIGH (ON)' : 'LOW (OFF)'}
          </span>
        </div>

        {/* Digital Logic Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5 min-w-[170px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Mode:</span>
            <span className="font-mono text-sky-400 font-bold">INPUT_PULLUP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Pin 2 Logic:</span>
            <span className={`font-mono font-bold ${buttonPressed ? 'text-blue-400' : 'text-emerald-400'}`}>
              {buttonPressed ? 'LOW (0V)' : 'HIGH (5V)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Code Output:</span>
            <span className={`font-mono font-bold ${ledOn ? 'text-emerald-400' : 'text-slate-500'}`}>
              {ledOn ? 'digitalWrite(13, HIGH)' : 'digitalWrite(13, LOW)'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Trigger Button */}
      <button
        onMouseDown={() => updateHardwareState({ buttonPressed: true })}
        onMouseUp={() => updateHardwareState({ buttonPressed: false })}
        onMouseLeave={() => updateHardwareState({ buttonPressed: false })}
        onTouchStart={() => updateHardwareState({ buttonPressed: true })}
        onTouchEnd={() => updateHardwareState({ buttonPressed: false })}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg select-none ${
          buttonPressed
            ? 'bg-blue-600 text-white shadow-blue-500/40 scale-95'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
        }`}
      >
        <ToggleLeft className="w-4 h-4" />
        <span>Click / Hold to Press Button</span>
      </button>
    </div>
  );
};

// ─── 4. POTENTIOMETER ANALOG LAB ──────────────────────────────────────
export const PotLabView: React.FC = () => {
  const { hardwareState, updateHardwareState } = useWorkbenchStore();
  const { potVal } = hardwareState;

  const voltage = +((potVal / 1023.0) * 5.0).toFixed(2);
  const mappedPWM = Math.round((potVal / 1023.0) * 255);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Wokwi Potentiometer */}
        <div className="flex flex-col items-center gap-2">
          <wokwi-potentiometer
            value={potVal}
            min={0}
            max={1023}
          />
          <span className="text-xs font-mono font-bold text-sky-400">
            A0 Wiper: {potVal}
          </span>
        </div>

        {/* ADC Conversion Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[190px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">ADC 10-Bit:</span>
            <span className="font-mono font-bold text-sky-400">{potVal} / 1023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Analog Voltage:</span>
            <span className="font-mono font-bold text-amber-400">{voltage} V</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Mapped 8-bit PWM:</span>
            <span className="font-mono font-bold text-emerald-400">{mappedPWM} / 255</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Resolution:</span>
            <span className="font-mono text-slate-300">4.88 mV / step</span>
          </div>
        </div>
      </div>

      {/* Interactive Wiper Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex items-center gap-4 text-xs shadow-xl">
        <SlidersHorizontal className="w-4 h-4 text-sky-400" />
        <span className="text-slate-300 font-medium">Turn Wiper:</span>
        <input
          type="range"
          min="0"
          max="1023"
          value={potVal}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            updateHardwareState({ potVal: val });
          }}
          className="w-48 accent-sky-400 cursor-pointer"
        />
        <span className="font-mono font-bold text-sky-400 w-12 text-right">{potVal}</span>
        <span className="font-mono text-amber-400 font-semibold">({voltage}V)</span>
      </div>
    </div>
  );
};

// ─── 5. PIEZO BUZZER & SOUND WAVE LAB ─────────────────────────────────
export const BuzzerLabView: React.FC = () => {
  const { hardwareState, updateHardwareState, isRunning } = useWorkbenchStore();
  const { buzzerActive, buzzerToneFreq } = hardwareState;
  const [audioMuted, setAudioMuted] = useState(false);
  const [activeNoteName, setActiveNoteName] = useState<string | null>(null);

  const isBuzzerSounding = (isRunning && buzzerActive) || activeNoteName !== null;

  useEffect(() => {
    buzzerAudio.setEnabled(!audioMuted);
    if (isRunning && buzzerActive && !audioMuted && buzzerToneFreq > 0) {
      buzzerAudio.playTone(buzzerToneFreq);
    } else if (!activeNoteName) {
      buzzerAudio.stopTone();
    }
    return () => {
      buzzerAudio.stopTone();
    };
  }, [buzzerActive, buzzerToneFreq, audioMuted, isRunning, activeNoteName]);

  const notes = [
    { name: 'C4', key: 'A', freq: 262 },
    { name: 'D4', key: 'S', freq: 294 },
    { name: 'E4', key: 'D', freq: 330 },
    { name: 'F4', key: 'F', freq: 349 },
    { name: 'G4', key: 'G', freq: 392 },
    { name: 'A4', key: 'H', freq: 440 },
    { name: 'B4', key: 'J', freq: 494 },
    { name: 'C5', key: 'K', freq: 523 }
  ];

  const playNote = (note: { name: string; key: string; freq: number }) => {
    if (audioMuted) return;
    setActiveNoteName(note.name);
    buzzerAudio.playNote(note.freq, 280);
    updateHardwareState({ buzzerToneFreq: note.freq, buzzerActive: true });
    setTimeout(() => {
      setActiveNoteName((curr) => (curr === note.name ? null : curr));
      if (!isRunning) {
        updateHardwareState({ buzzerActive: false });
      }
    }, 280);
  };

  // Keyboard Piano Keybindings (A, S, D, F, G, H, J, K or 1..8)
  useEffect(() => {
    const handlePianoKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const activeEl = document.activeElement as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable ||
        target?.closest('.monaco-editor') !== null ||
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.isContentEditable ||
        activeEl?.closest('.monaco-editor') !== null;

      if (isTyping) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const keyUpper = e.key.toUpperCase();
      const noteMap: Record<string, typeof notes[0]> = {
        'A': notes[0], '1': notes[0],
        'S': notes[1], '2': notes[1],
        'D': notes[2], '3': notes[2],
        'F': notes[3], '4': notes[3],
        'G': notes[4], '5': notes[4],
        'H': notes[5], '6': notes[5],
        'J': notes[6], '7': notes[6],
        'K': notes[7], '8': notes[7],
      };

      const matched = noteMap[keyUpper];
      if (matched) {
        e.preventDefault();
        playNote(matched);
      }
    };
    window.addEventListener('keydown', handlePianoKey);
    return () => window.removeEventListener('keydown', handlePianoKey);
  }, [isRunning, audioMuted]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* Wokwi Buzzer */}
        <div className="flex flex-col items-center gap-2 relative">
          <wokwi-buzzer hasSignal={isBuzzerSounding} />
          {/* Animated sound compression waves */}
          {isBuzzerSounding && (
            <div data-sound-wave className="sound-wave absolute -top-4 -right-4 flex items-center justify-center pointer-events-none">
              <span className="w-12 h-12 rounded-full border-2 border-amber-400 animate-ping absolute opacity-75" />
              <span className="w-16 h-16 rounded-full border border-amber-300 animate-ping absolute opacity-50" />
            </div>
          )}
          <span className="text-xs font-mono font-bold text-slate-300">
            {isBuzzerSounding ? `${buzzerToneFreq} Hz Acoustic Wave` : isRunning ? 'Silent (Awaiting tone())' : 'Standby (Play with keys A-K)'}
          </span>
        </div>

        {/* Audio Frequency Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[180px] text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Audio State:</span>
            <span className={`font-mono font-bold ${isBuzzerSounding ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`}>
              {isBuzzerSounding ? 'SOUND ON' : audioMuted ? 'MUTED' : isRunning ? 'IDLE' : 'STANDBY'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Frequency:</span>
            <span className="font-mono font-bold text-sky-400">{isBuzzerSounding ? (buzzerToneFreq || 440) : 0} Hz</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Waveform:</span>
            <span className="font-mono text-emerald-400">{isBuzzerSounding ? '50% Square Wave' : 'Flatline (0V)'}</span>
          </div>
        </div>
      </div>

      {/* Musical Keyboard Notes & Frequency Slider */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 text-xs shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-medium">Musical Keyboard Presets:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              title={audioMuted ? 'Unmute Speaker' : 'Mute Speaker'}
              className={`p-1.5 rounded transition-all ${
                audioMuted ? 'bg-red-900/60 text-red-400 border border-red-700' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {audioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                if (buzzerActive) {
                  buzzerAudio.stopTone();
                  updateHardwareState({ buzzerActive: false });
                } else {
                  buzzerAudio.playTone(440);
                  updateHardwareState({ buzzerToneFreq: 440, buzzerActive: true });
                }
              }}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                buzzerActive ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {buzzerActive ? 'Mute' : 'Test Tone'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {notes.map((n) => {
            const isPressed = activeNoteName === n.name || (buzzerToneFreq === n.freq && buzzerActive);
            return (
              <button
                key={n.name}
                onClick={() => playNote(n)}
                className={`py-2 px-1 rounded font-mono text-center transition-all ${
                  isPressed
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/40 ring-2 ring-amber-400 transform scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold'
                }`}
              >
                <div className="text-xs">{n.name}</div>
                <div className="text-[9px] text-amber-400 font-semibold mt-0.5">[{n.key}]</div>
                <div className="text-[8px] text-slate-400 font-normal">{n.freq}</div>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-400 text-center font-mono pt-1 border-t border-slate-800/80">
          Tip: Press keys <span className="text-amber-400 font-bold">[A, S, D, F, G, H, J, K]</span> or <span className="text-amber-400 font-bold">[1-8]</span> on your keyboard to play notes!
        </div>
      </div>
    </div>
  );
};

// ─── 7. DIGITAL MULTIMETER (DMM) LAB ──────────────────────────────────
export const DmmLabView: React.FC = () => {
  const { hardwareState, isRunning } = useWorkbenchStore();
  const [dmmMode, setDmmMode] = React.useState<'DCV' | 'DCA' | 'OHM' | 'CONT'>('DCV');
  const [testNode, setTestNode] = React.useState<'pin13' | 'rail5v' | 'resistor220' | 'gnd'>('pin13');

  const { ledOn, currentMa, pwmDuty = 0 } = hardwareState;
  const isCircuitPowered = isRunning;

  // Real circuit-coupled electrical diagnostics
  let reading = '';
  let nodeName = 'Pin 13 Output';

  if (testNode === 'pin13') {
    nodeName = 'Pin 13 Anode';
    if (!isCircuitPowered) {
      if (dmmMode === 'DCV') reading = '0.00 V (OFF)';
      else if (dmmMode === 'DCA') reading = '0.0 mA';
      else if (dmmMode === 'OHM') reading = '35.4 kΩ';
      else reading = 'OPEN (O.L)';
    } else {
      if (dmmMode === 'DCV') reading = ledOn ? '4.98 V' : '0.02 V';
      else if (dmmMode === 'DCA') reading = ledOn ? `${currentMa.toFixed(1)} mA` : '0.0 mA';
      else if (dmmMode === 'OHM') reading = ledOn ? '1.2 MΩ (Active)' : '35.4 kΩ';
      else reading = 'OPEN (O.L)';
    }
  } else if (testNode === 'rail5v') {
    nodeName = '5V Supply Rail';
    if (!isCircuitPowered) {
      if (dmmMode === 'DCV') reading = '0.00 V (OFF)';
      else if (dmmMode === 'DCA') reading = '0.0 mA';
      else if (dmmMode === 'OHM') reading = '12.4 kΩ';
      else reading = 'OPEN (O.L)';
    } else {
      if (dmmMode === 'DCV') reading = '5.01 V';
      else if (dmmMode === 'DCA') reading = '450.0 mA (Fused)';
      else if (dmmMode === 'OHM') reading = '12.4 kΩ';
      else reading = 'OPEN (O.L)';
    }
  } else if (testNode === 'resistor220') {
    nodeName = '220Ω Current Limiter';
    if (!isCircuitPowered) {
      if (dmmMode === 'DCV') reading = '0.00 V';
      else if (dmmMode === 'DCA') reading = '0.0 mA';
      else if (dmmMode === 'OHM') reading = '220.2 Ω';
      else reading = 'BEEP (220 Ω)';
    } else {
      if (dmmMode === 'DCV') reading = ledOn ? '2.14 V (Drop)' : '0.00 V';
      else if (dmmMode === 'DCA') reading = ledOn ? `${currentMa.toFixed(1)} mA` : '0.0 mA';
      else if (dmmMode === 'OHM') reading = '220.2 Ω';
      else reading = 'BEEP (220 Ω)';
    }
  } else if (testNode === 'gnd') {
    nodeName = 'Chassis / Arduino GND';
    if (dmmMode === 'DCV') reading = '0.00 V';
    else if (dmmMode === 'DCA') reading = '0.0 mA';
    else if (dmmMode === 'OHM') reading = '0.1 Ω';
    else reading = 'BEEP (0.1 Ω SHORT)';
  }

  const isProbingCurrent = isRunning && (
    (testNode === 'pin13' && (ledOn || pwmDuty > 0)) ||
    (testNode === 'rail5v') ||
    (testNode === 'resistor220' && (ledOn || pwmDuty > 0)) ||
    (currentMa > 0.0)
  );

  React.useEffect(() => {
    if (dmmMode === 'CONT' && reading.includes('BEEP')) {
      buzzerAudio.playTone(2400); // 2.4 kHz standard DMM continuity beeper
    } else {
      buzzerAudio.stopTone();
    }
    return () => {
      buzzerAudio.stopTone();
    };
  }, [dmmMode, reading]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 relative">
      <div className="flex items-center gap-10 mb-6">
        {/* DMM Hardware Chassis */}
        <div className="w-56 bg-amber-500 rounded-2xl p-3 border-4 border-amber-600 shadow-2xl flex flex-col items-center gap-3 relative">
          {/* LCD Screen */}
          <div className="w-full bg-emerald-950/80 border-2 border-emerald-800 rounded-lg p-2.5 font-mono text-right shadow-inner">
            <div className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider flex justify-between">
              <span>{dmmMode} MODE</span>
              <span className={isRunning ? 'text-emerald-400' : 'text-slate-500'}>{isRunning ? 'PWR ON' : 'STANDBY'}</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-wider">{reading}</div>
          </div>

          {/* Mode Selector Buttons */}
          <div className="grid grid-cols-2 gap-1.5 w-full">
            {(['DCV', 'DCA', 'OHM', 'CONT'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setDmmMode(m)}
                className={`py-1 rounded font-mono font-bold text-xs transition-all ${
                  dmmMode === m ? 'bg-slate-900 text-amber-400 shadow' : 'bg-amber-600 text-slate-950 hover:bg-amber-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Test Lead Terminals with current animation */}
          <div className="flex justify-around w-full pt-1">
            <div className="flex flex-col items-center gap-1 relative">
              <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-slate-900 relative">
                {isProbingCurrent && (
                  <div
                    data-dmm-current
                    className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"
                  />
                )}
              </div>
              <span className="text-[9px] font-bold text-slate-900">V/Ω (RED)</span>
            </div>
            <div className="flex flex-col items-center gap-1 relative">
              <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-700 relative">
                {isRunning && (
                  <div className="absolute inset-0 rounded-full bg-slate-400 animate-pulse opacity-50" />
                )}
              </div>
              <span className="text-[9px] font-bold text-slate-900">COM (BLK)</span>
            </div>
          </div>
        </div>

        {/* Circuit Test Point Info */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 min-w-[190px] text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Activity className="w-4 h-4" />
            <span>Test Point Diagnostics:</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Node Tested:</span>
            <span className="font-mono text-slate-200">{nodeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Power State:</span>
            <span className={`font-mono font-bold ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isRunning ? 'CIRCUIT ACTIVE' : 'UNPOWERED'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Measured Value:</span>
            <span className="font-mono font-bold text-emerald-400">{reading}</span>
          </div>
        </div>
      </div>

      {/* Test Node Selector Pills */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-2 text-xs shadow-xl">
        <span className="text-slate-400 font-medium mr-1">Probe Node:</span>
        {[
          { id: 'pin13', label: 'Pin 13 Output' },
          { id: 'rail5v', label: '5V Rail' },
          { id: 'resistor220', label: '220Ω Resistor' },
          { id: 'gnd', label: 'GND Continuity' }
        ].map((node) => (
          <button
            key={node.id}
            onClick={() => setTestNode(node.id as any)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
              testNode === node.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {node.label}
          </button>
        ))}
      </div>
    </div>
  );
};
