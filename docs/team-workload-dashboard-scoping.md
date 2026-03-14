# Scoping Brief: Team Workload Dashboard

## Feature Summary

A workload visibility layer on the Team page that shows how much work each team member has on their plate, warns when someone is overloaded, and lets managers triage and reassign tasks to rebalance. Targets the existing "Product Manager" user persona. Fits naturally into the Team page, which is currently read-only — this turns it into an actionable management tool.

## Affected Files

| File | What Changes | Why |
|------|-------------|-----|
| `client/src/pages/Team.jsx` | Add workload view toggle, fetch workload data, wire up triage modal | Page currently just renders MemberList; needs to become the workload hub |
| `client/src/components/team/MemberCard.jsx` | Add workload indicator, overload warning styling, triage button | Currently shows name/role/email only — needs to surface hours + task counts |
| `client/src/components/team/MemberList.jsx` | Pass workload data + threshold + callbacks through to MemberCards | Currently just maps members to cards |
| `server/routes/teams.js` | Add `GET /api/team/workload` endpoint with aggregated metrics | Existing `GET /api/team/:id/tasks` returns raw tasks but no computed metrics |
| `client/src/pages/Settings.jsx` | Add workload threshold setting (hours per member) | Threshold needs to be configurable |
| `server/routes/settings.js` | No code changes — existing upsert handles new keys | Just needs a new `workload_threshold_hours` key |

## New Files to Create

| File | Purpose | Based On |
|------|---------|----------|
| `client/src/components/team/WorkloadBar.jsx` | Horizontal bar showing hours used vs. capacity with color coding | Stats card pattern from `dashboard/Stats.jsx` + progress bar from `ProjectCard.jsx` |
| `client/src/components/team/TriageModal.jsx` | Modal listing a member's active tasks with reassign dropdowns | `Modal.jsx` wrapper + `TaskRow.jsx` row pattern |
| `client/src/hooks/useWorkload.js` | Hook to fetch `/api/team/workload` and merge with threshold from settings | `useTeam.js` pattern (thin wrapper over `useApi`) |

## Existing Patterns to Reuse

| Pattern | Source | How to Reuse |
|---------|--------|-------------|
| **Metric cards** | `components/dashboard/Stats.jsx` | 4-column grid layout for summary stats (total hours, overloaded count, etc.) |
| **Progress bar** | `components/projects/ProjectCard.jsx` | 6px animated bar — reuse for hours-used-vs-capacity visualization |
| **Badge component** | `components/common/Badge.jsx` | Already handles status/priority coloring — use for "overloaded" / "at capacity" / "available" badges |
| **Modal + form** | `components/common/Modal.jsx` + `tasks/TaskForm.jsx` | Triage modal wraps Modal; reassign dropdown follows form-group pattern |
| **Task row layout** | `components/tasks/TaskRow.jsx` | 5-column grid for task list inside triage modal |
| **useApi hook** | `hooks/useApi.js` | `{ data, loading, error, refetch }` pattern for workload endpoint |
| **api.put for reassign** | `utils/api-client.js` | `api.put('/tasks/:id', { assignee_id })` already works for reassignment |
| **isOverdue / formatRelativeDate** | `utils/format-date.js` | Flag overdue tasks in triage modal |
| **Status/warning colors** | `styles/tokens.css` | `--color-warning`, `--color-error`, `--color-success` + light variants for backgrounds |
| **View toggle buttons** | `pages/Tasks.jsx` | List/Board toggle pattern — reuse for "Cards" / "Workload" view toggle on Team page |

## Database Changes

**No schema changes needed.** All required data already exists:
- `tasks.estimated_hours` — workload calculation
- `tasks.assignee_id` — per-member grouping
- `tasks.status` — filter active vs. done
- `tasks.priority` — flag urgent/high items
- `tasks.due_date` — overdue detection
- `settings` table — stores `workload_threshold_hours` as key-value pair

**New seed data** (optional, in `server/db/seed.sql`):
```sql
INSERT OR IGNORE INTO settings (key, value) VALUES ('workload_threshold_hours', '40');
```

## API Changes

### New: `GET /api/team/workload`

Returns all team members with computed workload metrics in a single call.

**Response format:**
```json
[
  {
    "id": 1,
    "name": "You",
    "role": "Product Manager",
    "email": "you@taskflow.com",
    "avatar_color": "#e63f02",
    "active_task_count": 5,
    "total_estimated_hours": 32,
    "urgent_count": 1,
    "high_count": 2,
    "overdue_count": 0
  }
]
```

**Implementation:** Single SQL query joining `team_members` with aggregated `tasks` data:
```sql
SELECT
  tm.*,
  COUNT(CASE WHEN t.status != 'done' THEN 1 END) as active_task_count,
  COALESCE(SUM(CASE WHEN t.status != 'done' THEN t.estimated_hours ELSE 0 END), 0) as total_estimated_hours,
  COUNT(CASE WHEN t.status != 'done' AND t.priority = 'urgent' THEN 1 END) as urgent_count,
  COUNT(CASE WHEN t.status != 'done' AND t.priority = 'high' THEN 1 END) as high_count,
  COUNT(CASE WHEN t.status != 'done' AND t.due_date < date('now') THEN 1 END) as overdue_count
FROM team_members tm
LEFT JOIN tasks t ON t.assignee_id = tm.id
GROUP BY tm.id
ORDER BY total_estimated_hours DESC
```

### Existing (no changes): `PUT /api/tasks/:id`

Already supports `{ assignee_id: newMemberId }` for reassignment. Used by the triage modal.

### Existing (no changes): `GET /api/team/:id/tasks`

Already returns all tasks for a member with joins. Used to populate the triage modal task list.

## Test Plan

| What to Test | Type | Pattern to Follow |
|-------------|------|------------------|
| `GET /api/team/workload` returns correct aggregations | API integration | `tests/api/tasks.test.js` — spin up Express, seed data, assert response shape |
| Workload calculation excludes "done" tasks | API integration | Filter logic similar to `tasks.test.js` status filter test |
| Overdue count uses correct date comparison | API integration | Seed tasks with past/future due dates, verify counts |
| Members with no tasks return zeroes (not nulls) | API integration | Edge case — LEFT JOIN + COALESCE |
| WorkloadBar renders correct fill percentage | Component unit | Would use React Testing Library (framework installed, pattern in `test-setup.js`) |
| Overload warning appears when hours > threshold | Component unit | Render MemberCard with workload data exceeding threshold |
| Triage modal opens/closes correctly | Component unit | Similar to Modal usage in Tasks page |
| Task reassignment calls PUT and refetches | Component integration | Mock api.put, verify call args + refetch trigger |

## Complexity Assessment

**Medium** — here's why:

**What's straightforward:**
- The data already exists — `estimated_hours`, `assignee_id`, `status`, `due_date` are all in the tasks table. No schema migration.
- One new SQL query handles the aggregation. SQLite handles this fine.
- Every UI pattern needed already exists somewhere in the codebase (progress bars, badges, modals, task rows, metric cards, view toggles).
- Task reassignment already works via `PUT /api/tasks/:id`.
- Settings infrastructure already supports arbitrary key-value storage.

**Where the work is:**
- 3 new frontend components (WorkloadBar, TriageModal, useWorkload hook) — but they're all based on existing patterns.
- MemberCard needs meaningful enhancement (currently minimal — just avatar + name + role).
- The triage modal has the most UI complexity: task list + reassign dropdowns + refetch after changes.
- Need to decide on threshold UX (global setting vs. inline adjustment).

**What keeps it from being High:**
- No new dependencies needed.
- No complex state management (no drag-and-drop, no optimistic updates, no real-time).
- Single new API endpoint, no auth changes, no schema changes.

## Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Tasks with no `estimated_hours`** | Workload shows 0 for members whose tasks lack estimates — misleading | Show task count alongside hours; add "unestimated" count to workload endpoint |
| **Threshold meaning is ambiguous** | "40 hours" per what? Per week? Total backlog? | Start with "total active hours" (simple sum), document it clearly in the UI label |
| **Triage modal refetch timing** | After reassigning a task, both the source and target member's workload data needs to refresh | Refetch the full `/api/team/workload` endpoint after any reassignment |
| **Large task lists in triage modal** | A heavily-loaded member could have 20+ active tasks | Add pagination or scroll within the modal (Modal already supports `overflow-y: auto`) |
| **No undo for reassignment** | Accidental reassignment can't be reversed easily | Log previous assignee in the PUT response; consider a "recent changes" indicator (follow-up) |
