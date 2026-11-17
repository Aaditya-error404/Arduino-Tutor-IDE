/**
 * Canvas-First Floating Code & Translator HUD
 * Floats cleanly on the left (left-4 top-4 bottom-4).
 * Default 440px wide for pure C++ code; automatically expands to 62% width in Split mode
 * so both Plain English intent and Monaco C++ have wide, unclipped readability.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { 
  Bot, 
  Code2, 
  Check, 
  Copy,
  Lock,
  Unlock,
  ChevronLeft,
  Columns,
  Download
} from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { LAB_MAP, ALL_LABS } from '../data/lessons';
import { exportInoFile } from '../engine/webSerial';

export const DualCodeDesk: React.FC = () => {
  const {
    activeLabId,
    activeLessonId,
    codeHudOpen,
    setCodeHudOpen,
    codeHudMode,
    setCodeHudMode,
    activeLineIndex,
    isRunning,
    customCode,
    setCustomCode,
    setAiCoachOpen,
    setActiveDockTab
  } = useWorkbenchStore();

  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const currentLab = LAB_MAP[activeLabId] || ALL_LABS[0];
  const currentLesson = currentLab?.lessons[activeLessonId - 1] || currentLab?.lessons[0];

  const cppCode = customCode !== null ? customCode : currentLesson.defaultCode.cpp;
  const humanLines = currentLesson.defaultCode.human.split('\n');
  const cppLines = cppCode.split('\n');

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Sync Monaco editor gutter & line highlight decorations with activeLineIndex
  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    if (isRunning && activeLineIndex >= 0 && activeLineIndex < cppLines.length) {
      const monacoLineNumber = activeLineIndex + 1;

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: {
            startLineNumber: monacoLineNumber,
            startColumn: 1,
            endLineNumber: monacoLineNumber,
            endColumn: 1
          },
          options: {
            isWholeLine: true,
            className: 'monaco-executing-line',
            glyphMarginClassName: 'monaco-executing-glyph',
            linesDecorationsClassName: 'monaco-executing-gutter'
          }
        }
      ]);

      editor.revealLineInCenterIfOutsideViewport(monacoLineNumber);
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [activeLineIndex, isRunning, cppLines.length]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportIno = () => {
    exportInoFile(currentLab.name, activeLessonId, cppCode);
  };

  const handleOpenCoach = () => {
    setAiCoachOpen(true);
    setActiveDockTab('coach');
  };

  // If collapsed: render a sleek floating toggle button on the left edge
  if (!codeHudOpen) {
    return (
      <button
        onClick={() => setCodeHudOpen(true)}
        className="absolute left-4 top-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 select-none"
        title="Expand C++ Code & Translator HUD"
      >
        <Code2 className="w-4 h-4 text-sky-400 stroke-[2]" />
        <span className="font-semibold text-xs tracking-tight">Code Editor</span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
          C++
        </span>
      </button>
    );
  }

  const isSplit = codeHudMode === 'split';

  return (
    <div
      id="code-hud"
      className={`absolute left-4 top-4 bottom-4 z-20 flex flex-col bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 select-text ${
        isSplit
          ? 'w-[62vw] max-w-[960px] min-w-[560px]'
          : 'w-[440px] max-w-[90vw]'
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          HUD HEADER BAR: Mode Tabs + Action Tools + Collapse Button
      ───────────────────────────────────────────────────────────── */}
      <div className="h-10 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs select-none shrink-0">
        {/* Left: Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setCodeHudMode('cpp')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              !isSplit
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>C++ Code</span>
          </button>

          <button
            onClick={() => setCodeHudMode('split')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              isSplit
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split: English ↔ C++</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Ask AI Coach Trigger */}
          <button
            onClick={handleOpenCoach}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all border border-violet-500/40 bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 hover:text-white shadow-sm"
            title="Ask Sparky AI Coach about this code"
          >
            <Bot className="w-3 h-3 text-violet-400 stroke-[2]" />
            <span className="hidden sm:inline">Coach</span>
          </button>

          {/* Sandbox Edit Mode Lock */}
          <button
            onClick={() => setIsSandboxMode(!isSandboxMode)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
              isSandboxMode 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title={isSandboxMode ? 'Sandbox Mode (Code is fully editable)' : 'Curriculum Mode (Locked to structured lesson; click to unlock)'}
          >
            {isSandboxMode ? <Unlock className="w-3 h-3 text-amber-400" /> : <Lock className="w-3 h-3" />}
            <span className="hidden md:inline">{isSandboxMode ? 'Edit' : 'Lock'}</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy Code to Clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {/* Export .ino */}
          <button
            onClick={handleExportIno}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Export Arduino .ino sketch"
          >
            <Download className="w-3 h-3" />
          </button>

          {/* Collapse HUD Button */}
          <button
            onClick={() => setCodeHudOpen(false)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-0.5"
            title="Collapse Code HUD (◀)"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          HUD BODY: Monaco Editor or Dual Split View
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Split Left Column: Plain English Intent */}
        {isSplit && (
          <div className="w-[48%] border-r border-slate-800/80 flex flex-col min-h-0 bg-slate-950/60">
            <div className="h-7 px-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                Plain English Intent
              </span>
              <span>{humanLines.length} lines</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 font-sans text-xs">
              {humanLines.map((line, idx) => {
                const isActive = isRunning && activeLineIndex === idx;
                const isHovered = hoveredLine === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredLine(idx)}
                    onMouseLeave={() => setHoveredLine(null)}
                    className={`p-2 rounded-lg transition-colors border leading-relaxed ${
                      isActive
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-200'
                        : isHovered
                        ? 'bg-slate-900 border-slate-700/60 text-slate-200'
                        : 'bg-transparent border-transparent text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono text-slate-600 select-none pt-0.5">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap">{line || ' '}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monaco Editor Column */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
          {isSplit && (
            <div className="h-7 px-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${activeLabId === 'cad' ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                {activeLabId === 'cad' ? 'OpenSCAD 3D Geometry' : 'Arduino C++ Instructions'}
              </span>
              <span>{activeLabId === 'cad' ? 'Real-Time CSG Engine' : '16 MHz AVR GCC'}</span>
            </div>
          )}

          <div className="flex-1 min-h-0 relative">
            <Editor
              height="100%"
              language="cpp"
              theme="vs-dark"
              value={cppCode}
              onChange={(val) => {
                if (isSandboxMode || activeLabId === 'cad') {
                  setCustomCode(val || '');
                }
              }}
              onMount={handleEditorMount}
              options={{
                readOnly: !isSandboxMode && activeLabId !== 'cad',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
                lineNumbers: 'on',
                glyphMargin: true,
                automaticLayout: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineHeight: 20,
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                padding: { top: 8, bottom: 8 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
