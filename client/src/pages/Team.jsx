import { useState } from 'react';
import { useTeam } from '../hooks/useTeam';
import { useWorkload } from '../hooks/useWorkload';
import { useApi } from '../hooks/useApi';
import MemberList from '../components/team/MemberList';
import TriageModal from '../components/team/TriageModal';
import WorkloadExpandableRows from '../components/team/WorkloadExpandableRows';
import WorkloadSlidePanel from '../components/team/WorkloadSlidePanel';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const DEFAULT_CAPACITY = 40;

const summaryCardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-1)',
};

const variantTabStyle = (isActive) => ({
  padding: 'var(--space-1) var(--space-3)',
  fontSize: 'var(--font-size-xs)',
  borderRadius: 'var(--border-radius-full)',
  border: 'none',
  cursor: 'pointer',
  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
  background: isActive ? 'var(--color-primary)' : 'transparent',
  color: isActive ? '#fff' : 'var(--color-text-secondary)',
  transition: 'all 0.15s ease',
});

export default function Team() {
  const [view, setView] = useState('directory');
  const [variant, setVariant] = useState('A');
  const { data: members, loading: membersLoading } = useTeam();
  const { data: workloadData, loading: workloadLoading, refetch: refetchWorkload } = useWorkload();
  const { data: settings } = useApi('/settings');
  const [triageMember, setTriageMember] = useState(null);

  const loading = view === 'directory' ? membersLoading : workloadLoading;
  if (loading) return <Spinner />;

  const capacity = settings?.workload_threshold_hours
    ? Number(settings.workload_threshold_hours)
    : DEFAULT_CAPACITY;

  const overloadedCount = workloadData?.filter((m) => m.total_estimated_hours > capacity).length || 0;
  const totalActiveTasks = workloadData?.reduce((sum, m) => sum + (m.active_task_count || 0), 0) || 0;
  const totalOverdue = workloadData?.reduce((sum, m) => sum + (m.overdue_count || 0), 0) || 0;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>Team</h1>
          <p>{view === 'workload' ? 'Workload overview and triage' : 'Your product team members'}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant={view === 'directory' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('directory')}>
            Directory
          </Button>
          <Button variant={view === 'workload' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('workload')}>
            Workload
          </Button>
        </div>
      </div>

      {view === 'workload' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={summaryCardStyle}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                Active Tasks
              </span>
              <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
                {totalActiveTasks}
              </span>
            </div>
            <div style={summaryCardStyle}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                Overloaded Members
              </span>
              <span style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: overloadedCount > 0 ? 'var(--color-error)' : 'var(--color-success)',
              }}>
                {overloadedCount}
              </span>
            </div>
            <div style={summaryCardStyle}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                Overdue Tasks
              </span>
              <span style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: totalOverdue > 0 ? 'var(--color-error)' : 'var(--color-text)',
              }}>
                {totalOverdue}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)',
            padding: 'var(--space-1)',
            background: 'var(--color-surface-hover)',
            borderRadius: 'var(--border-radius-full)',
            width: 'fit-content',
          }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', paddingLeft: 'var(--space-2)' }}>
              View:
            </span>
            <button style={variantTabStyle(variant === 'A')} onClick={() => setVariant('A')}>
              Expandable Rows
            </button>
            <button style={variantTabStyle(variant === 'B')} onClick={() => setVariant('B')}>
              Slide Panel
            </button>
            <button style={variantTabStyle(variant === 'C')} onClick={() => setVariant('C')}>
              Modal
            </button>
          </div>
        </>
      )}

      {view === 'directory' && (
        <MemberList members={members} />
      )}

      {view === 'workload' && variant === 'A' && (
        <WorkloadExpandableRows
          members={workloadData}
          capacity={capacity}
          onReassigned={refetchWorkload}
        />
      )}

      {view === 'workload' && variant === 'B' && (
        <WorkloadSlidePanel
          members={workloadData}
          capacity={capacity}
          onReassigned={refetchWorkload}
        />
      )}

      {view === 'workload' && variant === 'C' && (
        <>
          <MemberList
            members={workloadData}
            capacity={capacity}
            showWorkload
            onTriage={setTriageMember}
          />
          <TriageModal
            isOpen={!!triageMember}
            onClose={() => setTriageMember(null)}
            member={triageMember}
            allMembers={workloadData}
            onReassigned={refetchWorkload}
          />
        </>
      )}
    </div>
  );
}
