/**
 * Industrial-Grade Code Workspace & Telemetry Console
 * Vertical Split Pane (70% Monaco Editor / 30% Serial & Pin State Console)
 * Powered by react-resizable-panels and @monaco-editor/react
 *
 * Strict Visual Discipline:
 * - Anti-"AI Slop": No rounded cards, no glassmorphism, no gradient blobs.
 * - Deep background #09090B, panel surface #121215, borders 1px solid #27272A.
 * - Tabular numbers with JetBrains Mono.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import {
  FileCode,
  FileJson,
  FileText,
  Terminal,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Trash2,
  Send
} from 'lucide-react';

export type FileTab = 'sketch.ino' | 'diagram.json' | 'pins.h';
export type ConsoleTab = 'serial' | 'pins' | 'compiler';

export interface PinStateTelemetry {
  pin: number;
  label: string;
  mode: 'OUTPUT' | 'INPUT' | 'INPUT_PULLUP' | 'ANALOG' | 'PWM';
  value: number; // 0..255 or 0..1023
  voltage: number; // 0.0..5.0
  isHigh: boolean;
  pwmDutyPct?: number;
}

interface CodeWorkspaceProps {
  files: Record<FileTab, string>;
  activeFile: FileTab;
  onSelectFile: (file: FileTab) => void;
  onCodeChange: (file: FileTab, code: string) => void;
  serialLogs: string[];
  onSendSerial: (input: string) => void;
  onClearSerial: () => void;
  baudRate: number;
  onBaudRateChange: (baud: number) => void;
  pinTelemetry: PinStateTelemetry[];
  compilerOutput: string[];
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  files,
  activeFile,
  onSelectFile,
  onCodeChange,
  serialLogs,
  onSendSerial,
  onClearSerial,
  baudRate,
  onBaudRateChange,
  pinTelemetry,
  compilerOutput
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<ConsoleTab>('serial');
  const [serialInput, setSerialInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [lineWrap, setLineWrap] = useState(false);
  const serialBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll serial log
  useEffect(() => {
    serialBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(files[activeFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSerialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    onSendSerial(serialInput.trim());
    setSerialInput('');
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#09090B] overflow-hidden select-none font-sans">
      <PanelGroup direction="vertical">
        {/* ─────────────────────────────────────────────────────────────
            TOP PANEL (70%): MONACO C++ / INO CODE EDITOR
        ───────────────────────────────────────────────────────────── */}
        <Panel defaultSize={70} minSize={30} className="flex flex-col bg-[#09090B]">
          {/* File Tabs Header Bar */}
          <div className="h-[36px] bg-[#121215] border-b border-[#27272A] flex items-center justify-between px-2 shrink-0">
            {/* Left File Tabs */}
            <div className="flex items-center gap-0.5 h-full">
              {/* sketch.ino */}
              <button
                onClick={() => onSelectFile('sketch.ino')}
                className={`h-full px-3 flex items-center gap-1.5 font-mono text-[11px] border-r border-[#27272A] transition-colors relative ${
                  activeFile === 'sketch.ino'
                    ? 'bg-[#09090B] text-[#F4F4F5] font-semibold border-t-2 border-t-[#F59E0B]'
                    : 'bg-[#121215] text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-[#F59E0B]" strokeWidth={1.5} />
                <span>sketch.ino</span>
              </button>

              {/* diagram.json */}
              <button
                onClick={() => onSelectFile('diagram.json')}
                className={`h-full px-3 flex items-center gap-1.5 font-mono text-[11px] border-r border-[#27272A] transition-colors relative ${
                  activeFile === 'diagram.json'
                    ? 'bg-[#09090B] text-[#F4F4F5] font-semibold border-t-2 border-t-[#06B6D4]'
                    : 'bg-[#121215] text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
              >
                <FileJson className="w-3.5 h-3.5 text-[#06B6D4]" strokeWidth={1.5} />
                <span>diagram.json</span>
              </button>

              {/* pins.h */}
              <button
                onClick={() => onSelectFile('pins.h')}
                className={`h-full px-3 flex items-center gap-1.5 font-mono text-[11px] border-r border-[#27272A] transition-colors relative ${
                  activeFile === 'pins.h'
                    ? 'bg-[#09090B] text-[#F4F4F5] font-semibold border-t-2 border-t-[#10B981]'
                    : 'bg-[#121215] text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={1.5} />
                <span>pins.h</span>
              </button>
            </div>

            {/* Right Editor Utility Tools */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLineWrap(!lineWrap)}
                className={`px-1.5 py-0.5 rounded-sm border font-mono text-[10px] transition-colors ${
                  lineWrap
                    ? 'bg-[#27272A] text-[#F59E0B] border-[#3F3F46]'
                    : 'bg-[#121215] text-[#71717A] border-[#27272A] hover:text-[#F4F4F5]'
                }`}
                title="Toggle Soft Line Wrapping"
              >
                WRAP
              </button>

              <button
                onClick={handleCopyCode}
                className="p-1 rounded-sm text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#27272A] border border-transparent hover:border-[#27272A] transition-colors"
                title="Copy Active File Buffer to Clipboard"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={1.5} />
                ) : (
                  <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 w-full h-full overflow-hidden bg-[#09090B]">
            <Editor
              height="100%"
              theme="vs-dark"
              language={activeFile === 'diagram.json' ? 'json' : 'cpp'}
              value={files[activeFile] || ''}
              onChange={(value) => onCodeChange(activeFile, value || '')}
              options={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 12.5,
                lineHeight: 19,
                renderLineHighlight: 'all',
                lineNumbers: 'on',
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: lineWrap ? 'on' : 'off',
                automaticLayout: true,
                tabSize: 2,
                cursorBlinking: 'solid',
                cursorWidth: 2,
                suggestOnTriggerCharacters: true,
                padding: { top: 8, bottom: 8 }
              }}
            />
          </div>
        </Panel>

        {/* ─────────────────────────────────────────────────────────────
            HAIRLINE RESIZE HANDLE
        ───────────────────────────────────────────────────────────── */}
        <PanelResizeHandle className="h-[2px] bg-[#27272A] hover:bg-[#F59E0B] transition-colors cursor-row-resize relative group">
          <div className="absolute inset-x-0 -top-1 -bottom-1" />
        </PanelResizeHandle>

        {/* ─────────────────────────────────────────────────────────────
            BOTTOM PANEL (30%): AVR CONSOLE & PIN STATE DRAWER
        ───────────────────────────────────────────────────────────── */}
        <Panel defaultSize={30} minSize={15} className="flex flex-col bg-[#09090B] border-t border-[#27272A]">
          {/* Console Tabs Bar */}
          <div className="h-[34px] bg-[#121215] border-b border-[#27272A] flex items-center justify-between px-2 shrink-0">
            <div className="flex items-center gap-1 h-full">
              {/* SERIAL MONITOR TAB */}
              <button
                onClick={() => setActiveConsoleTab('serial')}
                className={`h-full px-2.5 flex items-center gap-1.5 font-mono text-[11px] border-r border-[#27272A] transition-colors relative ${
                  activeConsoleTab === 'serial'
                    ? 'bg-[#09090B] text-[#06B6D4] font-semibold border-t-2 border-t-[#06B6D4]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>SERIAL MONITOR</span>
              </button>

              {/* PIN STATES & PWM TAB */}
              <button
                onClick={() => setActiveConsoleTab('pins')}
                className={`h-full px-2.5 flex items-center gap-1.5 font-mono text-[11px] border-r border-[#27272A] transition-colors relative ${
                  activeConsoleTab === 'pins'
                    ? 'bg-[#09090B] text-[#F59E0B] font-semibold border-t-2 border-t-[#F59E0B]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>PWM & PIN STATES</span>
              </button>

              {/* COMPILER OUTPUT TAB */}
              <button
                onClick={() => setActiveConsoleTab('compiler')}
                className={`h-full px-2.5 flex items-center gap-1.5 font-mono text-[11px] border-r border-[#27272A] transition-colors relative ${
                  activeConsoleTab === 'compiler'
                    ? 'bg-[#09090B] text-[#10B981] font-semibold border-t-2 border-t-[#10B981]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>COMPILER DIAGNOSTICS</span>
              </button>
            </div>

            {/* Console Action Controls */}
            {activeConsoleTab === 'serial' && (
              <div className="flex items-center gap-2">
                {/* Baud Rate Selector */}
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px] text-[#71717A]">BAUD:</span>
                  <select
                    value={baudRate}
                    onChange={(e) => onBaudRateChange(Number(e.target.value))}
                    className="bg-[#09090B] border border-[#27272A] rounded-sm px-1.5 py-0.5 text-[10.5px] font-mono text-[#A1A1AA] outline-none"
                  >
                    <option value={9600}>9600 8-N-1</option>
                    <option value={19200}>19200</option>
                    <option value={38400}>38400</option>
                    <option value={57600}>57600</option>
                    <option value={115200}>115200 (FAST)</option>
                  </select>
                </div>

                {/* Clear Console Log */}
                <button
                  onClick={onClearSerial}
                  className="p-1 rounded-sm text-[#71717A] hover:text-[#EF4444] hover:bg-[#27272A] transition-colors"
                  title="Clear Terminal Output"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>

          {/* Console Drawer Body */}
          <div className="flex-1 overflow-hidden flex flex-col bg-[#09090B] p-2 text-xs font-mono">
            {/* 1. SERIAL MONITOR TAB */}
            {activeConsoleTab === 'serial' && (
              <div className="flex flex-col h-full overflow-hidden">
                {/* Scrollable Telemetry Text Output */}
                <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] leading-relaxed text-[#D4D4D8] select-text">
                  {serialLogs.length === 0 ? (
                    <div className="text-[#52525B] italic py-2">
                      [USART 16MHz] Awaiting data stream... Click [RUN SIM] to initialize hardware loop.
                    </div>
                  ) : (
                    serialLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 hover:bg-[#121215] px-1 rounded-sm">
                        <span className="text-[#71717A] text-[10px] tabular-nums select-none shrink-0">
                          [{String(idx + 1).padStart(3, '0')}]
                        </span>
                        <span className={log.startsWith('[WARN') ? 'text-[#F59E0B]' : log.startsWith('[ERR') ? 'text-[#EF4444]' : 'text-[#E4E4E7]'}>
                          {log}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={serialBottomRef} />
                </div>

                {/* Serial Command Input Bar */}
                <form
                  onSubmit={handleSendSerialSubmit}
                  className="pt-2 mt-1 border-t border-[#27272A] flex items-center gap-1.5 shrink-0"
                >
                  <span className="text-[#06B6D4] font-bold text-xs select-none">&gt;</span>
                  <input
                    type="text"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    placeholder="Send command to AVR USART (e.g. SET_ANGLE=90)..."
                    className="flex-1 bg-[#121215] border border-[#27272A] focus:border-[#06B6D4] rounded-sm px-2 py-1 text-xs font-mono text-[#F4F4F5] placeholder-[#52525B] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3F3F46] text-[#F4F4F5] border border-[#3F3F46] rounded-sm flex items-center gap-1 text-[11px] font-mono font-medium transition-colors"
                  >
                    <Send className="w-3 h-3 text-[#06B6D4]" strokeWidth={1.5} />
                    <span>SEND</span>
                  </button>
                </form>
              </div>
            )}

            {/* 2. PWM & PIN STATES INSPECTOR */}
            {activeConsoleTab === 'pins' && (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
                  {pinTelemetry.map((p) => (
                    <div
                      key={p.pin}
                      className={`p-1.5 rounded-sm border flex flex-col justify-between h-[68px] ${
                        p.isHigh
                          ? 'bg-[#18181B] border-[#F59E0B]/50'
                          : 'bg-[#121215] border-[#27272A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-[#F4F4F5]">
                          {p.label}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.isHigh ? 'bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]' : 'bg-[#3F3F46]'
                          }`}
                        />
                      </div>

                      <div className="flex items-baseline justify-between text-[10px] text-[#A1A1AA]">
                        <span>{p.mode}</span>
                        <span className="font-mono tabular-nums text-[#F4F4F5]">
                          {p.voltage.toFixed(2)}V
                        </span>
                      </div>

                      {/* PWM / Duty Cycle Visual Bar */}
                      <div className="w-full h-1 bg-[#27272A] rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-[#06B6D4]"
                          style={{
                            width: `${p.pwmDutyPct !== undefined ? p.pwmDutyPct : p.isHigh ? 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. COMPILER DIAGNOSTICS */}
            {activeConsoleTab === 'compiler' && (
              <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] text-[#D4D4D8]">
                {compilerOutput.map((msg, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#10B981] select-none">✓</span>
                    <span>{msg}</span>
                  </div>
                ))}
                <div className="text-[#71717A] pt-2 border-t border-[#27272A]">
                  AVR-GCC: 0 errors, 0 warnings. Compilation finished in 48ms.
                </div>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};
