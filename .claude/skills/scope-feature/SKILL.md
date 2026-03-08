---
name: scope-feature
description: |
  Analyze a codebase to scope a proposed feature. Maps affected files, new
  components needed, existing patterns to reuse, test gaps, and estimates
  complexity. Saves a scoping brief to docs/. Run this when you want to
  estimate the work involved in adding a new feature.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

You are running a feature scoping analysis. The user provides a feature description as input — everything after `/scope-feature` on the command line.

## Process

**Step 1: Parse the feature description.** Extract the core functionality, key requirements, and any constraints mentioned.

**Step 2: Analyze the codebase.** Read relevant files to understand:

- **Files affected** — which existing files would need modifications and why
- **New components needed** — what doesn't exist yet that must be created
- **Patterns to reuse** — existing components, hooks, API patterns, and styles the new feature should follow for consistency
- **Database changes** — new tables, columns, seed data, or queries needed
- **API additions** — new endpoints or modifications to existing routes
- **Test gaps** — what tests exist for related features, what new tests would be needed
- **Complexity estimate** — Low / Medium / High with justification based on what you found

**Step 3: Generate the scoping brief:**

```markdown
# Scoping Brief: {Feature Name}

## Feature Summary
{What it does, who it's for, how it fits into the existing app}

## Affected Files
{Table: file path, what changes, why}

## New Files to Create
{Table: file path, purpose, based on which existing pattern}

## Existing Patterns to Reuse
{Specific components, hooks, styles, and API patterns to reference}

## Database Changes
{New tables/columns, schema changes, seed data updates}

## API Changes
{New endpoints, modified endpoints, request/response formats}

## Test Plan
{What to test, which existing test patterns to follow}

## Complexity Assessment
{Low/Medium/High — with specific justification grounded in the codebase}

## Risks & Dependencies
{What could go wrong, what depends on what, areas of uncertainty}
```

**Step 4: Save to `docs/{feature-name}-scoping.md`** — derive the filename from the feature description using kebab-case.

**Step 5: Present a summary** of the key findings. Highlight the most important takeaways: how many files are affected, what can be reused, and the overall complexity assessment.

## Guidelines

- Be specific — reference actual file paths, component names, and code patterns.
- Ground the complexity estimate in what you found, not gut feel.
- Flag areas of uncertainty where more information is needed.
- The brief should be useful in a sprint planning conversation — an engineer should be able to read it and say "yes, that's right" or "you missed this."
