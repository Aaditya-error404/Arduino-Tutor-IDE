---
name: workbench-store-curriculum
description: >-
  Playbook for the Zustand global state store, 22 ATL Curriculum Labs and 88 progressive lessons,
  Monaco C++ editor synchronization, and Sparky AI Coach Socratic diagnostic reasoning engine.
  Activate when modifying useWorkbenchStore.ts, lessons.ts, aiCoachEngine.ts, or AiCoachPanel.tsx.
---

# Workbench Store, Curriculum & Sparky AI Coach Skill

## Overview
This skill governs the state management, curriculum progression, and in-browser AI coaching engine powering **SparkByte Studio v2**. It ensures state consistency across Monaco Editor, the virtual breadboard canvas, and Sparky AI Coach.

---

## 1. Zustand Store & Zero-Stale State Rule

```
useWorkbenchStore.getState()
  ├── activeLabId / activeLessonId (1..4)
  ├── customCode (student code override; null = defaultCode.cpp)
  ├── compiled { setupSteps[], loopSteps[], vars{} }
  ├── hardwareState { pins, sensors, actuators }
  └── serialLogs[]
```

### Critical Rules:
1. **Never Trust Stale Closures in Async Handlers:**
   Inside button handlers, AI queries (`handleSendMessage`), or background workers, ALWAYS read `const state = useWorkbenchStore.getState()` at the exact moment of execution. Never rely on captured component props or memoized hooks for mutable simulation state.
2. **Code Synchronization (`setCustomCode`):**
   Calling `setCustomCode(code)` automatically:
   - Sets `customCode = code`
   - Re-runs `compileProgram()`
   - Re-extracts runtime variables into `vars{}`
   - Resets virtual execution step index to 0
   - Updates the Monaco Editor model immediately

---

## 2. Curriculum Data Structure (`src/data/lessons.ts`)

- 22 Labs mapped by ID in `LAB_MAP[labId]`:
  - `grade`: Target grade band (`6-8`, `9-10`, `11-12`)
  - `category`: `basics`, `sensors`, `actuators`, `communication`, `cad`
  - `lessons`: Array of exactly 4 lessons per lab (88 lessons total)
  - `defaultCode.cpp`: Authentic, compilable Arduino C++ starter sketch
  - `defaultCode.human`: Plain English pseudo-code representation
- When switching labs via `setActiveLab(labId)`, the store resets `activeLessonId = 1`, clears `customCode = null`, re-initializes hardware pins to defaults, and notifies subscribers.

---

## 3. Sparky AI Coach Zero-Key Reasoning Rules (`aiCoachEngine.ts`)

1. **Zero External API Requirement:**
   The default active intelligence engine is **Sparky Neural Engine (Built-in · 100% Offline · Zero Key · Instant)**. It must never fail or block if no API key is provided.
2. **Zero Dead-End Guarantee:**
   Never output generic `"Try clicking one of the one-click diagnostic chips..."` messages. Even for open-ended queries, dynamically ground the answer in the active lab's hardware pinout, live slider telemetry, and Monaco code context.
3. **Procedural C++ Code Generation:**
   Any prompt requesting code generation (`generate`, `write`, `create`, `make`, `code`, `sketch`, `program`, `blink`, `sweep`, `sensor`, `faster`, `slower`, `pin`, etc.) MUST procedurally synthesize clean, commented, compilable C++ code and attach an interactive **`[ ✨ Insert Code into Editor ]`** button.
4. **AST Pin & Syntax Catcher:**
   - Detect missing semicolons on variable declarations (`int x = 10`) and function calls citing exact `[Line X]`.
   - Prevent `analogWrite` on non-PWM pins (valid pins on Uno: `3, 5, 6, 9, 10, 11`).
   - Cross-examine `if/else` threshold conditions against live sensor slider positions.
