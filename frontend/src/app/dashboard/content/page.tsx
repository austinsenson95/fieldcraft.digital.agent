"use client";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  X,
  Instagram,
  Linkedin,
  FileText,
  Clock,
  CheckCircle,
  Send,
  Edit3,
  Trash2,
  Filter,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { cn } from '@/dashboard/lib/utils';
import {
  listContent,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
  type CreatePostInput,
} from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';
import type { ContentCalendar, PipelineStage } from '@/dashboard/types';

// ==========================================
// Helpers
// ==========================================
type ViewMode = 'week' | 'month';
type PlatformFilter = 'all' | 'instagram' | 'linkedin' | 'twitter' | 'blog';
type AngleTag = 'engineer-mystic' | 'technical-deep-dive' | 'behind-the-build' | 'thought-leadership' | 'case-study';

const ANGLE_TAGS: Record<string, AngleTag> = {
  'Copywriting': 'engineer-mystic',
  'Content Strategy': 'thought-leadership',
  'Social Publishing': 'behind-the-build',
  'Brand Memory': 'engineer-mystic',
};

function getAngleTag(item: ContentCalendar): AngleTag {
  return ANGLE_TAGS[item.createdBy] || 'technical-deep-dive';
}

function getAngleColor(angle: AngleTag): string {
  const colors: Record<AngleTag, string> = {
    'engineer-mystic': '#A78BFA',
    'technical-deep-dive': '#38BDF8',
    'behind-the-build': '#34D399',
    'thought-leadership': '#FB7185',
    'case-study': '#F0A84F',
  };
  return colors[angle] || '#9B9BB0';
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  blog: '#34D399',
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  blog: 'Blog',
};

const STATUS_CONFIG: Record<PipelineStage, { label: string; color: string; bg: string; border: string }> = {
  new: { label: 'New', color: '#6B6B82', bg: 'rgba(107,107,130,0.15)', border: '#6B6B82' },
  in_progress: { label: 'Drafting', color: '#F0A84F', bg: 'rgba(240,168,79,0.15)', border: '#F0A84F' },
  pending_approval: { label: 'Pending', color: '#F0A84F', bg: 'rgba(240,168,79,0.15)', border: '#F0A84F' },
  approved: { label: 'Approved', color: '#38BDF8', bg: 'rgba(56,189,248,0.15)', border: '#38BDF8' },
  published: { label: 'Published', color: '#34D399', bg: 'rgba(52,211,153,0.15)', border: '#34D399' },
  shipped: { label: 'Shipped', color: '#34D399', bg: 'rgba(52,211,153,0.15)', border: '#34D399' },
  rejected: { label: 'Rejected', color: '#FB7185', bg: 'rgba(251,113,133,0.15)', border: '#FB7185' },
};

function PlatformIcon({ platform, className, style }: { platform: string; className?: string; style?: React.CSSProperties }) {
  if (platform === 'instagram') return <Instagram className={className} style={style} />;
  if (platform === 'linkedin') return <Linkedin className={className} style={style} />;
  if (platform === 'twitter') return <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  return <FileText className={className} style={style} />;
}

function formatTimeSlot(dateStr: string): string {
  return format(parseISO(dateStr), 'h:mm a');
}

function getItemsForDay(items: ContentCalendar[], day: Date): ContentCalendar[] {
  return items.filter((item) => isSameDay(parseISO(item.scheduledDate), day));
}

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

// ==========================================
// New Post Modal
// ==========================================
function NewPostModal({ onClose, onSave }: { onClose: () => void; onSave: (input: CreatePostInput, status: PipelineStage) => void }) {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'linkedin' | 'twitter' | 'blog'>('linkedin');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('09:00');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');

  const handleAddHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
  };

  const handleSave = (status: PipelineStage) => {
    onSave(
      {
        title: title || 'Untitled Post',
        platform,
        scheduledDate: new Date(`${date}T${time}:00`).toISOString(),
        draftContent: content,
        hashtags,
      },
      status
    );
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
        className="w-full max-w-[600px] rounded-xl border border-border-subtle bg-bg-secondary p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-heading-lg text-text-primary">New Post</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Title</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {(['instagram', 'linkedin', 'twitter', 'blog'] as const).map((p) => (
                <button
                  key={p} onClick={() => setPlatform(p)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all',
                    platform === p
                      ? 'border-text-accent bg-text-accent/10 text-text-accent'
                      : 'border-border-subtle bg-bg-tertiary text-text-secondary hover:border-border-medium hover:text-text-primary'
                  )}
                >
                  <PlatformIcon platform={p} className="h-5 w-5" />
                  <span className="text-caption capitalize">{p}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Content</label>
            <textarea
              value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post..."
              rows={4}
              className="w-full resize-none rounded-lg border border-border-subtle bg-bg-quaternary p-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
            <p className="mt-1 text-right text-caption text-text-tertiary">{content.length} chars</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-caption text-text-secondary">Date</label>
              <input
                type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-caption text-text-secondary">Time</label>
              <input
                type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="h-10 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-caption text-text-secondary">Hashtags</label>
            <div className="flex gap-2">
              <input
                type="text" value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
                placeholder="Type and press Enter..."
                className="h-10 flex-1 rounded-lg border border-border-subtle bg-bg-quaternary px-3.5 text-body-md text-text-primary outline-none placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
              />
              <button onClick={handleAddHashtag} className="h-10 rounded-lg bg-text-accent px-4 text-caption font-semibold text-bg-primary hover:brightness-110">
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hashtags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-text-accent/15 px-2.5 py-1 text-caption text-text-accent">
                  {tag}
                  <button onClick={() => setHashtags(hashtags.filter((t) => t !== tag))} className="hover:text-status-danger">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="h-10 rounded-lg px-4 text-body-md font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary">
            Cancel
          </button>
          <button onClick={() => handleSave('in_progress')} className="h-10 rounded-lg border border-border-medium px-4 text-body-md font-medium text-text-primary hover:bg-bg-tertiary">
            Save as Draft
          </button>
          <button onClick={() => handleSave('pending_approval')} className="h-10 rounded-lg bg-text-accent px-5 text-body-md font-semibold text-bg-primary hover:brightness-110">
            Submit for Approval
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Detail Drawer
// ==========================================
function DetailDrawer({ item, onClose, onChanged }: { item: ContentCalendar; onClose: () => void; onChanged: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.draftContent);
  const platformColor = PLATFORM_COLORS[item.platform] || '#9B9BB0';
  const statusCfg = STATUS_CONFIG[item.status];
  const angle = getAngleTag(item);
  const angleColor = getAngleColor(angle);

  const handleSaveEdit = async () => {
    await updatePost(item.id, { title: editTitle, draftContent: editContent });
    onChanged();
    setIsEditing(false);
  };

  const handleApprove = async () => {
    await updatePostStatus(item.id, 'approved');
    onChanged();
  };

  const handlePublish = async () => {
    await updatePostStatus(item.id, 'published');
    onChanged();
  };

  const handleDelete = async () => {
    await deletePost(item.id);
    onChanged();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.25, ease: easeOut }}
        className="h-full w-full max-w-[520px] overflow-y-auto border-l border-border-subtle bg-bg-secondary shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-bg-secondary/95 px-6 py-4 backdrop-blur-sm">
          {isEditing ? (
            <input
              type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
              className="h-9 w-full rounded-lg border border-border-subtle bg-bg-quaternary px-3 text-heading-lg text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          ) : (
            <h2 className="text-heading-lg text-text-primary line-clamp-1">{item.title}</h2>
          )}
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
              <p className="text-caption text-text-tertiary mb-1">Platform</p>
              <div className="flex items-center gap-2">
                <PlatformIcon platform={item.platform} className="h-4 w-4" style={{ color: platformColor } as React.CSSProperties} />
                <span className="text-body-sm font-medium text-text-primary">{PLATFORM_LABELS[item.platform]}</span>
              </div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                {item.status === 'published' && <CheckCircle className="h-3 w-3" />}
                {item.status === 'pending_approval' && <Clock className="h-3 w-3" />}
                {statusCfg.label}
              </span>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Scheduled</p>
              <p className="text-mono-sm text-text-primary">{format(parseISO(item.scheduledDate), 'MMM d, yyyy h:mm a')}</p>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Angle</p>
              <span className="inline-block rounded-full px-2.5 py-0.5 text-caption font-semibold" style={{ background: `${angleColor}20`, color: angleColor }}>
                {angle}
              </span>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Author</p>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: platformColor }} />
                <span className="text-body-sm text-text-primary">{item.createdBy} Agent</span>
              </div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3">
              <p className="text-caption text-text-tertiary mb-1">Engagement</p>
              <p className="text-mono-sm text-text-primary">{item.engagement_prediction}/100 predicted</p>
            </div>
          </motion.div>

          {/* Content Preview */}
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h3 className="text-heading-sm text-text-primary mb-2">Content Preview</h3>
            {isEditing ? (
              <textarea
                value={editContent} onChange={(e) => setEditContent(e.target.value)}
                rows={8}
                className="w-full resize-none rounded-lg border border-border-subtle bg-bg-quaternary p-3.5 text-body-md text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
              />
            ) : (
              <div className="rounded-lg bg-bg-tertiary p-4">
                <p className="text-body-md text-text-primary whitespace-pre-wrap">{item.draftContent}</p>
              </div>
            )}
          </motion.div>

          {/* Hashtags */}
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
            <h3 className="text-heading-sm text-text-primary mb-2">Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {item.hashtags.map((tag) => (
                <span key={tag} className="rounded-full px-3 py-1 text-caption font-medium" style={{ background: `${platformColor}20`, color: platformColor }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Media Brief */}
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h3 className="text-heading-sm text-text-primary mb-2">Media Brief</h3>
            <div className="rounded-lg bg-bg-tertiary p-4">
              <p className="text-body-sm text-text-secondary italic">
                This post targets {item.platform === 'instagram' ? 'visual learners with a focus on aesthetic presentation' : item.platform === 'linkedin' ? 'professional firmware engineers and technical leaders' : 'technical deep-dive readers seeking actionable insights'}. Best posting time is {format(parseISO(item.scheduledDate), 'h:mm a')} based on historical engagement data.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 border-t border-border-subtle bg-bg-secondary/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex h-10 items-center gap-2 rounded-lg bg-text-accent px-5 text-body-md font-semibold text-bg-primary hover:brightness-110"
                >
                  <CheckCircle className="h-4 w-4" /> Save
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditTitle(item.title); setEditContent(item.draftContent); }}
                  className="flex h-10 items-center gap-2 rounded-lg px-4 text-body-md font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)} className="flex h-10 items-center gap-2 rounded-lg border border-border-medium px-4 text-body-md font-medium text-text-primary hover:bg-bg-tertiary">
                  <Edit3 className="h-4 w-4" /> Edit
                </button>
                {item.status === 'pending_approval' && (
                  <button onClick={handleApprove} className="flex h-10 items-center gap-2 rounded-lg bg-text-accent px-5 text-body-md font-semibold text-bg-primary hover:brightness-110">
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                )}
                {item.status === 'approved' && (
                  <button onClick={handlePublish} className="flex h-10 items-center gap-2 rounded-lg bg-status-success px-5 text-body-md font-semibold text-bg-primary hover:brightness-110">
                    <Send className="h-4 w-4" /> Publish Now
                  </button>
                )}
                <button onClick={handleDelete} className="ml-auto flex h-10 items-center gap-2 rounded-lg px-4 text-body-md font-medium text-status-danger hover:bg-status-danger/10">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Week View
// ==========================================
function WeekView({
  currentDate, items, onSelectItem,
}: {
  currentDate: Date;
  items: ContentCalendar[];
  onSelectItem: (item: ContentCalendar) => void;
}) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid grid-cols-7 gap-0 overflow-hidden rounded-xl border border-border-subtle">
      {days.map((day, idx) => (
        <motion.div
          key={day.toISOString()}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: idx * 0.04, duration: 0.15, ease: easeOut }}
          className={cn(
            'flex flex-col border-r border-border-subtle bg-bg-secondary last:border-r-0',
            idx === 0 && 'rounded-l-xl',
            idx === 6 && 'rounded-r-xl'
          )}
        >
          {/* Day header */}
          <div className={cn(
            'border-b border-border-subtle px-3 py-2.5 text-center',
            isToday(day) && 'border-b-text-accent'
          )}>
            <p className={cn('text-caption uppercase', isToday(day) ? 'text-text-accent' : 'text-text-tertiary')}>
              {dayNames[idx]} {format(day, 'd')}
            </p>
          </div>

          {/* Day cell */}
          <div className="min-h-[420px] space-y-2 p-2">
            {getItemsForDay(items, day).map((item, itemIdx) => (
              <motion.div
                key={item.id}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.04 + itemIdx * 0.03, duration: 0.12, ease: easeOut }}
                onClick={() => onSelectItem(item)}
                className="group cursor-pointer"
              >
                <WeekCard item={item} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function WeekCard({ item }: { item: ContentCalendar }) {
  const platformColor = PLATFORM_COLORS[item.platform] || '#9B9BB0';
  const statusCfg = STATUS_CONFIG[item.status];
  const angle = getAngleTag(item);

  return (
    <div
      className={cn(
        'relative rounded-lg p-2.5 transition-all duration-150 group-hover:-translate-y-px group-hover:shadow-card',
        item.status === 'in_progress' && 'border-dashed'
      )}
      style={{
        background: `linear-gradient(135deg, ${platformColor}12 0%, rgba(17,17,24,0.8) 100%)`,
        borderLeft: `3px solid ${platformColor}`,
        borderTop: `1px solid ${statusCfg.border}20`,
        borderRight: `1px solid ${statusCfg.border}20`,
        borderBottom: `1px solid ${statusCfg.border}20`,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-mono-sm text-text-tertiary">{formatTimeSlot(item.scheduledDate)}</p>
        <div className="flex items-center gap-1">
          <GripVertical className="h-3 w-3 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-50" />
          <PlatformIcon platform={item.platform} className="h-3.5 w-3.5 shrink-0" style={{ color: platformColor } as React.CSSProperties} />
        </div>
      </div>
      <p className="mt-1 text-body-sm font-medium text-text-primary line-clamp-2">{item.title}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-caption font-semibold"
          style={{ background: statusCfg.bg, color: statusCfg.color }}
        >
          {item.status === 'published' && <CheckCircle className="h-2.5 w-2.5" />}
          {item.status === 'pending_approval' && <Clock className="h-2.5 w-2.5" />}
          {statusCfg.label}
        </span>
        <span
          className="rounded-full px-1.5 py-0.5 text-caption"
          style={{ background: `${getAngleColor(angle)}15`, color: getAngleColor(angle) }}
        >
          {angle}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// Month View
// ==========================================
function MonthView({
  currentDate, items, onSelectItem,
}: {
  currentDate: Date;
  items: ContentCalendar[];
  onSelectItem: (item: ContentCalendar) => void;
}) {
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <>
    <div className="grid grid-cols-7 gap-0 overflow-hidden rounded-xl border border-border-subtle">
      {/* Header row */}
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name) => (
        <div key={name} className="border-b border-r border-border-subtle last:border-r-0 bg-bg-tertiary px-2 py-2 text-center">
          <p className="text-caption uppercase text-text-tertiary">{name}</p>
        </div>
      ))}

      {/* Day cells */}
      {days.map((day, idx) => {
        const dayItems = getItemsForDay(items, day);
        const isCurrentMonth = isSameMonth(day, currentDate);

        return (
          <motion.div
            key={day.toISOString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.015, duration: 0.1 }}
            className={cn(
              'min-h-[120px] border-b border-r border-border-subtle p-2 last:border-r-0',
              !isCurrentMonth && 'bg-bg-primary',
              isCurrentMonth && 'bg-bg-secondary'
            )}
          >
            <div className="flex justify-end mb-1">
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-mono-sm',
                  isToday(day) ? 'bg-text-accent text-bg-primary' : isCurrentMonth ? 'text-text-tertiary' : 'text-text-tertiary/40'
                )}
              >
                {format(day, 'd')}
              </span>
            </div>

            <div className="space-y-1">
              {dayItems.slice(0, 3).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.01, duration: 0.1 }}
                  onClick={() => onSelectItem(item)}
                  className="group flex cursor-pointer items-center gap-1.5 rounded bg-bg-tertiary px-1.5 py-1 transition-all hover:bg-bg-quaternary"
                >
                  <span
                    className="h-2.5 w-1 shrink-0 rounded-full"
                    style={{ background: PLATFORM_COLORS[item.platform] }}
                  />
                  <span className="flex-1 truncate text-caption text-text-primary">{item.title}</span>
                  <PlatformIcon
                    platform={item.platform}
                    className="h-2.5 w-2.5 shrink-0"
                    style={{ color: PLATFORM_COLORS[item.platform] } as React.CSSProperties}
                  />
                </motion.div>
              ))}
              {dayItems.length > 3 && (
                <button onClick={() => setExpandedDay(day)} className="text-caption text-text-accent hover:underline">
                  +{dayItems.length - 3} more
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Day items popover */}
    <AnimatePresence>
      {expandedDay && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setExpandedDay(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOut }}
            className="w-full max-w-[420px] rounded-xl border border-border-subtle bg-bg-secondary p-5 shadow-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-heading-md text-text-primary">{format(expandedDay, 'EEEE, MMM d')}</h2>
              <button onClick={() => setExpandedDay(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {getItemsForDay(items, expandedDay).map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onSelectItem(item); setExpandedDay(null); }}
                  className="group flex w-full cursor-pointer items-center gap-1.5 rounded bg-bg-tertiary px-2 py-1.5 text-left transition-all hover:bg-bg-quaternary"
                >
                  <span
                    className="h-2.5 w-1 shrink-0 rounded-full"
                    style={{ background: PLATFORM_COLORS[item.platform] }}
                  />
                  <span className="flex-1 truncate text-body-sm text-text-primary">{item.title}</span>
                  <span className="text-mono-sm text-text-tertiary">{formatTimeSlot(item.scheduledDate)}</span>
                  <PlatformIcon
                    platform={item.platform}
                    className="h-3 w-3 shrink-0"
                    style={{ color: PLATFORM_COLORS[item.platform] } as React.CSSProperties}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

// ==========================================
// Main Content Calendar Page
// ==========================================
export default function Content() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [statusFilter, setStatusFilter] = useState<PipelineStage | 'all'>('all');
  const [angleFilter, setAngleFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ContentCalendar | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const { data: contentData, refetch } = useApiData(
    () => listContent({ platform: platformFilter === 'all' ? undefined : platformFilter }),
    [platformFilter]
  );
  const items = useMemo(() => contentData ?? [], [contentData]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (angleFilter !== 'all' && getAngleTag(item) !== angleFilter) return false;
      return true;
    });
  }, [items, platformFilter, statusFilter, angleFilter]);

  const activeItem = selectedItem ? (items.find((i) => i.id === selectedItem.id) ?? null) : null;

  const scheduledCount = items.filter((i) => i.status === 'approved').length;
  const draftsCount = items.filter((i) => i.status === 'in_progress').length;
  const publishedCount = items.filter((i) => i.status === 'published').length;
  const queuedCount = items.filter((i) => i.status === 'pending_approval').length;

  const handlePrev = () => {
    if (viewMode === 'week') setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subMonths(d, 1));
  };

  const handleNext = () => {
    if (viewMode === 'week') setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addMonths(d, 1));
  };

  const handleSaveNewPost = async (input: CreatePostInput, status: PipelineStage) => {
    const post = await createPost(input);
    if (status !== post.status) await updatePostStatus(post.id, status);
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
          <h1 className="text-display-lg text-text-primary">Content Calendar</h1>
          <p className="text-body-md text-text-secondary">{items.length} posts scheduled this month</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border-subtle p-0.5">
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'rounded-md px-4 py-2 text-body-sm font-medium transition-all',
                viewMode === 'week' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-primary'
              )}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                'rounded-md px-4 py-2 text-body-sm font-medium transition-all',
                viewMode === 'month' ? 'bg-bg-tertiary text-text-primary' : 'text-text-tertiary hover:text-text-primary'
              )}
            >
              Month
            </button>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex h-10 items-center gap-2 rounded-lg bg-text-accent px-5 text-body-md font-semibold text-bg-primary transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> New Post
          </button>
        </div>
      </motion.div>

      {/* Stats Pills */}
      <motion.div
        initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05, duration: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        {[
          { value: scheduledCount, label: 'Scheduled', color: 'text-status-info' },
          { value: draftsCount, label: 'Drafts', color: 'text-status-warning' },
          { value: publishedCount, label: 'Published', color: 'text-status-success' },
          { value: queuedCount, label: 'In Queue', color: 'text-text-accent' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.06, duration: 0.15, ease: easeOut }}
            className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-bg-secondary px-4 py-2.5"
          >
            <span className={cn('text-mono-lg font-semibold', stat.color)}>{stat.value}</span>
            <span className="text-caption text-text-tertiary">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.2 }}
        className="flex flex-wrap items-center gap-3"
      >
        <Filter className="h-4 w-4 text-text-tertiary" />
        <div className="flex flex-wrap gap-2">
          {(['all', 'instagram', 'linkedin', 'twitter', 'blog'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption font-medium transition-all',
                platformFilter === p && p !== 'all'
                  ? ''
                  : platformFilter === p && p === 'all'
                    ? 'border-text-accent bg-text-accent/15 text-text-accent'
                    : 'border-border-subtle text-text-tertiary hover:border-border-medium hover:text-text-primary'
              )}
              style={
                platformFilter === p && p !== 'all'
                  ? { borderColor: PLATFORM_COLORS[p], color: PLATFORM_COLORS[p], background: `${PLATFORM_COLORS[p]}15` }
                  : undefined
              }
            >
              {p !== 'all' && <PlatformIcon platform={p} className="h-3 w-3" />}
              {p === 'all' ? 'All' : PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-border-subtle" />
        <div className="flex flex-wrap gap-2">
          {(['all', 'in_progress', 'pending_approval', 'approved', 'published'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-caption font-medium transition-all',
                statusFilter === s && s !== 'all'
                  ? ''
                  : statusFilter === s && s === 'all'
                    ? 'border-text-accent bg-text-accent/15 text-text-accent'
                    : 'border-border-subtle text-text-tertiary hover:border-border-medium hover:text-text-primary'
              )}
              style={
                statusFilter === s && s !== 'all'
                  ? { borderColor: STATUS_CONFIG[s].color, color: STATUS_CONFIG[s].color, background: STATUS_CONFIG[s].bg }
                  : undefined
              }
            >
              {s === 'all' ? 'All Status' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-border-subtle" />
        <div className="flex flex-wrap gap-2">
          {(['all', 'engineer-mystic', 'technical-deep-dive', 'behind-the-build', 'thought-leadership', 'case-study'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAngleFilter(a)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-caption font-medium transition-all',
                angleFilter === a && a !== 'all'
                  ? ''
                  : angleFilter === a && a === 'all'
                    ? 'border-text-accent bg-text-accent/15 text-text-accent'
                    : 'border-border-subtle text-text-tertiary hover:border-border-medium hover:text-text-primary'
              )}
              style={
                angleFilter === a && a !== 'all'
                  ? { borderColor: getAngleColor(a as AngleTag), color: getAngleColor(a as AngleTag), background: `${getAngleColor(a as AngleTag)}15` }
                  : undefined
              }
            >
              {a === 'all' ? 'All Angles' : a}
            </button>
          ))}
        </div>
        {(platformFilter !== 'all' || statusFilter !== 'all' || angleFilter !== 'all') && (
          <button
            onClick={() => { setPlatformFilter('all'); setStatusFilter('all'); setAngleFilter('all'); }}
            className="text-caption text-text-accent hover:underline"
          >
            Clear filters
          </button>
        )}
      </motion.div>

      {/* Calendar navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-heading-md text-text-primary min-w-[180px] text-center">
          {viewMode === 'week'
            ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} – ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
            : format(currentDate, 'MMMM yyyy')
          }
        </h2>
        <button
          onClick={handleNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'week' ? (
          <motion.div
            key={`week-${currentDate.toISOString()}`}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
          >
            <WeekView currentDate={currentDate} items={filteredItems} onSelectItem={setSelectedItem} />
          </motion.div>
        ) : (
          <motion.div
            key={`month-${currentDate.toISOString()}`}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <MonthView currentDate={currentDate} items={filteredItems} onSelectItem={setSelectedItem} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-6 border-t border-border-subtle pt-4"
      >
        <div className="flex items-center gap-4">
          <span className="text-caption text-text-tertiary">Platforms:</span>
          {Object.entries(PLATFORM_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-caption text-text-secondary capitalize">{PLATFORM_LABELS[key]}</span>
            </div>
          ))}
        </div>
        <div className="h-4 w-px bg-border-subtle" />
        <div className="flex items-center gap-4">
          <span className="text-caption text-text-tertiary">Status:</span>
          {(['in_progress', 'pending_approval', 'approved', 'published', 'new'] as const).map((key) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: STATUS_CONFIG[key].color }} />
              <span className="text-caption text-text-secondary">{STATUS_CONFIG[key].label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {activeItem && (
          <DetailDrawer item={activeItem} onClose={() => setSelectedItem(null)} onChanged={refetch} />
        )}
      </AnimatePresence>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <NewPostModal onClose={() => setShowNewPost(false)} onSave={handleSaveNewPost} />
        )}
      </AnimatePresence>
    </div>
  );
}
