/**
 * Sparky WebLLM On-Device Engine (Zero Server, Zero Key, 100% In-Browser)
 * Powered by WebGPU and @mlc-ai/web-llm
 *
 * Runs local small language models (e.g., Qwen2.5-Coder-1.5B or SmolLM2) directly in browser GPU memory.
 * Gracefully falls back to the deterministic Sparky Neural Engine if WebGPU is unsupported.
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import { WorkbenchStateSnapshot, AiCoachConfig } from '../types/aiCoach';

export interface WebLlmProgress {
  text: string;
  progress: number; // 0.0 to 1.0
}

export type ProgressCallback = (report: WebLlmProgress) => void;

export const DEFAULT_WEBLLM_MODEL = 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC';

class WebLlmManager {
  private engine: any = null;
  private isInitializing = false;
  private currentModel = DEFAULT_WEBLLM_MODEL;
  private loadProgress: WebLlmProgress = { text: '', progress: 0 };

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in navigator && Boolean((navigator as any).gpu);
  }

  public getProgress(): WebLlmProgress {
    return this.loadProgress;
  }

  public isReady(): boolean {
    return this.engine !== null;
  }

  public async initializeEngine(model = DEFAULT_WEBLLM_MODEL, onProgress?: ProgressCallback): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('WebGPU is not supported in this browser. Please use Chrome 113+ or Edge with hardware acceleration enabled.');
    }

    if (this.engine && this.currentModel === model) {
      return true;
    }

    if (this.isInitializing) {
      return false;
    }

    this.isInitializing = true;
    this.currentModel = model;

    try {
      // Dynamic import from ESM CDN to avoid massive bundle overhead
      const importDynamic = new Function('url', 'return import(url)');
      const webllm = await importDynamic('https://esm.run/@mlc-ai/web-llm');
      
      const initProgressCallback = (report: any) => {
        const text = report.text || 'Loading weights...';
        const progress = report.progress || 0;
        this.loadProgress = { text, progress };
        onProgress?.(this.loadProgress);
      };

      this.engine = await webllm.CreateMLCEngine(model, {
        initProgressCallback,
        logLevel: 'WARN'
      });

      this.loadProgress = { text: 'Ready', progress: 1.0 };
      onProgress?.(this.loadProgress);
      return true;
    } catch (err) {
      console.warn('WebLLM initialization error:', err);
      this.engine = null;
      throw err;
    } finally {
      this.isInitializing = false;
    }
  }

  public async generate(
    studentQuery: string,
    snapshot: WorkbenchStateSnapshot,
    config: AiCoachConfig
  ): Promise<string> {
    if (!this.engine) {
      await this.initializeEngine(config.webLlmModel || DEFAULT_WEBLLM_MODEL);
    }

    const linesWithNumbers = snapshot.currentCpp
      .split('\n')
      .map((l, i) => `[Line ${i + 1}] ${l}`)
      .join('\n');

    const systemPrompt = `You are Sparky, an expert embedded systems teacher and AI coach in SparkByte Studio v2.
Helping grade ${snapshot.gradeBand} student on "${snapshot.activeLabTitle}" (${snapshot.activeLessonTitle}).
Simulation: ${snapshot.isRunning ? 'RUNNING' : 'STOPPED'}.
Student code:
${linesWithNumbers}
Rules:
1. Always reference specific line numbers like [Line X].
2. ${config.socraticMode ? 'Use Socratic questions and hints rather than immediately giving the full solution.' : 'Give clear explanations and code fixes.'}
3. ${config.language === 'hi' ? 'Explain in Hindi/Hinglish.' : 'Explain in English.'}
4. Keep answers under 150 words.`;

    const response = await this.engine.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: studentQuery }
      ],
      temperature: 0.3,
      max_tokens: 400
    });

    return response.choices[0]?.message?.content || 'Sparky was unable to generate a response.';
  }
}

export const webLlmManager = new WebLlmManager();
