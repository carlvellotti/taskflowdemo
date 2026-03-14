import Badge from '../common/Badge';
import Button from '../common/Button';
import WorkloadBar from './WorkloadBar';

const cardStyle = (isOverloaded) => ({
  background: 'var(--color-surface)',
  border: `1px solid ${isOverloaded ? 'var(--color-error)' : 'var(--color-border)'}`,
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
  ...(isOverloaded ? { background: 'var(--color-error-light)' } : {}),
});

const avatarStyle = (color) => ({
  width: '40px',
  height: '40px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-base)',
  flexShrink: 0,
});

const statStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
};

const statValueStyle = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
  lineHeight: 1,
};

const statLabelStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
};

export default function MemberCard({ member, capacity, showWorkload, onTriage }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!showWorkload) {
    return (
      <div style={cardStyle(false)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={avatarStyle(member.avatar_color)}>{initials}</div>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{member.role}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{member.email}</div>
          </div>
        </div>
      </div>
    );
  }

  const hours = member.total_estimated_hours || 0;
  const isOverloaded = capacity > 0 && hours > capacity;
  const urgentHigh = (member.urgent_count || 0) + (member.high_count || 0);

  return (
    <div style={cardStyle(isOverloaded)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={avatarStyle(member.avatar_color)}>{initials}</div>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{member.role}</div>
          </div>
        </div>
        {isOverloaded && (
          <Badge value="urgent" style={{ fontSize: '10px', padding: '1px 8px' }} />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', padding: 'var(--space-2) 0' }}>
        <div style={statStyle}>
          <span style={statValueStyle}>{member.active_task_count || 0}</span>
          <span style={statLabelStyle}>Tasks</span>
        </div>
        <div style={statStyle}>
          <span style={{ ...statValueStyle, color: urgentHigh > 0 ? 'var(--color-priority-high)' : 'var(--color-text)' }}>
            {urgentHigh}
          </span>
          <span style={statLabelStyle}>Urgent/High</span>
        </div>
        <div style={statStyle}>
          <span style={{
            ...statValueStyle,
            color: (member.overdue_count || 0) > 0 ? 'var(--color-error)' : 'var(--color-text)',
          }}>
            {member.overdue_count || 0}
          </span>
          <span style={statLabelStyle}>Overdue</span>
        </div>
      </div>

      <WorkloadBar hours={hours} capacity={capacity} />

      {member.unestimated_count > 0 && (
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)' }}>
          {member.unestimated_count} task{member.unestimated_count > 1 ? 's' : ''} without estimates
        </div>
      )}

      {onTriage && (
        <Button
          variant={isOverloaded ? 'primary' : 'secondary'}
          size="small"
          onClick={() => onTriage(member)}
        >
          Triage Tasks
        </Button>
      )}
    </div>
  );
}
