/**
 * Industrial-Grade Top Telemetry Header
 * Fixed 40px height with machined geometry, tabular telemetry, and zero marketing fluff.
 *
 * Anti-"AI Slop" Visual Discipline:
 * - 1px hairline borders (#27272A)
 * - Elevated Header background (#18181B)
 * - Strict 2px rounded corners (rounded-sm)
 * - Tabular numbers (JetBrains Mono)
 */

import React from 'react';
import {
  Cpu,
  CheckCircle,
  Play,
  Square,
  RotateCcw,
  ChevronDown,
  PanelLeft,
  PanelBottom,
  PanelRight,
  Search
} from 'lucide-react';
import { LabSpec, LessonSpec } from '../data/mockCurriculum';

interface TopBarProps {
  currentLab: LabSpec;
  currentLesson: LessonSpec;
  isRunning: boolean;
  isPaused: boolean;
  virtualTimeMs: number;
  onRunSimulation: () => void;
  onStopSimulation: () => void;
  onResetSimulation: () => void;
  onVerifyCode: () => void;
  onOpenCurriculumDrawer?: () => void;
  isVerifying?: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  consoleOpen?: boolean;
  onToggleConsole?: () => void;
  cadViewportOpen?: boolean;
  onToggleCadViewport?: () => void;
  onOpenCommandPalette?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLab,
  currentLesson,
  isRunning,
  virtualTimeMs,
  onRunSimulation,
  onStopSimulation,
  onResetSimulation,
  onVerifyCode,
  onOpenCurriculumDrawer,
  isVerifying = false,
  sidebarOpen = true,
  onToggleSidebar,
  consoleOpen = true,
  onToggleConsole,
  cadViewportOpen = true,
  onToggleCadViewport,
  onOpenCommandPalette
}) => {
  // Format virtual time into mm:ss.ms (tabular format)
  const formatTime = (ms: number): string => {
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}s`;
  };

  return (
    <header className="h-[40px] bg-[#18181B] border-b border-[#27272A] px-3 flex items-center justify-between z-30 select-none shrink-0 font-sans text-xs">
      {/* ─────────────────────────────────────────────────────────────
          LEFT: Brand Mark + Lab/Lesson Breadcrumb Selector
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Compact Industrial Brand Mark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-5 h-5 bg-[#27272A] border border-[#3F3F46] rounded-sm flex items-center justify-center text-[#F59E0B]">
            <Cpu className="w-3.5 h-3.5" strokeWidth={1.5} />
          </div>
          <span className="font-mono font-bold tracking-tight text-[#F4F4F5] uppercase text-[11px] flex items-center gap-1.5">
            SPARKBYTE
            <span className="text-[#A1A1AA] font-normal">//</span>
            <span className="text-[#06B6D4] font-medium tracking-normal text-[10px]">EDA WORKBENCH</span>
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-[#27272A] mx-0.5 shrink-0" />

        {/* Machined Breadcrumb Selector */}
        <button
          onClick={onOpenCurriculumDrawer}
          className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-[#121215] hover:bg-[#27272A] border border-[#27272A] hover:border-[#3F3F46] text-[#F4F4F5] font-mono text-[11px] tracking-wide transition-colors truncate group"
          title="Click to browse 22 Labs & 88 Lessons in Curriculum Drawer"
        >
          <span className="text-[#F59E0B] font-semibold">{currentLab.code}</span>
          <span className="text-[#71717A]">//</span>
          <span className="text-[#A1A1AA] group-hover:text-[#F4F4F5] truncate max-w-[280px]">
            LESSON {String(currentLesson.globalIndex).padStart(2, '0')}: {currentLesson.title.toUpperCase()}
          </span>
          <ChevronDown className="w-3 h-3 text-[#71717A] group-hover:text-[#F4F4F5] shrink-0 ml-0.5" strokeWidth={1.5} />
        </button>

        {/* Command Palette Trigger (Ctrl+K / ⌘K) */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm bg-[#121215] hover:bg-[#27272A] border border-[#27272A] hover:border-[#3F3F46] text-[#71717A] hover:text-[#F4F4F5] font-mono text-[10.5px] transition-colors"
            title="Open Industrial Command Palette (Ctrl+K or ⌘K)"
          >
            <Search className="w-3 h-3 text-[#71717A]" strokeWidth={1.5} />
            <span className="hidden lg:inline text-[#A1A1AA]">Commands</span>
            <kbd className="px-1 py-0.2 rounded-sm bg-[#18181B] text-[#A1A1AA] text-[9px] border border-[#27272A]">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CENTER: Hardware Simulation Status & Telemetry Badge
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-sm bg-[#121215] border border-[#27272A] font-mono text-[11px]">
          {/* Active Status Pulse Dot */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-[#10B981] animate-pulse ring-2 ring-[#10B981]/20' : 'bg-[#71717A]'
              }`}
            />
            <span className="font-semibold text-[#F4F4F5]">AVR ATmega328P</span>
          </div>

          <span className="text-[#3F3F46]">•</span>
          <span className="text-[#A1A1AA]">16.000 MHz</span>

          <span className="text-[#3F3F46]">•</span>
          <span className="tabular-nums font-mono text-[#F59E0B] min-w-[70px]">
            {formatTime(virtualTimeMs)}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: Tactile Control Buttons (VERIFY, RUN SIM, STOP, RESET)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* VERIFY BUTTON */}
        <button
          onClick={onVerifyCode}
          disabled={isVerifying}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#121215] hover:bg-[#27272A] active:bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-[#F4F4F5] font-mono text-[11px] font-medium tracking-wide transition-colors"
          title="Verify & Compile C++ Sketch (Syntax, Pins, Logic)"
        >
          <CheckCircle className={`w-3.5 h-3.5 text-[#06B6D4] ${isVerifying ? 'animate-spin' : ''}`} strokeWidth={1.5} />
          <span>{isVerifying ? 'VERIFYING...' : 'VERIFY'}</span>
        </button>

        {/* RUN / STOP SIMULATION TOGGLE */}
        {isRunning ? (
          <button
            onClick={onStopSimulation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EF4444]/15 hover:bg-[#EF4444]/25 active:bg-[#EF4444]/35 border border-[#EF4444]/40 text-[#EF4444] font-mono text-[11px] font-bold tracking-wide transition-colors"
            title="Halt AVR Virtual CPU Execution"
          >
            <Square className="w-3.5 h-3.5 fill-current" strokeWidth={1.5} />
            <span>STOP</span>
          </button>
        ) : (
          <button
            onClick={onRunSimulation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] border border-[#F59E0B] text-[#09090B] font-mono text-[11px] font-bold tracking-wide transition-colors shadow-none"
            title="Start Real-Time AVR Simulation & Hardware Clock"
          >
            <Play className="w-3.5 h-3.5 fill-current" strokeWidth={1.5} />
            <span>RUN SIM</span>
          </button>
        )}

        {/* RESET BUTTON */}
        <button
          onClick={onResetSimulation}
          className="flex items-center gap-1 px-2 py-1 rounded-sm bg-[#121215] hover:bg-[#27272A] active:bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-[#F4F4F5] font-mono text-[11px] transition-colors"
          title="Reset ATmega328P Registers & Hardware States"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="hidden sm:inline">RESET</span>
        </button>

        {/* 3-WINDOW WORKSPACE LAYOUT TOGGLE GROUP */}
        <div className="flex items-center gap-0.5 pl-2 ml-1 border-l border-[#27272A]">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-1 rounded-sm border transition-colors ${
                sidebarOpen
                  ? 'bg-[#27272A] text-[#F59E0B] border-[#3F3F46]'
                  : 'bg-[#121215] text-[#71717A] border-[#27272A] hover:text-[#F4F4F5]'
              }`}
              title={sidebarOpen ? 'Minimize Left Panel (Sidebar)' : 'Restore Left Panel (Sidebar)'}
            >
              <PanelLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}

          {onToggleConsole && (
            <button
              onClick={onToggleConsole}
              className={`p-1 rounded-sm border transition-colors ${
                consoleOpen
                  ? 'bg-[#27272A] text-[#06B6D4] border-[#3F3F46]'
                  : 'bg-[#121215] text-[#71717A] border-[#27272A] hover:text-[#F4F4F5]'
              }`}
              title={consoleOpen ? 'Minimize Bottom Console' : 'Restore Bottom Console'}
            >
              <PanelBottom className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}

          {onToggleCadViewport && (
            <button
              onClick={onToggleCadViewport}
              className={`p-1 rounded-sm border transition-colors ${
                cadViewportOpen
                  ? 'bg-[#27272A] text-[#10B981] border-[#3F3F46]'
                  : 'bg-[#121215] text-[#71717A] border-[#27272A] hover:text-[#F4F4F5]'
              }`}
              title={cadViewportOpen ? 'Minimize Right Panel (CAD Viewport)' : 'Restore Right Panel (CAD Viewport)'}
            >
              <PanelRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
