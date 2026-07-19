"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import {
  Search,
  Plus,
  Download,
  RefreshCw,
  Mail,
  Edit3,
  MoreHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  Clock,
  Send,
} from 'lucide-react';
import { cn } from '@/dashboard/lib/utils';
import {
  listLeads,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
  createApproval,
  type CreateLeadInput,
} from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';
import type { Lead, LeadStatus } from '@/dashboard/types';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const sourceColors: Record<string, string> = {
  LinkedIn: '#0A66C2',
  ProductHunt: '#DA552F',
  GitHub: '#6B6B82',
  Twitter: '#1DA1F2',
  Conference: '#9B6BFF',
  Referral: '#34D399',
};

const statusConfig: Record<LeadStatus, { label: string; color: string; borderColor: string; bgColor: string }> = {
  new: { label: 'New', color: '#38BDF8', borderColor: 'rgba(56,189,248,0.4)', bgColor: 'rgba(56,189,248,0.08)' },
  contacted: { label: 'Contacted', color: '#F0A84F', borderColor: 'rgba(240,168,79,0.4)', bgColor: 'rgba(240,168,79,0.08)' },
  qualified: { label: 'Qualified', color: '#7C8CF0', borderColor: 'rgba(124,140,240,0.4)', bgColor: 'rgba(124,140,240,0.08)' },
  proposal: { label: 'Proposal', color: '#34D399', borderColor: 'rgba(52,211,153,0.4)', bgColor: 'rgba(52,211,153,0.15)' },
  negotiating: { label: 'Negotiating', color: '#E879F9', borderColor: 'rgba(232,121,249,0.4)', bgColor: 'rgba(232,121,249,0.08)' },
  closed_won: { label: 'Closed Won', color: '#34D399', borderColor: 'rgba(52,211,153,0.5)', bgColor: 'rgba(52,211,153,0.2)' },
  closed_lost: { label: 'Closed Lost', color: '#FB7185', borderColor: 'rgba(251,113,133,0.4)', bgColor: 'rgba(251,113,133,0.08)' },
};

/** Maps a status dropdown label ('Closed Won') to its LeadStatus ('closed_won'); 'All' → undefined. */
function labelToStatus(label: string): LeadStatus | undefined {
  if (label === 'All') return undefined;
  return label.toLowerCase().replace(/\s+/g, '_') as LeadStatus;
}

function fitScoreColor(score: number): string {
  if (score >= 90) return '#34D399';
  if (score >= 80) return '#7C8CF0';
  if (score >= 70) return '#F0A84F';
  return '#FB7185';
}

function getCompanyInitials(company: string): string {
  return company
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const inputClass =
  'h-9 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3 text-body-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15';

/* ------------------------------------------------------------------ */
/*  Stats Pills                                                        */
/* ------------------------------------------------------------------ */
function StatsPills({ data }: { data: Lead[] }) {
  const stats = useMemo(() => {
    const total = data.length;
    const contacted = data.filter((l) => l.status === 'contacted' || l.status === 'qualified' || l.status === 'proposal' || l.status === 'negotiating' || l.status === 'closed_won').length;
    const inOutreach = data.filter((l) => l.status === 'contacted' || l.status === 'qualified').length;
    const avgFit = Math.round(data.reduce((s, l) => s + l.fitScore, 0) / (total || 1));
    return { total, contacted, inOutreach, avgFit };
  }, [data]);

  const items = [
    { label: 'Total Leads', value: stats.total, color: '#38BDF8', icon: Users },
    { label: 'Contacted', value: stats.contacted, color: '#34D399', icon: Send },
    { label: 'In Outreach', value: stats.inOutreach, color: '#F0A84F', icon: Clock },
    { label: 'Avg. Fit Score', value: `${stats.avgFit}%`, color: '#7C8CF0', icon: TrendingUp },
  ];

  return (
    <div className="mb-5 flex flex-wrap gap-3">
      {items.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.1 }}
          className="flex min-w-[160px] items-center gap-3 rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3"
        >
          <s.icon className="h-5 w-5 shrink-0" style={{ color: s.color }} />
          <div>
            <p className="text-mono-lg font-semibold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-caption text-text-tertiary">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Draft Outreach Modal                                               */
/* ------------------------------------------------------------------ */
function DraftOutreachModal({
  lead,
  onClose,
}: {
  lead: Lead | null;
  onClose: () => void;
}) {
  const [template, setTemplate] = useState('Cold Outreach');
  const [tone, setTone] = useState('Professional');
  // `base` tracks which generated draft the editable text is derived from;
  // when template/tone changes the text re-syncs during render.
  const [draft, setDraft] = useState({ base: '', text: '' });
  const [sending, setSending] = useState(false);

  const templates = ['Cold Outreach', 'Follow-up', 'Value-first', 'Technical'];
  const tones = ['Professional', 'Casual', 'Engineer-to-Engineer'];

  const generatedDraft = useMemo(() => {
    if (!lead) return '';
    const drafts: Record<string, Record<string, string>> = {
      'Cold Outreach': {
        Professional: `Subject: ${lead.industry} innovation at ${lead.company}\n\nHi ${lead.contactName.split(' ')[0]},\n\nI came across ${lead.company} while researching leaders in the ${lead.industry} space. Your recent growth is impressive.\n\nWe help ${lead.industry.toLowerCase()} companies like yours automate outreach and content creation with AI agents — reducing manual work by 60-70%.\n\nWould you be open to a brief call next week to explore if there's a fit?\n\nBest regards,\nFieldCraft Digital`,
        Casual: `Hey ${lead.contactName.split(' ')[0]},\n\nSaw ${lead.company} on ${lead.source} — love what you're building in ${lead.industry}.\n\nWe've been helping similar teams automate their lead gen and content with AI agents. Pretty wild results so far.\n\nWanna chat briefly next week? No pitch, just curious if it could help.`,
        'Engineer-to-Engineer': `Subject: agent swarm for ${lead.company}'s firmware pipeline\n\nHi ${lead.contactName.split(' ')[0]},\n\nNoticed ${lead.company} is scaling fast — ${lead.signalNotes?.split('.')[0] || 'hiring signals detected'}. We've been there.\n\nBuilt an agent swarm that handles lead gen, content, and outreach autonomously. Cut our own ops overhead by ~60%. Thought it might resonate given your team's trajectory.\n\nHappy to share the architecture if you're curious.`,
      },
      'Follow-up': {
        Professional: `Subject: Following up — ${lead.company} + FieldCraft\n\nHi ${lead.contactName.split(' ')[0]},\n\nJust following up on my previous message about helping ${lead.company} with AI-powered outreach.\n\nI understand priorities shift. If now isn't the right time, no worries — happy to check back in a few weeks.\n\nBest,\nFieldCraft Digital`,
        Casual: `Hey ${lead.contactName.split(' ')[0]},\n\nQuick follow-up — know things get busy. Still think there could be a cool fit between ${lead.company} and what we're building.\n\nNo pressure at all. Let me know if you want to chat!`,
        'Engineer-to-Engineer': `Hey ${lead.contactName.split(' ')[0]},\n\nFollowing up on my note about our agent swarm. Know you're probably deep in build mode — we are too.\n\nIf you ever want to compare notes on scaling ${lead.industry.toLowerCase()} ops with agents, my DMs are open.`,
      },
      'Value-first': {
        Professional: `Subject: [Resource] ${lead.industry} outreach playbook\n\nHi ${lead.contactName.split(' ')[0]},\n\nI put together a playbook on how ${lead.industry} companies are using AI agents to 3x their outreach without adding headcount.\n\nNo strings attached — thought it might be useful given ${lead.company}'s growth trajectory.\n\nHappy to send it over.`,
        Casual: `Hey ${lead.contactName.split(' ')[0]},\n\nMade something I think you'd dig — a short guide on how teams like ${lead.company} are automating outreach with AI agents.\n\nFree resource, no pitch. Want me to send it?`,
        'Engineer-to-Engineer': `Hey ${lead.contactName.split(' ')[0]},\n\nWrote up how we built our agent swarm to handle lead gen + content. Includes architecture diagrams and lessons learned.\n\nThought it might be relevant for ${lead.company}'s scaling challenges. Happy to share.`,
      },
      Technical: {
        Professional: `Subject: Technical deep-dive: agent architecture for ${lead.industry}\n\nHi ${lead.contactName.split(' ')[0]},\n\nWe've developed a multi-agent orchestration system specifically for ${lead.industry.toLowerCase()} companies. Key capabilities:\n\n- Autonomous lead scoring across 12 data sources\n- Personalized outreach drafting with signal awareness\n- Content calendar optimization with engagement prediction\n\nWould a technical demo be of interest?`,
        Casual: `Hey ${lead.contactName.split(' ')[0]},\n\nWe've got this multi-agent system that scrapes 12+ sources, scores leads, and drafts outreach automatically. Pretty neat tech.\n\nWant to see a quick demo?`,
        'Engineer-to-Engineer': `Subject: our agent swarm architecture — 10 agents, 1 pipeline\n\nHi ${lead.contactName.split(' ')[0]},\n\nBuilt a swarm of 10 specialized agents that handle everything from lead discovery to content publishing. Uses orchestrated LLM pipelines with feedback loops.\n\nCurious how it might fit ${lead.company}'s workflow. Happy to walk through the architecture.`,
      },
    };
    return drafts[template]?.[tone] || '';
  }, [lead, template, tone]);

  // Keep the editable textarea in sync whenever the generated draft changes.
  if (draft.base !== generatedDraft) {
    setDraft({ base: generatedDraft, text: generatedDraft });
  }

  const handleSendToApproval = async () => {
    if (!lead) return;
    setSending(true);
    try {
      await createApproval({
        type: 'outreach',
        title: lead.company,
        preview: draft.text,
        metadata: {
          leadName: lead.company,
          leadSource: lead.source,
          fitScore: lead.fitScore,
          signal: lead.signalNotes,
        },
      });
      onClose();
    } finally {
      setSending(false);
    }
  };

  const handleRegenerate = () => {
    const idx = tones.indexOf(tone);
    setTone(tones[(idx + 1) % tones.length]);
  };

  if (!lead) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: easeOut }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 flex w-full max-w-[640px] flex-col rounded-xl border border-border-subtle bg-bg-secondary shadow-modal max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div>
            <h3 className="text-heading-lg text-text-primary">Draft Outreach</h3>
            <p className="text-body-sm text-text-secondary mt-0.5">to {lead.contactName} at {lead.company}</p>
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
          {/* Template selector */}
          <div className="mb-4">
            <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Template</label>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-body-sm font-medium transition-all',
                    template === t
                      ? 'bg-text-accent text-white'
                      : 'border border-border-subtle text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tone selector */}
          <div className="mb-4">
            <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-body-sm font-medium transition-all',
                    tone === t
                      ? 'bg-text-accent text-white'
                      : 'border border-border-subtle text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Generated draft */}
          <div>
            <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Generated Draft</label>
            <textarea
              value={draft.text}
              onChange={(e) => setDraft({ base: generatedDraft, text: e.target.value })}
              className="min-h-[200px] w-full rounded-lg border border-border-subtle bg-bg-quaternary p-4 text-body-md text-text-primary outline-none transition-all focus:border-text-accent focus:ring-2 focus:ring-text-accent/15 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-border-subtle px-6 py-4">
          <button
            onClick={handleSendToApproval}
            disabled={sending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-text-accent px-4 py-2.5 text-body-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Send to Approval
          </button>
          <button
            onClick={handleRegenerate}
            className="flex items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-4 py-2.5 text-body-sm font-medium text-text-secondary transition-all hover:bg-bg-quaternary hover:text-text-primary active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-body-sm font-medium text-text-tertiary transition-colors hover:text-text-primary"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Lead Modal                                                     */
/* ------------------------------------------------------------------ */
function AddLeadModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: CreateLeadInput) => Promise<void>;
}) {
  const [form, setForm] = useState({
    company: '',
    contactName: '',
    email: '',
    source: 'LinkedIn',
    fitScore: '70',
    industry: '',
    companySize: '',
    title: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async () => {
    setSaving(true);
    try {
      await onCreate({
        company: form.company,
        contactName: form.contactName,
        email: form.email,
        source: form.source,
        fitScore: Number(form.fitScore) || 0,
        status: 'new',
        industry: form.industry,
        companySize: form.companySize,
        notes: form.notes,
        ...(form.title ? { title: form.title } : {}),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: easeOut }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 flex w-full max-w-[640px] flex-col rounded-xl border border-border-subtle bg-bg-secondary shadow-modal max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div>
            <h3 className="text-heading-lg text-text-primary">Add Lead</h3>
            <p className="text-body-sm text-text-secondary mt-0.5">Manually add a lead to the board</p>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Company</label>
              <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Corp" className={inputClass} />
            </div>
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Contact Name</label>
              <input type="text" value={form.contactName} onChange={set('contactName')} placeholder="Jane Doe" className={inputClass} />
            </div>
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Email</label>
              <input type="text" value={form.email} onChange={set('email')} placeholder="jane@acme.com" className={inputClass} />
            </div>
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Title (optional)</label>
              <input type="text" value={form.title} onChange={set('title')} placeholder="VP Engineering" className={inputClass} />
            </div>
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Source</label>
              <select value={form.source} onChange={set('source')} className={inputClass}>
                {Object.keys(sourceColors).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Fit Score</label>
              <input type="number" min={0} max={100} value={form.fitScore} onChange={set('fitScore')} className={inputClass} />
            </div>
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Industry</label>
              <input type="text" value={form.industry} onChange={set('industry')} placeholder="Robotics" className={inputClass} />
            </div>
            <div>
              <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Company Size</label>
              <input type="text" value={form.companySize} onChange={set('companySize')} placeholder="50-200" className={inputClass} />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Notes</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              placeholder="Why is this lead interesting?"
              className="min-h-[100px] w-full rounded-lg border border-border-subtle bg-bg-quaternary p-4 text-body-md text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-border-subtle px-6 py-4">
          <button
            onClick={handleCreate}
            disabled={saving || !form.company.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-text-accent px-4 py-2.5 text-body-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-body-sm font-medium text-text-tertiary transition-colors hover:text-text-primary"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lead Detail Drawer                                                 */
/* ------------------------------------------------------------------ */
function LeadDetailDrawer({
  lead,
  onClose,
  onDraftOutreach,
  onSave,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onDraftOutreach: (lead: Lead) => void;
  onSave: (id: string, patch: Partial<Omit<Lead, 'id' | 'createdAt'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const status = statusConfig[lead.status];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    company: '',
    contactName: '',
    email: '',
    status: 'new' as LeadStatus,
    notes: '',
  });

  const startEdit = () => {
    setForm({
      company: lead.company,
      contactName: lead.contactName,
      email: lead.email,
      status: lead.status,
      notes: lead.notes,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(lead.id, { ...form });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(lead.id);
    } finally {
      setDeleting(false);
    }
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.25, ease: easeOut }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-[420px] flex-col border-l border-border-subtle bg-bg-secondary"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h3 className="text-heading-lg text-text-primary line-clamp-1">{lead.company}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {editing ? (
            /* Edit Form */
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 rounded-xl border border-border-subtle bg-bg-primary p-4"
            >
              <div>
                <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Company</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Contact Name</label>
                <input type="text" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Email</label>
                <input type="text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })} className={inputClass}>
                  {(Object.keys(statusConfig) as LeadStatus[]).map((s) => (
                    <option key={s} value={s}>{statusConfig[s].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-caption text-text-tertiary mb-1.5 block uppercase tracking-wider">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="min-h-[100px] w-full rounded-lg border border-border-subtle bg-bg-quaternary p-4 text-body-md text-text-primary outline-none transition-all focus:border-text-accent focus:ring-2 focus:ring-text-accent/15 resize-none"
                />
              </div>
            </motion.div>
          ) : (
            <>
              {/* Info Grid */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-border-subtle bg-bg-primary p-4"
              >
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Source</p>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-caption font-medium"
                    style={{
                      backgroundColor: `${sourceColors[lead.source] || '#6B6B82'}20`,
                      color: sourceColors[lead.source] || '#6B6B82',
                    }}
                  >
                    {lead.source}
                  </span>
                </div>
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Fit Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-mono-md font-semibold" style={{ color: fitScoreColor(lead.fitScore) }}>
                      {lead.fitScore}%
                    </span>
                    <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-bg-quaternary">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${lead.fitScore}%`, backgroundColor: fitScoreColor(lead.fitScore) }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Status</p>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-caption font-medium"
                    style={{
                      backgroundColor: status.bgColor,
                      color: status.color,
                      border: `1px solid ${status.borderColor}`,
                    }}
                  >
                    {status.label}
                  </span>
                </div>
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Contact</p>
                  <p className="text-body-sm text-text-secondary">{lead.contactName}</p>
                  {lead.title && <p className="text-caption text-text-tertiary">{lead.title}</p>}
                </div>
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Discovered</p>
                  <p className="text-mono-sm text-text-secondary">{formatDate(lead.createdAt)}</p>
                </div>
                <div>
                  <p className="text-caption text-text-tertiary mb-0.5">Industry</p>
                  <p className="text-body-sm text-text-secondary">{lead.industry}</p>
                </div>
              </motion.div>

              {/* Signal Notes */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-5 rounded-xl border border-border-subtle bg-bg-tertiary p-4"
              >
                <p className="text-caption text-text-tertiary mb-1.5 uppercase tracking-wider">Signal Notes</p>
                <p className="text-body-md text-text-secondary leading-relaxed">{lead.signalNotes || lead.notes}</p>
              </motion.div>

              {/* Outreach History */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <p className="text-caption text-text-tertiary mb-3 uppercase tracking-wider">Outreach History</p>
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border-subtle" />
                  {[
                    { label: 'Lead discovered', date: formatDate(lead.createdAt), status: 'completed' },
                    ...(lead.status !== 'new'
                      ? [{ label: 'Initial outreach sent', date: formatDate(lead.updatedAt), status: 'sent' }]
                      : []),
                    ...(lead.status === 'proposal' || lead.status === 'negotiating' || lead.status === 'closed_won'
                      ? [{ label: 'Follow-up #1', date: 'Pending', status: 'pending' }]
                      : []),
                  ].map((event, i) => (
                    <div key={i} className="relative mb-4 pl-4">
                      <span
                        className={cn(
                          'absolute -left-[3px] top-1.5 h-2 w-2 rounded-full',
                          event.status === 'completed' && 'bg-status-success',
                          event.status === 'sent' && 'bg-status-info',
                          event.status === 'pending' && 'bg-status-warning',
                        )}
                      />
                      <p className="text-body-sm text-text-primary">{event.label}</p>
                      <p className="text-mono-sm text-text-tertiary">{event.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border-subtle px-5 py-4 space-y-2">
          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !form.company.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-text-accent py-2.5 text-body-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary py-2.5 text-body-sm font-medium text-text-secondary transition-all hover:bg-bg-quaternary hover:text-text-primary active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onDraftOutreach(lead)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-text-accent py-2.5 text-body-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <Mail className="h-4 w-4" />
                Draft Outreach
              </button>
              <div className="flex gap-2">
                <button
                  onClick={startEdit}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary py-2.5 text-body-sm font-medium text-text-secondary transition-all hover:bg-bg-quaternary hover:text-text-primary active:scale-[0.98]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Lead
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[rgba(251,113,133,0.2)] bg-[rgba(251,113,133,0.08)] py-2.5 text-body-sm font-medium text-status-danger transition-all hover:bg-[rgba(251,113,133,0.15)] active:scale-[0.98] disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
const columnHelper = createColumnHelper<Lead>();

const PAGE_SIZE = 10;

export default function Leads() {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'fitScore', desc: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [draftLead, setDraftLead] = useState<Lead | null>(null);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusMenuLeadId, setStatusMenuLeadId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const mappedStatus = useMemo(() => labelToStatus(statusFilter), [statusFilter]);

  // Filtered query feeding the table.
  const { data: tableLeads, refetch: refetchTable } = useApiData(
    () => listLeads({ search: searchQuery, source: sourceFilter, status: mappedStatus }),
    [searchQuery, sourceFilter, statusFilter]
  );
  // Unfiltered query feeding the stats pills + header counts.
  const { data: allLeads, refetch: refetchAll } = useApiData(() => listLeads(), []);

  const allLeadsSafe = useMemo(() => allLeads ?? [], [allLeads]);
  const filteredData = tableLeads ?? [];

  const refetchBoth = () => {
    refetchTable();
    refetchAll();
  };

  const allSources = useMemo(() => {
    const s = new Set(allLeadsSafe.map((l) => l.source));
    return ['All', ...Array.from(s)];
  }, [allLeadsSafe]);

  const allStatuses = useMemo(() => ['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiating', 'Closed Won', 'Closed Lost'], []);

  const handleSaveLead = async (id: string, patch: Partial<Omit<Lead, 'id' | 'createdAt'>>) => {
    const updated = await updateLead(id, patch);
    refetchBoth();
    setSelectedLead(updated);
  };

  const handleDeleteLead = async (id: string) => {
    await deleteLead(id);
    refetchBoth();
    setSelectedLead(null);
  };

  const handleCreateLead = async (input: CreateLeadInput) => {
    await createLead(input);
    refetchBoth();
  };

  const handleRowStatusChange = useCallback(async (lead: Lead, label: string) => {
    setStatusMenuLeadId(null);
    const status = labelToStatus(label);
    if (!status || status === lead.status) return;
    await updateLead(lead.id, { status });
    refetchTable();
    refetchAll();
  }, [refetchTable, refetchAll]);

  const handleExportCsv = async () => {
    const csv = await exportLeadsCsv({ search: searchQuery, source: sourceFilter, status: mappedStatus });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('company', {
        header: 'Lead',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-tertiary">
                <span className="text-mono-sm font-semibold text-text-secondary">
                  {getCompanyInitials(lead.company)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-body-md font-semibold text-text-primary truncate">{lead.company}</p>
                <p className="text-body-sm text-text-secondary truncate">
                  {lead.contactName}
                  {lead.title ? `, ${lead.title}` : ''}
                </p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('source', {
        header: 'Source',
        cell: ({ getValue }) => {
          const source = getValue();
          return (
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-caption font-medium"
              style={{
                backgroundColor: `${sourceColors[source] || '#6B6B82'}20`,
                color: sourceColors[source] || '#6B6B82',
              }}
            >
              {source}
            </span>
          );
        },
      }),
      columnHelper.accessor('fitScore', {
        header: 'Fit Score',
        cell: ({ getValue }) => {
          const score = getValue();
          const color = fitScoreColor(score);
          return (
            <div className="flex items-center gap-2.5">
              <span className="text-mono-md font-semibold tabular-nums" style={{ color }}>
                {score}%
              </span>
              <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-bg-quaternary">
                <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => {
          const s = getValue() as LeadStatus;
          const cfg = statusConfig[s];
          return (
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-caption font-medium"
              style={{
                backgroundColor: cfg.bgColor,
                color: cfg.color,
                border: `1px solid ${cfg.borderColor}`,
              }}
            >
              {cfg.label}
            </span>
          );
        },
      }),
      columnHelper.accessor('signalNotes', {
        header: 'Signal Notes',
        cell: ({ getValue, row }) => {
          const notes = getValue() || row.original.notes;
          return <p className="text-body-sm text-text-secondary line-clamp-2 max-w-[260px]" title={notes}>{notes}</p>;
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setDraftLead(lead); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-accent"
                title="Draft outreach"
              >
                <Mail className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                title="Edit lead"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setStatusMenuLeadId(statusMenuLeadId === lead.id ? null : lead.id); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {statusMenuLeadId === lead.id && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border-subtle bg-bg-quaternary py-1 shadow-card">
                    {allStatuses.filter((s) => s !== 'All').map((label) => (
                      <button
                        key={label}
                        onClick={(e) => { e.stopPropagation(); void handleRowStatusChange(lead, label); }}
                        className={cn(
                          'flex w-full items-center px-3 py-2 text-left text-body-sm transition-colors hover:bg-bg-tertiary',
                          labelToStatus(label) === lead.status ? 'text-text-accent' : 'text-text-secondary'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        },
      }),
    ],
    [statusMenuLeadId, allStatuses, handleRowStatusChange]
  );

  // TanStack Table's useReactTable returns un-memoizable functions by design;
  // the React Compiler simply skips memoizing this component, so this is a
  // known false positive for this library.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Client-side pagination over the sorted/filtered rows.
  useEffect(() => {
    setPage(0);
  }, [searchQuery, sourceFilter, statusFilter]);

  const allRows = table.getRowModel().rows;
  const pageCount = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = allRows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const showingFrom = allRows.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const showingTo = Math.min(allRows.length, (safePage + 1) * PAGE_SIZE);

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
          <h1 className="text-display-lg text-text-primary mb-1">Leads Board</h1>
          <p className="text-body-md text-text-secondary">
            {allLeadsSafe.length} leads tracked — {allLeadsSafe.filter((l) => l.status === 'new').length} new this week
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={() => setAddLeadOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-text-accent px-4 py-2.5 text-body-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
          <button
            onClick={() => void handleExportCsv()}
            className="flex items-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-4 py-2.5 text-body-sm font-medium text-text-secondary transition-all hover:bg-bg-quaternary hover:text-text-primary active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={refetchBoth}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-medium text-text-tertiary transition-all hover:bg-bg-tertiary hover:text-text-primary active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>

      {/* Stats Pills */}
      <StatsPills data={allLeadsSafe} />

      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search leads by name, company, or signal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border-subtle bg-bg-quaternary pl-9 pr-4 text-body-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
          />
        </div>

        {/* Source Filter */}
        <div className="relative">
          <button
            onClick={() => { setSourceDropdownOpen(!sourceDropdownOpen); setStatusDropdownOpen(false); }}
            className="flex h-9 items-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-3 text-body-sm text-text-secondary transition-colors hover:bg-bg-quaternary hover:text-text-primary"
          >
            {sourceFilter === 'All' ? 'All Sources' : sourceFilter}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence>
            {sourceDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.15 }}
                style={{ originY: 0 }}
                className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border-subtle bg-bg-quaternary py-1 shadow-card"
              >
                {allSources.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSourceFilter(s); setSourceDropdownOpen(false); }}
                    className={cn(
                      'flex w-full items-center px-3 py-2 text-left text-body-sm transition-colors hover:bg-bg-tertiary',
                      sourceFilter === s ? 'text-text-accent' : 'text-text-secondary'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setSourceDropdownOpen(false); }}
            className="flex h-9 items-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-3 text-body-sm text-text-secondary transition-colors hover:bg-bg-quaternary hover:text-text-primary"
          >
            {statusFilter === 'All' ? 'All Statuses' : statusFilter}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence>
            {statusDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.15 }}
                style={{ originY: 0 }}
                className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border-subtle bg-bg-quaternary py-1 shadow-card"
              >
                {allStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setStatusDropdownOpen(false); }}
                    className={cn(
                      'flex w-full items-center px-3 py-2 text-left text-body-sm transition-colors hover:bg-bg-tertiary',
                      statusFilter === s ? 'text-text-accent' : 'text-text-secondary'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.2 }}
        className="overflow-hidden rounded-xl border border-border-subtle"
        onClick={() => { setSourceDropdownOpen(false); setStatusDropdownOpen(false); setStatusMenuLeadId(null); }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border-subtle bg-bg-tertiary">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        'px-4 py-3 text-left text-caption font-semibold uppercase tracking-wider text-text-tertiary',
                        header.column.getCanSort() && 'cursor-pointer select-none transition-colors hover:text-text-primary'
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <ChevronUp className="h-3 w-3" />}
                        {header.column.getIsSorted() === 'desc' && <ChevronDown className="h-3 w-3" />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody>
              <AnimatePresence>
                {pageRows.map((row, i) => {
                  const lead = row.original;
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.025, duration: 0.08 }}
                      onClick={() => setSelectedLead(lead)}
                      className="cursor-pointer border-b border-border-subtle bg-bg-secondary transition-colors duration-100 hover:bg-bg-tertiary"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        <div className="flex items-center justify-between border-t border-border-subtle bg-bg-tertiary px-4 py-2.5">
          <p className="text-caption text-text-tertiary">
            Showing {showingFrom}–{showingTo} of {allRows.length} leads
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 0}
              className="rounded-md px-2 py-1 text-caption text-text-tertiary transition-colors hover:bg-bg-quaternary hover:text-text-primary disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(safePage + 1)}
              disabled={safePage >= pageCount - 1}
              className="rounded-md px-2 py-1 text-caption text-text-tertiary transition-colors hover:bg-bg-quaternary hover:text-text-primary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailDrawer
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onDraftOutreach={(lead) => { setSelectedLead(null); setDraftLead(lead); }}
            onSave={handleSaveLead}
            onDelete={handleDeleteLead}
          />
        )}
      </AnimatePresence>

      {/* Draft Outreach Modal */}
      <AnimatePresence>
        {draftLead && (
          <DraftOutreachModal lead={draftLead} onClose={() => setDraftLead(null)} />
        )}
      </AnimatePresence>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {addLeadOpen && (
          <AddLeadModal onClose={() => setAddLeadOpen(false)} onCreate={handleCreateLead} />
        )}
      </AnimatePresence>
    </div>
  );
}
