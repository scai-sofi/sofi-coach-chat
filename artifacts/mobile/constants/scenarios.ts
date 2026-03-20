import { Memory, Goal, Message, Scenario, Milestone } from './types';

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
  { id: 'mem-1', category: 'PREFERENCE', content: 'Prefers detailed breakdowns with numbers', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(14), updatedAt: daysAgo(14) },
  { id: 'mem-2', category: 'FINANCIAL_ATTITUDE', content: 'Dining out is a focus area for spending reduction', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 'mem-3', category: 'LIFE_CONTEXT', content: 'Household of 2, living in San Francisco Bay Area', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(21), updatedAt: daysAgo(21) },
  { id: 'mem-4', category: 'CONSTRAINT', content: 'Saving for a wedding in October 2027', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 'mem-5', category: 'PREFERENCE', content: 'Prefers weekly check-ins over daily notifications', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(5), updatedAt: daysAgo(5) },
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
      subtitle: "New member's first session — coach introduces itself and seeds initial preferences",
      icon: 'sparkles',
      messages: [
        {
          id: uid(), role: 'ai', content: "Hey there — welcome to SoFi! I'm Coach, your AI financial advisor. I'm here to help you make sense of your money, set goals, and build habits that actually stick.\n\nAs we talk, I'll learn what matters to you so my advice gets more personal over time. You're always in control — you can see, edit, or delete anything I remember in the Memory Center.\n\nWhat would you like to explore first?",
          timestamp: new Date(now.getTime() - 60000),
          suggestions: ['What\'s my financial snapshot?', 'Help me set a goal', 'How does my memory work?', 'Show my spending breakdown'],
        },
      ],
      memories: [],
      goals: [],
    },
    {
      id: 'returning-member',
      title: 'Returning Member (Session 4+)',
      subtitle: 'Fully personalized — coach references memories and goals without prompting',
      icon: 'user-check',
      messages: [
        { id: uid(), role: 'user', content: 'What are my top spending categories this month?', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "**Your Monthly Spending Breakdown**\n\nHere's your detailed view — since I know you like the numbers:\n\n• **Housing:** $2,450 (52%) — rent and utilities, steady month over month\n• **Dining Out:** $485 (10%) — down 12% from last month, down 21% from 3-month average\n• **Groceries:** $380 (8%) — up 9%, which makes sense as you shift away from restaurants\n• **Transportation:** $220 (5%) — right in line with your 3-month average of $215\n• **Entertainment:** $145 (3%) — includes those concert tickets from last week\n• **Other:** $1,000 (22%) — subscriptions, personal care, miscellaneous\n\n**Month-Over-Month Trend**\n• **Total spent:** $4,680 (↓3% from last month)\n• **Biggest improvement:** Dining, down $66\n• **Area to watch:** Groceries trending up — but net savings from dining shift is still +$30/month\n\nOverall you're trending well — your total spend is declining while your savings rate holds at 24.5%. Want to dig into any category?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [
            { type: 'goal-progress', label: 'Emergency Fund 70%' },
            { type: 'goal-progress', label: 'Credit Card 70%' },
          ],
          suggestions: ['Tell me about my dining trend', 'Show my goals progress', 'How can I save more?'],
          provenance: 'Based on your SoFi Checking and Credit Card transaction data from this billing cycle. Spending categories are auto-classified and may need manual adjustment for some transactions.',
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
    {
      id: 'memory-lifecycle',
      title: 'Memory Lifecycle',
      subtitle: 'Explicit save, implicit proposal, correction flow',
      icon: 'brain',
      messages: [
        { id: uid(), role: 'user', content: 'I want you to remember that I\'m risk-averse with investments', timestamp: new Date(now.getTime() - 300000) },
        {
          id: uid(), role: 'ai', content: "Got it — saved! I've noted that you prefer a conservative approach to investing. Going forward, I'll focus on lower-risk strategies like index funds and bonds when we discuss your portfolio.\n\nThis is something you can always update in the Memory Center if your comfort level changes.",
          timestamp: new Date(now.getTime() - 290000),
          chips: [{ type: 'memory-saved', label: 'Saved to memory' }],
          autoSaveMemory: { content: 'Risk-averse with investments', category: 'FINANCIAL_ATTITUDE' },
        },
        { id: uid(), role: 'user', content: 'What do you know about me?', timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "Here's what I've learned so far:\n\n**Preferences**\n• Prefers detailed breakdowns with numbers\n• Prefers weekly check-ins over daily notifications\n\n**Financial Attitudes**\n• Dining out is a focus area for spending reduction\n• Risk-averse with investments\n\n**Life Context**\n• Household of 2, living in San Francisco Bay Area\n\n**Constraints**\n• Saving for a wedding in October 2027\n\nYou can edit or remove any of these anytime — just tap the brain icon in the menu to open the Memory Center.",
          timestamp: new Date(now.getTime() - 230000),
        },
        { id: uid(), role: 'user', content: 'Actually, that dining thing is outdated — I\'ve been cooking more lately', timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "Updated! I've adjusted that memory to reflect your shift toward cooking at home. That's a great move for both your budget and your emergency fund goal.\n\nSince you're making this a habit, would you like me to also remember that cooking at home is a priority for you? That way I can factor it into future spending advice.",
          timestamp: new Date(now.getTime() - 170000),
          chips: [{ type: 'memory-updated', label: 'Memory updated' }],
          memoryProposal: { id: uid(), content: 'Cooking at home is now a priority over dining out', category: 'PREFERENCE' },
        },
      ],
      memories: [
        ...SHARED_MEMORIES,
        { id: 'mem-6', category: 'FINANCIAL_ATTITUDE', content: 'Risk-averse with investments', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
      ],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
    {
      id: 'goal-discovery',
      title: 'Goal Discovery & Creation',
      subtitle: 'AI detects goal intent from natural conversation',
      icon: 'target',
      messages: [
        { id: uid(), role: 'user', content: 'I really need to pay off my credit card. The balance is about $4,200', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "Let's get a plan together for that. Here's what I'm seeing on your SoFi Credit Card:\n\n• **Balance:** $4,200\n• **Interest rate:** 22.99% APR\n• **Minimum payment:** $84/month\n\nAt minimum payments only, you'd be paying for 7+ years and spend over $3,100 in interest. Let's do better than that.\n\n**Option A — Aggressive (6 months)**\n$720/month → paid off by July, saves ~$2,800 in interest\n\n**Option B — Balanced (12 months)**\n$380/month → paid off by January, saves ~$2,400 in interest\n\nBoth are solid choices — it comes down to how much breathing room you want in your monthly budget. Which feels more doable?",
          timestamp: new Date(now.getTime() - 60000),
          goalProposal: {
            id: uid(), type: 'DEBT_PAYOFF', title: 'Credit Card Payoff',
            targetAmount: 4200, targetDate: daysFromNow(180),
            monthlyContribution: 380, linkedAccount: 'SoFi Credit Card',
          },
          safetyTier: 'actionable',
          safetyMessage: 'Actionable — needs your approval',
          suggestions: ['Set up Option A', 'Set up Option B', 'Help me prioritize my debts'],
        },
      ],
      memories: [...SHARED_MEMORIES.slice(0, 3)],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
    {
      id: 'proactive-risk',
      title: 'Proactive Risk Alert',
      subtitle: 'AI-initiated risk alerts when confidence drops',
      icon: 'alert-triangle',
      messages: [
        {
          id: uid(), role: 'system', content: 'Coach noticed a change in your goals', timestamp: new Date(now.getTime() - 120000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "**Credit Card Payoff — Risk Alert**\n\nI wanted to give you a heads-up — your confidence score dropped from 82% to 58% this week. Here's the full picture:\n\n**What Happened**\n• **Last 2 payments:** $380 each (target was $420, shortfall of $80 total)\n• **New charge:** $340 added to the balance\n• **Net impact:** $420 further from your goal than planned\n\n**Where This Puts You**\n• **Current balance:** $1,260 remaining\n• **Original payoff date:** 4 months from now\n• **Projected payoff at current pace:** ~5.5 months (6 weeks late)\n• **Extra interest cost if delayed:** ~$48\n\n**Your Options**\n\n• **Option A — Catch up this month:** Bump payment to $520 (+$140 over your usual). Gets you back to 78% confidence and on track for the original date.\n\n• **Option B — Extend timeline:** Add 2 months to your deadline. Monthly payment drops to $350, giving you $70/month more breathing room. Confidence resets to 72%.\n\nNo need to panic — both paths get you to debt-free. It comes down to whether you'd prefer a short push or a steadier pace.\n\nWhat feels right for your budget this month?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'goal-risk', label: 'Credit Card at risk' }],
          memoryProposal: { id: uid(), content: 'Credit card spending increased in recent months', category: 'FINANCIAL_ATTITUDE' },
          suggestions: ['Increase this month\'s payment', 'Extend my deadline', 'Show me the full picture'],
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{ ...EMERGENCY_FUND_GOAL }, { ...CREDIT_CARD_GOAL }],
    },
    {
      id: 'milestone-celebration',
      title: 'Milestone Celebration',
      subtitle: 'Goal completion flow with celebration',
      icon: 'party-popper',
      messages: [
        {
          id: uid(), role: 'system', content: 'Your Emergency Fund hit a milestone!', timestamp: new Date(now.getTime() - 120000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "You just hit **75% of your Emergency Fund goal!** That's $9,000 out of $12,000 — huge progress.\n\nHere's your journey so far:\n• **25%** reached 60 days ago\n• **50%** reached 20 days ago\n• **75%** reached today\n• **100%** on track for ~2 months from now\n\nYou've been contributing $460/month, which is actually $10 above your target. That consistency is the reason you're ahead of schedule.\n\nJust $3,000 to go. You've got this!",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'milestone', label: '75% milestone reached!' }],
          suggestions: ['Show my goals dashboard', 'What should I do when I reach 100%?', 'Can I increase my contribution?'],
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{
        ...EMERGENCY_FUND_GOAL,
        currentAmount: 9000,
        confidenceScore: 0.92,
        milestones: makeMilestones([25, 50, 75], [60, 20, 0, 0]),
      }],
    },
    {
      id: 'weekly-recap',
      title: 'Weekly Financial Recap',
      subtitle: 'Proactive weekly summary with recommendations',
      icon: 'calendar-check',
      messages: [
        {
          id: uid(), role: 'system', content: 'Your weekly financial summary is ready', timestamp: new Date(now.getTime() - 120000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "**Your Week in Review**\n\n**Spending Summary**\nYou spent **$892** this week — down 8% from last week ($970) and 5% below your 4-week average ($938).\n\n• **Groceries:** $165 — on budget, consistent with your meal-planning habit\n• **Dining:** $95 — your best week this month (avg was $121). The cooking-at-home shift is paying off\n• **Transportation:** $52 — stable, right at your weekly norm\n• **Shopping:** $580 — one-time monitor purchase (excluded, your baseline spend was $312)\n\n**Goals Update**\n• **Emergency Fund:** $8,400 of $12,000 (70%) — on track, 2 weeks ahead of schedule\n• **Credit Card:** $2,940 of $4,200 (70%) — needs attention, last payment was $40 below target\n\n**Something Worth Looking At**\nI spotted a $14.99/month streaming subscription you haven't used in 6 weeks. Canceling it would free up $180/year — that's nearly half a month's emergency fund contribution, just from one unused service.\n\n**This Week's Win**\nYour baseline spending (excluding the monitor) was $312 — well below your typical $380. That's $68 saved in a single week through small, consistent choices.\n\nWant me to dig into any of these?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [
            { type: 'goal-progress', label: 'Emergency Fund on track' },
            { type: 'goal-risk', label: 'Credit Card needs attention' },
          ],
          suggestions: ['Cancel that subscription', 'Show me all my subscriptions', 'Tell me more about the credit card'],
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{ ...EMERGENCY_FUND_GOAL }, { ...CREDIT_CARD_GOAL }],
    },
    {
      id: 'cross-product',
      title: 'Cross-Product Orchestration',
      subtitle: "Multi-product coordination — SoFi's unique advantage",
      icon: 'layers',
      messages: [
        { id: uid(), role: 'user', content: 'I just got a $3,000 bonus at work. What should I do with it?', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "**Your $3,000 Bonus — Optimized Allocation**\n\nCongrats! Here's how I'd split this based on your goals, interest rates, and financial picture:\n\n**1. Credit Card Payoff — $1,260**\n• **Impact:** Clears your entire remaining balance\n• **Why:** Eliminates 22.99% APR — every dollar here is a guaranteed 23% return. This is mathematically your best move.\n• **After:** $0 debt, freeing up $380/month from your payoff plan\n\n**2. Emergency Fund — $1,200**\n• **Impact:** Brings you from $8,400 → $9,600 (80% of goal)\n• **Why:** Jumps you 6 weeks ahead of schedule. At this pace, you'd hit $12,000 about 2 months early.\n• **Earning:** This $1,200 earns ~$48/year at 4.00% APY\n\n**3. SoFi Invest — $540**\n• **Impact:** Starts building your investment portfolio\n• **Why:** With debt eliminated and a strong emergency fund, this is the right time to start growing wealth long-term\n• **Suggested allocation:** Conservative portfolio (70% bonds, 30% index funds) — matches your risk preference\n\n**The Big Picture**\nThis single allocation eliminates your most expensive debt, fast-tracks your safety net, and starts your investment journey — all in one move. Plus, the $380/month freed from debt payments gives you ongoing firepower.\n\nWant me to set up all three transfers?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'handoff', label: 'Cross-product recommendation' }],
          memoryProposal: { id: uid(), content: 'Received $3,000 work bonus, interested in optimized allocation', category: 'FINANCIAL_ATTITUDE' },
          suggestions: ['Set up all three transfers', 'Adjust the split', 'Tell me more about the invest option'],
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{ ...EMERGENCY_FUND_GOAL }, { ...CREDIT_CARD_GOAL }],
    },
    {
      id: 'tiered-safety',
      title: 'Recommendation Safety Tiers',
      subtitle: 'Demonstrates all 4 safety tiers',
      icon: 'shield-check',
      messages: [
        { id: uid(), role: 'user', content: 'What\'s my checking balance?', timestamp: new Date(now.getTime() - 300000) },
        {
          id: uid(), role: 'ai', content: 'Your SoFi Checking balance is **$3,847.52** as of right now.\n\nYou have 2 pending transactions totaling $127.80 that should settle by tomorrow.',
          timestamp: new Date(now.getTime() - 290000),
          safetyTier: 'informational',
          safetyMessage: 'Informational',
        },
        { id: uid(), role: 'user', content: 'Any tips on reducing my dining spending?', timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "Based on your recent spending patterns, here are a few ideas:\n\n• **Meal prep on Sundays** — members who batch-cook save an average of $200/month on dining\n• **Set a $100 weekly dining cap** — you've been averaging about $120, so this is a realistic stretch goal\n• **Turn on SoFi Relay alerts** for dining to get real-time nudges when you're close to your limit\n\nSmall shifts add up fast — even cutting $20/week frees up over $1,000 a year for your emergency fund.",
          timestamp: new Date(now.getTime() - 230000),
          safetyTier: 'suggestive',
          safetyMessage: 'Suggestion',
        },
        { id: uid(), role: 'user', content: 'Can you move $500 from checking to savings?', timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "Here's what that transfer would look like:\n\n• **From:** SoFi Checking ($3,847.52)\n• **To:** SoFi Savings (Emergency Fund)\n• **Amount:** $500.00\n\nAfter the transfer, your Emergency Fund jumps to $8,900 (74% of goal) and checking stays at $3,347.52 — plenty of cushion for upcoming bills.\n\nWant me to confirm this transfer?",
          timestamp: new Date(now.getTime() - 170000),
          safetyTier: 'actionable',
          safetyMessage: 'Actionable — needs your approval',
          suggestions: ['Confirm transfer', 'Change amount', 'Cancel'],
        },
        { id: uid(), role: 'user', content: 'Should I rebalance my investment portfolio?', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "Portfolio rebalancing involves some nuance around tax implications, market timing, and how everything fits with your broader goals.\n\nGiven your risk-averse preference, I'd recommend connecting with a SoFi Certified Financial Planner — it's free for members. They can:\n\n• Review your full investment picture\n• Identify tax-loss harvesting opportunities\n• Build a rebalancing strategy that matches your comfort level\n\nI can share your relevant financial context (with your permission) so the planner has everything they need going in. Want me to set that up?",
          timestamp: new Date(now.getTime() - 60000),
          safetyTier: 'handoff',
          safetyMessage: 'Complex — human advisor recommended',
          chips: [{ type: 'handoff', label: 'Specialist recommended' }],
          suggestions: ['Connect me with a planner', 'Tell me more about the service', 'I\'ll handle it myself'],
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
    {
      id: 'free-chat',
      title: 'Free Chat',
      subtitle: 'Start a fresh conversation — type anything to explore',
      icon: 'message-circle',
      messages: [],
      memories: [SHARED_MEMORIES[0], SHARED_MEMORIES[1]],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
  ];
}

export const SCENARIOS = buildScenarios();

export const SCENARIO_ORDER = [
  'cold-start', 'returning-member', 'memory-lifecycle', 'goal-discovery',
  'proactive-risk', 'milestone-celebration', 'weekly-recap', 'cross-product',
  'tiered-safety', 'free-chat',
];
