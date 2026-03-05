import MemberCard from './MemberCard';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 'var(--space-4)',
};

export default function MemberList({ members }) {
  if (!members?.length) {
    return (
      <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
        No team members found
      </p>
    );
  }

  return (
    <div style={gridStyle}>
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
