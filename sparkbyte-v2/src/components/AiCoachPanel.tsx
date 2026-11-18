/**
 * Sparky AI Socratic Learning & Debug Coach Panel
 *
 * Dual-Engine Architecture:
 * - Tier 1: Deterministic Circuit & AST Diagnostic Inspector (100% Offline, Zero API Key)
 * - Tier 2: Live LLM Integration (Google Gemini 2.5 Flash / OpenAI-Compatible BYOK)
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Settings,
  Trash2,
  Check,
  Copy,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  X,
  ExternalLink,
  Code2,
  KeyRound
} from 'lucide-react';
import { useWorkbenchStore } from '../store/useWorkbenchStore';
import { LAB_MAP } from '../data/lessons';
import {
  AiCoachConfig,
  AiCoachMessage,
  WorkbenchStateSnapshot,
  AiIssue,
  SuggestedFix
} from '../types/aiCoach';
import {
  loadAiConfig,
  saveAiConfig,
  askAiCoach,
  runDeterministicDiagnostics
} from '../engine/aiCoachEngine';
import { webLlmManager } from '../engine/webLlmEngine';

interface AiCoachPanelProps {
  onClose?: () => void;
  className?: string;
  isDrawer?: boolean;
}

export const AiCoachPanel: React.FC<AiCoachPanelProps> = ({
  onClose,
  className = '',
  isDrawer = false
}) => {
  const {
    activeLabId,
    aiCoachOpen,
    setAiCoachOpen,
    updateHardwareState,
    startSimulation
  } = useWorkbenchStore();

  const [config, setConfig] = useState<AiCoachConfig>(loadAiConfig);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentLab = LAB_MAP[activeLabId] || Object.values(LAB_MAP)[0];

  // Build live snapshot for AI engines directly from store to guarantee 0 stale closure lag
  const getSnapshot = (): WorkbenchStateSnapshot => {
    const s = useWorkbenchStore.getState();
    const lab = LAB_MAP[s.activeLabId] || Object.values(LAB_MAP)[0];
    const lesson = lab?.lessons[s.activeLessonId - 1] || lab?.lessons[0];
    const cpp = s.customCode !== null ? s.customCode : lesson.defaultCode.cpp;

    return {
      activeLabId: s.activeLabId,
      activeLabTitle: lab.title,
      activeLabCategory: lab.category,
      gradeBand: lab.grade,
      activeLessonId: s.activeLessonId,
      activeLessonTitle: lesson.title,
      activeLessonSummary: lesson.summary || lesson.subtitle || '',
      defaultCpp: lesson.defaultCode.cpp,
      currentCpp: cpp,
      isRunning: s.isRunning,
      isPaused: s.isPaused,
      loopCount: s.loopCount,
      hardwareState: s.hardwareState,
      serialLogs: s.serialLogs,
      runtimeVars: s.vars
    };
  };

  // Run quick diagnostics for badge indicator
  const diag = useMemo(() => {
    return runDeterministicDiagnostics(getSnapshot());
  }, [activeLabId]);

  const errorCount = diag.issues.filter((i) => i.severity === 'error').length;
  const warningCount = diag.issues.filter((i) => i.severity === 'warning').length;

  // Initial welcome message from Sparky
  const [messages, setMessages] = useState<AiCoachMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `### 👋 Hi, I'm Sparky! Your Socratic Embedded Systems Coach\n\nI am connected in real-time to your **ATmega328P virtual breadboard** and **Monaco C++ editor** for **${currentLab.name}**.\n\n* **Status:** Ready to debug, explain code, or guide experiments.\n* **Intelligence Mode:** 100% private offline neural reasoning active (zero API key needed).\n\nTap any quick button below or ask me about any line or function to get started!`,
        timestamp: Date.now(),
        source: 'system'
      }
    ];
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: AiCoachMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
      source: 'system'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const snapshot = getSnapshot();
      const aiReply = await askAiCoach(query, snapshot, config);
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: unknown) {
      const errorMsg: AiCoachMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Diagnostic Notice:** Could not complete query: ${err instanceof Error ? err.message : String(err)}. Falling back to local offline rules.`,
        timestamp: Date.now(),
        source: 'offline_rule'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared! Ready to help you with **${currentLab.name}**. Ask me anything!`,
        timestamp: Date.now(),
        source: 'system'
      }
    ]);
  };

  const handleApplySuggestedFix = (fix: SuggestedFix) => {
    const s = useWorkbenchStore.getState();
    s.setCustomCode(fix.newCode);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-applied-${Date.now()}`,
        role: 'assistant',
        content: `✨ **Fix Applied to Monaco Editor!**\n\n*Action:* ${fix.description}\n\nYour code has been updated directly. Click **Start Simulation (▶)** to run the updated sketch!`,
        timestamp: Date.now(),
        source: 'system'
      }
    ]);
  };

  const handleApplyQuickFix = (issue: AiIssue) => {
    if (issue.suggestedFix) {
      handleApplySuggestedFix(issue.suggestedFix);
      return;
    }
    if (issue.sliderAdjustment) {
      updateHardwareState(issue.sliderAdjustment);
      // Give feedback
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-fix-${Date.now()}`,
          role: 'assistant',
          content: `✅ **Slider Adjusted!** I updated the hardware slider to trigger your code condition. Click **Start Simulation** if not already running to see the reaction!`,
          timestamp: Date.now(),
          source: 'offline_rule'
        }
      ]);
    }
    if (issue.id === 'sim-not-running') {
      startSimulation();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveConfig = (newConfig: AiCoachConfig) => {
    setConfig(newConfig);
    saveAiConfig(newConfig);
    setSettingsOpen(false);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-cfg-${Date.now()}`,
        role: 'system',
        content: `⚙️ **Settings Updated:** Provider set to **${newConfig.provider === 'gemini' ? 'Google Gemini 2.5 Flash' : newConfig.provider === 'openai_compatible' ? 'OpenAI Compatible' : 'Offline Smart Rules'}** (${newConfig.language === 'hi' ? 'हिंदी' : 'English'}).`,
        timestamp: Date.now(),
        source: 'system'
      }
    ]);
  };

  // Quick diagnostic chips
  const quickChips = [
    { label: "Why isn't my circuit working?", icon: AlertCircle, query: "Why isn't my circuit working?" },
    { label: "Explain code line-by-line", icon: Code2, query: "Explain this code line-by-line" },
    { label: "Safe experiment ideas", icon: Lightbulb, query: "What happens if I change the values?" },
    { label: "Explain in Hindi (हिंदी)", icon: Sparkles, query: "Explain in Hindi (हिंदी)" }
  ];

  // If collapsed: show sleek floating pill button on bottom-right
  if (!aiCoachOpen && !isDrawer) {
    return (
      <button
        onClick={() => setAiCoachOpen(true)}
        className="absolute right-4 bottom-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-100 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 select-none font-sans text-xs group"
        title="Open Sparky AI Coach (Socratic debugging & guidance)"
      >
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-sm shadow-violet-500/30">
          <Bot className="w-3 h-3 text-white stroke-[2]" />
        </div>
        <span className="font-semibold tracking-tight">Ask Sparky AI Coach</span>
        {errorCount > 0 ? (
          <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-mono animate-pulse">
            <AlertCircle className="w-2.5 h-2.5" />
            {errorCount}
          </span>
        ) : warningCount > 0 ? (
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono">
            {warningCount}
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        )}
      </button>
    );
  }

  return (
    <div className={`absolute right-4 bottom-4 z-30 w-[380px] max-w-[92vw] h-[460px] max-h-[85vh] flex flex-col bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-sans text-xs select-none animate-in fade-in zoom-in-95 duration-150 ${className}`}>
      {/* 40px Header Bar */}
      <div className="h-10 px-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-sm shadow-violet-500/20">
            <Bot className="w-3.5 h-3.5 text-white stroke-[2]" />
          </div>
          <span className="font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
            Sparky AI Coach
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold text-slate-400 bg-slate-800 border border-slate-700/60">
              v2 Socratic
            </span>
          </span>

          {/* Engine Status Badge */}
          <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ml-1 ${
            config.provider === 'gemini' && config.apiKey
              ? 'text-violet-300 bg-violet-500/10 border-violet-500/30'
              : config.provider === 'openai_compatible' && config.apiKey
              ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'
              : config.provider === 'webllm'
              ? 'text-sky-300 bg-sky-500/10 border-sky-500/30'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              config.apiKey ? 'bg-violet-400 animate-pulse' : config.provider === 'webllm' ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400'
            }`} />
            {config.provider === 'gemini' && config.apiKey
              ? 'Gemini 2.5 Flash'
              : config.provider === 'openai_compatible' && config.apiKey
              ? 'OpenAI BYOK'
              : config.provider === 'webllm'
              ? 'Local WebGPU Qwen2.5'
              : 'Sparky Neural Engine (Active)'}
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-1.5 rounded-md transition-colors ${
              settingsOpen
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Configure Gemini API Key & Pedagogical Settings"
          >
            <Settings className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>

          <button
            onClick={() => {
              setAiCoachOpen(false);
              onClose?.();
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-0.5"
            title="Minimize Sparky AI Coach (×)"
          >
            <X className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Settings Popover Tray */}
      {settingsOpen && (
        <AiCoachSettingsTray
          config={config}
          onSave={handleSaveConfig}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* One-Click Quick Diagnostic Chips */}
      <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 stroke-[2]" />
          Quick:
        </span>
        {quickChips.map((chip, i) => {
          const Icon = chip.icon;
          return (
            <button
              key={i}
              onClick={() => handleSendMessage(chip.query)}
              disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600 border border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm disabled:opacity-50"
            >
              <Icon className="w-3 h-3 text-sky-400 stroke-[1.5]" />
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 font-sans text-xs min-h-0 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Meta Tag */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-500 font-mono">
              {msg.role === 'user' ? (
                <span>You</span>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-violet-400 stroke-[2]" />
                  <span className="font-semibold text-slate-300">Sparky</span>
                  <span className="px-1 rounded bg-slate-800 text-[9px] text-slate-400">
                    {msg.source === 'gemini'
                      ? 'Gemini 2.5'
                      : msg.source === 'openai'
                      ? 'OpenAI'
                      : 'Offline Rule'}
                  </span>
                </>
              )}
            </div>

            {/* Bubble Content */}
            <div
              className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md border ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white border-blue-500/50 rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border-slate-700/80 rounded-bl-none'
              }`}
            >
              <FormattedMessageContent content={msg.content} />

              {/* One-Click Apply Suggested Fix Banner */}
              {msg.suggestedFix && (
                <div className="mt-2.5 p-2 rounded-lg bg-gradient-to-r from-violet-950/80 to-indigo-950/80 border border-violet-600/50 flex items-center justify-between gap-2 shadow-sm">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-violet-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 stroke-[2] shrink-0" />
                      {msg.suggestedFix.label}
                    </span>
                    <p className="text-[10px] text-slate-300 truncate mt-0.5">
                      {msg.suggestedFix.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplySuggestedFix(msg.suggestedFix!)}
                    className="shrink-0 px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-[10px] font-bold text-white shadow-md flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                    title="Insert fixed code directly into Monaco C++ Editor"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    Apply Fix
                  </button>
                </div>
              )}

              {/* Actionable Issue Cards */}
              {msg.issues && msg.issues.length > 0 && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-700/80 space-y-1.5">
                  {msg.issues.map((iss) => (
                    <div
                      key={iss.id}
                      className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
                          {iss.severity === 'error' ? (
                            <AlertCircle className="w-3 h-3 text-rose-400 stroke-[2] shrink-0" />
                          ) : iss.severity === 'warning' ? (
                            <AlertTriangle className="w-3 h-3 text-amber-400 stroke-[2] shrink-0" />
                          ) : (
                            <Lightbulb className="w-3 h-3 text-sky-400 stroke-[2] shrink-0" />
                          )}
                          <span className="truncate">{iss.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                          {iss.message}
                        </p>
                      </div>

                      {iss.suggestedFix ? (
                        <button
                          onClick={() => handleApplySuggestedFix(iss.suggestedFix!)}
                          className="shrink-0 px-2 py-1 rounded bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-[10px] font-bold text-white shadow flex items-center gap-1 transition-all hover:scale-105"
                          title="Apply suggested fix into Monaco C++ Editor"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          Apply Fix
                        </button>
                      ) : (iss.sliderAdjustment || iss.id === 'sim-not-running') ? (
                        <button
                          onClick={() => handleApplyQuickFix(iss)}
                          className="shrink-0 px-2 py-1 rounded bg-violet-600 hover:bg-violet-500 text-[10px] font-semibold text-white transition-all shadow-sm"
                          title="Apply recommended adjustment automatically"
                        >
                          Auto Fix
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Copy Button for Assistant messages */}
            {msg.role === 'assistant' && (
              <button
                onClick={() => handleCopyText(msg.id, msg.content)}
                className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 px-1 py-0.5 transition-colors"
              >
                {copiedId === msg.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center gap-2 p-2 text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span>Sparky is analyzing code AST & circuit telemetry...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Sparky anything about this code, circuit, or physics..."
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-sans"
        />

        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-violet-600/20 active:scale-95"
        >
          <Send className="w-3.5 h-3.5 stroke-[1.5]" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// SETTINGS TRAY COMPONENT
// ============================================================================

interface SettingsTrayProps {
  config: AiCoachConfig;
  onSave: (config: AiCoachConfig) => void;
  onClose: () => void;
}

const AiCoachSettingsTray: React.FC<SettingsTrayProps> = ({
  config,
  onSave,
  onClose
}) => {
  const [provider, setProvider] = useState(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [geminiModel, setGeminiModel] = useState(config.geminiModel);
  const [language, setLanguage] = useState(config.language);
  const [socraticMode, setSocraticMode] = useState(config.socraticMode);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    onSave({
      ...config,
      provider,
      apiKey: apiKey.trim(),
      geminiModel,
      language,
      socraticMode
    });
  };

  return (
    <div className="p-3 bg-slate-950/95 border-b border-slate-800 space-y-3 text-xs text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150 shrink-0">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-violet-400 stroke-[1.5]" />
          Sparky AI Coach Configuration
        </span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Provider Selection */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Intelligence Engine
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
          >
            <option value="deterministic">Sparky Neural Engine (Built-in · 100% Offline · Zero Key · Instant)</option>
            <option value="webllm">Local WebGPU Model (Qwen2.5-Coder-1.5B · Zero Server · In-Browser)</option>
            <option value="gemini">Google Gemini API (Cloud BYOK)</option>
            <option value="openai_compatible">OpenAI-Compatible (Cloud BYOK)</option>
          </select>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Teaching Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
          >
            <option value="en">English (Default)</option>
            <option value="hi">हिंदी / Hinglish (Bilingual)</option>
          </select>
        </div>
      </div>

      {/* WebGPU Model Info Tray */}
      {provider === 'webllm' && (
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/80 space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-200">Local WebGPU Acceleration:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              webLlmManager.isSupported()
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {webLlmManager.isSupported() ? 'Supported ✓' : 'Unavailable (Fallback to Sparky Engine)'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Loads Qwen2.5-Coder-1.5B weights directly in browser GPU memory using WebGPU. 100% private, zero server roundtrips, zero API key required.
          </p>
        </div>
      )}

      {/* Cloud API Key Settings if Gemini or OpenAI selected */}
      {(provider === 'gemini' || provider === 'openai_compatible') && (
        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-400" />
              {provider === 'gemini' ? 'Google Gemini API Key' : 'API Key'}
            </label>
            {provider === 'gemini' && (
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
              >
                Get Free Gemini Key <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
            )}
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-md pl-2 pr-14 py-1 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-1 top-1 bottom-1 px-1.5 text-[10px] text-slate-400 hover:text-slate-200"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>

          {provider === 'gemini' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Model:</span>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Socratic Mode Toggle */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <label className="text-[11px] text-slate-300 cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={socraticMode}
            onChange={(e) => setSocraticMode(e.target.checked)}
            className="rounded border-slate-700 text-violet-600 focus:ring-0 bg-slate-900"
          />
          <span><strong>Socratic Guidance Mode:</strong> Guide with questions & clues instead of giving code away</span>
        </label>

        <button
          onClick={handleSave}
          className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-sm transition-all"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// FORMATTED MESSAGE CONTENT
// ============================================================================

const FormattedMessageContent: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split('\n');

  return (
    <div className="space-y-1.5">
      {parts.map((p, idx) => {
        const trimmed = p.trim();
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-100 text-xs tracking-tight pt-1">
              {trimmed.replace(/^###\s*/, '')}
            </h4>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={idx} className="font-semibold text-slate-200 text-[11px] pt-0.5">
              {trimmed.replace(/^####\s*/, '')}
            </h5>
          );
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 text-[11.5px]">
              <span className="text-violet-400 font-bold shrink-0">&bull;</span>
              <span dangerouslySetInnerHTML={{ __html: renderInlineFormatting(trimmed.replace(/^[*|-]\s*/, '')) }} />
            </div>
          );
        }
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-2 border-violet-500 pl-2 text-[11px] text-violet-300 italic bg-violet-500/10 py-0.5 rounded-r">
              <span dangerouslySetInnerHTML={{ __html: renderInlineFormatting(trimmed.replace(/^>\s*/, '')) }} />
            </blockquote>
          );
        }
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        return (
          <p key={idx} className="text-[11.5px] leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInlineFormatting(trimmed) }} />
        );
      })}
    </div>
  );
};

function renderInlineFormatting(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 font-mono text-[10.5px] text-sky-300">$1</code>')
    .replace(/&rarr;/g, '→');
}
