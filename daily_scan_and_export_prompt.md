# Prompt: Add "Daily Task Scan" + PDF/Word Export to Career Roadmap App

Paste everything below into your coding assistant (Claude Code, Cursor, etc.) while it has access to the `career_road_map` project.

---

## Context

This is a React + Vite app (`src/App.jsx`, single-file component) that generates an AI career roadmap using Puter.js (`callPuterAI`). It already has:
- `formData`, `roadmapData` (with `.macro` phases and `.micro` — 7 daily task objects: `{ day, active, timePref, hoursAllocated, tasks: [] }`)
- `completedTasks` / `completedPhases` state, persisted to `localStorage` under key `career_roadmap_puter_data`
- Tabs: `macro`, `micro`, `mentor`, `insights`
- Existing `exportRoadmap()` that only exports raw JSON

I want two new features added, matching the existing visual style (glass-card, badge-puter, gradient-text, btn-primary/btn-secondary classes already in `App.css`/`index.css`).

---

## Feature 1: Daily Task Scan

**Goal:** Each day, the user reports what they actually worked on. The AI compares this against that day's planned `tasks` from `roadmapData.micro`, tells the user which planned tasks were actually covered, flags anything missed or done incorrectly, and gives a short correction/suggestion — instead of the user just self-checking boxes.

### New tab: "Daily Scan" (add to the tab bar alongside macro/micro/mentor/insights, icon: `ClipboardCheck` or `ScanLine` from lucide-react)

### UI requirements
1. A day selector (defaults to today's weekday, mapped to the matching entry in `roadmapData.micro`).
2. Show that day's planned tasks as a reference list (reuse the same task-row styling from the `micro` tab).
3. A textarea: "What did you actually do today?" — free text, e.g. "Watched 1 hour of React hooks tutorial, didn't get to the mini project."
4. A "Scan My Progress" button (btn-primary, `Sparkles` icon) that calls Puter AI.
5. After scanning, render an AI feedback card showing:
   - Overall status badge: `On Track` (green) / `Partial` (amber) / `Off Track` (rose)
   - ✅ Matched tasks (planned tasks confirmed done)
   - ⚠️ Missed tasks (planned tasks not mentioned/done)
   - 💡 Corrections/suggestions (short, actionable — e.g. "You mentioned skipping the project; try 30 min tonight instead of a full session tomorrow")
   - A one-line encouraging note
6. Auto-check off matched tasks in `completedTasks` (reuse the `dIdx-tIdx` key format already used elsewhere) so it stays in sync with the Weekly Plan tab and progress bar.
7. Keep a history: list of past daily scans (date, status badge, short summary) so the user can look back over the week. Store under a new state `dailyLogs` (array of `{ date, day, userInput, status, matchedTasks, missedTasks, suggestions, note }`), persisted in the same `localStorage` payload as the rest of the roadmap state.

### AI call
Add a new function `scanDailyProgress(dayPlan, userInput, formData)` next to `synthesizeRoadmapAI`/`callPuterAI`. Prompt Puter AI to return **strict JSON only** (same pattern as `synthesizeRoadmapAI` — extract with a `{...}` regex match and `JSON.parse`, with a sensible fallback object if parsing fails so the UI never breaks):

```json
{
  "status": "on_track" | "partial" | "off_track",
  "matchedTaskIndexes": [0],
  "missedTaskIndexes": [1],
  "feedback": "One short paragraph on what went well and what didn't.",
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"],
  "encouragement": "One short motivating line."
}
```

The prompt should include: the day's planned tasks (numbered, matching array indexes), the user's free-text description of what they did, and instruct the AI to be honest but encouraging — flag gaps clearly, but never guilt-trip. If the user's input is vague, it should still make a best-effort judgment rather than refusing.

Use the same `models` fallback list already defined in `callPuterAI` — don't duplicate that logic, just call `callPuterAI(prompt)`.

---

## Feature 2: Proper PDF / Word Export

**Goal:** Replace/extend the current raw-JSON `exportRoadmap()` with a real, readable document export — a formatted report a human can open and understand, not a data dump.

### Requirements
- Add two buttons next to the existing Export button: **"Export PDF"** and **"Export Word"** (keep the JSON export too, or remove it — your call, but PDF/Word are primary now).
- The exported document should include, in this order:
  1. Title page / header: user's name, target goal, timeline, generation date
  2. Summary block: total hours required, hours/week committed, estimated salary range, market outlook
  3. Macro Roadmap: each phase as a heading with timeframe, description, objectives (bulleted), projects (bulleted), resources (bulleted), and a "✔ Completed" / "○ In Progress" marker based on `completedPhases`
  4. Weekly Plan: a table or day-by-day section showing each day's tasks with checkboxes reflecting `completedTasks` state
  5. Daily Scan history (if any `dailyLogs` exist): a simple log table — date, status, short feedback
  6. Skills to master (list with the % weight)
  7. AI strategic advice, as a pull-quote

### Implementation approach
- **PDF:** Use `jspdf` + `jspdf-autotable` (client-side, no backend needed) to build a styled multi-page PDF directly from `roadmapData`/`completedTasks`/`dailyLogs` — not a raw `window.print()` screenshot. Use headings, spacing, and a simple color accent (matching the app's indigo/purple accent) for section titles.
- **Word:** Use the `docx` npm package to build a real `.docx` with actual Word heading styles (Heading1/Heading2), bullet lists, and a table for the weekly plan — not HTML pasted into a .doc file. Generate a `Blob` and trigger download via an anchor tag, same pattern as the existing `exportRoadmap()`.
- Install both as dependencies: `npm install jspdf jspdf-autotable docx`.
- Put the document-building logic in a new file `src/utils/exportDocuments.js` with two exported functions: `exportRoadmapAsPDF(formData, roadmapData, completedTasks, completedPhases, dailyLogs)` and `exportRoadmapAsWord(...)` (same signature). Import and call these from `App.jsx`.
- Filenames: `${formData.goal.replace(/\s+/g,'_')}_Roadmap.pdf` / `.docx`, same convention as the existing export.

### Formatting bar
This needs to look like something you'd actually hand to a mentor or print out — proper headings, consistent spacing, no walls of raw JSON, no clipped text, page breaks between major sections in the PDF.

---

## General
- Match existing code conventions: inline styles using the CSS variables already defined (`--accent-primary`, `--accent-cyan`, `--accent-emerald`, `--text-muted`, etc.), the `glass-card` / `fade-enter` classes, and the existing icon set from `lucide-react` (add `ClipboardCheck`, `ScanLine`, `FileDown` as needed).
- Persist `dailyLogs` in the same `localStorage.setItem('career_roadmap_puter_data', ...)` effect that already saves `roadmapData`/`formData`/`completedTasks`/`completedPhases`.
- Don't break the existing `resetRoadmap()` — it should also clear `dailyLogs`.
- Keep everything client-side; no backend/API keys needed (Puter.js is keyless, jspdf/docx run in-browser).
