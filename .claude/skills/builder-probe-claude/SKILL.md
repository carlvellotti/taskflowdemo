---
name: builder-probe-claude
description: |
  Final-pass diagnostic probe for the Builder module on Claude Code. Four
  quick checks (plan mode, screenshot capture, external URL open, mermaid
  render), each recorded to builder-probe-results-claude.md. Not a lesson.
  Use when the student types /builder-probe-claude.
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - AskUserQuestion
---

## What this is

A diagnostic probe, not a lesson. Four checks, about ten minutes total. Carl runs each check, reports what he sees, and his exact words get recorded. His report decides PASS or FAIL, never your interpretation. He can say "skip" on any check; record SKIP and move on.

Rules for you, the agent:

- Every check is a GENUINE attempt. Never simulate a result, never fake tool output, never describe what "would" happen.
- Record EXACT UI labels as Carl reports them, verbatim, in quotes. Do not paraphrase button text.
- Run checks one at a time, in order. Announce the check number and name, do the check, ask the questions, record, then move to the next.
- Keep your own commentary minimal. This is instrumentation.

## Results file

All results go to `builder-probe-results-claude.md` at the repo root. Before check 1, create it if missing with this header (append below the header if the file already exists):

```
# Builder Probe Results (Claude Code)

Run: <ISO date/time>

| # | Check | Verdict | Carl's exact words |
|---|---|---|---|
```

After EACH check, immediately append one table row: `| <n> | <name> | PASS/FAIL/SKIP | <Carl's exact words, condensed but verbatim phrases in quotes> |`. Append-only. Never rewrite earlier rows.

## Check 1: plan mode from a natural-language trigger

What's under test: whether "Plan first:" reliably puts you into plan mode with the approval UI gating execution.

1. Tell Carl to send this message, exactly:

   `Plan first: change the app's page title to "Probe Test"`

2. When it arrives, handle it GENUINELY: treat it as a real request to plan before doing. Enter plan mode and produce a tiny plan (one file, one line change: the `<title>` in `client/index.html`). Do not simulate a plan card in text. Do not edit anything.
3. The plan approval UI should appear for Carl. Tell him to REJECT the plan.
4. If you notice yourself editing files with no approval gate having appeared, STOP immediately, revert any change with `git checkout -- <file>`, and record FAIL with a description of what happened instead.
5. Ask Carl, plain questions one message: Did plan mode visibly engage? Did an approval UI appear? What were its exact button labels? Did any file change before you approved or rejected?
6. Record the row. The verdict is PASS only if plan mode engaged, the approval UI appeared, and nothing executed pre-approval.

## Check 2: native screenshot capture, rendered inline

What's under test: capturing a running localhost page to a file and rendering it inline from a relative path.

1. If `node_modules` is missing in `client/` or `server/`, run `npm run install:all` first. Then start the dev server in the background: `npm run dev`. Wait until `http://localhost:5173` responds (curl it).
2. Capture the running page with your native screenshot capability and save the capture to `docs/probe-shot.png`. If your capture lands somewhere else by default, move it there.
3. Emit the image as part of your reply, relative path form: `![Probe screenshot](docs/probe-shot.png)`
4. Ask Carl: Did the screenshot capture succeed, and does an actual image of the TaskFlow app render inline in chat right now?
5. Record the row. Then kill the dev server (kill the background job; verify with `curl --max-time 2 http://localhost:5173` failing).

## Check 3: external URL open

What's under test: handing Carl's signed-in browser a URL.

1. Run: `open https://github.com/carlvellotti/taskflowdemo`
2. Ask Carl: Did your browser open the repo page, and are you signed in there?
3. Record the row.

## Check 4: mermaid fence

What's under test: what a mermaid fence looks like in this app. Takes ten seconds.

1. Emit this fence in your reply, exactly:

   ```mermaid
   flowchart LR
     A[Probe] --> B{Renders?}
     B --> C[Diagram]
     B --> D[Source text]
   ```

2. Ask Carl: Do you see a drawn diagram, or the code as text? (Either answer is a valid data point. The expectation on this platform is source text; record whatever he sees.)
3. Record the row. Verdict here is PASS if his observation matches the platform expectation (source text), FAIL if it renders as a diagram, and either way his exact words are the payload.

## Cleanup

1. Delete `docs/probe-shot.png` if it exists.
2. Confirm the dev server is dead (nothing answering on 5173 or 3001; `pkill -f "vite" ` and `pkill -f "node.*server" ` are acceptable if the background job handle is lost, but check nothing else of Carl's matches first).
3. Run `git status`. The only probe artifact allowed to remain is `builder-probe-results-claude.md`. Revert anything else the probe touched.
4. Present the results file as a link on its own line: [builder-probe-results-claude.md](builder-probe-results-claude.md)
5. One-line goodbye. Nothing else.

## Edge cases

- **Dev server won't start:** surface the real error, record FAIL for check 2 with the error text, and continue to check 3. Never fake a screenshot.
- **Screenshot capability doesn't exist or errors:** record exactly what happened; that is the finding.
- **Carl answers ambiguously:** ask one clarifying question, then record his clarified words.
- **A check already ran in a previous session:** append new rows anyway; the file is a log, not a form.
