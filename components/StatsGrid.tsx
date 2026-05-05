'use client';

import type { Stats } from '@/lib/types';

interface StatsGridProps {
  stats: Stats;
}

function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      label: 'Ops / Sec',
      value: fmt(stats.opsPerSec),
      icon: '⚡',
      cls: 'blue',
      sub: `↑ ${fmt(stats.totalCommands)} total cmds`,
      dir: 'up',
    },
    {
      label: 'Connected Clients',
      value: stats.connectedClients.toString(),
      icon: '👥',
      cls: 'green',
      sub: `↑ ${stats.connectedClients} active`,
      dir: 'up',
    },
    {
      label: 'Hit Rate',
      value: stats.hitRate + '%',
      icon: '🎯',
      cls: stats.hitRate > 85 ? 'green' : 'yellow',
      sub: `Miss: ${stats.missRate}%`,
      dir: stats.hitRate > 85 ? 'up' : 'down',
    },
    {
      label: 'Memory Used',
      value: stats.usedMemoryMb + ' MB',
      icon: '💾',
      cls: stats.memoryPct > 80 ? 'red' : 'cyan',
      sub: `${stats.memoryPct}% of ${stats.totalMemoryMb} MB`,
      dir: stats.memoryPct > 80 ? 'down' : 'up',
    },
    {
      label: 'Network In',
      value: stats.networkInKbs + ' KB/s',
      icon: '⬇',
      cls: 'blue',
      sub: `Out: ${stats.networkOutKbs} KB/s`,
      dir: 'up',
    },
    {
      label: 'Expired Keys',
      value: fmt(stats.expiredKeys),
      icon: '⏰',
      cls: 'yellow',
      sub: `Evicted: ${stats.evictedKeys}`,
      dir: 'down',
    },
    {
      label: 'Replication Lag',
      value: stats.replicationLag + ' ms',
      icon: '🔁',
      cls: stats.replicationLag > 3 ? 'red' : 'green',
      sub: `Uptime: ${stats.uptimeHours}h`,
      dir: stats.replicationLag > 3 ? 'down' : 'up',
    },
    {
      label: 'Keyspace Hits',
      value: fmt(stats.keyspaceHits),
      icon: '🎯',
      cls: 'green',
      sub: `Misses: ${fmt(stats.keyspaceMisses)}`,
      dir: 'up',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div key={i} className="stat-card">
          <div className="stat-header">
            <span className="stat-label">{card.label}</span>
            <span className="stat-icon">{card.icon}</span>
          </div>
          <div className={`stat-value ${card.cls}`}>{card.value}</div>
          <div className={`stat-change ${card.dir}`}>
            {card.dir === 'up' ? '▲' : '▼'} {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
