'use client';

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

const NAV_ITEMS = [
  { id: 'overview', icon: '◼', label: 'Overview' },
  { id: 'live-traffic', icon: '📡', label: 'Live Traffic', badge: 'LIVE' },
  { id: 'keys', icon: '🔑', label: 'Keys Explorer' },
  { id: 'commands', icon: '⌨', label: 'Commands' },
  { id: 'slowlog', icon: '⏱', label: 'Slow Log' },
  { id: 'memory', icon: '💾', label: 'Memory' },
  { id: 'clients', icon: '👥', label: 'Clients' },
  { id: 'replication', icon: '🔁', label: 'Replication' },
];

const TOOL_ITEMS = [
  { id: 'cli', icon: '>', label: 'CLI' },
  { id: 'profiler', icon: '📊', label: 'Profiler' },
  { id: 'alerts', icon: '🔔', label: 'Alerts' },
];

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Monitor</div>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item${activeNav === item.id ? ' active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <div className="sidebar-label">Tools</div>
        {TOOL_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item${activeNav === item.id ? ' active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
