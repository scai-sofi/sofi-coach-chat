import { Memory, Goal, Scenario, Milestone } from './types';

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

export const SHARED_MEMORIES: Memory[] = [
  { id: 'mem-1', category: 'PREFERENCES', content: 'Prefers detailed breakdowns with numbers', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(14), updatedAt: daysAgo(14) },
  { id: 'mem-2', category: 'PRIORITIES', content: 'Dining out is a focus area for spending reduction', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 'mem-3', category: 'ABOUT_ME', content: 'Household of 2, living in San Francisco Bay Area', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(21), updatedAt: daysAgo(21) },
  { id: 'mem-4', category: 'PRIORITIES', content: 'Saving for a wedding in October 2027', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 'mem-5', category: 'PREFERENCES', content: 'Prefers weekly check-ins over daily notifications', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(5), updatedAt: daysAgo(5) },
];

export const EMERGENCY_FUND_GOAL: Goal = {
  id: 'goal-ef',
  type: 'EMERGENCY_FUND',
  title: 'Emergency Fund',
  targetAmount: 12000,
  currentAmount: 8400,
  targetDate: daysFromNow(240),
  monthlyContributionTarget: 450,
  actualMonthlyContribution: 460,
  status: 'ON_TRACK',
  confidenceScore: 0.82,
  milestones: makeMilestones([25, 50], [60, 20, 0, 0]),
  linkedAccount: 'SoFi Savings',
  createdAt: daysAgo(90),
};

export const CREDIT_CARD_GOAL: Goal = {
  id: 'goal-cc',
  type: 'DEBT_PAYOFF',
  title: 'Credit Card Payoff',
  targetAmount: 4200,
  currentAmount: 2940,
  targetDate: daysFromNow(120),
  monthlyContributionTarget: 420,
  actualMonthlyContribution: 380,
  status: 'AT_RISK',
  confidenceScore: 0.58,
  milestones: makeMilestones([25, 50], [45, 12, 0, 0]),
  linkedAccount: 'SoFi Credit Card',
  createdAt: daysAgo(75),
};

function buildScenarios(): Scenario[] {
  const now = new Date();
  return [
    {
      id: 'cold-start',
      title: 'Cold Start Onboarding',
      subtitle: "New member's first session — auto-save, memory proposal, and goal discovery",
      icon: 'sparkles',
      messages: [
        {
          id: uid(), role: 'ai', content: "**Welcome to SoFi Coach**\n\nHey — I'm Coach, your personal financial coach. I can analyze your spending, set goals, and connect you with human experts when needed.\n\nAs we talk, I'll learn your preferences and financial context. You're always in control — everything I remember can be viewed, edited, or deleted in the Memory Center.\n\nWhat would you like to explore first?",
          timestamp: new Date(now.getTime() - 300000),
          suggestions: ['What\'s my financial snapshot?', 'Help me set a goal', 'Show my spending breakdown'],
        },
        { id: uid(), role: 'user', content: "What's my financial snapshot?", timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "**Your Financial Snapshot**\n\nHere's a high-level view based on your SoFi accounts:\n\n**Accounts Overview**\n• **Checking:** $3,847.52 — covers ~3 weeks of essentials\n• **Savings:** $2,100.00 at 4.00% APY\n• **Credit Card:** $4,200 balance at 22.99% APR\n• **Invest:** No active positions yet\n\n**Key Numbers**\n• **Monthly income:** ~$9,580 (after tax)\n• **Monthly spending:** ~$4,680\n• **Savings rate:** ~18%\n• **Net worth:** ~$1,748\n\n**Quick Take**\nYou have a healthy income-to-spending ratio. The main opportunity is that credit card — at 22.99% APR it's costing you roughly $80/month in interest alone. Addressing that would free up real cash flow.",
          timestamp: new Date(now.getTime() - 230000),
          autoSaveMemory: { content: 'Has $4,200 credit card balance at 22.99% APR', category: 'ABOUT_ME' },
          chips: [{ type: 'memory-saved', label: 'Saved to memory', memoryIds: ['mem-cs-1'] }],
          suggestions: ['Help me pay off the credit card', 'How can I save more?', 'Tell me about investing'],
        },
        { id: uid(), role: 'user', content: 'I want to pay off the credit card first, then start investing', timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "**Smart prioritization — debt first, then invest.**\n\nThat's a solid approach. Clearing the credit card at 22.99% APR is effectively a guaranteed 23% return on every dollar you put toward it. No investment can promise that.\n\n**Your Payoff Plan — Balanced (10 months)**\n• **Monthly payment:** $420\n• **Total interest paid:** ~$380\n• **Paid off by:** " + new Date(Date.now() + 300 * 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + "\n• **Monthly cash freed after payoff:** $420 → straight into investing\n\n**After the Card Is Gone**\nWith $420/month freed up plus your existing savings capacity, you could be investing $600+/month — that compounds fast. I can help you set up an automated investment plan when you're ready.\n\nWant me to set this up as a goal so we can track progress together?",
          timestamp: new Date(now.getTime() - 170000),
          memoryProposal: { id: uid(), content: 'Wants to pay off credit card before starting investments', category: 'PRIORITIES' },
          goalProposal: {
            id: uid(),
            type: 'DEBT_PAYOFF',
            title: 'Credit Card Payoff',
            targetAmount: 4200,
            targetDate: daysFromNow(300),
            monthlyContribution: 420,
            linkedAccount: 'SoFi Credit Card',
          },
          suggestions: ['Set up the goal', 'Show me an aggressive plan', 'What about minimum payments?'],
        },
      ],
      memories: [
        { id: 'mem-cs-1', category: 'ABOUT_ME', content: 'Has $4,200 credit card balance at 22.99% APR', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
      ],
      goals: [],
    },
    {
      id: 'returning-member',
      title: 'Returning Member (Session 4+)',
      subtitle: 'Personalized insights, memory proposals, profile conflicts, and goal tracking',
      icon: 'user-check',
      messages: [
        {
          id: uid(), role: 'system', content: 'Your weekly financial summary is ready', timestamp: new Date(now.getTime() - 300000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "**Your Week in Review**\n\nHere's your detailed view — since I know you like the numbers:\n\n**Spending This Week: $892** (↓8% from last week)\n• **Groceries:** $165 — on budget, consistent with your meal-planning\n• **Dining:** $95 — best week this month, cooking-at-home shift is working\n• **Transportation:** $52 — stable\n• **Shopping:** $580 — one-time monitor purchase (your baseline was $312)\n\n**Goals Update**\n• **Emergency Fund:** $8,400 of $12,000 (70%) — on track, 2 weeks ahead\n• **Credit Card:** $2,940 of $4,200 (70%) — needs attention, last payment $40 below target\n\n**Something Worth Looking At**\nI spotted a $14.99/month streaming subscription you haven't used in 6 weeks. Canceling would free up $180/year — nearly half a month's emergency fund contribution.",
          timestamp: new Date(now.getTime() - 290000),
          chips: [
            { type: 'goal-progress', label: 'Emergency Fund on track' },
            { type: 'goal-risk', label: 'Credit Card needs attention' },
          ],
          suggestions: ['Cancel that subscription', 'Tell me about the credit card', 'Show my goals dashboard'],
        },
        { id: uid(), role: 'user', content: "Good to know. By the way, I got a raise — I'm making $145k now", timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "**Congrats on the raise!**\n\nThat's a meaningful jump — here's what it changes:\n\n**Updated Picture**\n• **New gross monthly:** ~$12,083 (was ~$9,583)\n• **After taxes (est.):** ~$8,750/month\n• **Current spending:** ~$4,680/month\n• **New savings capacity:** ~$4,070/month (up from ~$2,820)\n\n**What This Unlocks**\nWith $1,250 more per month, you could:\n• **Accelerate credit card payoff** — clear it 3 months sooner\n• **Max out emergency fund** — hit $12k by next quarter\n• **Start investing** — even $500/month compounds significantly over time\n\nThe key is capturing this raise before lifestyle creep sets in. Want me to model an allocation plan for the extra income?",
          timestamp: new Date(now.getTime() - 170000),
          autoSaveMemory: { content: 'Annual income increased to $145,000', category: 'ABOUT_ME' },
          chips: [{ type: 'memory-saved', label: 'Saved to memory', memoryIds: ['mem-rm-1'] }],
          member360Conflict: {
            id: uid(),
            field: 'Annual income',
            userValue: 'Income is $145,000/year',
            profileValue: 'Annual income: $115,000/year',
          },
          suggestions: ['Model the allocation', 'Accelerate debt payoff', 'Start an investment plan'],
        },
      ],
      memories: [
        ...SHARED_MEMORIES,
        { id: 'mem-rm-1', category: 'ABOUT_ME', content: 'Annual income is $145,000', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
      ],
      goals: [{ ...EMERGENCY_FUND_GOAL }, { ...CREDIT_CARD_GOAL }],
    },
    {
      id: 'memory-lifecycle',
      title: 'Memory System',
      subtitle: 'Auto-save, proposals, corrections, and deletion',
      icon: 'brain',
      messages: [
        { id: uid(), role: 'user', content: "I have a 401k at Vanguard with about $45,000 in it", timestamp: new Date(now.getTime() - 420000) },
        {
          id: uid(), role: 'ai', content: "**Nice — that's a solid foundation.**\n\nA $45,000 401k balance at your stage is great progress. That puts you ahead of the national median for your age group.\n\n**Quick Context**\n• **Current balance:** $45,000\n• **Provider:** Vanguard\n• **Typical growth at 7%:** Could become ~$200k in 20 years without adding another dollar\n• **With $500/month contributions:** Could reach ~$450k in 20 years\n\nAre you currently contributing, and do you know if your employer offers a match?",
          timestamp: new Date(now.getTime() - 410000),
          chips: [{ type: 'memory-saved', label: 'Saved to memory', memoryIds: ['mem-mi-1'] }],
          suggestions: ["Yes, I get a 4% match", "I'm not sure about my match", "How much should I contribute?"],
        },
        { id: uid(), role: 'user', content: "I'd rather focus on paying off debt before investing more", timestamp: new Date(now.getTime() - 360000) },
        {
          id: uid(), role: 'ai', content: "**That's a thoughtful approach.**\n\nPrioritizing debt payoff before ramping up investments is a valid strategy — especially if you're carrying high-interest debt like credit cards.\n\n**The General Framework**\n\n• **Step 1:** Get the employer match (it's free money)\n• **Step 2:** Pay off high-interest debt (anything over ~7% APR)\n• **Step 3:** Build emergency fund to 3 months\n• **Step 4:** Max out retirement contributions\n\n**Where You Stand**\nWith $45k already in your 401k and an emergency fund in progress, you're in a great position. Clearing debt first means your future investment dollars work harder — they're not fighting against interest payments.\n\nOnce the debt is gone, you'll have significant monthly cash flow to redirect into investing.",
          timestamp: new Date(now.getTime() - 350000),
          memoryProposal: { id: uid(), content: 'Prioritizes debt payoff before increasing investments', category: 'PREFERENCES' },
          suggestions: ["Show me my debt overview", "What's a good payoff strategy?", "How much am I spending on interest?"],
        },
        { id: uid(), role: 'user', content: "Actually, that dining thing is outdated — I've been cooking more lately", timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "**Memory Updated**\n\nI've adjusted that memory to reflect your shift toward cooking at home.\n\n**What Changed**\n• **Before:** \"Dining out is a focus area for spending reduction\"\n• **After:** Updated to reflect your active cooking-at-home habit\n\n**Why This Matters**\nThis shift is already showing results — your dining spend is down 21% over the last 3 months, which translates to roughly $1,500/year in savings. That's real money flowing toward your emergency fund.",
          timestamp: new Date(now.getTime() - 230000),
          chips: [{ type: 'memory-updated', label: 'Memory updated', memoryIds: ['mem-2'] }],
        },
        { id: uid(), role: 'user', content: "Actually, I don't want you to remember about my 401k — I'd rather manage that privately", timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "Completely understood — your privacy comes first. I found the memory you're referring to:\n\n> \"Has 401k at Vanguard with $45,000 balance\"\n\nWould you like me to delete it? Once removed, I won't reference your 401k details in future conversations.",
          timestamp: new Date(now.getTime() - 170000),
          memoryDeletion: { memoryId: 'mem-mi-1', memoryContent: 'Has 401k at Vanguard with $45,000 balance' },
          suggestions: ["What else do you remember?", "Show me my spending", "How are my goals doing?"],
        },
      ],
      memories: [
        ...SHARED_MEMORIES,
        { id: 'mem-mi-1', category: 'ABOUT_ME', content: 'Has 401k at Vanguard with $45,000 balance', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
        { id: 'mem-manual-1', category: 'PRIORITIES', content: 'Saving for a home down payment by 2028', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(3), updatedAt: daysAgo(3) },
      ],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
  ];
}

export const SCENARIOS = buildScenarios();

export const SCENARIO_ORDER = [
  'cold-start', 'returning-member', 'memory-lifecycle',
];
