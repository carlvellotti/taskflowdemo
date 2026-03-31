---
name: scope-feature
description: |
  Scope a proposed feature against the codebase. Maps what you'd need to build,
  what already exists, dependencies and unknowns, and where the difficulty is.
  Assumes /explore-codebase has already been run — uses docs/ for context.
  Saves a scoping brief to docs/. Use when you want to understand what
  building a feature would actually require.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

You are running a feature scoping analysis. The user provides a feature description as input — everything after `/scope-feature` on the command line. This might be rough notes, a few bullet points, or a stream-of-consciousness description. That's fine — work with whatever you get.

## Context

This skill assumes `/explore-codebase` has already been run and `docs/architecture-overview.md` exists. Start by reading that file to understand the existing architecture, tech stack, and component patterns. Don't re-explore the entire codebase from scratch — use what's already been mapped.

## Process

**Step 1: Read existing context.** Read `docs/architecture-overview.md` and any other relevant docs in `docs/`. Then read only the specific files you need to answer the scoping questions below — don't scan the entire codebase.

**Step 2: Parse the feature description.** Extract what the user wants built, even if it's rough.

**Step 3: Generate the scoping brief:**

```markdown
# Scoping Brief: {Feature Name}

## What You'd Need to Build
{The major pieces — new components, endpoints, database changes. For each one, a sentence on what it does and why it's needed. Be specific about file paths and patterns.}

## What Already Exists
{Existing components, hooks, API patterns, and styles the new feature should reuse. Reference specific files. This is what makes the build faster and more consistent.}

## Dependencies & Unknowns
{Things that depend on other things. External services or integrations that would need investigation. Areas where more conversation with engineering is needed before committing to an approach.}

## Where the Difficulty Is
{Which pieces are straightforward and which are complex — and WHY. Ground this in specific code patterns, architectural constraints, or gaps in the existing system. This is what helps a PM understand where to focus attention and what to ask engineers about.}
```

**Step 4: Save to `docs/{feature-name}-scoping.md`.**

**Step 5: Present a summary** of the key findings. Lead with what's hard and why.

## Guidelines

- Be specific — reference actual file paths, component names, and code patterns.
- Do NOT estimate hours, story points, sprints, or timelines. That's for the engineering team.
- Do NOT generate a test plan. That's for QA and engineering.
- Ground everything in what you found in the code, not general assumptions.
- The brief should help a PM understand where their leverage is — what's easy to build on, what requires new infrastructure, and what needs more investigation before anyone commits to an approach.
- Keep it concise. A PM should be able to read this in 2 minutes and walk into a planning conversation informed.
