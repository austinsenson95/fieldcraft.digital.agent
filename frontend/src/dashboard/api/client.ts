import type {
  Agent,
  AgentRun,
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

/**
 * Dashboard API client — thin HTTP transport over `/api/v1`.
 *
 * This is the ONLY interface dashboard pages talk to, and THE cloud swap
 * point: set `NEXT_PUBLIC_DASHBOARD_API_URL` to point the dashboard at any
 * backend that implements the same REST surface (see
 * `src/app/api/v1/**` and `src/server/dashboard/`). When the real cloud
 * API lands, no page changes are needed — only this env var changes.
 *
 * Local default: `/api/v1` (the in-memory mock served by this app; note it
 * is ephemeral on serverless until Supabase replaces the store).
 */
const BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_API_URL ?? '/api/v1';

// ── Transport ───────────────────────────────────────────────────────

function qs(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') sp.set(key, value);
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

async function parseError(res: Response): Promise<Error> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) return new Error(body.error);
  } catch {
    // fall through to status text
  }
  return new Error(`Request failed: ${res.status} ${res.statusText}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

async function requestText(path: string): Promise<string> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw await parseError(res);
  return res.text();
}

function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
}

function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
}

function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
}

function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

// ── Overview ────────────────────────────────────────────────────────

export async function getOverview(): Promise<OverviewData> {
  return get<OverviewData>('/overview');
}

export interface RunCycleResult {
  run: AgentRun;
  newLead: Lead;
  newApproval: ApprovalItem;
}

export async function runFullCycle(): Promise<RunCycleResult> {
  return post<RunCycleResult>('/agents/run-cycle');
}

// ── Agents ──────────────────────────────────────────────────────────

export async function listAgents(): Promise<Agent[]> {
  return get<Agent[]>('/agents');
}

// ── Leads ───────────────────────────────────────────────────────────

export interface LeadFilters {
  search?: string;
  source?: string;
  status?: LeadStatus | 'All';
}

function leadQuery(filters?: LeadFilters): string {
  return qs({
    search: filters?.search,
    source: filters?.source,
    status: filters?.status,
  });
}

export async function listLeads(filters?: LeadFilters): Promise<Lead[]> {
  return get<Lead[]>(`/leads${leadQuery(filters)}`);
}

export type CreateLeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  return post<Lead>('/leads', input);
}

export async function updateLead(id: string, patchInput: Partial<Omit<Lead, 'id' | 'createdAt'>>): Promise<Lead> {
  return patch<Lead>(`/leads/${encodeURIComponent(id)}`, patchInput);
}

export async function deleteLead(id: string): Promise<void> {
  await del<{ deleted: boolean }>(`/leads/${encodeURIComponent(id)}`);
}

/** Fetches the CSV route and returns raw text; the download stays client-side. */
export async function exportLeadsCsv(filters?: LeadFilters): Promise<string> {
  return requestText(`/leads/export.csv${leadQuery(filters)}`);
}

// ── Approvals ───────────────────────────────────────────────────────

export interface ApprovalFilters {
  type?: ApprovalType | 'all';
  status?: ApprovalStatus;
  search?: string;
  sort?: 'newest' | 'oldest';
}

export async function listApprovals(filters?: ApprovalFilters): Promise<ApprovalItem[]> {
  return get<ApprovalItem[]>(
    `/approvals${qs({
      type: filters?.type,
      status: filters?.status,
      search: filters?.search,
      sort: filters?.sort,
    })}`
  );
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

export async function createApproval(input: CreateApprovalInput): Promise<ApprovalItem> {
  return post<ApprovalItem>('/approvals', input);
}

export async function updateApproval(id: string, edits: ApprovalEdits): Promise<ApprovalItem> {
  return patch<ApprovalItem>(`/approvals/${encodeURIComponent(id)}`, edits);
}

export async function decideApproval(
  id: string,
  decision: 'approved' | 'rejected',
  edits?: ApprovalEdits
): Promise<ApprovalItem> {
  return post<ApprovalItem>(`/approvals/${encodeURIComponent(id)}/decide`, { decision, edits });
}

// ── Content ─────────────────────────────────────────────────────────

export interface ContentFilters {
  platform?: ContentCalendar['platform'] | 'all';
  status?: PipelineStage | 'all';
  search?: string;
}

export async function listContent(filters?: ContentFilters): Promise<ContentCalendar[]> {
  return get<ContentCalendar[]>(
    `/content${qs({
      platform: filters?.platform,
      status: filters?.status,
      search: filters?.search,
    })}`
  );
}

export type CreatePostInput = Omit<ContentCalendar, 'id' | 'createdAt' | 'status' | 'engagement_prediction' | 'createdBy'> & {
  createdBy?: ContentCalendar['createdBy'];
};

export async function createPost(input: CreatePostInput): Promise<ContentCalendar> {
  return post<ContentCalendar>('/content', input);
}

export async function updatePost(id: string, patchInput: Partial<Omit<ContentCalendar, 'id' | 'createdAt'>>): Promise<ContentCalendar> {
  return patch<ContentCalendar>(`/content/${encodeURIComponent(id)}`, patchInput);
}

export async function updatePostStatus(id: string, status: PipelineStage): Promise<ContentCalendar> {
  return updatePost(id, { status });
}

export async function deletePost(id: string): Promise<void> {
  await del<{ deleted: boolean }>(`/content/${encodeURIComponent(id)}`);
}

// ── Product ideas ───────────────────────────────────────────────────

export async function listProductIdeas(): Promise<ProductIdea[]> {
  return get<ProductIdea[]>('/products');
}

export type CreateProductIdeaInput = Omit<ProductIdea, 'id' | 'createdAt' | 'stage' | 'createdBy'> & {
  createdBy?: ProductIdea['createdBy'];
};

export async function createProductIdea(input: CreateProductIdeaInput): Promise<ProductIdea> {
  return post<ProductIdea>('/products', input);
}

export async function updateProductIdea(id: string, patchInput: Partial<Omit<ProductIdea, 'id' | 'createdAt'>>): Promise<ProductIdea> {
  return patch<ProductIdea>(`/products/${encodeURIComponent(id)}`, patchInput);
}

export async function moveProductIdea(id: string, stage: PipelineStage): Promise<ProductIdea> {
  return updateProductIdea(id, { stage });
}

export async function deleteProductIdea(id: string): Promise<void> {
  await del<{ deleted: boolean }>(`/products/${encodeURIComponent(id)}`);
}

// ── Chat ────────────────────────────────────────────────────────────

export interface MessageFilters {
  agent?: string;
  search?: string;
}

export async function listMessages(filters?: MessageFilters): Promise<ChatMessage[]> {
  return get<ChatMessage[]>(
    `/agents/messages${qs({ agent: filters?.agent, search: filters?.search })}`
  );
}

export async function sendMessage(content: string, targetAgent?: string): Promise<{ userMessage: ChatMessage; reply: ChatMessage | null }> {
  return post('/agents/messages', { content, targetAgent });
}

export async function getChatState(): Promise<{ paused: boolean }> {
  return get<{ paused: boolean }>('/agents/chat-state');
}

export async function setChatPaused(paused: boolean): Promise<{ paused: boolean }> {
  return patch<{ paused: boolean }>('/agents/chat-state', { paused });
}

// ── Logs ────────────────────────────────────────────────────────────

export interface LogFilters {
  severity?: LogSeverity | 'all';
  agent?: string;
  pipeline?: string;
  search?: string;
}

export async function listLogs(filters?: LogFilters): Promise<LogEntry[]> {
  return get<LogEntry[]>(
    `/logs${qs({
      severity: filters?.severity,
      agent: filters?.agent,
      pipeline: filters?.pipeline,
      search: filters?.search,
    })}`
  );
}

export async function clearLogs(): Promise<void> {
  await del<{ cleared: boolean }>('/logs');
}

// ── Brand memory ────────────────────────────────────────────────────

interface BrandMemoryPayload {
  docs: BrandDoc[];
  entries: BrandMemoryEntry[];
}

export async function listBrandDocs(): Promise<BrandDoc[]> {
  const payload = await get<BrandMemoryPayload>('/brand-memory');
  return payload.docs;
}

export async function saveBrandDoc(id: string, content: string): Promise<BrandDoc> {
  return put<BrandDoc>('/brand-memory', { docId: id, content });
}

export async function listRevisions(docId?: string): Promise<DocumentRevision[]> {
  return get<DocumentRevision[]>(`/brand-memory/revisions${qs({ docId })}`);
}

export async function restoreRevision(revisionId: string): Promise<BrandDoc> {
  return post<BrandDoc>('/brand-memory/restore', { revisionId });
}

export async function getBrandMemory(): Promise<BrandMemoryEntry[]> {
  const payload = await get<BrandMemoryPayload>('/brand-memory');
  return payload.entries;
}

export async function saveBrandMemory(entries: BrandMemoryEntry[]): Promise<BrandMemoryEntry[]> {
  return put<BrandMemoryEntry[]>('/brand-memory', { entries });
}

// ── Settings ────────────────────────────────────────────────────────

export async function listApiKeys(): Promise<ApiKeyEntry[]> {
  return get<ApiKeyEntry[]>('/settings/api-keys');
}

export async function saveApiKey(id: string, rawKey: string): Promise<ApiKeyEntry> {
  return put<ApiKeyEntry>('/settings/api-keys', { id, key: rawKey });
}

export interface ConnectionTestResult {
  id: string;
  ok: boolean;
  testedAt: string;
  /** Round-trip latency of the test request, measured client-side. */
  latencyMs: number;
}

/** Asks the server to ping the provider; latency measured on the round trip. */
export async function testConnection(id: string): Promise<ConnectionTestResult> {
  const started = Date.now();
  const result = await post<Omit<ConnectionTestResult, 'latencyMs'>>(
    `/settings/api-keys/${encodeURIComponent(id)}/test`
  );
  return { ...result, latencyMs: Date.now() - started };
}

export async function getSettings(): Promise<DashboardSettings> {
  return get<DashboardSettings>('/settings');
}

export async function saveSettings(patchInput: Partial<DashboardSettings>): Promise<DashboardSettings> {
  return put<DashboardSettings>('/settings', patchInput);
}

// ── System / misc ───────────────────────────────────────────────────

/** Fetches the full JSON export as text; the download stays client-side. */
export async function exportAllData(): Promise<string> {
  return requestText('/system/export');
}

export async function clearAllData(): Promise<void> {
  await post<{ cleared: boolean }>('/system/clear');
}

export interface SearchResults {
  agents: Agent[];
  leads: Lead[];
  content: ContentCalendar[];
}

export async function searchAll(query: string): Promise<SearchResults> {
  return get<SearchResults>(`/search${qs({ q: query })}`);
}
