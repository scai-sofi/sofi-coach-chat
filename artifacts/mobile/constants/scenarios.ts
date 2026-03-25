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
      subtitle: "New member's first session — coach introduces itself and seeds initial preferences",
      icon: 'sparkles',
      messages: [
        {
          id: uid(), role: 'ai', content: "**Welcome to SoFi Coach**\n\nHey there — I'm Coach, your AI financial advisor. I'm here to help you make sense of your money, set goals, and build habits that actually stick.\n\n**What I Can Do**\n• **Analyze your spending** with trends, categories, and actionable insights\n• **Set and track financial goals** with automatic progress monitoring\n• **Coordinate across SoFi products** — checking, savings, investing, and credit\n• **Connect you with human experts** for complex decisions (free for members)\n\n**How I Learn**\nAs we talk, I'll pick up on your preferences and financial context. I'll always ask before saving anything, and you can view, edit, or delete everything I remember in the Memory Center.\n\n**Privacy First**\nYou're always in control. You can view, edit, pause, or delete any memory anytime in the Memory Center.\n\nWhat would you like to explore first?",
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
          id: uid(), role: 'ai', content: "**Saved to Memory**\n\nGot it — I've saved: \"Risk-averse with investments\"\n\n**How I'll Use This**\nGoing forward, I'll focus on lower-risk strategies when we discuss your portfolio — things like index funds, bonds, and conservative allocations. I won't recommend high-volatility plays or aggressive growth strategies unless you tell me your comfort level has changed.\n\n**Your Control**\nYou can update this anytime in the Memory Center (brain icon in the menu). Risk tolerance often evolves over time, and I'll adjust right along with you.",
          timestamp: new Date(now.getTime() - 290000),
          chips: [{ type: 'memory-saved', label: 'Saved to memory' }],
          autoSaveMemory: { content: 'Risk-averse with investments', category: 'PREFERENCES' },
        },
        { id: uid(), role: 'user', content: 'What do you know about me?', timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "**What I Know About You**\n\nI currently have 6 active memories across 3 categories:\n\n**About me**\n• Household of 2, living in San Francisco Bay Area\n\n**Preferences**\n• Prefers detailed breakdowns with numbers\n• Prefers weekly check-ins over daily notifications\n• Risk-averse with investments\n\n**Priorities**\n• Dining out is a focus area for spending reduction\n• Saving for a wedding in October 2027\n\n**How I Use This**\nThese memories help me personalize my advice — from the level of detail I give you, to which goals I prioritize in recommendations, to how I frame financial decisions.\n\n**Your Control**\nYou can edit, pause, or remove any of these anytime — tap the brain icon in the menu to open the Memory Center. Everything stays transparent.",
          timestamp: new Date(now.getTime() - 230000),
        },
        { id: uid(), role: 'user', content: 'Actually, that dining thing is outdated — I\'ve been cooking more lately', timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "**Memory Updated**\n\nI've adjusted that memory to reflect your shift toward cooking at home.\n\n**What Changed**\n• **Before:** \"Dining out is a focus area for spending reduction\"\n• **After:** Updated to reflect your active cooking-at-home habit\n\n**Why This Matters**\nThis shift is already showing results — your dining spend is down 21% over the last 3 months, which translates to roughly $1,500/year in savings. That's real money flowing toward your emergency fund and credit card payoff.\n\nSince you're making this a consistent habit, would you like me to also remember that cooking at home is a priority? That way I can factor it into future spending advice and recipe-vs-restaurant decisions.",
          timestamp: new Date(now.getTime() - 170000),
          chips: [{ type: 'memory-updated', label: 'Memory updated' }],
          memoryProposal: { id: uid(), content: 'Cooking at home is now a priority over dining out', category: 'PRIORITIES' },
        },
      ],
      memories: [
        ...SHARED_MEMORIES,
        { id: 'mem-6', category: 'PREFERENCES', content: 'Risk-averse with investments', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
      ],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
    {
      id: 'memory-intelligence',
      title: 'Memory Intelligence',
      subtitle: 'Auto-save facts, propose preferences, and detect profile conflicts',
      icon: 'database',
      messages: [
        { id: uid(), role: 'user', content: "I have a 401k at Vanguard with about $45,000 in it", timestamp: new Date(now.getTime() - 360000) },
        {
          id: uid(), role: 'ai', content: "**Nice — that's a solid foundation.**\n\nA $45,000 401k balance at your stage is great progress. That puts you ahead of the national median for your age group.\n\n**Quick Context**\n• **Current balance:** $45,000\n• **Provider:** Vanguard\n• **Typical growth at 7%:** Could become ~$200k in 20 years without adding another dollar\n• **With $500/month contributions:** Could reach ~$450k in 20 years\n\nAre you currently contributing, and do you know if your employer offers a match?",
          timestamp: new Date(now.getTime() - 350000),
          chips: [{ type: 'memory-saved', label: 'Saved to memory' }],
          suggestions: ["Yes, I get a 4% match", "I'm not sure about my match", "How much should I contribute?"],
        },
        { id: uid(), role: 'user', content: "I'd rather focus on paying off debt before investing more", timestamp: new Date(now.getTime() - 300000) },
        {
          id: uid(), role: 'ai', content: "**That's a thoughtful approach.**\n\nPrioritizing debt payoff before ramping up investments is a valid strategy — especially if you're carrying high-interest debt like credit cards.\n\n**The General Framework**\n\n• **Step 1:** Get the employer match (it's free money)\n• **Step 2:** Pay off high-interest debt (anything over ~7% APR)\n• **Step 3:** Build emergency fund to 3 months\n• **Step 4:** Max out retirement contributions\n\n**Where You Stand**\nWith $45k already in your 401k and an emergency fund in progress, you're in a great position. Clearing debt first means your future investment dollars work harder — they're not fighting against interest payments.\n\nOnce the debt is gone, you'll have significant monthly cash flow to redirect into investing.",
          timestamp: new Date(now.getTime() - 290000),
          memoryProposal: { id: uid(), content: 'Prioritizes debt payoff before increasing investments', category: 'PREFERENCES' },
          suggestions: ["Show me my debt overview", "What's a good payoff strategy?", "How much am I spending on interest?"],
        },
        { id: uid(), role: 'user', content: "I make about $130,000 a year", timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "**Good to know — that gives me a clearer picture.**\n\nAt $130k/year, here's a quick financial health snapshot:\n\n**Income Breakdown (estimated)**\n• **Gross monthly:** ~$10,833\n• **After taxes (est.):** ~$7,800/month\n• **Current savings rate:** ~24% based on your spending patterns\n\n**How This Compares**\nA 24% savings rate at $130k is well above average. If you can maintain that while paying off debt, you'll be in excellent shape to ramp up investing once you're debt-free.\n\n**One Thing to Watch**\nAt this income level, you might be close to the Roth IRA income limit ($161k for single filers). Something to keep in mind as your income grows — I can help you plan around that when the time comes.",
          timestamp: new Date(now.getTime() - 230000),
          chips: [{ type: 'memory-saved', label: 'Saved to memory' }],
          member360Conflict: {
            id: uid(),
            field: 'Annual income',
            userValue: 'Income is $130,000/year',
            profileValue: 'Annual income: $115,000/year',
          },
          suggestions: ["Tell me about Roth limits", "What's my ideal budget split?", "How can I increase my savings rate?"],
        },
        { id: uid(), role: 'user', content: "Keep explanations simple for me — I don't need all the technical jargon", timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "**Got it — plain language from here on out.**\n\nI'll skip the financial jargon and give you clear, straightforward answers. If I ever need to use a technical term, I'll explain it in simple words.\n\nThis actually helps me give you better advice — focused on what matters, without the noise. Just let me know if you ever want more detail on something specific.",
          timestamp: new Date(now.getTime() - 170000),
          memoryProposal: { id: uid(), content: 'Prefers simple explanations without financial jargon', category: 'PREFERENCES' },
          suggestions: ["What should I focus on first?", "Show me my spending", "How are my goals doing?"],
        },
      ],
      memories: [
        ...SHARED_MEMORIES,
        { id: 'mem-mi-1', category: 'ABOUT_ME', content: 'Has 401k at Vanguard with $45,000 balance', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
      ],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
    {
      id: 'goal-discovery',
      title: 'Goal Discovery & Creation',
      subtitle: 'Suggested goal surfaces in Goals Center from natural conversation',
      icon: 'target',
      messages: [
        { id: uid(), role: 'user', content: 'I really need to pay off my credit card. The balance is about $4,200', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "**Credit Card Payoff Plan**\n\nLet's get a plan together. Here's your current situation:\n\n**Your Card Details**\n• **Balance:** $4,200\n• **Interest rate:** 22.99% APR\n• **Minimum payment:** $84/month\n• **Daily interest accruing:** ~$2.64\n\n**The Cost of Minimum Payments**\nAt $84/month, you'd be paying for 7+ years and spend over $3,100 in interest — nearly doubling what you owe. Every month you accelerate saves you real money.\n\n**Option A — Aggressive (6 months)**\n• **Monthly payment:** $720\n• **Paid off by:** July\n• **Total interest paid:** ~$400\n• **Interest saved vs. minimum:** ~$2,800\n• **Impact on budget:** Leaves $800/month from your surplus\n\n**Option B — Balanced (12 months)**\n• **Monthly payment:** $380\n• **Paid off by:** January\n• **Total interest paid:** ~$700\n• **Interest saved vs. minimum:** ~$2,400\n• **Impact on budget:** Leaves $1,140/month from your surplus\n\n**My Take**\nOption A saves you $400 more in interest, but Option B gives you significantly more breathing room each month. Given your wedding savings coming up, the balanced approach might be the smarter play.\n\nWhich feels more doable for your monthly budget?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'memory-saved', label: 'Saved to memory' }],
          autoSaveMemory: { content: 'Has $4,200 credit card balance at 22.99% APR', category: 'ABOUT_ME' },
          memoryProposal: { id: uid(), content: 'Paying off credit card debt is a financial priority', category: 'PRIORITIES' },
          safetyTier: 'actionable',
          safetyMessage: 'Actionable — needs your approval',
          suggestions: ['Set up Option A', 'Set up Option B', 'Help me prioritize my debts'],
        },
        { id: uid(), role: 'system', content: "I've added a goal suggestion to your Goals panel — check it when you're ready.", timestamp: new Date(now.getTime() - 59000) },
      ],
      memories: [
        ...SHARED_MEMORIES.slice(0, 3),
        { id: 'mem-gd-1', category: 'ABOUT_ME', content: 'Has $4,200 credit card balance at 22.99% APR', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
      ],
      goals: [
        { ...EMERGENCY_FUND_GOAL },
        { id: 'draft-cc-payoff', type: 'DEBT_PAYOFF', title: 'Credit Card Payoff', targetAmount: 4200, currentAmount: 0, targetDate: daysFromNow(180), monthlyContributionTarget: 380, actualMonthlyContribution: 380, status: 'DRAFT', confidenceScore: 0.88, milestones: [{ id: 'dm1', label: '25%', targetPct: 25, reached: false }, { id: 'dm2', label: '50%', targetPct: 50, reached: false }, { id: 'dm3', label: '75%', targetPct: 75, reached: false }, { id: 'dm4', label: '100%', targetPct: 100, reached: false }], linkedAccount: 'SoFi Credit Card', createdAt: daysAgo(0) },
      ],
    },
    {
      id: 'proactive-risk',
      title: 'Proactive Risk Alert',
      subtitle: 'Goal setback triggers memory proposal — connects priorities to recovery',
      icon: 'alert-triangle',
      messages: [
        {
          id: uid(), role: 'system', content: 'AI inferred a change in your goals', timestamp: new Date(now.getTime() - 120000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "**Credit Card Payoff — Risk Alert**\n\nI wanted to give you a heads-up — your confidence score dropped from 82% to 58% this week. Here's the full picture:\n\n**What Happened**\n• **Last 2 payments:** $380 each (target was $420, shortfall of $80 total)\n• **New charge:** $340 added to the balance\n• **Net impact:** $420 further from your goal than planned\n\n**Where This Puts You**\n• **Current balance:** $1,260 remaining\n• **Original payoff date:** 4 months from now\n• **Projected payoff at current pace:** ~5.5 months (6 weeks late)\n• **Extra interest cost if delayed:** ~$48\n\n**Why This Matters for Your Priorities**\nI know paying off this card is a priority for you, especially with the wedding in October 2027. Staying on track here frees up $380/month that can flow straight into wedding savings once you're done.\n\n**Your Options**\n\n• **Option A — Catch up this month:** Bump payment to $520 (+$140 over your usual). Gets you back to 78% confidence and on track for the original date.\n\n• **Option B — Extend timeline:** Add 2 months to your deadline. Monthly payment drops to $350, giving you $70/month more breathing room. Confidence resets to 72%.\n\nNo need to panic — both paths get you to debt-free. It comes down to whether you'd prefer a short push or a steadier pace.\n\nWhat feels right for your budget this month?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'goal-risk', label: 'Credit Card at risk' }],
          memoryProposal: { id: uid(), content: 'Credit card spending increased in recent months', category: 'ABOUT_ME' },
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
          id: uid(), role: 'ai', content: "**Emergency Fund — 75% Milestone!**\n\nYou just hit **75% of your Emergency Fund goal!** That's $9,000 out of $12,000.\n\n**Your Journey**\n• **25% ($3,000)** — reached 60 days ago\n• **50% ($6,000)** — reached 20 days ago\n• **75% ($9,000)** — reached today\n• **100% ($12,000)** — on track for ~2 months from now\n\n**What's Working**\nYou've been contributing $460/month — that's $10 above your $450 target, every single month. That consistency is exactly why you're 2 weeks ahead of schedule.\n\n**The Home Stretch**\n• **Remaining:** $3,000\n• **At your current pace:** ~6.5 months to go\n• **Interest earned so far:** ~$150 at 4.00% APY\n• **What $12,000 covers:** 3 full months of essential expenses\n\n**By the Numbers**\nYou've saved $9,000 in about 5 months — that's a 24% savings rate dedicated just to this goal. For context, the average American saves about 4.7% of income total. You're crushing it.\n\nJust $3,000 to go. You've got this!",
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
          memoryProposal: { id: uid(), content: 'Received $3,000 work bonus, interested in optimized allocation', category: 'ABOUT_ME' },
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
          id: uid(), role: 'ai', content: "**SoFi Checking — Current Balance**\n\nYour balance is **$3,847.52** as of right now.\n\n**Account Activity**\n• **Pending transactions:** 2 charges totaling $127.80 (settling tomorrow)\n• **Available after pending:** $3,719.72\n• **Last deposit:** $3,100.00 — 3 days ago (payroll)\n\n**Quick Context**\nThis covers roughly 3 weeks of essential expenses based on your spending patterns. You're in good shape for the rest of the month.",
          timestamp: new Date(now.getTime() - 290000),
          safetyTier: 'informational',
          safetyMessage: 'Informational',
        },
        { id: uid(), role: 'user', content: 'Any tips on reducing my dining spending?', timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "**Dining Spending — Reduction Tips**\n\nBased on your recent spending patterns, here are three strategies ranked by potential impact:\n\n**1. Meal Prep on Sundays** (saves ~$200/month)\nMembers who batch-cook save an average of $200/month on dining. You're already trending this direction — your dining is down 21% over 3 months. Formalizing a prep routine could accelerate the savings.\n\n**2. Set a $100 Weekly Dining Cap** (saves ~$80/month)\nYou've been averaging about $120/week on dining. A $100 cap is a realistic stretch goal — not so tight it feels punishing, but enough to save $80+/month ($960/year).\n\n**3. Turn On SoFi Relay Alerts** (behavioral nudge)\nI can set up real-time spending nudges when you're approaching your dining limit. Members who use alerts spend 12% less in their tracked categories.\n\n**The Math**\nEven cutting $20/week frees up over $1,000 a year — that's 2+ months of emergency fund contributions just from dining adjustments alone.\n\nWant me to set up any of these?",
          timestamp: new Date(now.getTime() - 230000),
          safetyTier: 'suggestive',
          safetyMessage: 'Suggestion',
        },
        { id: uid(), role: 'user', content: 'Can you move $500 from checking to savings?', timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "**Transfer Preview**\n\nHere's what this transfer would look like:\n\n**Transfer Details**\n• **From:** SoFi Checking ($3,847.52 current balance)\n• **To:** SoFi Savings (Emergency Fund)\n• **Amount:** $500.00\n\n**After Transfer**\n• **Checking balance:** $3,347.52 — still covers ~2.5 weeks of essential expenses\n• **Emergency Fund:** $8,900 (74% of $12,000 goal, up from 70%)\n• **Pending charges:** $127.80 settles tomorrow — you'll still have $3,219.72 available\n\n**Impact on Your Goal**\nThis bumps your Emergency Fund 4% closer and puts you about 1 week ahead of schedule. Nice boost.\n\nWant me to confirm this transfer?",
          timestamp: new Date(now.getTime() - 170000),
          safetyTier: 'actionable',
          safetyMessage: 'Actionable — needs your approval',
          suggestions: ['Confirm transfer', 'Change amount', 'Cancel'],
        },
        { id: uid(), role: 'user', content: 'Should I rebalance my investment portfolio?', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "**Portfolio Rebalancing — Expert Recommendation**\n\nPortfolio rebalancing involves several layers of complexity:\n\n**What's Involved**\n• **Tax implications:** Selling assets may trigger capital gains taxes\n• **Market timing:** Rebalancing at the wrong time can lock in losses\n• **Goal alignment:** Your allocation should match your risk tolerance, timeline, and other financial priorities\n\n**Why I'd Recommend a Human Expert**\nGiven your risk-averse preference and the tax complexity involved, this is a great candidate for a SoFi Certified Financial Planner session — free for members.\n\n**What They Can Do**\n• Review your full investment picture across all accounts\n• Identify tax-loss harvesting opportunities (potentially saving you money at tax time)\n• Build a rebalancing strategy that matches your comfort level\n• Factor in your other goals (wedding, emergency fund) for a holistic approach\n\n**How I Can Help**\nWith your permission, I'll share your relevant financial context — risk preference, current goals, savings progress, and spending patterns — so the planner can jump right in without starting from scratch.\n\nWant me to set that up?",
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
  ];
}

export const SCENARIOS = buildScenarios();

export const SCENARIO_ORDER = [
  'cold-start', 'returning-member', 'memory-lifecycle', 'memory-intelligence',
  'goal-discovery', 'proactive-risk', 'milestone-celebration', 'weekly-recap',
  'cross-product', 'tiered-safety',
];
