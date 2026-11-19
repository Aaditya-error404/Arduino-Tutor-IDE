/**
 * Sleek, Minimal Glassmorphic Top Utility Bar
 * Designed for zero congestion, generous breathing room, and translucent elegance.
 *
 * Left: Brand Mark + Lab Selector Pill (▾)
 * Center: Clean 4-Step Stepper ([◀] 1 · 2 · 3 · 4 [▶])
 * Right: Quick Lesson Guide Pill + Translucent Glassmorphic Dropdown Menu (Tools ▾)
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  GraduationCap,
  Usb,
  Download,
  HelpCircle,
  Box,
  ExternalLink,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { LAB_MAP, ALL_LABS } from '../data/lessons';
import { exportInoFile, webSerialBridge } from '../engine/webSerial';

export const TopUtilityBar: React.FC = () => {
  const {
    activeLabId,
    setActiveLab,
    activeLessonId,
    setActiveLesson,
    lessonGuideOpen,
    toggleLessonGuide,
    teacherMode,
    toggleTeacherMode,
    setExplorerModalOpen,
    setAboutModalOpen,
    completedLessons,
    serialConnected,
    setSerialConnected,
    addSerialLog,
    customCode
  } = useWorkbenchStore();

  const [connecting, setConnecting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLab = LAB_MAP[activeLabId] || ALL_LABS[0];
  const currentLesson = currentLab?.lessons[activeLessonId - 1] || currentLab?.lessons[0];
  const labIndex = ALL_LABS.findIndex((l) => l.id === activeLabId) + 1;
  const totalLessons = currentLab?.lessons?.length || 4;

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handlePrevLesson = () => {
    if (activeLessonId > 1) {
      setActiveLesson(activeLessonId - 1);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonId < totalLessons) {
      setActiveLesson(activeLessonId + 1);
    }
  };

  const handleExportIno = () => {
    const code = customCode || currentLesson.defaultCode.cpp;
    exportInoFile(currentLab.name, activeLessonId, code);
    setMenuOpen(false);
  };

  const handleToggleSerial = async () => {
    if (serialConnected) {
      await webSerialBridge.disconnect();
      setSerialConnected(false);
      addSerialLog('Disconnected from USB Arduino board.');
    } else {
      setConnecting(true);
      try {
        await webSerialBridge.connect(9600);
        setSerialConnected(true);
        addSerialLog('Connected to USB Arduino board on 9600 baud.');
        webSerialBridge.onData((data) => {
          addSerialLog(`[RX] ${data}`);
        });
      } catch (err) {
        console.warn('Serial connect cancelled or failed:', err);
      } finally {
        setConnecting(false);
      }
    }
  };

  return (
    <header className="h-[46px] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 px-4 flex items-center justify-between z-30 select-none shrink-0 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          LEFT: Brand + Clean Lab Selector Pill
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        {/* Brand Mark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/20">
            <Sparkles className="w-3.5 h-3.5 text-white stroke-[2]" />
          </div>
          <span className="font-bold text-xs tracking-tight text-white flex items-center gap-1.5">
            SparkByte
            <span className="text-[9.5px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
              v2
            </span>
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-800/80 mx-1" />

        {/* Minimal Lab Selector Pill */}
        <button
          onClick={() => setExplorerModalOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 hover:border-slate-700 transition-all text-xs text-slate-200 group max-w-[260px] shadow-sm"
          title="Browse all 22 ATL Physical Computing & CAD Labs"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400 group-hover:scale-105 transition-transform stroke-[1.8] shrink-0" />
          <span className="font-medium text-[11.5px] text-slate-300 group-hover:text-white truncate">
            Lab {labIndex}: {currentLab.name.replace(/\s+Lab$/, '')}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CENTER: Minimal 4-Step Stepper ([◀] 1·2·3·4 [▶])
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md p-1 rounded-xl border border-slate-800/80 shadow-inner">
          {/* Previous Step Button */}
          <button
            onClick={handlePrevLesson}
            disabled={activeLessonId <= 1}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:text-slate-700 disabled:hover:text-slate-700 hover:bg-slate-800/80 transition-colors"
            title="Previous Lesson"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
          </button>

          {/* 4 Step Buttons */}
          {currentLab.lessons.map((lesson, idx) => {
            const lessonNum = idx + 1;
            const isActive = lessonNum === activeLessonId;
            const isDone = completedLessons.includes(`${currentLab.id}-${lessonNum}`);

            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lessonNum)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50 ring-1 ring-blue-400/30'
                    : isDone
                    ? 'text-emerald-400 hover:bg-slate-800/80 hover:text-emerald-300'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
                title={lesson.title}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                ) : (
                  <span>{lessonNum}</span>
                )}
              </button>
            );
          })}

          {/* Next Step Button */}
          <button
            onClick={handleNextLesson}
            disabled={activeLessonId >= totalLessons}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:text-slate-700 disabled:hover:text-slate-700 hover:bg-slate-800/80 transition-colors"
            title="Next Lesson"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Step Indicator Pill */}
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800/80 hidden md:inline">
          {activeLessonId} / {totalLessons}
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: Guide Button + Translucent Glassmorphic Dropdown Menu
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Quick Lesson Guide Slide-Over Drawer Toggle */}
        <button
          onClick={toggleLessonGuide}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border shadow-sm ${
            lessonGuideOpen
              ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-sky-500/10'
              : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title={lessonGuideOpen ? 'Hide Lesson Guide Drawer' : 'Open Lesson Guide & Wiring Drawer'}
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400 stroke-[1.8]" />
          <span className="text-[11.5px] font-medium hidden sm:inline">Guide</span>
        </button>

        {/* Translucent Glassmorphic Dropdown Menu Anchor */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border shadow-sm ${
              menuOpen
                ? 'bg-slate-800 border-slate-600 text-white shadow-lg ring-1 ring-sky-500/30'
                : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800/90 hover:border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Open Tools & Options Menu"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
            <span className="text-[11.5px] font-medium">Tools</span>
            {/* Status indicator dot if USB connected or teacher mode enabled */}
            {(serialConnected || teacherMode) && (
              <span className={`w-1.5 h-1.5 rounded-full ${serialConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            )}
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${menuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Translucent Glassmorphic Popover Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-slate-700/60 shadow-2xl shadow-black/80 ring-1 ring-white/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
              {/* Header / Current Lab Subtitle */}
              <div className="px-2.5 py-1.5 border-b border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Workbench Tools
                </span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-500/30 px-1.5 py-0.2 rounded-full">
                  ATL Studio
                </span>
              </div>

              {/* SECTION 1: 3D CAD & Prototyping */}
              <div className="space-y-0.5 pt-1">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  3D CAD & Prototyping
                </div>

                <button
                  onClick={() => {
                    setActiveLab('cad');
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.8 rounded-xl text-xs transition-colors ${
                    activeLabId === 'cad'
                      ? 'bg-cyan-500/15 text-cyan-200 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Box className="w-3.5 h-3.5 text-cyan-400 stroke-[1.8]" />
                    <span>3D CAD Studio (Lab 6)</span>
                  </div>
                  {activeLabId === 'cad' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>

                <a
                  href="/cad-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-between px-2.5 py-1.8 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">🧊</span>
                    <span>Open CAD Studio Tab</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>

              <div className="h-[1px] bg-slate-800/70 my-1" />

              {/* SECTION 2: Physical Hardware & Sketch Export */}
              <div className="space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Hardware & Sketch
                </div>

                <button
                  onClick={handleToggleSerial}
                  disabled={connecting}
                  className="w-full flex items-center justify-between px-2.5 py-1.8 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Usb className="w-3.5 h-3.5 text-emerald-400 stroke-[1.8]" />
                    <span>USB Arduino Board</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10.5px] font-mono ${serialConnected ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {connecting ? 'Connecting...' : serialConnected ? 'Connected' : 'Offline'}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${serialConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  </div>
                </button>

                <button
                  onClick={handleExportIno}
                  className="w-full flex items-center justify-between px-2.5 py-1.8 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-sky-400 stroke-[1.8]" />
                    <span>Export Arduino .ino Sketch</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">IDE</span>
                </button>
              </div>

              <div className="h-[1px] bg-slate-800/70 my-1" />

              {/* SECTION 3: Teacher Mode & About */}
              <div className="space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Pedagogy & About
                </div>

                <button
                  onClick={() => {
                    toggleTeacherMode();
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.8 rounded-xl text-xs transition-colors ${
                    teacherMode
                      ? 'bg-amber-500/15 text-amber-200 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400 stroke-[1.8]" />
                    <span>Teacher Insights & Rubrics</span>
                  </div>
                  {teacherMode && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    setAboutModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.8 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400 stroke-[1.8]" />
                    <span>About & Student Portfolio</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">v2.0</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
