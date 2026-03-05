# TaskFlow

A B2B project management tool for tracking tasks, projects, and team workload.

## Tech Stack

- **Frontend:** React 18, React Router, Vite
- **Backend:** Express.js, better-sqlite3
- **Testing:** Vitest, React Testing Library

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Start both client and server
npm run dev
```

The client runs on `http://localhost:5173` and the API on `http://localhost:3001`.

## Project Structure

```
taskflow-app/
  client/             # React frontend (Vite)
    src/
      components/     # Reusable UI components
      pages/          # Route-level page components
      hooks/          # Custom React hooks
      utils/          # Helper functions
      styles/         # CSS tokens and globals
  server/             # Express API server
    routes/           # API route handlers
    middleware/       # Express middleware
    db/               # SQLite schema, seeds, connection
  tests/              # Test files
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/team | List all team members |
| GET | /api/team/:id | Get team member |
| GET | /api/team/:id/tasks | Get member's tasks |
| GET | /api/projects | List all projects |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/tasks | List tasks (filterable) |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/settings | Get app settings |
| PUT | /api/settings | Update settings |

## Running Tests

```bash
npm test
```

## Database

SQLite database auto-creates on first server start. To reset:

```bash
cd server && npm run db:reset
```
