"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Users,
  Target,
  Trophy,
  AlertTriangle,
  Edit3,
  X,
  Clock,
  ChevronRight,
  Save,
  RotateCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/dashboard/lib/utils';
import { Switch } from '@/dashboard/components/ui/switch';
import { Button } from '@/dashboard/components/ui/button';
import { Separator } from '@/dashboard/components/ui/separator';
import type { BrandDoc, DocumentRevision } from '@/dashboard/types';
import { listBrandDocs, saveBrandDoc, listRevisions, restoreRevision } from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';

// ------------------------------------------------------------------
// Tab definitions
// ------------------------------------------------------------------
const tabs = [
  { key: 'voice', label: 'Voice', icon: BookOpen },
  { key: 'icp', label: 'ICP', icon: Users },
  { key: 'positioning', label: 'Positioning', icon: Target },
  { key: 'past_win', label: 'Past Wins', icon: Trophy },
  { key: 'past_fail', label: 'Past Fails', icon: AlertTriangle },
];

// ------------------------------------------------------------------
// Doc icons (BrandDoc no longer carries an icon — map tab -> icon)
// ------------------------------------------------------------------
const docIcons: Record<string, LucideIcon> = {
  voice: BookOpen,
  icp: Users,
  positioning: Target,
  past_win: Trophy,
  past_fail: AlertTriangle,
};

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function categoryBadgeColor(category: string): string {
  switch (category) {
    case 'voice': return 'bg-[#9B6BFF]/15 text-[#9B6BFF]';
    case 'icp': return 'bg-[#38BDF8]/15 text-[#38BDF8]';
    case 'positioning': return 'bg-[#7C8CF0]/15 text-[#7C8CF0]';
    case 'past_win': return 'bg-[#34D399]/15 text-[#34D399]';
    case 'past_fail': return 'bg-[#F0A84F]/15 text-[#F0A84F]';
    default: return 'bg-bg-tertiary text-text-secondary';
  }
}

// ------------------------------------------------------------------
// Simple markdown renderer
// ------------------------------------------------------------------
function RenderMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let listItems: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${i}`} className="mb-4 space-y-1.5">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(2); // skip header and separator
      const headers = headerRow.split('|').map(c => c.trim()).filter(Boolean);
      elements.push(
        <div key={`table-${i}`} className="mb-4 overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="bg-bg-tertiary">
                {headers.map((h, idx) => (
                  <th key={idx} className="px-4 py-2.5 text-caption font-semibold uppercase tracking-wider text-text-tertiary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => {
                const cells = row.split('|').map(c => c.trim()).filter(Boolean);
                return (
                  <tr key={rIdx} className={cn('border-b border-border-subtle', rIdx % 2 === 0 ? 'bg-bg-secondary' : 'bg-transparent')}>
                    {cells.map((c, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5 text-text-secondary">{c}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('|')) {
      flushList();
      inTable = true;
      tableRows.push(line);
      i++;
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={i} className="mb-6 text-display-lg font-bold text-text-primary border-b-2 border-border-subtle pb-4">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="mt-8 mb-4 text-heading-lg font-semibold text-text-primary border-l-4 border-text-accent pl-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="mt-6 mb-3 text-heading-md font-semibold text-text-primary">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={i} className="mb-4 border-l-4 border-text-accent bg-bg-tertiary rounded-lg px-5 py-4 text-body-md text-text-secondary">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const itemText = line.slice(2);
      listItems.push(
        <li key={i} className="flex items-start gap-2.5 text-body-md text-text-secondary">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-text-accent" />
          <span>{renderInline(itemText)}</span>
        </li>
      );
    } else if (line.match(/^\d+\.\s/)) {
      const itemText = line.replace(/^\d+\.\s/, '');
      listItems.push(
        <li key={i} className="flex items-start gap-2.5 text-body-md text-text-secondary">
          <span className="mt-0.5 shrink-0 text-body-sm font-semibold text-text-accent">{line.match(/^\d+/)?.[0]}.</span>
          <span>{renderInline(itemText)}</span>
        </li>
      );
    } else if (line.trim() === '---') {
      flushList();
      elements.push(<hr key={i} className="my-6 border-border-subtle" />);
    } else if (line.trim() === '') {
      // skip empty lines
    } else {
      flushList();
      elements.push(
        <p key={i} className="mb-4 text-body-lg leading-relaxed text-text-secondary">
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }

  flushList();
  flushTable();

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_)/g;
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={keyIdx++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[2]) {
      parts.push(<strong key={keyIdx++} className="font-semibold text-text-primary">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={keyIdx++} className="italic text-text-secondary">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(<em key={keyIdx++} className="italic text-text-secondary">{match[4]}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={keyIdx++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

// ------------------------------------------------------------------
// Status dot
// ------------------------------------------------------------------
function StatusDot({ status }: { status: 'green' | 'amber' | 'gray' }) {
  const colorClass =
    status === 'green'
      ? 'bg-status-success'
      : status === 'amber'
        ? 'bg-status-warning'
        : 'bg-text-tertiary';
  return (
    <span className={cn('h-2 w-2 rounded-full', colorClass)} />
  );
}

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------
export default function Brand() {
  const [activeTab, setActiveTab] = useState('voice');
  const [editMode, setEditMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editContent, setEditContent] = useState('');

  const { data: docsData, error: docsError, refetch: refetchDocs } = useApiData(() => listBrandDocs(), []);

  const docs = useMemo<BrandDoc[]>(() => docsData ?? [], [docsData]);

  const activeDoc = useMemo(
    () => docs.find((d) => d.tab === activeTab) || docs[0],
    [docs, activeTab]
  );

  const { data: revisionsData, refetch: refetchRevisions } = useApiData(
    () => listRevisions(activeDoc?.id),
    [activeDoc?.id, docsData]
  );

  const revisions = useMemo<DocumentRevision[]>(() => revisionsData ?? [], [revisionsData]);

  const handleEditStart = () => {
    if (!activeDoc) return;
    setEditContent(activeDoc.content);
    setEditMode(true);
    setShowHistory(false);
  };

  const handleSave = async () => {
    if (!activeDoc) return;
    await saveBrandDoc(activeDoc.id, editContent);
    refetchDocs();
    refetchRevisions();
    setEditMode(false);
  };

  const handleRestore = async (revisionId: string) => {
    await restoreRevision(revisionId);
    refetchDocs();
    refetchRevisions();
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditContent('');
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  if (!activeDoc) {
    return (
      <div className="flex h-full items-center justify-center text-body-md text-text-secondary">
        {docsError ? `Failed to load brand documents: ${docsError.message}` : 'Loading brand documents…'}
      </div>
    );
  }

  const ActiveDocIcon = docIcons[activeDoc.tab] ?? BookOpen;

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-display-lg font-bold text-text-primary">Brand Memory</h1>
          <p className="text-body-md text-text-secondary">
            Foundational documents — all agents reference these
          </p>
          <p className="mt-1 text-mono-sm text-text-tertiary">
            v2.3 — Last updated {timeAgo(activeDoc.lastUpdated)} by {activeDoc.updatedBy}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <div className="flex items-center gap-2 text-body-sm text-text-secondary">
            <span>Edit Mode</span>
            <Switch checked={editMode} onCheckedChange={(v) => v ? handleEditStart() : setEditMode(false)} />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setShowHistory((s) => !s); setEditMode(false); }}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            {showHistory ? 'View Document' : 'View History'}
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
        className="flex flex-wrap gap-1 rounded-lg bg-bg-secondary p-1 border border-border-subtle"
      >
        {tabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setShowHistory(false); }}
              className={cn(
                'relative flex items-center gap-2 rounded-md px-4 py-2.5 text-body-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-bg-tertiary text-text-primary'
                  : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary'
              )}
            >
              <t.icon className="h-4 w-4" />
              <span>{t.label}</span>
              {isActive && (
                <motion.div
                  layoutId="brandTabIndicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-text-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border-subtle bg-bg-secondary p-6"
          >
            <div className="mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-text-accent" />
              <h2 className="text-heading-lg font-semibold text-text-primary">Edit History</h2>
            </div>
            <div className="space-y-4">
              {revisions.map((rev, idx) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="flex items-start gap-4 rounded-lg border border-border-subtle bg-bg-primary p-4"
                >
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: rev.agentColor }}
                    />
                    {idx < revisions.length - 1 && (
                      <div className="h-10 w-px bg-border-subtle" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-medium text-text-primary">{rev.agent}</span>
                      <span className="text-mono-sm text-text-tertiary">{timeAgo(rev.timestamp)}</span>
                    </div>
                    <p className="mt-1 text-body-sm text-text-secondary">{rev.changes}</p>
                    <div className="mt-2 rounded-md bg-bg-tertiary px-3 py-2 text-mono-sm text-text-tertiary">
                      <span className="text-status-danger">- </span>
                      <span className="text-text-secondary">{rev.changes}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestore(rev.id)} className="shrink-0 text-body-sm text-text-tertiary hover:text-text-primary">
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Restore
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : editMode ? (
          <motion.div
            key="editor"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-text-accent" />
                  <h2 className="text-heading-lg font-semibold text-text-primary">
                    Editing: {activeDoc.title}
                  </h2>
                </div>
                <span className={cn('rounded-full px-3 py-1 text-caption font-semibold', categoryBadgeColor(activeDoc.category))}>
                  {activeDoc.category}
                </span>
              </div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[480px] w-full resize-y rounded-lg border border-border-subtle bg-bg-primary p-5 text-mono-md leading-relaxed text-text-primary outline-none transition-colors focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
                spellCheck={false}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-mono-sm text-text-tertiary">
                  {editContent.length} characters
                </span>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={handleCancel} className="gap-1.5 text-text-secondary hover:text-text-primary">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-1.5 bg-text-accent text-bg-primary hover:brightness-110">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Revision history sidebar (below on small screens) */}
            <div className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
              <h3 className="mb-4 text-heading-sm font-semibold text-text-primary">Recent Versions</h3>
              <div className="space-y-3">
                {revisions.slice(0, 3).map((rev, idx) => (
                  <div key={rev.id} className="flex items-center gap-3 rounded-lg bg-bg-primary p-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: rev.agentColor }} />
                    <div className="flex-1">
                      <p className="text-body-sm text-text-primary">{rev.changes}</p>
                      <p className="text-mono-sm text-text-tertiary">{rev.agent} · {timeAgo(rev.timestamp)}</p>
                    </div>
                    {idx === 0 && <span className="rounded-full bg-status-success/15 px-2 py-0.5 text-caption font-semibold text-status-success">Current</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={activeDoc.id}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6 lg:flex-row"
          >
            {/* Document viewer */}
            <div className="flex-1 min-w-0">
              <div className="rounded-xl border border-border-subtle bg-bg-secondary p-8 md:p-10">
                {/* Doc header */}
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-text-accent/10">
                      <ActiveDocIcon className="h-5 w-5 text-text-accent" />
                    </div>
                    <div>
                      <h2 className="text-heading-lg font-semibold text-text-primary">{activeDoc.title}</h2>
                      <p className="text-mono-sm text-text-tertiary">
                        Last updated {timeAgo(activeDoc.lastUpdated)} by {activeDoc.updatedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('rounded-full px-3 py-1 text-caption font-semibold', categoryBadgeColor(activeDoc.category))}>
                      {activeDoc.category}
                    </span>
                    <StatusDot status={activeDoc.status} />
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Rendered content */}
                <div className="max-w-3xl">
                  <RenderMarkdown content={activeDoc.content} />
                </div>
              </div>
            </div>

            {/* Mini revision sidebar */}
            <div className="w-full shrink-0 lg:w-72">
              <div className="rounded-xl border border-border-subtle bg-bg-secondary p-5">
                <h3 className="mb-4 text-heading-sm font-semibold text-text-primary">Recent Versions</h3>
                <div className="space-y-3">
                  {revisions.slice(0, 3).map((rev, idx) => (
                    <motion.div
                      key={rev.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="flex items-start gap-3 rounded-lg bg-bg-primary p-3"
                    >
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: rev.agentColor }} />
                      <div className="min-w-0">
                        <p className="text-body-sm text-text-primary truncate">{rev.changes}</p>
                        <p className="text-mono-sm text-text-tertiary">{rev.agent} · {timeAgo(rev.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button
                  onClick={() => setShowHistory(true)}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-subtle bg-transparent px-3 py-2 text-body-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                >
                  View Full History
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Quick actions */}
              <div className="mt-4 rounded-xl border border-border-subtle bg-bg-secondary p-5">
                <h3 className="mb-3 text-heading-sm font-semibold text-text-primary">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleEditStart}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                  >
                    <Edit3 className="h-4 w-4 text-text-accent" />
                    Edit Document
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
