/**
 * Slim 44px Top Navigation Bar
 * Optimized for zero horizontal overflow on 1366px–1920px viewports.
 *
 * Left: Brand Mark + Lab Selector Pill (▾) + [Lesson Guide] Slide-Over Drawer Button
 * Center: Compact 4-Step Stepper ([◀] 1 · 2 · 3 · 4 [▶] + Step X of 4 Indicator)
 * Right: Teacher Mode Toggle, USB Connect, Export .ino, and About & License Button
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState } from 'react';
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
  ExternalLink
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

  const currentLab = LAB_MAP[activeLabId] || ALL_LABS[0];
  const currentLesson = currentLab?.lessons[activeLessonId - 1] || currentLab?.lessons[0];
  const labIndex = ALL_LABS.findIndex((l) => l.id === activeLabId) + 1;
  const totalLessons = currentLab?.lessons?.length || 4;

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
    <header className="h-[44px] bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 flex items-center justify-between z-30 select-none shrink-0 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          LEFT: Brand + Lab Selector Pill + [Lesson Guide] Toggle
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Brand Mark */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-white stroke-[2]" />
          </div>
          <span className="font-bold text-xs tracking-tight text-white flex items-center gap-1">
            SparkByte
            <span className="text-[9px] font-semibold uppercase px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              v2
            </span>
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-slate-800 mx-0.5" />

        {/* Lab Selector Pill Dropdown Trigger */}
        <button
          onClick={() => setExplorerModalOpen(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all text-xs text-slate-200 group max-w-[240px]"
          title="Browse all 22 ATL Physical Computing & CAD Labs"
        >
          <Layers className="w-3 h-3 text-blue-400 group-hover:scale-110 transition-transform stroke-[1.5] shrink-0" />
          <span className="font-medium text-[11.5px] text-slate-300 group-hover:text-white truncate">
            Lab {labIndex}: {currentLab.name.replace(/\s+Lab$/, '')}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0 ml-0.5" />
        </button>

        {/* Lesson Guide Slide-Over Drawer Toggle */}
        <button
          onClick={toggleLessonGuide}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
            lessonGuideOpen
              ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-sm shadow-sky-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title={lessonGuideOpen ? 'Hide Lesson Guide Drawer' : 'Open Lesson Guide & Wiring Drawer'}
        >
          <BookOpen className="w-3 h-3 text-sky-400 stroke-[1.5]" />
          <span className="text-[11px] hidden sm:inline">Guide</span>
        </button>

        {/* 3D CAD Studio Quick-Launch Pill */}
        <button
          onClick={() => setActiveLab('cad')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
            activeLabId === 'cad'
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-300'
          }`}
          title="Open 3D Parametric CAD & STL Export Studio (Lab 6)"
        >
          <Box className="w-3 h-3 text-cyan-400 stroke-[1.5]" />
          <span className="text-[11px] hidden md:inline">3D CAD</span>
        </button>

        {/* Dedicated Full-Viewport CAD Studio Link (Target _blank) */}
        <a
          href="/cad-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-teal-600/20 hover:from-cyan-600/30 hover:to-teal-600/30 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all shadow-sm group"
          title="Launch full-viewport 3D CAD & STL Prototyping Studio in a new tab"
        >
          <span>🧊</span>
          <span className="text-[11px] hidden lg:inline">Open 3D CAD Studio</span>
          <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CENTER: Compact 4-Step Segmented Stepper ([◀] 1·2·3·4 [▶])
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
          {/* Previous Step Button */}
          <button
            onClick={handlePrevLesson}
            disabled={activeLessonId <= 1}
            className="p-1 rounded text-slate-400 hover:text-white disabled:text-slate-600 disabled:hover:text-slate-600 hover:bg-slate-800 transition-colors"
            title="Previous Lesson"
          >
            <ChevronLeft className="w-3 h-3 stroke-[2]" />
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
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/40'
                    : isDone
                    ? 'text-emerald-400 hover:bg-slate-800 hover:text-emerald-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={lesson.title}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
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
            className="p-1 rounded text-slate-400 hover:text-white disabled:text-slate-600 disabled:hover:text-slate-600 hover:bg-slate-800 transition-colors"
            title="Next Lesson"
          >
            <ChevronRight className="w-3 h-3 stroke-[2]" />
          </button>
        </div>

        {/* Step Progress Pill Indicator */}
        <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 hidden md:inline">
          Step {activeLessonId} of {totalLessons}
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: Teacher Insights, USB Connect, Export .ino, Help/About
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {/* Teacher Mode Toggle Button */}
        <button
          onClick={toggleTeacherMode}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
            teacherMode
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Toggle Teacher Mode (Pedagogical Insights & Student Misconceptions)"
        >
          <GraduationCap className="w-3.5 h-3.5 stroke-[1.5]" />
          <span className="text-[11px] hidden lg:inline">Teacher Insights</span>
        </button>

        {/* USB Arduino Connect */}
        <button
          onClick={handleToggleSerial}
          disabled={connecting}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium transition-all ${
            serialConnected
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={serialConnected ? 'Connected to USB Arduino (Click to disconnect)' : 'Connect physical USB Arduino board (Web Serial)'}
        >
          <Usb className="w-3 h-3 stroke-[1.5]" />
          <span className="text-[11px] hidden xl:inline">{serialConnected ? 'Connected' : 'USB'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${serialConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
        </button>

        {/* Export .ino Sketch */}
        <button
          onClick={handleExportIno}
          className="p-1.5 rounded-md bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Export current lesson code as an Arduino .ino sketch"
        >
          <Download className="w-3 h-3 stroke-[1.5]" />
        </button>

        {/* About & Commercial License Modal Trigger */}
        <button
          onClick={() => setAboutModalOpen(true)}
          className="p-1.5 rounded-md bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-sky-300 transition-colors"
          title="About SparkByte Studio & Licensing Information (© 2026 Aaditya Joshi)"
        >
          <HelpCircle className="w-3 h-3 stroke-[1.5]" />
        </button>
      </div>
    </header>
  );
};
