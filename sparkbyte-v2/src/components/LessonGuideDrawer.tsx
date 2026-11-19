/**
 * Slide-Over Lesson Guide & Wiring Drawer
 * Displays Mission Brief, Hardware Pinout Wiring Table, Concepts, and Teacher Insights.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Cpu,
  GraduationCap,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { LAB_MAP, ALL_LABS } from '../data/lessons';

export const LessonGuideDrawer: React.FC = () => {
  const {
    activeLabId,
    activeLessonId,
    lessonGuideOpen,
    setLessonGuideOpen,
    teacherMode,
    completedLessons
  } = useWorkbenchStore();

  if (!lessonGuideOpen) return null;

  const currentLab = LAB_MAP[activeLabId] || ALL_LABS[0];
  const currentLesson = currentLab?.lessons[activeLessonId - 1] || currentLab?.lessons[0];
  const isDone = completedLessons.includes(`${currentLab.id}-${activeLessonId}`);

  // Generate lab-specific hardware pinout wiring table
  const wiringSpec = getLabWiringSpec(activeLabId);

  return (
    <aside className="absolute left-0 top-0 bottom-0 w-[360px] bg-slate-950/95 backdrop-blur-md border-r border-slate-800/90 shadow-2xl z-40 flex flex-col select-none animate-in slide-in-from-left duration-200 font-sans">
      {/* Drawer Header */}
      <div className="h-11 px-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400 stroke-[2]" />
          <span className="font-bold text-xs text-slate-100 tracking-tight">
            Lesson Guide & Wiring Spec
          </span>
        </div>
        <button
          onClick={() => setLessonGuideOpen(false)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close Lesson Guide (Esc)"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
        {/* Lab & Lesson Title Card */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {currentLab.badge}
            </span>
            {isDone && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <CheckCircle className="w-3 h-3 stroke-[2]" /> Completed
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-100 leading-snug">
            {currentLesson.title}
          </h3>
          {currentLesson.subtitle && (
            <p className="text-[11px] text-slate-400 leading-normal">
              {currentLesson.subtitle}
            </p>
          )}
        </div>

        {/* Mascot Mission Prompt */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/40 via-indigo-950/20 to-slate-900 border border-blue-900/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-300 font-semibold text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 stroke-[2]" />
            <span>Mission Brief</span>
          </div>
          <p className="text-[11.5px] text-slate-300 leading-relaxed">
            {currentLesson.mascotMsg || currentLesson.summary}
          </p>
        </div>

        {/* Hardware Pinout Wiring Table */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
            <Cpu className="w-3.5 h-3.5 text-sky-400 stroke-[2]" />
            <span>Hardware Pinout & Connections</span>
          </div>
          <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-900/50">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                  <th className="py-1.5 px-2">Component</th>
                  <th className="py-1.5 px-2">Arduino Pin</th>
                  <th className="py-1.5 px-2">Signal Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[10.5px]">
                {wiringSpec.map((wire, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-1.5 px-2 text-slate-200 font-sans">{wire.component}</td>
                    <td className="py-1.5 px-2 text-sky-400 font-semibold">{wire.pin}</td>
                    <td className="py-1.5 px-2 text-slate-400">{wire.signal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Concept Pedagogy Notes */}
        {currentLesson.summary && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
              <Hash className="w-3.5 h-3.5 text-indigo-400 stroke-[2]" />
              <span>Engineering Concepts</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
              {currentLesson.summary}
            </p>
          </div>
        )}

        {/* Jargon Glossary */}
        {currentLesson.jargon && currentLesson.jargon.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-300">Technical Jargon:</span>
            <div className="space-y-1">
              {currentLesson.jargon.map((j, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px]">
                  <strong className="text-sky-300 font-mono">{j.word}:</strong>{' '}
                  <span className="text-slate-400">{j.definition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Concept Check Quiz */}
        <ConceptCheckQuiz labId={activeLabId} />

        {/* Teacher Insights (Visible when Teacher Mode is enabled) */}
        {teacherMode && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
              <GraduationCap className="w-4 h-4 stroke-[2]" />
              <span>Teacher Mode Insights</span>
            </div>
            {currentLesson.misconceptions && currentLesson.misconceptions.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[10.5px] font-semibold text-amber-200/90">Common Student Traps:</span>
                {currentLesson.misconceptions.map((m, idx) => (
                  <div key={idx} className="text-[10.5px] text-slate-300">
                    <div className="flex items-center gap-1 font-semibold text-rose-300">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{m.title}</span>
                    </div>
                    <p className="text-slate-400 pl-4">{m.detail}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10.5px] text-slate-400">
                Focus on students understanding synchronous line execution vs continuous loop recursion.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

function getLabWiringSpec(labId: string): Array<{ component: string; pin: string; signal: string }> {
  switch (labId) {
    case 'led':
      return [
        { component: 'Red LED Anode', pin: 'D13 (SCK)', signal: 'Digital Output (5V)' },
        { component: '220Ω Resistor', pin: 'Cathode → GND', signal: 'Current Limiter' }
      ];
    case 'servo':
      return [
        { component: 'SG90 Signal (Orange)', pin: 'D9 (~PWM)', signal: 'Timer1 PWM (50Hz)' },
        { component: 'SG90 Power (Red)', pin: '5V Rail', signal: '5.0V DC Power' },
        { component: 'SG90 Ground (Brown)', pin: 'GND Rail', signal: 'Common Ground' }
      ];
    case 'button':
      return [
        { component: 'Tactile Switch Pin 1', pin: 'D2 (INT0)', signal: 'Digital Input (Pullup)' },
        { component: 'Tactile Switch Pin 2', pin: 'GND Rail', signal: 'Active-Low Return' },
        { component: 'Indicator LED', pin: 'D13', signal: 'Digital Output' }
      ];
    case 'pot':
      return [
        { component: 'Pot Wiper (Center)', pin: 'A0', signal: 'Analog In (0–5V ADC)' },
        { component: 'Pot Terminal 1', pin: '5V Rail', signal: 'Reference High' },
        { component: 'Pot Terminal 2', pin: 'GND Rail', signal: 'Reference Low' },
        { component: 'Micro Servo', pin: 'D9 (~PWM)', signal: 'Mapped PWM Angle' }
      ];
    case 'buzzer':
      return [
        { component: 'Piezo Buzzer (+)', pin: 'D8', signal: 'Hardware Square Wave' },
        { component: 'Piezo Buzzer (-)', pin: 'GND Rail', signal: 'Common Ground' }
      ];
    case 'ldr':
      return [
        { component: 'LDR Photoresistor', pin: 'A1 + 10k Partner', signal: 'Voltage Divider ADC' },
        { component: 'Nightlight LED', pin: 'D13', signal: 'Digital Output' }
      ];
    case 'rgb':
      return [
        { component: 'Red Channel', pin: 'D9 (~PWM)', signal: 'PWM (0–255)' },
        { component: 'Green Channel', pin: 'D10 (~PWM)', signal: 'PWM (0–255)' },
        { component: 'Blue Channel', pin: 'D11 (~PWM)', signal: 'PWM (0–255)' }
      ];
    case 'temp':
      return [
        { component: 'TMP36 Vout', pin: 'A0', signal: 'Analog ADC (10mV/°C)' },
        { component: 'Cooling Fan Transistor', pin: 'D6 (~PWM)', signal: 'PWM Gate' }
      ];
    case 'sonar':
      return [
        { component: 'HC-SR04 Trig', pin: 'D11', signal: '10µs Ultrasonic Pulse' },
        { component: 'HC-SR04 Echo', pin: 'D12', signal: 'Pulse Width (µs / 58)' }
      ];
    case 'lcd':
      return [
        { component: 'PCF8574 SDA', pin: 'A4 (SDA)', signal: 'I2C Serial Data' },
        { component: 'PCF8574 SCL', pin: 'A5 (SCL)', signal: 'I2C Serial Clock' }
      ];
    case 'motor':
      return [
        { component: 'L298N IN1 / IN2', pin: 'D4, D5', signal: 'Direction Logic' },
        { component: 'L298N ENA (PWM)', pin: 'D3 (~PWM)', signal: 'Speed Control (0–255)' }
      ];
    default:
      return [
        { component: 'Primary Sensor', pin: 'A0 / D2', signal: 'Input Signal' },
        { component: 'Actuator / Status', pin: 'D13 / D9', signal: 'Output Signal' },
        { component: 'Power Supply', pin: '5V & GND', signal: 'DC Power Rail' }
      ];
  }
}

const QUIZ_BANK: Record<string, { question: string; options: string[]; answer: number; explanation: string }> = {
  led: {
    question: "Why do we wire a 220Ω resistor in series with the LED on Pin 13?",
    options: [
      "To increase current and make the LED shine brighter",
      "To limit forward current and protect the LED & ATmega328P from burning out",
      "To step down 220V AC house power into 5V DC"
    ],
    answer: 1,
    explanation: "At 5V, an unballasted LED draws excessive current (>100mA), blowing the Uno GPIO pin limit of 40mA. A 220Ω resistor limits current to safe 15-20mA."
  },
  servo: {
    question: "What control signal does an SG90 servo motor expect on Pin 9?",
    options: [
      "50Hz PWM pulse train where pulse width (1.0ms–2.0ms) sets the angle",
      "Variable pure DC voltage between 0V and 12V",
      "High-speed SPI serial communication packets"
    ],
    answer: 0,
    explanation: "Standard hobby servos use 50Hz PWM: a 1.0ms pulse commands 0°, 1.5ms commands 90° center, and 2.0ms commands 180° full scale."
  },
  button: {
    question: "What is the danger of setting a pushbutton pin to INPUT instead of INPUT_PULLUP?",
    options: [
      "The button will explode under high current",
      "The pin floats, picking up electromagnetic noise and randomly fluctuating between 0 and 1",
      "The microcontroller clock speed is cut in half"
    ],
    answer: 1,
    explanation: "An un-pulled INPUT has ~100MΩ impedance and acts like an antenna. INPUT_PULLUP activates the internal 20kΩ pullup to +5V."
  },
  pot: {
    question: "What does the 10-bit ADC value 512 represent when reading Pin A0?",
    options: [
      "Exactly 512 Volts AC",
      "Half scale voltage (~2.50 Volts DC out of 5.0V)",
      "512 milliampere electric current"
    ],
    answer: 1,
    explanation: "The ATmega328P ADC has 10 bits (0–1023). 512 is 50% of 1023, representing exactly half of the 5V reference: ~2.50V."
  },
  buzzer: {
    question: "What is the key difference between an Active Buzzer and a Passive Piezo Speaker?",
    options: [
      "Passive buzzers require an oscillating frequency wave (tone()), while active buzzers generate sound on steady DC",
      "Active buzzers cannot make sound under 5V",
      "Passive buzzers have internal oscillators"
    ],
    answer: 0,
    explanation: "Active buzzers have an internal oscillator (just apply 5V). Passive piezos require square-wave frequencies from tone(pin, freq) to create musical notes."
  },
  dmm: {
    question: "When measuring continuity with a Digital Multimeter, what does a beep mean?",
    options: [
      "A complete, unbroken low-resistance conductive path (< 50Ω)",
      "High voltage is dangerous",
      "An open circuit with infinite resistance"
    ],
    answer: 0,
    explanation: "Continuity mode beeps to confirm continuous copper traces or good solder joints with zero or negligible resistance."
  },
  temp: {
    question: "For a TMP36 / LM35 analog temperature sensor, how do we convert voltage to °C?",
    options: [
      "Multiply voltage by 1000",
      "(Voltage in Volts - 0.5V) × 100 = Temperature in °C",
      "Temperature is always equal to raw ADC reading"
    ],
    answer: 1,
    explanation: "The TMP36 has a 500mV offset (for sub-zero readings) and outputs 10mV per degree Celsius: (V - 0.5) * 100."
  }
};

const DEFAULT_QUIZ = {
  question: "What is the primary function of void loop() in an Arduino sketch?",
  options: [
    "It runs once during bootup and then powers off the chip",
    "It repeats continuously at 16 MHz as long as the board has power",
    "It checks if an external computer is connected via USB"
  ],
  answer: 1,
  explanation: "void loop() is the continuous execution loop. Once void setup() finishes, the microcontroller executes loop() over and over indefinitely."
};

const ConceptCheckQuiz: React.FC<{ labId: string }> = ({ labId }) => {
  const quiz = QUIZ_BANK[labId] || DEFAULT_QUIZ;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Reset selection when lab changes
  React.useEffect(() => {
    setSelectedIdx(null);
  }, [labId]);

  return (
    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Interactive Concept Check</span>
      </div>
      <p className="text-[11.5px] font-semibold text-slate-200 leading-snug">
        {quiz.question}
      </p>
      <div className="space-y-1.5">
        {quiz.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === quiz.answer;
          let btnStyle = "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700/60";

          if (selectedIdx !== null) {
            if (isCorrect) {
              btnStyle = "bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-semibold";
            } else if (isSelected) {
              btnStyle = "bg-rose-950/80 border-rose-500/80 text-rose-200";
            } else {
              btnStyle = "bg-slate-900/40 text-slate-500 border-slate-800/40 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-2 rounded-lg border text-[11px] leading-tight transition-all ${btnStyle}`}
            >
              <div className="flex items-start gap-1.5">
                <span className="font-mono font-bold shrink-0">{String.fromCharCode(65 + idx)}.</span>
                <span>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedIdx !== null && (
        <div className={`p-2 rounded-lg text-[10.5px] leading-relaxed border ${
          selectedIdx === quiz.answer 
            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200" 
            : "bg-amber-950/60 border-amber-500/40 text-amber-200"
        }`}>
          <strong>{selectedIdx === quiz.answer ? "🎉 Correct!" : "💡 Almost!"}</strong> {quiz.explanation}
        </div>
      )}
    </div>
  );
};
