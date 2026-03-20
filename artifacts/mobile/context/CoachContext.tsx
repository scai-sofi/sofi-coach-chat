import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Message, MessageChip, Memory, Goal, PanelType, MemoryCategory, GoalType, GoalStatus, Milestone } from '@/constants/types';
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
  temporaryChat: boolean;
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
  setTemporaryChat: (val: boolean) => void;
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
  clearConversation: () => void;
  setInputFocused: (val: boolean) => void;
  saveAndClose: () => void;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
}

const CoachContext = createContext<CoachContextType | null>(null);

export function useCoach() {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error('useCoach must be used within CoachProvider');
  return ctx;
}

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [temporaryChat, setTemporaryChat] = useState(false);
  const [activePanel, setActivePanelState] = useState<PanelType>('none');
  const [activeScenario, setActiveScenario] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('live');
  const [inputFocused, setInputFocused] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState('Coach');
  const titleGeneratedRef = useRef(false);

  const memoriesRef = useRef(memories);
  memoriesRef.current = memories;
  const goalsRef = useRef(goals);
  goalsRef.current = goals;
  const tempChatRef = useRef(temporaryChat);
  tempChatRef.current = temporaryChat;
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
    setTemporaryChat(false);
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
    setTemporaryChat(false);
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

  const sendLiveMessage = useCallback(async (text: string, version: number) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const aiMsgId = uid();

    try {
      const currentMessages = [...(messagesRef.current || [])];
      const history = currentMessages
        .filter(m => (m.role === 'user' || m.role === 'ai') && !m.isTypingIndicator)
        .map(m => ({ role: m.role === 'ai' ? 'assistant' as const : 'user' as const, content: m.content }));

      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });

      if (sessionVersionRef.current !== version) return;

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Something went wrong' }));
        const errContent = errData.error || 'Something went wrong. Please try again.';
        setMessages(prev => prev.map(m =>
          m.id === TYPING_INDICATOR_ID
            ? { ...m, id: uid(), content: errContent, isTypingIndicator: false }
            : m
        ));
        setIsTyping(false);
        return;
      }

      setIsTyping(false);

      setMessages(prev => prev.map(m =>
        m.id === TYPING_INDICATOR_ID
          ? { ...m, id: aiMsgId, content: '', isStreaming: true, isTypingIndicator: false }
          : m
      ));

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');
      const decoder = new TextDecoder();
      let sseBuffer = '';
      let fullContent = '';
      let displayedContent = '';
      let tokenQueue: string[] = [];
      let streamDone = false;
      let donePayload: { reply?: string; suggestions?: string[]; error?: string } | null = null;

      const FLUSH_INTERVAL = 18;

      const flushTokens = () => {
        if (sessionVersionRef.current !== version) return;

        if (tokenQueue.length > 0) {
          const batch = tokenQueue.splice(0, Math.max(1, Math.ceil(tokenQueue.length / 3)));
          displayedContent += batch.join('');
          const shown = displayedContent;
          setMessages(prev => prev.map(m =>
            m.id === aiMsgId ? { ...m, content: shown } : m
          ));
        }

        if (tokenQueue.length > 0) {
          setTimeout(flushTokens, FLUSH_INTERVAL);
        } else if (streamDone) {
          if (donePayload?.error) {
            setMessages(prev => prev.map(m =>
              m.id === aiMsgId ? { ...m, content: donePayload!.error!, isStreaming: false } : m
            ));
          } else {
            const finalReply = donePayload?.reply || fullContent;
            const suggestions = Array.isArray(donePayload?.suggestions) && donePayload!.suggestions!.length > 0 ? donePayload!.suggestions : undefined;
            setMessages(prev => {
              const updated = prev.map(m =>
                m.id === aiMsgId ? { ...m, content: finalReply, isStreaming: false, suggestions } : m
              );
              if (!titleGeneratedRef.current) {
                titleGeneratedRef.current = true;
                generateTitle(updated, version);
              }
              return updated;
            });
          }
        }
      };

      let flushScheduled = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (sessionVersionRef.current !== version) { reader.cancel(); return; }

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
              if (!flushScheduled) {
                flushScheduled = true;
                setTimeout(() => { flushScheduled = false; flushTokens(); }, FLUSH_INTERVAL);
              }
            } else if (event.type === 'done') {
              donePayload = event;
            } else if (event.type === 'error') {
              donePayload = { error: event.error };
            }
          } catch {}
        }
      }

      streamDone = true;
      if (tokenQueue.length > 0) {
        flushTokens();
      } else {
        const finalReply = donePayload?.reply || fullContent;
        const suggestions = Array.isArray(donePayload?.suggestions) && donePayload!.suggestions!.length > 0 ? donePayload!.suggestions : undefined;
        setMessages(prev => {
          const updated = prev.map(m =>
            m.id === aiMsgId ? { ...m, content: finalReply, isStreaming: false, suggestions } : m
          );
          if (!titleGeneratedRef.current) {
            titleGeneratedRef.current = true;
            generateTitle(updated, version);
          }
          return updated;
        });
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || sessionVersionRef.current !== version) return;
      const fallback = 'Unable to connect to the server. Please check your connection and try again.';
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
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
    }
  }, [generateTitle]);

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
    const isTempChat = tempChatRef.current;

    const delay = 800 + Math.random() * 700;
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    pendingTimerRef.current = setTimeout(() => {
      pendingTimerRef.current = null;
      if (sessionVersionRef.current !== version) return;
      const response = generateAIResponse(text, {
        memories: currentMemories,
        goals: currentGoals,
        temporaryChat: isTempChat,
      });

      if (!response) {
        sendLiveMessage(text, version);
        return;
      }

      if (isTempChat) {
        response.memoryProposal = undefined;
        response.insightToAction = undefined;
        response.autoSaveMemory = undefined;
        response.autoCreateGoal = undefined;
      }

      const chips: MessageChip[] = [...(response.chips || [])];

      if (response.autoSaveMemory && !isTempChat) {
        chips.push({ type: 'memory-saved', label: 'Saved to memory' });
        const mem: Memory = {
          id: uid(),
          category: response.autoSaveMemory.category,
          content: response.autoSaveMemory.content,
          source: 'IMPLICIT_CONFIRMED',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setMemories(prev => [...prev, mem]);
      }

      if (response.autoCreateGoal && !isTempChat) {
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
    setTemporaryChat(false);
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
    setTemporaryChat(false);
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
      messages, memories, goals, isTyping, temporaryChat, activePanel, activeScenario, showOnboarding, chatMode, inputFocused,
      chatHistory, currentSessionId, sessionTitle,
      sendMessage, setActivePanel, setTemporaryChat, switchScenario, startLiveChat,
      confirmMemory, dismissMemoryProposal, confirmGoal, dismissGoalProposal,
      acceptInsightToAction, saveInsightMemoryOnly, dismissInsightToAction,
      addMemory, editMemory, pauseMemory, deleteMemory, clearConversation, setInputFocused,
      saveAndClose, loadSession, deleteSession,
    }}>
      {children}
    </CoachContext.Provider>
  );
}
