/**
 * Structured Diagnostic Logger for ELXIE Flasher
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
}

type LogListener = (entry: LogEntry) => void;

class Logger {
  private entries: LogEntry[] = [];
  private readonly maxEntries = 200;
  private listeners: Set<LogListener> = new Set();

  private addEntry(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
      level,
      message,
      meta
    };

    this.entries.unshift(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.pop();
    }

    this.listeners.forEach(fn => fn(entry));

    // Console output for dev inspection
    const prefix = `[ELXIE ${level.toUpperCase()}]`;
    if (level === 'error') {
      console.error(prefix, message, meta || '');
    } else if (level === 'warn') {
      console.warn(prefix, message, meta || '');
    } else {
      console.log(prefix, message, meta || '');
    }
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.addEntry('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.addEntry('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.addEntry('error', message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.addEntry('debug', message, meta);
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear() {
    this.entries = [];
    this.listeners.forEach(fn => fn({
      id: 'clear',
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
      level: 'info',
      message: 'Log buffer cleared.'
    }));
  }

  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const logger = new Logger();
