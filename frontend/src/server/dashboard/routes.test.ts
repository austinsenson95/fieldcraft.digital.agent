/**
 * Route smoke tests — invoke the `/api/v1` handlers directly with
 * NextRequest objects (node env) against the in-memory service store.
 */
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { resetStore } from './store';
import { GET as listLeads, POST as createLead } from '@/app/api/v1/leads/route';
import { DELETE as deleteLead } from '@/app/api/v1/leads/[id]/route';
import { GET as exportCsv } from '@/app/api/v1/leads/export.csv/route';
import { POST as decide } from '@/app/api/v1/approvals/[id]/decide/route';
import { POST as testKey } from '@/app/api/v1/settings/api-keys/[service]/test/route';
import { GET as getOverview } from '@/app/api/v1/overview/route';

const BASE = 'http://localhost/api/v1';

function req(path: string, init?: { method?: string; body?: unknown }): NextRequest {
  return new NextRequest(`${BASE}${path}`, {
    method: init?.method ?? 'GET',
    ...(init?.body !== undefined
      ? { body: JSON.stringify(init.body), headers: { 'content-type': 'application/json' } }
      : {}),
  });
}

function ctx<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

beforeEach(() => {
  resetStore();
});

describe('leads routes', () => {
  it('GET /leads lists the seeded leads', async () => {
    const res = await listLeads(req('/leads'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(15);
  });

  it('GET /leads applies query filters', async () => {
    const res = await listLeads(req('/leads?status=new'));
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((l: { status: string }) => l.status === 'new')).toBe(true);
  });

  it('POST /leads creates a lead (201) and persists it', async () => {
    const res = await createLead(
      req('/leads', {
        method: 'POST',
        body: {
          company: 'SmokeTest Co',
          contactName: 'Test Person',
          email: 'test@smoketest.dev',
          source: 'GitHub',
          fitScore: 50,
          status: 'new',
          industry: 'Testing',
          companySize: '1-10',
          notes: 'created by smoke test',
        },
      })
    );
    expect(res.status).toBe(201);
    const createdBody = await res.json();
    expect(createdBody.id).toBeTruthy();
    expect(createdBody.company).toBe('SmokeTest Co');

    const list = await (await listLeads(req('/leads?search=SmokeTest'))).json();
    expect(list).toHaveLength(1);
  });

  it('POST /leads rejects an invalid body with 400', async () => {
    const res = await createLead(req('/leads', { method: 'POST', body: { company: '' } }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it('DELETE /leads/[id] returns 404 for a missing lead', async () => {
    const res = await deleteLead(req('/leads/nope', { method: 'DELETE' }), ctx({ id: 'nope' }));
    expect(res.status).toBe(404);
  });

  it('GET /leads/export.csv returns text/csv with Content-Disposition', async () => {
    const res = await exportCsv(req('/leads/export.csv'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    expect(res.headers.get('content-disposition')).toContain('attachment');
    const text = await res.text();
    expect(text.split('\n')[0]).toBe(
      'id,company,contactName,title,email,source,fitScore,status,industry,companySize,notes,createdAt,updatedAt'
    );
  });
});

describe('approvals routes', () => {
  it('POST /approvals/[id]/decide applies the linked-entity side effect over HTTP', async () => {
    // Approval '9' is an outreach draft for lead company 'IoT Dynamics' (status 'new').
    const res = await decide(req('/approvals/9/decide', { method: 'POST', body: { decision: 'approved' } }), ctx({ id: '9' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('approved');

    const leads = await (await listLeads(req('/leads?search=IoT%20Dynamics'))).json();
    expect(leads[0].status).toBe('contacted');
  });

  it('POST /approvals/[id]/decide on a missing approval returns 404', async () => {
    const res = await decide(req('/approvals/nope/decide', { method: 'POST', body: { decision: 'approved' } }), ctx({ id: 'nope' }));
    expect(res.status).toBe(404);
  });
});

describe('settings routes', () => {
  it('POST /settings/api-keys/[service]/test returns status for a configured key', async () => {
    const res = await testKey(req('/settings/api-keys/anthropic/test', { method: 'POST' }), ctx({ service: 'anthropic' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ id: 'anthropic', ok: true });
    expect(body.testedAt).toBeTruthy();
  });

  it('POST /settings/api-keys/[service]/test reports failure for an unset key', async () => {
    const res = await testKey(req('/settings/api-keys/apollo/test', { method: 'POST' }), ctx({ service: 'apollo' }));
    const body = await res.json();
    expect(body.ok).toBe(false);
  });
});

describe('overview route', () => {
  it('GET /overview returns the aggregate payload', async () => {
    const res = await getOverview();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.agents).toHaveLength(10);
    expect(typeof body.pendingApprovals).toBe('number');
    expect(body.weeklyMetrics.length).toBeGreaterThan(0);
  });
});
