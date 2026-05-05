'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatsGrid from '../components/StatsGrid';
import LiveTrafficChart from '../components/LiveTrafficChart';
import CommandDistribution from '../components/CommandDistribution';
import TrafficTable from '../components/TrafficTable';
import SlowLog from '../components/SlowLog';
import MemorySection from '../components/MemorySection';
import KeyspaceSection from '../components/KeyspaceSection';
import EventTimeline from '../components/EventTimeline';
import { generateStats, generateTrafficEntry, generateChartPoint, generateSlowLog, generateEvent } from '../lib/dataGenerator';
import type { Stats, TrafficEntry, ChartPoint, SlowLogEntry, EventEntry, CommandDistEntry } from '../lib/types';

const COMMAND_COLORS: Record<string, string> = {
  GET: '#3b82f6',
  SET: '#22c55e',
  DEL: '#ef4444',
  HGET: '#a855f7',
  HSET: '#f59e0b',
  LPUSH: '#06b6d4',
  RPUSH: '#06b6d4',
  ZADD: '#f97316',
  EXPIRE: '#64748b',
  TTL: '#64748b',
};

const INITIAL_COMMANDS: CommandDistEntry[] = [
  { cmd: 'GET', count: 4820, pct: 38, color: '#3b82f6' },
  { cmd: 'SET', count: 2310, pct: 18, color: '#22c55e' },
  { cmd: 'HGET', count: 1890, pct: 15, color: '#a855f7' },
  { cmd: 'HSET', count: 1120, pct: 9, color: '#f59e0b' },
  { cmd: 'DEL', count: 870, pct: 7, color: '#ef4444' },
  { cmd: 'LPUSH', count: 650, pct: 5, color: '#06b6d4' },
  { cmd: 'ZADD', count: 490, pct: 4, color: '#f97316' },
  { cmd: 'EXPIRE', count: 510, pct: 4, color: '#64748b' },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState('live-traffic');
  const [isLive, setIsLive] = useState(true);
  const [stats, setStats] = useState<Stats>(generateStats());
  const [trafficEntries, setTrafficEntries] = useState<TrafficEntry[]>(() =>
    Array.from({ length: 20 }, () => generateTrafficEntry())
  );
  const [chartData, setChartData] = useState<ChartPoint[]>(() =>
    Array.from({ length: 30 }, (_, i) => generateChartPoint(i))
  );
  const [slowLogs, setSlowLogs] = useState<SlowLogEntry[]>(() =>
    Array.from({ length: 6 }, () => generateSlowLog())
  );
  const [events, setEvents] = useState<EventEntry[]>(() =>
    Array.from({ length: 5 }, () => generateEvent())
  );
  const [cmdDist, setCmdDist] = useState<CommandDistEntry[]>(INITIAL_COMMANDS);
  const [cmdFilter, setCmdFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const tickRef = useRef(0);

  const tick = useCallback(() => {
    tickRef.current += 1;
    const t = tickRef.current;

    setStats(generateStats());

    setChartData(prev => {
      const next = [...prev.slice(1), generateChartPoint(t + 30)];
      return next;
    });

    setTrafficEntries(prev => {
      const newEntry = generateTrafficEntry();
      return [newEntry, ...prev.slice(0, 49)];
    });

    if (t % 5 === 0) {
      setCmdDist(prev =>
        prev.map(d => ({
          ...d,
          count: d.count + Math.floor(Math.random() * 50),
        }))
      );
    }

    if (t % 8 === 0) {
      setSlowLogs(prev => [generateSlowLog(), ...prev.slice(0, 9)]);
    }

    if (t % 10 === 0) {
      setEvents(prev => [generateEvent(), ...prev.slice(0, 9)]);
    }
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(tick, 1200);
    return () => clearInterval(interval);
  }, [isLive, tick]);

  const handleRefresh = () => {
    setRefreshing(true);
    tick();
    setTimeout(() => setRefreshing(false), 600);
  };

  const filteredTraffic = trafficEntries.filter(e => {
    const matchCmd = cmdFilter === 'ALL' || e.command === cmdFilter;
    const matchSearch =
      !searchQuery ||
      e.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCmd && matchSearch;
  });

  const cmdDistWithColors = cmdDist.map(d => ({
    ...d,
    color: COMMAND_COLORS[d.cmd] || '#64748b',
  }));

  const totalCmds = cmdDist.reduce((s, d) => s + d.count, 0);
  const cmdDistWithPct = cmdDistWithColors.map(d => ({
    ...d,
    pct: Math.round((d.count / totalCmds) * 100),
  }));

  return (
    <div className="app-container">
      <Header
        isLive={isLive}
        onToggleLive={() => setIsLive(v => !v)}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <div className="main-layout">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        <main className="content-area">
          <StatsGrid stats={stats} />
          <div className="chart-section">
            <LiveTrafficChart data={chartData} />
            <CommandDistribution data={cmdDistWithPct} />
          </div>
          <div className="traffic-section">
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <span>🔄</span> Live Commands
                  <span className="card-badge live">● LIVE</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="search-input"
                    placeholder="Search keys, commands..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="filter-bar">
                <span className="filter-label">Filter:</span>
                <div className="filter-chips">
                  {['ALL', 'GET', 'SET', 'DEL', 'HGET', 'HSET', 'LPUSH', 'ZADD'].map(cmd => (
                    <button
                      key={cmd}
                      className={`filter-chip${cmdFilter === cmd ? ' active' : ''}`}
                      onClick={() => setCmdFilter(cmd)}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
              <TrafficTable entries={filteredTraffic.slice(0, 15)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SlowLog entries={slowLogs} />
              <EventTimeline events={events} />
            </div>
          </div>
          <div className="memory-section">
            <MemorySection stats={stats} />
            <KeyspaceSection />
          </div>
        </main>
      </div>
    </div>
  );
}
