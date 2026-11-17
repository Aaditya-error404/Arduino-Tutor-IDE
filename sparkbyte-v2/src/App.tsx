/**
 * SparkByte Studio v2 Main Application
 * Canvas-First "Focus Stage + Floating HUD" Engineering Workbench
 *
 * Full-bleed interactive circuit canvas with floating collapsible HUD panels:
 * - Slim 44px Top Navigation Bar (Brand + Lab Selector + Stepper + Tools)
 * - Full-Viewport Hardware Focus Stage (#0B1120 dot-grid + Floating Top Simulation Pill)
 * - Floating Left Code & Translator HUD (Monaco C++ / Split view, expandable to 62% width)
 * - Slide-Over Lesson Guide & Wiring Drawer
 * - Bottom-Left Collapsible Diagnostic Bar (Oscilloscope & Serial Monitor)
 * - Bottom-Right Floating Sparky AI Coach Popover
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState, useEffect } from 'react';
import { TopUtilityBar } from './components/TopUtilityBar';
import { HardwareStage } from './components/HardwareStage';
import { DualCodeDesk } from './components/DualCodeDesk';
import { LessonGuideDrawer } from './components/LessonGuideDrawer';
import { DiagnosticBar } from './components/DiagnosticBar';
import { AiCoachPanel } from './components/AiCoachPanel';
import { LabExplorerModal } from './components/LabExplorerModal';
import { AboutModal } from './components/AboutModal';
import { useWorkbenchStore } from './store/useWorkbenchStore';
import { CadStudioPage } from './pages/CadStudioPage';

export const App: React.FC = () => {
  const { aboutModalOpen, setAboutModalOpen } = useWorkbenchStore();

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

  // Dedicated Full-Viewport 3D CAD & STL Prototyping Studio (Zero simulator overhead)
  if (isCadStudio) {
    return <CadStudioPage />;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 44px Slim Top Navigation Bar */}
      <TopUtilityBar />

      {/* Main Full-Viewport Canvas & Floating HUD Workbench */}
      <main className="flex-1 w-full h-[calc(100vh-44px)] relative overflow-hidden">
        {/* Full-Bleed Hardware Focus Stage (Canvas-First) */}
        <HardwareStage />

        {/* Floating Left Code & Translator HUD */}
        <DualCodeDesk />

        {/* Slide-Over Lesson Guide & Hardware Wiring Drawer */}
        <LessonGuideDrawer />

        {/* Bottom Collapsible Diagnostic Bar (Oscilloscope & Serial Monitor) */}
        <DiagnosticBar />

        {/* Bottom-Right Floating Sparky AI Coach Popover */}
        <AiCoachPanel />
      </main>

      {/* Instant Search 22-Lab Catalog Modal */}
      <LabExplorerModal />

      {/* Commercial License & About Modal */}
      <AboutModal
        open={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
};

export default App;
