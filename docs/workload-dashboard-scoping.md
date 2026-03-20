# Scoping Brief: Team Workload Dashboard

## Feature Summary

The Team Workload Dashboard adds workload visibility to the Team page. It shows how many hours of active work each team member has, highlights overloaded members, and provides a flag-and-triage system to reassign work. The audience is the PM (the current mock user) who needs to spot bottlenecks before they cause missed deadlines. The feature builds on top of the existing Team page (`/team`) and reuses established component patterns (stat cards, badges, task rows).

## Affected Files

| File | What Changes | Why |
|------|-------------|-----|
| `client/src/pages/Team.jsx` | Add workload summary stats, overload alerts section, and tabbed/toggled view between member cards and workload detail | This page is the entry point; currently only renders `MemberList` |
| `client/src/components/team/MemberCard.jsx` | Add workload bar (hours used/capacity), overload badge, task count | Cards need to surface workload at a glance |
| `client/src/components/team/MemberList.jsx` | Accept and pass workload data to each `MemberCard`, optionally sort by workload | List drives the card rendering |
| `client/src/hooks/useTeam.js` | Extend to fetch workload data (or create separate hook) | Current hook only fetches member profiles, no task aggregation |
| `server/routes/teams.js` | Add workload endpoint (`GET /api/team/workload`) | Backend needs to aggregate task hours per member |
| `client/src/components/common/Badge.jsx` | Add `overloaded` and `underloaded` entries to `colorMap` | New status indicators for workload state |

## New Files to Create

| File | Purpose | Based On |
|------|---------|----------|
| `client/src/components/team/WorkloadBar.jsx` | Horizontal progress bar showing assigned hours vs. capacity (e.g., 40h/week) | Style pattern from `Stats.jsx` stat cards; uses design tokens for colors |
| `client/src/components/team/WorkloadSummary.jsx` | Row of stat cards at top of Team page: total team hours, avg utilization, overloaded count, available capacity | Direct adaptation of `client/src/components/dashboard/Stats.jsx` |
| `client/src/components/team/OverloadAlert.jsx` | Alert banner listing overloaded members with "Triage" action button | Card style from `MemberCard.jsx`; error color tokens for urgency |
| `client/src/components/team/MemberWorkloadDetail.jsx` | Expandable detail view for a single member: their assigned tasks sorted by priority/due date, with reassign action | Task list pattern from `TaskRow.jsx`; uses `Badge` for status/priority |
| `client/src/components/team/TriageModal.jsx` | Modal for reassigning tasks from an overloaded member to another team member | Follow `Modal` pattern in `client/src/components/common/Modal.jsx` |
| `client/src/hooks/useWorkload.js` | Hook to fetch `/api/team/workload` data | Pattern from `useTeam.js` (wraps `useApi`) |
| `tests/api/workload.test.js` | API tests for workload endpoint | Pattern from `tests/api/tasks.test.js` |
| `tests/components/WorkloadBar.test.jsx` | Component test for the progress bar | Pattern from `tests/components/TaskRow.test.jsx` |

## Existing Patterns to Reuse

**Components:**
- `Stats.jsx` pattern for the workload summary cards (grid of stat cards with label/value)
- `Badge.jsx` color map for workload status indicators (add `overloaded`/`at-capacity`/`available` entries)
- `TaskRow.jsx` grid layout for displaying member task lists in the detail/triage view
- `MemberCard.jsx` card+avatar pattern for the member workload cards
- `Modal.jsx` for the triage/reassign modal
- `Spinner.jsx` for loading states

**Hooks:**
- `useApi.js` as the base for `useWorkload` (same fetch/loading/error pattern)
- `useTasks.js` `updateTask` pattern for the reassign action (PUT to `/api/tasks/:id`)

**Styles:**
- All design tokens from `tokens.css`; status colors map directly to workload states:
  - `--color-success` / `--color-success-light` for under-capacity (green)
  - `--color-warning` / `--color-warning-light` for near-capacity (amber)
  - `--color-error` / `--color-error-light` for overloaded (red)
  - `--color-info` / `--color-info-light` for at-capacity/normal (blue)
- Card style: `var(--color-surface)` bg, `var(--color-border)` border, `var(--border-radius-lg)`, `var(--space-6)` padding
- 8-point spacing grid for all layout

**API:**
- `api-client.js` helpers (`api.get`, `api.put`) for all frontend data fetching
- Express router pattern from `server/routes/teams.js` for the new endpoint
- `getDb()` from `server/db/connection.js` for database access

## Database Changes

**No schema changes required.** The `tasks` table already has `assignee_id`, `estimated_hours`, `status`, `priority`, and `due_date`. All workload calculations can be derived from existing columns.

**New queries needed:**

1. **Workload aggregation query** (for `GET /api/team/workload`):
```sql
SELECT
  tm.id,
  tm.name,
  tm.role,
  tm.avatar_color,
  COUNT(CASE WHEN t.status != 'done' THEN 1 END) as active_task_count,
  COALESCE(SUM(CASE WHEN t.status != 'done' THEN t.estimated_hours ELSE 0 END), 0) as total_estimated_hours,
  COUNT(CASE WHEN t.status != 'done' AND t.priority IN ('urgent', 'high') THEN 1 END) as high_priority_count,
  COUNT(CASE WHEN t.status != 'done' AND t.due_date < date('now') THEN 1 END) as overdue_count
FROM team_members tm
LEFT JOIN tasks t ON t.assignee_id = tm.id
GROUP BY tm.id
ORDER BY total_estimated_hours DESC
```

2. **Capacity threshold:** Use a default of 40 hours per member per week. This could later become a `settings` table entry or a column on `team_members`, but hardcoding the default is sufficient for v1.

**Optional seed data change:** None required. The existing seed data already creates realistic workload imbalance (Rachel Torres has ~100+ estimated hours across active tasks, while others have much less).

## API Changes

**New endpoint:**

`GET /api/team/workload`

Response format:
```json
{
  "members": [
    {
      "id": 3,
      "name": "Rachel Torres",
      "role": "Senior Engineer",
      "avatar_color": "#7c3aed",
      "active_task_count": 10,
      "total_estimated_hours": 95,
      "high_priority_count": 7,
      "overdue_count": 1,
      "capacity_hours": 40,
      "utilization_pct": 237,
      "status": "overloaded"
    }
  ],
  "summary": {
    "total_team_hours": 210,
    "avg_utilization_pct": 75,
    "overloaded_count": 1,
    "available_capacity_hours": 70
  }
}
```

Workload status thresholds (calculated server-side):
- `available`: utilization < 50%
- `normal`: utilization 50-80%
- `at-capacity`: utilization 80-100%
- `overloaded`: utilization > 100%

**Existing endpoint reused:**

`PUT /api/tasks/:id` with `{ assignee_id: newMemberId }` for the reassign/triage action. This already exists in the tasks routes.

## Test Plan

**Existing test coverage:**
- `tests/api/tasks.test.js` covers task API (GET, filtering). No team API tests exist.
- `tests/components/TaskRow.test.jsx` covers task row rendering. No team component tests exist.

**New tests needed:**

API tests (`tests/api/workload.test.js`):
- `GET /api/team/workload` returns all members with workload fields
- Response includes `active_task_count`, `total_estimated_hours`, `high_priority_count`
- Overloaded members (>40h) get `status: "overloaded"`
- Members with no tasks get `status: "available"` and zero counts
- Summary totals are accurate

Component tests:
- `tests/components/WorkloadBar.test.jsx`: renders correct fill percentage, shows correct color for each status threshold, handles zero hours
- `tests/components/WorkloadSummary.test.jsx`: renders four stat cards with correct values
- `tests/components/OverloadAlert.test.jsx`: renders alert only when overloaded members exist, shows correct member names

Follow the existing pattern: Vitest + `@testing-library/react` for components, Vitest + fetch against a real server instance for API tests.

## Complexity Assessment

**Medium**

Justification:
- **No schema changes.** All data already exists in the database. The feature is purely additive queries and UI.
- **Clear patterns to follow.** Every new component has a direct analogue in the codebase (Stats, Badge, TaskRow, Modal). No new architectural patterns needed.
- **Single new API endpoint.** One SQL aggregation query, one response format. The reassign action reuses the existing task update endpoint.
- **What makes it Medium, not Low:** The triage modal introduces interactive state management (select member, reassign task, refresh workload data). The workload bar is a new visual pattern. Testing the aggregation query edge cases (members with zero tasks, all tasks done) requires care.

Estimated scope: 6-8 new/modified files, ~400-500 lines of new code.

## Risks and Dependencies

- **Capacity is a guess.** Hardcoding 40 hours/week assumes full-time, single-project allocation. Real teams have meetings, PTO, and multi-project splits. v1 ships with the hardcoded default; making it configurable per member is a follow-up.
- **`estimated_hours` data quality.** The feature depends on tasks having reasonable `estimated_hours` values. If teams leave this field at 0, the dashboard shows everyone as "available." The UI should handle the zero-data state gracefully (show "No estimates" rather than misleading green bars).
- **No real-time updates.** The workload data is fetched on page load. If someone reassigns a task in another tab, the dashboard goes stale until refresh. The `refetch` pattern from `useApi` handles manual refresh; polling or WebSocket is out of scope for v1.
- **Reassign cascades.** Triaging tasks from Rachel to James changes James's workload. The triage modal should re-fetch workload data after each reassignment so the PM sees the updated state before making the next move.
- **No auth system.** The app uses a hardcoded mock user. The triage/reassign action has no permission model. This is fine for the demo but worth noting.
