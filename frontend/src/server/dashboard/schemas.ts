// SERVER ONLY — zod schemas for `/api/v1` request bodies.
import { z } from 'zod';

const leadStatus = z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiating', 'closed_won', 'closed_lost']);
const pipelineStage = z.enum(['new', 'in_progress', 'pending_approval', 'approved', 'rejected', 'shipped', 'published']);
const platform = z.enum(['instagram', 'linkedin', 'twitter', 'blog']);
const approvalType = z.enum(['outreach', 'content', 'product']);
const agentName = z.enum([
  'Orchestrator',
  'Brand Memory',
  'Lead Intelligence',
  'Outreach Drafting',
  'Content Strategy',
  'Copywriting',
  'Social Publishing',
  'Market Research',
  'Product Ideation',
  'Analytics & Feedback',
]);

// ── Leads ───────────────────────────────────────────────────────────

export const createLeadSchema = z.object({
  company: z.string().min(1),
  contactName: z.string().min(1),
  title: z.string().optional(),
  email: z.email(),
  source: z.string().min(1),
  fitScore: z.number().int().min(0).max(100),
  status: leadStatus,
  industry: z.string().min(1),
  companySize: z.string().min(1),
  notes: z.string(),
  signalNotes: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

// ── Approvals ───────────────────────────────────────────────────────

const approvalMetadata = z.object({
  leadName: z.string().optional(),
  leadSource: z.string().optional(),
  fitScore: z.number().optional(),
  signal: z.string().optional(),
  platform: platform.optional(),
  angle: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  demandScore: z.number().optional(),
  marketSignal: z.string().optional(),
  targetAudience: z.string().optional(),
});

export const createApprovalSchema = z.object({
  type: approvalType,
  title: z.string().min(1),
  preview: z.string(),
  metadata: approvalMetadata.optional(),
  agent: agentName.optional(),
  agentColor: z.string().optional(),
  agentReasoning: z.string().optional(),
});

export const approvalEditsSchema = z.object({
  title: z.string().optional(),
  preview: z.string().optional(),
});

export const decideApprovalSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  edits: approvalEditsSchema.optional(),
});

// ── Content ─────────────────────────────────────────────────────────

export const createPostSchema = z.object({
  title: z.string().min(1),
  platform,
  scheduledDate: z.string().min(1),
  draftContent: z.string(),
  hashtags: z.array(z.string()),
  createdBy: agentName.optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  platform: platform.optional(),
  status: pipelineStage.optional(),
  scheduledDate: z.string().optional(),
  draftContent: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  engagement_prediction: z.number().optional(),
  createdBy: agentName.optional(),
});

// ── Product ideas ───────────────────────────────────────────────────

export const createProductIdeaSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  demandScore: z.number().min(0).max(100),
  feasibilityScore: z.number().min(0).max(100),
  targetAudience: z.string(),
  tags: z.array(z.string()),
  signals: z.array(z.string()),
  createdBy: agentName.optional(),
});

export const updateProductIdeaSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  demandScore: z.number().min(0).max(100).optional(),
  feasibilityScore: z.number().min(0).max(100).optional(),
  stage: pipelineStage.optional(),
  targetAudience: z.string().optional(),
  tags: z.array(z.string()).optional(),
  signals: z.array(z.string()).optional(),
  createdBy: agentName.optional(),
});

// ── Chat ────────────────────────────────────────────────────────────

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  targetAgent: z.string().optional(),
});

export const chatStateSchema = z.object({
  paused: z.boolean(),
});

// ── Brand memory ────────────────────────────────────────────────────

const brandMemoryEntry = z.object({
  id: z.string().min(1),
  category: z.enum(['voice', 'icp', 'positioning', 'messaging', 'values']),
  key: z.string().min(1),
  value: z.string(),
  source: z.string(),
  confidence: z.number().min(0).max(100),
  lastUpdated: z.string().optional(),
});

/** PUT /brand-memory accepts either a doc edit or a full memory-entry replace. */
export const brandMemoryPutSchema = z.union([
  z.object({ docId: z.string().min(1), content: z.string() }),
  z.object({ entries: z.array(brandMemoryEntry) }),
]);

export const restoreRevisionSchema = z.object({
  revisionId: z.string().min(1),
});

// ── Settings ────────────────────────────────────────────────────────

export const saveApiKeySchema = z.object({
  id: z.string().min(1),
  // Empty string clears the key.
  key: z.string(),
});

const agentToggle = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  lastRun: z.string(),
});

export const saveSettingsSchema = z.object({
  schedule: z
    .object({
      pipelineFreq: z.string(),
      contentDays: z.array(z.string()),
      leadScanFreq: z.string(),
      timeZone: z.string(),
      quietStart: z.string(),
      quietEnd: z.string(),
    })
    .partial()
    .optional(),
  notifications: z
    .object({
      emailApprovals: z.boolean(),
      browser: z.boolean(),
      dailySummary: z.boolean(),
      newLead: z.boolean(),
      leadResponse: z.boolean(),
      contentPublished: z.boolean(),
      productShipped: z.boolean(),
      agentError: z.boolean(),
      cycleComplete: z.boolean(),
      tokenThreshold: z.boolean(),
    })
    .partial()
    .optional(),
  system: z
    .object({
      theme: z.enum(['dark', 'light']),
      retention: z.string(),
    })
    .partial()
    .optional(),
  agentToggles: z.array(agentToggle).optional(),
});
