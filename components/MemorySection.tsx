'use client';

import type { Stats } from '@/lib/types';

interface MemorySectionProps {
  stats: Stats;
}

interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
}

function Gauge({ value, max, label, unit, color }: GaugeProps) {
  const pct = Math.min(value / max, 1);
  const R = 50;
  const cx = 60;
  const cy = 65;
  const startAngle = -Math.PI;
  const endAngle = 0;
  const totalArc = endAngle - startAngle;
  const fillAngle = startAngle + totalArc * pct;

  const toXY = (angle: number, r: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });

  const bgStart = toXY(startAngle, R);
  const bgEnd = toXY(endAngle, R);
  const fillEnd = toXY(fillAngle, R);

  const fillLargeArc = fillAngle - startAngle > Math.PI ? 1 : 0;
  const fillPath =
    pct > 0
      ? `M ${bgStart.x.toFixed(2)} ${bgStart.y.toFixed(2)} A ${R} ${R} 0 ${fillLargeArc} 1 ${fillEnd.x.toFixed(2)} ${fillEnd.y.toFixed(2)}`
      : '';

  return (
    <div className="gauge-wrap">
      <svg className="gauge-svg" viewBox="0 0 120 75">
        <path
          d={`M ${bgStart.x.toFixed(2)} ${bgStart.y.toFixed(2)} A ${R} ${R} 0 1 1 ${bgEnd.x.toFixed(2)} ${bgEnd.y.toFixed(2)}`}
          fill="none"
          stroke="#2a2d3e"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {pct > 0 && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
          />
        )}
        <text x={cx} y={cy + 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#e2e8f0">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
      <div className="gauge-value" style={{ color }}>
        {value} {unit}
      </div>
    </div>
  );
}

export default function MemorySection({ stats }: MemorySectionProps) {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><span>💾</span> Memory Usage</div>
        </div>
        <Gauge
          value={stats.usedMemoryMb}
          max={stats.totalMemoryMb}
          label="Used / Total"
          unit="MB"
          color={stats.memoryPct > 80 ? '#ef4444' : stats.memoryPct > 60 ? '#f59e0b' : '#22c55e'}
        />
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><span>🎯</span> Cache Hit Rate</div>
        </div>
        <Gauge
          value={stats.hitRate}
          max={100}
          label="Hit Rate"
          unit="%"
          color={stats.hitRate > 85 ? '#22c55e' : stats.hitRate > 70 ? '#f59e0b' : '#ef4444'}
        />
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title"><span>🌐</span> Network I/O</div>
        </div>
        <Gauge
          value={stats.networkInKbs}
          max={1000}
          label="Network In"
          unit="KB/s"
          color="#3b82f6"
        />
      </div>
    </>
  );
}
