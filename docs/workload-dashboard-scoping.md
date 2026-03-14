# Scoping Brief: Team Workload Dashboard

## Feature Summary

A workload view on the Team page that shows how much work each team member has on their plate — total estimated hours, task counts by status, overload warnings when someone has too much, and a way to triage overloaded members by reassigning or reprioritizing their tasks. This fills a gap in TaskFlow: right now the Team page just shows names and roles with no visibility into workload.

## Affected Files

| File | What Changes | Why |
|------|-------------|-----|
| `client/src/pages/Team.jsx` | Add workload dashboard section above or alongside the member list | Currently just renders MemberList — needs to integrate workload data and new components |
| `server/routes/teams.js` | Optionally add aggregate workload endpoint | `GET /api/team/:id/tasks` already exists, but a summary endpoint avoids N+1 fetching |
| `client/src/components/common/Badge.jsx` | Add workload status values to colorMap | Need 'overloaded', 'at-capacity', 'available' states with appropriate colors |

## New Files to Create

| File | Purpose | Based On |
|------|---------|----------|
| `client/src/hooks/useTeamWorkload.js` | Fetches team + tasks, calculates per-member workload metrics | Follows `useTasks.js` pattern — wraps `useApi` with computed data |
| `client/src/components/team/WorkloadCard.jsx` | Card showing one member's workload — hours, task count, status breakdown, overload indicator | Combines `MemberCard` avatar pattern + `Stats` metric pattern |
| `client/src/components/team/WorkloadDashboard.jsx` | Grid of WorkloadCards with summary stats and overload warnings at the top | Follows `MemberList` grid pattern + `Stats` summary pattern |
| `client/src/components/team/TriagePanel.jsx` | Modal/panel showing an overloaded member's tasks with options to reassign or reprioritize | Uses `Modal` + `TaskRow` patterns, adds reassign action |

## Existing Patterns to Reuse

- **MemberCard avatar** — initials circle with `avatar_color`, reuse for workload card identity
- **Stats component** — grid of stat cards with label + large value; same pattern for workload metrics per member
- **Badge component** — pill-shaped status indicators; extend colorMap for workload states (overloaded/at-capacity/available)
- **MemberList grid** — `repeat(auto-fill, minmax(320px, 1fr))` responsive grid layout
- **useTasks hook** — filter pattern with query string building; workload hook can filter by assignee
- **Modal component** — overlay + card wrapper for the triage panel
- **TaskRow component** — task display in triage view showing what's on someone's plate
- **Design tokens** — `--color-error` for overloaded, `--color-warning` for at-capacity, `--color-success` for available capacity
- **Inline style objects** — all components use this approach, no CSS modules

## Database Changes

**No schema changes required.** All the data needed already exists:
- `tasks.estimated_hours` — workload weight per task (seeded with 2–16 hour values)
- `tasks.assignee_id` — links tasks to team members
- `tasks.status` — distinguishes active work (todo, in-progress, in-review) from completed (done)
- `tasks.priority` — identifies urgent items for triage
- `tasks.due_date` — flags overdue work

The seed data already has realistic workload imbalance — some members are heavily loaded, others are light. Good for demo purposes.

## API Changes

**Already available:**
- `GET /api/team` — all members
- `GET /api/team/:id/tasks` — tasks for a specific member (with project names, ordered by due date)
- `GET /api/tasks?assignee_id=X` — filter tasks by assignee

**Optional new endpoint:**
- `GET /api/team/workload` — returns per-member workload summaries in one call (total hours, task counts by status, overload flag). Not strictly required — the client can compute this from existing endpoints — but avoids fetching all tasks and aggregating in the browser.

**For triage (reassignment):**
- `PUT /api/tasks/:id` already supports updating `assignee_id` — no new endpoint needed for reassignment.

## Test Plan

| What to Test | Pattern to Follow |
|-------------|-------------------|
| `GET /api/team/:id/tasks` returns correct tasks | `tests/api/tasks.test.js` — Vitest + fetch against Express |
| Workload aggregation logic (hours calculation, overload detection) | Unit test the hook's computation, mock the API responses |
| WorkloadCard renders metrics correctly | `tests/components/TaskRow.test.jsx` — Vitest + React Testing Library |
| Triage reassignment updates the task | Existing `PUT /api/tasks/:id` test pattern |

**Current test gaps:** No tests exist for team endpoints or for any team components. This feature would add the first team-related test coverage.

## Complexity Assessment

**Medium complexity.** Here's why:

- **Data layer is ready** — estimated_hours, assignee_id, status, due_date all exist. No schema changes.
- **API is mostly ready** — per-member task fetching already works. Optional aggregate endpoint is straightforward.
- **UI patterns exist** — Stats cards, Badge, MemberCard, Modal, TaskRow all provide building blocks. This is assembly, not invention.
- **The new work is:** a custom hook for workload aggregation, 3-4 new components, integration into Team.jsx, and the triage interaction (reassign from modal).
- **What makes it medium, not low:** The triage panel adds interactivity — selecting a member, viewing their tasks, reassigning tasks to other members, and having the workload recalculate. That's a multi-step flow with state management.

## Risks & Dependencies

- **Overload threshold** — What counts as "overloaded"? Needs a product decision. Options: fixed hour cap (e.g., 40hrs), relative to team average, or configurable in Settings.
- **No capacity concept** — The database tracks estimated_hours per task but has no "capacity" field per member. Overload detection either needs a hardcoded threshold or a new setting.
- **Estimated hours data quality** — Workload accuracy depends on tasks having estimated_hours filled in. Some tasks may have 0 (the default). The dashboard should handle this gracefully.
- **Triage scope creep** — Reassigning tasks is simple, but PMs might also want to split tasks, adjust estimates, or bulk-reassign. Keep V1 to single-task reassignment.
- **No real-time updates** — If multiple PMs are triaging simultaneously, they'll see stale data. Not a concern for this practice app, but worth noting for a real product.
