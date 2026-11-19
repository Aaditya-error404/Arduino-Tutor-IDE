/**
 * Industrial-Grade Activity Rail (48px) + Collapsible Technical Drawer (300px)
 *
 * Strict Visual Discipline:
 * - Anti-"AI Slop": No rounded cards, no glassmorphism, no gradient blobs.
 * - Dense, collapsible tree view with monospace telemetry and completion indicators.
 * - Tabs: Curriculum (22 Labs / 88 Lessons), Lesson Guide, Component BOM, Pinout Datasheet.
 */

import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  Package,
  Cpu,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Filter
} from 'lucide-react';
import {
  CURRICULUM_DATA,
  LabSpec,
  LessonSpec,
  LAB_CATEGORIES,
  TOTAL_LABS,
  TOTAL_LESSONS
} from '../data/mockCurriculum';

export type SidebarTab = 'curriculum' | 'guide' | 'bom' | 'pinout';

interface SidebarTreeProps {
  currentLab: LabSpec;
  currentLesson: LessonSpec;
  onSelectLesson: (lab: LabSpec, lesson: LessonSpec) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const SidebarTree: React.FC<SidebarTreeProps> = ({
  currentLab,
  currentLesson,
  onSelectLesson,
  isOpen,
  onToggleOpen
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('curriculum');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL CATEGORIES');
  const [expandedLabIds, setExpandedLabIds] = useState<Record<string, boolean>>({
    [currentLab.id]: true
  });

  const toggleLabExpand = (labId: string) => {
    setExpandedLabIds((prev) => ({
      ...prev,
      [labId]: !prev[labId]
    }));
  };

  // Filter labs by search query and category
  const filteredLabs = CURRICULUM_DATA.filter((lab) => {
    const matchesCategory =
      selectedCategory === 'ALL CATEGORIES' || lab.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.lessons.some((les) => les.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full select-none shrink-0 bg-[#09090B] border-r border-[#27272A] z-20">
      {/* ─────────────────────────────────────────────────────────────
          1. 48px FIXED ACTIVITY RAIL
      ───────────────────────────────────────────────────────────── */}
      <div className="w-[48px] bg-[#121215] border-r border-[#27272A] flex flex-col items-center py-2.5 justify-between shrink-0">
        {/* Top Rail Navigation Icons */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          {/* CURRICULUM TREE TAB */}
          <button
            onClick={() => {
              setActiveTab('curriculum');
              if (!isOpen) onToggleOpen();
            }}
            className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors relative ${
              isOpen && activeTab === 'curriculum'
                ? 'bg-[#27272A] text-[#F59E0B] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
            }`}
            title="Curriculum Structure (22 Labs // 88 Lessons)"
          >
            <Layers className="w-4 h-4" strokeWidth={1.5} />
            {isOpen && activeTab === 'curriculum' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#F59E0B]" />
            )}
          </button>

          {/* LESSON GUIDE TAB */}
          <button
            onClick={() => {
              setActiveTab('guide');
              if (!isOpen) onToggleOpen();
            }}
            className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors relative ${
              isOpen && activeTab === 'guide'
                ? 'bg-[#27272A] text-[#F59E0B] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
            }`}
            title="Active Lesson Guide & Step Instructions"
          >
            <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            {isOpen && activeTab === 'guide' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#F59E0B]" />
            )}
          </button>

          {/* COMPONENT BOM TAB */}
          <button
            onClick={() => {
              setActiveTab('bom');
              if (!isOpen) onToggleOpen();
            }}
            className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors relative ${
              isOpen && activeTab === 'bom'
                ? 'bg-[#27272A] text-[#06B6D4] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
            }`}
            title="Hardware Bill of Materials (BOM)"
          >
            <Package className="w-4 h-4" strokeWidth={1.5} />
            {isOpen && activeTab === 'bom' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#06B6D4]" />
            )}
          </button>

          {/* PINOUT DATASHEET TAB */}
          <button
            onClick={() => {
              setActiveTab('pinout');
              if (!isOpen) onToggleOpen();
            }}
            className={`w-9 h-9 rounded-sm flex items-center justify-center transition-colors relative ${
              isOpen && activeTab === 'pinout'
                ? 'bg-[#27272A] text-[#06B6D4] border border-[#3F3F46]'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
            }`}
            title="ATmega328P Pinout & Signal Mapping"
          >
            <Cpu className="w-4 h-4" strokeWidth={1.5} />
            {isOpen && activeTab === 'pinout' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#06B6D4]" />
            )}
          </button>
        </div>

        {/* Bottom Drawer Collapse / Expand Toggle */}
        <button
          onClick={onToggleOpen}
          className="w-9 h-9 rounded-sm flex items-center justify-center text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#18181B] transition-colors"
          title={isOpen ? 'Collapse Sidebar Drawer' : 'Expand Sidebar Drawer'}
        >
          {isOpen ? (
            <PanelLeftClose className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <PanelLeftOpen className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. COLLAPSIBLE DRAWER CONTENT (300px)
      ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="w-[300px] bg-[#09090B] flex flex-col h-full overflow-hidden text-[#F4F4F5]">
          {/* Drawer Header */}
          <div className="h-[36px] bg-[#121215] border-b border-[#27272A] px-3 flex items-center justify-between shrink-0">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
              {activeTab === 'curriculum' && (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#F59E0B]" strokeWidth={1.5} />
                  <span>CURRICULUM TREE ({TOTAL_LABS} LABS)</span>
                </>
              )}
              {activeTab === 'guide' && (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" strokeWidth={1.5} />
                  <span>LESSON SPECIFICATION</span>
                </>
              )}
              {activeTab === 'bom' && (
                <>
                  <Package className="w-3.5 h-3.5 text-[#06B6D4]" strokeWidth={1.5} />
                  <span>HARDWARE BOM LIST</span>
                </>
              )}
              {activeTab === 'pinout' && (
                <>
                  <Cpu className="w-3.5 h-3.5 text-[#06B6D4]" strokeWidth={1.5} />
                  <span>AVR PINOUT MAPPINGS</span>
                </>
              )}
            </span>
            <span className="font-mono text-[10px] text-[#71717A]">
              {TOTAL_LESSONS} LESSONS
            </span>
          </div>

          {/* TAB 1: CURRICULUM TECHNICAL TREE */}
          {activeTab === 'curriculum' && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Search & Filter Bar */}
              <div className="p-2 border-b border-[#27272A] bg-[#121215]/50 space-y-1.5">
                <div className="relative">
                  <Search className="w-3 h-3 text-[#71717A] absolute left-2 top-2.5" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search labs, sensors, C++..."
                    className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#F59E0B] rounded-sm pl-7 pr-2 py-1 text-xs font-mono text-[#F4F4F5] placeholder-[#71717A] outline-none transition-colors"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#71717A] shrink-0" strokeWidth={1.5} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-sm px-1.5 py-0.5 text-[10.5px] font-mono text-[#A1A1AA] outline-none"
                  >
                    {LAB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#121215]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dense Tree List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#27272A]/40 text-xs">
                {filteredLabs.map((lab) => {
                  const isExpanded = Boolean(expandedLabIds[lab.id]);
                  const isCurrentLab = lab.id === currentLab.id;
                  const completedCount = lab.lessons.filter((l) => l.completed).length;

                  return (
                    <div key={lab.id} className="bg-[#09090B]">
                      {/* Lab Header Item */}
                      <button
                        onClick={() => toggleLabExpand(lab.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 text-left hover:bg-[#18181B] transition-colors group ${
                          isCurrentLab ? 'bg-[#121215] border-l-2 border-[#F59E0B]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 pr-1">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#71717A] shrink-0" strokeWidth={1.5} />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#71717A] shrink-0" strokeWidth={1.5} />
                          )}
                          <span className="font-mono text-[10.5px] font-bold text-[#F59E0B] shrink-0">
                            {lab.code}
                          </span>
                          <span className="font-mono text-[11px] text-[#E4E4E7] truncate group-hover:text-white">
                            {lab.title}
                          </span>
                        </div>

                        {/* Progress Badge */}
                        <span className="font-mono text-[10px] text-[#A1A1AA] shrink-0 tabular-nums">
                          {completedCount}/4
                        </span>
                      </button>

                      {/* Collapsible Lessons */}
                      {isExpanded && (
                        <div className="bg-[#121215]/60 pl-5 pr-1 py-1 space-y-0.5 border-t border-[#27272A]/40">
                          {lab.lessons.map((lesson) => {
                            const isCurrentLesson =
                              isCurrentLab && lesson.id === currentLesson.id;

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => onSelectLesson(lab, lesson)}
                                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-sm text-left transition-colors font-mono text-[11px] group ${
                                  isCurrentLesson
                                    ? 'bg-[#27272A] text-[#F59E0B] font-semibold border border-[#3F3F46]'
                                    : 'text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#F4F4F5]'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {lesson.completed ? (
                                    <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0" strokeWidth={2} />
                                  ) : (
                                    <Circle className="w-3 h-3 text-[#52525B] shrink-0" strokeWidth={1.5} />
                                  )}
                                  <span className="text-[#71717A] text-[10px] shrink-0">
                                    #{String(lesson.globalIndex).padStart(2, '0')}
                                  </span>
                                  <span className="truncate group-hover:text-[#F4F4F5]">
                                    {lesson.title}
                                  </span>
                                </div>

                                <span className="text-[9px] uppercase px-1 rounded-sm bg-[#18181B] border border-[#27272A] text-[#71717A] shrink-0 ml-1">
                                  {lesson.difficulty}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LESSON GUIDE & STEP INSTRUCTIONS */}
          {activeTab === 'guide' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#F59E0B] uppercase font-bold tracking-wider">
                  {currentLab.code} // LESSON {currentLesson.lessonIndex} OF 4
                </span>
                <h3 className="font-bold text-sm text-[#F4F4F5] leading-snug">
                  {currentLesson.title}
                </h3>
              </div>

              {/* Learning Objective Box */}
              <div className="p-2.5 rounded-sm bg-[#121215] border border-[#27272A] space-y-1">
                <span className="font-mono text-[10px] text-[#06B6D4] uppercase font-bold">
                  OBJECTIVE
                </span>
                <p className="text-[11.5px] text-[#D4D4D8] leading-relaxed">
                  {currentLesson.learningObjective}
                </p>
              </div>

              {/* Theory Summary */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#71717A] uppercase font-bold tracking-wider">
                  ENGINEERING PRINCIPLE
                </span>
                <p className="text-[11.5px] text-[#A1A1AA] leading-relaxed">
                  {currentLesson.theorySummary}
                </p>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="space-y-2 pt-1 border-t border-[#27272A]">
                <span className="font-mono text-[10px] text-[#71717A] uppercase font-bold tracking-wider">
                  EXECUTION PROCEDURE
                </span>
                <ol className="space-y-2">
                  {currentLesson.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11.5px] text-[#D4D4D8]">
                      <span className="font-mono text-[10px] bg-[#18181B] border border-[#27272A] w-4 h-4 rounded-sm flex items-center justify-center text-[#F59E0B] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: BILL OF MATERIALS (BOM) */}
          {activeTab === 'bom' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div>
                <span className="font-mono text-[10px] text-[#06B6D4] font-bold uppercase tracking-wider">
                  HARDWARE BILL OF MATERIALS
                </span>
                <h4 className="text-xs font-bold text-[#F4F4F5] mt-0.5">
                  {currentLab.code}: {currentLab.title}
                </h4>
              </div>

              <div className="space-y-2">
                {currentLab.bom.map((item, idx) => (
                  <div key={idx} className="p-2 bg-[#121215] border border-[#27272A] rounded-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] text-[#F59E0B]">
                        {item.designator}
                      </span>
                      <span className="font-mono text-[10px] text-[#A1A1AA] bg-[#18181B] px-1 border border-[#27272A] rounded-sm">
                        {item.package}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#F4F4F5]">
                      {item.partNumber}
                    </div>
                    <p className="text-[10.5px] text-[#A1A1AA] leading-tight">
                      {item.description}
                    </p>
                    <div className="font-mono text-[9.5px] text-[#71717A] pt-0.5 border-t border-[#27272A]/60">
                      RATING: {item.operatingVoltage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PINOUT DATASHEET */}
          {activeTab === 'pinout' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#06B6D4] font-bold uppercase tracking-wider">
                  ATMEGA328P PINOUT SPECIFICATION
                </span>
                <h4 className="text-xs font-bold text-[#F4F4F5] mt-0.5">
                  CIRCUIT NETLIST CONNECTIONS
                </h4>
              </div>

              <div className="space-y-1.5">
                {currentLab.pinout.map((p, idx) => (
                  <div key={idx} className="p-2 bg-[#121215] border border-[#27272A] rounded-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11.5px] text-[#F59E0B]">
                        PIN {p.pin}
                      </span>
                      <span
                        className={`text-[9.5px] px-1 py-0.2 rounded-sm border ${
                          p.direction === 'PWM'
                            ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30'
                            : p.direction === 'OUTPUT'
                            ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                            : 'bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]'
                        }`}
                      >
                        {p.direction}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#F4F4F5]">
                      {p.name} • {p.signal}
                    </div>
                    <div className="text-[10px] text-[#71717A] truncate">
                      DEST: {p.hardwareDestination}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
