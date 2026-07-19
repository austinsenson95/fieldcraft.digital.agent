"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/dashboard/store/useSidebarStore';
import { getOverview, searchAll, type SearchResults } from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/approvals': 'Approval Queue',
  '/dashboard/leads': 'Leads Board',
  '/dashboard/content': 'Content Calendar',
  '/dashboard/products': 'Product Ideas',
  '/dashboard/chat': 'Agent Chat',
  '/dashboard/logs': 'Agent Logs',
  '/dashboard/brand': 'Brand Memory',
  '/dashboard/settings': 'Settings',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function DashboardTopBar() {
  const pathname = usePathname();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: overview } = useApiData(() => getOverview(), []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) setResults(null);
  };

  // Debounced global search
  useEffect(() => {
    if (!query.trim()) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      searchAll(query)
        .then((res) => {
          if (!cancelled) setResults(res);
        })
        .catch(() => {
          if (!cancelled) setResults(null);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const pageTitle = pageTitles[pathname] || 'Dashboard';

  const hasResults =
    results !== null &&
    (results.agents.length > 0 || results.leads.length > 0 || results.content.length > 0);

  const closeSearch = () => {
    setQuery('');
    setResults(null);
  };

  const pendingApprovals = overview?.pendingApprovals ?? 0;

  return (
    <motion.header
      animate={{ left: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
      className="fixed right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-secondary px-6 shadow-topbar"
    >
      {/* Left: Page title */}
      <div>
        <h1 className="text-heading-sm text-text-primary">{pageTitle}</h1>
        <p className="text-caption text-text-tertiary">{formatDate(currentTime)}</p>
      </div>

      {/* Center: Search bar */}
      <div className="relative w-80 max-md:hidden">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search agents, leads, content..."
          className="h-9 w-full rounded-full border border-border-subtle bg-bg-tertiary pl-9 pr-4 text-body-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
        />

        {query.trim() && (
          <>
            {/* Backdrop: close on outside click */}
            <div className="fixed inset-0 z-40" onClick={closeSearch} />
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-border-subtle bg-bg-quaternary py-2 shadow-modal">
              {results === null ? (
                <p className="px-4 py-2 text-body-sm text-text-tertiary">Searching...</p>
              ) : hasResults ? (
                <>
                  {results.agents.length > 0 && (
                    <div>
                      <p className="px-4 pb-1 pt-1 text-caption font-medium uppercase tracking-wide text-text-tertiary">Agents</p>
                      {results.agents.map((agent) => (
                        <Link
                          key={agent.id}
                          href="/dashboard/settings"
                          onClick={closeSearch}
                          className="block px-4 py-1.5 text-body-sm text-text-primary transition-colors hover:bg-bg-tertiary"
                        >
                          {agent.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {results.leads.length > 0 && (
                    <div>
                      <p className="px-4 pb-1 pt-2 text-caption font-medium uppercase tracking-wide text-text-tertiary">Leads</p>
                      {results.leads.map((lead) => (
                        <Link
                          key={lead.id}
                          href="/dashboard/leads"
                          onClick={closeSearch}
                          className="block px-4 py-1.5 text-body-sm text-text-primary transition-colors hover:bg-bg-tertiary"
                        >
                          {lead.company} <span className="text-text-tertiary">— {lead.contactName}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {results.content.length > 0 && (
                    <div>
                      <p className="px-4 pb-1 pt-2 text-caption font-medium uppercase tracking-wide text-text-tertiary">Content</p>
                      {results.content.map((post) => (
                        <Link
                          key={post.id}
                          href="/dashboard/content"
                          onClick={closeSearch}
                          className="block px-4 py-1.5 text-body-sm text-text-primary transition-colors hover:bg-bg-tertiary"
                        >
                          {post.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="px-4 py-2 text-body-sm text-text-tertiary">No results</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: Notifications + Status */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((open) => !open)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Bell className="h-5 w-5" />
            {pendingApprovals > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-status-danger" />
            )}
          </button>

          {notifOpen && (
            <>
              {/* Backdrop: close on outside click */}
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border-subtle bg-bg-quaternary py-2 shadow-modal">
                <p className="border-b border-border-subtle px-4 pb-2 text-body-sm font-medium text-text-primary">Notifications</p>
                <Link
                  href="/dashboard/approvals"
                  onClick={() => setNotifOpen(false)}
                  className="block px-4 py-2 text-body-sm text-text-primary transition-colors hover:bg-bg-tertiary"
                >
                  {pendingApprovals} pending approvals
                </Link>
                {overview?.activityFeed.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5 px-4 py-2">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.agentColor }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-body-sm text-text-primary">{item.action}</p>
                      <p className="text-caption text-text-tertiary">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Swarm Active status */}
        <div className="flex items-center gap-2 rounded-full bg-bg-tertiary px-3.5 py-1.5 max-sm:hidden">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-success" />
          </span>
          <span className="text-caption font-medium text-status-success">Swarm Active</span>
          <span className="text-caption text-text-tertiary">— 10/10 agents</span>
        </div>

        {/* Current time */}
        <div className="min-w-[72px] text-right font-mono text-mono-md text-text-secondary">
          {formatTime(currentTime)}
        </div>
      </div>
    </motion.header>
  );
}
