import { useState } from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { api } from '../../utils/api-client';
import { formatDate } from '../../utils/format-date';

const taskRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 80px 80px 100px',
  gap: 'var(--space-2)',
  alignItems: 'center',
  padding: 'var(--space-3) var(--space-4)',
  borderBottom: '1px solid var(--color-border-light)',
  fontSize: 'var(--font-size-sm)',
};

const headerStyle = {
  ...taskRowStyle,
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '2px solid var(--color-border)',
  padding: 'var(--space-2) var(--space-4)',
};

export default function TaskDetail({ member, tasks, allMembers, onReassign }) {
  const [reassigning, setReassigning] = useState(null);
  const [targetMemberId, setTargetMemberId] = useState('');
  const [justification, setJustification] = useState('');
  const [confirmOverload, setConfirmOverload] = useState(false);

  if (!member) return null;

  const sortedTasks = [...(tasks || [])].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const pDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    if (pDiff !== 0) return pDiff;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    return 0;
  });

  const otherMembers = allMembers?.filter((m) => m.id !== member.id) || [];

  const handleReassign = async (taskId) => {
    if (!targetMemberId || !justification.trim()) return;

    const target = allMembers.find((m) => m.id === Number(targetMemberId));
    if (target && target.utilization_pct >= 100 && !confirmOverload) {
      setConfirmOverload(true);
      return;
    }

    await api.put(`/tasks/${taskId}`, {
      assignee_id: Number(targetMemberId),
      description: tasks.find((t) => t.id === taskId)?.description
        ? `${tasks.find((t) => t.id === taskId).description}\n\n[Reassigned] ${justification}`
        : `[Reassigned] ${justification}`,
    });

    setReassigning(null);
    setTargetMemberId('');
    setJustification('');
    setConfirmOverload(false);

    if (onReassign) onReassign();
  };

  return (
    <div>
      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--border-radius-full)',
            background: member.avatar_color || 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)',
          }}>
            {member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{member.role}</div>
          </div>
          <Badge value={member.status} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {member.active_task_count} active tasks · {member.total_estimated_hours}h / {member.capacity_hours}h · {member.utilization_pct}% utilized
        </div>
        {member.high_priority_count > 0 && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: 'var(--space-1)' }}>
            {member.high_priority_count} urgent/high priority · {member.overdue_count} overdue
          </div>
        )}
      </div>

      <div style={headerStyle}>
        <span>Task</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due</span>
      </div>

      {sortedTasks.filter((t) => t.status !== 'done').map((task) => (
        <div key={task.id}>
          <div style={taskRowStyle}>
            <div>
              <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{task.title}</div>
              {task.project_name && (
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{task.project_name}</div>
              )}
            </div>
            <Badge value={task.status} />
            <Badge value={task.priority} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {task.due_date ? formatDate(task.due_date) : '—'}
              </span>
              {reassigning !== task.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); setReassigning(task.id); setConfirmOverload(false); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)',
                  }}
                  title="Reassign"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3h5v5" /><path d="M4 20L21 3" />
                    <path d="M21 16v5h-5" /><path d="M15 15l6 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {reassigning === task.id && (
            <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border-light)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: 'var(--font-size-xs)' }}>Reassign to</label>
                  <select
                    value={targetMemberId}
                    onChange={(e) => { setTargetMemberId(e.target.value); setConfirmOverload(false); }}
                    style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-1) var(--space-2)' }}
                  >
                    <option value="">Select member</option>
                    {otherMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.utilization_pct}%)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                  <label style={{ fontSize: 'var(--font-size-xs)' }}>Justification</label>
                  <input
                    type="text"
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Why are you reassigning this task?"
                    style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-1) var(--space-2)' }}
                  />
                </div>
              </div>
              {confirmOverload && (
                <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-error-light)', borderRadius: 'var(--border-radius-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--color-error)' }}>
                  This person is already at {allMembers.find((m) => m.id === Number(targetMemberId))?.utilization_pct}% capacity. Proceed?
                </div>
              )}
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)', justifyContent: 'flex-end' }}>
                <Button variant="ghost" size="small" onClick={() => { setReassigning(null); setConfirmOverload(false); }}>Cancel</Button>
                <Button size="small" onClick={() => handleReassign(task.id)} disabled={!targetMemberId || !justification.trim()}>
                  {confirmOverload ? 'Reassign Anyway' : 'Reassign'}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {sortedTasks.filter((t) => t.status !== 'done').length === 0 && (
        <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
          No active tasks assigned
        </p>
      )}
    </div>
  );
}
