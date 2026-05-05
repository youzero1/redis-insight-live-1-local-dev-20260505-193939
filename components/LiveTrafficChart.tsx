'use client';

import type { ChartPoint } from '@/lib/types';

interface LiveTrafficChartProps {
  data: ChartPoint[];
}

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
  return d;
}

function buildArea(points: { x: number; y: number }[], height: number): string {
  if (points.length === 0) return '';
  const path = buildPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${path} L${last.x.toFixed(1)},${height} L${first.x.toFixed(1)},${height} Z`;
}

export default function LiveTrafficChart({ data }: LiveTrafficChartProps) {
  const W = 600;
  const H = 180;
  const PAD = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxReads = Math.max(...data.map(d => d.reads), 1);
  const maxWrites = Math.max(...data.map(d => d.writes), 1);
  const maxVal = Math.max(maxReads, maxWrites) * 1.1;

  const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  const readPts = data.map((d, i) => ({ x: xScale(i), y: yScale(d.reads) }));
  const writePts = data.map((d, i) => ({ x: xScale(i), y: yScale(d.writes) }));
  const errorPts = data.map((d, i) => ({ x: xScale(i), y: yScale(d.errors * 20) }));

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    v: Math.round(maxVal * f),
    y: yScale(maxVal * f),
  }));

  const xTicks = [0, 6, 12, 18, 24, 29].map(i => ({
    i,
    x: xScale(i),
    label: `-${(29 - i) * 1.2}s`,
  }));

  const areaBottom = PAD.top + chartH;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span>📈</span> Live Traffic
          <span className="card-badge live">● LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: '#3b82f6' }}>■ Reads</span>
          <span style={{ color: '#22c55e' }}>■ Writes</span>
          <span style={{ color: '#ef4444' }}>■ Errors</span>
        </div>
      </div>
      <div className="card-body">
        <div className="chart-container">
          <svg
            className="chart-svg"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="writeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y}
                  stroke="#2a2d3e" strokeWidth="1"
                />
                <text x={PAD.left - 6} y={t.y + 4} textAnchor="end"
                  fontSize="10" fill="#64748b">
                  {t.v > 999 ? `${(t.v / 1000).toFixed(0)}k` : t.v}
                </text>
              </g>
            ))}

            {xTicks.map((t, i) => (
              <text key={i} x={t.x} y={H - 6} textAnchor="middle"
                fontSize="9" fill="#64748b">
                {t.label}
              </text>
            ))}

            <path d={buildArea(readPts, areaBottom)} fill="url(#readGrad)" />
            <path d={buildArea(writePts, areaBottom)} fill="url(#writeGrad)" />

            <path d={buildPath(readPts)} fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d={buildPath(writePts)} fill="none" stroke="#22c55e" strokeWidth="2" />
            <path d={buildPath(errorPts)} fill="none" stroke="#ef4444" strokeWidth="1.5"
              strokeDasharray="4,3" />

            {readPts.length > 0 && (
              <circle
                cx={readPts[readPts.length - 1].x}
                cy={readPts[readPts.length - 1].y}
                r="4" fill="#3b82f6" stroke="#1e2130" strokeWidth="2"
              />
            )}
            {writePts.length > 0 && (
              <circle
                cx={writePts[writePts.length - 1].x}
                cy={writePts[writePts.length - 1].y}
                r="4" fill="#22c55e" stroke="#1e2130" strokeWidth="2"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
