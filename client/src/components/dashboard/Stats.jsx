const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-6)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
  boxShadow: 'var(--shadow-sm)',
};

const iconCircleBase = {
  width: '48px',
  height: '48px',
  borderRadius: 'var(--border-radius-full)',
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
  tasks: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  check: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  clock: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  folder: (color) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  ),
};

export default function Stats({ tasks, projects }) {
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
  const inProgress = tasks?.filter((t) => t.status === 'in-progress').length || 0;
  const activeProjects = projects?.filter((p) => p.status === 'active').length || 0;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: 'tasks', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', border: 'var(--color-primary)' },
    // BUG: Typo — "Completd" instead of "Completed"
    { label: 'Completd Tasks', value: completedTasks, icon: 'check', bg: 'var(--color-success-light)', color: 'var(--color-success)', border: 'var(--color-success)' },
    { label: 'In Progress', value: inProgress, icon: 'clock', bg: 'var(--color-info-light)', color: 'var(--color-info)', border: 'var(--color-info)' },
    { label: 'Active Projects', value: activeProjects, icon: 'folder', bg: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', border: 'var(--color-accent-hover)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{ ...statCardStyle, borderTop: `3px solid ${stat.border}` }}>
          <div style={{ ...iconCircleBase, background: stat.bg }}>
            {icons[stat.icon](stat.color)}
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
