import { useState } from 'react';
import MemberWorkloadCard from './MemberWorkloadCard';
import TaskDetail from './TaskDetail';
import Modal from '../common/Modal';
import { useApi } from '../../hooks/useApi';

export default function VariantC({ members, allMembers, onReassign }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedMember = members?.find((m) => m.id === selectedId);
  const { data: tasks } = useApi(`/team/${selectedId}/tasks`, { skip: !selectedId });

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-3)',
      }}>
        {members?.map((member) => (
          <MemberWorkloadCard
            key={member.id}
            member={member}
            selected={false}
            onClick={() => setSelectedId(member.id)}
          />
        ))}
      </div>

      <Modal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        title={selectedMember ? `${selectedMember.name} — Workload` : ''}
      >
        {selectedMember && (
          <TaskDetail
            member={selectedMember}
            tasks={tasks}
            allMembers={allMembers}
            onReassign={() => { onReassign(); setSelectedId(null); }}
          />
        )}
      </Modal>
    </div>
  );
}
