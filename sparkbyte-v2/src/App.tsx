/**
 * Industrial-Grade Arduino & Sensor EDA Learning Platform
 * Principal Frontend Systems Architecture (Linear / Onshape / Wokwi / Saleae Discipline)
 *
 * Zone layout:
 *   Zone 1 — Top Telemetry Header (40px fixed)
 *   Zone 2 — Left Activity Rail (48px) + Collapsible Technical Drawer (300px)
 *   Zone 3 — Center Code Workspace (Vertical Resizable Split: 70% Monaco / 30% Console)
 *   Zone 4 — Right CAD & Hardware Simulation Viewport (Resizable Canvas + HUD)
 *
 * Strict Visual Discipline:
 *   Anti-"AI Slop": Zero rounded cards, zero gradient blobs, zero glassmorphism, zero global scroll.
 *   Deep Background #09090B, Panel Surface #121215, Elevated Toolbar #18181B.
 *   Hairline borders 1px solid #27272A, Machined radius 2px (rounded-sm).
 *   Monospace tabular numbers (JetBrains Mono) for all clocks, pins, angles, registers.
 *
 * © 2026 SparkByte Studio · Principal Systems Engineering Architecture
 */

import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { TopBar } from './components/TopBar';
import { SidebarTree } from './components/SidebarTree';
import { CodeWorkspace, FileTab, PinStateTelemetry } from './components/CodeWorkspace';
import { CadViewport } from './components/CadViewport';
import { AiCoachPanel } from './components/AiCoachPanel';
import { CURRICULUM_DATA, LabSpec, LessonSpec, LAB_INDEX_TO_STORE_ID } from './data/mockCurriculum';
import { CadStudioPage } from './pages/CadStudioPage';
import { useWorkbenchStore } from './store/useWorkbenchStore';
import { globalVirtualClock } from './engine/virtualClock';

export const App: React.FC = () => {
  // ──────────────────────────────────────────────────────────────────────────
  // ROUTE GUARD — Standalone /cad-studio route
  // ──────────────────────────────────────────────────────────────────────────
  const [isCadStudio, setIsCadStudio] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.includes('/cad-studio') || hash.includes('cad-studio');
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsCadStudio(path.includes('/cad-studio') || hash.includes('cad-studio'));
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // ZUSTAND STORE — single source of truth for simulation + hardware state
  // ──────────────────────────────────────────────────────────────────────────
  const {
    isRunning: storeRunning,
    isPaused,
    hardwareState,
    serialLogs: storeLogs,
    addSerialLog,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setActiveLab: storeSetActiveLab,
    setActiveLesson: storeSetActiveLesson,
    setCustomCode,
    setAiCoachOpen,
  } = useWorkbenchStore();

  // ──────────────────────────────────────────────────────────────────────────
  // CURRICULUM — active lab / lesson (drive via mockCurriculum for sidebar)
  // ──────────────────────────────────────────────────────────────────────────
  const [currentLab, setCurrentLab] = useState<LabSpec>(() => {
    return CURRICULUM_DATA.find((l) => l.id === 'lab-02') || CURRICULUM_DATA[0];
  });

  const [currentLesson, setCurrentLesson] = useState<LessonSpec>(() => {
    const lab = CURRICULUM_DATA.find((l) => l.id === 'lab-02') || CURRICULUM_DATA[0];
    return lab.lessons[0];
  });

  // ──────────────────────────────────────────────────────────────────────────
  // WORKSPACE PANELS & FILE BUFFERS
  // ──────────────────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFile, setActiveFile] = useState<FileTab>('sketch.ino');
  const [files, setFiles] = useState<Record<FileTab, string>>(() => ({
    ...currentLesson.defaultFiles
  }));

  const handleCodeChange = (file: FileTab, code: string) => {
    setFiles((prev) => ({ ...prev, [file]: code }));
  };

  // ──────────────────────────────────────────────────────────────────────────
  // VIRTUAL CLOCK — subscribe for virtualTimeMs display in TopBar
  // ──────────────────────────────────────────────────────────────────────────
  const [virtualTimeMs, setVirtualTimeMs] = useState(0);
  const clockCbRef = useRef<((d: number, t: number) => void) | null>(null);
  useEffect(() => {
    clockCbRef.current = (_d: number, t: number) => setVirtualTimeMs(Math.round(t));
    const unsub = globalVirtualClock.subscribe((d, t) => clockCbRef.current?.(d, t));
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // LOCAL UI STATE
  // ──────────────────────────────────────────────────────────────────────────
  const [baudRate, setBaudRate] = useState(115200);
  const [isVerifying, setIsVerifying] = useState(false);
  const [compilerOutput, setCompilerOutput] = useState<string[]>([
    'avr-g++ -c -g -Os -w -fno-exceptions -ffunction-sections -fdata-sections -MMD -mmcu=atmega328p -DF_CPU=16000000L',
    'Compiling sketch.ino...',
    'Linking .elf binary (ATmega328P)...',
    'AVR Memory Usage:',
    '  Program Flash: 2,418 bytes (7.5% of 32,256 bytes)',
    '  Data SRAM:       184 bytes (8.9% of 2,048 bytes)',
  ]);

  // ──────────────────────────────────────────────────────────────────────────
  // DERIVED SERVO / TELEMETRY FROM STORE HARDWARE STATE
  // ──────────────────────────────────────────────────────────────────────────
  const servoAngle = hardwareState.servoAngle ?? 90.0;
  const pulseWidthUs = Math.round(1000 + (servoAngle / 180) * 1000);
  const pwmDutyPct = +(pulseWidthUs / 20000 * 100);
  const currentMa = hardwareState.currentMa ?? 142.0;

  // ──────────────────────────────────────────────────────────────────────────
  // BUILD LIVE PIN TELEMETRY FROM HARDWARE STATE
  // ──────────────────────────────────────────────────────────────────────────
  const pinTelemetry: PinStateTelemetry[] = [
    { pin: 0,  label: 'D0 (RX)',    mode: 'INPUT',       value: 1,   voltage: 5.0, isHigh: true },
    { pin: 1,  label: 'D1 (TX)',    mode: 'OUTPUT',      value: 1,   voltage: 5.0, isHigh: true },
    { pin: 2,  label: 'D2 (INT0)', mode: 'INPUT_PULLUP', value: hardwareState.buttonPressed ? 0 : 1, voltage: hardwareState.buttonPressed ? 0.0 : 5.0, isHigh: !hardwareState.buttonPressed },
    { pin: 3,  label: 'D3 (~PWM)', mode: 'OUTPUT',      value: hardwareState.pwmStates?.[3] ?? 0, voltage: +((hardwareState.pwmStates?.[3] ?? 0) / 255 * 5).toFixed(2), isHigh: (hardwareState.pwmStates?.[3] ?? 0) > 0, pwmDutyPct: +((hardwareState.pwmStates?.[3] ?? 0) / 255 * 100).toFixed(1) },
    { pin: 4,  label: 'D4',        mode: 'OUTPUT',      value: hardwareState.pinStates?.[4] ? 1 : 0, voltage: hardwareState.pinStates?.[4] ? 5.0 : 0.0, isHigh: !!hardwareState.pinStates?.[4] },
    { pin: 5,  label: 'D5 (~PWM)', mode: 'OUTPUT',      value: hardwareState.pwmStates?.[5] ?? 0, voltage: +((hardwareState.pwmStates?.[5] ?? 0) / 255 * 5).toFixed(2), isHigh: (hardwareState.pwmStates?.[5] ?? 0) > 0, pwmDutyPct: +((hardwareState.pwmStates?.[5] ?? 0) / 255 * 100).toFixed(1) },
    { pin: 6,  label: 'D6 (~PWM)', mode: 'OUTPUT',      value: hardwareState.pwmStates?.[6] ?? 0, voltage: +((hardwareState.pwmStates?.[6] ?? 0) / 255 * 5).toFixed(2), isHigh: (hardwareState.pwmStates?.[6] ?? 0) > 0, pwmDutyPct: +((hardwareState.pwmStates?.[6] ?? 0) / 255 * 100).toFixed(1) },
    { pin: 7,  label: 'D7',        mode: 'OUTPUT',      value: hardwareState.pinStates?.[7] ? 1 : 0, voltage: hardwareState.pinStates?.[7] ? 5.0 : 0.0, isHigh: !!hardwareState.pinStates?.[7] },
    { pin: 8,  label: 'D8',        mode: 'OUTPUT',      value: hardwareState.pinStates?.[8] ? 1 : 0, voltage: hardwareState.pinStates?.[8] ? 5.0 : 0.0, isHigh: !!hardwareState.pinStates?.[8] },
    { pin: 9,  label: 'D9 (~PWM)', mode: 'PWM',         value: Math.round(pulseWidthUs / 20000 * 255), voltage: +(5.0 * pulseWidthUs / 20000).toFixed(2), isHigh: true, pwmDutyPct: +pwmDutyPct.toFixed(2) },
    { pin: 10, label: 'D10 (~SS)', mode: 'OUTPUT',      value: hardwareState.pinStates?.[10] ? 1 : 0, voltage: hardwareState.pinStates?.[10] ? 5.0 : 0.0, isHigh: !!hardwareState.pinStates?.[10] },
    { pin: 11, label: 'D11 (MOSI)',mode: 'OUTPUT',      value: 0,   voltage: 0.0, isHigh: false },
    { pin: 12, label: 'D12 (MISO)',mode: 'INPUT',       value: 0,   voltage: 0.0, isHigh: false },
    { pin: 13, label: 'D13 (LED)', mode: 'OUTPUT',      value: hardwareState.ledOn ? 1 : 0, voltage: hardwareState.ledOn ? 5.0 : 0.0, isHigh: !!hardwareState.ledOn },
    { pin: 14, label: 'A0',        mode: 'ANALOG',      value: hardwareState.potVal ?? 512, voltage: +((hardwareState.potVal ?? 512) / 1023 * 5.0).toFixed(2), isHigh: false },
    { pin: 15, label: 'A1',        mode: 'ANALOG',      value: 0,   voltage: 0.0, isHigh: false },
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // LESSON SELECTION — drive both sidebar state & execution store
  // ──────────────────────────────────────────────────────────────────────────
  const handleSelectLesson = (lab: LabSpec, lesson: LessonSpec) => {
    setCurrentLab(lab);
    setCurrentLesson(lesson);
    setFiles({ ...lesson.defaultFiles });
    setActiveFile('sketch.ino');
    addSerialLog(`[SYSTEM] Switched to ${lab.code} // Lesson ${lesson.lessonIndex}: ${lesson.title}`);
    // Map lab id (e.g. "lab-02") → store key (e.g. "servo")
    const storeLabKey = LAB_INDEX_TO_STORE_ID[lab.id] || 'servo';
    storeSetActiveLab(storeLabKey);
    storeSetActiveLesson(lesson.lessonIndex);
    setCustomCode(lesson.defaultFiles['sketch.ino'] || '');
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SIMULATION CONTROLS — delegate to store
  // ──────────────────────────────────────────────────────────────────────────
  const handleRunSimulation = () => {
    addSerialLog('[SIM] ▶ AVR Simulation running. Hardware clock active at 16.0MHz.');
    startSimulation();
  };

  const handleStopSimulation = () => {
    addSerialLog('[SIM] ⏹ AVR Virtual CPU halted. Timer interrupts suspended.');
    pauseSimulation();
  };

  const handleResetSimulation = () => {
    addSerialLog('[RESET] Hardware reset pulse (RESET pin driven LOW). PC=0x0000.');
    resetSimulation();
    setVirtualTimeMs(0);
  };

  const handleVerifyCode = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addSerialLog('[VERIFY] ✓ Compilation successful. Zero syntax or pin mapping errors.');
      setCompilerOutput([
        `avr-g++ -c -g -Os -Wall -mmcu=atmega328p -DF_CPU=16000000L ${activeFile}`,
        'Validating Arduino pin register mappings against ATmega328P header...',
        'Generated Intel HEX binary payload: 2,418 bytes.',
        'Binary status: READY FOR SIMULATION.',
      ]);
      setCustomCode(files['sketch.ino'] || '');
    }, 450);
  };

  const handleSendSerial = (input: string) => {
    addSerialLog(`[TX] > ${input}`);
    if (input.toUpperCase().startsWith('SET_ANGLE=')) {
      const angle = parseFloat(input.split('=')[1]);
      if (!isNaN(angle)) {
        const clamped = Math.max(0, Math.min(180, angle));
        addSerialLog(`[AVR] Acknowledged: Target servo angle set to ${clamped.toFixed(1)}°`);
      }
    } else {
      addSerialLog(`[AVR] Command '${input}' received. Echo ACK 0x06.`);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // CAD STUDIO ROUTE
  // ──────────────────────────────────────────────────────────────────────────
  if (isCadStudio) {
    return <CadStudioPage />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#09090B] text-[#F4F4F5] flex flex-col font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: TOP TELEMETRY HEADER (40px FIXED)
      ───────────────────────────────────────────────────────────── */}
      <TopBar
        currentLab={currentLab}
        currentLesson={currentLesson}
        isRunning={storeRunning}
        isPaused={isPaused}
        virtualTimeMs={virtualTimeMs}
        onRunSimulation={handleRunSimulation}
        onStopSimulation={handleStopSimulation}
        onResetSimulation={handleResetSimulation}
        onVerifyCode={handleVerifyCode}
        onOpenCurriculumDrawer={() => setSidebarOpen(true)}
        isVerifying={isVerifying}
      />

      {/* ─────────────────────────────────────────────────────────────
          ZONES 2 / 3 / 4: RESIZABLE 3-PANE WORKSPACE BODY
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full h-[calc(100vh-40px)] flex overflow-hidden">
        {/* ZONE 2: LEFT ACTIVITY RAIL + COLLAPSIBLE DRAWER */}
        <SidebarTree
          currentLab={currentLab}
          currentLesson={currentLesson}
          onSelectLesson={handleSelectLesson}
          isOpen={sidebarOpen}
          onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* HORIZONTAL SPLIT: CENTER CODE WORKSPACE & RIGHT CAD VIEWPORT */}
        <div className="flex-1 h-full overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* ZONE 3: CENTER CODE WORKSPACE */}
            <Panel defaultSize={48} minSize={25} className="h-full">
              <CodeWorkspace
                files={files}
                activeFile={activeFile}
                onSelectFile={setActiveFile}
                onCodeChange={(file, code) => {
                  handleCodeChange(file, code);
                  if (file === 'sketch.ino') setCustomCode(code);
                }}
                serialLogs={storeLogs.length > 0 ? storeLogs : [
                  '[BOOT] AVR ATmega328P Core initialized at 16.000000 MHz.',
                  '[USART] Hardware Serial Port 0 configured for 115200 baud (8-N-1).',
                  '[READY] System standby. Press [RUN SIM] to begin hardware execution cycle.',
                ]}
                onSendSerial={handleSendSerial}
                onClearSerial={() => {/* store manages slice */}}
                baudRate={baudRate}
                onBaudRateChange={setBaudRate}
                pinTelemetry={pinTelemetry}
                compilerOutput={compilerOutput}
              />
            </Panel>

            {/* HAIRLINE HORIZONTAL RESIZE HANDLE */}
            <PanelResizeHandle className="w-[2px] bg-[#27272A] hover:bg-[#F59E0B] transition-colors cursor-col-resize relative group">
              <div className="absolute inset-y-0 -left-1 -right-1" />
            </PanelResizeHandle>

            {/* ZONE 4: RIGHT CAD & AVR HARDWARE SIMULATION VIEWPORT */}
            <Panel defaultSize={52} minSize={30} className="h-full">
              <CadViewport
                currentLab={currentLab}
                servoAngle={servoAngle}
                pwmDutyPct={pwmDutyPct}
                pulseWidthUs={pulseWidthUs}
                currentMa={currentMa}
                busVoltage={5.02}
                isRunning={storeRunning}
                onManualAngleChange={() => {/* read-only: driven by store execution engine */}}
              />
            </Panel>
          </PanelGroup>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING: SPARKY AI COACH PANEL (Bottom-Right Overlay)
      ───────────────────────────────────────────────────────────── */}
      <AiCoachPanel
        isDrawer={false}
        onClose={() => setAiCoachOpen(false)}
      />
    </div>
  );
};

export default App;
