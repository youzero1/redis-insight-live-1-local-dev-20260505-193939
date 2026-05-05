'use client';

interface HeaderProps {
  isLive: boolean;
  onToggleLive: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function Header({ isLive, onToggleLive, onRefresh, refreshing }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">R</div>
          <span className="logo-text">RedisInsight</span>
          <span className="logo-badge">LIVE</span>
        </div>
      </div>

      <div className="header-center">
        <div className="connection-badge">
          <span className="connection-dot" />
          redis://localhost:6379
        </div>
      </div>

      <div className="header-right">
        <button className="btn" onClick={onRefresh} title="Refresh">
          <span className={refreshing ? 'spinning' : ''}>↻</span>
          Refresh
        </button>
        <button
          className={`btn ${isLive ? 'btn-danger' : 'btn-success'}`}
          onClick={onToggleLive}
        >
          {isLive ? (
            <><span className="live-dot" /> Pause</>
          ) : (
            <><span>▶</span> Resume</>
          )}
        </button>
        <button className="btn btn-primary">
          <span>⚙</span> Settings
        </button>
      </div>
    </header>
  );
}
