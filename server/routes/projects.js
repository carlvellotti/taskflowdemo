import { Router } from 'express';
import getDb from '../db/connection.js';

const router = Router();

// GET /api/projects — all projects
router.get('/', (req, res) => {
  const db = getDb();
  const projects = db.prepare(`
    SELECT p.*, tm.name as owner_name,
      (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
      (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_count
    FROM projects p
    LEFT JOIN team_members tm ON p.owner_id = tm.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(projects);
});

// GET /api/projects/:id — single project with tasks
router.get('/:id', (req, res) => {
  const db = getDb();
  const project = db.prepare(`
    SELECT p.*, tm.name as owner_name
    FROM projects p
    LEFT JOIN team_members tm ON p.owner_id = tm.id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const tasks = db.prepare(`
    SELECT t.*, tm.name as assignee_name
    FROM tasks t
    LEFT JOIN team_members tm ON t.assignee_id = tm.id
    WHERE t.project_id = ?
    ORDER BY t.due_date ASC
  `).all(req.params.id);

  res.json({ ...project, tasks });
});

// POST /api/projects — create project
// BUG: No validation — accepts empty name
router.post('/', (req, res) => {
  const db = getDb();
  const { name, description, status, owner_id } = req.body;

  const result = db.prepare(`
    INSERT INTO projects (name, description, status, owner_id)
    VALUES (?, ?, ?, ?)
  `).run(name || '', description || '', status || 'active', owner_id || req.user.id);

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(project);
});

// PUT /api/projects/:id — update project
router.put('/:id', (req, res) => {
  const db = getDb();
  const { name, description, status } = req.body;

  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }

  db.prepare(`
    UPDATE projects SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(name, description, status, req.params.id);

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json(project);
});

// DELETE /api/projects/:id — delete project
router.delete('/:id', (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }

  db.prepare('DELETE FROM tasks WHERE project_id = ?').run(req.params.id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ message: 'Project deleted' });
});

export default router;
