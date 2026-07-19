"use client";
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  MessageSquare,
  Zap,
  Search,
  Circle,
} from 'lucide-react';
import { cn } from '@/dashboard/lib/utils';
import {
  listAgents,
  listMessages,
  sendMessage,
  getChatState,
  setChatPaused,
} from '@/dashboard/api/client';
import { useApiData } from '@/dashboard/hooks/useApiData';
import type { AgentName, ChatMessage } from '@/dashboard/types';

// ── Helpers ─────────────────────────────────────────────────────────

function getAgentInitials(name: AgentName): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const easeSpring = [0.34, 1.56, 0.64, 1] as [number, number, number, number];
const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

// Typing indicator component
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2, ease: easeOut }}
    className="flex items-center gap-3 py-2"
  >
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary">
      <span className="text-[10px] font-bold text-text-accent">AI</span>
    </div>
    <div className="flex items-center gap-1 rounded-xl bg-bg-secondary px-4 py-2.5">
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-text-tertiary"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
      />
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-text-tertiary"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
      />
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-text-tertiary"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
      />
      <span className="ml-1.5 text-caption text-text-tertiary">Agent is thinking</span>
    </div>
  </motion.div>
);

// ── Component ───────────────────────────────────────────────────────

export default function Chat() {
  const [selectedAgent, setSelectedAgent] = useState<AgentName | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paused, setPaused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Set<string>>(new Set());
  const [showTyping, setShowTyping] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Data from the mock API
  const { data: agentsData } = useApiData(() => listAgents(), []);
  const agents = agentsData ?? [];
  const { data: messagesData, loading: messagesLoading, refetch: refetchMessages } = useApiData(
    () =>
      listMessages({
        agent: selectedAgent === 'all' ? undefined : selectedAgent,
        search: searchQuery,
      }),
    [selectedAgent, searchQuery]
  );
  const messages = useMemo(() => messagesData ?? [], [messagesData]);
  const isLive = !paused;

  // Initialize pause state from the store
  useEffect(() => {
    getChatState()
      .then((s) => setPaused(s.paused))
      .catch(() => {});
  }, []);

  // Pause/resume the agent stream (server-side: no replies while paused)
  const handleTogglePause = async () => {
    const { paused: next } = await setChatPaused(!paused);
    setPaused(next);
  };

  // Toggle reasoning expand/collapse
  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Group consecutive messages from same agent
  const groupedMessages = useMemo(() => {
    const groups: { agent: AgentName; agentColor: string; messages: ChatMessage[] }[] = [];
    messages.forEach((msg) => {
      if (msg.type === 'system') {
        groups.push({ agent: msg.agent, agentColor: msg.agentColor, messages: [msg] });
      } else if (
        groups.length > 0 &&
        groups[groups.length - 1].agent === msg.agent &&
        groups[groups.length - 1].messages[groups[groups.length - 1].messages.length - 1].type !== 'system'
      ) {
        groups[groups.length - 1].messages.push(msg);
      } else {
        groups.push({ agent: msg.agent, agentColor: msg.agentColor, messages: [msg] });
      }
    });
    return groups;
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (!userScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, userScrolled]);

  // Handle scroll to detect user scrolling up
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setUserScrolled(!isAtBottom);
  };

  // Send message as orchestrator — the store holds the user message and
  // (unless paused) the templated agent reply, both visible after refetch.
  const handleSend = async () => {
    const content = inputValue.trim();
    if (!content || sending) return;
    setSending(true);
    setShowTyping(true);
    try {
      await sendMessage(content, selectedAgent === 'all' ? undefined : selectedAgent);
      setInputValue('');
      refetchMessages();
      setUserScrolled(false);
    } finally {
      setShowTyping(false);
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-56px-48px)] flex-col -m-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-secondary px-6 py-3">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-heading-sm text-text-primary">Agent Chat</h1>
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
                </span>
              )}
            </div>
            <p className="text-caption text-text-tertiary">Live inter-agent communication</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 rounded-lg border border-border-subtle bg-bg-quaternary pl-8 pr-3 text-body-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
          </div>
          {/* Agent filter dropdown */}
          <div className="relative">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value as AgentName | 'all')}
              className="h-8 appearance-none rounded-lg border border-border-medium bg-transparent px-3 pr-7 text-body-sm text-text-primary outline-none transition-colors hover:bg-bg-tertiary focus:border-text-accent"
            >
              <option value="all">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-tertiary" />
          </div>
          {/* Live/Pause */}
          <button
            onClick={handleTogglePause}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-lg px-3 text-body-sm font-medium transition-all',
              isLive
                ? 'border border-border-medium text-text-secondary hover:bg-bg-tertiary'
                : 'bg-text-accent text-bg-primary hover:brightness-110'
            )}
          >
            {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* ── Main Chat Layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Agent Sidebar ── */}
        <div className="w-56 shrink-0 overflow-y-auto border-r border-border-subtle bg-bg-secondary">
          <div className="px-4 py-3">
            <h3 className="text-caption font-semibold uppercase tracking-wider text-text-tertiary">Agents</h3>
          </div>
          <div className="flex flex-col">
            {/* All Agents option */}
            <button
              onClick={() => setSelectedAgent('all')}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors',
                selectedAgent === 'all'
                  ? 'border-l-[3px] border-l-text-accent bg-bg-tertiary'
                  : 'border-l-[3px] border-l-transparent hover:bg-bg-tertiary'
              )}
            >
              <Circle className="h-2 w-2 text-text-secondary" />
              <span className={cn('text-body-sm', selectedAgent === 'all' ? 'font-medium text-text-primary' : 'text-text-secondary')}>All Agents</span>
            </button>
            {/* Agent list */}
            {agents.map((agent, i) => (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.025, ease: easeOut }}
                onClick={() => setSelectedAgent(agent.name)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors',
                  selectedAgent === agent.name
                    ? 'bg-bg-tertiary'
                    : 'hover:bg-bg-tertiary'
                )}
                style={
                  selectedAgent === agent.name
                    ? { borderLeftWidth: 3, borderLeftColor: agent.color }
                    : { borderLeftWidth: 3, borderLeftColor: 'transparent' }
                }
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: agent.color }} />
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-body-sm',
                    selectedAgent === agent.name ? 'font-medium text-text-primary' : 'text-text-secondary'
                  )}
                >
                  {agent.name}
                </span>
                <span
                  className={cn(
                    'ml-auto h-1.5 w-1.5 shrink-0 rounded-full',
                    agent.status === 'online' && 'bg-status-success',
                    agent.status === 'idle' && 'bg-status-warning',
                    agent.status === 'offline' && 'bg-text-tertiary'
                  )}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div className="flex flex-1 flex-col bg-bg-primary">
          {/* Messages */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            {groupedMessages.length === 0 && !messagesLoading ? (
              <div className="flex h-full flex-col items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MessageSquare className="h-16 w-16 text-text-tertiary/25" />
                </motion.div>
                <h3 className="mt-4 text-heading-md text-text-primary">Agent Chat</h3>
                <p className="mt-1 max-w-sm text-center text-body-md text-text-tertiary">
                  Agents communicate here to coordinate tasks, share reasoning, and make decisions. Messages appear in real-time as the swarm operates.
                </p>
                <button
                  onClick={() => {
                    refetchMessages();
                    setUserScrolled(false);
                  }}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-text-accent px-4 py-2 text-body-sm font-semibold text-bg-primary transition-all hover:brightness-110"
                >
                  <Zap className="h-4 w-4" />
                  Start Simulation
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <AnimatePresence>
                  {groupedMessages.map((group) =>
                    group.messages.map((msg, msgIdx) => {
                      const isFirstInGroup = msgIdx === 0;
                      const isSystem = msg.type === 'system';
                      const isDecision = msg.type === 'decision';
                      const showReasoning = expandedReasoning.has(msg.id);

                      // System message
                      if (isSystem) {
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: easeOut }}
                            className="flex justify-center py-2"
                          >
                            <div className="max-w-[500px] rounded-full border border-dashed border-border-subtle bg-bg-tertiary/50 px-4 py-1.5">
                              <span className="text-caption text-text-tertiary">{msg.content}</span>
                            </div>
                          </motion.div>
                        );
                      }

                      // Decision message
                      if (isDecision) {
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: easeSpring }}
                            className="my-2 w-full max-w-[680px] rounded-xl border border-status-warning/50 bg-gradient-to-r from-bg-secondary to-bg-tertiary/50 p-4"
                            style={{ borderLeftWidth: 4, borderLeftColor: '#F0A84F' }}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-status-warning" />
                              <span className="text-heading-sm text-status-warning">DECISION</span>
                            </div>
                            <p className="mb-2 text-body-md text-text-primary">{msg.decisionLabel}</p>
                            <p className="mb-2 text-body-sm text-text-secondary">{msg.content}</p>
                            {msg.decisionAction && (
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-status-warning/10 px-2.5 py-1">
                                <span className="text-caption font-medium text-status-warning">{msg.decisionAction}</span>
                              </div>
                            )}
                            <div className="mt-2 flex items-center gap-2 text-mono-sm text-text-tertiary">
                              <span>Approved by: {msg.agent}</span>
                              <span>—</span>
                              <span>{msg.timestamp}</span>
                            </div>
                          </motion.div>
                        );
                      }

                      // Regular agent message
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, ease: easeOut }}
                          className={cn(
                            'group flex gap-3 py-1',
                            msg.threadDepth ? `pl-${(msg.threadDepth || 0) * 6}` : ''
                          )}
                          style={
                            msg.threadDepth
                              ? { paddingLeft: (msg.threadDepth || 0) * 24 }
                              : undefined
                          }
                        >
                          {/* Avatar - only on first message in group */}
                          {isFirstInGroup ? (
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                              style={{ backgroundColor: msg.agentColor }}
                            >
                              {getAgentInitials(msg.agent)}
                            </div>
                          ) : (
                            <div className="w-8 shrink-0" />
                          )}

                          {/* Message bubble */}
                          <div className="min-w-0 flex-1">
                            {isFirstInGroup && (
                              <div className="mb-0.5 flex items-center gap-2">
                                <span
                                  className="text-mono-sm font-semibold"
                                  style={{ color: msg.agentColor }}
                                >
                                  {msg.agent}
                                </span>
                                <span className="text-mono-sm text-text-tertiary">{msg.timestamp}</span>
                                {msg.recipient && (
                                  <span className="text-caption text-text-tertiary">
                                    {' '}→ {msg.recipient}
                                  </span>
                                )}
                              </div>
                            )}
                            <div
                              className={cn(
                                'relative max-w-[680px] rounded-xl border border-border-subtle bg-bg-secondary px-4 py-2.5 transition-colors group-hover:bg-bg-tertiary/50'
                              )}
                              style={{ borderLeftWidth: 3, borderLeftColor: msg.agentColor }}
                            >
                              <p className="text-body-md text-text-primary">{msg.content}</p>

                              {/* Reasoning block */}
                              {msg.reasoning && (
                                <div className="mt-2">
                                  <button
                                    onClick={() => toggleReasoning(msg.id)}
                                    className="flex items-center gap-1 text-caption text-text-accent transition-colors hover:text-text-primary"
                                  >
                                    {showReasoning ? (
                                      <>
                                        <ChevronUp className="h-3 w-3" /> Hide reasoning
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="h-3 w-3" /> Show reasoning
                                      </>
                                    )}
                                  </button>
                                  <AnimatePresence>
                                    {showReasoning && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: easeOut }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-2 rounded-lg bg-bg-tertiary p-3 font-mono text-mono-sm text-text-secondary">
                                          {msg.reasoning}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>{showTyping && <TypingIndicator />}</AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* New messages indicator */}
          <AnimatePresence>
            {userScrolled && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => {
                  setUserScrolled(false);
                  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-full bg-text-accent px-4 py-2 text-body-sm font-medium text-bg-primary shadow-card transition-all hover:brightness-110"
              >
                New messages ↓
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Input Bar ── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3, ease: easeOut }}
            className="flex items-center gap-3 border-t border-border-subtle bg-bg-secondary px-6 py-3"
          >
            <span className="shrink-0 text-caption text-text-tertiary">Send as:</span>
            <div className="flex items-center gap-1.5 rounded-lg bg-bg-tertiary px-2.5 py-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#F0A84F' }} />
              <span className="text-body-sm text-text-primary">Orchestrator</span>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message or @mention an agent..."
              className="h-10 flex-1 rounded-xl border border-border-subtle bg-bg-quaternary px-4 text-body-md text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-text-accent focus:ring-2 focus:ring-text-accent/15"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || sending}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-all',
                inputValue.trim() && !sending
                  ? 'bg-text-accent text-bg-primary hover:brightness-110'
                  : 'bg-bg-tertiary text-text-tertiary'
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
