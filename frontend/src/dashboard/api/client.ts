import type {
  Agent,
  AgentRun,
  AgentToggle,
  ApiKeyEntry,
  ApprovalItem,
  ApprovalStatus,
  ApprovalType,
  BrandDoc,
  BrandMemoryEntry,
  ChatMessage,
  ContentCalendar,
  DashboardSettings,
  DocumentRevision,
  Lead,
  LeadStatus,
  LogEntry,
  LogSeverity,
  OverviewData,
  PipelineStage,
  ProductIdea,
} from '@/dashboard/types';
import { clone, getState, nextId, nowIso, nowTime } from './store';

/**
 * Mock API client — the ONLY interface dashboard pages talk to.
 *
 * Every function is async with artificial latency to mimic a REST API.
 * When a real `/api/v1` backend lands, only this file changes: swap each
 * implementation for a `fetch` call, keeping the signatures identical.
 */

// ── Latency ─────────────────────────────────────────────────────────

function latencyMs(): number {
  // Tests (vitest) run with zero artificial latency.
  if (typeof process !== 'undefined' && process.env?.VITEST) return 0;
  return 150;
}

async function delay(ms = latencyMs()): Promise<void> {
  if (ms > 0) await new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Shared helpers ──────────────────────────────────────────────────

const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiating',
  'closed_won',
  'closed_lost',
];

const PIPELINE_STAGES: PipelineStage[] = [
  'new',
  'in_progress',
  'pending_approval',
  'approved',
  'rejected',
  'shipped',
  'published',
];

function assertFound<T>(value: T | undefined, what: string): T {
  if (!value) throw new Error(`${what} not found`);
  return value;
}

function csvCell(value: string | number | undefined): string {
  const s = value === undefined ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function matchesSearch(haystack: (string | undefined)[], q?: string): boolean {
  if (!q || !q.trim()) return true;
  const needle = q.trim().toLowerCase();
  return haystack.some((h) => h && h.toLowerCase().includes(needle));
}

function normalizeTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function pushActivity(action: string, agent: string, agentColor: string, details?: string): void {
  const s = getState();
  s.activityFeed.unshift({
    id: nextId('log', 'af'),
    agent: agent as (typeof s.activityFeed)[0]['agent'],
    agentColor,
    action,
    timestamp: 'Just now',
    details,
  });
}

function pushLog(entry: Omit<LogEntry, 'id' | 'timestamp'> & { timestamp?: string }): void {
  const s = getState();
  s.logs.unshift({
    ...entry,
    id: nextId('log'),
    timestamp: entry.timestamp ?? nowIso(),
  });
}

// ── Overview ────────────────────────────────────────────────────────

export async function getOverview(): Promise<OverviewData> {
  await delay();
  const s = getState();
  const lastRun = s.agentRuns[s.agentRuns.length - 1];
  return clone({
    agents: s.agents,
    pipelineStatuses: s.pipelineStatuses,
    activityFeed: s.activityFeed,
    heatmapData: s.heatmapData,
    weeklyMetrics: s.weeklyMetrics,
    pendingApprovals: s.approvals.filter((a) => a.status === 'pending_approval').length,
    agentRunsCompleted: 342 + s.agentRuns.length,
    lastRunAt: lastRun ? lastRun.finishedAt : '2025-01-14T10:00:00Z',
  });
}

export interface RunCycleResult {
  run: AgentRun;
  newLead: Lead;
  newApproval: ApprovalItem;
}

const CYCLE_LEADS: Array<Pick<Lead, 'company' | 'contactName' | 'title' | 'email' | 'source' | 'industry' | 'companySize' | 'fitScore' | 'signalNotes' | 'notes'>> = [
  {
    company: 'VoltEdge Systems', contactName: 'Priya Nair', title: 'VP Engineering',
    email: 'priya@voltedge.io', source: 'ProductHunt', industry: 'Energy IoT', companySize: '50-200',
    fitScore: 84,
    signalNotes: 'Hiring 4 firmware roles. Engaged with our CI/CD thread yesterday.',
    notes: 'Fast-growing energy IoT startup. Strong hiring signal.',
  },
  {
    company: 'KernelWorks', contactName: 'Owen Hughes', title: 'CTO',
    email: 'owen@kernelworks.dev', source: 'GitHub', industry: 'Embedded Tooling', companySize: '10-50',
    fitScore: 79,
    signalNotes: 'Starred our orchestrator repo. Opened an issue about agent memory.',
    notes: 'Small embedded tooling team, very active in open source.',
  },
  {
    company: 'FleetMind Robotics', contactName: 'Elena Vargas', title: 'Head of Firmware',
    email: 'elena@fleetmind.ai', source: 'LinkedIn', industry: 'Robotics', companySize: '200-1000',
    fitScore: 88,
    signalNotes: 'Posted about OTA update failures across their fleet. High intent.',
    notes: 'Enterprise robotics fleet operator with acute OTA pain.',
  },
];

/** Mock: run one full agent cycle. Mutates leads, approvals, chat, logs, activity, KPIs. */
export async function runFullCycle(): Promise<RunCycleResult> {
  await delay(typeof process !== 'undefined' && process.env?.VITEST ? 0 : 600);
  const s = getState();
  const startedAt = nowIso();

  // 1. New lead discovered (cycles deterministically through the pool).
  const tpl = CYCLE_LEADS[s.agentRuns.length % CYCLE_LEADS.length];
  const newLead: Lead = {
    id: nextId('lead'),
    ...tpl,
    status: 'new',
    createdAt: startedAt,
    updatedAt: startedAt,
  };
  s.leads.unshift(newLead);

  // 2. Outreach draft for that lead lands in the approval queue.
  const newApproval: ApprovalItem = {
    id: nextId('approval'),
    type: 'outreach',
    status: 'pending_approval',
    title: tpl.company,
    preview: `Subject: ${tpl.industry} operations at ${tpl.company} — a note from FieldCraft\n\nHi ${tpl.contactName.split(' ')[0]},\n\n${tpl.signalNotes} We help ${tpl.industry.toLowerCase()} teams automate lead generation and content with AI agents. Worth a 15-minute chat?`,
    metadata: {
      leadName: tpl.company,
      leadSource: tpl.source,
      fitScore: tpl.fitScore,
      signal: tpl.signalNotes,
    },
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    agentReasoning: `Lead Intelligence scored ${tpl.company} at ${tpl.fitScore}% fit during the latest cycle. Signal: ${tpl.signalNotes} Drafted a value-first outreach referencing the live signal.`,
    createdAt: startedAt,
  };
  s.approvals.unshift(newApproval);

  // 3. Inter-agent chat messages with reasoning.
  const t = nowTime();
  const cycleMessages: ChatMessage[] = [
    {
      id: nextId('message', 'c'),
      agent: 'Orchestrator',
      agentColor: '#F0A84F',
      timestamp: t,
      content: `Manual full cycle triggered by operator. Dispatching Lead Intelligence scan and Outreach Drafting for top signal.`,
      type: 'system',
    },
    {
      id: nextId('message', 'c'),
      agent: 'Lead Intelligence',
      agentColor: '#38BDF8',
      recipient: 'Orchestrator',
      timestamp: t,
      content: `Scan complete. New lead: '${tpl.company}' — fit score ${tpl.fitScore}%. ${tpl.signalNotes}`,
      type: 'message',
      reasoning: `Scored ${tpl.company} across 14 dimensions: hiring velocity, funding stage, technical relevance and signal recency. ${tpl.fitScore}% exceeds the 70% routing threshold.`,
    },
    {
      id: nextId('message', 'c'),
      agent: 'Outreach Drafting',
      agentColor: '#34D399',
      recipient: 'Orchestrator',
      timestamp: t,
      content: `Draft complete for ${tpl.company}. Sent to Approval Queue for human review.`,
      type: 'message',
      reasoning: 'Used value-first framing matched to the live signal. Two A/B variants drafted; strongest hook selected based on historical reply rates.',
    },
  ];
  s.messages.push(...cycleMessages);

  // 4. Logs + activity feed.
  pushLog({
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: `Manual full cycle complete. 1 lead found (${tpl.company}), 1 approval queued.`,
    details: { tokensUsed: 3200, executionTime: 9800 },
  });
  pushLog({
    severity: 'info',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    message: `Found new lead: ${tpl.company} (fit ${tpl.fitScore}%).`,
    pipeline: 'lead',
    details: { tokensUsed: 1450, executionTime: 4100 },
  });
  pushActivity(`Full cycle: found ${tpl.company} (fit ${tpl.fitScore}%)`, 'Lead Intelligence', '#38BDF8', tpl.signalNotes);
  pushActivity(`Drafted outreach for ${tpl.company} — awaiting approval`, 'Outreach Drafting', '#34D399');

  // 5. KPIs reflect the cycle.
  const leadsMetric = s.weeklyMetrics.find((m) => m.label === 'Total Leads Discovered');
  if (leadsMetric) {
    leadsMetric.value += 1;
    leadsMetric.sparkline[leadsMetric.sparkline.length - 1] += 1;
  }
  const runsMetric = s.weeklyMetrics.find((m) => m.label === 'Agent Runs Completed');
  if (runsMetric) {
    runsMetric.value += 1;
    runsMetric.sparkline[runsMetric.sparkline.length - 1] += 1;
  }
  const leadPipeline = s.pipelineStatuses.find((p) => p.name === 'Lead Pipeline');
  const newLeadsToday = leadPipeline?.metrics.find((m) => m.label === 'New Leads Today');
  if (newLeadsToday) newLeadsToday.value = String(parseInt(newLeadsToday.value, 10) + 1);
  const todayCell = s.heatmapData[s.heatmapData.length - 1];
  if (todayCell) todayCell.count += 5;

  const finishedAt = nowIso();
  const run: AgentRun = {
    id: nextId('run', 'run-'),
    startedAt,
    finishedAt,
    trigger: 'manual',
    summary: `Manual cycle: 1 lead (${tpl.company}), 1 approval queued, ${cycleMessages.length} messages exchanged.`,
    leadsFound: 1,
    approvalsCreated: 1,
    messagesExchanged: cycleMessages.length,
  };
  s.agentRuns.push(run);

  return clone({ run, newLead, newApproval });
}

// ── Agents ──────────────────────────────────────────────────────────

export async function listAgents(): Promise<Agent[]> {
  await delay();
  return clone(getState().agents);
}

// ── Leads ───────────────────────────────────────────────────────────

export interface LeadFilters {
  search?: string;
  source?: string;
  status?: LeadStatus | 'All';
}

function applyLeadFilters(leads: Lead[], filters?: LeadFilters): Lead[] {
  let out = leads;
  if (filters?.source && filters.source !== 'All') out = out.filter((l) => l.source === filters.source);
  if (filters?.status && filters.status !== 'All') out = out.filter((l) => l.status === filters.status);
  if (filters?.search?.trim()) {
    out = out.filter((l) =>
      matchesSearch([l.company, l.contactName, l.notes, l.signalNotes], filters.search)
    );
  }
  return out;
}

export async function listLeads(filters?: LeadFilters): Promise<Lead[]> {
  await delay();
  return clone(applyLeadFilters(getState().leads, filters));
}

export type CreateLeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  await delay();
  if (!LEAD_STATUSES.includes(input.status)) throw new Error(`Invalid lead status: ${input.status}`);
  const now = nowIso();
  const lead: Lead = { ...input, id: nextId('lead'), createdAt: now, updatedAt: now };
  getState().leads.unshift(lead);
  return clone(lead);
}

export async function updateLead(id: string, patch: Partial<Omit<Lead, 'id' | 'createdAt'>>): Promise<Lead> {
  await delay();
  if (patch.status && !LEAD_STATUSES.includes(patch.status)) {
    throw new Error(`Invalid lead status: ${patch.status}`);
  }
  const lead = assertFound(getState().leads.find((l) => l.id === id), `Lead ${id}`);
  Object.assign(lead, patch, { updatedAt: nowIso() });
  return clone(lead);
}

export async function deleteLead(id: string): Promise<void> {
  await delay();
  const s = getState();
  const idx = s.leads.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error(`Lead ${id} not found`);
  s.leads.splice(idx, 1);
}

export async function exportLeadsCsv(filters?: LeadFilters): Promise<string> {
  await delay();
  const rows = applyLeadFilters(getState().leads, filters);
  const header = 'id,company,contactName,title,email,source,fitScore,status,industry,companySize,notes,createdAt,updatedAt';
  const body = rows.map((l) =>
    [l.id, l.company, l.contactName, l.title, l.email, l.source, l.fitScore, l.status, l.industry, l.companySize, l.notes, l.createdAt, l.updatedAt]
      .map(csvCell)
      .join(',')
  );
  return [header, ...body].join('\n');
}

// ── Approvals ───────────────────────────────────────────────────────

export interface ApprovalFilters {
  type?: ApprovalType | 'all';
  status?: ApprovalStatus;
  search?: string;
  sort?: 'newest' | 'oldest';
}

export async function listApprovals(filters?: ApprovalFilters): Promise<ApprovalItem[]> {
  await delay();
  let out = getState().approvals;
  if (filters?.status) out = out.filter((a) => a.status === filters.status);
  if (filters?.type && filters.type !== 'all') out = out.filter((a) => a.type === filters.type);
  if (filters?.search?.trim()) {
    out = out.filter((a) => matchesSearch([a.title, a.preview, a.agent], filters.search));
  }
  const sorted = [...out].sort((a, b) =>
    filters?.sort === 'oldest'
      ? a.createdAt.localeCompare(b.createdAt)
      : b.createdAt.localeCompare(a.createdAt)
  );
  return clone(sorted);
}

export interface ApprovalEdits {
  title?: string;
  preview?: string;
}

export interface CreateApprovalInput {
  type: ApprovalType;
  title: string;
  preview: string;
  metadata?: ApprovalItem['metadata'];
  agent?: ApprovalItem['agent'];
  agentColor?: string;
  agentReasoning?: string;
}

/** Create a new pending approval (e.g. "Send to Approval" from the leads board). */
export async function createApproval(input: CreateApprovalInput): Promise<ApprovalItem> {
  await delay();
  const item: ApprovalItem = {
    id: nextId('approval'),
    type: input.type,
    status: 'pending_approval',
    title: input.title,
    preview: input.preview,
    metadata: input.metadata ?? {},
    agent: input.agent ?? 'Outreach Drafting',
    agentColor: input.agentColor ?? '#34D399',
    agentReasoning:
      input.agentReasoning ?? 'Draft composed manually via the dashboard and queued for human review.',
    createdAt: nowIso(),
  };
  getState().approvals.unshift(item);
  return clone(item);
}

/** Persist edits to a pending approval's content (used by "Save Edits"). */
export async function updateApproval(id: string, edits: ApprovalEdits): Promise<ApprovalItem> {
  await delay();
  const item = assertFound(getState().approvals.find((a) => a.id === id), `Approval ${id}`);
  if (item.status !== 'pending_approval') throw new Error(`Approval ${id} already decided`);
  if (edits.title !== undefined) item.title = edits.title;
  if (edits.preview !== undefined) item.preview = edits.preview;
  return clone(item);
}

/**
 * Decide on an approval. Approving applies the side effect to the linked
 * entity (lead → contacted, content post → approved, product idea → approved);
 * rejecting only records the decision on the approval itself.
 */
export async function decideApproval(
  id: string,
  decision: 'approved' | 'rejected',
  edits?: ApprovalEdits
): Promise<ApprovalItem> {
  await delay();
  const s = getState();
  const item = assertFound(s.approvals.find((a) => a.id === id), `Approval ${id}`);
  if (item.status !== 'pending_approval') throw new Error(`Approval ${id} already decided`);

  if (edits?.title !== undefined) item.title = edits.title;
  if (edits?.preview !== undefined) item.preview = edits.preview;
  item.status = decision;
  item.decidedAt = nowIso();

  if (decision === 'approved') {
    if (item.type === 'outreach') {
      const leadName = item.metadata.leadName ?? item.title;
      const lead = s.leads.find((l) => l.company === leadName);
      if (lead && lead.status === 'new') {
        lead.status = 'contacted';
        lead.updatedAt = item.decidedAt;
      }
    } else if (item.type === 'content') {
      const post = s.content.find((c) => c.title === item.title);
      if (post) post.status = 'approved';
    } else if (item.type === 'product') {
      const needle = normalizeTitle(item.title);
      const idea = s.productIdeas.find(
        (p) => normalizeTitle(p.title) === needle
      ) ?? s.productIdeas.find((p) => {
        const t = normalizeTitle(p.title);
        return t.includes(needle) || needle.includes(t);
      });
      if (idea) idea.stage = 'approved';
    }
  }

  pushLog({
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: `Human decision: ${decision === 'approved' ? 'APPROVED' : 'REJECTED'} ${item.type} "${item.title}".`,
    details: { tokensUsed: 0, executionTime: 0 },
  });
  pushActivity(
    `${decision === 'approved' ? 'Approved' : 'Rejected'} ${item.type}: ${item.title}`,
    'Orchestrator',
    '#F0A84F'
  );

  return clone(item);
}

// ── Content ─────────────────────────────────────────────────────────

export interface ContentFilters {
  platform?: ContentCalendar['platform'] | 'all';
  status?: PipelineStage | 'all';
  search?: string;
}

export async function listContent(filters?: ContentFilters): Promise<ContentCalendar[]> {
  await delay();
  let out = getState().content;
  if (filters?.platform && filters.platform !== 'all') out = out.filter((c) => c.platform === filters.platform);
  if (filters?.status && filters.status !== 'all') out = out.filter((c) => c.status === filters.status);
  if (filters?.search?.trim()) out = out.filter((c) => matchesSearch([c.title, c.draftContent], filters.search));
  return clone(out);
}

export type CreatePostInput = Omit<ContentCalendar, 'id' | 'createdAt' | 'status' | 'engagement_prediction' | 'createdBy'> & {
  createdBy?: ContentCalendar['createdBy'];
};

export async function createPost(input: CreatePostInput): Promise<ContentCalendar> {
  await delay();
  const post: ContentCalendar = {
    ...input,
    id: nextId('content'),
    status: 'new',
    engagement_prediction: 50,
    createdBy: input.createdBy ?? 'Content Strategy',
    createdAt: nowIso(),
  };
  getState().content.unshift(post);
  return clone(post);
}

export async function updatePost(id: string, patch: Partial<Omit<ContentCalendar, 'id' | 'createdAt'>>): Promise<ContentCalendar> {
  await delay();
  if (patch.status && !PIPELINE_STAGES.includes(patch.status)) {
    throw new Error(`Invalid pipeline stage: ${patch.status}`);
  }
  const post = assertFound(getState().content.find((c) => c.id === id), `Post ${id}`);
  Object.assign(post, patch);
  return clone(post);
}

export async function updatePostStatus(id: string, status: PipelineStage): Promise<ContentCalendar> {
  return updatePost(id, { status });
}

export async function deletePost(id: string): Promise<void> {
  await delay();
  const s = getState();
  const idx = s.content.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error(`Post ${id} not found`);
  s.content.splice(idx, 1);
}

// ── Product ideas ───────────────────────────────────────────────────

export async function listProductIdeas(): Promise<ProductIdea[]> {
  await delay();
  return clone(getState().productIdeas);
}

export type CreateProductIdeaInput = Omit<ProductIdea, 'id' | 'createdAt' | 'stage' | 'createdBy'> & {
  createdBy?: ProductIdea['createdBy'];
};

export async function createProductIdea(input: CreateProductIdeaInput): Promise<ProductIdea> {
  await delay();
  const idea: ProductIdea = {
    ...input,
    id: nextId('product'),
    stage: 'new',
    createdBy: input.createdBy ?? 'Product Ideation',
    createdAt: nowIso(),
  };
  getState().productIdeas.unshift(idea);
  return clone(idea);
}

export async function updateProductIdea(id: string, patch: Partial<Omit<ProductIdea, 'id' | 'createdAt'>>): Promise<ProductIdea> {
  await delay();
  if (patch.stage && !PIPELINE_STAGES.includes(patch.stage)) {
    throw new Error(`Invalid pipeline stage: ${patch.stage}`);
  }
  const idea = assertFound(getState().productIdeas.find((p) => p.id === id), `Product idea ${id}`);
  Object.assign(idea, patch);
  return clone(idea);
}

export async function moveProductIdea(id: string, stage: PipelineStage): Promise<ProductIdea> {
  return updateProductIdea(id, { stage });
}

export async function deleteProductIdea(id: string): Promise<void> {
  await delay();
  const s = getState();
  const idx = s.productIdeas.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Product idea ${id} not found`);
  s.productIdeas.splice(idx, 1);
}

// ── Chat ────────────────────────────────────────────────────────────

export interface MessageFilters {
  agent?: string;
  search?: string;
}

export async function listMessages(filters?: MessageFilters): Promise<ChatMessage[]> {
  await delay();
  let out = getState().messages;
  if (filters?.agent && filters.agent !== 'all') out = out.filter((m) => m.agent === filters.agent);
  if (filters?.search?.trim()) out = out.filter((m) => matchesSearch([m.content, m.reasoning], filters.search));
  return clone(out);
}

interface ReplyTemplate {
  content: (snippet: string) => string;
  reasoning: string;
}

const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    content: (s) => `Acknowledged. "${s}" — routing this through the swarm now. Lead Intelligence will rescan active signals and Content Strategy will fold your directive into this week's calendar. Expect a summary within the next cycle.`,
    reasoning: 'Parsed operator directive as high-priority. Mapped intent to lead + content pipelines; dispatched sub-tasks to the two agents with the most relevant context windows.',
  },
  {
    content: (s) => `Understood: "${s}". I've queued this as a priority mission. Market Research is pulling fresh signals to ground the work, and Brand Memory will verify voice alignment before anything ships.`,
    reasoning: 'Directive affects external-facing output, so I inserted a Brand Memory voice-check gate before publication. Signal refresh ensures we act on current, not stale, market data.',
  },
  {
    content: (s) => `On it — "${s}". Orchestrator has scheduled the task for the next cycle. Outreach Drafting is standing by with two message variants, and Analytics & Feedback will measure lift against last week's baseline.`,
    reasoning: 'Estimated effort: one cycle. Assigned Outreach Drafting as executor with A/B variants, and Analytics & Feedback as the measurement owner to close the feedback loop.',
  },
  {
    content: (s) => `Logged and prioritized: "${s}". I've updated the mission queue and notified the relevant agents. Product Ideation will also check whether this maps to any open concept in the idea pipeline.`,
    reasoning: 'Cross-referenced the directive against the product idea backlog — recurring operator intent often signals a productizable workflow, so Product Ideation gets a copy.',
  },
];

/**
 * Store the operator's message and — unless the stream is paused — append a
 * deterministic templated reply from the target agent. No setTimeout fakes:
 * the reply exists in the store by the time this promise resolves.
 */
export async function sendMessage(content: string, targetAgent?: string): Promise<{ userMessage: ChatMessage; reply: ChatMessage | null }> {
  await delay();
  const s = getState();
  const agentName = (targetAgent && targetAgent !== 'all' ? targetAgent : 'Orchestrator') as ChatMessage['agent'];
  const agent = s.agents.find((a) => a.name === agentName);
  const agentColor = agent?.color ?? '#F0A84F';

  const userMessage: ChatMessage = {
    id: nextId('message', 'u'),
    agent: agentName,
    agentColor,
    recipient: agentName === 'Orchestrator' ? 'All' : 'Orchestrator',
    timestamp: nowTime(),
    content,
    type: 'message',
    fromUser: true,
  };
  s.messages.push(userMessage);

  let reply: ChatMessage | null = null;
  if (!s.chatPaused) {
    const tpl = REPLY_TEMPLATES[s.counters.message % REPLY_TEMPLATES.length];
    const snippet = content.length > 80 ? `${content.slice(0, 77)}...` : content;
    reply = {
      id: nextId('message', 'r'),
      agent: agentName,
      agentColor,
      recipient: 'Operator',
      timestamp: nowTime(),
      content: tpl.content(snippet),
      type: 'message',
      reasoning: tpl.reasoning,
      parentId: userMessage.id,
      threadDepth: 1,
    };
    s.messages.push(reply);
  }

  return clone({ userMessage, reply });
}

export async function getChatState(): Promise<{ paused: boolean }> {
  await delay();
  return { paused: getState().chatPaused };
}

export async function setChatPaused(paused: boolean): Promise<{ paused: boolean }> {
  await delay();
  getState().chatPaused = paused;
  return { paused };
}

// ── Logs ────────────────────────────────────────────────────────────

export interface LogFilters {
  severity?: LogSeverity | 'all';
  agent?: string;
  pipeline?: string;
  search?: string;
}

export async function listLogs(filters?: LogFilters): Promise<LogEntry[]> {
  await delay();
  let out = getState().logs;
  if (filters?.severity && filters.severity !== 'all') out = out.filter((l) => l.severity === filters.severity);
  if (filters?.agent && filters.agent !== 'all') out = out.filter((l) => l.agent === filters.agent);
  if (filters?.pipeline && filters.pipeline !== 'all') out = out.filter((l) => l.pipeline === filters.pipeline);
  if (filters?.search?.trim()) out = out.filter((l) => matchesSearch([l.message, l.agent], filters.search));
  return clone(out);
}

export async function clearLogs(): Promise<void> {
  await delay();
  getState().logs = [];
}

// ── Brand memory ────────────────────────────────────────────────────

export async function listBrandDocs(): Promise<BrandDoc[]> {
  await delay();
  return clone(getState().brandDocs);
}

export async function saveBrandDoc(id: string, content: string): Promise<BrandDoc> {
  await delay();
  const s = getState();
  const doc = assertFound(s.brandDocs.find((d) => d.id === id), `Brand doc ${id}`);
  // Snapshot the outgoing content as a revision before overwriting.
  s.revisions.unshift({
    id: nextId('revision', 'r'),
    docId: doc.id,
    timestamp: nowIso(),
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    changes: 'Manual edit via dashboard',
    content: doc.content,
  });
  doc.content = content;
  doc.lastUpdated = nowIso();
  doc.updatedBy = 'Orchestrator';
  return clone(doc);
}

export async function listRevisions(docId?: string): Promise<DocumentRevision[]> {
  await delay();
  let out = getState().revisions;
  if (docId) out = out.filter((r) => r.docId === docId);
  return clone(out);
}

/** Revert a document to the content captured by a revision. */
export async function restoreRevision(revisionId: string): Promise<BrandDoc> {
  await delay();
  const s = getState();
  const rev = assertFound(s.revisions.find((r) => r.id === revisionId), `Revision ${revisionId}`);
  const doc = assertFound(s.brandDocs.find((d) => d.id === rev.docId), `Brand doc ${rev.docId}`);
  if (doc.content !== rev.content) {
    s.revisions.unshift({
      id: nextId('revision', 'r'),
      docId: doc.id,
      timestamp: nowIso(),
      agent: 'Orchestrator',
      agentColor: '#F0A84F',
      changes: `Reverted to revision ${rev.id}`,
      content: doc.content,
    });
    doc.content = rev.content;
    doc.lastUpdated = nowIso();
    doc.updatedBy = 'Orchestrator';
  }
  return clone(doc);
}

export async function getBrandMemory(): Promise<BrandMemoryEntry[]> {
  await delay();
  return clone(getState().brandMemory);
}

export async function saveBrandMemory(entries: BrandMemoryEntry[]): Promise<BrandMemoryEntry[]> {
  await delay();
  const now = nowIso();
  getState().brandMemory = entries.map((e) => ({ ...e, lastUpdated: now }));
  return clone(getState().brandMemory);
}

// ── Settings ────────────────────────────────────────────────────────

function maskKey(raw: string): string {
  if (!raw) return '';
  const head = raw.slice(0, Math.min(8, raw.length));
  return `${head}${'•'.repeat(24)}`;
}

function toPublicKey(rec: ApiKeyEntry & { rawKey?: string }): ApiKeyEntry {
  const pub = { ...rec };
  delete pub.rawKey;
  return pub;
}

/** List API keys — raw keys are NEVER included. */
export async function listApiKeys(): Promise<ApiKeyEntry[]> {
  await delay();
  return getState().apiKeys.map((k) => clone(toPublicKey(k)));
}

/** Store a new raw key; the returned entry only carries the masked display. */
export async function saveApiKey(id: string, rawKey: string): Promise<ApiKeyEntry> {
  await delay();
  const rec = assertFound(getState().apiKeys.find((k) => k.id === id), `API key ${id}`);
  rec.rawKey = rawKey;
  rec.maskedKey = maskKey(rawKey);
  rec.status = rawKey ? 'configured' : 'not_set';
  return clone(toPublicKey(rec));
}

export interface ConnectionTestResult {
  id: string;
  ok: boolean;
  testedAt: string;
}

/** Mock ping: configured keys succeed, unset keys fail. Result persists. */
export async function testConnection(id: string): Promise<ConnectionTestResult> {
  await delay(typeof process !== 'undefined' && process.env?.VITEST ? 0 : 800);
  const rec = assertFound(getState().apiKeys.find((k) => k.id === id), `API key ${id}`);
  const ok = rec.status === 'configured' && rec.rawKey.length > 0;
  rec.lastTestedAt = nowIso();
  rec.lastTestResult = ok ? 'success' : 'error';
  return { id, ok, testedAt: rec.lastTestedAt };
}

export async function getSettings(): Promise<DashboardSettings> {
  await delay();
  return clone(getState().settings);
}

export async function saveSettings(patch: Partial<DashboardSettings>): Promise<DashboardSettings> {
  await delay();
  const s = getState().settings;
  if (patch.schedule) s.schedule = { ...s.schedule, ...patch.schedule };
  if (patch.notifications) s.notifications = { ...s.notifications, ...patch.notifications };
  if (patch.system) s.system = { ...s.system, ...patch.system };
  if (patch.agentToggles) s.agentToggles = patch.agentToggles.map((t: AgentToggle) => ({ ...t }));
  return clone(getState().settings);
}

// ── System / misc ───────────────────────────────────────────────────

/** Full JSON export of the mock backend's data. */
export async function exportAllData(): Promise<string> {
  await delay();
  const s = getState();
  return JSON.stringify(
    {
      exportedAt: nowIso(),
      leads: s.leads,
      approvals: s.approvals,
      content: s.content,
      productIdeas: s.productIdeas,
      messages: s.messages,
      logs: s.logs,
      brandDocs: s.brandDocs,
      brandMemory: s.brandMemory,
      settings: s.settings,
      agentRuns: s.agentRuns,
    },
    null,
    2
  );
}

/** Danger zone: wipe all operational data (keeps brand docs + settings). */
export async function clearAllData(): Promise<void> {
  await delay();
  const s = getState();
  s.leads = [];
  s.approvals = [];
  s.content = [];
  s.productIdeas = [];
  s.messages = [];
  s.logs = [];
  s.activityFeed = [];
  s.agentRuns = [];
}

export interface SearchResults {
  agents: Agent[];
  leads: Lead[];
  content: ContentCalendar[];
}

/** Global search for the top bar. */
export async function searchAll(query: string): Promise<SearchResults> {
  await delay();
  const s = getState();
  if (!query.trim()) return { agents: [], leads: [], content: [] };
  return clone({
    agents: s.agents.filter((a) => matchesSearch([a.name, a.description], query)).slice(0, 5),
    leads: s.leads.filter((l) => matchesSearch([l.company, l.contactName], query)).slice(0, 5),
    content: s.content.filter((c) => matchesSearch([c.title], query)).slice(0, 5),
  });
}
