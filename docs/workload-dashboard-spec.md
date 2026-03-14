# Feature Spec: Team Workload Dashboard

## Vision

A workload heatmap on the Team page that gives team leads instant visibility into how work is distributed across their team. At a glance, every member is color-coded — green (available), yellow (at-capacity), red (overloaded) — so imbalances are obvious before they become problems. The dashboard is the primary feature; triage capability (reassigning tasks from overloaded members) is included but secondary to the visibility layer.

**Primary user:** Team lead managing their direct reports' workload day-to-day.

**Demo moment:** VP sees the whole team's capacity at a glance — who's green, yellow, red — and immediately understands the distribution problem.

## Constraints

### Scope boundaries
- V1 includes triage (reassignment), but the core value is the heatmap view
- Single-task reassignment only — no bulk reassign, no task splitting, no estimate editing
- No real-time updates — data refreshes on page load and after reassignment actions
- No new database schema — uses existing `tasks.estimated_hours`, `tasks.assignee_id`, `tasks.status`, `tasks.priority`, `tasks.due_date`

### Overload detection: Relative threshold + absolute floor
- **Relative:** Compare each member's active hours to team average
  - Available: below team average
  - At-capacity: 100%–149% of team average
  - Overloaded: 150%+ of team average
- **Absolute floor:** If a member exceeds 40 active hours, they are overloaded regardless of team average (catches the "everyone is drowning" scenario)

### Unestimated tasks
- Tasks with 0 estimated hours are excluded from hours totals
- A warning badge shows "X tasks unestimated" per member so the lead knows the numbers may be incomplete

### Reassignment guard rail
- **Blocked:** Cannot reassign tasks to members who are already overloaded. The UI should prevent this action and show appropriate feedback.

## Acceptance Criteria

*Ordered by priority:*

1. **Color-coded status heatmap** — Each team member displays a color-coded status (available/at-capacity/overloaded) based on team-relative thresholds with an absolute floor, visible at a glance without interaction
2. **Member metrics** — Dashboard shows all team members with total active estimated hours, active task count, and task status breakdown (todo, in-progress, in-review, done)
3. **Unestimated task warning** — Members with tasks that have 0 estimated hours show a warning indicator with the count of unestimated tasks
4. **Triage panel** — Clicking an overloaded member opens a detail view showing their tasks with options to reassign individual tasks to other (non-overloaded) members
5. **Live recalculation** — Reassigning a task updates the workload numbers for both the source and target members without a full page refresh
6. **Responsive grid** — Dashboard uses a responsive grid layout that works on both desktop and tablet widths

## Edge Cases & Error States

| Scenario | Expected Behavior |
|----------|-------------------|
| Member has 0 active tasks | Show as "available" (green), display 0 hours and 0 tasks — they're clearly free |
| All members exceed 40hr absolute floor | Everyone shows as overloaded (red) — the absolute floor overrides relative comparison |
| Tasks with 0 estimated hours | Excluded from hours total, flagged with "X tasks unestimated" warning badge |
| Reassign to overloaded member | Blocked — UI prevents the action and shows feedback explaining why |
| Member has all tasks completed (done) | Active hours = 0, show as available. Completed tasks don't count toward workload |
| API error loading workload data | Show error state with retry option — don't render a broken/partial dashboard |
| Team has only 1 member | Relative threshold falls back to absolute floor only (no meaningful average to compare against) |

## Variant Directions

### Variant A: Expandable Rows
- **Interaction model:** Each team member is a row that expands inline to reveal their task breakdown and triage controls. No navigation away from the dashboard.
- **Strongest argument:** Context preservation — you never leave the overview. Expand one person, collapse, expand another. Fast comparison.
- **Biggest risk:** Gets cluttered — with 7 members expanded, the page becomes an overwhelming scroll and the heatmap disappears.
- **Mitigation:** Only allow one row expanded at a time (accordion pattern).

### Variant B: Slide-Out Panel
- **Interaction model:** Clicking a member opens a side panel (like an email preview pane) showing their task detail while the dashboard grid stays visible.
- **Strongest argument:** Familiar pattern — Gmail, Slack, Linear all use this. Users already know how it works.
- **Biggest risk:** Neither view is great — split view means both the overview and the detail are compromised, too small for either to shine.
- **Mitigation:** Make the panel width generous (400-500px) and simplify the grid to a compact list when the panel is open.

### Variant C: Modal Deep-Dive
- **Interaction model:** Clicking a member opens a full modal overlay with comprehensive workload analysis, task list, and triage tools.
- **Strongest argument:** Most screen real estate — can show charts, task groupings, priority breakdowns, things that won't fit in a row or panel.
- **Biggest risk:** Heavy for quick checks — if you just want to peek at someone's tasks, a full modal feels like overkill.
- **Mitigation:** Keep modal content focused. Don't fill the space just because it's there.

## Test Plan

### Visual Verification (puppeteer screenshots)
- [ ] Dashboard with all members showing color-coded status (green/yellow/red)
- [ ] At least one member in each state (available, at-capacity, overloaded)
- [ ] Unestimated task warning badge visible on applicable members
- [ ] Each variant's detail view (expanded row / slide-out panel / modal)
- [ ] Triage panel showing blocked reassignment to an overloaded member
- [ ] Empty/available member card (0 tasks, green status)

### Functional Verification
- [ ] Workload calculation matches expected hours per member (sum of active task estimated_hours)
- [ ] Relative threshold correctly categorizes members (available < avg, at-capacity 100-149%, overloaded 150%+)
- [ ] Absolute floor (40hrs) overrides relative threshold when all members are heavily loaded
- [ ] Reassignment updates both source and target member metrics without page refresh
- [ ] Blocked reassignment to overloaded members shows appropriate feedback
- [ ] Completed tasks (status: done) excluded from active workload calculations

### Edge Case Verification
- [ ] Member with 0 active tasks shows as available (green)
- [ ] All members above 40hr absolute floor shows everyone as overloaded
- [ ] Tasks with 0 estimated hours flagged as unestimated (not included in hours total)
- [ ] Single-member team falls back to absolute floor threshold only
