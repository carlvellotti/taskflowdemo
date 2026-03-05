# CLAUDE.md — TaskFlow

## Project Context

TaskFlow is a B2B project management tool built by a startup. You're working on the web application — the core product that teams use daily to manage projects, tasks, and team workload.

**Tech Stack:**
- Frontend: React 18 + React Router + Vite
- Backend: Express.js REST API
- Database: SQLite (via better-sqlite3)
- Testing: Vitest + React Testing Library

**Architecture:** Classic client-server separation. The client (`/client`) is a Vite React app that proxies API calls to the Express server (`/server`) running on port 3001. A single `npm run dev` at root starts both.

## Folder Structure

```
taskflow-app/
├── client/src/
│   ├── components/
│   │   ├── common/        # Button, Modal, Badge, Spinner
│   │   ├── dashboard/     # Stats, RecentActivity
│   │   ├── projects/      # ProjectCard, ProjectList, ProjectForm
│   │   ├── tasks/         # TaskRow, TaskBoard, TaskForm, StatusBadge
│   │   └── team/          # MemberList, MemberCard
│   ├── pages/             # Dashboard, Projects, Tasks, Team, Settings
│   ├── hooks/             # useApi, useTeam, useTasks
│   ├── utils/             # api-client, format-date
│   └── styles/            # tokens.css (design system), globals.css
├── server/
│   ├── routes/            # teams, projects, tasks, settings
│   ├── middleware/         # logger, error-handler
│   ├── db/                # schema.sql, seed.sql, connection.js
│   └── index.js           # Express app entry point
└── tests/                 # API + component tests
```

## Design System

TaskFlow uses a custom design system defined in `client/src/styles/tokens.css`. All styling uses CSS custom properties — never hardcode colors, spacing, or typography values.

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#e63f02` | Primary actions, active nav, brand accent |
| `--color-primary-hover` | `#cc3800` | Button hover states |
| `--color-primary-light` | `#fff1ec` | Active nav background, focus rings |
| `--color-accent` | `#fcc403` | Secondary highlights, medium priority |
| `--color-accent-light` | `#fff9e0` | Accent backgrounds |

### Neutral Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#fafafa` | Page background |
| `--color-surface` | `#ffffff` | Cards, sidebar, modals |
| `--color-surface-hover` | `#f5f5f5` | Hover states on surfaces |
| `--color-border` | `#e5e7eb` | Card borders, dividers |
| `--color-border-light` | `#f3f4f6` | Subtle separators |
| `--color-text` | `#111827` | Primary text |
| `--color-text-secondary` | `#6b7280` | Secondary labels, descriptions |
| `--color-text-muted` | `#9ca3af` | Timestamps, metadata |

### Status Colors

| Status | Color | Light bg |
|--------|-------|----------|
| Success/Done | `--color-success` (#10b981) | `--color-success-light` |
| Warning/On-hold | `--color-warning` (#f59e0b) | `--color-warning-light` |
| Error/Urgent | `--color-error` (#ef4444) | `--color-error-light` |
| Info/In-progress | `--color-info` (#3b82f6) | `--color-info-light` |

### Priority Colors

| Priority | Token |
|----------|-------|
| Urgent | `--color-priority-urgent` (#ef4444) |
| High | `--color-priority-high` (#f97316) |
| Medium | `--color-priority-medium` (#fcc403) |
| Low | `--color-priority-low` (#6b7280) |

### Typography

- **Font:** Outfit (loaded via Google Fonts in `index.html`)
- **Scale:** `--font-size-xs` (0.75rem) through `--font-size-3xl` (1.875rem)
- **Weights:** light (300), normal (400), medium (500), semibold (600), bold (700)
- Headings use `--font-weight-semibold`, body uses `--font-weight-normal`

### Spacing

8-point grid: `--space-1` (0.25rem) through `--space-16` (4rem). Use these tokens for all padding, margins, and gaps.

### Component Patterns

- **Cards:** `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `border-radius: var(--border-radius-lg)`, `padding: var(--space-6)`
- **Buttons:** Three variants — `primary` (solid brand color), `secondary` (bordered), `ghost` (transparent)
- **Badges:** Pill-shaped status/priority indicators using the color map in `Badge.jsx`
- **Forms:** Label above input, focus state uses `--color-primary` border + `--color-primary-light` ring
- **Layout:** Fixed sidebar (240px), scrollable main content area

### Shadows

- `--shadow-sm`: Subtle card elevation
- `--shadow-md`: Dropdowns, popovers
- `--shadow-lg`: Modals

## Contribution Guidelines

When adding or modifying components:

1. **Use design tokens** — never hardcode `#e63f02`, use `var(--color-primary)`
2. **Match existing patterns** — look at similar components before building new ones
3. **Inline styles** — this app uses inline style objects, not CSS modules or styled-components
4. **Keep it simple** — no external UI libraries. All components are built from scratch.
5. **API calls** — use the `api` helper from `utils/api-client.js` (wraps fetch with `/api` prefix)
6. **Hooks** — `useApi` for generic data fetching, `useTeam`/`useTasks` for specific endpoints

## Current User

The app has a hardcoded mock user (no auth):
- **Name:** You
- **Role:** Product Manager
- **ID:** 1
- Set in `server/index.js` middleware as `req.user`

## Database

SQLite auto-creates and seeds on first server start. To reset:
```bash
cd server && npm run db:reset
```

Tables: `team_members`, `projects`, `tasks`, `settings`

## Running the App

```bash
npm run install:all    # Install all dependencies
npm run dev            # Start client + server
npm test               # Run tests
```
