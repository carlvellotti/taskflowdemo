const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
};

const avatarStyle = (color) => ({
  width: '48px',
  height: '48px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-lg)',
  flexShrink: 0,
});

export default function MemberCard({ member }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={cardStyle}>
      <div style={avatarStyle(member.avatar_color)}>{initials}</div>
      <div>
        <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{member.role}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{member.email}</div>
      </div>
    </div>
  );
}
