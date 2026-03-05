import { useApi } from '../hooks/useApi';
import Stats from '../components/dashboard/Stats';
import RecentActivity from '../components/dashboard/RecentActivity';
import Spinner from '../components/common/Spinner';

export default function Dashboard() {
  const { data: tasks, loading: tasksLoading } = useApi('/tasks');
  const { data: projects, loading: projectsLoading } = useApi('/projects');

  if (tasksLoading || projectsLoading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your team's work</p>
      </div>

      <Stats tasks={tasks} projects={projects} />

      <div style={{ marginTop: 'var(--space-8)' }}>
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Recent Activity</h3>
          <RecentActivity tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
