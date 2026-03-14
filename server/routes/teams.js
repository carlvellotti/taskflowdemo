import { Router } from 'express';
import getDb from '../db/connection.js';

const router = Router();

// GET /api/team — all team members
router.get('/', (req, res) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM team_members ORDER BY id').all();
  res.json(members);
});

// GET /api/team/workload — all members with workload metrics
router.get('/workload', (req, res) => {
  const db = getDb();
  const members = db.prepare(`
    SELECT
      tm.*,
      COUNT(CASE WHEN t.status != 'done' THEN 1 END) as active_task_count,
      COALESCE(SUM(CASE WHEN t.status != 'done' THEN t.estimated_hours ELSE 0 END), 0) as total_estimated_hours,
      COUNT(CASE WHEN t.status != 'done' AND t.estimated_hours = 0 THEN 1 END) as unestimated_count,
      COUNT(CASE WHEN t.status != 'done' AND t.priority = 'urgent' THEN 1 END) as urgent_count,
      COUNT(CASE WHEN t.status != 'done' AND t.priority = 'high' THEN 1 END) as high_count,
      COUNT(CASE WHEN t.status != 'done' AND t.due_date < date('now') THEN 1 END) as overdue_count
    FROM team_members tm
    LEFT JOIN tasks t ON t.assignee_id = tm.id
    GROUP BY tm.id
    ORDER BY total_estimated_hours DESC
  `).all();
  res.json(members);
});

// GET /api/team/:id — single team member
router.get('/:id', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json(member);
});

// GET /api/team/:id/tasks — tasks assigned to a team member
router.get('/:id/tasks', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  const tasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assignee_id = ?
    ORDER BY t.due_date ASC
  `).all(req.params.id);
  res.json(tasks);
});

export default router;
