import Badge from '../common/Badge';
import { formatRelativeDate } from '../../utils/format-date';

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-3) 0',
  borderBottom: '1px solid var(--color-border-light)',
};

const titleStyle = {
  fontWeight: 'var(--font-weight-medium)',
  fontSize: 'var(--font-size-sm)',
};

const metaStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  marginTop: '2px',
};

export default function RecentActivity({ tasks }) {
  // Show tasks that are in-progress or recently completed, sorted by update
  const recent = tasks
    ?.filter((t) => t.status !== 'todo')
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 8) || [];

  if (recent.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No recent activity</p>;
  }

  return (
    <div>
      {recent.map((task) => (
        <div key={task.id} style={itemStyle}>
          <div>
            <div style={titleStyle}>{task.title}</div>
            <div style={metaStyle}>
              {task.assignee_name} &middot; {task.project_name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Badge value={task.status} />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', minWidth: '80px', textAlign: 'right' }}>
              {formatRelativeDate(task.due_date)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
