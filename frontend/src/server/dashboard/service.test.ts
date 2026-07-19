import { beforeEach, describe, expect, it } from 'vitest';
import { buildSeed } from './seed';
import { resetStore } from './store';
import {
  decideApproval,
  exportLeadsCsv,
  getChatState,
  getOverview,
  listApiKeys,
  listApprovals,
  listBrandDocs,
  listContent,
  listLeads,
  listMessages,
  listRevisions,
  restoreRevision,
  runFullCycle,
  saveApiKey,
  saveBrandDoc,
  sendMessage,
  setChatPaused,
  testConnection,
  updateLead,
} from './service';

beforeEach(() => {
  resetStore();
});

// ── Seeding determinism (SSR hydration safety) ──────────────────────

describe('store seeding', () => {
  it('produces identical data on every build (no hydration hazard)', () => {
    const a = buildSeed();
    const b = buildSeed();
    expect(a).toEqual(b);
  });

  it('heatmap is deterministic with fixed dates', () => {
    const a = buildSeed();
    expect(a.heatmapData).toHaveLength(30);
    expect(a.heatmapData[0].date).toBe('2024-12-16');
    expect(a.heatmapData[29].date).toBe('2025-01-14');
    expect(a.heatmapData.map((d) => d.count)).toEqual(buildSeed().heatmapData.map((d) => d.count));
  });

  it('consolidated datasets use the richer inline versions', () => {
    const s = buildSeed();
    expect(s.content).toHaveLength(18);
    expect(s.productIdeas).toHaveLength(12);
    expect(s.logs).toHaveLength(32);
    expect(s.messages.length).toBeGreaterThan(20);
    expect(s.brandDocs).toHaveLength(5);
    expect(s.leads).toHaveLength(15);
    expect(s.approvals).toHaveLength(9);
  });

  it('returns fresh copies, not shared references', () => {
    const a = buildSeed();
    a.leads[0].company = 'MUTATED';
    expect(buildSeed().leads[0].company).not.toBe('MUTATED');
  });
});

// ── Leads ───────────────────────────────────────────────────────────

describe('leads', () => {
  it('filters by status, source, and search', () => {
    const all = listLeads();
    expect(all).toHaveLength(15);

    const fresh = listLeads({ status: 'new' });
    expect(fresh.length).toBeGreaterThan(0);
    expect(fresh.every((l) => l.status === 'new')).toBe(true);

    const linkedin = listLeads({ source: 'LinkedIn' });
    expect(linkedin.length).toBeGreaterThan(0);
    expect(linkedin.every((l) => l.source === 'LinkedIn')).toBe(true);

    const searched = listLeads({ search: 'techcorp' });
    expect(searched).toHaveLength(1);
    expect(searched[0].company).toBe('TechCorp Inc');
  });

  it('exportLeadsCsv produces valid CSV with header + N rows', () => {
    const csv = exportLeadsCsv({ status: 'new' });
    const lines = csv.split('\n');
    const expected = listLeads({ status: 'new' });
    expect(lines[0]).toBe(
      'id,company,contactName,title,email,source,fitScore,status,industry,companySize,notes,createdAt,updatedAt'
    );
    expect(lines).toHaveLength(expected.length + 1);
    expect(lines[1].split(',').length).toBeGreaterThanOrEqual(13);
  });

  it('exportLeadsCsv escapes commas and quotes', () => {
    const csv = exportLeadsCsv({ search: 'TechCorp' });
    // Notes contain commas -> the field must be quoted.
    expect(csv).toMatch(/"[^"]*Recently raised Series B[^"]*"/);
  });

  it('validates status transitions', () => {
    expect(() => updateLead('1', { status: 'bogus' as never })).toThrow(/Invalid lead status/);

    const updated = updateLead('1', { status: 'contacted' });
    expect(updated.status).toBe('contacted');
    const [stored] = listLeads({ search: 'TechCorp' });
    expect(stored.status).toBe('contacted');
  });

  it('mutations persist in the store', () => {
    updateLead('3', { notes: 'called, very interested' });
    const leads = listLeads();
    expect(leads.find((l) => l.id === '3')?.notes).toBe('called, very interested');
  });
});

// ── Approvals ───────────────────────────────────────────────────────

describe('approvals', () => {
  it('approve applies the side effect on the linked entity and records decidedAt', () => {
    // Approval '9' is an outreach draft for lead company 'IoT Dynamics' (lead id '5', status 'new').
    const before = listLeads({ search: 'IoT Dynamics' });
    expect(before[0].status).toBe('new');

    const decided = decideApproval('9', 'approved');
    expect(decided.status).toBe('approved');
    expect(decided.decidedAt).toBeTruthy();

    const after = listLeads({ search: 'IoT Dynamics' });
    expect(after[0].status).toBe('contacted');
  });

  it('approving a content approval marks the linked post approved', () => {
    // Approval '5' (content) matches content item id '3' by title.
    const decided = decideApproval('5', 'approved');
    expect(decided.status).toBe('approved');
    const posts = listContent({ search: 'Behind the Build' });
    expect(posts[0].status).toBe('approved');
  });

  it('reject does NOT touch the linked entity', () => {
    const decided = decideApproval('9', 'rejected');
    expect(decided.status).toBe('rejected');
    expect(decided.decidedAt).toBeTruthy();

    const lead = listLeads({ search: 'IoT Dynamics' });
    expect(lead[0].status).toBe('new');
  });

  it('applies edits before deciding', () => {
    const decided = decideApproval('6', 'approved', { preview: 'rewritten body' });
    expect(decided.preview).toBe('rewritten body');
  });

  it('refuses to decide twice', () => {
    decideApproval('6', 'rejected');
    expect(() => decideApproval('6', 'approved')).toThrow(/already decided/);
  });

  it('pending list shrinks after decisions', () => {
    const before = listApprovals({ status: 'pending_approval' });
    decideApproval(before[0].id, 'approved');
    const after = listApprovals({ status: 'pending_approval' });
    expect(after.length).toBe(before.length - 1);
  });
});

// ── Settings / API keys ─────────────────────────────────────────────

describe('settings & connections', () => {
  it('testConnection persists status and last_tested_at', () => {
    const result = testConnection('anthropic');
    expect(result.ok).toBe(true);
    expect(result.testedAt).toBeTruthy();

    const keys = listApiKeys();
    const anthropic = keys.find((k) => k.id === 'anthropic');
    expect(anthropic?.lastTestResult).toBe('success');
    expect(anthropic?.lastTestedAt).toBe(result.testedAt);
  });

  it('testConnection fails for unset keys and persists the failure', () => {
    const result = testConnection('apollo');
    expect(result.ok).toBe(false);
    const keys = listApiKeys();
    expect(keys.find((k) => k.id === 'apollo')?.lastTestResult).toBe('error');
  });

  it('saveApiKey stores a masked display and never returns the raw key', () => {
    const raw = 'sk-live-super-secret-key-12345';
    const saved = saveApiKey('apollo', raw);
    expect(saved.status).toBe('configured');
    expect(saved.maskedKey).not.toBe(raw);
    expect(saved.maskedKey).toContain('•');
    expect(JSON.stringify(saved)).not.toContain(raw);

    const keys = listApiKeys();
    expect(JSON.stringify(keys)).not.toContain(raw);
    const apollo = keys.find((k) => k.id === 'apollo');
    expect(apollo?.status).toBe('configured');
    expect(apollo?.maskedKey.startsWith('sk-live-')).toBe(true);
  });
});

// ── runFullCycle ────────────────────────────────────────────────────

describe('runFullCycle', () => {
  it('appends a run, messages, a lead and an approval; overview counts change', () => {
    const before = getOverview();
    const msgsBefore = listMessages().length;
    const leadsBefore = listLeads().length;
    const approvalsBefore = listApprovals({ status: 'pending_approval' }).length;

    const result = runFullCycle();
    expect(result.run.id).toBeTruthy();
    expect(result.newLead.company).toBeTruthy();
    expect(result.newApproval.status).toBe('pending_approval');

    const after = getOverview();
    expect(after.agentRunsCompleted).toBe(before.agentRunsCompleted + 1);
    expect(after.pendingApprovals).toBe(before.pendingApprovals + 1);
    expect(after.lastRunAt).toBe(result.run.finishedAt);

    expect(listMessages().length).toBe(msgsBefore + 3);
    expect(listLeads().length).toBe(leadsBefore + 1);
    expect(listApprovals({ status: 'pending_approval' }).length).toBe(approvalsBefore + 1);

    const leadsMetric = after.weeklyMetrics.find((m) => m.label === 'Total Leads Discovered');
    const leadsMetricBefore = before.weeklyMetrics.find((m) => m.label === 'Total Leads Discovered');
    expect(leadsMetric!.value).toBe(leadsMetricBefore!.value + 1);
  });

  it('is deterministic across resets (same lead from the pool)', () => {
    const r1 = runFullCycle();
    resetStore();
    const r2 = runFullCycle();
    expect(r1.newLead.company).toBe(r2.newLead.company);
  });
});

// ── Chat ────────────────────────────────────────────────────────────

describe('chat', () => {
  it('stores the user message and appends a templated agent reply', () => {
    const before = listMessages().length;
    const { userMessage, reply } = sendMessage('Focus on robotics leads this week');
    expect(userMessage.fromUser).toBe(true);
    expect(reply).not.toBeNull();
    expect(reply!.reasoning).toBeTruthy();
    expect(listMessages().length).toBe(before + 2);
  });

  it('respects pause: no reply while paused, resume re-enables', () => {
    setChatPaused(true);
    expect(getChatState().paused).toBe(true);
    const { reply } = sendMessage('hello swarm');
    expect(reply).toBeNull();

    setChatPaused(false);
    const again = sendMessage('resume please');
    expect(again.reply).not.toBeNull();
  });
});

// ── Brand memory ────────────────────────────────────────────────────

describe('brand memory', () => {
  it('save creates a revision; restore reverts content', () => {
    const [voice] = listBrandDocs();
    const original = voice.content;

    saveBrandDoc(voice.id, 'EDITED CONTENT');
    let docs = listBrandDocs();
    expect(docs.find((d) => d.id === voice.id)?.content).toBe('EDITED CONTENT');

    const revs = listRevisions(voice.id);
    const snapshot = revs.find((r) => r.content === original);
    expect(snapshot).toBeTruthy();

    restoreRevision(snapshot!.id);
    docs = listBrandDocs();
    expect(docs.find((d) => d.id === voice.id)?.content).toBe(original);
  });
});
