'use client';

import type { TrafficEntry } from '@/lib/types';

interface TrafficTableProps {
  entries: TrafficEntry[];
}

function getCmdClass(cmd: string): string {
  const map: Record<string, string> = {
    GET: 'cmd-get',
    SET: 'cmd-set',
    DEL: 'cmd-del',
    HGET: 'cmd-hget',
    HSET: 'cmd-hset',
    LPUSH: 'cmd-lpush',
    RPUSH: 'cmd-rpush',
    ZADD: 'cmd-zadd',
  };
  return map[cmd] || 'cmd-default';
}

function latencyColor(us: number): string {
  if (us < 500) return '#22c55e';
  if (us < 2000) return '#f59e0b';
  return '#ef4444';
}

export default function TrafficTable({ entries }: TrafficTableProps) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Command</th>
            <th>Key</th>
            <th>Client</th>
            <th>DB</th>
            <th>Latency</th>
            <th>Bytes</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{entry.timestamp}</td>
              <td>
                <span className={`cmd-badge ${getCmdClass(entry.command)}`}>
                  {entry.command}
                </span>
              </td>
              <td style={{ fontFamily: 'monospace', fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.key}
              </td>
              <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                {entry.client}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className="tag tag-gray">db{entry.db}</span>
              </td>
              <td>
                <div className="latency-bar">
                  <div
                    className="latency-fill"
                    style={{
                      width: Math.min((entry.latencyUs / 8000) * 60, 60),
                      background: latencyColor(entry.latencyUs),
                    }}
                  />
                  <span className="latency-val" style={{ color: latencyColor(entry.latencyUs) }}>
                    {entry.latencyUs < 1000
                      ? `${entry.latencyUs}µs`
                      : `${(entry.latencyUs / 1000).toFixed(1)}ms`}
                  </span>
                </div>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                {entry.bytes} B
              </td>
              <td>
                <span
                  className={`status-dot ${entry.status === 'ok' ? 'status-success' : 'status-error'}`}
                />
                <span style={{ fontSize: 12, color: entry.status === 'ok' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {entry.status === 'ok' ? 'OK' : 'ERR'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
