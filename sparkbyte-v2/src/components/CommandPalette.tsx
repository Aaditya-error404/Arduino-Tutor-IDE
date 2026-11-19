/**
 * SparkByte Studio v2 · Industrial Command Palette (Ctrl+K / ⌘K)
 *
 * Anti-"AI Slop" Engineering Disciplines:
 * - 1px hairline borders (#27272A), deep background (#121215), machined 2px radius
 * - Keyboard-first workflow (Arrow keys, Enter, Esc)
 * - Fast fuzzy search across all 22 ATL labs, simulation controls, and CAD tools
 *
 * © 2026 SparkByte Studio · Principal Systems Engineering Architecture
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  Compass,
  Box,
  Maximize2,
  Cpu,
  Layers,
  Terminal,
  CornerDownLeft
} from 'lucide-react';
import { CURRICULUM_DATA, LabSpec, LessonSpec, LAB_INDEX_TO_STORE_ID } from '../data/mockCurriculum';

export interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'SIMULATION' | 'CAD' | 'PANEL';
  title: string;
  subtitle?: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lab: LabSpec, lesson: LessonSpec) => void;
  onRunSimulation: () => void;
  onStopSimulation: () => void;
  onResetSimulation: () => void;
  onVerifyCode: () => void;
  onToggleSidebar: () => void;
  onToggleConsole: () => void;
  onToggleCadViewport: () => void;
  onToggleCadMode?: () => void;
  onResetCamera?: () => void;
  isRunning: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onRunSimulation,
  onStopSimulation,
  onResetSimulation,
  onVerifyCode,
  onToggleSidebar,
  onToggleConsole,
  onToggleCadViewport,
  onToggleCadMode,
  onResetCamera,
  isRunning
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command registry
  const commands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Simulation Commands
      isRunning
        ? {
            id: 'sim-stop',
            category: 'SIMULATION',
            title: 'Halt Simulation',
            subtitle: 'Pause AVR clock ticks and suspend timer interrupts',
            shortcut: 'Space',
            icon: <Square className="w-3.5 h-3.5 text-[#EF4444]" />,
            action: () => { onStopSimulation(); onClose(); }
          }
        : {
            id: 'sim-run',
            category: 'SIMULATION',
            title: 'Run Simulation',
            subtitle: 'Start real-time ATmega328P clock ticks at 16.0MHz',
            shortcut: 'Space',
            icon: <Play className="w-3.5 h-3.5 text-[#F59E0B]" />,
            action: () => { onRunSimulation(); onClose(); }
          },
      {
        id: 'sim-reset',
        category: 'SIMULATION',
        title: 'Reset Hardware & Registers',
        subtitle: 'Drive RESET pin LOW, clear registers, PC=0x0000',
        shortcut: 'Ctrl+R',
        icon: <RotateCcw className="w-3.5 h-3.5 text-[#A1A1AA]" />,
        action: () => { onResetSimulation(); onClose(); }
      },
      {
        id: 'sim-verify',
        category: 'SIMULATION',
        title: 'Verify & Compile C++ Sketch',
        subtitle: 'Validate syntax, pin definitions, and hoist variables',
        shortcut: 'Ctrl+Enter',
        icon: <CheckCircle className="w-3.5 h-3.5 text-[#06B6D4]" />,
        action: () => { onVerifyCode(); onClose(); }
      },

      // CAD & Viewport Commands
      {
        id: 'cad-toggle-mode',
        category: 'CAD',
        title: 'Toggle Viewport Mode (3D CAD ↔ Circuit)',
        subtitle: 'Switch between 3D mechanical WebGL assembly and 2D electronic schematic',
        shortcut: 'C',
        icon: <Box className="w-3.5 h-3.5 text-[#F59E0B]" />,
        action: () => { onToggleCadMode?.(); onClose(); }
      },
      {
        id: 'cad-reset-cam',
        category: 'CAD',
        title: 'Reset 3D Camera (Zoom to Fit)',
        subtitle: 'Snap camera back to default isometric orientation (Z-up)',
        shortcut: 'F',
        icon: <Compass className="w-3.5 h-3.5 text-[#06B6D4]" />,
        action: () => { onResetCamera?.(); onClose(); }
      },

      // Panels
      {
        id: 'panel-sidebar',
        category: 'PANEL',
        title: 'Toggle Left Curriculum Sidebar',
        subtitle: 'Show or minimize the 22-lab tree and BOM datasheet',
        shortcut: 'Ctrl+B',
        icon: <Layers className="w-3.5 h-3.5 text-[#A1A1AA]" />,
        action: () => { onToggleSidebar(); onClose(); }
      },
      {
        id: 'panel-console',
        category: 'PANEL',
        title: 'Toggle Bottom Console Drawer',
        subtitle: 'Show or minimize Serial Monitor, Pin States, and Scope',
        shortcut: 'Ctrl+J',
        icon: <Terminal className="w-3.5 h-3.5 text-[#A1A1AA]" />,
        action: () => { onToggleConsole(); onClose(); }
      },
      {
        id: 'panel-cad',
        category: 'PANEL',
        title: 'Toggle Right CAD & Simulation Viewport',
        subtitle: 'Show or minimize the 3D WebGL viewport canvas',
        shortcut: 'Ctrl+E',
        icon: <Maximize2 className="w-3.5 h-3.5 text-[#A1A1AA]" />,
        action: () => { onToggleCadViewport(); onClose(); }
      }
    ];

    // Add all 22 labs to navigation
    CURRICULUM_DATA.forEach((lab) => {
      const storeId = LAB_INDEX_TO_STORE_ID[lab.id] || 'servo';
      list.push({
        id: `lab-${lab.id}`,
        category: 'NAVIGATION',
        title: `Jump to ${lab.code}: ${lab.title}`,
        subtitle: `Store: ${storeId.toUpperCase()} • ${lab.lessons.length} lessons • BOM: ${lab.bom.map((b) => b.partNumber).join(', ')}`,
        icon: <Cpu className="w-3.5 h-3.5 text-[#06B6D4]" />,
        action: () => {
          onSelectLesson(lab, lab.lessons[0]);
          onClose();
        }
      });
    });

    return list;
  }, [
    isRunning,
    onRunSimulation,
    onStopSimulation,
    onResetSimulation,
    onVerifyCode,
    onToggleSidebar,
    onToggleConsole,
    onToggleCadViewport,
    onToggleCadMode,
    onResetCamera,
    onSelectLesson,
    onClose
  ]);

  // Filter commands by query
  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q))
    );
  }, [commands, query]);

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Keep selected item in view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] bg-[#121215] border border-[#27272A] rounded-sm shadow-2xl overflow-hidden font-sans text-xs flex flex-col max-h-[460px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#27272A] bg-[#18181B]">
          <Search className="w-4 h-4 text-[#71717A] shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, lab code (e.g. LED, SERVO, SONAR), or tool..."
            className="flex-1 bg-transparent text-[#F4F4F5] placeholder-[#71717A] outline-none font-mono text-[11.5px]"
          />
          <kbd className="px-1.5 py-0.5 rounded-sm bg-[#27272A] text-[#A1A1AA] font-mono text-[9.5px]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-transparent">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-[#71717A] font-mono text-[11px]">
              No commands or labs matching "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-sm cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#27272A] text-[#F4F4F5]'
                      : 'text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="truncate">
                      <div className="font-mono text-[11px] font-semibold text-[#F4F4F5] truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[10px] text-[#71717A] truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span className="font-mono text-[9px] uppercase px-1 py-0.5 rounded-sm bg-[#18181B] border border-[#27272A] text-[#71717A]">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded-sm bg-[#18181B] border border-[#3F3F46] text-[#A1A1AA] font-mono text-[9px]">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3 h-3 text-[#F59E0B]" strokeWidth={1.5} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="h-6 bg-[#09090B] border-t border-[#27272A] px-3 flex items-center justify-between font-mono text-[9.5px] text-[#71717A]">
          <div className="flex items-center gap-3">
            <span><strong className="text-[#A1A1AA]">↑↓</strong> Navigate</span>
            <span><strong className="text-[#A1A1AA]">↵</strong> Select</span>
            <span><strong className="text-[#A1A1AA]">Esc</strong> Close</span>
          </div>
          <span className="text-[#A1A1AA]">{filtered.length} Commands Available</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
