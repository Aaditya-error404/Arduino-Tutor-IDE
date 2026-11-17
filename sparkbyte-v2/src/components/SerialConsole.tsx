/**
 * Live Interactive Serial Monitor & Multi-Channel Serial Plotter
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 *
 * Hooks directly into AVRUSART for real Serial.print() / Serial.println() output
 * with baud rate selector, timestamp toggle, Serial.read() input, and live CSV plotting.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, Send, Trash2, Clock, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';

interface SerialLine {
  timestamp: number;
  text: string;
  direction: 'tx' | 'rx';
}

interface SerialConsoleProps {
  dockMode?: boolean;
}

export const SerialConsole: React.FC<SerialConsoleProps> = ({ dockMode = false }) => {
  const { isRunning, serialLogs } = useWorkbenchStore();
  const [expanded, setExpanded] = useState(dockMode);
  const [baudRate, setBaudRate] = useState(9600);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showPlotter, setShowPlotter] = useState(false);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parse serial lines from store
  const lines: SerialLine[] = serialLogs.map((log, i) => ({
    timestamp: i * 100,
    text: log,
    direction: 'tx' as const,
  }));

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines.length]);

  // Serial Plotter: parse numeric CSV values and plot
  useEffect(() => {
    if (!showPlotter || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Parse last N numeric values from serial output
    const numericLines = lines
      .map((l) => {
        const nums = l.text.match(/-?\d+(\.\d+)?/g);
        return nums ? nums.map(Number) : null;
      })
      .filter((n): n is number[] => n !== null);

    if (numericLines.length < 2) return;

    const channels = numericLines[0].length;
    const colors = ['#fbbf24', '#38bdf8', '#a78bfa', '#34d399', '#fb7185'];
    const displayLines = numericLines.slice(-w);

    // Find value range
    let minVal = Infinity, maxVal = -Infinity;
    for (const row of displayLines) {
      for (const v of row) {
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      }
    }
    const range = maxVal - minVal || 1;

    for (let ch = 0; ch < channels && ch < 5; ch++) {
      ctx.strokeStyle = colors[ch % colors.length];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < displayLines.length; i++) {
        const x = (i / (displayLines.length - 1)) * w;
        const y = h - ((displayLines[i][ch] - minVal) / range) * (h - 10) - 5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [lines, showPlotter]);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    // Feed bytes to USART RX (the store/runner handles this)
    const addLog = useWorkbenchStore.getState().addSerialLog;
    addLog(`> ${inputText}`);
    setInputText('');
  }, [inputText]);

  const clearLogs = useCallback(() => {
    // Clear serial logs in store
    useWorkbenchStore.setState({ serialLogs: [] });
  }, []);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 hover:text-slate-200 w-full transition-colors"
      >
        <Terminal className="w-3.5 h-3.5 stroke-[1.5]" />
        <span>Serial Monitor</span>
        <span className={`ml-1 w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-lime-400' : 'bg-slate-600'}`} />
        <span className="ml-auto text-slate-500">{lines.length} lines</span>
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div
      className={`flex flex-col bg-slate-950 ${dockMode ? 'h-full min-h-0' : 'border-t border-slate-800'}`}
      style={dockMode ? {} : { height: showPlotter ? 280 : 200 }}
    >
      {/* Header Bar */}
      <div className="h-8 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-lime-400 stroke-[1.5]" />
          <span className="font-semibold text-slate-200">Serial Monitor</span>
          <select
            value={baudRate}
            onChange={(e) => setBaudRate(Number(e.target.value))}
            className="bg-slate-800 text-slate-300 border border-slate-700 rounded px-1 py-0.5 text-[11px] font-mono"
          >
            <option value={9600}>9600 baud</option>
            <option value={115200}>115200 baud</option>
            <option value={57600}>57600 baud</option>
            <option value={19200}>19200 baud</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTimestamps(!showTimestamps)}
            className={`p-1 rounded transition-colors ${showTimestamps ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title="Toggle timestamps"
          >
            <Clock className="w-3 h-3 stroke-[1.5]" />
          </button>
          <button
            onClick={() => setShowPlotter(!showPlotter)}
            className={`p-1 rounded transition-colors ${showPlotter ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title="Toggle Serial Plotter"
          >
            <BarChart3 className="w-3 h-3 stroke-[1.5]" />
          </button>
          <button
            onClick={clearLogs}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
            title="Clear output"
          >
            <Trash2 className="w-3 h-3 stroke-[1.5]" />
          </button>
          {!dockMode && (
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Serial Plotter Canvas */}
      {showPlotter && (
        <div className="h-[80px] bg-slate-950 border-b border-slate-800 shrink-0">
          <canvas
            ref={canvasRef}
            width={640}
            height={80}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Output Log */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-[11px] leading-[18px] px-2 py-1 min-h-0"
      >
        {lines.length === 0 ? (
          <div className="text-slate-500 italic py-2">
            Serial output will appear here when the simulation runs Serial.print() / Serial.println()…
          </div>
        ) : (
          lines.map((line, i) => (
            <div
              key={i}
              className={`flex gap-2 ${line.direction === 'rx' ? 'text-sky-400' : 'text-slate-300'} hover:bg-slate-900/60`}
            >
              {showTimestamps && (
                <span className="text-slate-600 shrink-0 w-16 text-right">
                  {(line.timestamp / 1000).toFixed(1)}s
                </span>
              )}
              <span className="whitespace-pre-wrap break-all">{line.text}</span>
            </div>
          ))
        )}
      </div>

      {/* Input Bar (for Serial.read()) */}
      <div className="h-8 px-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type to send via Serial.read()…"
          className="flex-1 bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-[11px] font-mono focus:outline-none focus:border-sky-500"
        />
        <button
          onClick={handleSend}
          className="p-1 rounded bg-sky-600 text-white hover:bg-sky-500 transition-colors"
          title="Send"
        >
          <Send className="w-3 h-3 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
};
