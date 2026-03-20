import { useState } from 'react';
import Badge from '../common/Badge';
import WorkloadBar from './WorkloadBar';

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  cursor: 'pointer',
  transition: 'var(--transition-base)',
};

const cardHoverStyle = {
  borderColor: 'var(--color-primary)',
  boxShadow: 'var(--shadow-sm)',
};

const cardSelectedStyle = {
  borderColor: 'var(--color-primary)',
  background: 'var(--color-primary-light)',
};

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
  fontSize: 'var(--font-size-sm)',
  flexShrink: 0,
});

export default function MemberWorkloadCard({ member, selected, onClick }) {
  const [hovered, setHovered] = useState(false);

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const hoursLabel = member.has_unestimated
    ? `${member.active_task_count} tasks (${member.unestimated_task_count} unestimated)`
    : `${member.total_estimated_hours}h / ${member.capacity_hours}h`;

  return (
    <div
      style={{
        ...cardStyle,
        ...(selected ? cardSelectedStyle : {}),
        ...(hovered && !selected ? cardHoverStyle : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={avatarStyle(member.avatar_color)}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>{member.name}</span>
            <Badge value={member.status} />
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{member.role}</div>
        </div>
      </div>
      <WorkloadBar utilization={member.utilization_pct} size="small" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        <span>{hoursLabel}</span>
        <span style={{ fontWeight: 'var(--font-weight-semibold)', color: member.utilization_pct > 100 ? 'var(--color-error)' : 'var(--color-text-secondary)' }}>
          {member.utilization_pct}%
        </span>
      </div>
      {member.has_unestimated && (
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Some tasks missing estimates
        </div>
      )}
    </div>
  );
}
