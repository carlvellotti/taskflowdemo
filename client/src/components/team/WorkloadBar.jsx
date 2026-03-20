const barContainerStyle = {
  width: '100%',
  height: '8px',
  background: 'var(--color-border-light)',
  borderRadius: 'var(--border-radius-full)',
  overflow: 'hidden',
};

function getBarColor(utilization) {
  if (utilization > 100) return 'var(--color-error)';
  if (utilization >= 80) return 'var(--color-warning)';
  return 'var(--color-success)';
}

export default function WorkloadBar({ utilization, size = 'default' }) {
  const height = size === 'small' ? '6px' : '8px';
  const fillWidth = Math.min(utilization, 100);

  return (
    <div style={{ ...barContainerStyle, height }}>
      <div
        style={{
          width: `${fillWidth}%`,
          height: '100%',
          background: getBarColor(utilization),
          borderRadius: 'var(--border-radius-full)',
          transition: 'var(--transition-base)',
        }}
      />
    </div>
  );
}
