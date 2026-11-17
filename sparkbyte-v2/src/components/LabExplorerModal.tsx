import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Layers, 
  Lightbulb, 
  Cpu, 
  ToggleLeft, 
  Sliders, 
  Volume2, 
  Box, 
  Activity, 
  Sun, 
  Palette, 
  Thermometer, 
  Radar, 
  Compass, 
  CloudRain, 
  Flame, 
  Tv, 
  Monitor, 
  Sprout, 
  Cog, 
  Navigation, 
  Radio, 
  Wifi,
  ChevronRight
} from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { ALL_LABS } from '../data/lessons';
import { GradeLevel, Lab } from '../types/curriculum';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Cpu,
  ToggleLeft,
  Sliders,
  Volume2,
  Box,
  Activity,
  Sun,
  Palette,
  Thermometer,
  Radar,
  Compass,
  Layers,
  CloudRain,
  Flame,
  Tv,
  Monitor,
  Sprout,
  Cog,
  Navigation,
  Radio,
  Wifi
};

export const LabExplorerModal: React.FC = () => {
  const { explorerModalOpen, setExplorerModalOpen, activeLabId, setActiveLab } = useWorkbenchStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | GradeLevel>('all');

  const filteredLabs = useMemo(() => {
    return ALL_LABS.filter((lab) => {
      const matchGrade = selectedGrade === 'all' || lab.grade === selectedGrade;
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        lab.name.toLowerCase().includes(term) ||
        lab.description.toLowerCase().includes(term) ||
        lab.id.toLowerCase().includes(term);
      return matchGrade && matchSearch;
    });
  }, [searchTerm, selectedGrade]);

  if (!explorerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                ATL Learning Labs Catalog
              </h2>
              <p className="text-xs text-slate-400">
                22 physical computing, sensor telemetry, CAD & robotics labs across Grades 6 to 12
              </p>
            </div>
          </div>

          <button
            onClick={() => setExplorerModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row gap-2 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 stroke-[1.5]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sensors, actuators, CAD (e.g. servo, sonar, OLED)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Grade Level Pills */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedGrade === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All 22 Labs
            </button>
            <button
              onClick={() => setSelectedGrade('6-8')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedGrade === '6-8'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Level 1 (6–8)
            </button>
            <button
              onClick={() => setSelectedGrade('9-10')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedGrade === '9-10'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Level 2 (9–10)
            </button>
            <button
              onClick={() => setSelectedGrade('11-12')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                selectedGrade === '11-12'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Level 3 (11–12)
            </button>
          </div>
        </div>

        {/* Labs Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLabs.map((lab: Lab) => {
            const IconComponent = ICON_MAP[lab.iconName] || Cpu;
            const isSelected = lab.id === activeLabId;

            return (
              <div
                key={lab.id}
                onClick={() => {
                  setActiveLab(lab.id);
                  setExplorerModalOpen(false);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500/80 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        isSelected ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                      }`}>
                        <IconComponent className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <span className="font-semibold text-xs text-slate-100 group-hover:text-white">
                        {lab.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {lab.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {lab.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                  <span>{lab.lessons.length} Structured Lessons</span>
                  <span className="flex items-center gap-0.5 text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
                    {isSelected ? 'Current Lab' : 'Select Lab'}
                    <ChevronRight className="w-3 h-3 stroke-[2]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: You can change labs anytime via the top navigation bar.</span>
          <button
            onClick={() => setExplorerModalOpen(false)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
