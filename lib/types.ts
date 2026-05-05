export interface Stats {
  opsPerSec: number;
  connectedClients: number;
  hitRate: number;
  missRate: number;
  usedMemoryMb: number;
  totalMemoryMb: number;
  memoryPct: number;
  keyspaceHits: number;
  keyspaceMisses: number;
  totalCommands: number;
  networkInKbs: number;
  networkOutKbs: number;
  evictedKeys: number;
  expiredKeys: number;
  replicationLag: number;
  uptimeHours: number;
}

export interface TrafficEntry {
  id: string;
  timestamp: string;
  command: string;
  key: string;
  client: string;
  db: number;
  latencyUs: number;
  status: 'ok' | 'error';
  bytes: number;
}

export interface ChartPoint {
  t: number;
  reads: number;
  writes: number;
  errors: number;
}

export interface SlowLogEntry {
  id: string;
  command: string;
  args: string;
  durationUs: number;
  timestamp: string;
  clientAddr: string;
}

export interface EventEntry {
  id: string;
  type: 'info' | 'warn' | 'error' | 'success';
  message: string;
  time: string;
}

export interface CommandDistEntry {
  cmd: string;
  count: number;
  pct: number;
  color: string;
}
