"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  GripVertical,
  X,
  MoreHorizontal,
  TrendingUp,
  CheckCircle,
  Zap,
  Package,
  LayoutGrid,
  List,
  Filter,
  Edit3,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/dashboard/lib/utils';
import type { ProductIdea, PipelineStage } from '@/dashboard/types';
import { useApiData } from '@/dashboard/hooks/useApiData';
import {
  createProductIdea,
  listProductIdeas,
  moveProductIdea,
  updateProductIdea,
} from '@/dashboard/api/client';

// ==========================================
// Stage configuration
// ==========================================
const STAGES: { key: PipelineStage; label: string; color: string; borderColor: string; bgColor: string }[] = [
  { key: 'new', label: 'Proposed', color: '#38BDF8', borderColor: 'rgba(56,189,248,0.3)', bgColor: 'rgba(56,189,248,0.08)' },
  { key: 'approved', label: 'Validated', color: '#7C8CF0', borderColor: 'rgba(124,140,240,0.3)', bgColor: 'rgba(124,140,240,0.08)' },
  { key: 'in_progress', label: 'In Progress', color: '#F0A84F', borderColor: 'rgba(240,168,79,0.3)', bgColor: 'rgba(240,168,79,0.08)' },
  { key: 'shipped', label: 'Shipped', color: '#34D399', borderColor: 'rgba(52,211,153,0.3)', bgColor: 'rgba(52,211,153,0.08)' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Proposed', color: '#38BDF8', bg: 'rgba(56,189,248,0.15)' },
  approved: { label: 'Validated', color: '#7C8CF0', bg: 'rgba(124,140,240,0.15)' },
  in_progress: { label: 'In Progress', color: '#F0A84F', bg: 'rgba(240,168,79,0.15)' },
  shipped: { label: 'Shipped', color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
};

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

function getStageConfig(stage: PipelineStage) {
  return STAGES.find((s) => s.key === stage) || STAGES[0];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = parseISO(dateStr);
  const days = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

// ==========================================
// Score Bar Component
// ==========================================
function ScoreBar({ score, color, width = 50 }: { score: number; color: string; width?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-mono-sm font-semibold" style={{ color }}>{score}</span>
      <div className="h-1 rounded-full bg-bg-quaternary" style={{ width }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// ==========================================
// New Idea Modal
// ==========================================
interface NewIdeaInput {
  title: string;
  description: string;
  demandScore: number;
  feasibilityScore: number;
  targetAudience: string;
  stage: PipelineStage;
}

function NewIdeaModal({ onClose, onSave }: { onClose: () => void; onSave: (input: NewIdeaInput) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [demandScore, setDemandScore] = useState(50);
  const [feasibilityScore, setFeasibilityScore] = useState(50);
  const [niche, setNiche] = useState('');
  const [initialStage, setInitialStage] = useState<PipelineStage>('new');

  const handleSave = () => {
    onSave({
      title: title || 'Untitled Idea',
      description,
      demandScore,
      feasibilityScore,
      targetAudience: niche || 'General',
      stage: initialStage,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: easeOut }}
        className="w-full max-w-[560px] rounded-xl border border-border-subtle bg-bg-secondary p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-heading-lg text-text-primary">New Product Idea</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Idea Name</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your idea..."
              className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product idea..."
              rows={4}
              className="w-full resize-none rounded-lg border border-border-subtle bg-bg-quaternary p-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-caption text-text-secondary">Demand Score: {demandScore}</label>
              <input
                type="range" min={0} max={100} value={demandScore}
                onChange={(e) => setDemandScore(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-bg-quaternary"
                style={{ accentColor: '#E879F9' }}
              />
              <div className="mt-1 flex justify-between text-caption text-text-tertiary">
                <span>0</span><span>100</span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-caption text-text-secondary">Feasibility Score: {feasibilityScore}</label>
              <input
                type="range" min={0} max={100} value={feasibilityScore}
                onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-bg-quaternary"
                style={{ accentColor: '#38BDF8' }}
              />
              <div className="mt-1 flex justify-between text-caption text-text-tertiary">
                <span>0</span><span>100</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Target Niche</label>
            <input
              type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Firmware teams, IoT operators..."
              className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Initial Stage</label>
            <select
              value={initialStage} onChange={(e) => setInitialStage(e.target.value as PipelineStage)}
              className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            >
              <option value="new">Proposed</option>
              <option value="approved">Validated</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="h-10 rounded-lg px-4 text-body-md font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex h-10 items-center gap-2 rounded-lg bg-text-accent px-5 text-body-md font-semibold text-bg-primary hover:brightness-110"
          >
            <Lightbulb className="h-4 w-4" /> Create Idea
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Edit Idea Modal
// ==========================================
function EditIdeaModal({ idea, onClose, onSave }: { idea: ProductIdea; onClose: () => void; onSave: (patch: Partial<Omit<ProductIdea, 'id' | 'createdAt'>>) => void }) {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [demandScore, setDemandScore] = useState(idea.demandScore);
  const [feasibilityScore, setFeasibilityScore] = useState(idea.feasibilityScore);
  const [niche, setNiche] = useState(idea.targetAudience);
  const [tags, setTags] = useState(idea.tags.join(', '));

  const handleSave = () => {
    onSave({
      title: title || idea.title,
      description,
      demandScore,
      feasibilityScore,
      targetAudience: niche || 'General',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: easeOut }}
        className="w-full max-w-[560px] rounded-xl border border-border-subtle bg-bg-secondary p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-heading-lg text-text-primary">Edit Product Idea</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Idea Name</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your idea..."
              className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product idea..."
              rows={4}
              className="w-full resize-none rounded-lg border border-border-subtle bg-bg-quaternary p-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-caption text-text-secondary">Demand Score: {demandScore}</label>
              <input
                type="range" min={0} max={100} value={demandScore}
                onChange={(e) => setDemandScore(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-bg-quaternary"
                style={{ accentColor: '#E879F9' }}
              />
              <div className="mt-1 flex justify-between text-caption text-text-tertiary">
                <span>0</span><span>100</span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-caption text-text-secondary">Feasibility Score: {feasibilityScore}</label>
              <input
                type="range" min={0} max={100} value={feasibilityScore}
                onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-bg-quaternary"
                style={{ accentColor: '#38BDF8' }}
              />
              <div className="mt-1 flex justify-between text-caption text-text-tertiary">
                <span>0</span><span>100</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Target Niche</label>
            <input
              type="text" value={niche} onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Firmware teams, IoT operators..."
              className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Tags (comma-separated)</label>
            <input
              type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. ai, testing, embedded..."
              className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="h-10 rounded-lg px-4 text-body-md font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex h-10 items-center gap-2 rounded-lg bg-text-accent px-5 text-body-md font-semibold text-bg-primary hover:brightness-110"
          >
            <Edit3 className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Detail Drawer
// ==========================================
function DetailDrawer({ idea, onClose, onMove, onEdit }: { idea: ProductIdea; onClose: () => void; onMove: (id: string, stage: PipelineStage) => void; onEdit: () => void }) {
  const stageCfg = getStageConfig(idea.stage);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.25, ease: easeOut }}
        className="h-full w-full max-w-[540px] overflow-y-auto border-l border-border-subtle bg-bg-secondary shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-bg-secondary/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-heading-lg text-text-primary line-clamp-1">{idea.title}</h2>
            <ScoreBar score={idea.demandScore} color="#E879F9" width={60} />
          </div>
          <button onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Metadata */}
          <motion.div
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Stage</p>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-semibold"
                style={{ background: STATUS_CONFIG[idea.stage]?.bg || stageCfg.bgColor, color: stageCfg.color }}
              >
                {stageCfg.label}
              </span>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Created</p>
              <p className="text-mono-sm text-text-primary">{format(parseISO(idea.createdAt), 'MMM d, yyyy')}</p>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Demand Score</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-[100px] rounded-full bg-bg-quaternary">
                  <div className="h-full rounded-full" style={{ width: `${idea.demandScore}%`, background: '#E879F9' }} />
                </div>
                <span className="text-mono-sm font-semibold text-[#E879F9]">{idea.demandScore}/100</span>
              </div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Feasibility</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-[100px] rounded-full bg-bg-quaternary">
                  <div className="h-full rounded-full" style={{ width: `${idea.feasibilityScore}%`, background: '#38BDF8' }} />
                </div>
                <span className="text-mono-sm font-semibold text-status-info">{idea.feasibilityScore}/100</span>
              </div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Agent</p>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#E879F9' }} />
                <span className="text-body-sm text-text-primary">{idea.createdBy}</span>
              </div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Target Niche</p>
              <span className="text-body-sm text-text-primary">{idea.targetAudience}</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3 className="text-heading-sm text-text-primary mb-2">Description</h3>
            <p className="text-body-md text-text-primary leading-relaxed">{idea.description}</p>
          </motion.div>

          {/* Market Signals */}
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <h3 className="text-heading-sm text-text-primary mb-2">Market Signals</h3>
            <div className="rounded-lg bg-bg-tertiary p-4 space-y-2">
              {idea.signals.map((signal, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                  <p className="text-body-sm text-text-secondary">{signal}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3 className="text-heading-sm text-text-primary mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {idea.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-text-accent/15 px-3 py-1 text-caption font-medium text-text-accent">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stage transitions */}
        <div className="sticky bottom-0 border-t border-border-subtle bg-bg-secondary/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2">
            {STAGES.filter((s) => s.key !== idea.stage).map((s) => (
              <button
                key={s.key}
                onClick={() => { onMove(idea.id, s.key); onClose(); }}
                className="flex h-10 items-center gap-1.5 rounded-lg border px-3 text-body-sm font-medium text-text-primary hover:bg-bg-tertiary transition-all"
                style={{ borderColor: s.borderColor }}
              >
                <ArrowRight className="h-3.5 w-3.5" style={{ color: s.color }} />
                Move to {s.label}
              </button>
            ))}
            <button onClick={onEdit} className="ml-auto flex h-10 items-center gap-2 rounded-lg border border-border-medium px-4 text-body-md font-medium text-text-primary hover:bg-bg-tertiary">
              <Edit3 className="h-4 w-4" /> Edit
            </button>
            <button onClick={() => { onMove(idea.id, 'rejected'); onClose(); }} className="flex h-10 items-center gap-2 rounded-lg px-4 text-body-md font-medium text-status-danger hover:bg-status-danger/10">
              <Trash2 className="h-4 w-4" /> Archive
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Kanban Card
// ==========================================
function KanbanCard({ idea, index, onClick, onMore }: { idea: ProductIdea; index: number; onClick: () => void; onMore: () => void }) {
  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.04, duration: 0.15, ease: easeOut }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="rounded-xl border border-border-subtle bg-gradient-to-br from-[#111118] to-[#1A1A24] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-border-medium hover:shadow-card">
        {/* Top bar */}
        <div className="mb-2.5 flex items-center justify-between">
          <ScoreBar score={idea.demandScore} color="#E879F9" width={40} />
          <span className="text-mono-sm text-text-tertiary">{timeAgo(idea.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="text-heading-sm text-text-primary mb-1.5 group-hover:text-text-accent transition-colors">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="text-body-sm text-text-secondary line-clamp-3 mb-3">{idea.description}</p>

        {/* Target niche */}
        <div className="mb-3 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-text-tertiary" />
          <span className="text-caption text-text-tertiary">{idea.targetAudience}</span>
        </div>

        {/* Feasibility */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-caption text-text-tertiary">Feasibility</span>
          <div className="h-1.5 flex-1 rounded-full bg-bg-quaternary">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${idea.feasibilityScore}%`, background: idea.feasibilityScore >= 80 ? '#34D399' : idea.feasibilityScore >= 60 ? '#F0A84F' : '#FB7185' }}
            />
          </div>
          <span className="text-mono-sm text-text-secondary">{idea.feasibilityScore}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle pt-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: '#E879F9' }} />
            <span className="text-caption text-text-tertiary">{idea.createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <GripVertical className="h-4 w-4 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-50" />
            <button
              onClick={(e) => { e.stopPropagation(); onMore(); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// List View Row
// ==========================================
function ListRow({ idea, index, onClick }: { idea: ProductIdea; index: number; onClick: () => void }) {
  const stageCfg = getStageConfig(idea.stage);

  return (
    <motion.tr
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.03, duration: 0.12 }}
      onClick={onClick}
      className="cursor-pointer border-b border-border-subtle bg-bg-secondary transition-colors hover:bg-bg-tertiary"
    >
      <td className="px-4 py-3">
        <span className="text-body-md font-medium text-text-primary">{idea.title}</span>
      </td>
      <td className="px-4 py-3">
        <ScoreBar score={idea.demandScore} color="#E879F9" width={40} />
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex rounded-full px-2.5 py-0.5 text-caption font-semibold"
          style={{ background: stageCfg.bgColor, color: stageCfg.color }}
        >
          {stageCfg.label}
        </span>
      </td>
      <td className="px-4 py-3 max-w-[300px]">
        <p className="text-body-sm text-text-secondary truncate">{idea.description}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-caption text-text-tertiary truncate max-w-[150px]">{idea.signals[0]}</p>
      </td>
    </motion.tr>
  );
}

// ==========================================
// Main Products Page
// ==========================================
export default function Products() {
  const { data: ideasData, refetch } = useApiData(() => listProductIdeas(), []);
  const ideas = useMemo(() => ideasData ?? [], [ideasData]);
  const [selectedIdea, setSelectedIdea] = useState<ProductIdea | null>(null);
  const [editingIdea, setEditingIdea] = useState<ProductIdea | null>(null);
  const [showNewIdea, setShowNewIdea] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [nicheFilter, setNicheFilter] = useState<string>('all');
  const [minDemand, setMinDemand] = useState<number>(0);

  const allNiches = useMemo(() => {
    const niches = new Set(ideas.map((i) => i.targetAudience));
    return ['all', ...Array.from(niches)];
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      if (nicheFilter !== 'all' && idea.targetAudience !== nicheFilter) return false;
      if (idea.demandScore < minDemand) return false;
      return true;
    });
  }, [ideas, nicheFilter, minDemand]);

  const proposedCount = ideas.filter((i) => i.stage === 'new').length;
  const validatedCount = ideas.filter((i) => i.stage === 'approved').length;
  const inProgressCount = ideas.filter((i) => i.stage === 'in_progress').length;
  const shippedCount = ideas.filter((i) => i.stage === 'shipped').length;

  const totalIdeas = ideas.length;
  const avgDemand = totalIdeas === 0 ? 0 : Math.round(ideas.reduce((s, i) => s + i.demandScore, 0) / totalIdeas);
  const avgFeasibility = totalIdeas === 0 ? 0 : Math.round(ideas.reduce((s, i) => s + i.feasibilityScore, 0) / totalIdeas);

  const handleSaveNewIdea = async (input: NewIdeaInput) => {
    const created = await createProductIdea({
      title: input.title,
      description: input.description,
      demandScore: input.demandScore,
      feasibilityScore: input.feasibilityScore,
      targetAudience: input.targetAudience,
      tags: [],
      signals: ['Manually created'],
    });
    if (input.stage !== 'new') await moveProductIdea(created.id, input.stage);
    refetch();
  };

  const handleMove = async (id: string, stage: PipelineStage) => {
    await moveProductIdea(id, stage);
    refetch();
  };

  const handleSaveEdit = async (id: string, patch: Partial<Omit<ProductIdea, 'id' | 'createdAt'>>) => {
    await updateProductIdea(id, patch);
    refetch();
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25, ease: easeOut }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-display-lg text-text-primary">Product Ideas</h1>
          <p className="text-body-md text-text-secondary">{totalIdeas} ideas in pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border-subtle p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'rounded-md px-3 py-2 text-text-secondary transition-all',
                viewMode === 'kanban' ? 'bg-bg-tertiary text-text-primary' : 'hover:text-text-primary'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-md px-3 py-2 text-text-secondary transition-all',
                viewMode === 'list' ? 'bg-bg-tertiary text-text-primary' : 'hover:text-text-primary'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setShowNewIdea(true)}
            className="flex h-10 items-center gap-2 rounded-lg bg-text-accent px-5 text-body-md font-semibold text-bg-primary transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Lightbulb className="h-4 w-4" /> New Idea
          </button>
        </div>
      </motion.div>

      {/* Stats Pills */}
      <motion.div
        initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05, duration: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        {[
          { value: totalIdeas, label: 'Total Ideas', color: 'text-text-primary', icon: Lightbulb, borderColor: '#7C8CF0' },
          { value: avgDemand, label: 'Avg Demand Score', color: 'text-[#E879F9]', icon: TrendingUp, borderColor: '#E879F9' },
          { value: avgFeasibility, label: 'Avg Feasibility', color: 'text-status-info', icon: CheckCircle, borderColor: '#38BDF8' },
          { value: shippedCount, label: 'Shipped', color: 'text-status-success', icon: Package, borderColor: '#34D399' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.06, duration: 0.15, ease: easeOut }}
            className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-secondary pl-3 pr-4 py-2.5"
            style={{ borderLeft: `3px solid ${stat.borderColor}` }}
          >
            <stat.icon className={cn('h-4 w-4', stat.color)} />
            <div className="flex items-center gap-2">
              <span className={cn('text-mono-lg font-semibold', stat.color)}>{stat.value}</span>
              <span className="text-caption text-text-tertiary">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pipeline stage counts */}
      <motion.div
        initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        {STAGES.map((stage, idx) => (
          <motion.div
            key={stage.key}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 + idx * 0.06, duration: 0.15 }}
            className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2"
          >
            <span className="text-mono-lg font-semibold" style={{ color: stage.color }}>
              {stage.key === 'new' ? proposedCount : stage.key === 'approved' ? validatedCount : stage.key === 'in_progress' ? inProgressCount : shippedCount}
            </span>
            <span className="text-caption text-text-tertiary">{stage.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, duration: 0.2 }}
        className="flex flex-wrap items-center gap-3"
      >
        <Filter className="h-4 w-4 text-text-tertiary" />
        <div className="flex flex-wrap gap-2">
          {allNiches.map((niche) => (
            <button
              key={niche}
              onClick={() => setNicheFilter(niche)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-caption font-medium transition-all',
                nicheFilter === niche
                  ? 'border-text-accent bg-text-accent/15 text-text-accent'
                  : 'border-border-subtle text-text-tertiary hover:border-border-medium hover:text-text-primary'
              )}
            >
              {niche === 'all' ? 'All Niches' : niche}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-border-subtle" />
        <div className="flex items-center gap-2">
          <span className="text-caption text-text-tertiary">Min Demand:</span>
          <input
            type="range" min={0} max={100} value={minDemand}
            onChange={(e) => setMinDemand(Number(e.target.value))}
            className="h-2 w-24 cursor-pointer appearance-none rounded-full bg-bg-quaternary"
            style={{ accentColor: '#E879F9' }}
          />
          <span className="text-mono-sm text-text-secondary w-8">{minDemand}</span>
        </div>
        {(nicheFilter !== 'all' || minDemand > 0) && (
          <button
            onClick={() => { setNicheFilter('all'); setMinDemand(0); }}
            className="text-caption text-text-accent hover:underline"
          >
            Clear filters
          </button>
        )}
      </motion.div>

      {/* Kanban View */}
      <AnimatePresence mode="wait">
        {viewMode === 'kanban' ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex gap-5 overflow-x-auto pb-4"
          >
            {STAGES.map((stage, colIdx) => {
              const stageIdeas = filteredIdeas.filter((i) => i.stage === stage.key);
              return (
                <motion.div
                  key={stage.key}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: colIdx * 0.08, duration: 0.15, ease: easeOut }}
                  className="flex w-[320px] shrink-0 flex-col rounded-xl border border-border-subtle bg-bg-secondary"
                >
                  {/* Column header */}
                  <div className="sticky top-0 rounded-t-xl bg-bg-secondary px-4 pt-3 pb-2">
                    <div className="h-[3px] w-full rounded-full mb-3" style={{ background: stage.color }} />
                    <div className="flex items-center justify-between">
                      <h3 className="text-heading-sm" style={{ color: stage.color }}>{stage.label}</h3>
                      <span
                        className="flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-caption font-bold"
                        style={{ background: stage.bgColor, color: stage.color }}
                      >
                        {stageIdeas.length}
                      </span>
                    </div>
                  </div>

                  {/* Column body */}
                  <div className="flex-1 space-y-3 p-3 min-h-[200px]">
                    {stageIdeas.length === 0 && (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border-subtle">
                        <p className="text-caption text-text-tertiary">No ideas yet</p>
                      </div>
                    )}
                    {stageIdeas.map((idea, idx) => (
                      <KanbanCard
                        key={idea.id}
                        idea={idea}
                        index={idx}
                        onClick={() => setSelectedIdea(idea)}
                        onMore={() => setEditingIdea(idea)}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden rounded-xl border border-border-subtle"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-bg-tertiary">
                  <th className="px-4 py-3 text-left text-caption uppercase text-text-tertiary font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-caption uppercase text-text-tertiary font-medium w-[120px]">Demand</th>
                  <th className="px-4 py-3 text-left text-caption uppercase text-text-tertiary font-medium w-[120px]">Stage</th>
                  <th className="px-4 py-3 text-left text-caption uppercase text-text-tertiary font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-caption uppercase text-text-tertiary font-medium w-[180px]">Signal</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.map((idea, idx) => (
                  <ListRow
                    key={idea.id}
                    idea={idea}
                    index={idx}
                    onClick={() => setSelectedIdea(idea)}
                  />
                ))}
                {filteredIdeas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-body-md text-text-tertiary">
                      No ideas match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedIdea && (
          <DetailDrawer
            idea={selectedIdea}
            onClose={() => setSelectedIdea(null)}
            onMove={handleMove}
            onEdit={() => { setEditingIdea(selectedIdea); setSelectedIdea(null); }}
          />
        )}
      </AnimatePresence>

      {/* New Idea Modal */}
      <AnimatePresence>
        {showNewIdea && (
          <NewIdeaModal onClose={() => setShowNewIdea(false)} onSave={handleSaveNewIdea} />
        )}
      </AnimatePresence>

      {/* Edit Idea Modal */}
      <AnimatePresence>
        {editingIdea && (
          <EditIdeaModal
            idea={editingIdea}
            onClose={() => setEditingIdea(null)}
            onSave={(patch) => handleSaveEdit(editingIdea.id, patch)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
