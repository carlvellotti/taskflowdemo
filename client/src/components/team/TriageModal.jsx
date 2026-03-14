import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { api } from '../../utils/api-client';
import { formatRelativeDate, isOverdue } from '../../utils/format-date';

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 100px 90px 90px 110px',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-3) 0',
  borderBottom: '1px solid var(--color-border-light)',
  fontSize: 'var(--font-size-sm)',
};

const headerRowStyle = {
  ...rowStyle,
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '2px solid var(--color-border)',
};

export default function TriageModal({ isOpen, onClose, member, allMembers, onReassigned }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reassigning, setReassigning] = useState(null);

  useEffect(() => {
    if (isOpen && member) {
      setLoading(true);
      api.get(`/team/${member.id}/tasks`)
        .then((data) => setTasks(data.filter((t) => t.status !== 'done')))
        .catch(() => setTasks([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, member]);

  const handleReassign = async (taskId, newAssigneeId) => {
    setReassigning(taskId);
    try {
      await api.put(`/tasks/${taskId}`, { assignee_id: newAssigneeId || null });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (onReassigned) onReassigned();
    } finally {
      setReassigning(null);
    }
  };

  if (!member) return null;

  const otherMembers = allMembers?.filter((m) => m.id !== member.id) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Triage: ${member.name}`}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <span>{tasks.length} active tasks</span>
          <span>{member.total_estimated_hours}h total</span>
          {member.overdue_count > 0 && (
            <span style={{ color: 'var(--color-error)' }}>{member.overdue_count} overdue</span>
          )}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-4)' }}>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-4)' }}>No active tasks</p>
      ) : (
        <div>
          <div style={headerRowStyle}>
            <span>Task</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Due</span>
            <span>Reassign</span>
          </div>
          {tasks.map((task) => {
            const overdue = task.status !== 'done' && isOverdue(task.due_date);
            return (
              <div key={task.id} style={rowStyle}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{task.title}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {task.project_name}
                  </div>
                </div>
                <Badge value={task.priority} />
                <Badge value={task.status} />
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: overdue ? 'var(--color-error)' : 'var(--color-text-muted)',
                  fontWeight: overdue ? 'var(--font-weight-medium)' : 'normal',
                }}>
                  {formatRelativeDate(task.due_date)}
                </div>
                <select
                  style={{
                    padding: '2px var(--space-1)',
                    fontSize: 'var(--font-size-xs)',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                  }}
                  value=""
                  disabled={reassigning === task.id}
                  onChange={(e) => {
                    if (e.target.value) handleReassign(task.id, Number(e.target.value));
                  }}
                >
                  <option value="">Move to...</option>
                  {otherMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.total_estimated_hours}h)
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
        <Button variant="secondary" onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
}
