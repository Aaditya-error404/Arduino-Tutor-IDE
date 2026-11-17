/**
 * Strict TypeScript Interfaces for Sparky AI Coach
 *
 * Dual-Engine Architecture:
 * - Tier 1: Deterministic Circuit & AST Diagnostic Inspector (Offline, 0 API Key)
 * - Tier 2: Live LLM Integration (Google Gemini 2.5 Flash / OpenAI-Compatible BYOK)
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import { GradeLevel, HardwareState } from './curriculum';

export type AiCoachProvider = 'deterministic' | 'gemini' | 'openai_compatible';

export interface AiCoachConfig {
  provider: AiCoachProvider;
  apiKey: string;
  geminiModel: string; // default: 'gemini-2.5-flash'
  openaiBaseUrl: string; // default: 'https://api.openai.com/v1'
  openaiModel: string; // default: 'gpt-4o-mini'
  language: 'en' | 'hi'; // English or Hindi/Hinglish
  socraticMode: boolean; // True: hints & questions; False: direct solutions
}

export interface AiIssue {
  id: string;
  type: 'syntax' | 'pinMismatch' | 'threshold' | 'simulationState' | 'logic' | 'wiring';
  severity: 'error' | 'warning' | 'tip';
  title: string;
  message: string;
  lineIndex?: number;
  fixSuggestion?: string;
  sliderAdjustment?: Partial<HardwareState>;
}

export interface LineExplanation {
  lineNumber: number;
  cpp: string;
  plainEnglish: string;
  hardwareAction: string;
}

export interface AiDiagnosticResult {
  hasErrors: boolean;
  issues: AiIssue[];
  summary: string;
  gradeBand: GradeLevel;
  safeExperiments: string[];
  lineExplanations: LineExplanation[];
}

export interface AiCoachMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  source: 'offline_rule' | 'gemini' | 'openai' | 'system';
  suggestedCode?: string;
  issues?: AiIssue[];
}

export interface WorkbenchStateSnapshot {
  activeLabId: string;
  activeLabTitle: string;
  activeLabCategory: string;
  gradeBand: GradeLevel;
  activeLessonId: number;
  activeLessonTitle: string;
  activeLessonSummary: string;
  defaultCpp: string;
  currentCpp: string;
  isRunning: boolean;
  isPaused: boolean;
  loopCount: number;
  hardwareState: HardwareState;
  serialLogs: string[];
}
