/**
 * Bottom-Center / Bottom-Left Collapsible Diagnostic Bar
 * Floating HUD housing the live Dual-Channel Oscilloscope & Serial Monitor.
 * Collapses to a slim 36px bar and expands smoothly to 240px height when active.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  ChevronUp, 
  ChevronDown
} from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { Oscilloscope } from './Oscilloscope';
import { SerialConsole } from './SerialConsole';

export const DiagnosticBar: React.FC = () => {
  const {
    codeHudOpen,
    codeHudMode,
    diagnosticDockOpen,
    setDiagnosticDockOpen,
    serialLogs
  } = useWorkbenchStore();

  const [activeTab, setActiveTab] = useState<'scope' | 'serial'>('scope');

  // If collapsed: show compact 36px floating bar
  if (!diagnosticDockOpen) {
    return (
      <div
        className={`absolute bottom-4 z-20 flex items-center gap-1.5 p-1 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-full shadow-2xl select-none transition-all duration-200 ${
          codeHudOpen && codeHudMode === 'cpp'
            ? 'left-[468px]'
            : codeHudOpen && codeHudMode === 'split'
            ? 'left-[64vw]'
            : 'left-4'
        }`}
      >
        <button
          onClick={() => {
            setActiveTab('scope');
            setDiagnosticDockOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Open Dual-Channel Oscilloscope"
        >
          <Activity className="w-3.5 h-3.5 text-sky-400 stroke-[2]" />
          <span>Oscilloscope</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('serial');
            setDiagnosticDockOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Open UART Serial Monitor"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
          <span>Serial Monitor</span>
          {serialLogs.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
              {serialLogs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setDiagnosticDockOpen(true)}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Expand Diagnostic HUD (▴)"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Expanded 240px Diagnostic HUD card
  return (
    <div
      className={`absolute bottom-4 z-20 w-[540px] max-w-[92vw] h-[240px] flex flex-col bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 select-none ${
        codeHudOpen && codeHudMode === 'cpp'
          ? 'left-[468px]'
          : codeHudOpen && codeHudMode === 'split'
          ? 'left-[64vw]'
          : 'left-4'
      }`}
    >
      {/* Header Bar */}
      <div className="h-8 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('scope')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              activeTab === 'scope'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Oscilloscope</span>
          </button>

          <button
            onClick={() => setActiveTab('serial')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              activeTab === 'serial'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Serial Monitor</span>
            {serialLogs.length > 0 && (
              <span className="text-[9px] font-mono px-1 rounded bg-slate-800">
                {serialLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Minimize Button */}
        <button
          onClick={() => setDiagnosticDockOpen(false)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Minimize Diagnostic HUD (▾)"
        >
          <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>

      {/* Body: Oscilloscope or Serial Monitor */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-slate-900">
        {activeTab === 'scope' ? (
          <Oscilloscope dockMode={true} />
        ) : (
          <SerialConsole dockMode={true} />
        )}
      </div>
    </div>
  );
};
