---
name: kamal-model-router
description: On-demand model and surface advisor for Kamal across Claude chat, Cowork, and Claude Code. When triggered, takes a task description from Kamal, recommends the right Claude model (Haiku 4.5 / Sonnet 4.6 / Opus 4.7), whether to enable Extended Thinking, and which surface to use (chat vs Claude Code vs Research mode vs Cowork), with a 1-line rationale per recommendation. Output is recommendation only — Kamal switches manually. Never auto-executes the task. Triggers ONLY on explicit calls: "which model", "model check", "/model", "route this", "router", "quel modèle", "model for this", "best model for", "model advice", "should I use Opus", "should I use Sonnet", "should I use Haiku", "which surface". Does not trigger on general task requests.
---

# Kamal Model Router — Pick the right model before you spend tokens

This skill is a **decision aid**, not an executor. Kamal describes a task; this skill recommends the optimal **model + thinking mode + surface**, then stops. Kamal switches manually.

## Activation

Trigger ONLY on explicit calls listed in the description. If Kamal asks a normal question, do NOT activate this skill — answer normally.

When activated, output exactly the format in the **Output template** section below. No preamble, no follow-up offer to execute the task.

## How to decide

### Step 1 — Classify the task on 3 axes

**Axis A — Reasoning depth required**
- Trivial: rephrasing, summarizing visible text, formatting, simple lookups, single-fact answers
- Moderate: drafting content, structured analysis, multi-step but linear logic, standard coding
- Hard: deep multi-step reasoning, ambiguous problems, novel synthesis, complex agentic coding, debugging tricky issues, architecture decisions

**Axis B — Output volume**
- Short (<500 words / <50 lines code)
- Medium (500–3000 words / 50–500 lines code)
- Long (full deliverables, books, large codebases, multi-doc generation)

**Axis C — Stakes**
- Throwaway: drafts, exploration, quick checks
- Working: real client work, content going out, code going to prod
- Critical: irreversible decisions, money on the line, client-facing final deliverables

### Step 2 — Map to model

| Task profile | Recommended model | Why |
|---|---|---|
| Trivial + Short + any stakes | **Haiku 4.5** | Cheapest, fastest, plenty good for simple work |
| Moderate + any volume + Working | **Sonnet 4.6** | Best price/perf for 80% of Kamal's work |
| Moderate + Critical | **Sonnet 4.6** with Extended Thinking | Sonnet quality + safety net for stakes |
| Hard + any volume | **Opus 4.7** | Reasoning depth justifies the price |
| Hard + Critical + irreversible | **Opus 4.7** with Extended Thinking | Maximum quality, no compromises |
| Long agentic coding | **Opus 4.7** in Claude Code | Long-horizon work needs Opus's planning |
| Bulk repetitive content (50 reels, 20 carousels) | **Haiku 4.5** | Volume × throwaway = cheapest tier wins |

### Step 3 — Map to surface

- **Claude chat (this interface)** — default for most Kamal tasks: skill-based work, single deliverables, conversation
- **Claude Code** — when the task involves multiple file edits, running scripts, agentic loops, debugging real codebases, or building/testing apps. Better than chat for anything touching the file system more than 2-3 times.
- **Research mode** — when the task requires synthesizing 10+ sources, deep web research, or producing a multi-page evidence-backed report. NOT for quick searches.
- **Cowork** — when the task involves browser automation: Drive uploads at scale, Gmail sending, LinkedIn/Instagram scraping, multi-tab workflows. The CPHL outreach skills live here.
- **Mobile (this app)** — quick questions, idea capture, factual lookups. Don't run heavy skills on mobile.

### Step 4 — Decide on Extended Thinking

Recommend Extended Thinking ON when:
- Task is in the "Hard" reasoning bucket
- Stakes are Critical (money / irreversible / client-facing final)
- The task involves catching logical faults Kamal won't easily verify
- The task is a strategic decision (business model, pricing, positioning)

Recommend Extended Thinking OFF when:
- Task is creative content generation (Reels, scripts, copy) — thinking adds latency without quality gains here
- Task is a known pattern Kamal has done 10+ times before
- Task is mostly retrieval or formatting

### Step 5 — Flag escalations

Sometimes the right answer isn't "pick a model" — it's "this is the wrong tool entirely". Flag explicitly when:
- Task should be a skill, not a one-off prompt → recommend turning it into a skill
- Task should be automated (runs weekly+) → recommend Cowork or Claude Code automation
- Task is too big for one session → recommend breaking into stages
- Task is genuinely outside Claude's strength (real-time data, deterministic math, image editing) → recommend the right tool (sheet, calculator, Photoshop)

## Output template

Always output in this exact format, max 8 lines:

```
🎯 Model Router
Task: [one-line restate of what Kamal described]
→ Model: [Haiku 4.5 / Sonnet 4.6 / Opus 4.7]
→ Thinking: [ON / OFF]
→ Surface: [Chat / Claude Code / Research / Cowork / Mobile]
Why: [1 sentence — the deciding factor]
[Optional 1-line escalation flag if applicable]
```

## Examples

**Kamal:** "/model — I need to write 5 CPHL Reels scripts for next week"

```
🎯 Model Router
Task: 5 CPHL Reels scripts for next week.
→ Model: Sonnet 4.6
→ Thinking: OFF
→ Surface: Chat
Why: Creative content at moderate volume — Sonnet hits the cphl-reel quality bar without paying Opus tax.
```

**Kamal:** "which model — I need to design the pricing tiers for the Coach OS meta-product"

```
🎯 Model Router
Task: Design pricing tiers for Coach OS meta-product.
→ Model: Opus 4.7
→ Thinking: ON
→ Surface: Chat
Why: Strategic + irreversible + revenue-defining — pay for max reasoning, plus thinking catches gaps.
```

**Kamal:** "model check — debug why my md_to_docx_branded.py v2.0 crashes on long tables"

```
🎯 Model Router
Task: Debug Python crash in md_to_docx_branded.py on long tables.
→ Model: Opus 4.7
→ Thinking: ON
→ Surface: Claude Code
Why: Hard debugging on a real codebase — Claude Code lets it run/test, Opus catches subtle bugs Sonnet misses.
```

**Kamal:** "/model — quick question, what's the citrate form of magnesium called in French again"

```
🎯 Model Router
Task: French translation of magnesium citrate.
→ Model: Haiku 4.5
→ Thinking: OFF
→ Surface: Mobile or Chat
Why: Single-fact lookup — anything bigger than Haiku is a waste.
```

**Kamal:** "route this — generate 50 Instagram captions for the Bronze track launch"

```
🎯 Model Router
Task: 50 Instagram captions for Bronze track launch.
→ Model: Haiku 4.5
→ Thinking: OFF
→ Surface: Chat
Why: Bulk repetitive content — Haiku ships volume cheap, you'll edit the keepers anyway.
⚠️ Worth turning this into a `cphl-caption-batch` skill if you'll do this monthly.
```

## Hard rules

1. **Never execute the task.** Output the recommendation and stop. Wait for Kamal to switch and re-prompt.
2. **One recommendation only.** Don't hedge with "Sonnet OR Opus depending on…". Pick one.
3. **No preamble.** Start with `🎯 Model Router`. End after the rationale or escalation flag.
4. **Respect Kamal's stack.** He's in Claude.ai chat / mobile / Cowork / Claude Code. Don't recommend tools he doesn't use (no Cursor, no GPT, no Gemini).
5. **Token discipline.** Max 8 lines of output. The whole point of this skill is to save tokens, not spend them on meta-discussion about which model to use.
6. **If Kamal asks "why" after a recommendation,** give max 3 sentences of reasoning, then stop.

## Exit

This skill is single-shot — fires once per trigger, outputs the recommendation, ends. No persistent mode. Kamal re-triggers it on the next task he wants routed.
