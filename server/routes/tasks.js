import { Router } from 'express';
import getDb from '../db/connection.js';

const router = Router();

// GET /api/tasks — all tasks, with optional filters
router.get('/', (req, res) => {
  const db = getDb();
  const { status, priority, assignee_id, project_id } = req.query;

  let query = `
    SELECT t.*, tm.name as assignee_name, p.name as project_name
    FROM tasks t
    LEFT JOIN team_members tm ON t.assignee_id = tm.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND t.status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND t.priority = ?';
    params.push(priority);
  }
  if (assignee_id) {
    query += ' AND t.assignee_id = ?';
    params.push(assignee_id);
  }
  if (project_id) {
    query += ' AND t.project_id = ?';
    params.push(project_id);
  }

  query += ' ORDER BY t.due_date ASC';

  const tasks = db.prepare(query).all(...params);
  res.json(tasks);
});

// GET /api/tasks/:id — single task
router.get('/:id', (req, res) => {
  const db = getDb();
  const task = db.prepare(`
    SELECT t.*, tm.name as assignee_name, p.name as project_name
    FROM tasks t
    LEFT JOIN team_members tm ON t.assignee_id = tm.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?
  `).get(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /api/tasks — create task
router.post('/', (req, res) => {
  const db = getDb();
  const { title, description, status, priority, assignee_id, project_id, due_date, estimated_hours } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const result = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, assignee_id, project_id, due_date, estimated_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    description || '',
    status || 'todo',
    priority || 'medium',
    assignee_id || null,
    project_id || null,
    due_date || null,
    estimated_hours || 0
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

// PUT /api/tasks/:id — update task
router.put('/:id', (req, res) => {
  const db = getDb();
  const { title, description, status, priority, assignee_id, project_id, due_date, estimated_hours } = req.body;

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare(`
    UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      priority = COALESCE(?, priority),
      assignee_id = COALESCE(?, assignee_id),
      project_id = COALESCE(?, project_id),
      due_date = COALESCE(?, due_date),
      estimated_hours = COALESCE(?, estimated_hours),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(title, description, status, priority, assignee_id, project_id, due_date, estimated_hours, req.params.id);

  const task = db.prepare(`
    SELECT t.*, tm.name as assignee_name, p.name as project_name
    FROM tasks t
    LEFT JOIN team_members tm ON t.assignee_id = tm.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?
  `).get(req.params.id);
  res.json(task);
});

// DELETE /api/tasks/:id — delete task
router.delete('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ message: 'Task deleted' });
});

export default router;
