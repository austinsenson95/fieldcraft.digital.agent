"use client";
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Bot,
  CalendarClock,
  Bell,
  Monitor,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Shield,
  Save,
  RotateCcw,
  Download,
  Trash2,
  Sun,
  Moon,
  Sparkles,
  Database,
  Linkedin,
  Instagram,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/dashboard/lib/utils';
import { Switch } from '@/dashboard/components/ui/switch';
import { Button } from '@/dashboard/components/ui/button';
import { Input } from '@/dashboard/components/ui/input';
import { Label } from '@/dashboard/components/ui/label';
import { Separator } from '@/dashboard/components/ui/separator';
import { useApiData } from '@/dashboard/hooks/useApiData';
import {
  listApiKeys,
  saveApiKey,
  testConnection,
  getSettings,
  saveSettings,
  exportAllData,
  clearAllData,
} from '@/dashboard/api/client';
import type { AgentToggle, NotificationSettings, ScheduleSettings, SystemSettings } from '@/dashboard/types';

// ------------------------------------------------------------------
// API key icons — keyed by API key id (icons are presentational only,
// so they are not part of the API data model).
// ------------------------------------------------------------------
const apiKeyIcons: Record<string, LucideIcon> = {
  anthropic: Sparkles,
  supabase_url: Database,
  supabase_key: Database,
  instagram: Instagram,
  linkedin: Linkedin,
  apollo: Search,
};

// ------------------------------------------------------------------
// Easing
// ------------------------------------------------------------------
const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

// ------------------------------------------------------------------
// Default local form state (overwritten once settings load)
// ------------------------------------------------------------------
const defaultSchedule: ScheduleSettings = {
  pipelineFreq: 'Every hour',
  contentDays: ['Mon', 'Wed', 'Fri'],
  leadScanFreq: 'Every 6 hours',
  timeZone: 'America/New_York',
  quietStart: '22:00',
  quietEnd: '07:00',
};

const defaultNotifications: NotificationSettings = {
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

const scheduleOptions = [
  'Every 15 minutes',
  'Every 30 minutes',
  'Every hour',
  'Every 6 hours',
  'Daily',
  'Manual only',
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const timeZones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
];

const retentionOptions = ['7 days', '30 days', '90 days', '1 year'];

// ------------------------------------------------------------------
// Section nav items
// ------------------------------------------------------------------
const navItems = [
  { key: 'api_keys', label: 'API Keys', icon: Key },
  { key: 'agents', label: 'Agents', icon: Bot },
  { key: 'schedule', label: 'Schedule', icon: CalendarClock },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'system', label: 'System', icon: Monitor },
];

// ------------------------------------------------------------------
// Status badge
// ------------------------------------------------------------------
function StatusBadge({ status }: { status: 'configured' | 'not_set' | 'connected' | 'disconnected' }) {
  const isGood = status === 'configured' || status === 'connected';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-semibold',
        isGood ? 'bg-status-success/15 text-status-success' : 'bg-bg-tertiary text-text-tertiary'
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', isGood ? 'bg-status-success' : 'bg-text-tertiary')} />
      {isGood ? 'Configured' : 'Not Connected'}
    </span>
  );
}

// ------------------------------------------------------------------
// Agent dot
// ------------------------------------------------------------------
function AgentDot({ color }: { color: string }) {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />;
}

// ------------------------------------------------------------------
// Section wrapper with animation
// ------------------------------------------------------------------
function SectionWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: easeOut }}
      className={cn('space-y-6', className)}
    >
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Card wrapper
// ------------------------------------------------------------------
function SettingCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border-subtle bg-bg-secondary p-5', className)}>
      {children}
    </div>
  );
}

// ------------------------------------------------------------------
// =================================================================
// MAIN COMPONENT
// =================================================================
// ------------------------------------------------------------------
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('api_keys');

  // ── Server data ──
  const { data: apiKeysData, loading: keysLoading, refetch: refetchKeys } = useApiData(() => listApiKeys(), []);
  const { data: settings, loading: settingsLoading, refetch: refetchSettings } = useApiData(() => getSettings(), []);
  const apiKeys = apiKeysData ?? [];

  // ── API Keys state ──
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, 'success' | 'error'>>({});

  // ── Local edit overlays ──
  // Form state is derived as fetched-settings + unsaved local edits, so no
  // effect/remount is needed to populate forms and "Reset" just clears edits.
  const [scheduleEdits, setScheduleEdits] = useState<Partial<ScheduleSettings>>({});
  const [notificationEdits, setNotificationEdits] = useState<Partial<NotificationSettings>>({});
  const [systemEdits, setSystemEdits] = useState<Partial<SystemSettings>>({});
  const [agentTogglesOverride, setAgentTogglesOverride] = useState<AgentToggle[] | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const schedule: ScheduleSettings = useMemo(
    () => ({ ...(settings?.schedule ?? defaultSchedule), ...scheduleEdits }),
    [settings, scheduleEdits]
  );
  const notifications: NotificationSettings = useMemo(
    () => ({ ...(settings?.notifications ?? defaultNotifications), ...notificationEdits }),
    [settings, notificationEdits]
  );
  const theme = systemEdits.theme ?? settings?.system.theme ?? 'dark';
  const retention = systemEdits.retention ?? settings?.system.retention ?? '30 days';
  const agentToggles = useMemo(
    () => agentTogglesOverride ?? settings?.agentToggles ?? [],
    [agentTogglesOverride, settings]
  );

  // ── Handlers ──
  const toggleKeyVisibility = useCallback((id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleKeyChange = useCallback((id: string, value: string) => {
    setEditingKeys((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleTestConnection = useCallback(
    async (id: string) => {
      setTestingKey(id);
      try {
        const result = await testConnection(id);
        setTestResult((prev) => ({ ...prev, [id]: result.ok ? 'success' : 'error' }));
        refetchKeys();
      } finally {
        setTestingKey(null);
      }
    },
    [refetchKeys]
  );

  const persistAgentToggles = useCallback((next: AgentToggle[]) => {
    setAgentTogglesOverride(next);
    void saveSettings({ agentToggles: next });
  }, []);

  const toggleAgent = useCallback(
    (id: string) => {
      persistAgentToggles(
        agentToggles.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
      );
    },
    [agentToggles, persistAgentToggles]
  );

  const enableAllAgents = useCallback(() => {
    persistAgentToggles(agentToggles.map((a) => ({ ...a, enabled: true })));
  }, [agentToggles, persistAgentToggles]);

  const disableAllAgents = useCallback(() => {
    persistAgentToggles(agentToggles.map((a) => ({ ...a, enabled: false })));
  }, [agentToggles, persistAgentToggles]);

  const toggleContentDay = useCallback((day: string) => {
    setScheduleEdits((prev) => {
      const current = { ...(settings?.schedule ?? defaultSchedule), ...prev };
      return {
        ...prev,
        contentDays: current.contentDays.includes(day)
          ? current.contentDays.filter((d) => d !== day)
          : [...current.contentDays, day],
      };
    });
  }, [settings]);

  const setNotification = useCallback((key: keyof NotificationSettings, value: boolean) => {
    setNotificationEdits((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateSchedule = useCallback(
    <K extends keyof ScheduleSettings>(key: K, value: ScheduleSettings[K]) => {
      setScheduleEdits((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const persistSystem = useCallback(
    (patch: Partial<SystemSettings>) => {
      const next: SystemSettings = { theme, retention, ...patch };
      setSystemEdits(next);
      void saveSettings({ system: next });
    },
    [theme, retention]
  );

  const handleSaveAll = useCallback(async () => {
    for (const [id, rawKey] of Object.entries(editingKeys)) {
      await saveApiKey(id, rawKey);
    }
    setEditingKeys({});
    await saveSettings({ agentToggles, schedule, notifications, system: { theme, retention } });
    setScheduleEdits({});
    setNotificationEdits({});
    setAgentTogglesOverride(null);
    refetchKeys();
    refetchSettings();
  }, [editingKeys, agentToggles, schedule, notifications, theme, retention, refetchKeys, refetchSettings]);

  const handleReset = useCallback(() => {
    // Discard local edits and re-sync from the store (last-saved state).
    setEditingKeys({});
    setScheduleEdits({});
    setNotificationEdits({});
    setSystemEdits({});
    setAgentTogglesOverride(null);
    refetchKeys();
    refetchSettings();
  }, [refetchKeys, refetchSettings]);

  const handleSaveSchedule = useCallback(async () => {
    await saveSettings({ schedule });
    setScheduleEdits({});
    refetchSettings();
  }, [schedule, refetchSettings]);

  const handleSaveNotifications = useCallback(async () => {
    await saveSettings({ notifications });
    setNotificationEdits({});
    refetchSettings();
  }, [notifications, refetchSettings]);

  const handleExportAll = useCallback(async () => {
    const json = await exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'fieldcraft-export.json';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, []);

  const handleClearAll = useCallback(async () => {
    await clearAllData();
    setShowClearConfirm(false);
  }, []);

  // ── Loading guard ──
  const initialLoading = (keysLoading && !apiKeysData) || (settingsLoading && !settings);
  if (initialLoading) {
    return (
      <div className="flex h-full flex-col gap-6">
        <div>
          <h1 className="text-display-lg font-bold text-text-primary">Settings</h1>
          <p className="text-body-md text-text-secondary">Configure your agent swarm</p>
        </div>
        <p className="text-body-md text-text-tertiary">Loading settings...</p>
      </div>
    );
  }

  // ── Render sections ──
  const renderApiKeys = () => (
    <SectionWrapper>
      <div>
        <h2 className="text-heading-lg font-semibold text-text-primary">API Keys</h2>
        <p className="text-body-md text-text-secondary">Configure API keys for agent services</p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-lg bg-status-warning/10 p-4">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-status-warning" />
        <p className="text-body-sm text-status-warning">
          API keys are stored securely and never exposed in logs.
        </p>
      </div>

      {/* API Key cards */}
      <div className="space-y-4">
        {apiKeys.map((api, idx) => {
          const Icon = apiKeyIcons[api.id] ?? Key;
          return (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.06, ease: easeOut }}
          >
            <SettingCard>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-5 w-5 text-text-accent" />
                    <h3 className="text-heading-sm font-semibold text-text-primary">{api.name}</h3>
                    <StatusBadge status={api.status} />
                  </div>
                  <p className="text-body-sm text-text-secondary mb-3">{api.description}</p>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                      <Input
                        type={visibleKeys[api.id] ? 'text' : 'password'}
                        value={editingKeys[api.id] ?? api.maskedKey}
                        onChange={(e) => handleKeyChange(api.id, e.target.value)}
                        placeholder={`Enter ${api.name}`}
                        className="h-10 bg-bg-quaternary border-border-subtle pr-10 text-body-sm text-text-primary placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
                      />
                      <button
                        onClick={() => toggleKeyVisibility(api.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                      >
                        {visibleKeys[api.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!editingKeys[api.id] || editingKeys[api.id] === api.maskedKey}
                      onClick={async () => {
                        await saveApiKey(api.id, editingKeys[api.id]!);
                        setEditingKeys((prev) => {
                          const next = { ...prev };
                          delete next[api.id];
                          return next;
                        });
                        refetchKeys();
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestConnection(api.id)}
                    disabled={testingKey === api.id || api.status === 'not_set'}
                    className="text-body-sm text-text-secondary hover:text-text-primary"
                  >
                    {testingKey === api.id ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-text-accent border-t-transparent" />
                        Testing...
                      </span>
                    ) : (testResult[api.id] ?? api.lastTestResult) === 'success' ? (
                      <span className="inline-flex items-center gap-1.5 text-status-success">
                        <Check className="h-4 w-4" /> Connected
                      </span>
                    ) : (testResult[api.id] ?? api.lastTestResult) === 'error' ? (
                      <span className="inline-flex items-center gap-1.5 text-status-danger">
                        <AlertCircle className="h-4 w-4" /> Failed
                      </span>
                    ) : (
                      'Test Connection'
                    )}
                  </Button>
                </div>
              </div>
            </SettingCard>
          </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="gap-1.5 bg-text-accent text-bg-primary hover:brightness-110"
          onClick={() => void handleSaveAll()}
        >
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
        <Button variant="secondary" className="gap-1.5" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </SectionWrapper>
  );

  const renderAgents = () => (
    <SectionWrapper>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-heading-lg font-semibold text-text-primary">Agent Configuration</h2>
          <p className="text-body-md text-text-secondary">Enable, disable, and configure individual agents</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button variant="secondary" size="sm" onClick={enableAllAgents}>
            Enable All
          </Button>
          <Button variant="secondary" size="sm" onClick={disableAllAgents}>
            Disable All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {agentToggles.map((agent, idx) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.04, ease: easeOut }}
          >
            <SettingCard>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <AgentDot color={agent.color} />
                  <h3 className="text-heading-sm font-semibold" style={{ color: agent.color }}>
                    {agent.name}
                  </h3>
                </div>
                <Switch checked={agent.enabled} onCheckedChange={() => toggleAgent(agent.id)} />
              </div>
              <p className="mt-2 text-body-sm text-text-secondary">{agent.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={cn(
                    'text-caption font-medium',
                    agent.enabled ? 'text-status-success' : 'text-text-tertiary'
                  )}
                >
                  {agent.enabled ? 'Active' : 'Paused'}
                </span>
                <span className="text-mono-sm text-text-tertiary">Last run: {agent.lastRun}</span>
              </div>
            </SettingCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );

  const renderSchedule = () => (
    <SectionWrapper>
      <div>
        <h2 className="text-heading-lg font-semibold text-text-primary">Schedule</h2>
        <p className="text-body-md text-text-secondary">Configure when agents run and content publishes</p>
      </div>

      {/* Pipeline frequency */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-1">Pipeline Run Frequency</h3>
        <p className="text-body-sm text-text-secondary mb-4">How often the Orchestrator triggers a full agent cycle</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={schedule.pipelineFreq}
            onChange={(e) => updateSchedule('pipelineFreq', e.target.value)}
            className="h-10 rounded-lg border border-border-subtle bg-bg-quaternary px-3 text-body-sm text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
          >
            {scheduleOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <span className="text-mono-sm text-text-tertiary">Next cycle: Today at 3:00 PM</span>
        </div>
      </SettingCard>

      {/* Content generation days */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-1">Content Generation Days</h3>
        <p className="text-body-sm text-text-secondary mb-4">Days of the week when content is generated</p>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => toggleContentDay(day)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg border text-body-sm font-medium transition-all duration-150',
                schedule.contentDays.includes(day)
                  ? 'border-text-accent bg-text-accent/15 text-text-accent'
                  : 'border-border-subtle bg-bg-quaternary text-text-secondary hover:border-border-medium hover:text-text-primary'
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </SettingCard>

      {/* Lead scanning */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-1">Lead Scanning Frequency</h3>
        <p className="text-body-sm text-text-secondary mb-4">How often Lead Intelligence scans for new leads</p>
        <select
          value={schedule.leadScanFreq}
          onChange={(e) => updateSchedule('leadScanFreq', e.target.value)}
          className="h-10 rounded-lg border border-border-subtle bg-bg-quaternary px-3 text-body-sm text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
        >
          {scheduleOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </SettingCard>

      {/* Time zone & Quiet hours */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-1">Time Zone</h3>
        <p className="text-body-sm text-text-secondary mb-4">All schedules use this timezone</p>
        <select
          value={schedule.timeZone}
          onChange={(e) => updateSchedule('timeZone', e.target.value)}
          className="h-10 rounded-lg border border-border-subtle bg-bg-quaternary px-3 text-body-sm text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
        >
          {timeZones.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>

        <Separator className="my-5" />

        <h3 className="text-heading-sm font-semibold text-text-primary mb-1">Quiet Hours</h3>
        <p className="text-body-sm text-text-secondary mb-4">No posts or outreach during these hours</p>
        <div className="flex items-center gap-3">
          <Input
            type="time"
            value={schedule.quietStart}
            onChange={(e) => updateSchedule('quietStart', e.target.value)}
            className="h-10 w-32 bg-bg-quaternary border-border-subtle text-text-primary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
          />
          <span className="text-text-secondary">to</span>
          <Input
            type="time"
            value={schedule.quietEnd}
            onChange={(e) => updateSchedule('quietEnd', e.target.value)}
            className="h-10 w-32 bg-bg-quaternary border-border-subtle text-text-primary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
          />
        </div>
      </SettingCard>

      <Button className="gap-1.5 bg-text-accent text-bg-primary hover:brightness-110" onClick={() => void handleSaveSchedule()}>
        <Save className="h-4 w-4" />
        Save Schedule
      </Button>
    </SectionWrapper>
  );

  const renderNotifications = () => (
    <SectionWrapper>
      <div>
        <h2 className="text-heading-lg font-semibold text-text-primary">Notifications</h2>
        <p className="text-body-md text-text-secondary">Choose what you want to be notified about</p>
      </div>

      {/* Approval notifications */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-4">Approval Notifications</h3>
        <div className="space-y-4">
          {([
            { label: 'Email notifications for approvals', desc: 'Get an email when an item needs your approval', key: 'emailApprovals' },
            { label: 'Browser notifications', desc: 'Receive push notifications in your browser', key: 'browser' },
            { label: 'Daily summary report', desc: 'A daily digest of all agent activity', key: 'dailySummary' },
          ] as const).map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05, ease: easeOut }}
              className="flex items-start justify-between gap-4"
            >
              <div>
                <Label className="text-body-sm font-medium text-text-primary">{item.label}</Label>
                <p className="text-body-sm text-text-secondary">{item.desc}</p>
              </div>
              <Switch checked={notifications[item.key]} onCheckedChange={(v) => setNotification(item.key, v)} />
            </motion.div>
          ))}
        </div>
      </SettingCard>

      {/* Pipeline notifications */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-4">Pipeline Notifications</h3>
        <div className="space-y-4">
          {([
            { label: 'New lead discovered', key: 'newLead' },
            { label: 'Lead responds to outreach', key: 'leadResponse' },
            { label: 'Content published', key: 'contentPublished' },
            { label: 'Product idea moved to shipped', key: 'productShipped' },
          ] as const).map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05, ease: easeOut }}
              className="flex items-center justify-between gap-4"
            >
              <Label className="text-body-sm font-medium text-text-primary">{item.label}</Label>
              <Switch checked={notifications[item.key]} onCheckedChange={(v) => setNotification(item.key, v)} />
            </motion.div>
          ))}
        </div>
      </SettingCard>

      {/* Agent notifications */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-4">Agent Notifications</h3>
        <div className="space-y-4">
          {([
            { label: 'Agent error occurs', key: 'agentError' },
            { label: 'Agent cycle completes', key: 'cycleComplete' },
            { label: 'Token usage exceeds threshold', key: 'tokenThreshold' },
          ] as const).map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05, ease: easeOut }}
              className="flex items-center justify-between gap-4"
            >
              <Label className="text-body-sm font-medium text-text-primary">{item.label}</Label>
              <Switch checked={notifications[item.key]} onCheckedChange={(v) => setNotification(item.key, v)} />
            </motion.div>
          ))}
        </div>
      </SettingCard>

      <Button className="gap-1.5 bg-text-accent text-bg-primary hover:brightness-110" onClick={() => void handleSaveNotifications()}>
        <Save className="h-4 w-4" />
        Save Notification Preferences
      </Button>
    </SectionWrapper>
  );

  const renderSystem = () => (
    <SectionWrapper>
      <div>
        <h2 className="text-heading-lg font-semibold text-text-primary">System</h2>
        <p className="text-body-md text-text-secondary">Advanced system configuration</p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-lg bg-status-warning/10 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-status-warning" />
        <p className="text-body-sm text-status-warning">
          These settings affect the entire swarm. Change with caution.
        </p>
      </div>

      {/* Theme */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-4">Appearance</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => persistSystem({ theme: 'dark' })}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-3 text-body-sm font-medium transition-all',
              theme === 'dark'
                ? 'border-text-accent bg-text-accent/15 text-text-accent'
                : 'border-border-subtle bg-bg-quaternary text-text-secondary hover:border-border-medium'
            )}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={() => persistSystem({ theme: 'light' })}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-3 text-body-sm font-medium transition-all',
              theme === 'light'
                ? 'border-text-accent bg-text-accent/15 text-text-accent'
                : 'border-border-subtle bg-bg-quaternary text-text-secondary hover:border-border-medium'
            )}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
        </div>
      </SettingCard>

      {/* Data retention */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-1">Data Retention</h3>
        <p className="text-body-sm text-text-secondary mb-4">How long to keep agent logs and activity data</p>
        <select
          value={retention}
          onChange={(e) => persistSystem({ retention: e.target.value })}
          className="h-10 rounded-lg border border-border-subtle bg-bg-quaternary px-3 text-body-sm text-text-primary outline-none focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
        >
          {retentionOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </SettingCard>

      {/* Export */}
      <SettingCard>
        <h3 className="text-heading-sm font-semibold text-text-primary mb-1">Data Export</h3>
        <p className="text-body-sm text-text-secondary mb-4">Download all your data as a JSON export</p>
        <Button variant="secondary" className="gap-1.5" onClick={() => void handleExportAll()}>
          <Download className="h-4 w-4" />
          Export All Data
        </Button>
      </SettingCard>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1, ease: easeOut }}
        className="rounded-xl border border-status-danger/30 bg-status-danger/5 p-5"
      >
        <h3 className="text-heading-sm font-semibold text-status-danger mb-1">Danger Zone</h3>
        <p className="text-body-sm text-text-secondary mb-4">
          These actions are irreversible. Proceed with extreme caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            className="gap-1.5 border-status-danger/30 text-status-danger hover:bg-status-danger/15 hover:text-status-danger"
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
        </div>

        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-lg border border-status-danger/30 bg-bg-primary p-4">
                <p className="text-body-sm text-text-primary mb-3">
                  Are you sure? This will permanently delete all leads, content, and agent data.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    className="gap-1.5 bg-status-danger text-white hover:brightness-110"
                    onClick={() => void handleClearAll()}
                  >
                    <Trash2 className="h-4 w-4" />
                    Yes, Delete Everything
                  </Button>
                  <Button variant="ghost" onClick={() => setShowClearConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </SectionWrapper>
  );

  const sections: Record<string, () => React.ReactNode> = {
    api_keys: renderApiKeys,
    agents: renderAgents,
    schedule: renderSchedule,
    notifications: renderNotifications,
    system: renderSystem,
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: easeOut }}
      >
        <h1 className="text-display-lg font-bold text-text-primary">Settings</h1>
        <p className="text-body-md text-text-secondary">Configure your agent swarm</p>
      </motion.div>

      {/* Two-column layout: nav + content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Settings nav sidebar */}
        <motion.nav
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.05, ease: easeOut }}
          className="shrink-0 lg:w-52"
        >
          <div className="flex flex-row gap-1 overflow-x-auto rounded-lg bg-bg-secondary p-1 border border-border-subtle lg:flex-col">
            {navItems.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={cn(
                    'relative flex items-center gap-2.5 rounded-md px-3 py-2.5 text-body-sm font-medium whitespace-nowrap transition-all duration-150',
                    isActive
                      ? 'bg-bg-tertiary text-text-accent'
                      : 'text-text-secondary hover:bg-bg-tertiary/50 hover:text-text-primary'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="settingsNavIndicator"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-text-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn('h-4 w-4', isActive ? 'text-text-accent' : 'text-text-tertiary')} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </motion.nav>

        {/* Settings content panel */}
        <div className="min-w-0 flex-1 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: easeOut }}
            >
              {sections[activeSection]?.()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
