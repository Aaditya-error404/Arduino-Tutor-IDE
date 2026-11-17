import React, { useRef, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';

interface OscilloscopeProps {
  dockMode?: boolean;
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({ dockMode = false }) => {
  const { scopeBuffer, hardwareState } = useWorkbenchStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { activeLab, servoPulseWidthMs } = hardwareState;

  // Render waveform on canvas whenever scopeBuffer updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark Scope Screen Background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Oscilloscope Grid Lines (8 horizontal divs, 10 vertical divs)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    for (let x = 0; x < width; x += width / 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += height / 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]); // Reset dash

    // Ground Center Baseline
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, height - 12);
    ctx.lineTo(width, height - 12);
    ctx.stroke();

    if (scopeBuffer.length < 2) return;

    const points = scopeBuffer;
    const stepX = width / Math.max(1, points.length - 1);
    const scaleY = (height - 24) / 5.0; // 5V full scale

    // ----------------------------------------------------
    // Channel 1: Yellow Digital PWM / GPIO trace
    // ----------------------------------------------------
    ctx.strokeStyle = '#eab308'; // Amber/Yellow
    ctx.lineWidth = 2;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 6;
    ctx.beginPath();

    points.forEach((pt, i) => {
      const x = i * stepX;
      const y = (height - 12) - (pt.ch1 * scaleY);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // ----------------------------------------------------
    // Channel 2: Cyan Analog Sensor / Feedback Voltage trace
    // ----------------------------------------------------
    ctx.strokeStyle = '#38bdf8'; // Sky Cyan
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 4;
    ctx.beginPath();

    points.forEach((pt, i) => {
      const x = i * stepX;
      const y = (height - 12) - (pt.ch2 * scaleY);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [scopeBuffer]);

  // Compute live engineering telemetry values
  let freqStr = '50.0 Hz';
  let pulseStr = `${(servoPulseWidthMs || 1.5).toFixed(2)} ms`;
  let dutyStr = `${(((servoPulseWidthMs || 1.5) / 20.0) * 100).toFixed(1)}%`;

  if (activeLab === 'led') {
    freqStr = '490.0 Hz';
    pulseStr = '1.02 ms';
    dutyStr = `${((hardwareState.pwmDuty / 255.0) * 100).toFixed(1)}%`;
  } else if (activeLab === 'buzzer') {
    freqStr = `${hardwareState.buzzerToneFreq || 440} Hz`;
    pulseStr = 'Square';
    dutyStr = '50.0%';
  }

  return (
    <div className={`${dockMode ? 'h-full' : 'h-44 border-t'} bg-slate-900 border-slate-800 flex flex-col min-h-0 select-none`}>
      {/* Scope Header Bar */}
      <div className="h-8 px-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-sky-400 stroke-[2]" />
          <span className="font-bold text-slate-200 tracking-tight">
            Dual-Channel Oscilloscope
          </span>
          <span className="flex items-center gap-1.5 ml-2 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            CH1: Pin ~9 PWM
            <span className="w-2 h-2 rounded-full bg-sky-400 ml-2" />
            CH2: Feedback
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE • {freqStr}
          </span>
        </div>
      </div>

      {/* Scope Canvas Screen */}
      <div className="flex-1 relative bg-black/40 overflow-hidden">
        <canvas
          ref={canvasRef}
          id="scope-canvas"
          width={640}
          height={100}
          className="w-full h-full block"
        />

        {/* Telemetry HUD Strip (Overlay Bottom) */}
        <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded border border-slate-800/80">
          <div className="flex items-center gap-4">
            <span><strong className="text-slate-200">CH1 VPP:</strong> 5.00 V</span>
            <span><strong className="text-slate-200">FREQUENCY:</strong> {freqStr}</span>
            <span><strong className="text-slate-200">PULSE:</strong> {pulseStr}</span>
            <span><strong className="text-slate-200">DUTY:</strong> {dutyStr}</span>
          </div>
          <div>
            <span><strong className="text-slate-200">TIMEBASE:</strong> 2.0 ms/div</span>
          </div>
        </div>
      </div>
    </div>
  );
};
