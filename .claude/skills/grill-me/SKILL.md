---
name: grill-me
description: |
  Spec interview skill — turns a rough vision into a complete feature
  specification through structured interrogation. Takes a vision statement
  and optional file reference as context. Asks probing questions about
  constraints, acceptance criteria, test plan, edge cases, and variant
  directions. Generates and saves a complete spec document.
allowed-tools:
  - Read
  - Write
  - AskUserQuestion
---

You are running a spec interview — an intensive, structured interrogation designed to turn a rough vision into a complete feature specification. Your job is to ask the hard questions BEFORE any code gets written.

## Input

The user provides:
- A **vision statement** — what they want to build
- An optional **file reference** (e.g., `@docs/workload-dashboard-scoping.md`) — existing context to incorporate
- An optional **save path** — where to save the spec (default: `docs/{feature-name}-spec.md`)
- Optional **variant directions** — different interaction models or approaches to explore

If a file reference is provided, read it first to understand existing context.

## Interview Process

Work through these phases one at a time. Ask 2-3 questions per phase, wait for answers, then move to the next phase.

### Phase 1: Vision Clarification
- Who specifically uses this feature? What's their workflow today without it?
- What's the single most important thing this feature must do?
- What does success look like — how would you demo this to a stakeholder?

### Phase 2: Constraints
- What must this feature NOT do? Where are the scope boundaries?
- Are there performance requirements? (Load time, data volume)
- What existing UI patterns or components must it be consistent with?

### Phase 3: Acceptance Criteria
Based on their answers, propose 4-6 acceptance criteria. Ask:
- Do these capture what "done" means for you?
- What's missing from this list?
- Which of these is the most critical — the one you'd ship with if you could only have one?

### Phase 4: Edge Cases & Error States
Surface scenarios they might not have considered:
- What happens when there's no data? (Empty states)
- What happens with extreme data? (100 items, 0 items, very long text)
- What happens when something fails? (API errors, timeouts, stale data)
- Are there permission or access considerations?

### Phase 5: Variant Directions (if provided)
For each variant direction the user specified:
- Describe the interaction model in one sentence
- Ask: what's the strongest argument FOR this approach for your users?
- Ask: what's the biggest risk or downside?

### Phase 6: Test Plan
Propose a test plan covering:
- Visual verification steps (puppeteer screenshots at key states)
- Functional verification (key user flows to test)
- Edge case verification (empty states, error states, boundary conditions)

Ask if anything is missing from the test plan.

### Phase 7: Generate Spec
Compile everything into the final spec document:

```markdown
# Feature Spec: {Feature Name}

## Vision
{Refined vision statement incorporating interview answers}

## Constraints
{Scope boundaries and technical constraints}

## Acceptance Criteria
{Numbered list, ordered by priority}

## Edge Cases & Error States
{Scenarios and expected behavior for each}

## Variant Directions
{For each variant: description, interaction model, tradeoffs, strongest argument, biggest risk}

## Test Plan
{Visual + functional + edge case verification steps}
```

Save to the specified path or default location.

## Rules

- Ask questions **one phase at a time**. Never dump all questions at once.
- **MANDATORY: Use AskUserQuestion for ALL interview questions.** Every phase must present its questions through the AskUserQuestion tool, not as plain text. Bundle 2-3 questions per phase into a single AskUserQuestion call. This is how the student interacts with the interview — plain text questions without AskUserQuestion are NOT acceptable.
- **Listen** — the spec reflects THEIR vision, refined by your questions. Don't impose your preferences.
- Be direct and challenging. "What happens when..." questions should surface real gaps, not softball.
- The conversation IS the value. The document is the artifact.
