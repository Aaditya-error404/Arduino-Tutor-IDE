/**
 * About & License Modal
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React from 'react';
import { X, Award, Shield, Code2, Cpu, BookOpen } from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Cpu className="w-5 h-5 text-white stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">SparkByte Studio</h2>
              <p className="text-xs text-slate-400">Embedded Systems & ATL Simulation Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Version & Build */}
          <div className="flex items-center gap-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="text-center">
              <div className="text-2xl font-bold text-sky-400 font-mono">v2.0</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Release</div>
            </div>
            <div className="border-l border-slate-700 pl-4 text-sm text-slate-300 space-y-0.5">
              <p><span className="text-slate-500">Engine:</span> ATmega328P (avr8js) · 16MHz Cycle-Accurate</p>
              <p><span className="text-slate-500">Curriculum:</span> 22 ATL Labs · 88 Structured Lessons</p>
              <p><span className="text-slate-500">Build:</span> TypeScript + React + Vite + Zustand</p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard
              icon={<Code2 className="w-4 h-4 text-lime-400 stroke-[1.5]" />}
              title="Dual-Code Translator"
              desc="Plain English ↔ Arduino C++ with live execution gutter sync"
            />
            <FeatureCard
              icon={<Cpu className="w-4 h-4 text-sky-400 stroke-[1.5]" />}
              title="Cycle-Accurate CPU"
              desc="Real ATmega328P emulation with PORTB/PORTD/ADC/USART"
            />
            <FeatureCard
              icon={<BookOpen className="w-4 h-4 text-amber-400 stroke-[1.5]" />}
              title="88 Structured Lessons"
              desc="Grades 6–12 curriculum with pedagogical scaffolding"
            />
            <FeatureCard
              icon={<Shield className="w-4 h-4 text-indigo-400 stroke-[1.5]" />}
              title="Offline-First PWA"
              desc="Zero internet required · Works on school PCs & Chromebooks"
            />
          </div>

          {/* License */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400 stroke-[1.5]" />
              <span className="text-sm font-semibold text-slate-200">License & Attribution</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              © 2026 SparkByte Studio. All rights reserved.
              Engineered, designed, and licensed by <span className="text-white font-semibold">Aaditya Joshi</span>.
              This software is a commercially licensed educational platform for embedded systems instruction.
              Unauthorized reproduction, distribution, or modification is prohibited without written consent.
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Built with avr8js (MIT), @wokwi/elements (MIT), React (MIT), Monaco Editor (MIT),
              Zustand (MIT), Vite (MIT), Tailwind CSS (MIT), and Lucide Icons (ISC).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-600">
            © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-xs font-semibold text-slate-200">{title}</span>
    </div>
    <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
  </div>
);
