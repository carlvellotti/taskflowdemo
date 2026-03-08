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

**Step 2: Synthesize results** once all three agents return. Combine their findings into a single document with these sections:

```markdown
# Architecture Overview

## System Architecture
[Mermaid diagram + description of major layers and how they connect]

## Tech Stack
[Frameworks, libraries, tools — with versions and purpose]

## UI Components & Design Patterns
[Reusable components, design tokens, naming conventions, style approach]

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
