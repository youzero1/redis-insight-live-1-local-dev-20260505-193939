'use client';

import type { EventEntry } from '@/lib/types';

interface EventTimelineProps {
  events: EventEntry[];
}

const iconMap: Record<EventEntry['type'], string> = {
  info: 'ℹ',
  warn: '⚠',
  error: '✖',
  success: '✔',
};

export default function EventTimeline({ events }: EventTimelineProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title"><span>📋</span> Event Log</div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Recent events
        </span>
      </div>
      <div className="timeline-wrap">
        {events.map(ev => (
          <div key={ev.id} className="timeline-item">
            <div className={`timeline-icon ${ev.type}`}>
              {iconMap[ev.type]}
            </div>
            <div className="timeline-content">
              <div className="timeline-msg">{ev.message}</div>
              <div className="timeline-time">{ev.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
