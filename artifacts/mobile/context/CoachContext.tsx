import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Message, MessageChip, Memory, Goal, PanelType, MemoryCategory, MemorySource, GoalType, GoalStatus, Milestone } from '@/constants/types';
import { SCENARIOS, SCENARIO_ORDER } from '@/constants/scenarios';
import { generateAIResponse } from '@/constants/aiResponse';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

interface CoachState {
  messages: Message[];
  memories: Memory[];
  goals: Goal[];
  isTyping: boolean;
  temporaryChat: boolean;
  activePanel: PanelType;
  activeScenario: string;
  showOnboarding: boolean;
}

interface CoachContextType extends CoachState {
  sendMessage: (text: string) => void;
  setActivePanel: (panel: PanelType) => void;
  setTemporaryChat: (val: boolean) => void;
  switchScenario: (id: string) => void;
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
}

const CoachContext = createContext<CoachContextType | null>(null);

export function useCoach() {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error('useCoach must be used within CoachProvider');
  return ctx;
}

const defaultScenario = SCENARIOS.find(s => s.id === 'returning-member')!;

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([...defaultScenario.messages]);
  const [memories, setMemories] = useState<Memory[]>([...defaultScenario.memories]);
  const [goals, setGoals] = useState<Goal[]>([...defaultScenario.goals]);
  const [isTyping, setIsTyping] = useState(false);
  const [temporaryChat, setTemporaryChat] = useState(false);
  const [activePanel, setActivePanelState] = useState<PanelType>('scenarios');
  const [activeScenario, setActiveScenario] = useState('returning-member');
  const [showOnboarding, setShowOnboarding] = useState(true);

  const memoriesRef = useRef(memories);
  memoriesRef.current = memories;
  const goalsRef = useRef(goals);
  goalsRef.current = goals;
  const tempChatRef = useRef(temporaryChat);
  tempChatRef.current = temporaryChat;
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionVersionRef = useRef(0);

  const setActivePanel = useCallback((panel: PanelType) => {
    setActivePanelState(prev => prev === panel ? 'none' : panel);
  }, []);

  const switchScenario = useCallback((id: string) => {
    const scenario = SCENARIOS.find(s => s.id === id);
    if (!scenario) return;
    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
    sessionVersionRef.current += 1;
    setMessages([...scenario.messages]);
    setMemories([...scenario.memories]);
    setGoals([...scenario.goals]);
    setIsTyping(false);
    setTemporaryChat(false);
    setActivePanelState('none');
    setActiveScenario(id);
    setShowOnboarding(id === 'cold-start');
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

  const sendMessage = useCallback((text: string) => {
    const userMsg: Message = {
      id: uid(), role: 'user', content: text, timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const currentMemories = memoriesRef.current;
    const currentGoals = goalsRef.current;
    const isTempChat = tempChatRef.current;
    const version = sessionVersionRef.current;

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

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  }, [addGoalFromProposal, updateGoalSettings]);

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

  const clearConversation = useCallback(() => {
    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
    sessionVersionRef.current += 1;
    setMessages([]);
    setIsTyping(false);
    setShowOnboarding(true);
  }, []);

  return (
    <CoachContext.Provider value={{
      messages, memories, goals, isTyping, temporaryChat, activePanel, activeScenario, showOnboarding,
      sendMessage, setActivePanel, setTemporaryChat, switchScenario,
      confirmMemory, dismissMemoryProposal, confirmGoal, dismissGoalProposal,
      acceptInsightToAction, saveInsightMemoryOnly, dismissInsightToAction,
      addMemory, editMemory, pauseMemory, deleteMemory, clearConversation,
    }}>
      {children}
    </CoachContext.Provider>
  );
}
