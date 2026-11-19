/**
 * Industrial-Grade Arduino & Sensor EDA Learning Platform
 * Principal Frontend Systems Architecture (Linear / Onshape / Wokwi / Saleae Discipline)
 *
 * Workspace Layout:
 * - Zone 1: Top Telemetry Header (40px fixed)
 * - Zone 2: Left Activity Rail (48px) + Collapsible Technical Drawer (300px)
 * - Zone 3: Center Code Workspace (Vertical Resizable Split: 70% Monaco C++ / 30% Serial Console)
 * - Zone 4: Right CAD & Hardware Simulation Viewport (Resizable Engineering Canvas + Telemetry HUD)
 *
 * Strict Visual Discipline:
 * - Anti-"AI Slop": Zero rounded cards, zero gradient blobs, zero glassmorphism, zero global scroll.
 * - Deep Background #09090B, Panel Surface #121215, Elevated Toolbar #18181B.
 * - Hairline borders 1px solid #27272A, Machined radius 2px (rounded-sm).
 * - Monospace tabular numbers (JetBrains Mono) for all clocks, pins, angles, registers.
 *
 * © 2026 SparkByte Studio · Principal Systems Engineering Architecture
 */

import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { TopBar } from './components/TopBar';
import { SidebarTree } from './components/SidebarTree';
import { CodeWorkspace, FileTab, PinStateTelemetry } from './components/CodeWorkspace';
import { CadViewport } from './components/CadViewport';
import { CURRICULUM_DATA, LabSpec, LessonSpec } from './data/mockCurriculum';
import { CadStudioPage } from './pages/CadStudioPage';

export const App: React.FC = () => {
  // Lightweight Path & Hash Router for Standalone /cad-studio route
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
  // 1. CURRICULUM & ACTIVE LESSON STATE (Default to Lab 02: Servo Kinematics)
  // ──────────────────────────────────────────────────────────────────────────
  const [currentLab, setCurrentLab] = useState<LabSpec>(() => {
    return CURRICULUM_DATA.find((l) => l.id === 'lab-02') || CURRICULUM_DATA[0];
  });

  const [currentLesson, setCurrentLesson] = useState<LessonSpec>(() => {
    const lab = CURRICULUM_DATA.find((l) => l.id === 'lab-02') || CURRICULUM_DATA[0];
    return lab.lessons[0];
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. WORKSPACE PANELS & FILE BUFFERS
  // ──────────────────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFile, setActiveFile] = useState<FileTab>('sketch.ino');
  const [files, setFiles] = useState<Record<FileTab, string>>(() => ({
    ...currentLesson.defaultFiles
  }));

  // Update file buffers when lesson changes
  const handleSelectLesson = (lab: LabSpec, lesson: LessonSpec) => {
    setCurrentLab(lab);
    setCurrentLesson(lesson);
    setFiles({ ...lesson.defaultFiles });
    setActiveFile('sketch.ino');
    addSerialLog(`[SYSTEM] Switched to ${lab.code} // Lesson ${lesson.lessonIndex}: ${lesson.title}`);
  };

  const handleCodeChange = (file: FileTab, code: string) => {
    setFiles((prev) => ({
      ...prev,
      [file]: code
    }));
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 3. HARDWARE & AVR SIMULATION ENGINE STATE
  // ──────────────────────────────────────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [virtualTimeMs, setVirtualTimeMs] = useState(0);
  const [servoAngle, setServoAngle] = useState(90.0);
  const [baudRate, setBaudRate] = useState(115200);
  const [isVerifying, setIsVerifying] = useState(false);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[BOOT] AVR ATmega328P Core initialized at 16.000000 MHz.',
    '[USART] Hardware Serial Port 0 configured for 115200 baud (8-N-1).',
    '[READY] System standby. Press [RUN SIM] to begin hardware execution cycle.'
  ]);

  const [compilerOutput, setCompilerOutput] = useState<string[]>([
    'avr-g++ -c -g -Os -w -fno-exceptions -ffunction-sections -fdata-sections -MMD -mmcu=atmega328p -DF_CPU=16000000L',
    'Compiling sketch.ino...',
    'Linking .elf binary (ATmega328P)...',
    'AVR Memory Usage:',
    '  Program Flash: 2,418 bytes (7.5% of 32,256 bytes)',
    '  Data SRAM:       184 bytes (8.9% of 2,048 bytes)'
  ]);

  const addSerialLog = (msg: string) => {
    setSerialLogs((prev) => [...prev.slice(-150), msg]);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 4. MOCK AVR PIN TELEMETRY MATRIX
  // ──────────────────────────────────────────────────────────────────────────
  const [pinTelemetry, setPinTelemetry] = useState<PinStateTelemetry[]>([
    { pin: 0, label: 'D0 (RX)', mode: 'INPUT', value: 1, voltage: 5.0, isHigh: true },
    { pin: 1, label: 'D1 (TX)', mode: 'OUTPUT', value: 1, voltage: 5.0, isHigh: true },
    { pin: 2, label: 'D2 (INT0)', mode: 'INPUT_PULLUP', value: 1, voltage: 5.0, isHigh: true },
    { pin: 3, label: 'D3 (~PWM)', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false, pwmDutyPct: 0 },
    { pin: 4, label: 'D4', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false },
    { pin: 5, label: 'D5 (~PWM)', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false, pwmDutyPct: 0 },
    { pin: 6, label: 'D6 (~PWM)', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false, pwmDutyPct: 0 },
    { pin: 7, label: 'D7', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false },
    { pin: 8, label: 'D8', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false },
    { pin: 9, label: 'D9 (~PWM)', mode: 'PWM', value: 128, voltage: 2.5, isHigh: true, pwmDutyPct: 7.5 },
    { pin: 10, label: 'D10 (~SS)', mode: 'OUTPUT', value: 1, voltage: 5.0, isHigh: true },
    { pin: 11, label: 'D11 (MOSI)', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false },
    { pin: 12, label: 'D12 (MISO)', mode: 'INPUT', value: 0, voltage: 0.0, isHigh: false },
    { pin: 13, label: 'D13 (SCK)', mode: 'OUTPUT', value: 0, voltage: 0.0, isHigh: false },
    { pin: 14, label: 'A0', mode: 'ANALOG', value: 512, voltage: 2.5, isHigh: false },
    { pin: 15, label: 'A1', mode: 'ANALOG', value: 0, voltage: 0.0, isHigh: false }
  ]);

  // ──────────────────────────────────────────────────────────────────────────
  // 5. REAL-TIME AVR SIMULATION LOOP (MOCK KINEMATICS & CLOCK STEPPER)
  // ──────────────────────────────────────────────────────────────────────────
  const simDirectionRef = useRef<number>(1);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setVirtualTimeMs((prev) => prev + 50);

      // Kinematic servo motion algorithm (sweep 0..180 deg when running Lesson 02)
      setServoAngle((prevAngle) => {
        let nextAngle = prevAngle + simDirectionRef.current * 2.5;
        if (nextAngle >= 180) {
          nextAngle = 180;
          simDirectionRef.current = -1;
        } else if (nextAngle <= 0) {
          nextAngle = 0;
          simDirectionRef.current = 1;
        }
        return nextAngle;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Periodic Telemetry Tele-Streamer
  useEffect(() => {
    if (!isRunning) return;

    const logInterval = setInterval(() => {
      const pulseUs = Math.round(1000 + (servoAngle / 180) * 1000);
      const dutyPct = +(pulseUs / 20000 * 100).toFixed(2);
      addSerialLog(`[AVR D9] PWM Angle = ${servoAngle.toFixed(1)}° | Pulse = ${pulseUs}µs | Duty = ${dutyPct}%`);

      // Update Pin 9 PWM telemetry
      setPinTelemetry((prev) =>
        prev.map((p) =>
          p.pin === 9
            ? {
                ...p,
                value: Math.round((pulseUs / 20000) * 255),
                voltage: +(5.0 * (dutyPct / 100)).toFixed(2),
                pwmDutyPct: dutyPct
              }
            : p
        )
      );
    }, 1200);

    return () => clearInterval(logInterval);
  }, [isRunning, servoAngle]);

  const handleRunSimulation = () => {
    setIsRunning(true);
    addSerialLog('[SIM] ▶ AVR Simulation running. Hardware clock active at 16.0MHz.');
  };

  const handleStopSimulation = () => {
    setIsRunning(false);
    addSerialLog('[SIM] ⏹ AVR Virtual CPU halted. Timer interrupts suspended.');
  };

  const handleResetSimulation = () => {
    setIsRunning(false);
    setVirtualTimeMs(0);
    setServoAngle(90.0);
    simDirectionRef.current = 1;
    addSerialLog('[RESET] Hardware reset pulse (RESET pin driven LOW). PC=0x0000.');
  };

  const handleVerifyCode = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      addSerialLog('[VERIFY] Compilation successful. Zero syntax or pin mapping errors.');
      setCompilerOutput([
        `avr-g++ -c -g -Os -Wall -mmcu=atmega328p -DF_CPU=16000000L ${activeFile}`,
        'Validating Arduino pin register mappings against ATmega328P header...',
        'Generated Intel HEX binary payload: 2,418 bytes.',
        'Binary status: READY FOR FLASHING.'
      ]);
    }, 450);
  };

  const handleSendSerial = (input: string) => {
    addSerialLog(`[TX] > ${input}`);
    // Respond to user command
    if (input.toUpperCase().startsWith('SET_ANGLE=')) {
      const angle = parseFloat(input.split('=')[1]);
      if (!isNaN(angle)) {
        const clamped = Math.max(0, Math.min(180, angle));
        setServoAngle(clamped);
        addSerialLog(`[AVR] Acknowledged: Target servo angle set to ${clamped.toFixed(1)}°`);
      }
    } else {
      addSerialLog(`[AVR] Command '${input}' received. Echo ACK 0x06.`);
    }
  };

  // Dedicated Full-Viewport 3D CAD & STL Prototyping Studio route
  if (isCadStudio) {
    return <CadStudioPage />;
  }

  // Calculate live telemetry values
  const pulseWidthUs = Math.round(1000 + (servoAngle / 180) * 1000);
  const pwmDutyPct = +(pulseWidthUs / 20000 * 100);
  const currentMa = +(120 + Math.abs(simDirectionRef.current) * 25.5).toFixed(1);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#09090B] text-[#F4F4F5] flex flex-col font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: TOP TELEMETRY HEADER (40px FIXED)
      ───────────────────────────────────────────────────────────── */}
      <TopBar
        currentLab={currentLab}
        currentLesson={currentLesson}
        isRunning={isRunning}
        isPaused={false}
        virtualTimeMs={virtualTimeMs}
        onRunSimulation={handleRunSimulation}
        onStopSimulation={handleStopSimulation}
        onResetSimulation={handleResetSimulation}
        onVerifyCode={handleVerifyCode}
        onOpenCurriculumDrawer={() => setSidebarOpen(true)}
        isVerifying={isVerifying}
      />

      {/* ─────────────────────────────────────────────────────────────
          ZONES 2, 3, 4: RESIZABLE 3-PANE WORKSPACE BODY
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full h-[calc(100vh-40px)] flex overflow-hidden">
        {/* ZONE 2: LEFT ACTIVITY RAIL (48px) + COLLAPSIBLE DRAWER (300px) */}
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
            {/* ZONE 3: CENTER CODE WORKSPACE (VERTICAL RESIZABLE SPLIT) */}
            <Panel defaultSize={48} minSize={25} className="h-full">
              <CodeWorkspace
                files={files}
                activeFile={activeFile}
                onSelectFile={setActiveFile}
                onCodeChange={handleCodeChange}
                serialLogs={serialLogs}
                onSendSerial={handleSendSerial}
                onClearSerial={() => setSerialLogs([])}
                baudRate={baudRate}
                onBaudRateChange={setBaudRate}
                pinTelemetry={pinTelemetry}
                compilerOutput={compilerOutput}
              />
            </Panel>

            {/* HAIRLINE HORIZONTAL PANEL RESIZE HANDLE */}
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
                isRunning={isRunning}
                onManualAngleChange={(ang) => setServoAngle(ang)}
              />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
};

export default App;
