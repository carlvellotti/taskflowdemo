const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--space-4)',
};

const iconContainerStyle = {
  width: '44px',
  height: '44px',
  borderRadius: 'var(--border-radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  fontWeight: 'var(--font-weight-medium)',
};

const valueStyle = {
  fontSize: 'var(--font-size-2xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

const icons = {
  hours: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  overloaded: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  utilization: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  capacity: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

export default function WorkloadSummary({ summary }) {
  if (!summary) return null;

  const stats = [
    { label: 'Total Team Hours', value: `${summary.total_team_hours}h`, icon: icons.hours, color: 'var(--color-info)', bg: 'var(--color-info-light)' },
    { label: 'Avg Utilization', value: `${summary.avg_utilization_pct}%`, icon: icons.utilization, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
    { label: 'Overloaded', value: summary.overloaded_count, icon: icons.overloaded, color: summary.overloaded_count > 0 ? 'var(--color-error)' : 'var(--color-success)', bg: summary.overloaded_count > 0 ? 'var(--color-error-light)' : 'var(--color-success-light)' },
    { label: 'Available Capacity', value: `${summary.available_capacity_hours}h`, icon: icons.capacity, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{ ...statCardStyle, borderLeft: `3px solid ${stat.color}` }}>
          <div style={{ ...iconContainerStyle, background: stat.bg }}>
            {stat.icon(stat.color)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <span style={labelStyle}>{stat.label}</span>
            <span style={valueStyle}>{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
