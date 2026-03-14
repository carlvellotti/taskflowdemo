import { useState, useEffect } from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import WorkloadBar from './WorkloadBar';
import { api } from '../../utils/api-client';
import { formatRelativeDate, isOverdue } from '../../utils/format-date';

const rowStyle = (isOverloaded, isExpanded) => ({
  background: isOverloaded
    ? 'var(--color-error-light)'
    : isExpanded
      ? 'var(--color-surface-hover)'
      : 'var(--color-surface)',
  border: `1px solid ${isOverloaded ? 'var(--color-error)' : 'var(--color-border)'}`,
  borderRadius: 'var(--border-radius-lg)',
  overflow: 'hidden',
  transition: 'box-shadow 0.15s ease',
});

const rowHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '44px 1fr 80px 80px 80px 140px 100px',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-4) var(--space-5)',
  cursor: 'pointer',
};

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

const metricStyle = {
  textAlign: 'center',
};

const metricValueStyle = {
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-bold)',
  lineHeight: 1,
};

const metricLabelStyle = {
  fontSize: '10px',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const expandedStyle = {
  borderTop: '1px solid var(--color-border-light)',
  padding: 'var(--space-4) var(--space-5)',
  background: 'var(--color-surface)',
};

const taskGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 90px 90px 90px 120px',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-2) 0',
  fontSize: 'var(--font-size-sm)',
};

const taskHeaderStyle = {
  ...taskGridStyle,
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '2px solid var(--color-border)',
  paddingBottom: 'var(--space-2)',
};

function getStatusColor(hours, capacity, avgHours) {
  if (capacity > 0 && hours > capacity) return { color: 'var(--color-error)', label: 'Overloaded' };
  if (avgHours > 0 && hours >= avgHours * 1.5) return { color: 'var(--color-error)', label: 'Overloaded' };
  if (avgHours > 0 && hours >= avgHours) return { color: 'var(--color-warning)', label: 'At Capacity' };
  return { color: 'var(--color-success)', label: 'Available' };
}

function ExpandableRow({ member, capacity, avgHours, allMembers, onReassigned }) {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [reassigning, setReassigning] = useState(null);

  const hours = member.total_estimated_hours || 0;
  const isOverloaded = (capacity > 0 && hours > capacity) || (avgHours > 0 && hours >= avgHours * 1.5);
  const urgentHigh = (member.urgent_count || 0) + (member.high_count || 0);
  const initials = member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const status = getStatusColor(hours, capacity, avgHours);

  useEffect(() => {
    if (expanded && tasks.length === 0) {
      setLoadingTasks(true);
      api.get(`/team/${member.id}/tasks`)
        .then((data) => setTasks(data.filter((t) => t.status !== 'done')))
        .catch(() => setTasks([]))
        .finally(() => setLoadingTasks(false));
    }
  }, [expanded, member.id]);

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
    <div style={rowStyle(isOverloaded, expanded)}>
      <div style={rowHeaderStyle} onClick={() => setExpanded(!expanded)}>
        <div style={avatarStyle(member.avatar_color)}>{initials}</div>
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-base)' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            {member.role}
          </div>
        </div>
        <div style={metricStyle}>
          <div style={metricValueStyle}>{member.active_task_count || 0}</div>
          <div style={metricLabelStyle}>Tasks</div>
        </div>
        <div style={metricStyle}>
          <div style={{ ...metricValueStyle, color: urgentHigh > 0 ? 'var(--color-priority-high)' : 'var(--color-text)' }}>
            {urgentHigh}
          </div>
          <div style={metricLabelStyle}>Urgent</div>
        </div>
        <div style={metricStyle}>
          <div style={{ ...metricValueStyle, color: (member.overdue_count || 0) > 0 ? 'var(--color-error)' : 'var(--color-text)' }}>
            {member.overdue_count || 0}
          </div>
          <div style={metricLabelStyle}>Overdue</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: 'var(--border-radius-full)',
            background: status.color,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: status.color, fontWeight: 'var(--font-weight-medium)' }}>
            {status.label}
          </span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
            {hours}h
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
            transition: 'transform 0.15s ease',
          }}>
            &#9660;
          </span>
        </div>
      </div>

      {expanded && (
        <div style={expandedStyle}>
          <WorkloadBar hours={hours} capacity={capacity} />

          {member.unestimated_count > 0 && (
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)', margin: 'var(--space-2) 0' }}>
              {member.unestimated_count} task{member.unestimated_count > 1 ? 's' : ''} without estimates
            </div>
          )}

          <div style={{ marginTop: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
              Active Tasks
            </h4>

            {loadingTasks ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', padding: 'var(--space-3)' }}>Loading...</p>
            ) : tasks.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', padding: 'var(--space-3)' }}>No active tasks</p>
            ) : (
              <div>
                <div style={taskHeaderStyle}>
                  <span>Task</span>
                  <span>Priority</span>
                  <span>Status</span>
                  <span>Due</span>
                  <span>Reassign</span>
                </div>
                {tasks.map((task) => {
                  const overdue = task.status !== 'done' && isOverdue(task.due_date);
                  return (
                    <div key={task.id} style={{ ...taskGridStyle, borderBottom: '1px solid var(--color-border-light)' }}>
                      <div>
                        <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{task.title}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{task.project_name}</div>
                      </div>
                      <Badge value={task.priority} />
                      <Badge value={task.status} />
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
      )}
    </div>
  );
}

export default function WorkloadExpandableRows({ members, capacity, onReassigned }) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {members.map((member) => (
        <ExpandableRow
          key={member.id}
          member={member}
          capacity={capacity}
          avgHours={avgHours}
          allMembers={members}
          onReassigned={onReassigned}
        />
      ))}
    </div>
  );
}
