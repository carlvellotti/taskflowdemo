import { useState } from 'react';
import { useWorkload } from '../hooks/useWorkload';
import WorkloadSummary from '../components/team/WorkloadSummary';
import VariantA from '../components/team/VariantA';
import VariantB from '../components/team/VariantB';
import VariantC from '../components/team/VariantC';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const variantLabels = {
  A: 'Expandable Rows',
  B: 'Slide-Out Panel',
  C: 'Modal Deep-Dive',
};

export default function Team() {
  const { data: workload, loading, refetch } = useWorkload();
  const [variant, setVariant] = useState('B');

  if (loading) return <Spinner />;

  const members = workload?.members || [];
  const summary = workload?.summary;

  const VariantComponent = { A: VariantA, B: VariantB, C: VariantC }[variant];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>Team Workload</h1>
          <p>Monitor capacity and redistribute work across your team</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginRight: 'var(--space-1)' }}>View:</span>
          {['A', 'B', 'C'].map((v) => (
            <Button
              key={v}
              variant={variant === v ? 'secondary' : 'ghost'}
              size="small"
              onClick={() => setVariant(v)}
            >
              {variantLabels[v]}
            </Button>
          ))}
        </div>
      </div>

      <WorkloadSummary summary={summary} />

      <VariantComponent
        members={members}
        allMembers={members}
        onReassign={refetch}
      />
    </div>
  );
}
