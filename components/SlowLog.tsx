'use client';

import type { SlowLogEntry } from '@/lib/types';

interface SlowLogProps {
  entries: SlowLogEntry[];
}

function fmtDuration(us: number): string {
  if (us >= 1000000) return `${(us / 1000000).toFixed(2)}s`;
  if (us >= 1000) return `${(us / 1000).toFixed(1)}ms`;
  return `${us}µs`;
}

function durationColor(us: number): string {
  if (us < 20000) return 'var(--accent-yellow)';
  if (us < 100000) return 'var(--accent-orange)';
  return 'var(--accent-red)';
}

export default function SlowLog({ entries }: SlowLogProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span>⏱</span> Slow Log
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          threshold: 10ms
        </span>
      </div>
      <div className="slow-log-list">
        {entries.map(entry => (
          <div key={entry.id} className="slow-log-item">
            <div className="slow-log-top">
              <span className="slow-log-cmd">{entry.command}</span>
              <span
                className="slow-log-time"
                style={{ color: durationColor(entry.durationUs) }}
              >
                {fmtDuration(entry.durationUs)}
              </span>
            </div>
            <div className="slow-log-args">{entry.args}</div>
            <div className="slow-log-meta">
              <span>🕐 {entry.timestamp}</span>
              <span>📡 {entry.clientAddr}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
