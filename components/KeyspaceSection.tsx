'use client';

const KEYSPACES = [
  { db: 'db0', keys: 48320, expires: 12400, avgTtl: '3600s' },
  { db: 'db1', keys: 8920, expires: 3100, avgTtl: '86400s' },
  { db: 'db2', keys: 1240, expires: 890, avgTtl: '300s' },
  { db: 'db3', keys: 320, expires: 0, avgTtl: 'N/A' },
];

export default function KeyspaceSection() {
  return (
    <div className="card" style={{ gridColumn: 'span 2' }}>
      <div className="card-header">
        <div className="card-title"><span>🗄</span> Keyspace</div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {KEYSPACES.reduce((s, k) => s + k.keys, 0).toLocaleString()} total keys
        </span>
      </div>
      <div className="keyspace-grid">
        {KEYSPACES.map(ks => (
          <div key={ks.db} className="keyspace-db">
            <div className="keyspace-db-name">{ks.db}</div>
            <div className="keyspace-stat">
              <span>Keys</span>
              <span>{ks.keys.toLocaleString()}</span>
            </div>
            <div className="keyspace-stat">
              <span>Expires</span>
              <span>{ks.expires.toLocaleString()}</span>
            </div>
            <div className="keyspace-stat">
              <span>Avg TTL</span>
              <span>{ks.avgTtl}</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 4, background: 'var(--bg-primary)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.round((ks.expires / (ks.keys || 1)) * 100)}%`,
                    background: 'var(--accent-blue)',
                    borderRadius: 2,
                  }}
                />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                {Math.round((ks.expires / (ks.keys || 1)) * 100)}% with TTL
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
