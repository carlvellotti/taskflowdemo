---
name: builder-probe-cursor
description: |
  Final-pass diagnostic probe for the Builder module on Cursor. Four quick
  checks (plan mode, playwright screenshot, localhost behavior, mermaid
  render), each recorded to builder-probe-results-cursor.md. Not a lesson.
  Use when the student types /builder-probe-cursor.
disable-model-invocation: true
---

## What this is

A diagnostic probe, not a lesson. Four checks, about ten minutes total. Carl runs each check, reports what he sees, and his exact words get recorded. His report decides PASS or FAIL, never your interpretation. He can say "skip" on any check; record SKIP and move on.

Rules for you, the agent:

- Every check is a GENUINE attempt. Never simulate a result, never fake tool output, never describe what "would" happen.
- Record EXACT UI labels as Carl reports them, verbatim, in quotes. Do not paraphrase button or card text.
- Run checks one at a time, in order. Announce the check number and name, do the check, ask the questions, record, then move on.
- Questions to Carl in this probe are plain prose, not the structured-question tool; his free-text observations are the data.
- Keep your own commentary minimal. This is instrumentation.

## Results file

All results go to `builder-probe-results-cursor.md` at the repo root. Before check 1, create it if missing with this header (append below the header if the file already exists):

```
# Builder Probe Results (Cursor)

Run: <ISO date/time>

| # | Check | Verdict | Carl's exact words |
|---|---|---|---|
```

After EACH check, immediately append one table row: `| <n> | <name> | PASS/FAIL/SKIP | <Carl's exact words, condensed but verbatim phrases in quotes> |`. Append-only. Never rewrite earlier rows.

## Check 1: plan mode, two-step entry

What's under test: the `/plan` (or Shift+Tab) toggle, the plan card, and its approval controls.

1. Tell Carl the two-step, exactly: first type `/plan` in the composer (Shift+Tab also works), THEN send this message:

   `change the app's page title to "Probe Test"`

2. When it arrives, handle it GENUINELY: produce a tiny plan (one file, one line change: the `<title>` in `client/index.html`) through the platform's plan flow. Do not simulate a plan card in text. Do not edit anything.
3. A plan card should appear in chat. Tell Carl to REJECT it.
4. If you notice yourself editing files with no plan card having gated it, STOP immediately, revert any change with `git checkout -- <file>`, and record FAIL with a description of what happened instead.
5. Ask Carl, plain questions in one message: Did plan mode visibly engage after `/plan`? Did a plan card appear in chat? What are the exact labels on its approve and reject controls? Did any file change before you acted on the card?
6. Record the row. PASS only if plan mode engaged, the card appeared, and nothing executed before Carl acted.

## Check 2: playwright screenshot, rendered inline

What's under test: CLI screenshot of a running localhost page, displayed from an absolute no-spaces path.

1. If `node_modules` is missing in `client/` or `server/`, run `npm run install:all` first. Then start the dev server in the background: `npm run dev`. Wait until `http://localhost:5173` responds (curl it).
2. Run: `mkdir -p /tmp/cc4pms-assets && npx playwright screenshot http://localhost:5173 /tmp/cc4pms-assets/probe-shot.png`
   - If playwright reports missing browsers, say plainly that a one-time chromium download is needed, run `npx playwright install chromium`, and retry once.
3. Emit the image as part of your reply, absolute path form: `![Probe screenshot](/tmp/cc4pms-assets/probe-shot.png)`
4. Ask Carl: Did the capture succeed, and does an actual image of the TaskFlow app render inline in chat right now?
5. Record the row. Leave the dev server RUNNING for check 3.

## Check 3: localhost behavior

What's under test: permission prompts on first localhost access, and what clicking a localhost link does.

1. The dev server from check 2 is still running. Print the URL as a plain link on its own line for Carl to click: http://localhost:5173
2. Ask Carl, one message: Did ANY permission or network prompt appear at any point during the serve or the capture (if yes, its exact wording)? When you click that link, does the page open in-pane inside Cursor or in your external browser?
3. Record the row (both observations in the same row).
4. Kill the dev server (kill the background job; verify with `curl --max-time 2 http://localhost:5173` failing; `pkill -f vite` and `pkill -f "node.*server"` are acceptable fallbacks after checking nothing else of Carl's matches).

## Check 4: mermaid fence

What's under test: whether a mermaid fence renders live here. Takes ten seconds.

1. Emit this fence in your reply, exactly:

   ```mermaid
   flowchart LR
     A[Probe] --> B{Renders?}
     B --> C[Diagram]
     B --> D[Source text]
   ```

2. Ask Carl: Do you see a drawn diagram, or the code as text? (The expectation on this platform is a drawn diagram; record whatever he sees.)
3. Record the row. PASS if his observation matches the platform expectation (drawn diagram), FAIL if it shows as source text, and either way his exact words are the payload.

## Cleanup

1. Delete `/tmp/cc4pms-assets/probe-shot.png` if it exists.
2. Confirm the dev server is dead (nothing answering on 5173 or 3001).
3. Run `git status`. The only probe artifact allowed to remain is `builder-probe-results-cursor.md`. Revert anything else the probe touched.
4. Present the results file as a link on its own line: [builder-probe-results-cursor.md](builder-probe-results-cursor.md)
5. One-line goodbye. Nothing else.

## Edge cases

- **Dev server won't start:** surface the real error, record FAIL for check 2 with the error text, still do check 3's prompt questions if anything served long enough to observe, then move on. Never fake a screenshot.
- **Playwright can't install or run:** record exactly what happened; that is the finding.
- **Carl answers ambiguously:** ask one clarifying question, then record his clarified words.
- **A check already ran in a previous session:** append new rows anyway; the file is a log, not a form.
