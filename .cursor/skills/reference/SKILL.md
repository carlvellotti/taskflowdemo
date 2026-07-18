---
name: reference
description: |
  Open the CC4PMs reference documentation. Use when the student types /reference,
  optionally with a topic like /reference skills or /reference funnel analysis.
disable-model-invocation: true
---

## How This Works

The reference docs are deployed at `https://fullstackpm.com/docs`. Every page is listed in `.cursor/skills/reference/pages.md` as `Title` followed by its path. Open pages in the browser with `open <url>`.

The library serves all three platforms from one tree: pages with platform-specific mechanics carry platform tabs (Claude Code / Codex / Cursor). The first time the student opens a page, tell them once: pick the Cursor tab on any tabbed block; the choice sticks across the whole site.

The docs are member-gated: students may be asked to log in to fullstackpm.com with their course email the first time.


## Behavior

### 1. No arguments, during a lesson

If the student is in an active lesson (you know this from conversation context), open the primary reference page for that lesson. You already know what lesson is active because the lesson skill is loaded. Use your knowledge of the lesson topic to pick the most relevant page from `pages.md`.

### 2. No arguments, no active lesson

Open the home page:

```bash
open https://fullstackpm.com/docs
```

Tell the student: "Reference docs are open. Browse by section or try `/reference [topic]` to jump to a specific page."

### 3. With arguments (e.g., `/reference skills` or `/reference funnel analysis`)

Search the page index for matching titles or paths:

```bash
grep -i "<search_term>" .cursor/skills/reference/pages.md
```

If the literal term doesn't match, try related words (e.g., "funnel analysis" → grep for "data" or "analyzing").

1. **One clear match**: Open it (`open https://fullstackpm.com<path>`) and tell the student what page you opened.

2. **Multiple matches**: Ask which one they want through the native question UI: one question ("I found a few pages that might be what you're looking for; which one?") with the top 3-4 matching page names as clickable options. Never type the options as a lettered list.

3. **No matches**: Tell the student you didn't find a match and suggest they browse the home page. Open the home page.

## Opening a page

Always use:
```bash
open https://fullstackpm.com<path from pages.md>
```

After opening, briefly tell the student what page you opened (one sentence, not a summary of the page).
