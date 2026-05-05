import type { Stats, TrafficEntry, ChartPoint, SlowLogEntry, EventEntry } from './types';

const COMMANDS = ['GET', 'SET', 'DEL', 'HGET', 'HSET', 'LPUSH', 'RPUSH', 'ZADD', 'EXPIRE', 'TTL', 'MGET', 'INCR'];
const KEY_PREFIXES = ['user:', 'session:', 'cache:', 'order:', 'product:', 'token:', 'rate:', 'queue:'];
const CLIENTS = ['10.0.1.12:43210', '10.0.1.15:51234', '10.0.2.8:62100', '192.168.1.5:38900', '10.0.3.22:55012'];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
const uid = () => Math.random().toString(36).slice(2, 9);

const timeStr = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
};

const relTime = () => {
  const seconds = rand(1, 120);
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
};

export function generateStats(): Stats {
  const usedMb = randFloat(120, 380);
  const totalMb = 512;
  const hits = rand(40000, 80000);
  const misses = rand(2000, 8000);
  const total = hits + misses;
  return {
    opsPerSec: rand(8000, 25000),
    connectedClients: rand(45, 180),
    hitRate: parseFloat(((hits / total) * 100).toFixed(1)),
    missRate: parseFloat(((misses / total) * 100).toFixed(1)),
    usedMemoryMb: parseFloat(usedMb.toFixed(1)),
    totalMemoryMb: totalMb,
    memoryPct: parseFloat(((usedMb / totalMb) * 100).toFixed(1)),
    keyspaceHits: hits,
    keyspaceMisses: misses,
    totalCommands: rand(2000000, 8000000),
    networkInKbs: rand(200, 900),
    networkOutKbs: rand(500, 2000),
    evictedKeys: rand(0, 50),
    expiredKeys: rand(100, 2000),
    replicationLag: rand(0, 5),
    uptimeHours: rand(48, 720),
  };
}

export function generateTrafficEntry(): TrafficEntry {
  const cmd = COMMANDS[rand(0, COMMANDS.length - 1)];
  const prefix = KEY_PREFIXES[rand(0, KEY_PREFIXES.length - 1)];
  return {
    id: uid(),
    timestamp: timeStr(),
    command: cmd,
    key: `${prefix}${uid()}`,
    client: CLIENTS[rand(0, CLIENTS.length - 1)],
    db: rand(0, 3),
    latencyUs: rand(50, 8000),
    status: Math.random() > 0.05 ? 'ok' : 'error',
    bytes: rand(10, 4096),
  };
}

export function generateChartPoint(t: number): ChartPoint {
  return {
    t,
    reads: rand(300, 900),
    writes: rand(100, 450),
    errors: rand(0, 20),
  };
}

export function generateSlowLog(): SlowLogEntry {
  const cmd = COMMANDS[rand(0, COMMANDS.length - 1)];
  const prefix = KEY_PREFIXES[rand(0, KEY_PREFIXES.length - 1)];
  return {
    id: uid(),
    command: cmd,
    args: `${prefix}${uid()} ${rand(1, 100)}`,
    durationUs: rand(10000, 250000),
    timestamp: relTime(),
    clientAddr: CLIENTS[rand(0, CLIENTS.length - 1)],
  };
}

const EVENT_MESSAGES: { type: EventEntry['type']; message: string }[] = [
  { type: 'warn', message: 'Memory usage exceeded 70% threshold' },
  { type: 'info', message: 'New client connected from 10.0.1.22' },
  { type: 'success', message: 'Replication sync completed successfully' },
  { type: 'error', message: 'Command timeout on key user:session:abc123' },
  { type: 'info', message: 'Keyspace notification triggered: expired event' },
  { type: 'warn', message: 'Slow command detected: KEYS * took 48ms' },
  { type: 'success', message: 'RDB snapshot saved to disk' },
  { type: 'error', message: 'Client disconnected abruptly: 10.0.2.8' },
  { type: 'info', message: 'CONFIG SET maxmemory-policy allkeys-lru' },
  { type: 'warn', message: 'Eviction policy triggered: 12 keys evicted' },
];

export function generateEvent(): EventEntry {
  const ev = EVENT_MESSAGES[rand(0, EVENT_MESSAGES.length - 1)];
  return {
    id: uid(),
    type: ev.type,
    message: ev.message,
    time: relTime(),
  };
}
