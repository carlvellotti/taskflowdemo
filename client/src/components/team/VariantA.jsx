import { useState } from 'react';
import MemberWorkloadCard from './MemberWorkloadCard';
import TaskDetail from './TaskDetail';
import { useApi } from '../../hooks/useApi';

export default function VariantA({ members, allMembers, onReassign }) {
  const [expandedId, setExpandedId] = useState(null);
  const selectedMember = members?.find((m) => m.id === expandedId);
  const { data: tasks } = useApi(`/team/${expandedId}/tasks`, { skip: !expandedId });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {members?.map((member) => (
        <div key={member.id}>
          <MemberWorkloadCard
            member={member}
            selected={expandedId === member.id}
            onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
          />
          {expandedId === member.id && (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              borderTop: 'none',
              borderRadius: '0 0 var(--border-radius-lg) var(--border-radius-lg)',
              overflow: 'hidden',
            }}>
              <TaskDetail
                member={selectedMember}
                tasks={tasks}
                allMembers={allMembers}
                onReassign={onReassign}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
