"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Edit3,
  Mail,
  FileText,
  Lightbulb,
  Search,
  CheckSquare,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/dashboard/lib/utils';
import { listApprovals, decideApproval, updateApproval } from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';
import type { ApprovalItem, ApprovalType } from '@/dashboard/types';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];
const easeSpring = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

const typeConfig: Record<ApprovalType, { label: string; icon: typeof Mail; color: string; bgColor: string }> = {
  outreach: { label: 'Outreach', icon: Mail, color: '#34D399', bgColor: 'rgba(52,211,153,0.12)' },
  content: { label: 'Content', icon: FileText, color: '#FB7185', bgColor: 'rgba(251,113,133,0.12)' },
  product: { label: 'Product Idea', icon: Lightbulb, color: '#E879F9', bgColor: 'rgba(232,121,249,0.12)' },
};

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  blog: '#34D399',
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);
  if (diffH < 1) return 'Just now';
  if (diffH === 1) return '1h ago';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return '1d ago';
  return `${diffD}d ago`;
}

function getAgentInitials(agentName: string): string {
  return agentName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  Detail Drawer                                                      */
/* ------------------------------------------------------------------ */
function DetailDrawer({
  item,
  onClose,
  onDecided,
  onEdited,
}: {
  item: ApprovalItem;
  onClose: () => void;
  onDecided: () => void;
  onEdited: (item: ApprovalItem) => void;
}) {
  const config = typeConfig[item.type];
  const TypeIcon = config.icon;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.preview);

  const handleApprove = async () => {
    await decideApproval(item.id, 'approved', isEditing ? { preview: editText } : undefined);
    onDecided();
    onClose();
  };

  const handleReject = async () => {
    await decideApproval(item.id, 'rejected');
    onDecided();
    onClose();
  };

  const handleSaveEdits = async () => {
    const updated = await updateApproval(item.id, { preview: editText });
    setIsEditing(false);
    onEdited(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.25, ease: easeOut }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-[560px] flex-col border-l border-border-subtle bg-bg-secondary"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-semibold"
              style={{ backgroundColor: config.bgColor, color: config.color }}
            >
              <TypeIcon className="h-3.5 w-3.5" />
              {config.label}
            </span>
            <span className="text-caption text-text-tertiary">{timeAgo(item.createdAt)}</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <h2 className="text-heading-lg text-text-primary mb-4">{item.title}</h2>

            {/* Metadata Grid */}
            <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-border-subtle bg-bg-primary p-4">
              {item.metadata.leadSource && (
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Source</p>
                  <span className="rounded-full bg-bg-tertiary px-2.5 py-0.5 text-caption font-medium text-text-secondary">
                    {item.metadata.leadSource}
                  </span>
                </div>
              )}
              {item.metadata.fitScore !== undefined && (
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Fit Score</p>
                  <span className="text-mono-md font-semibold" style={{ color: '#38BDF8' }}>
                    {item.metadata.fitScore}%
                  </span>
                </div>
              )}
              {item.metadata.platform && (
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Platform</p>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-caption font-medium capitalize"
                    style={{
                      backgroundColor: `${platformColors[item.metadata.platform]}20`,
                      color: platformColors[item.metadata.platform],
                    }}
                  >
                    {item.metadata.platform}
                  </span>
                </div>
              )}
              {item.metadata.angle && (
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Angle</p>
                  <span className="text-body-sm text-text-secondary">{item.metadata.angle}</span>
                </div>
              )}
              {item.metadata.demandScore !== undefined && (
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Demand Score</p>
                  <span className="text-mono-md font-semibold" style={{ color: '#E879F9' }}>
                    {item.metadata.demandScore}/100
                  </span>
                </div>
              )}
              <div>
                <p className="text-caption text-text-tertiary mb-0.5">Created By</p>
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
                    style={{ backgroundColor: item.agentColor + '25', color: item.agentColor }}
                  >
                    {getAgentInitials(item.agent)}
                  </span>
                  <span className="text-body-sm text-text-secondary">{item.agent}</span>
                </div>
              </div>
            </div>

            {/* Agent Reasoning */}
            <div className="mb-5 rounded-xl border border-border-subtle bg-bg-tertiary p-4">
              <p className="text-caption text-text-tertiary mb-1.5 uppercase tracking-wider">Agent Reasoning</p>
              <p className="text-body-sm text-text-secondary leading-relaxed">{item.agentReasoning}</p>
            </div>

            {/* Content Preview / Edit */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-caption text-text-tertiary uppercase tracking-wider">
                  {isEditing ? 'Edit Content' : 'Content Preview'}
                </p>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-caption text-text-accent transition-colors hover:bg-bg-tertiary"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[200px] w-full rounded-lg border border-border-subtle bg-bg-quaternary p-4 text-body-md text-text-primary outline-none transition-all focus:border-text-accent focus:ring-2 focus:ring-text-accent/15 resize-none"
                />
              ) : (
                <div className="rounded-lg border border-border-subtle bg-bg-primary p-4">
                  <p className="text-body-md text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {item.preview}
                  </p>
                </div>
              )}
            </div>

            {/* Hashtags if content */}
            {item.metadata.hashtags && item.metadata.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.metadata.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bg-tertiary px-3 py-1 text-caption text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border-subtle px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[rgba(52,211,153,0.15)] px-4 py-2.5 text-body-sm font-semibold text-status-success transition-all hover:bg-[rgba(52,211,153,0.25)] active:scale-[0.98]"
            >
              <Check className="h-4 w-4" />
              Approve
            </button>
            {isEditing && (
              <button
                onClick={handleSaveEdits}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-4 py-2.5 text-body-sm font-semibold text-text-primary transition-all hover:bg-bg-quaternary active:scale-[0.98]"
              >
                <Check className="h-4 w-4" />
                Save Edits
              </button>
            )}
            <button
              onClick={handleReject}
              className="flex items-center justify-center gap-2 rounded-lg border border-[rgba(251,113,133,0.3)] bg-[rgba(251,113,133,0.1)] px-4 py-2.5 text-body-sm font-semibold text-status-danger transition-all hover:bg-[rgba(251,113,133,0.2)] active:scale-[0.98]"
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Approval Card                                                      */
/* ------------------------------------------------------------------ */
function ApprovalCard({
  item,
  onSelect,
  onAction,
}: {
  item: ApprovalItem;
  onSelect: () => void;
  onAction: (action: 'approved' | 'rejected') => void;
}) {
  const config = typeConfig[item.type];
  const TypeIcon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, scale: 0.96 }}
      transition={{ duration: 0.2, ease: easeOut }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-gradient-to-br from-[#111118] to-[#1A1A24] transition-all duration-150 hover:-translate-y-0.5 hover:border-border-medium hover:shadow-card"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <TypeIcon className="h-5 w-5" style={{ color: config.color }} />
          <span
            className="rounded-full px-2.5 py-0.5 text-caption font-semibold"
            style={{ backgroundColor: config.bgColor, color: config.color }}
          >
            {config.label}
          </span>
        </div>
        <span className="text-mono-sm text-text-tertiary">{timeAgo(item.createdAt)}</span>
      </div>

      {/* Card Body */}
      <button onClick={onSelect} className="flex-1 px-5 py-4 text-left">
        <h3 className="text-heading-sm text-text-primary mb-2 line-clamp-1">{item.title}</h3>

        {/* Type-specific metadata */}
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          {item.metadata.fitScore !== undefined && (
            <span className="text-mono-md font-semibold" style={{ color: '#38BDF8' }}>
              Fit: {item.metadata.fitScore}%
            </span>
          )}
          {item.metadata.demandScore !== undefined && (
            <span className="text-mono-md font-semibold" style={{ color: '#E879F9' }}>
              Demand: {item.metadata.demandScore}/100
            </span>
          )}
          {item.metadata.platform && (
            <span
              className="rounded-full px-2 py-0.5 text-caption font-medium capitalize"
              style={{
                backgroundColor: `${platformColors[item.metadata.platform]}20`,
                color: platformColors[item.metadata.platform],
              }}
            >
              {item.metadata.platform}
            </span>
          )}
          {item.metadata.leadSource && (
            <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-caption text-text-secondary">
              {item.metadata.leadSource}
            </span>
          )}
        </div>

        {/* Preview */}
        <p className="text-body-sm text-text-secondary mb-3 line-clamp-4 leading-relaxed">{item.preview}</p>

        {/* Signal note */}
        {item.metadata.signal && (
          <p className="text-caption text-text-tertiary italic line-clamp-1">Signal: {item.metadata.signal}</p>
        )}
        {item.metadata.marketSignal && (
          <p className="text-caption text-text-tertiary italic line-clamp-1">Signal: {item.metadata.marketSignal}</p>
        )}
        {item.metadata.hashtags && item.metadata.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.metadata.hashtags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-bg-tertiary px-2 py-0.5 text-[11px] text-text-tertiary">
                {tag}
              </span>
            ))}
            {item.metadata.hashtags.length > 3 && (
              <span className="text-[11px] text-text-tertiary">+{item.metadata.hashtags.length - 3}</span>
            )}
          </div>
        )}

        {/* Agent attribution */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
            style={{ backgroundColor: item.agentColor + '25', color: item.agentColor }}
          >
            {getAgentInitials(item.agent)}
          </span>
          <span className="text-caption text-text-tertiary">{item.agent}</span>
        </div>
      </button>

      {/* Card Footer */}
      <div className="flex items-center gap-2 border-t border-border-subtle px-5 py-3">
        <button
          onClick={(e) => { e.stopPropagation(); onAction('approved'); }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[rgba(52,211,153,0.12)] py-2 text-caption font-semibold text-status-success transition-all hover:bg-[rgba(52,211,153,0.22)] active:scale-[0.97]"
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-medium py-2 text-caption font-semibold text-text-secondary transition-all hover:bg-bg-tertiary hover:text-text-primary active:scale-[0.97]"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction('rejected'); }}
          className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-caption font-semibold text-text-tertiary transition-all hover:bg-[rgba(251,113,133,0.12)] hover:text-status-danger active:scale-[0.97]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */
function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-bg-tertiary"
      >
        <CheckSquare className="h-10 w-10 text-text-tertiary/30" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-heading-md text-text-primary mb-2"
      >
        All caught up!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-body-md text-text-tertiary mb-6 max-w-sm text-center"
      >
        No items awaiting approval. The swarm is working — check back soon.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={onRefresh}
        className="flex items-center gap-2 rounded-lg border border-border-medium px-4 py-2.5 text-body-sm font-medium text-text-secondary transition-all hover:bg-bg-tertiary hover:text-text-primary"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </motion.button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function Approvals() {
  const [activeTab, setActiveTab] = useState<'all' | ApprovalType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const { data: approvalItems, refetch } = useApiData(
    () => listApprovals({ status: 'pending_approval' }),
    []
  );

  const tabs: { key: 'all' | ApprovalType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'outreach', label: 'Outreach' },
    { key: 'content', label: 'Content' },
    { key: 'product', label: 'Products' },
  ];

  const filteredItems = useMemo(() => {
    let items = approvalItems ?? [];
    if (activeTab !== 'all') {
      items = items.filter((item) => item.type === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.preview.toLowerCase().includes(q) ||
          item.agent.toLowerCase().includes(q)
      );
    }
    return [...items].sort((a, b) =>
      sort === 'oldest'
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt)
    );
  }, [approvalItems, activeTab, searchQuery, sort]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, outreach: 0, content: 0, product: 0 };
    for (const item of approvalItems ?? []) {
      counts.all++;
      counts[item.type]++;
    }
    return counts;
  }, [approvalItems]);

  const handleAction = async (item: ApprovalItem, action: 'approved' | 'rejected') => {
    await decideApproval(item.id, action);
    refetch();
  };

  // Group items by type
  const groupedItems = useMemo(() => {
    if (activeTab !== 'all') return { [activeTab]: filteredItems };
    const groups: Record<string, ApprovalItem[]> = { outreach: [], content: [], product: [] };
    for (const item of filteredItems) {
      groups[item.type].push(item);
    }
    return groups;
  }, [filteredItems, activeTab]);

  const hasAnyItems = filteredItems.length > 0;

  return (
    <div className="min-h-[calc(100dvh-56px-48px)]">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: easeOut }}
        className="mb-6 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-display-lg text-text-primary mb-1">Approval Queue</h1>
          <div className="flex items-center gap-3">
            <p className="text-body-md text-text-secondary">
              {tabCounts.all} item{tabCounts.all !== 1 ? 's' : ''} awaiting your review
            </p>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.2, ease: easeSpring }}
              className="rounded-full bg-status-warning/15 px-2.5 py-0.5 text-caption font-semibold text-status-warning"
            >
              {tabCounts.all} pending
            </motion.span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search approvals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-border-subtle bg-bg-tertiary pl-9 pr-4 text-body-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>
          {/* Sort */}
          <button
            onClick={() => setSort((s) => (s === 'newest' ? 'oldest' : 'newest'))}
            className="flex items-center gap-2 rounded-lg border border-border-medium px-3 py-2 text-body-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            {sort === 'newest' ? 'Newest' : 'Oldest'}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-text-accent text-white'
                  : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              )}
            >
              {tab.key !== 'all' && (
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: typeConfig[tab.key].color }} />
              )}
              {tab.label}
              <span
                className={cn(
                  'ml-0.5 rounded-full px-1.5 py-0 text-[11px] font-semibold',
                  isActive ? 'bg-white/20 text-white' : 'bg-bg-tertiary text-text-tertiary'
                )}
              >
                {tabCounts[tab.key] ?? 0}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!hasAnyItems ? (
          <EmptyState onRefresh={refetch} />
        ) : (
          <motion.div
            key={activeTab + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'all' ? (
              // Grouped by type
              (['outreach', 'content', 'product'] as ApprovalType[]).map((type) => {
                const items = groupedItems[type] as ApprovalItem[];
                if (!items || items.length === 0) return null;
                const config = typeConfig[type];
                const TypeIcon = config.icon;
                return (
                  <div key={type} className="mb-8">
                    {/* Section Header */}
                    <div className="mb-3 flex items-center gap-2">
                      <TypeIcon className="h-4 w-4" style={{ color: config.color }} />
                      <h2 className="text-heading-sm text-text-primary">
                        {type === 'outreach' ? 'Outreach Drafts' : type === 'content' ? 'Content Posts' : 'Product Ideas'}
                      </h2>
                      <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-caption text-text-tertiary">
                        {items.length}
                      </span>
                    </div>
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                          <ApprovalCard
                            key={item.id}
                            item={item}
                            onSelect={() => setSelectedItem(item)}
                            onAction={(action) => handleAction(item, action)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })
            ) : (
              // Single type grid (no section headers)
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <ApprovalCard
                      key={item.id}
                      item={item}
                      onSelect={() => setSelectedItem(item)}
                      onAction={(action) => handleAction(item, action)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedItem && (
          <DetailDrawer
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onDecided={refetch}
            onEdited={(updated) => {
              setSelectedItem(updated);
              refetch();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
