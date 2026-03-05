const statCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-1)',
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

export default function Stats({ tasks, projects }) {
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
  const inProgress = tasks?.filter((t) => t.status === 'in-progress').length || 0;
  const activeProjects = projects?.filter((p) => p.status === 'active').length || 0;

  const stats = [
    { label: 'Total Tasks', value: totalTasks },
    // BUG: Typo — "Completd" instead of "Completed"
    { label: 'Completd Tasks', value: completedTasks },
    { label: 'In Progress', value: inProgress },
    { label: 'Active Projects', value: activeProjects },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={statCardStyle}>
          <span style={labelStyle}>{stat.label}</span>
          <span style={valueStyle}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
