"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  CheckSquare,
  Plus,
  Lightbulb,
  Terminal,
  Users,
  BarChart3,
  Share2,
  TrendingUp,
  Search,
  Map,
  PenTool,
  GitBranch,
  Database,
  Mail,
  ArrowRight,
  Construction,
} from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '@/dashboard/lib/utils';
import { getOverview, runFullCycle } from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';
import type { ActivityFeedItem, Agent, HeatmapData, PipelineStatus, WeeklyMetric } from '@/dashboard/types';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];
const easeSpring = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: easeSpring } },
};

// Agent icon mapping
const agentIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  GitBranch,
  Database,
  Search,
  Mail,
  Map,
  PenTool,
  Share2,
  TrendingUp,
  Lightbulb,
  BarChart3,
};

// Sparkline component
function Sparkline({ data, color, width = 120, height = 40 }: { data: number[]; color: string; width?: number; height?: number }) {
  const chartData = data.map((value, index) => ({ index, value }));
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Quick Action Button
function QuickActionButton({
  icon: Icon,
  label,
  badge,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  badge?: number;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="relative flex h-10 items-center gap-2 rounded-lg bg-text-accent px-4 text-sm font-semibold text-bg-primary transition-all disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-bg-primary px-1.5 text-xs font-bold text-text-accent">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

// Pipeline Card
function PipelineCard({ pipeline, index }: { pipeline: PipelineStatus; index: number }) {
  const Icon = pipeline.name === 'Lead Pipeline' ? Users : pipeline.name === 'Social Pipeline' ? BarChart3 : Lightbulb;

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      whileHover={{ y: -1, borderColor: 'var(--border-medium)' }}
      className="gradient-card rounded-xl border border-border-subtle p-5 shadow-card transition-shadow hover:shadow-card cursor-pointer"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" style={{ color: pipeline.agentColor }} />
          <h3 className="text-heading-sm text-text-primary">{pipeline.name}</h3>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-caption font-semibold"
          style={{ backgroundColor: `${pipeline.agentColor}20`, color: pipeline.agentColor }}
        >
          Active
        </span>
      </div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {pipeline.metrics.map((metric) => (
          <div key={metric.label}>
            <div className="text-mono-lg font-bold" style={{ color: metric.color }}>
              {metric.value}
            </div>
            <div className="text-caption text-text-tertiary">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="mb-4">
        <Sparkline data={pipeline.sparkline} color={pipeline.agentColor} />
      </div>

      {/* Link */}
      <Link
        href={pipeline.link}
        className="inline-flex items-center gap-1 text-body-sm text-text-accent hover:underline"
      >
        {pipeline.linkLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}

// Activity Heatmap
function ActivityHeatmap({ data }: { data: HeatmapData[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-bg-quaternary';
    const ratio = count / maxCount;
    if (ratio < 0.25) return 'bg-[#38BDF8]/20';
    if (ratio < 0.5) return 'bg-[#38BDF8]/40';
    if (ratio < 0.75) return 'bg-[#38BDF8]/70';
    return 'bg-[#38BDF8]';
  };

  // Group by day of week
  const weeks: HeatmapData[][] = [];
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 0; i < sorted.length; i += 7) {
    weeks.push(sorted.slice(i, i + 7));
  }

  return (
    <motion.div
      variants={itemVariants}
      className="gradient-card rounded-xl border border-border-subtle p-5 shadow-card"
    >
      <h3 className="text-heading-sm text-text-primary mb-4">Agent Activity — Last 30 Days</h3>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                className={cn('h-[10px] w-[10px] rounded-sm transition-colors', getIntensity(day.count))}
                title={`${day.date}: ${day.count} actions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-caption text-text-tertiary">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-[10px] w-[10px] rounded-sm bg-bg-quaternary" />
          <div className="h-[10px] w-[10px] rounded-sm bg-[#38BDF8]/20" />
          <div className="h-[10px] w-[10px] rounded-sm bg-[#38BDF8]/40" />
          <div className="h-[10px] w-[10px] rounded-sm bg-[#38BDF8]/70" />
          <div className="h-[10px] w-[10px] rounded-sm bg-[#38BDF8]" />
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}

// Activity Feed
function ActivityFeed({ items }: { items: ActivityFeedItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      variants={itemVariants}
      className="gradient-card rounded-xl border border-border-subtle p-5 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-heading-sm text-text-primary">Live Agent Activity</h3>
        <Link href="/dashboard/logs" className="inline-flex items-center gap-1 text-body-sm text-text-accent hover:underline">
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-1">
        {items.map((item, index) => (
          <ActivityFeedRow
            key={item.id}
            item={item}
            index={index}
            isExpanded={expandedId === item.id}
            onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ActivityFeedRow({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: ActivityFeedItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.3, duration: 0.15, ease: easeOut }}
      className="cursor-pointer"
      onClick={onToggle}
    >
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
          'hover:bg-bg-tertiary'
        )}
      >
        {/* Agent dot */}
        <div className="flex flex-col items-center gap-1 self-stretch">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.agentColor }}
          />
        </div>

        {/* Agent name */}
        <div className="w-28 shrink-0">
          <span className="text-mono-sm font-medium" style={{ color: item.agentColor }}>
            {item.agent}
          </span>
        </div>

        {/* Action text */}
        <div className="flex-1 min-w-0">
          <span className="text-body-sm text-text-primary truncate">{item.action}</span>
        </div>

        {/* Timestamp */}
        <div className="shrink-0">
          <span className="text-mono-sm text-text-tertiary">{item.timestamp}</span>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && item.details && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-4 border-l-2 border-border-subtle pl-6 pr-3 pb-2"
        >
          <p className="text-body-sm text-text-secondary">{item.details}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

// Key Metrics Card
function KeyMetricsCard({ metrics }: { metrics: WeeklyMetric[] }) {
  return (
    <motion.div
      variants={scaleInVariants}
      className="gradient-card rounded-xl border border-border-subtle p-5 shadow-card"
    >
      <h3 className="text-heading-sm text-text-primary mb-4">This Week&apos;s Impact</h3>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="border-b border-border-subtle pb-3">
            <div className="text-display-lg font-bold" style={{ color: metric.color }}>
              {metric.value}
              {metric.suffix}
            </div>
            <div className="text-caption text-text-tertiary mb-2">{metric.label}</div>
            <Sparkline data={metric.sparkline} color={metric.color} width={100} height={32} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Agent Status Grid
function AgentStatusGrid({ agents }: { agents: Agent[] }) {
  return (
    <motion.div
      variants={itemVariants}
      className="gradient-card rounded-xl border border-border-subtle p-5 shadow-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-heading-sm text-text-primary">Agent Swarm Status</h3>
        <span className="rounded-full bg-status-success/15 px-2.5 py-0.5 text-caption font-semibold text-status-success">
          10/10 Online
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {agents.map((agent, index) => {
          const AgentIcon = agentIconMap[agent.icon] || GitBranch;
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 + 0.4, duration: 0.1, ease: easeOut }}
              whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors cursor-pointer"
            >
              <AgentIcon className="h-4 w-4 shrink-0" style={{ color: agent.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-caption font-medium text-text-primary truncate">{agent.name}</div>
                <div className="text-mono-sm text-text-tertiary">{agent.lastActivity}</div>
              </div>
              <div className="relative flex h-3 w-3 items-center justify-center">
                {agent.status === 'online' && (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: agent.color }} />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: agent.color }} />
                  </>
                )}
                {agent.status === 'idle' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-status-warning" />
                )}
                {agent.status === 'offline' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Stub page for sub-routes
export function StubPage({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-20">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary">
        <Construction className="h-8 w-8 text-text-accent" />
      </div>
      <h2 className="text-heading-lg text-text-primary mb-2">{title}</h2>
      <p className="text-body-md text-text-secondary">This page is under construction.</p>
    </div>
  );
}

// ==========================================
// Main Home Page
// ==========================================
export default function Home() {
  const router = useRouter();
  const { data, refetch } = useApiData(getOverview, []);
  const [cycleRunning, setCycleRunning] = useState(false);
  const today = useMemo(() => new Date(), []);
  const formattedDate = format(today, "EEEE, MMMM d");

  const handleRunFullCycle = async () => {
    if (cycleRunning) return;
    setCycleRunning(true);
    try {
      await runFullCycle();
      refetch();
    } finally {
      setCycleRunning(false);
    }
  };

  if (!data) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Section 1: Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="gradient-glow flex flex-col items-start justify-between gap-4 rounded-xl border border-border-subtle bg-bg-secondary/50 px-6 py-5 sm:flex-row sm:items-center"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: easeOut, delay: 0.1 }}
            className="text-display-lg text-text-primary"
          >
            Swarm Control
          </motion.h1>
          <p className="text-body-md text-text-secondary">
            FieldCraft Digital — {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="flex items-center gap-2 rounded-full bg-bg-tertiary px-3.5 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
            </span>
            <span className="text-body-sm font-medium text-status-success">Swarm Active — 10/10 agents running</span>
          </motion.div>
          <span className="text-mono-sm text-text-tertiary">Last run: 2m ago</span>
        </div>
      </motion.div>

      {/* Section 2: Quick Actions */}
      <motion.div variants={containerVariants} className="flex flex-wrap gap-3">
        <QuickActionButton icon={Zap} label="Run Full Cycle" onClick={handleRunFullCycle} disabled={cycleRunning} />
        <QuickActionButton icon={CheckSquare} label="Approve Pending" badge={data.pendingApprovals} onClick={() => router.push('/dashboard/approvals')} />
        <QuickActionButton icon={Plus} label="New Lead" onClick={() => router.push('/dashboard/leads')} />
        <QuickActionButton icon={Plus} label="New Content" onClick={() => router.push('/dashboard/content')} />
        <QuickActionButton icon={Lightbulb} label="New Product Idea" onClick={() => router.push('/dashboard/products')} />
        <QuickActionButton icon={Terminal} label="View Logs" onClick={() => router.push('/dashboard/logs')} />
      </motion.div>

      {/* Section 3-5: Pipeline Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.pipelineStatuses.map((pipeline, index) => (
          <PipelineCard key={pipeline.name} pipeline={pipeline} index={index} />
        ))}
      </div>

      {/* Section 6: Product Pipeline + Activity Heatmap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityHeatmap data={data.heatmapData} />
        <KeyMetricsCard metrics={data.weeklyMetrics} />
      </div>

      {/* Section 7: Agent Activity Feed */}
      <ActivityFeed items={data.activityFeed} />

      {/* Section 8-9: Key Metrics + Agent Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AgentStatusGrid agents={data.agents} />
        <motion.div
          variants={itemVariants}
          className="gradient-card rounded-xl border border-border-subtle p-5 shadow-card"
        >
          <h3 className="text-heading-sm text-text-primary mb-4">System Health</h3>
          <div className="space-y-3">
            {[
              { label: 'API Rate Limits', value: '78%', color: '#34D399' },
              { label: 'Queue Depth', value: '12 items', color: '#38BDF8' },
              { label: 'Token Usage (24h)', value: '45.2K', color: '#A78BFA' },
              { label: 'Error Rate', value: '0.3%', color: '#FB7185' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-bg-primary/50 px-4 py-3">
                <span className="text-body-sm text-text-secondary">{item.label}</span>
                <span className="text-mono-md font-medium" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
