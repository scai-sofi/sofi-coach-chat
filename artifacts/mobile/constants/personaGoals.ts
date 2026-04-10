import { Goal, Milestone } from './types';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86400000);

function makeMilestones(reached: number[], daysAgoArr: number[]): Milestone[] {
  return [25, 50, 75, 100].map((pct, i) => ({
    id: uid(),
    label: `${pct}%`,
    targetPct: pct,
    reached: reached.includes(pct),
    reachedAt: reached.includes(pct) ? daysAgo(daysAgoArr[i] ?? 0) : undefined,
  }));
}

// ─── Maya Chen ─────────────────────────────────────────────────────────────────
// 25 · New member · $9,580/mo income · $4,200 CC at 22.99% APR
// Just finished onboarding. CC payoff is her first confirmed goal.
// Coach also suggested a travel savings goal she hasn't acted on yet.
//
// Tab coverage: pay-off (active) · save-up (DRAFT suggested)
// Status coverage: ON_TRACK · DRAFT
// ───────────────────────────────────────────────────────────────────────────────
export const MAYA_GOALS: Goal[] = [
  {
    id: 'goal-maya-cc',
    type: 'DEBT_PAYOFF',
    title: 'Credit Card',
    targetAmount: 4200,
    currentAmount: 0,
    targetDate: daysFromNow(300),
    monthlyContributionTarget: 420,
    actualMonthlyContribution: 0,
    status: 'ON_TRACK',
    confidenceScore: 0.85,
    milestones: makeMilestones([], []),
    linkedAccount: 'SoFi Credit Card',
    createdAt: daysAgo(2),
  },
  {
    // Suggested by Coach based on Maya mentioning Europe travel — she hasn't set it up yet
    id: 'goal-maya-travel',
    type: 'SAVINGS_TARGET',
    title: 'Europe Trip 2027',
    targetAmount: 2800,
    currentAmount: 180,
    targetDate: daysFromNow(420),
    monthlyContributionTarget: 200,
    actualMonthlyContribution: 0,
    status: 'DRAFT',
    confidenceScore: 0.70,
    milestones: makeMilestones([], []),
    linkedAccount: 'SoFi Savings',
    createdAt: daysAgo(2),
  },
];

// ─── Marcus Johnson ────────────────────────────────────────────────────────────
// 32 · Active member · $12,083/mo income (just got raise from $115k→$145k)
// His memories include "Saving for a wedding in October 2027."
// CC balance of $2,940 = $4,200 original debt − $1,260 paid so far.
// EF is on track; CC payoff is falling behind (AT_RISK); wedding fund growing.
//
// Tab coverage: save-up (EMERGENCY_FUND + SAVINGS_TARGET) · pay-off (AT_RISK)
// Status coverage: ON_TRACK · AT_RISK
// ───────────────────────────────────────────────────────────────────────────────
export const MARCUS_GOALS: Goal[] = [
  {
    id: 'goal-marcus-ef',
    type: 'EMERGENCY_FUND',
    title: 'Emergency Fund',
    targetAmount: 12000,
    currentAmount: 8400,   // 70% — two weeks ahead of schedule
    targetDate: daysFromNow(120),
    monthlyContributionTarget: 450,
    actualMonthlyContribution: 460,
    status: 'ON_TRACK',
    confidenceScore: 0.82,
    milestones: makeMilestones([25, 50], [60, 20, 0, 0]),
    linkedAccount: 'SoFi Savings',
    createdAt: daysAgo(90),
  },
  {
    id: 'goal-marcus-cc',
    type: 'DEBT_PAYOFF',
    title: 'Credit Card',
    targetAmount: 4200,
    currentAmount: 1260,   // paid $1,260 so far; $2,940 remaining (matches profile CC balance)
    targetDate: daysFromNow(120),
    monthlyContributionTarget: 420,
    actualMonthlyContribution: 380,  // paying $40/mo less than target
    status: 'AT_RISK',
    confidenceScore: 0.58,
    milestones: makeMilestones([25], [45, 0, 0, 0]),
    linkedAccount: 'SoFi Credit Card',
    createdAt: daysAgo(75),
  },
  {
    // Reflects the "saving for a wedding" memory from SHARED_MEMORIES
    id: 'goal-marcus-wedding',
    type: 'SAVINGS_TARGET',
    title: 'Wedding Fund',
    targetAmount: 25000,
    currentAmount: 8200,   // 32.8% — steady contributions since engagement
    targetDate: new Date('2027-10-01'),
    monthlyContributionTarget: 800,
    actualMonthlyContribution: 800,
    status: 'ON_TRACK',
    confidenceScore: 0.88,
    milestones: makeMilestones([25], [15, 0, 0, 0]),
    linkedAccount: 'SoFi Savings',
    createdAt: daysAgo(120),
  },
];

// ─── Jordan Rivera ─────────────────────────────────────────────────────────────
// 28 · Debt-focused · $7,400/mo income · $8,400 CC at high APR
// Net worth −$2,780. Spending slightly over budget ($3,850/mo).
// Just made first CC payment. Emergency fund is paused (CC is priority).
// Has a move-in fund in mind but hasn't started it — shown as a custom DRAFT.
//
// Tab coverage: pay-off (active) · save-up (PAUSED + DRAFT)
// Status coverage: ON_TRACK · PAUSED · DRAFT
// ───────────────────────────────────────────────────────────────────────────────
export const JORDAN_GOALS: Goal[] = [
  {
    id: 'goal-jordan-cc',
    type: 'DEBT_PAYOFF',
    title: 'Credit Card',
    targetAmount: 8400,
    currentAmount: 350,    // $350 paid so far; $8,050 remaining balance
    targetDate: daysFromNow(700),
    monthlyContributionTarget: 350,
    actualMonthlyContribution: 350,
    status: 'ON_TRACK',
    confidenceScore: 0.72,
    milestones: makeMilestones([], []),
    linkedAccount: 'SoFi Credit Card',
    createdAt: daysAgo(14),
  },
  {
    // Jordan put this on hold to focus all spare cash on the CC
    id: 'goal-jordan-ef',
    type: 'EMERGENCY_FUND',
    title: 'Emergency Fund',
    targetAmount: 1000,
    currentAmount: 0,
    targetDate: daysFromNow(360),
    monthlyContributionTarget: 100,
    actualMonthlyContribution: 0,
    status: 'PAUSED',
    confidenceScore: 0.55,
    milestones: makeMilestones([], []),
    linkedAccount: 'SoFi Savings',
    createdAt: daysAgo(14),
  },
  {
    // Coach suggested this after Jordan mentioned wanting to move out of her shared apartment
    id: 'goal-jordan-movein',
    type: 'CUSTOM',
    title: 'Move-In Fund',
    targetAmount: 4000,   // first month + security deposit in her city
    currentAmount: 0,
    targetDate: daysFromNow(540),
    monthlyContributionTarget: 150,
    actualMonthlyContribution: 0,
    status: 'DRAFT',
    confidenceScore: 0.60,
    milestones: makeMilestones([], []),
    linkedAccount: 'SoFi Savings',
    createdAt: daysAgo(0),
  },
];

// ─── David Kim ─────────────────────────────────────────────────────────────────
// 37 · Sophisticated multi-product user · $11,250/mo income
// Net worth $278,220 · $145,120 invested · no CC debt · spending under budget.
// Three active goals spanning all three dashboard tabs.
// Also has a completed SAVINGS_TARGET from last year — demonstrates the
// completed-goal state in the save-up tab.
//
// Tab coverage: save-up (ON_TRACK + COMPLETED) · investment (two ON_TRACK goals)
// Status coverage: ON_TRACK · COMPLETED
// ───────────────────────────────────────────────────────────────────────────────
export const DAVID_GOALS: Goal[] = [
  {
    id: 'goal-david-ef',
    type: 'EMERGENCY_FUND',
    title: 'Emergency Fund',
    targetAmount: 30000,   // ~8 months of his $3,600/mo spend
    currentAmount: 27000,  // 90% — three months from finishing
    targetDate: daysFromNow(90),
    monthlyContributionTarget: 1000,
    actualMonthlyContribution: 1000,
    status: 'ON_TRACK',
    confidenceScore: 0.95,
    milestones: makeMilestones([25, 50, 75], [270, 180, 45, 0]),
    linkedAccount: 'SoFi Savings',
    createdAt: daysAgo(365),
  },
  {
    // Completed last year — shows the COMPLETED state in the save-up tab
    id: 'goal-david-kitchen',
    type: 'SAVINGS_TARGET',
    title: 'Kitchen Remodel',
    targetAmount: 12000,
    currentAmount: 12000,  // 100% — goal achieved
    targetDate: daysAgo(30),
    monthlyContributionTarget: 1000,
    actualMonthlyContribution: 1000,
    status: 'COMPLETED',
    confidenceScore: 1.0,
    milestones: makeMilestones([25, 50, 75, 100], [360, 270, 180, 30]),
    linkedAccount: 'SoFi Savings',
    createdAt: daysAgo(390),
  },
  {
    id: 'goal-david-ira',
    type: 'INVESTMENT',
    title: 'Roth IRA — Max 2026',
    targetAmount: 7000,    // 2026 IRS contribution limit
    currentAmount: 5250,   // 75% — Jan–Sep contributions already in
    targetDate: daysFromNow(270),  // Dec 31
    monthlyContributionTarget: 583,
    actualMonthlyContribution: 625,  // slightly ahead
    status: 'ON_TRACK',
    confidenceScore: 0.91,
    milestones: makeMilestones([25, 50, 75], [270, 180, 30, 0]),
    linkedAccount: 'SoFi Invest (IRA)',
    createdAt: daysAgo(270),
  },
  {
    id: 'goal-david-brokerage',
    type: 'INVESTMENT',
    title: 'Annual Brokerage Contributions',
    targetAmount: 36000,   // $3,000/mo × 12 months
    currentAmount: 10800,  // 30% — ~3.6 months of contributions so far
    targetDate: daysFromNow(270),
    monthlyContributionTarget: 3000,
    actualMonthlyContribution: 3000,
    status: 'ON_TRACK',
    confidenceScore: 0.88,
    milestones: makeMilestones([25], [30, 0, 0, 0]),
    linkedAccount: 'SoFi Invest',
    createdAt: daysAgo(270),
  },
];

export const PERSONA_GOALS: Record<string, Goal[]> = {
  'persona-maya': MAYA_GOALS,
  'persona-marcus': MARCUS_GOALS,
  'persona-jordan': JORDAN_GOALS,
  'persona-david': DAVID_GOALS,
};
