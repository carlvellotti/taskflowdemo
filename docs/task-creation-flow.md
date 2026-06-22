# Task Creation Flow

How a new task moves from the TaskForm UI through the API to the database and back.

```mermaid
sequenceDiagram
    participant U as User
    participant F as TaskForm
    participant S as Server
    participant DB as SQLite
    U->>F: Fill + submit task
    F->>S: POST /api/tasks
    S->>DB: INSERT INTO tasks
    DB-->>S: new row id
    S-->>F: 201 Created
    F-->>U: Show new task in list
```

## Notes
- `TaskForm.jsx` posts via the `api` helper (`utils/api-client.js`), which prefixes `/api`.
- The Express `tasks` route validates and inserts via better-sqlite3.
- On success the client optimistically appends the new task to the board.
<!-- probe A11 -->
