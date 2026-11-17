/**
 * Unified Workbench Bottom Dock
 * Hosts Oscilloscope, Serial Monitor, and Sparky AI Coach with 1-click tab switching.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useMemo } from 'react';
import { Activity, Terminal, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { Oscilloscope } from './Oscilloscope';
import { SerialConsole } from './SerialConsole';
import { AiCoachPanel } from './AiCoachPanel';
import { runDeterministicDiagnostics } from '../engine/aiCoachEngine';
import { LAB_MAP } from '../data/lessons';

export const WorkbenchDock: React.FC = () => {
  const {
    activeDockTab,
    setActiveDockTab,
    activeLabId,
    activeLessonId,
    customCode,
    isRunning,
    isPaused,
    loopCount,
    hardwareState,
    serialLogs
  } = useWorkbenchStore();

  const currentLab = LAB_MAP[activeLabId] || Object.values(LAB_MAP)[0];
  const currentLesson = currentLab?.lessons[activeLessonId - 1] || currentLab?.lessons[0];
  const currentCpp = customCode !== null ? customCode : currentLesson.defaultCode.cpp;

  // Run quick background diagnostics to display badge if issues detected
  const diag = useMemo(() => {
    return runDeterministicDiagnostics({
      activeLabId,
      activeLabTitle: currentLab.title,
      activeLabCategory: currentLab.category,
      gradeBand: currentLab.grade,
      activeLessonId,
      activeLessonTitle: currentLesson.title,
      activeLessonSummary: currentLesson.summary || '',
      defaultCpp: currentLesson.defaultCode.cpp,
      currentCpp,
      isRunning,
      isPaused,
      loopCount,
      hardwareState,
      serialLogs
    });
  }, [activeLabId, activeLessonId, currentCpp, isRunning, hardwareState]);

  const errorCount = diag.issues.filter((i) => i.severity === 'error').length;
  const warningCount = diag.issues.filter((i) => i.severity === 'warning').length;

  return (
    <div className="h-[270px] bg-slate-900 border-t border-slate-800 flex flex-col min-h-0 select-none z-10 shrink-0">
      {/* Dock Navigation Tab Strip */}
      <div className="h-8 px-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1">
          {/* Tab 1: Oscilloscope */}
          <button
            onClick={() => setActiveDockTab('scope')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs font-semibold border-b-2 transition-all ${
              activeDockTab === 'scope'
                ? 'border-sky-400 text-sky-300 bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-400 stroke-[2]" />
            <span>Oscilloscope</span>
          </button>

          {/* Tab 2: Serial Monitor */}
          <button
            onClick={() => setActiveDockTab('serial')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs font-semibold border-b-2 transition-all ${
              activeDockTab === 'serial'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
            <span>Serial Monitor</span>
            {serialLogs.length > 0 && (
              <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                {serialLogs.length}
              </span>
            )}
          </button>

          {/* Tab 3: Sparky AI Coach */}
          <button
            onClick={() => setActiveDockTab('coach')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs font-semibold border-b-2 transition-all relative ${
              activeDockTab === 'coach'
                ? 'border-violet-400 text-violet-300 bg-slate-900/90 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-violet-400 stroke-[2]" />
            <span>Sparky AI Coach</span>
            {errorCount > 0 ? (
              <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-mono animate-pulse">
                <AlertCircle className="w-2.5 h-2.5" />
                {errorCount}
              </span>
            ) : warningCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-mono">
                {warningCount}
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        {/* Right Status Pill */}
        <div className="flex items-center gap-2 pr-1">
          {activeDockTab === 'coach' ? (
            <span className="text-[10px] font-mono text-violet-400 flex items-center gap-1 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
              <Sparkles className="w-3 h-3 text-amber-400 stroke-[2]" />
              Socratic Guidance Active
            </span>
          ) : activeDockTab === 'scope' ? (
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              Dual-Channel 5V Probe
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              AVRUSART 9600 Baud
            </span>
          )}
        </div>
      </div>

      {/* Dock Content Body */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-slate-900">
        {activeDockTab === 'scope' && <Oscilloscope dockMode={true} />}
        {activeDockTab === 'serial' && <SerialConsole dockMode={true} />}
        {activeDockTab === 'coach' && <AiCoachPanel className="h-full" />}
      </div>
    </div>
  );
};
