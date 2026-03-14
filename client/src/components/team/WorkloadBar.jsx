const barBgStyle = {
  height: '8px',
  background: 'var(--color-border-light)',
  borderRadius: '4px',
  overflow: 'hidden',
};

function getBarColor(percent) {
  if (percent >= 100) return 'var(--color-error)';
  if (percent >= 80) return 'var(--color-warning)';
  return 'var(--color-primary)';
}

export default function WorkloadBar({ hours, capacity }) {
  const percent = capacity > 0 ? Math.min(Math.round((hours / capacity) * 100), 100) : 0;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {hours}h / {capacity}h
        </span>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {percent}%
        </span>
      </div>
      <div style={barBgStyle}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          background: getBarColor(percent),
          borderRadius: '4px',
          transition: 'width var(--transition-base)',
        }} />
      </div>
    </div>
  );
}
