import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Message, MessageChip, Memory, Goal, PanelType, MemoryCategory, MemoryProposal, GoalType, GoalStatus, Milestone } from '@/constants/types';
import { SCENARIOS } from '@/constants/scenarios';
import { generateAIResponse } from '@/constants/aiResponse';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const TYPING_INDICATOR_ID = '__typing_indicator__';

export type ChatMode = 'demo' | 'live';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  memories: Memory[];
  goals: Goal[];
  createdAt: Date;
  updatedAt: Date;
}

function getApiBaseUrl(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api`;
  return '/api';
}

const API_BASE = getApiBaseUrl();

interface CoachState {
  messages: Message[];
  memories: Memory[];
  goals: Goal[];
  isTyping: boolean;
  activePanel: PanelType;
  activeScenario: string;
  showOnboarding: boolean;
  chatMode: ChatMode;
  inputFocused: boolean;
  chatHistory: ChatSession[];
  currentSessionId: string | null;
  sessionTitle: string;
}

interface CoachContextType extends CoachState {
  sendMessage: (text: string) => void;
  setActivePanel: (panel: PanelType) => void;
  switchScenario: (id: string) => void;
  startLiveChat: () => void;
  confirmMemory: (messageId: string) => void;
  dismissMemoryProposal: (messageId: string) => void;
  confirmGoal: (messageId: string) => void;
  dismissGoalProposal: (messageId: string) => void;
  acceptInsightToAction: (messageId: string) => void;
  saveInsightMemoryOnly: (messageId: string) => void;
  dismissInsightToAction: (messageId: string) => void;
  addMemory: (content: string, category: MemoryCategory) => void;
  editMemory: (id: string, content: string) => void;
  pauseMemory: (id: string) => void;
  deleteMemory: (id: string) => void;
  restoreMemory: (id: string) => void;
  clearConversation: () => void;
  setInputFocused: (val: boolean) => void;
  saveAndClose: () => void;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
  highlightedMemoryId: string | null;
  navigateToMemory: (memoryIds: string[]) => void;
}

const CoachContext = createContext<CoachContextType | null>(null);

export function useCoach() {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error('useCoach must be used within CoachProvider');
  return ctx;
}

interface MemoryAction {
  type: 'save' | 'proposal' | 'update';
  category: string;
  content: string;
}

interface GoalAction {
  type: string;
  title: string;
  targetAmount: number;
  monthsUntilTarget: number;
  monthlyContribution: number;
  linkedAccount: string;
}

const VALID_MEMORY_CATEGORIES = new Set<string>([
  'ABOUT_ME', 'PREFERENCES', 'PRIORITIES',
]);

function isValidMemoryCategory(cat: string): cat is MemoryCategory {
  return VALID_MEMORY_CATEGORIES.has(cat);
}

function stripStreamingMarkers(text: string): string {
  let clean = text;
  const sugIdx = clean.indexOf('[SUGGESTIONS]');
  if (sugIdx !== -1) clean = clean.slice(0, sugIdx);
  clean = clean.replace(/\n?\[MEMORY_SAVE\][^\n]*/g, '');
  clean = clean.replace(/\n?\[MEMORY_PROPOSAL\][^\n]*/g, '');
  clean = clean.replace(/\n?\[MEMORY_UPDATE\][^\n]*/g, '');
  clean = clean.replace(/\n?\[GOAL_PROPOSAL\][^\n]*/g, '');
  return clean.trimEnd();
}

function getActiveMemoryStrings(memories: Memory[]): string[] {
  return memories
    .filter(m => m.status === 'ACTIVE')
    .map(m => `[${m.category}] ${m.content}`);
}

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activePanel, setActivePanelState] = useState<PanelType>('none');
  const [activeScenario, setActiveScenario] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('live');
  const [inputFocused, setInputFocused] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState('Coach');
  const [highlightedMemoryId, setHighlightedMemoryId] = useState<string | null>(null);
  const titleGeneratedRef = useRef(false);

  const memoriesRef = useRef(memories);
  memoriesRef.current = memories;
  const goalsRef = useRef(goals);
  goalsRef.current = goals;
  const chatModeRef = useRef(chatMode);
  chatModeRef.current = chatMode;
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionVersionRef = useRef(0);


  const setActivePanel = useCallback((panel: PanelType) => {
    setActivePanelState(prev => prev === panel ? 'none' : panel);
  }, []);

  const switchScenario = useCallback((id: string) => {
    const scenario = SCENARIOS.find(s => s.id === id);
    if (!scenario) return;
    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    sessionVersionRef.current += 1;
    setChatMode('demo');
    setMessages([...scenario.messages]);
    setMemories([...scenario.memories]);
    setGoals([...scenario.goals]);
    setIsTyping(false);
    setActivePanelState('none');
    setActiveScenario(id);
    setShowOnboarding(id === 'cold-start');
    setSessionTitle(scenario.title);
    titleGeneratedRef.current = true;
  }, []);

  const startLiveChat = useCallback(() => {
    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    sessionVersionRef.current += 1;
    setChatMode('live');
    setMessages([]);
    setMemories([]);
    setGoals([]);
    setIsTyping(false);

    setActivePanelState('none');
    setActiveScenario('');
    setShowOnboarding(false);
    setSessionTitle('Coach');
    titleGeneratedRef.current = false;
  }, []);

  const addGoalFromProposal = useCallback((proposal: { type: GoalType; title: string; targetAmount: number; targetDate: Date; monthlyContribution: number; linkedAccount: string }) => {
    const existing = goalsRef.current.find(g => g.title === proposal.title && g.type === proposal.type && g.status !== 'COMPLETED');
    if (existing) return;
    const milestones: Milestone[] = [25, 50, 75, 100].map(pct => ({
      id: uid(), label: `${pct}%`, targetPct: pct, reached: false,
    }));
    const newGoal: Goal = {
      id: uid(),
      type: proposal.type,
      title: proposal.title,
      targetAmount: proposal.targetAmount,
      currentAmount: 0,
      targetDate: proposal.targetDate,
      monthlyContributionTarget: proposal.monthlyContribution,
      actualMonthlyContribution: proposal.monthlyContribution,
      status: 'ACTIVE',
      confidenceScore: 0.88,
      milestones,
      linkedAccount: proposal.linkedAccount,
      createdAt: new Date(),
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoalSettings = useCallback((update: { goalTitle: string; monthlyContribution?: number; targetDate?: Date; status?: GoalStatus; confidenceScore?: number; currentAmount?: number }) => {
    setGoals(prev => prev.map(g => {
      if (g.title !== update.goalTitle) return g;
      const updated = { ...g };
      if (update.monthlyContribution !== undefined) {
        updated.monthlyContributionTarget = update.monthlyContribution;
        updated.actualMonthlyContribution = update.monthlyContribution;
      }
      if (update.targetDate !== undefined) updated.targetDate = update.targetDate;
      if (update.status !== undefined) updated.status = update.status;
      if (update.confidenceScore !== undefined) updated.confidenceScore = update.confidenceScore;
      if (update.currentAmount !== undefined) {
        updated.currentAmount = update.currentAmount;
        const pct = updated.currentAmount / updated.targetAmount;
        if (pct >= 1) {
          updated.status = 'COMPLETED';
          updated.milestones = updated.milestones.map(m => ({ ...m, reached: true, reachedAt: m.reachedAt || new Date() }));
        } else if (pct >= 0.7) {
          updated.status = updated.status === 'COMPLETED' ? 'COMPLETED' : 'ON_TRACK';
        } else {
          updated.status = updated.status === 'COMPLETED' ? 'COMPLETED' : 'AT_RISK';
        }
      }
      return updated;
    }));
  }, []);

  const generateTitle = useCallback(async (allMessages: Message[], version: number) => {
    try {
      const formatted = allMessages
        .filter(m => m.role === 'user' || m.role === 'ai')
        .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));
      const res = await fetch(`${API_BASE}/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: formatted }),
      });
      if (sessionVersionRef.current !== version) return;
      if (res.ok) {
        const data = await res.json();
        if (sessionVersionRef.current === version && data.title) {
          setSessionTitle(data.title);
        }
      }
    } catch {}
  }, []);

  const shouldAllowProposal = useCallback((): boolean => {
    return true;
  }, []);

  type LiveExtras = {
    chips?: MessageChip[];
    memoryProposal?: Message['memoryProposal'];
    goalProposal?: Message['goalProposal'];
    insightToAction?: Message['insightToAction'];
  };

  const applyMemoryAndGoalActions = useCallback((
    memActions: MemoryAction[],
    goalActs: GoalAction[],
    aiMsgId: string,
  ): LiveExtras => {
    const newMemories: Memory[] = [];
    const updatedMemoryIds: string[] = [];
    let prioritiesProposal: MemoryProposal | undefined;
    let otherProposal: MemoryProposal | undefined;

    if (memActions && memActions.length > 0) {
      for (const action of memActions) {
        if (!isValidMemoryCategory(action.category)) continue;
        const category = action.category;

        const normalizedContent = action.content.toLowerCase().trim();
        const isDuplicate = memoriesRef.current.some(
          m => m.status === 'ACTIVE' && m.content.toLowerCase().trim() === normalizedContent
        ) || newMemories.some(
          m => m.content.toLowerCase().trim() === normalizedContent
        );
        if (isDuplicate) continue;

        if (action.type === 'update') {
          const sameCategory = memoriesRef.current.filter(
            m => m.status === 'ACTIVE' && m.category === category
          );
          if (sameCategory.length > 0) {
            const words = normalizedContent.split(/\s+/);
            let bestMatch = sameCategory[0];
            let bestScore = 0;
            for (const mem of sameCategory) {
              const memWords = mem.content.toLowerCase().trim().split(/\s+/);
              const overlap = words.filter(w => memWords.includes(w)).length;
              if (overlap > bestScore) { bestScore = overlap; bestMatch = mem; }
            }
            setMemories(prev => prev.map(m =>
              m.id === bestMatch.id ? { ...m, content: action.content, updatedAt: new Date() } : m
            ));
            updatedMemoryIds.push(bestMatch.id);
          } else {
            newMemories.push({
              id: uid(), category, content: action.content,
              source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE',
              createdAt: new Date(), updatedAt: new Date(),
            });
          }
        } else if (action.type === 'save') {
          newMemories.push({
            id: uid(), category, content: action.content,
            source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE',
            createdAt: new Date(), updatedAt: new Date(),
          });
        } else if (action.type === 'proposal' && shouldAllowProposal()) {
          const p = { id: uid(), content: action.content, category: category as MemoryCategory };
          if (category === 'PRIORITIES' && !prioritiesProposal) {
            prioritiesProposal = p;
          } else if (!otherProposal) {
            otherProposal = p;
          }
        }
      }
    }

    const result: LiveExtras = {};
    const chips: MessageChip[] = [];

    if (newMemories.length > 0) {
      setMemories(prev => [...prev, ...newMemories]);
      const memoryIds = newMemories.map(m => m.id);
      const count = newMemories.length;
      chips.push({ type: 'memory-saved', label: count === 1 ? 'Saved to memory' : `${count} items saved to memory`, memoryIds });
    }

    if (updatedMemoryIds.length > 0) {
      const count = updatedMemoryIds.length;
      chips.push({ type: 'memory-updated', label: count === 1 ? 'Memory updated' : `${count} memories updated`, memoryIds: updatedMemoryIds });
    }

    if (chips.length > 0) result.chips = chips;

    const goalAction = goalActs && goalActs.length > 0 ? goalActs[0] : null;

    if (goalAction && prioritiesProposal) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + goalAction.monthsUntilTarget);
      result.insightToAction = {
        id: uid(),
        memory: { content: prioritiesProposal.content, category: prioritiesProposal.category as MemoryCategory, saved: false },
        goalProposal: {
          id: uid(),
          type: goalAction.type as GoalType,
          title: goalAction.title,
          targetAmount: goalAction.targetAmount,
          targetDate,
          monthlyContribution: goalAction.monthlyContribution,
          linkedAccount: goalAction.linkedAccount,
        },
        dismissed: false,
      };
      if (otherProposal) {
        result.memoryProposal = otherProposal;
      }
    } else if (goalAction) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + goalAction.monthsUntilTarget);
      result.goalProposal = {
        id: uid(),
        type: goalAction.type as GoalType,
        title: goalAction.title,
        targetAmount: goalAction.targetAmount,
        targetDate,
        monthlyContribution: goalAction.monthlyContribution,
        linkedAccount: goalAction.linkedAccount,
      };
      if (prioritiesProposal || otherProposal) {
        result.memoryProposal = prioritiesProposal || otherProposal;
      }
    } else {
      const proposal = prioritiesProposal || otherProposal;
      if (proposal) {
        result.memoryProposal = proposal;
      }
    }

    return result;
  }, [shouldAllowProposal]);

  const attemptStreamRequest = useCallback(async (
    text: string, history: { role: 'user' | 'assistant'; content: string }[],
    controller: AbortController, aiMsgId: string, version: number,
    memoryStrings: string[],
  ): Promise<boolean> => {
    const body: Record<string, unknown> = { message: text, history, memories: memoryStrings };

    const overallTimer = setTimeout(() => controller.abort(), 60_000);

    const res = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (sessionVersionRef.current !== version) return true;

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Something went wrong' }));
      const errContent = errData.error || 'Something went wrong. Please try again.';
      setMessages(prev => prev.map(m =>
        m.id === TYPING_INDICATOR_ID
          ? { ...m, id: uid(), content: errContent, isTypingIndicator: false }
          : m
      ));
      setIsTyping(false);
      return true;
    }

    const reader = res.body?.getReader();
    if (!reader) { clearTimeout(overallTimer); throw new Error('No reader'); }
    const decoder = new TextDecoder();
    let sseBuffer = '';
    let fullContent = '';
    const tokenQueue: string[] = [];
    let donePayload: { reply?: string; suggestions?: string[]; memoryActions?: MemoryAction[]; goalActions?: GoalAction[]; error?: string } | null = null;

    let stallTimer: ReturnType<typeof setTimeout> | null = null;
    const STALL_TIMEOUT = 20_000;
    const resetStallTimer = () => {
      if (stallTimer) clearTimeout(stallTimer);
      stallTimer = setTimeout(() => { controller.abort(); }, STALL_TIMEOUT);
    };
    resetStallTimer();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (sessionVersionRef.current !== version) { reader.cancel(); clearTimeout(overallTimer); if (stallTimer) clearTimeout(stallTimer); return true; }

      resetStallTimer();
      sseBuffer += decoder.decode(value, { stream: true });
      const lines = sseBuffer.split('\n');
      sseBuffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6);
        if (!jsonStr) continue;

        try {
          const event = JSON.parse(jsonStr);
          if (event.type === 'token') {
            fullContent += event.content;
            tokenQueue.push(event.content);
          } else if (event.type === 'done') {
            donePayload = event;
          } else if (event.type === 'error') {
            donePayload = { error: event.error };
          }
        } catch {}
      }
    }

    if (stallTimer) clearTimeout(stallTimer);
    clearTimeout(overallTimer);

    if (sseBuffer.trim()) {
      const remaining = sseBuffer.trim();
      if (remaining.startsWith('data: ')) {
        try {
          const event = JSON.parse(remaining.slice(6));
          if (event.type === 'done') donePayload = event;
          else if (event.type === 'error') donePayload = { error: event.error };
        } catch {}
      }
    }

    const finalReply = donePayload?.reply || fullContent;
    const suggestions = Array.isArray(donePayload?.suggestions) && donePayload!.suggestions!.length > 0 ? donePayload!.suggestions : undefined;
    const memoryActions = donePayload?.memoryActions || [];
    const goalActions = donePayload?.goalActions || [];

    if (donePayload?.error) {
      setIsTyping(false);
      setMessages(prev => prev.map(m =>
        m.id === TYPING_INDICATOR_ID
          ? { ...m, id: uid(), content: donePayload!.error!, isStreaming: false, isTypingIndicator: false }
          : m
      ));
      return true;
    }

    let liveExtras: LiveExtras = {};
    if (memoryActions.length > 0 || goalActions.length > 0) {
      liveExtras = applyMemoryAndGoalActions(memoryActions, goalActions, aiMsgId);
    }

    if (tokenQueue.length === 0) {
      setIsTyping(false);
      setMessages(prev => prev.map(m =>
        m.id === TYPING_INDICATOR_ID
          ? { ...m, id: uid(), content: finalReply, isStreaming: false, isTypingIndicator: false, suggestions, ...liveExtras }
          : m
      ));
      return true;
    }

    return new Promise<boolean>((resolve) => {
      let rawDisplayed = '';
      let idx = 0;
      const TOKEN_MS = 15;

      setIsTyping(false);
      const firstToken = tokenQueue[0];
      rawDisplayed = firstToken;
      idx = 1;
      const cleanFirst = stripStreamingMarkers(rawDisplayed);
      const earlyChips = liveExtras.chips;
      setMessages(prev => prev.map(m =>
        m.id === TYPING_INDICATOR_ID
          ? { ...m, id: aiMsgId, content: cleanFirst, isStreaming: true, isTypingIndicator: false, chips: earlyChips }
          : m
      ));

      const timer = setInterval(() => {
        if (sessionVersionRef.current !== version) {
          clearInterval(timer);
          resolve(true);
          return;
        }

        if (idx < tokenQueue.length) {
          rawDisplayed += tokenQueue[idx];
          idx++;
          const shown = stripStreamingMarkers(rawDisplayed);
          setMessages(prev => prev.map(m =>
            m.id === aiMsgId ? { ...m, content: shown } : m
          ));
        } else {
          clearInterval(timer);
          setMessages(prev => {
            const updated = prev.map(m =>
              m.id === aiMsgId ? { ...m, content: finalReply, isStreaming: false, suggestions, ...liveExtras } : m
            );
            if (!titleGeneratedRef.current) {
              titleGeneratedRef.current = true;
              generateTitle(updated, version);
            }
            return updated;
          });
          resolve(true);
        }
      }, TOKEN_MS);
    });
  }, [generateTitle, applyMemoryAndGoalActions]);

  const drainReplyWithAnimation = useCallback((
    reply: string, aiMsgId: string, version: number,
    suggestions?: string[],
    liveExtras?: LiveExtras,
  ) => {
    const words = reply.split(/(\s+)/);
    const TOKEN_MS = 8;
    let displayed = '';
    let idx = 0;

    setIsTyping(false);
    displayed = words[0] || '';
    idx = 1;
    const earlyChips = liveExtras?.chips;
    setMessages(prev => prev.map(m =>
      m.id === TYPING_INDICATOR_ID
        ? { ...m, id: aiMsgId, content: displayed, isStreaming: true, isTypingIndicator: false, chips: earlyChips }
        : m
    ));

    return new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        if (sessionVersionRef.current !== version) {
          clearInterval(timer);
          resolve();
          return;
        }
        if (idx < words.length) {
          displayed += words[idx];
          idx++;
          const shown = displayed;
          setMessages(prev => prev.map(m =>
            m.id === aiMsgId ? { ...m, content: shown } : m
          ));
        } else {
          clearInterval(timer);
          setMessages(prev => {
            const updated = prev.map(m =>
              m.id === aiMsgId ? { ...m, content: reply, isStreaming: false, suggestions, ...(liveExtras || {}) } : m
            );
            if (!titleGeneratedRef.current) {
              titleGeneratedRef.current = true;
              generateTitle(updated, version);
            }
            return updated;
          });
          resolve();
        }
      }, TOKEN_MS);
    });
  }, [generateTitle]);

  const fallbackNonStreaming = useCallback(async (
    text: string, history: { role: 'user' | 'assistant'; content: string }[],
    controller: AbortController, aiMsgId: string, version: number,
    memoryStrings: string[],
  ) => {
    const body: Record<string, unknown> = { message: text, history, memories: memoryStrings };

    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (sessionVersionRef.current !== version) return;

    const data = await res.json();
    if (!res.ok) {
      const errContent = data.error || 'Something went wrong. Please try again.';
      setMessages(prev => prev.map(m => {
        if (m.id === aiMsgId) return { ...m, content: errContent, isStreaming: false };
        if (m.id === TYPING_INDICATOR_ID) return { ...m, id: uid(), content: errContent, isTypingIndicator: false };
        return m;
      }));
      setIsTyping(false);
      return;
    }

    const suggestions = Array.isArray(data.suggestions) && data.suggestions.length > 0 ? data.suggestions : undefined;

    let liveExtras: LiveExtras = {};
    const memActs = data.memoryActions || [];
    const goalActs = data.goalActions || [];
    if (memActs.length > 0 || goalActs.length > 0) {
      liveExtras = applyMemoryAndGoalActions(memActs, goalActs, aiMsgId);
    }

    await drainReplyWithAnimation(data.reply, aiMsgId, version, suggestions, liveExtras);
  }, [drainReplyWithAnimation, applyMemoryAndGoalActions]);

  const supportsStreaming = typeof ReadableStream !== 'undefined';

  const sendLiveMessage = useCallback(async (text: string, version: number) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    let controller = new AbortController();
    abortControllerRef.current = controller;

    const aiMsgId = uid();

    const currentMessages = [...(messagesRef.current || [])];
    const history = currentMessages
      .filter(m => (m.role === 'user' || m.role === 'ai') && !m.isTypingIndicator)
      .map(m => ({ role: m.role === 'ai' ? 'assistant' as const : 'user' as const, content: m.content }));

    const memoryStrings = getActiveMemoryStrings(memoriesRef.current);

    if (!supportsStreaming) {
      try {
        const body: Record<string, unknown> = { message: text, history, memories: memoryStrings };

        const res = await fetch(`${API_BASE}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        if (sessionVersionRef.current !== version) return;
        const data = await res.json();
        if (!res.ok) {
          setMessages(prev => prev.map(m =>
            m.id === TYPING_INDICATOR_ID
              ? { ...m, id: uid(), content: data.error || 'Something went wrong.', isTypingIndicator: false }
              : m
          ));
          setIsTyping(false);
          return;
        }
        const suggestions = Array.isArray(data.suggestions) && data.suggestions.length > 0 ? data.suggestions : undefined;

        let liveExtras: LiveExtras = {};
        const memActs2 = data.memoryActions || [];
        const goalActs2 = data.goalActions || [];
        if (memActs2.length > 0 || goalActs2.length > 0) {
          liveExtras = applyMemoryAndGoalActions(memActs2, goalActs2, aiMsgId);
        }

        await drainReplyWithAnimation(data.reply, aiMsgId, version, suggestions, liveExtras);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError' || sessionVersionRef.current !== version) return;
        setMessages(prev => prev.map(m =>
          m.id === TYPING_INDICATOR_ID
            ? { ...m, id: uid(), content: 'Unable to connect to the server. Please check your connection and try again.', isTypingIndicator: false }
            : m
        ));
        setIsTyping(false);
        return;
      }
    }

    let timedOut = false;
    const MAX_RETRIES = 2;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await attemptStreamRequest(text, history, controller, aiMsgId, version, memoryStrings);
        return;
      } catch (err: any) {
        if (sessionVersionRef.current !== version) return;
        if (err.name === 'AbortError' && controller.signal.aborted) {
          timedOut = true;
          break;
        }
        if (attempt < MAX_RETRIES) {
          controller = new AbortController();
          abortControllerRef.current = controller;
          await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
          continue;
        }
        try {
          await fallbackNonStreaming(text, history, controller, aiMsgId, version, memoryStrings);
          return;
        } catch (fallbackErr: any) {
          if (sessionVersionRef.current !== version) return;
        }
      }
    }

    const fallback = timedOut
      ? 'The response took too long. Please try again.'
      : 'Unable to connect to the server. Please check your connection and try again.';
    setMessages(prev => {
      const hasStreamMsg = prev.some(m => m.id === aiMsgId);
      if (hasStreamMsg) {
        return prev.map(m => m.id === aiMsgId
          ? { ...m, content: m.content || fallback, isStreaming: false }
          : m
        );
      }
      return prev.map(m =>
        m.id === TYPING_INDICATOR_ID
          ? { ...m, id: uid(), content: fallback, isTypingIndicator: false }
          : m
      );
    });
    setIsTyping(false);
  }, [attemptStreamRequest, fallbackNonStreaming, supportsStreaming, drainReplyWithAnimation, applyMemoryAndGoalActions]);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const sendMessage = useCallback((text: string) => {
    const userMsg: Message = {
      id: uid(), role: 'user', content: text, timestamp: new Date(),
    };
    const typingMsg: Message = {
      id: TYPING_INDICATOR_ID, role: 'ai', content: '', timestamp: new Date(), isTypingIndicator: true,
    };
    setMessages(prev => {
      if (prev.length === 0) {
        setCurrentSessionId(uid());
      }
      return [...prev.filter(m => m.id !== TYPING_INDICATOR_ID), userMsg, typingMsg];
    });
    setIsTyping(true);

    const version = sessionVersionRef.current;

    if (chatModeRef.current === 'live') {
      sendLiveMessage(text, version);
      return;
    }

    const currentMemories = memoriesRef.current;
    const currentGoals = goalsRef.current;

    const delay = 800 + Math.random() * 700;
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    pendingTimerRef.current = setTimeout(() => {
      pendingTimerRef.current = null;
      if (sessionVersionRef.current !== version) return;
      const response = generateAIResponse(text, {
        memories: currentMemories,
        goals: currentGoals,
      });

      if (!response) {
        sendLiveMessage(text, version);
        return;
      }

      const chips: MessageChip[] = [...(response.chips || [])];

      if (response.autoSaveMemory) {
        const memId = uid();
        chips.push({ type: 'memory-saved', label: 'Saved to memory', memoryIds: [memId] });
        const mem: Memory = {
          id: memId,
          category: response.autoSaveMemory.category,
          content: response.autoSaveMemory.content,
          source: 'IMPLICIT_CONFIRMED',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMemories(prev => [...prev, mem]);
      }

      if (response.autoCreateGoal) {
        addGoalFromProposal(response.autoCreateGoal);
      }

      if (response.autoUpdateGoal) {
        updateGoalSettings(response.autoUpdateGoal);
      }

      const aiMsg: Message = {
        id: uid(),
        role: 'ai',
        content: response.content || '',
        timestamp: new Date(),
        chips: chips.length > 0 ? chips : undefined,
        memoryProposal: response.memoryProposal,
        goalProposal: response.goalProposal,
        insightToAction: response.insightToAction,
        suggestions: response.suggestions,
        provenance: response.provenance,
        safetyTier: response.safetyTier,
        safetyMessage: response.safetyMessage,
      };

      setMessages(prev => prev.map(m =>
        m.id === TYPING_INDICATOR_ID ? aiMsg : m
      ));
      setIsTyping(false);
    }, delay);
  }, [addGoalFromProposal, updateGoalSettings, sendLiveMessage]);

  const confirmMemory = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.memoryProposal) return m;
      const mem: Memory = {
        id: uid(),
        category: m.memoryProposal.category,
        content: m.memoryProposal.content,
        source: 'IMPLICIT_CONFIRMED',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMemories(prev2 => [...prev2, mem]);
      return { ...m, memoryProposal: { ...m.memoryProposal, confirmed: true } };
    }));
  }, []);

  const dismissMemoryProposal = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      return { ...m, memoryProposal: undefined };
    }));
  }, []);

  const confirmGoal = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.goalProposal) return m;
      addGoalFromProposal(m.goalProposal);
      return { ...m, goalProposal: { ...m.goalProposal, confirmed: true } };
    }));
  }, [addGoalFromProposal]);

  const dismissGoalProposal = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      return { ...m, goalProposal: undefined };
    }));
  }, []);

  const acceptInsightToAction = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.insightToAction) return m;
      const insight = m.insightToAction;
      const mem: Memory = {
        id: uid(), category: insight.memory.category, content: insight.memory.content,
        source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
      };
      setMemories(prev2 => [...prev2, mem]);
      addGoalFromProposal(insight.goalProposal);
      return { ...m, insightToAction: { ...insight, accepted: true, memory: { ...insight.memory, saved: true } } };
    }));
  }, [addGoalFromProposal]);

  const saveInsightMemoryOnly = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.insightToAction) return m;
      const insight = m.insightToAction;
      const mem: Memory = {
        id: uid(), category: insight.memory.category, content: insight.memory.content,
        source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
      };
      setMemories(prev2 => [...prev2, mem]);
      return { ...m, insightToAction: { ...insight, memoryOnly: true, memory: { ...insight.memory, saved: true } } };
    }));
  }, []);

  const dismissInsightToAction = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.insightToAction) return m;
      return { ...m, insightToAction: { ...m.insightToAction, dismissed: true } };
    }));
  }, []);

  const addMemory = useCallback((content: string, category: MemoryCategory) => {
    const mem: Memory = {
      id: uid(), category, content, source: 'EXPLICIT',
      status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
    };
    setMemories(prev => [...prev, mem]);
  }, []);

  const editMemory = useCallback((id: string, content: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, content, updatedAt: new Date() } : m));
  }, []);

  const pauseMemory = useCallback((id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED' } : m));
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, status: 'DELETED' } : m));
  }, []);

  const restoreMemory = useCallback((id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, status: 'ACTIVE' } : m));
  }, []);

  const navigateToMemory = useCallback((memoryIds: string[]) => {
    const activeMemory = memoriesRef.current.find(
      m => memoryIds.includes(m.id) && m.status !== 'DELETED'
    );
    if (activeMemory) {
      setHighlightedMemoryId(activeMemory.id);
      setActivePanelState('memory');
      setTimeout(() => setHighlightedMemoryId(null), 3000);
    }
  }, []);

  const sessionTitleRef = useRef(sessionTitle);
  sessionTitleRef.current = sessionTitle;

  const saveAndClose = useCallback(() => {
    const currentMessages = messagesRef.current;
    if (currentMessages.length > 0 && chatModeRef.current === 'live') {
      const title = sessionTitleRef.current !== 'Coach' ? sessionTitleRef.current : 'New conversation';
      const now = new Date();
      const sessionId = currentSessionId || uid();
      setChatHistory(prev => {
        const existing = prev.findIndex(s => s.id === sessionId);
        const session: ChatSession = {
          id: sessionId,
          title,
          messages: currentMessages.filter(m => !m.isTypingIndicator),
          memories: [...memoriesRef.current],
          goals: [...goalsRef.current],
          createdAt: existing >= 0 ? prev[existing].createdAt : now,
          updatedAt: now,
        };
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = session;
          return updated;
        }
        return [session, ...prev];
      });
    }
    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    sessionVersionRef.current += 1;
    setChatMode('live');
    setMessages([]);
    setMemories([]);
    setGoals([]);
    setIsTyping(false);

    setActivePanelState('none');
    setActiveScenario('');
    setShowOnboarding(false);
    setCurrentSessionId(null);
    setSessionTitle('Coach');
    titleGeneratedRef.current = false;
  }, [currentSessionId]);

  const loadSession = useCallback((id: string) => {
    const session = chatHistory.find(s => s.id === id);
    if (!session) return;
    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    sessionVersionRef.current += 1;
    setChatMode('live');
    setMessages([...session.messages]);
    setMemories([...session.memories]);
    setGoals([...session.goals]);
    setIsTyping(false);

    setActivePanelState('none');
    setActiveScenario('');
    setShowOnboarding(false);
    setCurrentSessionId(id);
    setSessionTitle(session.title);
    titleGeneratedRef.current = true;
  }, [chatHistory]);

  const deleteSession = useCallback((id: string) => {
    setChatHistory(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearConversation = useCallback(() => {
    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
    if (abortControllerRef.current) { abortControllerRef.current.abort(); abortControllerRef.current = null; }
    sessionVersionRef.current += 1;
    setMessages([]);
    setIsTyping(false);
    setShowOnboarding(chatModeRef.current === 'demo');
  }, []);

  return (
    <CoachContext.Provider value={{
      messages, memories, goals, isTyping, activePanel, activeScenario, showOnboarding, chatMode, inputFocused,
      chatHistory, currentSessionId, sessionTitle,
      sendMessage, setActivePanel, switchScenario, startLiveChat,
      confirmMemory, dismissMemoryProposal, confirmGoal, dismissGoalProposal,
      acceptInsightToAction, saveInsightMemoryOnly, dismissInsightToAction,
      addMemory, editMemory, pauseMemory, deleteMemory, restoreMemory, clearConversation, setInputFocused,
      saveAndClose, loadSession, deleteSession, highlightedMemoryId, navigateToMemory,
    }}>
      {children}
    </CoachContext.Provider>
  );
}
