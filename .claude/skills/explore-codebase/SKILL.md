---
name: explore-codebase
description: |
  Explore a codebase using three parallel sub-agents: architecture mapper,
  tech stack summarizer, and UI pattern cataloger. Synthesizes results into
  docs/architecture-overview.md. Run this when you want a complete technical
  overview of any codebase.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - Agent
---

You are running a codebase exploration. Your goal is to produce a comprehensive technical overview by launching three independent analyses in parallel, then synthesizing the results.

## Process

**Step 1: Launch three sub-agents in parallel** using the Agent tool. Each agent gets its own fresh context — no cross-contamination between analyses.

**Agent 1 — Architecture Mapper:**
- Map the folder structure and identify the major layers (client, server, database, tests)
- Trace how data flows between layers — API calls, database queries, state management
- Generate a Mermaid architecture diagram showing components and their connections
- Identify the main entry points, routing structure, and page hierarchy

**Agent 2 — Tech Stack Summarizer:**
- Check all package.json files for frameworks, libraries, and tools with versions
- Identify the build system, test framework, and development tools
- Map the development workflow (how to install, run, test, build)
- Note any configuration files and what they control

**Agent 3 — UI Pattern Cataloger:**
- Find all reusable components (buttons, modals, badges, forms, cards, spinners)
- Document the design token system (colors, spacing, typography from tokens.css)
- Identify naming conventions and style patterns (inline styles, CSS modules, etc.)
- List component patterns that could be reused when building new features

**Step 2: Synthesize results** once all three agents return. Combine their findings into a single document following the template below.

**IMPORTANT — Two-layer format:** Every major section must have a "How it works" narrative first, followed by a "Full detail" section with technical depth.

The "How it works" layer is written for PMs — people who are technical enough to talk to engineers but don't need file paths or framework names. Focus on **what users can do and how those features actually work**: what happens when a user creates a task, how data is connected, what the screens show, what's broken. Write it like an engineer explaining the app to their PM over lunch — direct, concrete, no metaphors or analogies, no dumbing down. PMs care about user actions, data relationships, feature behavior, and known issues.

The "Full detail" layer is for when someone needs to dig into implementation — file paths, version numbers, code patterns, Mermaid diagrams.

```markdown
# Architecture Overview

## Quick Summary
[Narrative overview of the app focused on what it does and how it works from a product perspective. Cover:
- What the app is and who it's for
- What users can do (the main workflows)
- How the data is connected (e.g., tasks belong to projects, projects have owners)
- What's notable — bugs, missing features, thin areas
Keep it to a short paragraph. No technical jargon needed.]

---

## System Architecture

### How it works
[Describe the app in terms of what users can do and how those actions flow through the system. Example tone:

"When a user creates a task, the form posts to `/api/tasks` with a title, status, priority, assignee, project, due date, and estimated hours. The task shows up in both the list view and the kanban board on the Tasks page, and counts toward the project's progress bar and the Dashboard stats.

Projects, tasks, and team members are all linked — tasks roll up to projects, projects have owners, and the Dashboard aggregates across everything. The Team page is read-only right now (no create/edit). Settings is a flat key-value store.

Filtering on the Tasks page hits the same endpoint with query parameters — you can filter by status, priority, assignee, or project."

Focus on: user actions → what happens → how data connects → what each screen shows. Mention endpoints by name but don't explain what an endpoint is.]

### Full detail
[Mermaid diagram + technical description of major layers, entry points, routing, and data flow between components]

---

## Tech Stack

### How it works
[Name the key technologies and what role they play, without over-explaining. Example: "React 18 on the frontend, Express on the backend, SQLite for storage. Vite handles the dev server and build. Tests run through Vitest with React Testing Library. No external UI libraries — all components are custom."]

### Full detail
[Frameworks, libraries, tools — with versions, purpose, and configuration details]

---

## UI Components & Design Patterns

### How it works
[What reusable pieces exist and how they're used across the app. Example: "There are buttons in three styles (primary, secondary, ghost), color-coded badges for status and priority, a modal component that wraps all create/edit forms, and a loading spinner. Everything follows a design system with a consistent color palette (brand orange, status colors, neutral grays), the Outfit font, and an 8px spacing grid. New features can reuse all of this."]

### Full detail
[Component inventory with props/variants, design token system, naming conventions, style approach, code patterns]

---

## Key Files Reference
[Quick-reference table of the most important files and what they do]

## Development Workflow
[How to install, run, test, and build]
```

**Step 3: Save to `docs/architecture-overview.md`**

**Step 4: Present a summary** to the user — highlight the most important findings from each sub-agent analysis. Keep it concise — the full details are in the saved document.

## Guidelines

- Each sub-agent should explore independently. The value is three separate perspectives, not one long sequential search.
- Use Mermaid diagrams where they add clarity (architecture, data flow).
- Be specific — reference actual file paths and component names.
- The output should be useful as an ongoing reference document, not just a one-time read.
