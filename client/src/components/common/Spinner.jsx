const spinnerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 'var(--space-8)',
};

const dotStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: 'var(--color-primary)',
  margin: '0 4px',
  animation: 'pulse 1.4s ease-in-out infinite',
};

export default function Spinner() {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div style={spinnerStyle}>
        <div style={{ ...dotStyle, animationDelay: '0s' }} />
        <div style={{ ...dotStyle, animationDelay: '0.2s' }} />
        <div style={{ ...dotStyle, animationDelay: '0.4s' }} />
      </div>
    </>
  );
}
