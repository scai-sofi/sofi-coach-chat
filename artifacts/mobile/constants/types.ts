export type MemoryCategory = 'PREFERENCE' | 'CONSTRAINT' | 'LIFE_CONTEXT' | 'FINANCIAL_ATTITUDE' | 'GOAL_RELATED' | 'EXPLICIT_FACT';
export type MemorySource = 'EXPLICIT' | 'IMPLICIT_CONFIRMED';
export type MemoryStatus = 'ACTIVE' | 'PAUSED' | 'DELETED';
export type GoalType = 'EMERGENCY_FUND' | 'DEBT_PAYOFF' | 'SAVINGS_TARGET' | 'CUSTOM';
export type GoalStatus = 'DRAFT' | 'ACTIVE' | 'ON_TRACK' | 'AT_RISK' | 'PAUSED' | 'COMPLETED';
export type SafetyTier = 'informational' | 'suggestive' | 'actionable' | 'handoff';
export type ChipType = 'memory-saved' | 'goal-progress' | 'goal-risk' | 'memory-updated' | 'milestone' | 'alert' | 'handoff';
export type PanelType = 'none' | 'memory' | 'goals' | 'scenarios' | 'history';

export interface MessageChip {
  type: ChipType;
  label: string;
}

export interface MemoryProposal {
  id: string;
  content: string;
  category: MemoryCategory;
  confirmed?: boolean;
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

export interface InsightToAction {
  id: string;
  memory: { content: string; category: MemoryCategory; saved: boolean };
  goalProposal: GoalProposal;
  dismissed: boolean;
  accepted?: boolean;
  memoryOnly?: boolean;
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

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  chips?: MessageChip[];
  memoryProposal?: MemoryProposal;
  goalProposal?: GoalProposal;
  insightToAction?: InsightToAction;
  autoSaveMemory?: AutoSaveMemory;
  autoCreateGoal?: AutoCreateGoal;
  autoUpdateGoal?: AutoUpdateGoal;
  suggestions?: string[];
  provenance?: string;
  safetyTier?: SafetyTier;
  safetyMessage?: string;
  isProactive?: boolean;
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
}

export const MEMORY_CATEGORY_LABELS: Record<MemoryCategory, string> = {
  PREFERENCE: 'Preferences',
  FINANCIAL_ATTITUDE: 'Attitudes',
  GOAL_RELATED: 'Goals',
  LIFE_CONTEXT: 'Life Context',
  CONSTRAINT: 'Constraints',
  EXPLICIT_FACT: 'Facts',
};

export const MEMORY_CATEGORY_ORDER: MemoryCategory[] = [
  'PREFERENCE',
  'FINANCIAL_ATTITUDE',
  'GOAL_RELATED',
  'LIFE_CONTEXT',
  'CONSTRAINT',
  'EXPLICIT_FACT',
];

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  EMERGENCY_FUND: 'Save Up',
  DEBT_PAYOFF: 'Pay Down',
  SAVINGS_TARGET: 'Save Up',
  CUSTOM: 'Custom',
};
