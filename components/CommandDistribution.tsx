'use client';

import type { CommandDistEntry } from '@/lib/types';

interface CommandDistributionProps {
  data: CommandDistEntry[];
}

export default function CommandDistribution({ data }: CommandDistributionProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count);
  const maxCount = sorted[0]?.count || 1;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span>📊</span> Command Distribution
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {sorted.length} types
        </span>
      </div>
      <div className="card-body">
        <div className="cmd-dist-list">
          {sorted.map(item => (
            <div key={item.cmd} className="cmd-dist-item">
              <span className="cmd-dist-name">{item.cmd}</span>
              <div className="cmd-dist-bar-wrap">
                <div
                  className="cmd-dist-bar"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    background: item.color,
                  }}
                />
              </div>
              <span className="cmd-dist-count">
                {item.count > 999
                  ? `${(item.count / 1000).toFixed(1)}k`
                  : item.count}
              </span>
              <span className="cmd-dist-pct">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
