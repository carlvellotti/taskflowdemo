import { useState } from 'react';
import MemberWorkloadCard from './MemberWorkloadCard';
import TaskDetail from './TaskDetail';
import { useApi } from '../../hooks/useApi';

const panelStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  overflow: 'hidden',
  minHeight: '400px',
};

const panelEmptyStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '400px',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
};

export default function VariantB({ members, allMembers, onReassign }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedMember = members?.find((m) => m.id === selectedId);
  const { data: tasks } = useApi(`/team/${selectedId}/tasks`, { skip: !selectedId });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--space-4)', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {members?.map((member) => (
          <MemberWorkloadCard
            key={member.id}
            member={member}
            selected={selectedId === member.id}
            onClick={() => setSelectedId(selectedId === member.id ? null : member.id)}
          />
        ))}
      </div>

      <div style={panelStyle}>
        {selectedMember ? (
          <TaskDetail
            member={selectedMember}
            tasks={tasks}
            allMembers={allMembers}
            onReassign={onReassign}
          />
        ) : (
          <div style={panelEmptyStyle}>
            Select a team member to view their workload
          </div>
        )}
      </div>
    </div>
  );
}
