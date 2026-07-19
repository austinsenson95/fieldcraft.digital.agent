// ==========================================
// Dashboard seed data — single deterministic source of truth.
// Consolidates all dashboard mock data (previously spread across
// src/dashboard/data/mockData.ts and the individual dashboard pages).
//
// DETERMINISM CONTRACT: this file must contain no runtime nondeterminism.
// No Math.random(), no Date.now(), no `new Date()` without an argument.
// buildSeed() returns a fresh deep copy (structuredClone) on every call,
// identical on server and client.
// ==========================================
import type {
  Agent,
  AgentRun,
  AgentToggle,
  ApiKeyEntry,
  ApprovalItem,
  ActivityFeedItem,
  BrandDoc,
  BrandMemoryEntry,
  ChatMessage,
  ContentCalendar,
  DocumentRevision,
  DashboardSettings,
  HeatmapData,
  Lead,
  LogEntry,
  MarketSignal,
  NotificationSettings,
  PipelineStatus,
  ProductIdea,
  ScheduleSettings,
  SystemSettings,
  WeeklyMetric,
} from '@/dashboard/types';

/** Internal record: keeps the raw key server-side; list endpoints must strip it. */
export interface ApiKeyRecord extends ApiKeyEntry {
  rawKey: string;
}

export interface StoreState {
  agents: Agent[];
  pipelineStatuses: PipelineStatus[];
  activityFeed: ActivityFeedItem[];
  weeklyMetrics: WeeklyMetric[];
  heatmapData: HeatmapData[];
  marketSignals: MarketSignal[];
  leads: Lead[];
  approvals: ApprovalItem[];
  content: ContentCalendar[];
  productIdeas: ProductIdea[];
  messages: ChatMessage[];
  logs: LogEntry[];
  brandDocs: BrandDoc[];
  revisions: DocumentRevision[];
  brandMemory: BrandMemoryEntry[];
  apiKeys: ApiKeyRecord[];
  settings: DashboardSettings;
  agentRuns: AgentRun[];
  chatPaused: boolean;
  counters: {
    lead: number;
    approval: number;
    content: number;
    product: number;
    message: number;
    log: number;
    run: number;
    revision: number;
  };
}

// ==========================================
// Agent definitions
// ==========================================
const agents: Agent[] = [
  {
    id: '1',
    name: 'Orchestrator',
    color: '#F0A84F',
    icon: 'GitBranch',
    status: 'online',
    lastActivity: '2m ago',
    recentActions: ['Scheduled Content Strategy review cycle', 'Assigned lead #42 to Outreach', 'Ran pipeline health check'],
    description: 'Coordination, scheduling',
  },
  {
    id: '2',
    name: 'Brand Memory',
    color: '#9B6BFF',
    icon: 'Database',
    status: 'online',
    lastActivity: '5m ago',
    recentActions: ['Updated brand voice guidelines', 'Retrieved ICP profile for outreach', 'Refined positioning doc'],
    description: 'Memory, knowledge, retrieval',
  },
  {
    id: '3',
    name: 'Lead Intelligence',
    color: '#38BDF8',
    icon: 'Search',
    status: 'online',
    lastActivity: '3m ago',
    recentActions: ['Found 3 new leads from ProductHunt signals', 'Scored lead TechCorp at 87% fit', 'Scraped LinkedIn for firmware engineers'],
    description: 'Discovery, research, signals',
  },
  {
    id: '4',
    name: 'Outreach Drafting',
    color: '#34D399',
    icon: 'Mail',
    status: 'online',
    lastActivity: '8m ago',
    recentActions: ['Drafted outreach for lead #42', 'Personalized email for ACME Corp', 'A/B test copy revision'],
    description: 'Communication, outreach',
  },
  {
    id: '5',
    name: 'Content Strategy',
    color: '#FB7185',
    icon: 'Map',
    status: 'online',
    lastActivity: '12m ago',
    recentActions: ['Generated 5 post angles for Instagram', 'Planned weekly content calendar', 'Analyzed top-performing topics'],
    description: 'Creativity, planning',
  },
  {
    id: '6',
    name: 'Copywriting',
    color: '#A78BFA',
    icon: 'PenTool',
    status: 'online',
    lastActivity: '15m ago',
    recentActions: ['Completed draft: Why Firmware Engineers Need Agents', 'Edited LinkedIn post for tone', 'Rewrote CTA for landing page'],
    description: 'Writing, expression',
  },
  {
    id: '7',
    name: 'Social Publishing',
    color: '#7DD3FC',
    icon: 'Share2',
    status: 'online',
    lastActivity: '18m ago',
    recentActions: ['Published LinkedIn post (approved earlier)', 'Scheduled Twitter thread for tomorrow', 'Cross-posted blog to LinkedIn'],
    description: 'Broadcasting, distribution',
  },
  {
    id: '8',
    name: 'Market Research',
    color: '#2DD4BF',
    icon: 'TrendingUp',
    status: 'online',
    lastActivity: '22m ago',
    recentActions: ['Updated signal: AI agent tooling market +23% MoM', 'Tracked competitor pricing changes', 'Compiled weekly trend report'],
    description: 'Analysis, trends',
  },
  {
    id: '9',
    name: 'Product Ideation',
    color: '#E879F9',
    icon: 'Lightbulb',
    status: 'online',
    lastActivity: '25m ago',
    recentActions: ['Proposed: Auto-Firmware-Scanner demand score 78', 'Validated IoT monitoring concept', 'Ranked feature requests by demand'],
    description: 'Innovation, creation',
  },
  {
    id: '10',
    name: 'Analytics & Feedback',
    color: '#A3E635',
    icon: 'BarChart3',
    status: 'online',
    lastActivity: '30m ago',
    recentActions: ['Generated weekly engagement report', 'Flagged drop in LinkedIn CTR', 'Correlated post timing with engagement'],
    description: 'Metrics, iteration',
  },
];

// ==========================================
// Pipeline statuses
// ==========================================
const pipelineStatuses: PipelineStatus[] = [
  {
    name: 'Lead Pipeline',
    agentColor: '#38BDF8',
    status: 'active',
    metrics: [
      { label: 'New Leads Today', value: '12', color: '#38BDF8' },
      { label: 'In Outreach', value: '8', color: '#E8E8F0' },
      { label: 'Conversion', value: '24%', color: '#34D399' },
    ],
    sparkline: [4, 7, 5, 8, 12, 9, 12],
    link: '/leads',
    linkLabel: 'View all leads',
  },
  {
    name: 'Social Pipeline',
    agentColor: '#FB7185',
    status: 'active',
    metrics: [
      { label: 'Posts Scheduled', value: '18', color: '#FB7185' },
      { label: 'This Week', value: '7', color: '#E8E8F0' },
      { label: 'Engagement', value: '4.2%', color: '#34D399' },
    ],
    sparkline: [2.1, 3.5, 4.0, 3.8, 4.5, 3.9, 4.2],
    link: '/content',
    linkLabel: 'View calendar',
  },
  {
    name: 'Product Pipeline',
    agentColor: '#E879F9',
    status: 'active',
    metrics: [
      { label: 'Ideas Validated', value: '6', color: '#E879F9' },
      { label: 'In Progress', value: '3', color: '#E8E8F0' },
      { label: 'Shipped', value: '2', color: '#34D399' },
    ],
    sparkline: [1, 2, 1, 3, 2, 4, 6],
    link: '/products',
    linkLabel: 'View ideas',
  },
];

// ==========================================
// Activity feed
// ==========================================
const activityFeed: ActivityFeedItem[] = [
  {
    id: '1',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    action: "Found 3 new leads from ProductHunt signals",
    timestamp: '3m ago',
    details: 'Scraped ProductHunt "Ask" posts for firmware-related queries. Identified 3 companies with >50 employees showing intent signals for developer tooling.',
  },
  {
    id: '2',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    action: 'Scheduled Content Strategy review cycle',
    timestamp: '5m ago',
    details: 'Triggered the weekly content pipeline review. Assigned 5 new topics to Copywriting agent for draft creation.',
  },
  {
    id: '3',
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    action: 'Drafted outreach for lead #42, awaiting approval',
    timestamp: '8m ago',
    details: 'Personalized cold email for TechCorp Inc CTO. Referenced their recent Series B announcement and firmware CI/CD challenges.',
  },
  {
    id: '4',
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    action: 'Generated 5 post angles for Instagram',
    timestamp: '12m ago',
    details: 'Analyzed top-performing posts from similar accounts. Generated carousel, reel, and story concepts targeting firmware engineers.',
  },
  {
    id: '5',
    agent: 'Copywriting',
    agentColor: '#A78BFA',
    action: "Completed draft: 'Why Firmware Engineers Need Agents'",
    timestamp: '15m ago',
    details: '1,200-word blog post exploring the intersection of AI agents and embedded firmware development. SEO-optimized with 3 target keywords.',
  },
  {
    id: '6',
    agent: 'Social Publishing',
    agentColor: '#7DD3FC',
    action: 'Published LinkedIn post (approved earlier)',
    timestamp: '18m ago',
    details: 'Posted: "The firmware build pipeline is the new front-end framework." Engagement tracking enabled.',
  },
  {
    id: '7',
    agent: 'Market Research',
    agentColor: '#2DD4BF',
    action: 'Updated signal: AI agent tooling market +23% MoM',
    timestamp: '22m ago',
    details: 'Tracked 47 new entrants in the AI agent tooling space. Notable: three YC W24 companies targeting developer workflows.',
  },
  {
    id: '8',
    agent: 'Product Ideation',
    agentColor: '#E879F9',
    action: "Proposed: 'Auto-Firmware-Scanner' — demand score 78",
    timestamp: '25m ago',
    details: 'Analyzed 200+ support tickets and forum threads. High demand for automated firmware vulnerability scanning in IoT deployments.',
  },
];

// ==========================================
// Weekly impact metrics
// ==========================================
const weeklyMetrics: WeeklyMetric[] = [
  {
    label: 'Total Leads Discovered',
    value: 47,
    color: '#E8E8F0',
    sparkline: [5, 8, 6, 10, 7, 9, 12],
  },
  {
    label: 'Content Pieces Created',
    value: 12,
    color: '#E8E8F0',
    sparkline: [1, 3, 2, 4, 2, 3, 5],
  },
  {
    label: 'Avg. Lead Fit Score',
    value: 78,
    suffix: '%',
    color: '#34D399',
    sparkline: [72, 74, 73, 76, 75, 77, 78],
  },
  {
    label: 'Agent Runs Completed',
    value: 342,
    color: '#38BDF8',
    sparkline: [38, 45, 42, 51, 48, 55, 63],
  },
];

// ==========================================
// Leads
// ==========================================
const leads: Lead[] = [
  {
    id: '1',
    company: 'TechCorp Inc',
    contactName: 'Sarah Chen',
    title: 'CTO',
    email: 's.chen@techcorp.io',
    source: 'ProductHunt',
    fitScore: 87,
    status: 'qualified',
    industry: 'IoT Hardware',
    companySize: '50-200',
    notes: 'Recently raised Series B, hiring firmware engineers. Strong product-market fit signal.',
    signalNotes: 'Hiring signal — 3 firmware roles posted. Series B funding indicates growth budget.',
    createdAt: '2025-01-10T08:30:00Z',
    updatedAt: '2025-01-14T14:22:00Z',
  },
  {
    id: '2',
    company: 'EmbedScale',
    contactName: 'Marcus Johnson',
    title: 'CTO',
    email: 'mj@embedscale.dev',
    source: 'LinkedIn',
    fitScore: 92,
    status: 'proposal',
    industry: 'Embedded Systems',
    companySize: '10-50',
    notes: 'CTO posted about CI/CD challenges for embedded teams. High intent.',
    signalNotes: 'Posted about CI/CD pain. Engaged with our content twice. High intent.',
    createdAt: '2025-01-08T10:15:00Z',
    updatedAt: '2025-01-13T16:45:00Z',
  },
  {
    id: '3',
    company: 'FirmwareFirst',
    contactName: 'Ana Rodriguez',
    title: 'VP Engineering',
    email: 'ana@firmwarefirst.com',
    source: 'Twitter',
    fitScore: 74,
    status: 'new',
    industry: 'Developer Tools',
    companySize: '10-50',
    notes: 'Active in firmware community, shares tooling content regularly.',
    signalNotes: 'Shares tooling content regularly. Engaged with our Twitter threads.',
    createdAt: '2025-01-14T09:00:00Z',
    updatedAt: '2025-01-14T09:00:00Z',
  },
  {
    id: '4',
    company: 'ChipCraft Labs',
    contactName: 'David Park',
    title: 'Head of Product',
    email: 'dpark@chipcraft.io',
    source: 'ProductHunt',
    fitScore: 81,
    status: 'contacted',
    industry: 'Semiconductor',
    companySize: '200-1000',
    notes: 'Looking for developer experience improvements. Multiple signal sources.',
    signalNotes: 'Upvoted 3 devtools on ProductHunt. Company blog mentions CI/CD pain.',
    createdAt: '2025-01-09T11:30:00Z',
    updatedAt: '2025-01-12T10:00:00Z',
  },
  {
    id: '5',
    company: 'IoT Dynamics',
    contactName: 'Lisa Thompson',
    title: 'Engineering Manager',
    email: 'lisa@iotdynamics.co',
    source: 'LinkedIn',
    fitScore: 68,
    status: 'new',
    industry: 'IoT Platform',
    companySize: '50-200',
    notes: 'Growing fast, posted 5 firmware roles in past week.',
    signalNotes: 'Growing fast, posted 5 firmware roles. Likely has tooling budget.',
    createdAt: '2025-01-13T14:00:00Z',
    updatedAt: '2025-01-13T14:00:00Z',
  },
  {
    id: '6',
    company: 'NexaCore Systems',
    contactName: 'James Wilson',
    title: 'CEO',
    email: 'jw@nexacore.sys',
    source: 'Referral',
    fitScore: 95,
    status: 'qualified',
    industry: 'Embedded AI',
    companySize: '10-50',
    notes: 'Referred by existing customer. Looking to scale outreach efforts.',
    signalNotes: 'Warm referral from EmbedScale. Explicitly asked about our services.',
    createdAt: '2025-01-11T09:00:00Z',
    updatedAt: '2025-01-14T10:00:00Z',
  },
  {
    id: '7',
    company: 'QuantumBits',
    contactName: 'Rachel Kim',
    title: 'Lead Firmware Engineer',
    email: 'rachel@quantumbits.dev',
    source: 'GitHub',
    fitScore: 78,
    status: 'contacted',
    industry: 'Quantum Computing',
    companySize: '50-200',
    notes: 'Starred our repos, active in embedded Rust community.',
    signalNotes: 'Starred 2 of our repos. Active contributor to embedded Rust projects.',
    createdAt: '2025-01-07T13:00:00Z',
    updatedAt: '2025-01-13T15:00:00Z',
  },
  {
    id: '8',
    company: 'SensorFlow',
    contactName: 'Tom Bradley',
    title: 'CTO',
    email: 'tom@sensorflow.io',
    source: 'Conference',
    fitScore: 88,
    status: 'proposal',
    industry: 'IoT Sensors',
    companySize: '10-50',
    notes: 'Met at Embedded World 2025. Interested in agent-based automation.',
    signalNotes: 'Met at Embedded World 2025. Requested demo explicitly.',
    createdAt: '2025-01-06T10:00:00Z',
    updatedAt: '2025-01-12T11:00:00Z',
  },
  {
    id: '9',
    company: 'ByteForge',
    contactName: 'Nina Patel',
    title: 'VP Product',
    email: 'nina@byteforge.co',
    source: 'ProductHunt',
    fitScore: 83,
    status: 'new',
    industry: 'Developer Tools',
    companySize: '50-200',
    notes: 'Hunting for firmware devtools on ProductHunt regularly.',
    signalNotes: 'Upvoted 5 firmware tools this month. Posted about DX challenges.',
    createdAt: '2025-01-14T07:00:00Z',
    updatedAt: '2025-01-14T07:00:00Z',
  },
  {
    id: '10',
    company: 'EdgeCompute',
    contactName: 'Alex Morgan',
    title: 'Engineering Director',
    email: 'alex@edgecompute.ai',
    source: 'LinkedIn',
    fitScore: 71,
    status: 'new',
    industry: 'Edge Computing',
    companySize: '200-1000',
    notes: 'Edge AI infrastructure company. Growing firmware team.',
    signalNotes: 'Posted about scaling firmware team. Liked our LinkedIn content.',
    createdAt: '2025-01-12T08:00:00Z',
    updatedAt: '2025-01-12T08:00:00Z',
  },
  {
    id: '11',
    company: 'MicroLogic',
    contactName: 'Chris Adams',
    title: 'Founder',
    email: 'chris@micrologic.dev',
    source: 'Twitter',
    fitScore: 45,
    status: 'closed_lost',
    industry: 'Microcontrollers',
    companySize: '1-10',
    notes: 'Solo founder, early stage. Low budget but high enthusiasm.',
    signalNotes: 'Solo founder, no budget signal. Early stage, not a fit right now.',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-10T14:00:00Z',
  },
  {
    id: '12',
    company: 'RoboTech Industries',
    contactName: 'Maria Gonzalez',
    title: 'Head of Engineering',
    email: 'maria@robotech.ind',
    source: 'Referral',
    fitScore: 89,
    status: 'contacted',
    industry: 'Robotics',
    companySize: '200-1000',
    notes: 'Referred by SensorFlow. Strong fit for enterprise plan.',
    signalNotes: 'Warm referral. Enterprise-grade robotics firm. High ACV potential.',
    createdAt: '2025-01-09T09:00:00Z',
    updatedAt: '2025-01-13T16:00:00Z',
  },
  {
    id: '13',
    company: 'CloudSilicon',
    contactName: 'Kevin Liu',
    title: 'Senior Engineer',
    email: 'kevin@cloudsilicon.com',
    source: 'GitHub',
    fitScore: 62,
    status: 'new',
    industry: 'Cloud Hardware',
    companySize: '1000+',
    notes: 'Individual contributor, not decision maker. Could be champion.',
    signalNotes: 'Not a decision maker but highly engaged. Potential internal champion.',
    createdAt: '2025-01-13T11:00:00Z',
    updatedAt: '2025-01-13T11:00:00Z',
  },
  {
    id: '14',
    company: 'AeroSystems',
    contactName: 'Diana Reed',
    title: 'CTO',
    email: 'diana@aerosystems.aero',
    source: 'Conference',
    fitScore: 94,
    status: 'negotiating',
    industry: 'Aerospace',
    companySize: '200-1000',
    notes: 'Met at drone expo. Needs firmware automation for fleet management.',
    signalNotes: 'Met at Drone Expo 2025. Explicit need for fleet firmware automation.',
    createdAt: '2025-01-04T08:00:00Z',
    updatedAt: '2025-01-14T09:00:00Z',
  },
  {
    id: '15',
    company: 'GreenTech Embedded',
    contactName: 'Sam Torres',
    title: 'VP Engineering',
    email: 'sam@greentech.io',
    source: 'LinkedIn',
    fitScore: 76,
    status: 'qualified',
    industry: 'CleanTech',
    companySize: '50-200',
    notes: 'Sustainability-focused IoT company. Values-aligned potential partner.',
    signalNotes: 'Posted about sustainable IoT. Values-aligned. Good partnership potential.',
    createdAt: '2025-01-08T12:00:00Z',
    updatedAt: '2025-01-11T14:00:00Z',
  },
];

// ==========================================
// Approval queue items
// ==========================================
const approvals: ApprovalItem[] = [
  {
    id: '1',
    type: 'outreach',
    status: 'pending_approval',
    title: 'TechCorp Industries',
    preview: 'Subject: Embedded AI at Scale — A Note from FieldCraft. Hey [Name], I noticed TechCorp is hiring firmware engineers with ML experience. We specialize in building AI agent swarms that automate lead generation and content creation for embedded teams. I\'d love to show you how we scaled our outreach 3x without adding headcount. Worth a 15-min chat?',
    metadata: {
      leadName: 'TechCorp Industries',
      leadSource: 'LinkedIn',
      fitScore: 87,
      signal: 'Hiring signal detected — 3 firmware roles posted',
    },
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    agentReasoning: 'Lead Intelligence scored this lead at 87% fit due to strong hiring signals and company size match. The CTO posted about CI/CD challenges last week, indicating active pain. I drafted a concise, signal-aware email referencing their hiring + our solution.',
    createdAt: '2025-01-14T14:25:00Z',
  },
  {
    id: '2',
    type: 'content',
    status: 'pending_approval',
    title: 'Why Every Firmware Team Needs an Agent Strategy',
    preview: 'The firmware build pipeline is the new front-end framework. Here\'s why: teams are shipping faster, tools are getting smarter, and the ones who adopt agent-based workflows are pulling ahead. In this post, I break down 3 concrete ways AI agents are transforming how firmware teams work — from automated testing to intelligent documentation.',
    metadata: {
      platform: 'linkedin',
      angle: 'Thought Leadership',
      hashtags: ['#firmware', '#aiagents', '#embedded', '#devtools'],
    },
    agent: 'Copywriting',
    agentColor: '#A78BFA',
    agentReasoning: 'Content Strategy identified "firmware + AI" as a high-engagement topic (predicted 85% engagement). I wrote a LinkedIn-native post with a strong hook, 3 actionable points, and a CTA. The tone matches our engineer-mystic voice — technical depth with aspirational framing.',
    createdAt: '2025-01-14T12:00:00Z',
  },
  {
    id: '3',
    type: 'product',
    status: 'pending_approval',
    title: 'Auto-Firmware-Documentation-Agent',
    preview: 'An agent that automatically generates firmware documentation from source code comments, architecture diagrams, and commit history. Reduces docs overhead by ~70% for teams with mature CI/CD pipelines.',
    metadata: {
      demandScore: 78,
      marketSignal: '47% of surveyed engineers cite docs as top pain point',
      targetAudience: 'Firmware teams with 10+ engineers',
    },
    agent: 'Product Ideation',
    agentColor: '#E879F9',
    agentReasoning: 'Market Research flagged documentation as the #1 pain point across 3 developer surveys. Product Ideation scored this at 78 demand / 82 feasibility. The concept leverages our existing agent infrastructure and could be built in 2-3 sprints.',
    createdAt: '2025-01-14T10:00:00Z',
  },
  {
    id: '4',
    type: 'outreach',
    status: 'pending_approval',
    title: 'EmbedSys Labs',
    preview: 'Subject: CI/CD for Embedded — Saw Your Post. Hi [Name], caught your thread on firmware build times. We built an agent swarm that cut our deployment cycle from 3 days to 4 hours. Happy to share the playbook — no strings attached. Interested?',
    metadata: {
      leadName: 'EmbedSys Labs',
      leadSource: 'ProductHunt',
      fitScore: 92,
      signal: 'Posted about CI/CD challenges for embedded teams',
    },
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    agentReasoning: 'Highest-fit lead in the pipeline at 92%. The CTO personally posted about CI/CD pain on ProductHunt, indicating high intent. I used a "value-first" approach — offering the playbook before asking for anything. Short, punchy, authentic to our voice.',
    createdAt: '2025-01-14T09:30:00Z',
  },
  {
    id: '5',
    type: 'content',
    status: 'pending_approval',
    title: 'Behind the Build: Our Agent Swarm Architecture',
    preview: 'Thread: How 10 AI agents work together to grow our brand while we sleep. 1/ The Orchestrator schedules daily missions. 2/ Lead Intelligence scans 12 sources for signals. 3/ Outreach Drafting personalizes every message. 4/ Content Strategy plans the calendar. 5/ Copywriting handles the words...',
    metadata: {
      platform: 'twitter',
      angle: 'Behind the Scenes',
      hashtags: ['#buildinpublic', '#ai', '#agentswarm'],
    },
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    agentReasoning: 'Twitter threads about our own architecture perform 2x better than generic content. This thread breaks down each agent\'s role in a narrative format — educational, transparent, and subtly promotional. I structured it as a numbered thread for maximum retweetability.',
    createdAt: '2025-01-14T08:00:00Z',
  },
  {
    id: '6',
    type: 'outreach',
    status: 'pending_approval',
    title: 'FirmwareX',
    preview: 'Subject: Quick question about your testing setup. Hey [Name], FirmwareX has been growing fast — congrats on the Series A. I noticed you\'re hiring QA engineers for embedded. We help teams automate firmware testing with AI agents. Curious: are you looking at agent-based approaches?',
    metadata: {
      leadName: 'FirmwareX',
      leadSource: 'Twitter',
      fitScore: 74,
      signal: 'Series A announcement + hiring QA for embedded',
    },
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    agentReasoning: 'Mid-fit lead (74%) but high timing relevance due to Series A. Using a question-based CTA to start a conversation rather than pitch hard. The "curious" tone matches our engineer-to-engineer approach.',
    createdAt: '2025-01-13T16:00:00Z',
  },
  {
    id: '7',
    type: 'product',
    status: 'pending_approval',
    title: 'Build Pipeline Visualizer for Firmware Teams',
    preview: 'Real-time visualization tool for firmware build pipelines. Identifies bottlenecks, tracks build times across commits, and suggests optimizations. Think "GitHub Actions insights" but purpose-built for embedded toolchains.',
    metadata: {
      demandScore: 65,
      marketSignal: 'Common pain point in 73% of firmware team surveys',
      targetAudience: 'Firmware teams using CI/CD',
    },
    agent: 'Product Ideation',
    agentColor: '#E879F9',
    agentReasoning: 'Lower demand score (65) but extremely high feasibility (90%). This is a "quick win" — we could ship an MVP in 2 weeks using existing infra. The visualizer also serves as a top-of-funnel content piece and lead magnet.',
    createdAt: '2025-01-13T14:00:00Z',
  },
  {
    id: '8',
    type: 'content',
    status: 'pending_approval',
    title: '5 Signs Your CI/CD Pipeline Needs an Agent',
    preview: '1. Builds fail silently and nobody notices for hours. 2. Your test suite takes longer than your lunch break. 3. Documentation is always "next sprint." 4. You have 3 different tools that don\'t talk to each other. 5. Your team spends more time on process than product. Sound familiar? Here\'s what we did about it...',
    metadata: {
      platform: 'instagram',
      angle: 'Educational Carousel',
      hashtags: ['#cicd', '#devops', '#firmware', '#automation'],
    },
    agent: 'Copywriting',
    agentColor: '#A78BFA',
    agentReasoning: 'Instagram carousels with numbered lists get 40% more saves. This one bridges universal CI/CD pain points with our agent solution. The hook is relatable ("Sound familiar?") and the carousel format encourages swipe-through engagement.',
    createdAt: '2025-01-13T11:00:00Z',
  },
  {
    id: '9',
    type: 'outreach',
    status: 'pending_approval',
    title: 'IoT Dynamics',
    preview: 'Subject: Scaling IoT fleets without the firmware headache. Hi [Name], IoT Dynamics is expanding fast — I saw the hiring push for firmware engineers. We help IoT teams automate OTA updates, testing, and documentation with AI agents. One customer cut their firmware overhead by 60%. Worth a brief call?',
    metadata: {
      leadName: 'IoT Dynamics',
      leadSource: 'LinkedIn',
      fitScore: 68,
      signal: 'Growing fast, posted 5 firmware roles in past week',
    },
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    agentReasoning: 'Fit score of 68 — moderate match. The company is growing and hiring, which signals budget and need. I referenced their specific hiring signals and included a concrete result (60% overhead reduction) to build credibility.',
    createdAt: '2025-01-13T10:00:00Z',
  },
];

// ==========================================
// Brand memory
// ==========================================
const brandMemory: BrandMemoryEntry[] = [
  {
    id: '1',
    category: 'voice',
    key: 'tone',
    value: 'Precise, technically grounded, with Hermetic/Jungian metaphors. Engineer-mystic voice.',
    source: 'founder_doc',
    confidence: 95,
    lastUpdated: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    category: 'icp',
    key: 'primary_icp',
    value: 'Firmware engineers at IoT/embedded companies (50-200 employees). Series A-C startups.',
    source: 'market_research',
    confidence: 88,
    lastUpdated: '2025-01-12T14:00:00Z',
  },
  {
    id: '3',
    category: 'positioning',
    key: 'tagline',
    value: 'FieldCraft Digital — Intelligence for the Embedded World',
    source: 'founder_doc',
    confidence: 97,
    lastUpdated: '2025-01-08T09:00:00Z',
  },
  {
    id: '4',
    category: 'messaging',
    key: 'value_prop',
    value: 'AI agents that understand firmware, find your ideal customers, and grow your brand while you ship.',
    source: 'copywriting_agent',
    confidence: 82,
    lastUpdated: '2025-01-13T16:00:00Z',
  },
  {
    id: '5',
    category: 'values',
    key: 'core_values',
    value: '1. Ship fast, iterate faster. 2. Technical depth over surface hype. 3. Agents augment humans.',
    source: 'team_workshop',
    confidence: 90,
    lastUpdated: '2025-01-11T11:00:00Z',
  },
];

// ==========================================
// Market signals
// ==========================================
const marketSignals: MarketSignal[] = [
  {
    id: '1',
    source: 'ProductHunt',
    category: 'ai_agents',
    summary: 'AI agent tooling market grew 23% month-over-month',
    url: 'https://producthunt.com',
    impact: 'high',
    relevanceScore: 92,
    discoveredBy: 'Market Research',
    discoveredAt: '2025-01-14T10:00:00Z',
  },
  {
    id: '2',
    source: 'HackerNews',
    category: 'firmware',
    summary: 'Major discussion on firmware CI/CD challenges (847 comments)',
    url: 'https://news.ycombinator.com',
    impact: 'high',
    relevanceScore: 88,
    discoveredBy: 'Market Research',
    discoveredAt: '2025-01-13T14:00:00Z',
  },
  {
    id: '3',
    source: 'LinkedIn',
    category: 'hiring',
    summary: '47 new firmware engineering roles posted in past 7 days',
    url: 'https://linkedin.com',
    impact: 'medium',
    relevanceScore: 76,
    discoveredBy: 'Lead Intelligence',
    discoveredAt: '2025-01-12T09:00:00Z',
  },
];

// ==========================================
// Content calendar (from dashboard content page)
// ==========================================
const content: ContentCalendar[] = [
  {
    id: '1', title: 'Why Firmware Engineers Need Agents', platform: 'blog', status: 'approved',
    scheduledDate: '2025-01-15T10:00:00Z', draftContent: 'The firmware build pipeline is the new front-end framework. As embedded systems grow in complexity, the need for intelligent automation becomes critical...',
    hashtags: ['#firmware', '#aiagents', '#embedded'], engagement_prediction: 85,
    createdBy: 'Copywriting', createdAt: '2025-01-13T10:00:00Z',
  },
  {
    id: '2', title: '5 Signs Your CI/CD Pipeline Needs an Agent', platform: 'linkedin', status: 'published',
    scheduledDate: '2025-01-14T09:00:00Z', draftContent: '1. Builds fail silently. 2. Rollbacks take hours. 3. Test coverage is a mystery. 4. Deployments are feared. 5. Your team is burned out...',
    hashtags: ['#cicd', '#devops', '#firmware'], engagement_prediction: 72,
    createdBy: 'Social Publishing', createdAt: '2025-01-12T14:00:00Z',
  },
  {
    id: '3', title: 'Behind the Build: Our Agent Swarm Architecture', platform: 'twitter', status: 'in_progress',
    scheduledDate: '2025-01-16T14:00:00Z', draftContent: 'Thread: How 10 AI agents work together to grow our brand. Each agent has a role, a voice, and a mission...',
    hashtags: ['#buildinpublic', '#ai'], engagement_prediction: 90,
    createdBy: 'Content Strategy', createdAt: '2025-01-13T16:00:00Z',
  },
  {
    id: '4', title: 'The Future of Embedded DevTools', platform: 'instagram', status: 'pending_approval',
    scheduledDate: '2025-01-17T11:00:00Z', draftContent: 'Carousel: 5 slides on where embedded tooling is headed in 2025. From AI-assisted debugging to automated testing...',
    hashtags: ['#embedded', '#devtools', '#future'], engagement_prediction: 68,
    createdBy: 'Content Strategy', createdAt: '2025-01-14T09:00:00Z',
  },
  {
    id: '5', title: 'From Alchemy to Engineering: Agent Design Patterns', platform: 'blog', status: 'in_progress',
    scheduledDate: '2025-01-18T09:00:00Z', draftContent: 'The hermetic principle of correspondence applies to agent architecture. As above, so below — each micro-agent reflects the whole...',
    hashtags: ['#aiagents', '#designpatterns', '#engineering'], engagement_prediction: 92,
    createdBy: 'Copywriting', createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: '6', title: '3 IoT Security Mistakes That Cost Millions', platform: 'linkedin', status: 'pending_approval',
    scheduledDate: '2025-01-15T13:00:00Z', draftContent: 'The most expensive IoT security failures all share one thing: they were preventable. Here is what we learned analyzing 47 breaches...',
    hashtags: ['#iot', '#security', '#firmware'], engagement_prediction: 78,
    createdBy: 'Content Strategy', createdAt: '2025-01-14T11:00:00Z',
  },
  {
    id: '7', title: 'A Day in the Life: Our Lead Intelligence Agent', platform: 'instagram', status: 'in_progress',
    scheduledDate: '2025-01-20T15:00:00Z', draftContent: 'Reel: 30-second glimpse into how our Lead Intelligence Agent finds and scores prospects while we sleep...',
    hashtags: ['#behindthescenes', '#ai', '#automation'], engagement_prediction: 65,
    createdBy: 'Social Publishing', createdAt: '2025-01-16T10:00:00Z',
  },
  {
    id: '8', title: 'Memory Management in Multi-Agent Systems', platform: 'blog', status: 'approved',
    scheduledDate: '2025-01-22T10:00:00Z', draftContent: 'How do 10 agents share context without stepping on each other? The answer lies in a hybrid vector-graph memory architecture...',
    hashtags: ['#multiagent', '#memory', '#ai'], engagement_prediction: 88,
    createdBy: 'Copywriting', createdAt: '2025-01-17T14:00:00Z',
  },
  {
    id: '9', title: 'The Firmware Engineer\'s Guide to AI Agents', platform: 'linkedin', status: 'published',
    scheduledDate: '2025-01-10T09:00:00Z', draftContent: 'A practical guide for firmware engineers looking to leverage AI agents in their daily workflow...',
    hashtags: ['#firmware', '#ai', '#guide'], engagement_prediction: 95,
    createdBy: 'Social Publishing', createdAt: '2025-01-08T12:00:00Z',
  },
  {
    id: '10', title: 'Build in Public: Week 3 Recap', platform: 'twitter', status: 'published',
    scheduledDate: '2025-01-13T16:00:00Z', draftContent: 'Week 3: +127 followers, 3 new leads, 1 viral post. Here is what worked and what did not...',
    hashtags: ['#buildinpublic', '#indiehackers'], engagement_prediction: 70,
    createdBy: 'Content Strategy', createdAt: '2025-01-13T12:00:00Z',
  },
  {
    id: '11', title: 'Why We Chose Rust for Our Agent Runtime', platform: 'blog', status: 'pending_approval',
    scheduledDate: '2025-01-24T10:00:00Z', draftContent: 'Performance, safety, and concurrency. Three reasons Rust was the only choice for our agent runtime...',
    hashtags: ['#rust', '#performance', '#agents'], engagement_prediction: 82,
    createdBy: 'Copywriting', createdAt: '2025-01-19T09:00:00Z',
  },
  {
    id: '12', title: 'Meet the Copywriting Agent', platform: 'instagram', status: 'in_progress',
    scheduledDate: '2025-01-21T12:00:00Z', draftContent: 'Story series: How our Copywriting Agent crafts posts that sound human, not hype...',
    hashtags: ['#aiwriting', '#contentcreation'], engagement_prediction: 60,
    createdBy: 'Social Publishing', createdAt: '2025-01-18T10:00:00Z',
  },
  {
    id: '13', title: 'Signal Processing: Finding Leads in the Noise', platform: 'linkedin', status: 'approved',
    scheduledDate: '2025-01-19T09:00:00Z', draftContent: 'How Lead Intelligence separates signal from noise using a multi-layer filtering approach...',
    hashtags: ['#leads', '#ai', '#signalprocessing'], engagement_prediction: 75,
    createdBy: 'Content Strategy', createdAt: '2025-01-16T14:00:00Z',
  },
  {
    id: '14', title: 'The Jungian Shadow of Technical Debt', platform: 'blog', status: 'in_progress',
    scheduledDate: '2025-01-25T10:00:00Z', draftContent: 'What Carl Jung can teach us about confronting and integrating technical debt into our development psyche...',
    hashtags: ['#technicaldebt', '#psychology', '#engineering'], engagement_prediction: 88,
    createdBy: 'Copywriting', createdAt: '2025-01-20T08:00:00Z',
  },
  {
    id: '15', title: 'Agent Swarm Metrics That Actually Matter', platform: 'twitter', status: 'in_progress',
    scheduledDate: '2025-01-23T14:00:00Z', draftContent: 'Thread: The 5 metrics we track to measure our agent swarm performance. Spoiler: it is not just engagement...',
    hashtags: ['#metrics', '#ai', '#buildinpublic'], engagement_prediction: 73,
    createdBy: 'Content Strategy', createdAt: '2025-01-19T10:00:00Z',
  },
  {
    id: '16', title: 'Scaling Firmware Teams with AI', platform: 'linkedin', status: 'pending_approval',
    scheduledDate: '2025-01-28T09:00:00Z', draftContent: 'How 3 firmware engineers using AI agents can outperform a team of 10. Real numbers from our clients...',
    hashtags: ['#firmware', '#scaling', '#ai'], engagement_prediction: 80,
    createdBy: 'Social Publishing', createdAt: '2025-01-22T11:00:00Z',
  },
  {
    id: '17', title: 'The Engineer-Mystic Manifesto', platform: 'instagram', status: 'new',
    scheduledDate: '2025-01-30T15:00:00Z', draftContent: 'Our brand ethos: precision meets intuition. Technical depth with Hermetic wisdom...',
    hashtags: ['#engineermystic', '#brand', '#philosophy'], engagement_prediction: 55,
    createdBy: 'Brand Memory', createdAt: '2025-01-25T10:00:00Z',
  },
  {
    id: '18', title: 'RTOS Migration: A Practical Playbook', platform: 'blog', status: 'approved',
    scheduledDate: '2025-01-27T10:00:00Z', draftContent: 'Migrating from bare-metal to an RTOS? Here is the step-by-step playbook we wish we had...',
    hashtags: ['#rtos', '#embedded', '#migration'], engagement_prediction: 86,
    createdBy: 'Copywriting', createdAt: '2025-01-23T14:00:00Z',
  },
];

// ==========================================
// Product ideas (from dashboard products page)
// ==========================================
const productIdeas: ProductIdea[] = [
  {
    id: '1', title: 'Auto-Firmware-Docs Agent',
    description: 'An AI agent that automatically generates firmware documentation from source code, architecture diagrams, and commit messages. Reduces documentation time by 80% for embedded teams.',
    demandScore: 78, feasibilityScore: 82, stage: 'new',
    targetAudience: 'IoT security teams',
    tags: ['security', 'iot', 'firmware'],
    signals: ['200+ forum mentions', '3 enterprise requests'],
    createdBy: 'Product Ideation', createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2', title: 'Embedded-AI-Tester',
    description: 'Automated testing framework that uses AI to generate test cases for embedded firmware. Covers edge cases humans miss and runs in simulated hardware environments.',
    demandScore: 65, feasibilityScore: 71, stage: 'new',
    targetAudience: 'Firmware teams',
    tags: ['ai', 'testing', 'embedded'],
    signals: ['Growing test automation market', 'Community requests'],
    createdBy: 'Product Ideation', createdAt: '2025-01-08T14:00:00Z',
  },
  {
    id: '3', title: 'Agent-Swarm-Visualizer',
    description: 'Real-time 3D visualization of agent swarm operations. Watch your agents communicate, delegate, and execute tasks in a live network graph.',
    demandScore: 82, feasibilityScore: 88, stage: 'new',
    targetAudience: 'AI developers',
    tags: ['visualization', 'agents', 'devtools'],
    signals: ['High social engagement', 'YC interest'],
    createdBy: 'Product Ideation', createdAt: '2025-01-05T09:00:00Z',
  },
  {
    id: '4', title: 'RTOS-Migration-Assistant',
    description: 'Step-by-step migration assistant for moving from bare-metal to RTOS. Analyzes codebase, identifies blocking calls, and generates migration patches.',
    demandScore: 71, feasibilityScore: 75, stage: 'new',
    targetAudience: 'Firmware engineers',
    tags: ['rtos', 'migration', 'devtools'],
    signals: ['Common migration pain point', 'Forum discussions'],
    createdBy: 'Product Ideation', createdAt: '2025-01-14T11:00:00Z',
  },
  {
    id: '5', title: 'Firmware-CI-Agent',
    description: 'AI agent that manages firmware CI/CD pipelines. Automatically optimizes build times, catches integration issues, and suggests parallelization strategies.',
    demandScore: 88, feasibilityScore: 79, stage: 'approved',
    targetAudience: 'DevOps engineers',
    tags: ['cicd', 'firmware', 'devops'],
    signals: ['Validated via 50 engineer survey', '62% expressed interest'],
    createdBy: 'Product Ideation', createdAt: '2025-01-09T09:00:00Z',
  },
  {
    id: '6', title: 'Memory-Leak-Predictor',
    description: 'Static analysis tool that predicts memory leaks in C/C++ firmware before runtime. Uses symbolic execution and ML pattern matching.',
    demandScore: 74, feasibilityScore: 68, stage: 'approved',
    targetAudience: 'Firmware teams',
    tags: ['memory', 'security', 'analysis'],
    signals: ['Enterprise demand confirmed', 'Competitor gap analysis'],
    createdBy: 'Product Ideation', createdAt: '2025-01-07T14:00:00Z',
  },
  {
    id: '7', title: 'Lead-Intelligence-Dashboard',
    description: 'The dashboard you are using right now. Real-time lead scoring, pipeline visualization, and automated outreach tracking for firmware companies.',
    demandScore: 91, feasibilityScore: 85, stage: 'in_progress',
    targetAudience: 'Sales teams',
    tags: ['leads', 'dashboard', 'sales'],
    signals: ['Internal need', 'Customer requests'],
    createdBy: 'Product Ideation', createdAt: '2025-01-03T10:00:00Z',
  },
  {
    id: '8', title: 'Content-Auto-Generator',
    description: 'End-to-end content creation pipeline: from market signal detection to published post. Generates LinkedIn, Twitter, and blog content in the engineer-mystic voice.',
    demandScore: 85, feasibilityScore: 72, stage: 'in_progress',
    targetAudience: 'Marketing teams',
    tags: ['content', 'ai', 'marketing'],
    signals: ['High engagement on generated posts', 'Time savings measured'],
    createdBy: 'Product Ideation', createdAt: '2025-01-06T08:00:00Z',
  },
  {
    id: '9', title: 'Brand-Voice-Validator',
    description: 'Real-time brand voice checker that ensures all agent-generated content matches the engineer-mystic tone. Flags deviations before publication.',
    demandScore: 95, feasibilityScore: 90, stage: 'shipped',
    targetAudience: 'Brand managers',
    tags: ['brand', 'ai', 'validation'],
    signals: ['100% brand consistency achieved', 'Reduced review time by 60%'],
    createdBy: 'Product Ideation', createdAt: '2024-12-15T10:00:00Z',
  },
  {
    id: '10', title: 'Social-Sync-Agent',
    description: 'Cross-platform social media scheduling and analytics agent. Optimizes posting times, tracks engagement, and suggests content adjustments.',
    demandScore: 90, feasibilityScore: 87, stage: 'shipped',
    targetAudience: 'Social media managers',
    tags: ['social', 'analytics', 'scheduling'],
    signals: ['3x engagement improvement', 'Customer testimonials'],
    createdBy: 'Product Ideation', createdAt: '2024-12-20T14:00:00Z',
  },
  {
    id: '11', title: 'OTA-Update-Manager',
    description: 'Simplified over-the-air firmware update management for IoT fleets. Version control, rollback, staged rollout, and monitoring in one dashboard.',
    demandScore: 83, feasibilityScore: 78, stage: 'approved',
    targetAudience: 'IoT operators',
    tags: ['iot', 'updates', 'management'],
    signals: ['Pilot program successful', 'Enterprise LOIs signed'],
    createdBy: 'Product Ideation', createdAt: '2025-01-11T16:00:00Z',
  },
  {
    id: '12', title: 'Signal-Detection-Engine',
    description: 'Market signal detection engine that monitors 50+ sources for firmware industry trends. Identifies rising topics before they peak.',
    demandScore: 87, feasibilityScore: 65, stage: 'in_progress',
    targetAudience: 'Market researchers',
    tags: ['research', 'signals', 'trends'],
    signals: ['Early trend detection validated', 'Beta testing results positive'],
    createdBy: 'Product Ideation', createdAt: '2025-01-02T12:00:00Z',
  },
];

// ==========================================
// Log entries (from dashboard logs page)
// ==========================================
const logs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2025-01-14T09:00:01Z',
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'Starting daily execution cycle. 10 agents registered. Pipeline health check: OK.',
    details: { tokensUsed: 342, executionTime: 890 },
  },
  {
    id: '2',
    timestamp: '2025-01-14T09:00:02Z',
    severity: 'debug',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    message: 'API → GET https://api.producthunt.com/v1/posts',
    pipeline: 'lead',
    details: { endpoint: 'GET /v1/posts', statusCode: 200, latency: 142, tokensUsed: 0, executionTime: 142 },
  },
  {
    id: '3',
    timestamp: '2025-01-14T09:00:03Z',
    severity: 'info',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    message: 'Found 3 new signals from ProductHunt. Top: EmbedSys Labs (fit 94%).',
    pipeline: 'lead',
    details: { rawInput: '{"source": "producthunt", "category": "firmware"}', rawOutput: '{"signals": 3, "top_lead": "EmbedSys Labs", "fit_score": 94}', tokensUsed: 1847, executionTime: 4200 },
  },
  {
    id: '4',
    timestamp: '2025-01-14T09:00:04Z',
    severity: 'metrics',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    message: 'tokens_in: 1,240 | tokens_out: 380 | total: 1,620',
    pipeline: 'lead',
    details: { tokensUsed: 1620, executionTime: 890, rawOutput: '{"cost_estimate": "$0.0048"}' },
  },
  {
    id: '5',
    timestamp: '2025-01-14T09:01:00Z',
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'Assigned priority lead #42 (EmbedSys Labs) to Outreach Drafting. Content Strategy queued for angle generation.',
    details: { tokensUsed: 210, executionTime: 340 },
  },
  {
    id: '6',
    timestamp: '2025-01-14T09:02:00Z',
    severity: 'debug',
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    message: 'Retrieving lead profile for EmbedSys Labs from Brand Memory.',
    pipeline: 'lead',
    details: { endpoint: 'brand_memory.get', statusCode: 200, latency: 56, tokensUsed: 0, executionTime: 56 },
  },
  {
    id: '7',
    timestamp: '2025-01-14T09:02:30Z',
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'DECISION — Prioritized lead #42 (EmbedSys Labs, 94% fit). Route to Outreach for immediate outreach.',
    pipeline: 'lead',
    details: { rawInput: '{"lead_id": 42, "fit_score": 94, "action": "prioritize"}', tokensUsed: 180, executionTime: 210 },
  },
  {
    id: '8',
    timestamp: '2025-01-14T09:03:00Z',
    severity: 'info',
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    message: 'Draft complete for EmbedSys Labs. Subject: "Re: AI Integration at Scale — A Note from FieldCraft". Sent to Approval Queue.',
    pipeline: 'lead',
    details: { rawInput: '{"lead": "EmbedSys Labs", "angle": "value-first technical"}', rawOutput: '{"subject": "Re: AI Integration at Scale", "body": "...", "variant": "A/B"}', tokensUsed: 4521, executionTime: 12500 },
  },
  {
    id: '9',
    timestamp: '2025-01-14T09:03:15Z',
    severity: 'metrics',
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    message: 'tokens_in: 3,120 | tokens_out: 1,401 | total: 4,521 | cost: $0.0135',
    pipeline: 'lead',
    details: { tokensUsed: 4521, executionTime: 12500, rawOutput: '{"cost_estimate": "$0.0135"}' },
  },
  {
    id: '10',
    timestamp: '2025-01-14T09:04:00Z',
    severity: 'info',
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    message: 'Pipeline: Lead Pipeline — State update. Stage: EmbedSys Labs → outreach_drafted.',
    pipeline: 'lead',
    details: { rawInput: '{"lead": "EmbedSys Labs", "new_stage": "outreach_drafted"}', tokensUsed: 120, executionTime: 180 },
  },
  {
    id: '11',
    timestamp: '2025-01-14T09:10:00Z',
    severity: 'info',
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    message: 'Generated 5 post angles for Instagram. Priority: "The Engineer-Mystic Archetype" (brand alignment 96%).',
    pipeline: 'social',
    details: { rawInput: '{"platform": "instagram", "count": 5}', rawOutput: '{"angles": [...], "top_pick": "Engineer-Mystic Archetype"}', tokensUsed: 3200, executionTime: 8700 },
  },
  {
    id: '12',
    timestamp: '2025-01-14T09:12:00Z',
    severity: 'debug',
    agent: 'Brand Memory',
    agentColor: '#9B6BFF',
    message: 'Retrieving brand voice guidelines for tone check. Confidence: 95%.',
    details: { endpoint: 'brand_memory.get', statusCode: 200, latency: 34, tokensUsed: 0, executionTime: 34 },
  },
  {
    id: '13',
    timestamp: '2025-01-14T09:15:00Z',
    severity: 'info',
    agent: 'Copywriting',
    agentColor: '#A78BFA',
    message: 'Completed draft: "Why Firmware Engineers Need Agents" — 1,200 words, 3 SEO keywords. Brand alignment: 94%.',
    pipeline: 'social',
    details: { rawInput: '{"topic": "Why Firmware Engineers Need Agents", "format": "blog"}', rawOutput: '{"word_count": 1200, "keywords": [...], "alignment": 94}', tokensUsed: 8934, executionTime: 18500 },
  },
  {
    id: '14',
    timestamp: '2025-01-14T09:15:30Z',
    severity: 'metrics',
    agent: 'Copywriting',
    agentColor: '#A78BFA',
    message: 'tokens_in: 5,800 | tokens_out: 3,134 | total: 8,934 | cost: $0.0268',
    pipeline: 'social',
    details: { tokensUsed: 8934, executionTime: 18500, rawOutput: '{"cost_estimate": "$0.0268"}' },
  },
  {
    id: '15',
    timestamp: '2025-01-14T09:18:00Z',
    severity: 'warn',
    agent: 'Market Research',
    agentColor: '#2DD4BF',
    message: 'Updated signal: AI agent tooling market +23% MoM. 47 new entrants tracked.',
    details: { rawInput: '{"market": "ai_agent_tooling", "period": "monthly"}', rawOutput: '{"growth": "+23%", "new_entrants": 47}', tokensUsed: 2100, executionTime: 6200 },
  },
  {
    id: '16',
    timestamp: '2025-01-14T09:20:00Z',
    severity: 'info',
    agent: 'Product Ideation',
    agentColor: '#E879F9',
    message: 'Proposed: "Firmware Update Orchestrator" — demand score 82, feasibility 79.',
    pipeline: 'product',
    details: { rawInput: '{"concept": "Firmware Update Orchestrator"}', rawOutput: '{"demand_score": 82, "feasibility": 79}', tokensUsed: 5432, executionTime: 15600 },
  },
  {
    id: '17',
    timestamp: '2025-01-14T09:22:00Z',
    severity: 'info',
    agent: 'Market Research',
    agentColor: '#2DD4BF',
    message: 'Validation: Market size $420M, 34% CAGR. 12 competitors, none with agent-native architecture.',
    pipeline: 'product',
    details: { rawInput: '{"concept": "Firmware Update Orchestrator"}', rawOutput: '{"tam": 420000000, "cagr": 34, "competitors": 12}', tokensUsed: 3800, executionTime: 9400 },
  },
  {
    id: '18',
    timestamp: '2025-01-14T09:25:00Z',
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'Approved "Firmware Update Orchestrator" for prototype. Composite score: 80.5 (above threshold).',
    pipeline: 'product',
    details: { rawInput: '{"decision": "approve", "idea": "Firmware Update Orchestrator"}', tokensUsed: 290, executionTime: 450 },
  },
  {
    id: '19',
    timestamp: '2025-01-14T09:30:00Z',
    severity: 'warn',
    agent: 'Analytics & Feedback',
    agentColor: '#A3E635',
    message: 'Weekly report: LinkedIn CTR dropped 8% (3.2% → 2.9%). Flagging for Content Strategy.',
    details: { rawInput: '{"platform": "linkedin", "metric": "ctr"}', rawOutput: '{"change": -8, "current": 2.9, "previous": 3.2}', tokensUsed: 1200, executionTime: 3400 },
  },
  {
    id: '20',
    timestamp: '2025-01-14T09:32:00Z',
    severity: 'info',
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    message: 'Adjusted content mix to 70% technical / 30% brand. Generating new technical angles.',
    pipeline: 'social',
    details: { rawInput: '{"technical_ratio": 0.7, "brand_ratio": 0.3}', tokensUsed: 1800, executionTime: 5200 },
  },
  {
    id: '21',
    timestamp: '2025-01-14T09:40:00Z',
    severity: 'error',
    agent: 'Social Publishing',
    agentColor: '#7DD3FC',
    message: 'Failed to publish to Instagram API. Error: 429 Rate Limited — retry after 3600s.',
    pipeline: 'social',
    details: { endpoint: 'POST /v1/media/publish', statusCode: 429, latency: 230, stackTrace: 'at publishPost (social_publisher.ts:142)\n  at async publishToInstagram (social_publisher.ts:89)\n  at async SocialPublishing.run (index.ts:245)', tokensUsed: 0, executionTime: 230 },
  },
  {
    id: '22',
    timestamp: '2025-01-14T09:41:00Z',
    severity: 'info',
    agent: 'Social Publishing',
    agentColor: '#7DD3FC',
    message: 'Retry scheduled: Instagram post queued for 10:40 UTC (rate limit backoff).',
    pipeline: 'social',
    details: { rawInput: '{"retry_at": "10:40:00", "backoff": "exponential"}', tokensUsed: 80, executionTime: 120 },
  },
  {
    id: '23',
    timestamp: '2025-01-14T09:45:00Z',
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'Mid-morning sync: 5 tasks queued, 2 in approval, 1 decision pending. Pipeline health: 94%.',
    details: { tokensUsed: 180, executionTime: 210 },
  },
  {
    id: '24',
    timestamp: '2025-01-14T09:50:00Z',
    severity: 'info',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    message: 'Second batch: ChipCraft Labs (fit 81%), IoT Dynamics (fit 68% — deferred).',
    pipeline: 'lead',
    details: { rawInput: '{"batch": 2}', rawOutput: '{"leads": [{"name": "ChipCraft Labs", "fit": 81}, {"name": "IoT Dynamics", "fit": 68}]}', tokensUsed: 950, executionTime: 2800 },
  },
  {
    id: '25',
    timestamp: '2025-01-14T09:51:00Z',
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'Approved outreach for ChipCraft Labs. IoT Dynamics deferred — re-evaluate in 48h.',
    pipeline: 'lead',
    details: { rawInput: '{"lead": "ChipCraft Labs", "action": "approve"}', tokensUsed: 150, executionTime: 180 },
  },
  {
    id: '26',
    timestamp: '2025-01-14T09:55:00Z',
    severity: 'info',
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    message: 'ChipCraft outreach drafted. Subject: "CI/CD for Semiconductors — FieldCraft". Sent to Approval Queue.',
    pipeline: 'lead',
    details: { rawInput: '{"lead": "ChipCraft Labs", "angle": "dx-focused"}', rawOutput: '{"subject": "CI/CD for Semiconductors", "body": "..."}', tokensUsed: 3200, executionTime: 9800 },
  },
  {
    id: '27',
    timestamp: '2025-01-14T10:00:00Z',
    severity: 'info',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'Hourly cycle complete. 3 outreach drafts, 1 content approved, 1 product validated. Next cycle: 11:00 UTC.',
    details: { tokensUsed: 220, executionTime: 310 },
  },
  {
    id: '28',
    timestamp: '2025-01-14T10:01:00Z',
    severity: 'metrics',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    message: 'Cycle summary: total_tokens: 28,847 | total_cost: $0.086 | avg_latency: 4.2s | agents_used: 8/10',
    details: { tokensUsed: 28847, executionTime: 4200, rawOutput: '{"total_cost": "$0.086", "avg_latency": 4200, "agents_used": 8}' },
  },
  {
    id: '29',
    timestamp: '2025-01-14T10:05:00Z',
    severity: 'debug',
    agent: 'Brand Memory',
    agentColor: '#9B6BFF',
    message: 'Brand voice consistency check: recent drafts at 91% alignment (target: 90%). Within range.',
    details: { rawInput: '{"check": "voice_consistency"}', rawOutput: '{"alignment": 91, "target": 90}', tokensUsed: 450, executionTime: 890 },
  },
  {
    id: '30',
    timestamp: '2025-01-14T10:10:00Z',
    severity: 'warn',
    agent: 'Analytics & Feedback',
    agentColor: '#A3E635',
    message: 'Token usage alert: 82% of daily budget consumed. Consider rate limiting non-critical agents.',
    details: { rawInput: '{"budget": "daily_tokens"}', rawOutput: '{"consumed": 0.82, "remaining": 0.18}', tokensUsed: 80, executionTime: 120 },
  },
  {
    id: '31',
    timestamp: '2025-01-14T10:12:00Z',
    severity: 'info',
    agent: 'Social Publishing',
    agentColor: '#7DD3FC',
    message: 'LinkedIn post published successfully. Engagement tracking enabled.',
    pipeline: 'social',
    details: { rawInput: '{"platform": "linkedin", "action": "publish"}', rawOutput: '{"post_id": "li_48291", "status": "live"}', tokensUsed: 0, executionTime: 1200 },
  },
  {
    id: '32',
    timestamp: '2025-01-14T10:15:00Z',
    severity: 'info',
    agent: 'Product Ideation',
    agentColor: '#E879F9',
    message: 'Scoring updated: Auto-Firmware-Scanner demand score revised to 81 (+3 from new signals).',
    pipeline: 'product',
    details: { rawInput: '{"idea": "Auto-Firmware-Scanner"}', rawOutput: '{"demand_score": 81, "change": +3}', tokensUsed: 680, executionTime: 1900 },
  },
];

// ==========================================
// Chat messages (from dashboard chat page)
// ==========================================
const messages: ChatMessage[] = [
  {
    id: 's1',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    timestamp: '09:00:00',
    content: 'Orchestrator initiated daily cycle at 09:00 UTC. All 10 agents registered and ready.',
    type: 'system',
  },
  {
    id: 'm1',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    recipient: 'All',
    timestamp: '09:00:15',
    content: 'Priority today: Lead Intelligence reports 3 new high-fit leads from ProductHunt. Content Strategy, please prepare angles. Outreach Drafting, stand by for lead scoring completion.',
    type: 'message',
    reasoning: 'Assessing daily priorities based on signal strength and pipeline capacity. Lead Intelligence has the strongest signal today. Content pipeline needs fresh angles for the week.',
  },
  {
    id: 'm2',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    recipient: 'Orchestrator',
    timestamp: '09:01:42',
    content: "Confirmed. Scans complete. Top lead: 'EmbedSys Labs' — fit score 94%. Hiring 5 firmware engineers. Signal: CEO posted about 'AI integration challenges' on LinkedIn.",
    type: 'message',
    parentId: 'm1',
    threadDepth: 1,
    reasoning: 'Scored EmbedSys Labs across 14 dimensions: company size (52 employees), hiring velocity (5 roles in 30 days), funding stage (Series A), technical relevance (firmware + AI), and social signal recency (CEO post 18 hours ago).',
  },
  {
    id: 'm3',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    recipient: 'Outreach Drafting',
    timestamp: '09:02:08',
    content: 'Priority lead: EmbedSys Labs (94%). Please draft cold outreach. Angle: value-first technical. Reference their firmware hiring and AI integration challenges.',
    type: 'message',
    parentId: 'm2',
    threadDepth: 2,
    reasoning: '94% fit score exceeds our 85% threshold for immediate outreach. CEO LinkedIn post provides a personalized hook. Value-first technical approach aligns with engineer-mystic brand voice.',
  },
  {
    id: 'd1',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    timestamp: '09:02:30',
    content: 'Prioritized lead #42 (EmbedSys Labs, 94% fit) for immediate outreach routing.',
    type: 'decision',
    decisionLabel: 'DECISION: Prioritize Lead #42',
    decisionAction: 'Route to Outreach Drafting for immediate outreach',
  },
  {
    id: 'm4',
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    recipient: 'Orchestrator',
    timestamp: '09:05:17',
    content: "Draft complete. Subject: 'Re: AI Integration at Scale — A Note from FieldCraft'. Draft sent to Approval Queue. A/B test variant included with shorter subject line.",
    type: 'message',
    parentId: 'm3',
    threadDepth: 3,
    reasoning: 'Drafted two variants: (A) references LinkedIn post directly, (B) more subtle value-first approach. Both reference specific firmware hiring signals. Estimated reply rate: 12-15% based on similar outreach patterns.',
  },
  {
    id: 's2',
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    timestamp: '09:10:00',
    content: 'Content Strategy completed weekly angle generation — 5 new angles ready.',
    type: 'system',
  },
  {
    id: 'm5',
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    recipient: 'Copywriting',
    timestamp: '09:10:22',
    content: "5 post angles ready for Instagram. Priority angle: 'The Engineer-Mystic Archetype' — fits our brand voice perfectly. Please draft carousel format, 5 slides.",
    type: 'message',
    reasoning: "'Engineer-Mystic Archetype' scored highest on brand voice alignment (96%) and predicted engagement (8.2%). Derived from Jungian typology trending in dev communities. Carousel format suits the multi-layered concept.",
  },
  {
    id: 'm6',
    agent: 'Copywriting',
    agentColor: '#A78BFA',
    recipient: 'Content Strategy',
    timestamp: '09:15:44',
    content: 'Draft ready. 320 words, 8 hashtags. Sent to Approval Queue. Included a Hermetic metaphor in the hook as requested.',
    type: 'message',
    parentId: 'm5',
    threadDepth: 1,
    reasoning: "Used 'as above, so below' framing to connect firmware engineering with systemic thinking. Voice analysis: 94% brand alignment. Word count optimized for Instagram carousel swipe-through rate.",
  },
  {
    id: 'm7',
    agent: 'Product Ideation',
    agentColor: '#E879F9',
    recipient: 'Market Research',
    timestamp: '09:20:10',
    content: "New proposal: 'Firmware Update Orchestrator' — auto-managed OTA updates for IoT fleets. Demand signals: 200+ forum mentions, 3 enterprise requests. Initial demand score: 82.",
    type: 'message',
    reasoning: 'Analyzed 200+ support tickets and forum threads from the past 30 days. Identified pain point: manual firmware updates across heterogeneous IoT fleets. Three enterprise prospects explicitly requested this capability.',
  },
  {
    id: 'm8',
    agent: 'Market Research',
    agentColor: '#2DD4BF',
    recipient: 'Product Ideation',
    timestamp: '09:22:38',
    content: 'Validation complete. Market size: $420M growing at 34% CAGR. 12 competitors identified, but none with agent-native architecture. Competitive gap confirmed. Feasibility score: 79.',
    type: 'message',
    parentId: 'm7',
    threadDepth: 1,
    reasoning: 'Mapped competitive landscape: incumbent tools are CI/CD-native (OTA via Jenkins/GitHub Actions). No competitor integrates AI agents for update orchestration. TAM calculated from IoT fleet management spend data.',
  },
  {
    id: 'd2',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    timestamp: '09:25:00',
    content: 'Approved "Firmware Update Orchestrator" for prototype pipeline. Demand score 82 + feasibility 79 = composite 80.5, above threshold.',
    type: 'decision',
    decisionLabel: 'DECISION: Approve Prototype',
    decisionAction: 'Add to Product Pipeline — prototype phase',
  },
  {
    id: 's3',
    agent: 'Analytics & Feedback',
    agentColor: '#A3E635',
    timestamp: '09:30:00',
    content: 'Weekly engagement report generated. LinkedIn CTR dropped 8% — flagging for Content Strategy review.',
    type: 'system',
  },
  {
    id: 'm9',
    agent: 'Analytics & Feedback',
    agentColor: '#A3E635',
    recipient: 'Content Strategy',
    timestamp: '09:30:15',
    content: 'CTR analysis: LinkedIn posts with technical deep-dives outperform motivational content 3:1. Consider shifting mix toward technical posts this week. Top performer: "Why Firmware Engineers Need Agents" — 4.2% CTR.',
    type: 'message',
    reasoning: 'Analyzed last 20 posts across platforms. Technical deep-dives (firmware-specific) had mean CTR 3.8% vs motivational content at 1.2%. Sample size: 10,847 impressions. Statistical significance: p < 0.01.',
  },
  {
    id: 'm10',
    agent: 'Content Strategy',
    agentColor: '#FB7185',
    recipient: 'Analytics & Feedback',
    timestamp: '09:32:00',
    content: 'Acknowledged. Will adjust content mix to 70% technical / 30% brand this week. Generating new technical angles now.',
    type: 'message',
    parentId: 'm9',
    threadDepth: 1,
  },
  {
    id: 'm11',
    agent: 'Brand Memory',
    agentColor: '#9B6BFF',
    recipient: 'Copywriting',
    timestamp: '09:35:20',
    content: 'Brand voice reminder for upcoming drafts: "Precise, technically grounded, with Hermetic/Jungian metaphors. Engineer-mystic voice." Updated tone guidelines available in Brand Memory.',
    type: 'message',
    reasoning: 'Monitoring draft tone consistency across all agents. Recent drafts showed 87% brand alignment — within range. Proactive reminder before high-volume content day.',
  },
  {
    id: 'm12',
    agent: 'Social Publishing',
    agentColor: '#7DD3FC',
    recipient: 'Orchestrator',
    timestamp: '09:40:00',
    content: 'LinkedIn post published successfully. Engagement tracking enabled. Scheduled Twitter thread for 14:00 UTC — awaiting final approval.',
    type: 'message',
  },
  {
    id: 'm13',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    recipient: 'All',
    timestamp: '09:45:00',
    content: 'Mid-morning sync: 5 tasks queued, 2 in approval, 1 decision pending (Product Ideation). Pipeline health: 94%. All systems nominal.',
    type: 'message',
    reasoning: 'Pipeline health calculated from: task queue depth (5/20 capacity), approval backlog (2 items, < 1hr each), error rate (0% in last 4 hours), agent utilization (87% average).',
  },
  {
    id: 'm14',
    agent: 'Lead Intelligence',
    agentColor: '#38BDF8',
    recipient: 'Orchestrator',
    timestamp: '09:50:15',
    content: 'Second signal batch: ChipCraft Labs (fit 81%) posted 3 firmware roles this week. IoT Dynamics (fit 68%) — lower priority but growing fast. Recommend outreach for ChipCraft.',
    type: 'message',
    reasoning: 'ChipCraft Labs: 81% fit, semiconductor industry, 200-1000 employees, multiple signal sources (ProductHunt + LinkedIn). IoT Dynamics: 68% fit, below threshold but trending upward (+12% in 7 days).',
  },
  {
    id: 'd3',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    timestamp: '09:51:00',
    content: 'Approved outreach for ChipCraft Labs (81% fit). IoT Dynamics deferred — will re-evaluate in 48 hours if score improves.',
    type: 'decision',
    decisionLabel: 'DECISION: Queue Outreach',
    decisionAction: 'Route ChipCraft Labs to Outreach Drafting',
  },
  {
    id: 'm15',
    agent: 'Outreach Drafting',
    agentColor: '#34D399',
    recipient: 'Orchestrator',
    timestamp: '09:55:30',
    content: 'ChipCraft outreach drafted. Subject: "CI/CD for Semiconductors — FieldCraft" . Personalized with their recent DX improvements focus. Sent to Approval Queue.',
    type: 'message',
    parentId: 'd3',
    threadDepth: 1,
    reasoning: 'Referenced ChipCraft Labs developer experience improvements from their engineering blog. Used semiconductor-specific terminology to demonstrate domain fluency.',
  },
  {
    id: 's4',
    agent: 'Orchestrator',
    agentColor: '#F0A84F',
    timestamp: '10:00:00',
    content: 'Hourly cycle complete. 3 outreach drafts queued, 1 content piece approved, 1 product idea validated. Next cycle at 11:00 UTC.',
    type: 'system',
  },
];

// ==========================================
// Brand documents (from dashboard brand page; `icon` stripped)
// ==========================================
const brandDocs: BrandDoc[] = [
  {
    id: 'voice',
    tab: 'voice',
    title: 'Voice & Tone',
    category: 'voice',
    status: 'green',
    lastUpdated: '2025-01-14T10:00:00Z',
    updatedBy: 'Brand Memory',
    content: `# Voice & Tone

## The Engineer-Mystic Voice

FieldCraft Digital speaks as an **engineer-mystic**: precise in technical detail, yet comfortable with Hermetic and Jungian metaphors. We don't dumb down. We illuminate.

> "The craft of firmware is the craft of making the invisible visible — giving consciousness to silicon."

## Tone Principles

1. **Precision First**: Every technical claim is grounded. No fluff, no buzzwords without substance.
2. **Archetypal Depth**: We reference Jungian archetypes, Hermetic principles, and alchemical transformation as genuine frameworks — not as marketing garnish.
3. **Builder's Humility**: We speak from the workbench, not the pedestal. We share what we've learned through doing.
4. **Radical Clarity**: Complex ideas explained simply. Simple ideas explored deeply.

## Voice Checklist

Before publishing, every piece of content should score YES on:

- Would an embedded engineer find this credible?
- Is the technical claim verifiable?
- Does the metaphor serve the meaning (not replace it)?
- Would this sound natural spoken aloud?
- Is there at least one specific, concrete example?

## What We Don't Do

- Use AI buzzwords without technical grounding
- Talk down to our audience
- Chase trends that don't serve our craft
- Publish content we wouldn't send to our smartest engineer friend`,
  },
  {
    id: 'icp',
    tab: 'icp',
    title: 'Ideal Customer Profile',
    category: 'icp',
    status: 'green',
    lastUpdated: '2025-01-12T14:00:00Z',
    updatedBy: 'Market Research',
    content: `# Ideal Customer Profile

## Primary Persona: The Embedded Engineering Lead

**Name**: Alex
**Role**: Senior Firmware Engineer / Engineering Manager
**Company**: Series A–C IoT or robotics startup (20–200 engineers)

### Pain Points

- Firmware team is stretched thin — shipping delayed by 3+ months
- Wants to integrate AI/ML into embedded products but lacks expertise
- Tired of generic AI consultants who don't understand constraints

## Secondary Persona: The Agentic Systems Client

**Name**: Maya
**Role**: AI Coach / Technical Educator / Consultant

### Pain Points

- Wants to build agentic systems for their clients but needs a technical partner
- Looking for a team that understands both AI and real-world implementation
- Values partners who can explain complex systems clearly

## Signals We Look For

- Hiring for firmware + ML roles simultaneously
- CTO posting about technical challenges on LinkedIn
- Open-source contributions in embedded/ML intersection
- Speaking at embedded systems conferences`,
  },
  {
    id: 'positioning',
    tab: 'positioning',
    title: 'Positioning Statement',
    category: 'positioning',
    status: 'green',
    lastUpdated: '2025-01-08T09:00:00Z',
    updatedBy: 'Orchestrator',
    content: `# Positioning Statement

## Market Position

FieldCraft Digital is the **AI-native engineering studio** for embedded and firmware teams who want marketing and growth systems as precise as their code.

## Tagline

> "Intelligence for the Embedded World"

## Value Proposition

AI agents that understand firmware, find your ideal customers, and grow your brand while you ship.

## Differentiation

| Factor | Generic Agencies | FieldCraft |
|--------|-----------------|------------|
| Technical depth | Surface-level | Firmware-native |
| Content quality | SEO fluff | Engineer-credible |
| Lead quality | Volume game | Intent-based scoring |
| Iteration speed | Weekly | Daily |

## Competitive Landscape

- **Traditional marketing agencies**: Lack technical credibility. Engineers can smell inauthenticity.
- **AI content tools**: Generic output, no understanding of embedded domain.
- **Freelance technical writers**: Great content, but inconsistent and hard to scale.

## Positioning Pillars

1. **Technical Authority**: Our agents are trained on firmware, embedded systems, and ML.
2. **Automated Distribution**: Content finds its way to the right channels without manual work.
3. **Data-Driven Iteration**: Every piece of content is measured and improved.`,
  },
  {
    id: 'past_win',
    tab: 'past_win',
    title: 'Past Wins',
    category: 'past_win',
    status: 'green',
    lastUpdated: '2025-01-13T16:00:00Z',
    updatedBy: 'Analytics & Feedback',
    content: `# Past Wins

## Content Wins

### "Why Firmware Engineers Need Agents" — Blog Post

- **Result**: 4,200 organic views in 48 hours
- **Engagement**: 127 LinkedIn shares, 34 comments
- **Lesson**: Technical depth + timely topic (AI agents) = viral in niche
- **Action**: Replicate the formula: deep technical analysis of emerging trend

### CI/CD Pipeline Thread — Twitter/X

- **Result**: 89K impressions, 340 retweets
- **Lesson**: Threads that teach something specific outperform opinion threads
- **Action**: Create more "how we solved X" threads

## Outreach Wins

### EmbedScale — Personalized Outreach

- **Result**: Positive reply within 2 hours, moved to discovery call
- **Approach**: Referenced their GitHub repo and a specific CI/CD challenge
- **Lesson**: Specificity beats personalization at scale

### IoT Dynamics — LinkedIn DM

- **Result**: Booked meeting after 3-message sequence
- **Approach**: Shared relevant case study, then asked thoughtful question
- **Lesson**: Lead with value, not with "let's chat"

## Product Wins

### Agent Swarm Orchestrator Open-Sourcing

- **Result**: 1.2K GitHub stars in first week
- **Lesson**: Engineers engage with tools that solve real workflow problems
- **Action**: Open-source more internal tooling as marketing`,
  },
  {
    id: 'past_fail',
    tab: 'past_fail',
    title: 'Past Failures',
    category: 'past_fail',
    status: 'amber',
    lastUpdated: '2025-01-11T11:00:00Z',
    updatedBy: 'Content Strategy',
    content: `# Past Failures & Lessons

## Content Failures

### "The Future of IoT" — Generic Blog Post

- **Result**: 120 views, 0 engagement
- **Why it failed**: Too generic, no specific take, could have been written by anyone
- **Lesson**: Generic content is invisible content. Specificity is the only signal.

### Instagram Carousel — "5 AI Trends"

- **Result**: 0.3% engagement rate (vs 2.1% average)
- **Why it failed**: Trend-chasing content didn't match our audience. Engineers want depth, not trends.
- **Lesson**: Stay in our lane. Technical depth over trend coverage.

## Outreach Failures

### Batch Personalized Email — TechCorp

- **Result**: Marked as spam
- **Why it failed**: "Personalization" was {FirstName} + {Company}. Too template-y.
- **Lesson**: Real personalization requires research, not merge fields.

### LinkedIn Connection Spam

- **Result**: 3% acceptance rate, 0 replies
- **Why it failed**: Connection requests with pitch in first message
- **Lesson**: Build rapport first. No pitch in the first touch.

## Product Failures

### "Universal Firmware Toolkit" Landing Page

- **Result**: 200 visitors, 0 sign-ups
- **Why it failed**: Value prop too vague. "Universal" = "does nothing well"
- **Lesson**: Specific value props for specific audiences convert better.`,
  },
];

// ==========================================
// Document revision history
// Each revision snapshots the full content of its associated doc.
// ==========================================
function docContent(docId: string): string {
  const doc = brandDocs.find((d) => d.id === docId);
  if (!doc) throw new Error(`seed: unknown brand doc id "${docId}"`);
  return doc.content;
}

const revisions: DocumentRevision[] = [
  { id: 'r1', docId: 'voice', timestamp: '2025-01-14T10:00:00Z', agent: 'Brand Memory', agentColor: '#9B6BFF', changes: 'Updated tone principles with "Builder\'s Humility"', content: docContent('voice') },
  { id: 'r2', docId: 'icp', timestamp: '2025-01-13T16:00:00Z', agent: 'Orchestrator', agentColor: '#F0A84F', changes: 'Refined ICP secondary persona (Maya)', content: docContent('icp') },
  { id: 'r3', docId: 'icp', timestamp: '2025-01-12T14:00:00Z', agent: 'Market Research', agentColor: '#2DD4BF', changes: 'Added signals from LinkedIn hiring data', content: docContent('icp') },
  { id: 'r4', docId: 'past_fail', timestamp: '2025-01-11T11:00:00Z', agent: 'Content Strategy', agentColor: '#FB7185', changes: 'Documented Instagram carousel failure', content: docContent('past_fail') },
  { id: 'r5', docId: 'past_win', timestamp: '2025-01-10T10:00:00Z', agent: 'Analytics & Feedback', agentColor: '#A3E635', changes: 'Added "Why Firmware Engineers Need Agents" win', content: docContent('past_win') },
  { id: 'r6', docId: 'positioning', timestamp: '2025-01-08T09:00:00Z', agent: 'Orchestrator', agentColor: '#F0A84F', changes: 'Created positioning statement v1', content: docContent('positioning') },
];

// ==========================================
// API keys (raw values stay server-side; list endpoints strip them)
// ==========================================
const apiKeys: ApiKeyRecord[] = [
  { id: 'anthropic', name: 'Anthropic API Key', maskedKey: 'sk-ant-••••••••••••••••••••••••••••••', rawKey: 'sk-ant-api03-FIELDCRAFT-PLACEHOLDER-0001', status: 'configured', description: 'For Copywriting, Content Strategy, Outreach Drafting' },
  { id: 'supabase_url', name: 'Supabase URL', maskedKey: 'https://fieldcraft.supabase.co', rawKey: 'https://fieldcraft.supabase.co', status: 'configured', description: 'Database connection URL' },
  { id: 'supabase_key', name: 'Supabase Anon Key', maskedKey: 'eyJhbGci••••••••••••••••••••••••••••••', rawKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fieldcraft-placeholder', status: 'configured', description: 'Anonymous client API key' },
  { id: 'instagram', name: 'Instagram Graph API', maskedKey: '', rawKey: '', status: 'not_set', description: 'For social publishing to Instagram' },
  { id: 'linkedin', name: 'LinkedIn API', maskedKey: '', rawKey: '', status: 'not_set', description: 'For social publishing and lead discovery' },
  { id: 'apollo', name: 'Apollo API', maskedKey: '', rawKey: '', status: 'not_set', description: 'For lead enrichment and contact data' },
];

// ==========================================
// Heatmap (30 days, 2024-12-16 → 2025-01-14)
// Counts come from a fixed-seed mulberry32 PRNG — fully deterministic.
// ==========================================
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildHeatmapData(): HeatmapData[] {
  const rand = mulberry32(42);
  const data: HeatmapData[] = [];
  // Fixed start instant — not "now" — so this is deterministic.
  const startUtc = Date.UTC(2024, 11, 16);
  for (let i = 0; i < 30; i++) {
    data.push({
      date: new Date(startUtc + i * 86400000).toISOString().slice(0, 10),
      count: Math.floor(rand() * 24),
    });
  }
  return data;
}

const heatmapData: HeatmapData[] = buildHeatmapData();

// ==========================================
// Settings
// ==========================================
const scheduleSettings: ScheduleSettings = {
  pipelineFreq: 'Every hour',
  contentDays: ['Mon', 'Wed', 'Fri'],
  leadScanFreq: 'Every 6 hours',
  timeZone: 'America/New_York',
  quietStart: '22:00',
  quietEnd: '07:00',
};

const notificationSettings: NotificationSettings = {
  emailApprovals: true,
  browser: false,
  dailySummary: true,
  newLead: true,
  leadResponse: true,
  contentPublished: false,
  productShipped: true,
  agentError: true,
  cycleComplete: false,
  tokenThreshold: true,
};

const systemSettings: SystemSettings = {
  theme: 'dark',
  retention: '30 days',
};

const agentToggles: AgentToggle[] = agents.map((a) => ({
  id: a.id,
  name: a.name,
  color: a.color,
  description: a.description,
  enabled: true,
  lastRun: a.lastActivity,
}));

const settings: DashboardSettings = {
  schedule: scheduleSettings,
  notifications: notificationSettings,
  system: systemSettings,
  agentToggles,
};

// ==========================================
// Seed assembly
// ==========================================
const seed: StoreState = {
  agents,
  pipelineStatuses,
  activityFeed,
  weeklyMetrics,
  heatmapData,
  marketSignals,
  leads,
  approvals,
  content,
  productIdeas,
  messages,
  logs,
  brandDocs,
  revisions,
  brandMemory,
  apiKeys,
  settings,
  agentRuns: [],
  chatPaused: false,
  counters: {
    lead: 15,
    approval: 9,
    content: 18,
    product: 12,
    message: 0,
    log: 32,
    run: 0,
    revision: 6,
  },
};

/** Returns a FRESH deep copy of the seed on every call. Fully deterministic:
 *  identical output on every call, on server and client. */
export function buildSeed(): StoreState {
  return structuredClone(seed);
}
