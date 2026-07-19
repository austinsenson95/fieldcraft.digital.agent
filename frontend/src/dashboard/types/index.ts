export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiating' | 'closed_won' | 'closed_lost';
export type PipelineStage = 'new' | 'in_progress' | 'pending_approval' | 'approved' | 'rejected' | 'shipped' | 'published';
export type ApprovalType = 'outreach' | 'content' | 'product';
export type ApprovalStatus = 'pending_approval' | 'approved' | 'rejected';
export type AgentName =
  | 'Orchestrator'
  | 'Brand Memory'
  | 'Lead Intelligence'
  | 'Outreach Drafting'
  | 'Content Strategy'
  | 'Copywriting'
  | 'Social Publishing'
  | 'Market Research'
  | 'Product Ideation'
  | 'Analytics & Feedback';

export type AgentStatus = 'online' | 'idle' | 'offline' | 'error';

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  title?: string;
  email: string;
  source: string;
  fitScore: number;
  status: LeadStatus;
  industry: string;
  companySize: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  signalNotes?: string;
}

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  title: string;
  preview: string;
  metadata: {
    leadName?: string;
    leadSource?: string;
    fitScore?: number;
    signal?: string;
    platform?: 'instagram' | 'linkedin' | 'twitter' | 'blog';
    angle?: string;
    hashtags?: string[];
    demandScore?: number;
    marketSignal?: string;
    targetAudience?: string;
  };
  agent: AgentName;
  agentColor: string;
  agentReasoning: string;
  createdAt: string;
  decidedAt?: string;
}

export interface OutreachDraft {
  id: string;
  leadId: string;
  leadName: string;
  subject: string;
  body: string;
  tone: string;
  status: PipelineStage;
  createdBy: AgentName;
  createdAt: string;
}

export interface ContentCalendar {
  id: string;
  title: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'blog';
  status: PipelineStage;
  scheduledDate: string;
  draftContent: string;
  hashtags: string[];
  engagement_prediction: number;
  createdBy: AgentName;
  createdAt: string;
}

export interface PostDraft {
  id: string;
  calendarId: string;
  content: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'blog';
  status: PipelineStage;
  wordCount: number;
  createdBy: AgentName;
  createdAt: string;
}

export interface MarketSignal {
  id: string;
  source: string;
  category: string;
  summary: string;
  url: string;
  impact: 'high' | 'medium' | 'low';
  relevanceScore: number;
  discoveredBy: AgentName;
  discoveredAt: string;
}

export interface ProductIdea {
  id: string;
  title: string;
  description: string;
  demandScore: number;
  feasibilityScore: number;
  stage: PipelineStage;
  targetAudience: string;
  tags: string[];
  signals: string[];
  createdBy: AgentName;
  createdAt: string;
}

export interface PerformanceMetric {
  id: string;
  metric: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  sparkline: number[];
  recordedAt: string;
}

export interface AgentLog {
  id: string;
  agent: AgentName;
  level: 'info' | 'warn' | 'error' | 'debug';
  action: string;
  details: string;
  duration: number;
  tokensUsed: number;
  timestamp: string;
}

export interface BrandMemoryEntry {
  id: string;
  category: 'voice' | 'icp' | 'positioning' | 'messaging' | 'values';
  key: string;
  value: string;
  source: string;
  confidence: number;
  lastUpdated: string;
}

export interface PipelineStatus {
  name: string;
  agentColor: string;
  status: 'active' | 'paused' | 'error';
  metrics: {
    label: string;
    value: string;
    color: string;
  }[];
  sparkline: number[];
  link: string;
  linkLabel: string;
}

export interface Agent {
  id: string;
  name: AgentName;
  color: string;
  icon: string;
  status: AgentStatus;
  lastActivity: string;
  recentActions: string[];
  description: string;
}

export interface ActivityFeedItem {
  id: string;
  agent: AgentName;
  agentColor: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface HeatmapData {
  date: string;
  count: number;
}

// ==========================================
// Chat
// ==========================================
export type ChatMessageType = 'message' | 'system' | 'decision';

export interface ChatMessage {
  id: string;
  agent: AgentName;
  agentColor: string;
  recipient?: string;
  timestamp: string;
  content: string;
  type: ChatMessageType;
  reasoning?: string;
  decisionLabel?: string;
  decisionAction?: string;
  parentId?: string;
  threadDepth?: number;
  /** True for messages typed by the human operator into the console. */
  fromUser?: boolean;
}

// ==========================================
// Logs
// ==========================================
export type LogSeverity = 'info' | 'debug' | 'warn' | 'error' | 'metrics';

export interface LogEntryDetails {
  rawInput?: string;
  rawOutput?: string;
  tokensUsed?: number;
  executionTime?: number;
  stackTrace?: string;
  statusCode?: number;
  endpoint?: string;
  latency?: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  agent: string;
  agentColor: string;
  message: string;
  pipeline?: string;
  details?: LogEntryDetails;
}

// ==========================================
// Brand Memory documents
// ==========================================
export interface BrandDoc {
  id: string;
  tab: string;
  title: string;
  category: string;
  status: 'green' | 'amber' | 'gray';
  lastUpdated: string;
  updatedBy: string;
  content: string;
}

export interface DocumentRevision {
  id: string;
  docId: string;
  timestamp: string;
  agent: string;
  agentColor: string;
  changes: string;
  /** Full content snapshot — restoring a revision reverts the doc to this content. */
  content: string;
}

// ==========================================
// Settings
// ==========================================
export interface ApiKeyEntry {
  id: string;
  name: string;
  /** Masked display value — the raw key is never returned by list endpoints. */
  maskedKey: string;
  status: 'configured' | 'not_set';
  description: string;
  lastTestedAt?: string;
  lastTestResult?: 'success' | 'error';
}

export interface AgentToggle {
  id: string;
  name: string;
  color: string;
  description: string;
  enabled: boolean;
  lastRun: string;
}

export interface ScheduleSettings {
  pipelineFreq: string;
  contentDays: string[];
  leadScanFreq: string;
  timeZone: string;
  quietStart: string;
  quietEnd: string;
}

export interface NotificationSettings {
  emailApprovals: boolean;
  browser: boolean;
  dailySummary: boolean;
  newLead: boolean;
  leadResponse: boolean;
  contentPublished: boolean;
  productShipped: boolean;
  agentError: boolean;
  cycleComplete: boolean;
  tokenThreshold: boolean;
}

export interface SystemSettings {
  theme: 'dark' | 'light';
  retention: string;
}

export interface DashboardSettings {
  schedule: ScheduleSettings;
  notifications: NotificationSettings;
  system: SystemSettings;
  agentToggles: AgentToggle[];
}

// ==========================================
// Overview / agent runs
// ==========================================
export interface WeeklyMetric {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  sparkline: number[];
}

export interface AgentRun {
  id: string;
  startedAt: string;
  finishedAt: string;
  trigger: 'manual' | 'scheduled';
  summary: string;
  leadsFound: number;
  approvalsCreated: number;
  messagesExchanged: number;
}

export interface OverviewData {
  agents: Agent[];
  pipelineStatuses: PipelineStatus[];
  activityFeed: ActivityFeedItem[];
  heatmapData: HeatmapData[];
  weeklyMetrics: WeeklyMetric[];
  pendingApprovals: number;
  agentRunsCompleted: number;
  lastRunAt: string;
}
