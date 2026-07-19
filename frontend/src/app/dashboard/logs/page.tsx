"use client";
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  CheckSquare,
  X,
  Copy,
} from 'lucide-react';
import { cn } from '@/dashboard/lib/utils';
import { listAgents, listLogs, clearLogs } from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';
import type { LogEntry, LogSeverity } from '@/dashboard/types';

// ── Helpers ─────────────────────────────────────────────────────────

const severityConfig: Record<LogSeverity, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  info: { label: 'INFO', dotColor: 'bg-status-info', bgColor: 'bg-status-info/20', textColor: 'text-status-info' },
  debug: { label: 'DEBUG', dotColor: 'bg-purple-500', bgColor: 'bg-purple-500/20', textColor: 'text-purple-400' },
  warn: { label: 'WARN', dotColor: 'bg-status-warning', bgColor: 'bg-status-warning/20', textColor: 'text-status-warning' },
  error: { label: 'ERROR', dotColor: 'bg-status-danger', bgColor: 'bg-status-danger/20', textColor: 'text-status-danger' },
  metrics: { label: 'METRICS', dotColor: 'bg-status-success', bgColor: 'bg-status-success/20', textColor: 'text-status-success' },
};

function formatLogTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatLogDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function groupByDate(logs: LogEntry[]): { date: string; logs: LogEntry[] }[] {
  const groups: Record<string, LogEntry[]> = {};
  logs.forEach((log) => {
    const dateKey = formatLogDate(log.timestamp);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(log);
  });
  return Object.entries(groups).map(([date, logs]) => ({ date, logs }));
}

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

// ── Component ───────────────────────────────────────────────────────

export default function Logs() {
  const [selectedSeverities, setSelectedSeverities] = useState<Set<LogSeverity>>(
    new Set(['info', 'debug', 'warn', 'metrics'])
  );
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set(['all']));
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Data from the mock API
  const { data: agentsData } = useApiData(() => listAgents(), []);
  const agents = agentsData ?? [];
  const { data: logsData, loading, refetch } = useApiData(() => listLogs(), []);

  // Toggle severity
  const toggleSeverity = (s: LogSeverity) => {
    setSelectedSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  // Toggle agent filter
  const toggleAgent = (name: string) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev);
      if (name === 'all') {
        return new Set(['all']);
      }
      next.delete('all');
      if (next.has(name)) {
        next.delete(name);
        if (next.size === 0) return new Set(['all']);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    let logs = logsData ?? [];
    if (!selectedSeverities.has('info') || !selectedSeverities.has('debug') || !selectedSeverities.has('warn') || !selectedSeverities.has('error') || !selectedSeverities.has('metrics')) {
      logs = logs.filter((l) => selectedSeverities.has(l.severity));
    }
    if (!selectedAgents.has('all')) {
      logs = logs.filter((l) => selectedAgents.has(l.agent));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          l.agent.toLowerCase().includes(q) ||
          l.details?.rawInput?.toLowerCase().includes(q) ||
          l.details?.rawOutput?.toLowerCase().includes(q)
      );
    }
    return logs;
  }, [logsData, selectedSeverities, selectedAgents, searchQuery]);

  // Group by date
  const dateGroups = useMemo(() => groupByDate(filteredLogs), [filteredLogs]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // Clear logs
  const handleClear = async () => {
    if (confirm('Clear all visible logs?')) {
      await clearLogs();
      refetch();
    }
  };

  // Export logs
  const handleExport = () => {
    const text = filteredLogs
      .map((l) => `${formatLogTime(l.timestamp)} [${l.severity.toUpperCase()}] ${l.agent}: ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy log detail
  const handleCopy = (log: LogEntry) => {
    const text = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Stats
  const totalTokens = filteredLogs.reduce((sum, l) => sum + (l.details?.tokensUsed || 0), 0);
  const avgExecTime =
    filteredLogs.length > 0
      ? Math.round(filteredLogs.reduce((sum, l) => sum + (l.details?.executionTime || 0), 0) / filteredLogs.length)
      : 0;
  const severityCounts = useMemo(() => {
    const counts: Record<LogSeverity, number> = { info: 0, debug: 0, warn: 0, error: 0, metrics: 0 };
    filteredLogs.forEach((l) => { counts[l.severity]++; });
    return counts;
  }, [filteredLogs]);

  return (
    <div className="flex h-[calc(100dvh-56px-48px)] flex-col -m-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-secondary px-6 py-3">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-heading-sm text-text-primary">Agent Logs</h1>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
              </span>
            </div>
            <p className="text-caption text-text-tertiary">Debug console — raw agent I/O and execution traces</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-44 rounded-lg border border-border-subtle bg-bg-quaternary pl-8 pr-3 text-body-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>
          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-body-sm transition-all',
              autoScroll
                ? 'border-text-accent bg-text-accent/10 text-text-accent'
                : 'border-border-medium text-text-secondary hover:bg-bg-tertiary'
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', autoScroll ? 'bg-text-accent' : 'bg-text-tertiary')} />
            Auto-scroll
          </button>
          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-border-medium px-3 py-1.5 text-body-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          {/* Clear */}
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-lg border border-border-medium px-3 py-1.5 text-body-sm text-text-secondary transition-colors hover:bg-status-danger/10 hover:text-status-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Filter Sidebar ── */}
        <div className="w-52 shrink-0 overflow-y-auto border-r border-border-subtle bg-bg-secondary">
          {/* Agent Filter */}
          <div className="border-b border-border-subtle px-4 py-3">
            <h3 className="mb-2 text-heading-sm text-text-tertiary">Agent</h3>
            <div className="flex flex-col gap-1">
              <label className="flex cursor-pointer items-center gap-2 py-1">
                <div
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                    selectedAgents.has('all')
                      ? 'border-text-accent bg-text-accent'
                      : 'border-border-medium bg-transparent'
                  )}
                  onClick={() => toggleAgent('all')}
                >
                  {selectedAgents.has('all') && <CheckSquare className="h-3 w-3 text-bg-primary" />}
                </div>
                <span className="text-body-sm text-text-primary">All Agents</span>
              </label>
              {agents.map((agent) => (
                <label key={agent.id} className="flex cursor-pointer items-center gap-2 py-1">
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                      selectedAgents.has(agent.name)
                        ? 'border-text-accent bg-text-accent'
                        : 'border-border-medium bg-transparent'
                    )}
                    onClick={() => toggleAgent(agent.name)}
                  >
                    {selectedAgents.has(agent.name) && <CheckSquare className="h-3 w-3 text-bg-primary" />}
                  </div>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: agent.color }} />
                  <span className="truncate text-body-sm text-text-secondary">{agent.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="border-b border-border-subtle px-4 py-3">
            <h3 className="mb-2 text-heading-sm text-text-tertiary">Severity</h3>
            <div className="flex flex-col gap-1">
              {(['info', 'debug', 'warn', 'error', 'metrics'] as LogSeverity[]).map((s) => (
                <label key={s} className="flex cursor-pointer items-center gap-2 py-1">
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                      selectedSeverities.has(s)
                        ? 'border-text-accent bg-text-accent'
                        : 'border-border-medium bg-transparent'
                    )}
                    onClick={() => toggleSeverity(s)}
                  >
                    {selectedSeverities.has(s) && <CheckSquare className="h-3 w-3 text-bg-primary" />}
                  </div>
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', severityConfig[s].dotColor)} />
                  <span className="text-body-sm text-text-secondary">{severityConfig[s].label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pipeline Filter */}
          <div className="px-4 py-3">
            <h3 className="mb-2 text-heading-sm text-text-tertiary">Pipeline</h3>
            <div className="flex flex-col gap-1">
              {[
                { label: 'All Pipelines', value: 'all' },
                { label: 'Lead Pipeline', value: 'lead' },
                { label: 'Social Pipeline', value: 'social' },
                { label: 'Product Pipeline', value: 'product' },
              ].map((p) => (
                <label key={p.value} className="flex cursor-pointer items-center gap-2 py-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-border-medium bg-transparent">
                    {p.value === 'all' && <CheckSquare className="h-3 w-3 text-text-accent" />}
                  </div>
                  <span className="text-body-sm text-text-secondary">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Log Stream ── */}
        <div className="flex flex-1 flex-col bg-bg-primary">
          <div
            ref={scrollContainerRef}
            onScroll={() => {
              if (scrollContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
                if (scrollHeight - scrollTop - clientHeight < 50) {
                  if (!autoScroll) setAutoScroll(true);
                } else if (autoScroll) {
                  setAutoScroll(false);
                }
              }
            }}
            className="flex-1 overflow-y-auto"
          >
            {!loading && dateGroups.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <X className="h-12 w-12 text-text-tertiary/25" />
                <p className="mt-3 text-body-md text-text-tertiary">No logs match your filters</p>
                <button
                  onClick={() => {
                    setSelectedSeverities(new Set(['info', 'debug', 'warn', 'metrics']));
                    setSelectedAgents(new Set(['all']));
                    setSearchQuery('');
                  }}
                  className="mt-3 text-body-sm text-text-accent hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              dateGroups.map((group) => (
                <div key={group.date}>
                  {/* Sticky date header */}
                  <div className="sticky top-0 z-10 border-b border-border-subtle bg-bg-primary/90 px-5 py-1.5 backdrop-blur-sm">
                    <span className="text-caption font-medium text-text-tertiary">{group.date}</span>
                  </div>

                  {/* Log entries */}
                  <div className="flex flex-col">
                    {group.logs.map((log, idx) => {
                      const config = severityConfig[log.severity];
                      const isExpanded = expandedLog === log.id;
                      const isSelected = expandedLog === log.id;

                      // Check if previous log is from same agent (for grouping line)
                      const prevSameAgent = idx > 0 && group.logs[idx - 1].agent === log.agent;

                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, ease: easeOut }}
                        >
                          <div
                            onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                            className={cn(
                              'group relative cursor-pointer border-l-[3px] border-l-transparent py-[3px] transition-colors hover:bg-bg-secondary/50',
                              isSelected && 'border-l-text-accent bg-bg-tertiary/50',
                              log.severity === 'error' && 'bg-status-danger/5 hover:bg-status-danger/10',
                              !prevSameAgent && 'mt-0.5'
                            )}
                          >
                            {/* Agent grouping line */}
                            {prevSameAgent && (
                              <div
                                className="absolute left-[7px] top-0 h-full w-px"
                                style={{ backgroundColor: `${log.agentColor}20` }}
                              />
                            )}

                            <div className="flex items-start gap-3 px-5">
                              {/* Timestamp */}
                              <span className="shrink-0 pt-px font-mono text-mono-sm text-text-tertiary" style={{ minWidth: 64 }}>
                                {formatLogTime(log.timestamp)}
                              </span>

                              {/* Severity badge */}
                              <span
                                className={cn(
                                  'mt-px shrink-0 rounded-sm px-1.5 py-px text-caption font-semibold',
                                  config.bgColor,
                                  config.textColor
                                )}
                              >
                                {config.label}
                              </span>

                              {/* Agent name */}
                              <span
                                className="shrink-0 pt-px font-mono text-mono-sm font-semibold"
                                style={{ color: log.agentColor, minWidth: 120 }}
                              >
                                {log.agent.replace(/\s+/g, '_')}
                              </span>

                              {/* Pipeline badge */}
                              {log.pipeline && (
                                <span className="mt-px shrink-0 rounded-full bg-bg-tertiary px-2 py-px text-caption text-text-tertiary">
                                  {log.pipeline}
                                </span>
                              )}

                              {/* Message */}
                              <span
                                className={cn(
                                  'flex-1 break-all pt-px font-mono text-mono-sm text-text-primary',
                                  log.severity === 'error' && 'text-status-danger'
                                )}
                              >
                                {log.message}
                              </span>

                              {/* Expand indicator */}
                              {log.details && (
                                <span className="shrink-0 pt-px text-text-tertiary transition-colors group-hover:text-text-primary">
                                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Expanded detail panel */}
                          <AnimatePresence>
                            {isExpanded && log.details && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: easeOut }}
                                className="overflow-hidden"
                              >
                                <div className="border-b border-border-subtle bg-bg-secondary px-5 py-3">
                                  <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: log.agentColor }} />
                                      <span className="text-body-sm font-medium text-text-primary">{log.agent}</span>
                                      <span className="text-mono-sm text-text-tertiary">{formatLogTime(log.timestamp)}</span>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(log);
                                      }}
                                      className="flex items-center gap-1 rounded-md px-2 py-1 text-caption text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                                    >
                                      {copiedId === log.id ? (
                                        <>
                                          <CheckSquare className="h-3 w-3 text-status-success" /> Copied
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="h-3 w-3" /> Copy
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  {/* Metrics row */}
                                  <div className="mb-3 flex flex-wrap gap-4">
                                    {log.details.tokensUsed !== undefined && (
                                      <div className="rounded-md bg-bg-tertiary px-3 py-1.5">
                                        <span className="text-caption text-text-tertiary">Tokens: </span>
                                        <span className="font-mono text-mono-sm text-text-primary">
                                          {log.details.tokensUsed.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    {log.details.executionTime !== undefined && (
                                      <div className="rounded-md bg-bg-tertiary px-3 py-1.5">
                                        <span className="text-caption text-text-tertiary">Execution: </span>
                                        <span className="font-mono text-mono-sm text-text-primary">
                                          {log.details.executionTime >= 1000
                                            ? `${(log.details.executionTime / 1000).toFixed(1)}s`
                                            : `${log.details.executionTime}ms`}
                                        </span>
                                      </div>
                                    )}
                                    {log.details.statusCode !== undefined && (
                                      <div className="rounded-md bg-bg-tertiary px-3 py-1.5">
                                        <span className="text-caption text-text-tertiary">Status: </span>
                                        <span
                                          className={cn(
                                            'font-mono text-mono-sm font-semibold',
                                            log.details.statusCode >= 400 ? 'text-status-danger' : 'text-status-success'
                                          )}
                                        >
                                          {log.details.statusCode}
                                        </span>
                                      </div>
                                    )}
                                    {log.details.latency !== undefined && (
                                      <div className="rounded-md bg-bg-tertiary px-3 py-1.5">
                                        <span className="text-caption text-text-tertiary">Latency: </span>
                                        <span className="font-mono text-mono-sm text-text-primary">{log.details.latency}ms</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Raw Input */}
                                  {log.details.rawInput && (
                                    <div className="mb-2">
                                      <span className="mb-1 block text-caption text-text-tertiary">Raw Input</span>
                                      <pre className="overflow-x-auto rounded-md bg-bg-primary p-3 font-mono text-mono-sm text-text-secondary">
                                        {log.details.rawInput}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Raw Output */}
                                  {log.details.rawOutput && (
                                    <div className="mb-2">
                                      <span className="mb-1 block text-caption text-text-tertiary">Raw Output</span>
                                      <pre className="overflow-x-auto rounded-md bg-bg-primary p-3 font-mono text-mono-sm text-text-secondary">
                                        {log.details.rawOutput}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Stack Trace */}
                                  {log.details.stackTrace && (
                                    <div>
                                      <span className="mb-1 block text-caption text-text-tertiary">Stack Trace</span>
                                      <pre className="overflow-x-auto rounded-md bg-bg-primary p-3 font-mono text-mono-sm text-status-danger">
                                        {log.details.stackTrace}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Status Bar ── */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2, delay: 0.4, ease: easeOut }}
            className="flex h-12 shrink-0 items-center gap-6 border-t border-border-subtle bg-bg-secondary px-5"
          >
            <span className="font-mono text-mono-sm text-text-secondary">
              {filteredLogs.length} logs
            </span>
            <span className="font-mono text-mono-sm">
              <span className="text-status-info">{severityCounts.info} INFO</span>
              <span className="mx-1.5 text-border-medium">|</span>
              <span className="text-purple-400">{severityCounts.debug} DEBUG</span>
              <span className="mx-1.5 text-border-medium">|</span>
              <span className="text-status-warning">{severityCounts.warn} WARN</span>
              <span className="mx-1.5 text-border-medium">|</span>
              <span className="text-status-danger">{severityCounts.error} ERROR</span>
              <span className="mx-1.5 text-border-medium">|</span>
              <span className="text-status-success">{severityCounts.metrics} METRICS</span>
            </span>
            <span className="font-mono text-mono-sm text-text-secondary">
              Avg latency: {avgExecTime >= 1000 ? `${(avgExecTime / 1000).toFixed(1)}s` : `${avgExecTime}ms`}
            </span>
            <span className="font-mono text-mono-sm text-text-secondary">
              Total tokens: {totalTokens.toLocaleString()}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
              </span>
              <span className="font-mono text-mono-sm text-status-success">Streaming</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
