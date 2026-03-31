export type MemoryCategory = 'ABOUT_ME' | 'PREFERENCES' | 'PRIORITIES';
export type MemorySource = 'EXPLICIT' | 'IMPLICIT_CONFIRMED' | 'MEMBER_360';
export type MemoryStatus = 'ACTIVE' | 'PAUSED' | 'DELETED';
export type GoalType = 'EMERGENCY_FUND' | 'DEBT_PAYOFF' | 'SAVINGS_TARGET' | 'CUSTOM';
export type GoalStatus = 'DRAFT' | 'ACTIVE' | 'ON_TRACK' | 'AT_RISK' | 'PAUSED' | 'COMPLETED';
export type ChipType = 'memory-saved' | 'goal-progress' | 'goal-risk' | 'memory-updated' | 'memory-deleted' | 'milestone' | 'alert' | 'handoff' | 'conflict-resolved' | 'goal-created';
export type MemoryMode = 'full' | 'ask-first' | 'off';
export type PanelType = 'none' | 'memory' | 'goals' | 'scenarios' | 'history' | 'settings';

export interface MessageChip {
  type: ChipType;
  label: string;
  memoryIds?: string[];
}

export interface MemoryProposal {
  id: string;
  content: string;
  category: MemoryCategory;
  confirmed?: boolean;
  confirmedMemoryId?: string;
  dismissed?: boolean;
}

export interface GoalProposal {
  id: string;
  type: GoalType;
  title: string;
  targetAmount: number;
  targetDate: Date;
  monthlyContribution: number;
  linkedAccount: string;
  confirmed?: boolean;
  dismissed?: boolean;
}

export interface AutoSaveMemory {
  content: string;
  category: MemoryCategory;
}

export interface AutoCreateGoal {
  type: GoalType;
  title: string;
  targetAmount: number;
  targetDate: Date;
  monthlyContribution: number;
  linkedAccount: string;
}

export interface AutoUpdateGoal {
  goalTitle: string;
  monthlyContribution?: number;
  targetDate?: Date;
  status?: GoalStatus;
  confidenceScore?: number;
  currentAmount?: number;
}

export interface MemoryDeletion {
  memoryId: string;
  memoryContent: string;
  confirmed?: boolean;
  dismissed?: boolean;
}

export interface Member360Conflict {
  id: string;
  field: string;
  userValue: string;
  profileValue: string;
  resolved?: 'user' | 'profile' | 'dismissed';
  resolvedMemoryId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  chips?: MessageChip[];
  memoryProposal?: MemoryProposal;
  goalProposal?: GoalProposal;
  member360Conflict?: Member360Conflict;
  memoryDeletion?: MemoryDeletion;
  autoSaveMemory?: AutoSaveMemory;
  autoCreateGoal?: AutoCreateGoal;
  autoUpdateGoal?: AutoUpdateGoal;
  suggestions?: string[];
  provenance?: string;
  isProactive?: boolean;
  isStreaming?: boolean;
  isTypingIndicator?: boolean;
}

export interface Memory {
  id: string;
  category: MemoryCategory;
  content: string;
  source: MemorySource;
  status: MemoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  label: string;
  targetPct: number;
  reached: boolean;
  reachedAt?: Date;
}

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  monthlyContributionTarget: number;
  actualMonthlyContribution: number;
  status: GoalStatus;
  confidenceScore: number;
  milestones: Milestone[];
  linkedAccount: string;
  createdAt: Date;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  messages: Message[];
  memories: Memory[];
  goals: Goal[];
  notReady?: boolean;
}

export const MEMORY_CATEGORY_LABELS: Record<MemoryCategory, string> = {
  ABOUT_ME: 'About me',
  PREFERENCES: 'Preferences',
  PRIORITIES: 'Priorities',
};

export const MEMORY_CATEGORY_ORDER: MemoryCategory[] = [
  'ABOUT_ME',
  'PREFERENCES',
  'PRIORITIES',
];

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  EMERGENCY_FUND: 'Save Up',
  DEBT_PAYOFF: 'Pay Down',
  SAVINGS_TARGET: 'Save Up',
  CUSTOM: 'Custom',
};
