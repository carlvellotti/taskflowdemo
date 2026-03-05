import Badge from '../common/Badge';
import { formatRelativeDate, isOverdue } from '../../utils/format-date';

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'in-review', label: 'In Review' },
  { key: 'done', label: 'Done' },
];

const boardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 'var(--space-4)',
};

const columnStyle = {
  background: 'var(--color-bg)',
  borderRadius: 'var(--border-radius-md)',
  padding: 'var(--space-3)',
  minHeight: '300px',
};

const columnHeaderStyle = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-3)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const taskCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-sm)',
  padding: 'var(--space-3)',
  marginBottom: 'var(--space-2)',
  fontSize: 'var(--font-size-sm)',
};

export default function TaskBoard({ tasks }) {
  const grouped = columns.map((col) => ({
    ...col,
    tasks: tasks?.filter((t) => t.status === col.key) || [],
  }));

  return (
    <div style={boardStyle}>
      {grouped.map((col) => (
        <div key={col.key} style={columnStyle}>
          <div style={columnHeaderStyle}>
            <span>{col.label}</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              {col.tasks.length}
            </span>
          </div>
          {col.tasks.map((task) => {
            const overdue = task.status !== 'done' && isOverdue(task.due_date);
            return (
              <div key={task.id} style={taskCardStyle}>
                <div style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-1)' }}>
                  {task.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Badge value={task.priority} />
                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    color: overdue ? 'var(--color-error)' : 'var(--color-text-muted)',
                  }}>
                    {formatRelativeDate(task.due_date)}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                  {task.assignee_name}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
