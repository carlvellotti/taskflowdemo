import { useState, useEffect } from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import WorkloadBar from './WorkloadBar';
import { api } from '../../utils/api-client';
import { formatRelativeDate, isOverdue } from '../../utils/format-date';

const containerStyle = {
  display: 'flex',
  gap: 'var(--space-4)',
  alignItems: 'flex-start',
};

const gridStyle = (panelOpen) => ({
  display: 'grid',
  gridTemplateColumns: panelOpen
    ? 'repeat(auto-fill, minmax(240px, 1fr))'
    : 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 'var(--space-4)',
  flex: 1,
  transition: 'all 0.2s ease',
});

const cardStyle = (isOverloaded, isSelected) => ({
  background: isOverloaded
    ? 'var(--color-error-light)'
    : 'var(--color-surface)',
  border: `2px solid ${isSelected ? 'var(--color-primary)' : isOverloaded ? 'var(--color-error)' : 'var(--color-border)'}`,
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-4)',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  ...(isSelected ? { boxShadow: '0 0 0 3px var(--color-primary-light)' } : {}),
});

const avatarStyle = (color) => ({
  width: '36px',
  height: '36px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-sm)',
  flexShrink: 0,
});

const panelStyle = {
  width: '440px',
  flexShrink: 0,
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  overflow: 'hidden',
  maxHeight: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--shadow-md)',
  position: 'sticky',
  top: 'var(--space-4)',
};

const panelHeaderStyle = {
  padding: 'var(--space-5)',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
};

const panelBodyStyle = {
  padding: 'var(--space-4) var(--space-5)',
  overflowY: 'auto',
  flex: 1,
};

const taskRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 80px 80px 90px',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-3) 0',
  borderBottom: '1px solid var(--color-border-light)',
  fontSize: 'var(--font-size-sm)',
};

const taskHeaderRowStyle = {
  ...taskRowStyle,
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '2px solid var(--color-border)',
};

const statRowStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: 'var(--space-3) 0',
};

const statStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
};

function getStatusColor(hours, capacity, avgHours) {
  if (capacity > 0 && hours > capacity) return { color: 'var(--color-error)', label: 'Overloaded' };
  if (avgHours > 0 && hours >= avgHours * 1.5) return { color: 'var(--color-error)', label: 'Overloaded' };
  if (avgHours > 0 && hours >= avgHours) return { color: 'var(--color-warning)', label: 'At Capacity' };
  return { color: 'var(--color-success)', label: 'Available' };
}

function CompactCard({ member, capacity, avgHours, isSelected, onClick }) {
  const hours = member.total_estimated_hours || 0;
  const isOverloaded = (capacity > 0 && hours > capacity) || (avgHours > 0 && hours >= avgHours * 1.5);
  const initials = member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const status = getStatusColor(hours, capacity, avgHours);

  return (
    <div style={cardStyle(isOverloaded, isSelected)} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={avatarStyle(member.avatar_color)}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            {member.role}
          </div>
        </div>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: 'var(--border-radius-full)',
          background: status.color,
        }} />
      </div>

      <WorkloadBar hours={hours} capacity={capacity} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        <span>{member.active_task_count || 0} tasks</span>
        {member.unestimated_count > 0 && (
          <span style={{ color: 'var(--color-warning)' }}>{member.unestimated_count} unestimated</span>
        )}
      </div>
    </div>
  );
}

function SlidePanel({ member, capacity, avgHours, allMembers, onClose, onReassigned }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reassigning, setReassigning] = useState(null);

  const hours = member.total_estimated_hours || 0;
  const isOverloaded = (capacity > 0 && hours > capacity) || (avgHours > 0 && hours >= avgHours * 1.5);
  const urgentHigh = (member.urgent_count || 0) + (member.high_count || 0);
  const initials = member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const status = getStatusColor(hours, capacity, avgHours);

  useEffect(() => {
    setLoading(true);
    api.get(`/team/${member.id}/tasks`)
      .then((data) => setTasks(data.filter((t) => t.status !== 'done')))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [member.id]);

  const handleReassign = async (taskId, newAssigneeId) => {
    setReassigning(taskId);
    try {
      await api.put(`/tasks/${taskId}`, { assignee_id: newAssigneeId || null });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (onReassigned) onReassigned();
    } finally {
      setReassigning(null);
    }
  };

  const otherMembers = allMembers?.filter((m) => m.id !== member.id && !((capacity > 0 && (m.total_estimated_hours || 0) > capacity) || (avgHours > 0 && (m.total_estimated_hours || 0) >= avgHours * 1.5))) || [];

  return (
    <div style={panelStyle}>
      <div style={panelHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={avatarStyle(member.avatar_color)}>{initials}</div>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: 'var(--border-radius-full)',
                background: status.color,
              }} />
              <span style={{ fontSize: 'var(--font-size-xs)', color: status.color, fontWeight: 'var(--font-weight-medium)' }}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: 'var(--space-1)',
            lineHeight: 1,
          }}
        >
          &times;
        </button>
      </div>

      <div style={panelBodyStyle}>
        <div style={statRowStyle}>
          <div style={statStyle}>
            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
              {member.active_task_count || 0}
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Tasks</span>
          </div>
          <div style={statStyle}>
            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: urgentHigh > 0 ? 'var(--color-priority-high)' : 'var(--color-text)' }}>
              {urgentHigh}
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Urgent/High</span>
          </div>
          <div style={statStyle}>
            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: (member.overdue_count || 0) > 0 ? 'var(--color-error)' : 'var(--color-text)' }}>
              {member.overdue_count || 0}
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Overdue</span>
          </div>
        </div>

        <div style={{ margin: 'var(--space-3) 0' }}>
          <WorkloadBar hours={hours} capacity={capacity} />
        </div>

        {member.unestimated_count > 0 && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)', marginBottom: 'var(--space-3)' }}>
            {member.unestimated_count} task{member.unestimated_count > 1 ? 's' : ''} without estimates
          </div>
        )}

        <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
          Active Tasks
        </h4>

        {loading ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', padding: 'var(--space-3)' }}>Loading...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', padding: 'var(--space-3)' }}>No active tasks</p>
        ) : (
          <div>
            <div style={taskHeaderRowStyle}>
              <span>Task</span>
              <span>Priority</span>
              <span>Due</span>
              <span>Reassign</span>
            </div>
            {tasks.map((task) => {
              const overdue = task.status !== 'done' && isOverdue(task.due_date);
              return (
                <div key={task.id} style={taskRowStyle}>
                  <div>
                    <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{task.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{task.project_name}</div>
                  </div>
                  <Badge value={task.priority} />
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: overdue ? 'var(--color-error)' : 'var(--color-text-muted)',
                    fontWeight: overdue ? 'var(--font-weight-medium)' : 'normal',
                  }}>
                    {formatRelativeDate(task.due_date)}
                  </div>
                  <select
                    style={{
                      padding: '2px var(--space-1)',
                      fontSize: 'var(--font-size-xs)',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    value=""
                    disabled={reassigning === task.id}
                    onChange={(e) => {
                      if (e.target.value) handleReassign(task.id, Number(e.target.value));
                    }}
                  >
                    <option value="">Move to...</option>
                    {otherMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.total_estimated_hours}h)
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkloadSlidePanel({ members, capacity, onReassigned }) {
  const [selectedMember, setSelectedMember] = useState(null);

  const avgHours = members?.length > 0
    ? members.reduce((sum, m) => sum + (m.total_estimated_hours || 0), 0) / members.length
    : 0;

  if (!members?.length) {
    return (
      <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
        No team members found
      </p>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={gridStyle(!!selectedMember)}>
        {members.map((member) => (
          <CompactCard
            key={member.id}
            member={member}
            capacity={capacity}
            avgHours={avgHours}
            isSelected={selectedMember?.id === member.id}
            onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
          />
        ))}
      </div>

      {selectedMember && (
        <SlidePanel
          member={selectedMember}
          capacity={capacity}
          avgHours={avgHours}
          allMembers={members}
          onClose={() => setSelectedMember(null)}
          onReassigned={() => {
            onReassigned();
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
}
