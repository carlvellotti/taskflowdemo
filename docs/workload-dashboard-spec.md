# Feature Spec: Team Workload Dashboard

## Vision

Transform the Team page from a static roster into a capacity planning tool. The PM sees team workload at a glance, identifies imbalances instantly, and redistributes tasks with justification — all without leaving the team context.

Core loop: **see the imbalance, decide what to move, move it with a reason, notify the people.**

## Constraints

- **No auto-reassignment.** Claude/system can suggest reassignments, but the PM makes every decision.
- **Clean layouts only.** Avoid busy, cluttered interfaces. Information hierarchy matters.
- **Scale to 25 team members.** Layout and performance must work at this size.
- **Stay consistent with existing patterns.** Stats cards, Badge component, design tokens from tokens.css. Inline style objects, no CSS modules.
- **No schema changes.** All data derived from existing tasks table (assignee_id, estimated_hours, status, priority, due_date).
- **Default capacity: 40 hours/week.** Hardcoded for v1.

## Acceptance Criteria

1. **Team page shows workload summary stats** — total team hours, overloaded count, available capacity (MOST CRITICAL)
2. **Each team member shows assigned hours vs. capacity** with visual indicator (green under 80%, amber 80-100%, red over 100%)
3. **Overloaded members are immediately visible** without clicking anything
4. **Clicking a member opens a slide-out panel** showing their task list sorted by priority/due date, while the team overview remains visible
5. **PM can reassign a task** to another member with a justification comment
6. **Reassignment notifies impacted people** — both old assignee and new assignee see the justification on the task

## Edge Cases & Error States

### Empty state
- Member with zero tasks: show as "available" with 0 hours, green indicator. Do not hide them.

### Missing estimates
- If tasks have estimated_hours = 0: show a warning indicator on that member's workload bar. Fall back to task count instead of hours so the dashboard doesn't show a false "available" status.

### Refresh after triage
- Workload numbers refresh once after the PM finishes triaging (not after each individual reassignment). Provide a "Done triaging" or refresh action.

### Reassign to overloaded person
- When reassigning a task to someone already at or over capacity, show a confirmation warning: "This person is already at [X]% capacity. Proceed?" PM can override but must acknowledge.

### Multi-reassign
- Support reassigning 3+ tasks in a single triage session. All workload numbers update correctly after the session completes.

### Justification comment
- Saved on the task itself. Visible to both previous assignee and new assignee.

### Data boundaries
- Must handle 25 team members with up to 20 tasks each without layout breaking or performance degradation.

## Variant Directions

### Variant A: Expandable Rows
- **Interaction:** Each member is a row. Click to expand inline, showing their tasks below. Reassign from the expanded view.
- **Strongest argument:** Full picture without leaving context.
- **Biggest risk:** Too much interaction hassle and context switching. PMs work in team context, not individual deep-dives. Expanding/collapsing multiple rows gets tedious.
- **Verdict:** Build for comparison, but not the expected winner.

### Variant B: Slide-Out Panel (PREFERRED)
- **Interaction:** Member list stays visible on the left. Click a member and a panel slides in from the right with task detail, reassign controls, and justification field.
- **Strongest argument:** Easy at-a-glance view of the whole team plus details. Overview never disappears. Side-by-side comparison is natural.
- **Biggest risk:** Panel width on smaller screens. Need to ensure the member list doesn't get squeezed.
- **Verdict:** Expected winner. Matches PM workflow of team-level thinking with selective drill-down.

### Variant C: Modal Deep-Dive
- **Interaction:** Click a member, full modal opens with complete task breakdown, reassign controls, justification field.
- **Strongest argument:** Maximum focus and screen real estate for one person's workload.
- **Biggest risk:** Blocks the team view. Forces one-at-a-time thinking, loses team context. Same problem as Variant A.
- **Verdict:** Build for comparison, but likely too isolated for team-level planning.

## Test Plan

### Visual verification (puppeteer screenshots)
- [ ] Dashboard loads with summary stats visible at top
- [ ] Workload bars show correct color coding (green/amber/red) based on utilization thresholds
- [ ] Overloaded member (Rachel Torres) is visually distinct without clicking
- [ ] Slide-out panel opens alongside the member list (Variant B)
- [ ] Expandable row expands inline (Variant A)
- [ ] Modal opens with full detail (Variant C)
- [ ] Empty state: member with 0 tasks shows as "available" with green indicator
- [ ] Warning state: tasks with missing estimates show warning indicator
- [ ] Layout holds with 7 seed members (no overflow, no clipping)

### Functional verification
- [ ] Reassign a task from Rachel to an underloaded member
- [ ] Justification comment appears on the task after reassignment
- [ ] Both old and new assignee can see the justification
- [ ] Workload numbers refresh after triage session completes
- [ ] Reassign 3+ tasks in one session — all numbers update correctly
- [ ] Reassign to overloaded person triggers confirmation warning
- [ ] PM can override the overload warning and proceed
- [ ] Works with up to 25 team members without layout breaking

### Edge case verification
- [ ] Member with zero tasks displays as "available"
- [ ] Tasks with 0 estimated hours trigger warning + task count fallback
- [ ] All 7 seed members render with correct workload data from the aggregation query
- [ ] Slide-out panel (Variant B) doesn't squeeze member list below usable width

## Technical Reference

See `docs/workload-dashboard-scoping.md` for:
- Affected files and new files to create
- Existing patterns to reuse (Stats.jsx, Badge.jsx, TaskRow.jsx, Modal.jsx)
- API endpoint design (GET /api/team/workload)
- Database query for workload aggregation
- Complexity assessment (Medium)
