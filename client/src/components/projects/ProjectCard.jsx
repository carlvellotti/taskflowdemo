import Badge from '../common/Badge';

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
  transition: 'box-shadow var(--transition-fast)',
};

const titleStyle = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
};

const descStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  lineHeight: 1.5,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const progressBarBg = {
  height: '6px',
  background: 'var(--color-border-light)',
  borderRadius: '3px',
  overflow: 'hidden',
};

export default function ProjectCard({ project }) {
  const progress = project.task_count > 0
    ? Math.round((project.completed_count / project.task_count) * 100)
    : 0;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <span style={titleStyle}>{project.name}</span>
        <Badge value={project.status} />
      </div>
      <p style={descStyle}>{project.description}</p>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {project.completed_count}/{project.task_count} tasks
          </span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {progress}%
          </span>
        </div>
        <div style={progressBarBg}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: progress === 100 ? 'var(--color-success)' : 'var(--color-primary)',
            borderRadius: '3px',
            transition: 'width var(--transition-base)',
          }} />
        </div>
      </div>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        Owner: {project.owner_name}
      </div>
    </div>
  );
}
