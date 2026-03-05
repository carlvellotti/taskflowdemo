import Badge from '../common/Badge';
import { formatRelativeDate, isOverdue } from '../../utils/format-date';

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 120px 100px 140px 100px',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-3) var(--space-4)',
  borderBottom: '1px solid var(--color-border-light)',
  fontSize: 'var(--font-size-sm)',
};

const titleStyle = {
  fontWeight: 'var(--font-weight-medium)',
};

export default function TaskRow({ task }) {
  const overdue = task.status !== 'done' && isOverdue(task.due_date);

  return (
    <div style={rowStyle}>
      <div>
        <div style={titleStyle}>{task.title}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {task.project_name}
        </div>
      </div>
      <div>{task.assignee_name}</div>
      <Badge value={task.status} />
      <Badge value={task.priority} />
      <div style={{
        fontSize: 'var(--font-size-xs)',
        color: overdue ? 'var(--color-error)' : 'var(--color-text-muted)',
        fontWeight: overdue ? 'var(--font-weight-medium)' : 'normal',
      }}>
        {formatRelativeDate(task.due_date)}
      </div>
    </div>
  );
}
