import { useApi } from '../hooks/useApi';
import Spinner from '../components/common/Spinner';

const toggleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-4) 0',
  borderBottom: '1px solid var(--color-border-light)',
};

const toggleStyle = (active) => ({
  width: '44px',
  height: '24px',
  borderRadius: 'var(--border-radius-full)',
  background: active ? 'var(--color-primary)' : 'var(--color-border)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'background var(--transition-fast)',
  border: 'none',
});

const toggleKnobStyle = (active) => ({
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  background: '#fff',
  position: 'absolute',
  top: '3px',
  left: active ? '23px' : '3px',
  transition: 'left var(--transition-fast)',
  boxShadow: 'var(--shadow-sm)',
});

export default function Settings() {
  const { data: settings, loading } = useApi('/settings');

  if (loading) return <Spinner />;

  const settingsConfig = [
    { key: 'notifications_enabled', label: 'Enable Notifications', description: 'Receive notifications for task updates and assignments' },
    { key: 'theme', label: 'Dark Mode', description: 'Switch between light and dark themes', isTheme: true },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your TaskFlow preferences</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-2)' }}>General</h3>

        <div style={toggleRowStyle}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>App Name</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {settings?.app_name || 'TaskFlow'}
            </div>
          </div>
        </div>

        <div style={toggleRowStyle}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>Default View</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {settings?.default_view === 'board' ? 'Board View' : 'List View'}
            </div>
          </div>
        </div>

        {settingsConfig.map((setting) => {
          const active = setting.isTheme
            ? settings?.theme === 'dark'
            : settings?.[setting.key] === 'true';
          return (
            <div key={setting.key} style={toggleRowStyle}>
              <div>
                <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{setting.label}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {setting.description}
                </div>
              </div>
              <button style={toggleStyle(active)} aria-label={setting.label}>
                <div style={toggleKnobStyle(active)} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
