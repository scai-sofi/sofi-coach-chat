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
  { id: 'mem-3', category: 'ABOUT_ME', content: 'Lives in Austin, TX — rents a 1BR for $2,100/month', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(21), updatedAt: daysAgo(21) },
  { id: 'mem-4', category: 'PRIORITIES', content: 'Saving for a home down payment by 2028', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(10), updatedAt: daysAgo(10) },
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
  linkedAccount: 'SoFi Money',
  createdAt: daysAgo(90),
};

export const CREDIT_CARD_GOAL: Goal = {
  id: 'goal-cc',
  type: 'DEBT_PAYOFF',
  title: 'Credit Card',
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

export const WEDDING_GOAL: Goal = {
  id: 'goal-wedding',
  type: 'SAVINGS_TARGET',
  title: 'Wedding',
  targetAmount: 15000,
  currentAmount: 0,
  targetDate: daysFromNow(548),
  monthlyContributionTarget: 650,
  actualMonthlyContribution: 0,
  status: 'DRAFT',
  confidenceScore: 0.88,
  milestones: [
    { id: 'wm1', label: '25%', targetPct: 25, reached: false },
    { id: 'wm2', label: '50%', targetPct: 50, reached: false },
    { id: 'wm3', label: '75%', targetPct: 75, reached: false },
    { id: 'wm4', label: '100%', targetPct: 100, reached: false },
  ],
  linkedAccount: 'SoFi Money',
  createdAt: daysAgo(0),
};

function buildScenarios(): Scenario[] {
  const now = new Date();
  return [
    {
      id: 'cold-start',
      title: 'Cold Start Onboarding',
      subtitle: "First session — Profile overview, My Finances, goal linking",
      icon: 'sparkles',
      messages: [
        {
          id: uid(), role: 'ai', content: "**Welcome to SoFi Coach**\n\nHey Olivia — I'm Coach, your personal financial coach. I can analyze your spending, set goals that link directly to your SoFi accounts, and connect you with human experts when needed.\n\nAs we talk, I'll build your Profile — organized into About Me, My Goals, My Finances, and My Preferences. You're always in control — everything I learn can be viewed, edited, or deleted from your Profile anytime.\n\nWhat would you like to explore first?",
          timestamp: new Date(now.getTime() - 300000),
          suggestions: ['What\'s my financial snapshot?', 'Help me set a goal', 'Show my spending breakdown'],
        },
        { id: uid(), role: 'user', content: "What's my financial snapshot?", timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "**Your Financial Snapshot**\n\nI've pulled together your full picture from My Finances — your SoFi accounts plus your linked external accounts:\n\n**SoFi Accounts**\n• **SoFi Money:** $27,282.12\n• **SoFi Invest:** $45,120.50\n• **SoFi Credit Card:** $4,200 balance at 22.99% APR\n\n**External Accounts (13 linked via Plaid)**\n• **Vanguard 401k:** $45,000\n• **Chase checking:** $3,218.40\n• **+ 11 others** — see your My Finances tab for the full breakdown\n\n**Key Numbers**\n• **Monthly income:** ~$7,400 (after tax — no state income tax in TX)\n• **Monthly spending:** ~$4,680\n• **Savings rate:** ~18%\n• **Net worth:** ~$1,278,220 across all accounts\n\n**Quick Take**\nYou have a healthy income-to-spending ratio. The main opportunity is that credit card — at 22.99% APR it's costing you roughly $80/month in interest alone. Addressing that would free up real cash flow for your down payment savings.",
          timestamp: new Date(now.getTime() - 230000),
          autoSaveMemory: { content: 'Has $4,200 credit card balance at 22.99% APR', category: 'ABOUT_ME' },
          chips: [{ type: 'memory-saved', label: 'Saved to About Me', memoryIds: ['mem-cs-1'] }],
          suggestions: ['Help me pay off the credit card', 'How can I save more?', 'Tell me about investing'],
          provenance: 'SoFi account balances as of today. External accounts via Plaid link (last synced today). Net worth aggregated across all 15 accounts in My Finances.',
        },
        { id: uid(), role: 'user', content: 'I want to pay off the credit card first, then save for a house', timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "**Smart prioritization — debt first, then save.**\n\nThat's a solid approach. Clearing the credit card at 22.99% APR eliminates high-cost interest — the math typically favors paying off high-rate debt before adding to savings. No savings account currently matches that rate.\n\n**Your Payoff Plan — Balanced (10 months)**\n• **Monthly payment:** $420\n• **Total interest paid:** ~$380\n• **Paid off by:** " + new Date(Date.now() + 300 * 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + "\n• **Monthly cash freed after payoff:** $420 → straight into down payment savings\n\n**After the Card Is Gone**\nWith $420/month freed up plus your existing savings capacity, you could be putting $800+/month toward a down payment — that compounds fast in a high-yield account at 4.00% APY.\n\nI can set this up as a tracked goal linked directly to your SoFi Credit Card — so I'll monitor your actual payments and alert you if you fall behind. Want me to set it up?",
          timestamp: new Date(now.getTime() - 170000),
          memoryProposal: { id: uid(), content: 'Wants to pay off credit card before saving for a home', category: 'PRIORITIES' },
          goalProposal: {
            id: uid(),
            type: 'DEBT_PAYOFF',
            title: 'Credit Card',
            targetAmount: 4200,
            targetDate: daysFromNow(300),
            monthlyContribution: 420,
            linkedAccount: 'SoFi Credit Card',
          },
          provenance: 'Based on your SoFi Credit Card balance ($4,200) and APR (22.99%). Payoff projections use standard amortization. APY from SoFi Money current rate.',
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
      subtitle: 'Trajectory monitoring, About Me conflict, cross-surface insights',
      icon: 'user-check',
      messages: [
        {
          id: uid(), role: 'system', content: 'Your weekly financial summary is ready', timestamp: new Date(now.getTime() - 300000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "**Your Week in Review**\n\nHere's your detailed view — since I know you like the numbers (you told Coach this on day one):\n\n**Spending This Week: $892** (↓8% from last week)\n• **Groceries:** $165 — on budget, consistent with your meal-planning\n• **Dining:** $95 — best week this month, cooking-at-home shift is working\n• **Transportation:** $52 — stable\n• **Shopping:** $580 — one-time monitor purchase (your baseline was $312)\n\n**Goals — Trajectory Update**\nI've been continuously tracking your goals against your actual account activity:\n• **Emergency Fund:** $8,400 of $12,000 (70%) — on track, 2 weeks ahead. SoFi Money Vault contributions consistent for 3 months straight.\n• **Credit Card:** $2,940 of $4,200 (70%) — trending behind. Last 2 payments averaged $380 vs. your $420 target. If this pace continues, you'll miss your payoff date by ~6 weeks.\n\n**Something Worth Looking At**\nI spotted a $14.99/month streaming subscription you haven't used in 6 weeks. Canceling would free up $180/year — nearly half a month's emergency fund contribution.\n\n*This summary also appears on your Home feed.*",
          timestamp: new Date(now.getTime() - 290000),
          chips: [
            { type: 'goal-progress', label: 'Emergency Fund on track' },
            { type: 'goal-risk', label: 'Credit Card trending behind' },
          ],
          provenance: 'Spending from SoFi Money transactions this week. Goal trajectories calculated from actual contributions vs. targets over the last 90 days. Subscription usage from SoFi Relay linked accounts.',
          suggestions: ['Cancel that subscription', 'Tell me about the credit card trajectory', 'Open My Goals'],
        },
        { id: uid(), role: 'user', content: "Good to know. By the way, I got a raise — I'm making $135k now", timestamp: new Date(now.getTime() - 180000) },
        {
          id: uid(), role: 'ai', content: "**Congrats on the raise, Olivia!**\n\nThat's a meaningful jump — here's what it changes:\n\n**Updated Picture**\n• **New gross monthly:** ~$11,250 (was ~$9,583)\n• **After taxes (est.):** ~$8,650/month (no state income tax in TX)\n• **Current spending:** ~$4,680/month\n• **New savings capacity:** ~$3,970/month (up from ~$2,820)\n\n**What This Unlocks**\nWith ~$1,150 more per month, you could:\n• **Accelerate credit card payoff** — clear it 3 months sooner\n• **Max out emergency fund** — hit $12k by next quarter\n• **Boost down payment savings** — start building toward your goal\n\nThe key is capturing this raise before lifestyle creep sets in.\n\n**Profile discrepancy**\nYour About Me tab shows $115k from your SoFi profile. I've noted the $135k you just shared — you can verify or update this in your About Me tab.\n\nWant me to model an allocation plan for the extra income?",
          timestamp: new Date(now.getTime() - 170000),
          autoSaveMemory: { content: 'Annual income increased to $135,000', category: 'ABOUT_ME' },
          chips: [{ type: 'memory-saved', label: 'Saved to About Me', memoryIds: ['mem-rm-1'] }],
          member360Conflict: {
            id: uid(),
            field: 'Annual income',
            userValue: 'Income is $135,000/year',
            profileValue: 'Annual income: $115,000/year',
          },
          provenance: 'Income from what you shared. Tax estimate based on 2026 federal brackets (no TX state tax). Spending baseline from your SoFi Money transaction history. Profile income from About Me (SoFi verified).',
          suggestions: ['Model the allocation', 'Accelerate debt payoff', 'Open my About Me tab'],
        },
      ],
      memories: [
        ...SHARED_MEMORIES,
        { id: 'mem-rm-1', category: 'ABOUT_ME', content: 'Annual income is $135,000', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
        { id: 'mem-rm-2', category: 'PRIORITIES', content: 'Getting married in October 2027 — saving for wedding', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(10), updatedAt: daysAgo(10) },
      ],
      goals: [{ ...EMERGENCY_FUND_GOAL }, { ...CREDIT_CARD_GOAL }, { ...WEDDING_GOAL }],
    },
    {
      id: 'memory-lifecycle',
      title: 'Knowledge Management',
      subtitle: 'Source labels, Profile tabs, and per-category control',
      icon: 'brain',
      messages: [
        { id: uid(), role: 'user', content: "I have a 401k at Vanguard with about $45,000 in it", timestamp: new Date(now.getTime() - 420000) },
        {
          id: uid(), role: 'ai', content: "**Nice — that's a solid foundation.**\n\nA $45,000 401k balance at 31 is great progress. That puts you ahead of the national median for your age group.\n\n**Quick Context**\n• **Current balance:** $45,000\n• **Provider:** Vanguard\n• **Typical growth at 7%:** Could become ~$340k by age 50 without adding another dollar\n• **With $500/month contributions:** Could reach ~$680k by age 50\n\nI've saved this to your About Me tab — labeled \"You told Coach.\" You can edit or remove it from your Profile anytime.\n\nAre you currently contributing through Stripe, and do you know if they offer a match?",
          timestamp: new Date(now.getTime() - 410000),
          chips: [{ type: 'memory-saved', label: 'Saved to About Me', memoryIds: ['mem-mi-1'] }],
          provenance: 'Balance from what you shared. Growth projections use a 7% historical average annual return.',
          suggestions: ["Yes, Stripe matches 50% up to 6%", "I'm not sure about my match", "How much should I contribute?"],
        },
        { id: uid(), role: 'user', content: "I'd rather focus on paying off debt before investing more", timestamp: new Date(now.getTime() - 360000) },
        {
          id: uid(), role: 'ai', content: "**That's a thoughtful approach.**\n\nPrioritizing debt payoff before ramping up investments is a valid strategy — especially with your credit card at 22.99% APR.\n\n**The General Framework**\n\n• **Step 1:** Get the employer match (it's free money)\n• **Step 2:** Pay off high-interest debt (anything over ~7% APR)\n• **Step 3:** Build emergency fund to 3 months\n• **Step 4:** Max out retirement contributions\n\n**Where You Stand**\nWith $45k already in your 401k and an emergency fund in progress, you're in a great position. Clearing the credit card first means your future investment dollars work harder — they're not fighting against interest payments.\n\nOnce the debt is gone, you'll have significant monthly cash flow to redirect into down payment savings.\n\nI'd like to remember this preference — \"Prioritizes debt payoff before investing.\" This would go in your Preferences tab. Approve?",
          timestamp: new Date(now.getTime() - 350000),
          memoryProposal: { id: uid(), content: 'Prioritizes debt payoff before increasing investments', category: 'PREFERENCES' },
          provenance: 'Based on your SoFi Credit Card APR (22.99%) and current Emergency Fund goal progress.',
          suggestions: ["Approve", "Skip this one", "Show me my debt overview"],
        },
        { id: uid(), role: 'user', content: "Actually, that dining thing is outdated — I've been cooking more lately", timestamp: new Date(now.getTime() - 240000) },
        {
          id: uid(), role: 'ai', content: "**Profile Updated**\n\nI've adjusted your Priorities tab to reflect your shift toward cooking at home.\n\n**What Changed**\n• **Before:** \"Dining out is a focus area for spending reduction\" *(Coach inferred)*\n• **After:** \"Shifted to cooking at home — dining spend down 21%\" *(you corrected)*\n\n**Why This Matters**\nThis shift is already showing results — your dining spend is down 21% over the last 3 months, which translates to roughly $1,500/year in savings. That's real money flowing toward your emergency fund and future down payment.",
          timestamp: new Date(now.getTime() - 230000),
          chips: [{ type: 'memory-updated', label: 'Profile updated', memoryIds: ['mem-2'] }],
          provenance: 'Dining spending trend from your SoFi Money transactions over the last 90 days. Down payment intent referenced 3 times across previous sessions.',
          suggestions: ["What should I focus on first?", "Show me my spending trends", "Open my Profile"],
        },
      ],
      memories: [
        ...SHARED_MEMORIES,
        { id: 'mem-mi-1', category: 'ABOUT_ME', content: 'Has 401k at Vanguard with $45,000 balance', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
        { id: 'mem-manual-1', category: 'PRIORITIES', content: 'Wants to build a down payment fund after clearing debt', source: 'EXPLICIT', status: 'ACTIVE', createdAt: daysAgo(3), updatedAt: daysAgo(3) },
      ],
      goals: [{ ...EMERGENCY_FUND_GOAL }],
    },
    {
      id: 'goal-discovery',
      title: 'Goal Creation',
      subtitle: 'Coach spots an intent, offers a tracked payoff goal linked to a SoFi product',
      icon: 'target',
      messages: [
        { id: uid(), role: 'user', content: 'I really need to pay off my credit card. The balance is about $4,200', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "**Credit Card Payoff Plan**\n\nLet's get a plan together. I can see your SoFi Credit Card balance is exactly $4,200 at 22.99% APR — here's how the numbers work:\n\n**The Cost of Minimum Payments**\nAt $84/month, you'd be paying for 7+ years and spend over $3,100 in interest — nearly doubling what you owe. Every month you accelerate saves you real money.\n\n**Option A — Aggressive (6 months)**\n• **Monthly payment:** $720\n• **Paid off by:** " + new Date(Date.now() + 180 * 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + "\n• **Total interest paid:** ~$400\n• **Impact on budget:** Leaves $800/month from your surplus\n\n**Option B — Balanced (12 months)**\n• **Monthly payment:** $380\n• **Paid off by:** " + new Date(Date.now() + 365 * 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + "\n• **Total interest paid:** ~$700\n• **Impact on budget:** Leaves $1,140/month from your surplus\n\n**My Take**\nOption A saves you $300 more in interest, but Option B gives you breathing room each month. Given your down payment savings goal, the balanced approach might be the smarter play — keeping some cash flow for both priorities.\n\n**Track This as a Goal?**\nI can set this up as a tracked goal in My Goals, linked to your SoFi Credit Card. I'll monitor your payments against the plan and let you know if anything shifts.\n\nWhich option works for you?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'memory-saved', label: 'Saved to About Me', memoryIds: ['mem-gd-1'] }],
          autoSaveMemory: { content: 'Has $4,200 credit card balance at 22.99% APR', category: 'ABOUT_ME' },
          memoryProposal: { id: uid(), content: 'Paying off credit card debt is a financial priority', category: 'PRIORITIES' },
          provenance: 'Balance and APR from your SoFi Credit Card account (real-time). Payoff projections use standard amortization. Monthly surplus from your SoFi Money spending patterns.',
          suggestions: ['Set up as a goal (Option B)', 'Set up as a goal (Option A)', 'Just remember it for now'],
        },
        { id: uid(), role: 'system', content: "Goal added to My Goals — linked to your SoFi Credit Card.", timestamp: new Date(now.getTime() - 59000) },
      ],
      memories: [
        ...SHARED_MEMORIES.slice(0, 3),
        { id: 'mem-gd-1', category: 'ABOUT_ME', content: 'Has $4,200 credit card balance at 22.99% APR', source: 'IMPLICIT_CONFIRMED', status: 'ACTIVE', createdAt: daysAgo(0), updatedAt: daysAgo(0) },
      ],
      goals: [
        { ...EMERGENCY_FUND_GOAL },
        { id: 'draft-cc-payoff', type: 'DEBT_PAYOFF', title: 'Credit Card', targetAmount: 4200, currentAmount: 0, targetDate: daysFromNow(180), monthlyContributionTarget: 380, actualMonthlyContribution: 380, status: 'DRAFT', confidenceScore: 0.88, milestones: [{ id: 'dm1', label: '25%', targetPct: 25, reached: false }, { id: 'dm2', label: '50%', targetPct: 50, reached: false }, { id: 'dm3', label: '75%', targetPct: 75, reached: false }, { id: 'dm4', label: '100%', targetPct: 100, reached: false }], linkedAccount: 'SoFi Credit Card', createdAt: daysAgo(0) },
      ],
    },
    {
      id: 'proactive-risk',
      title: 'Trajectory Monitoring',
      subtitle: 'Continuous deviation detection — weeks of data, not a one-time alert',
      icon: 'alert-triangle',
      messages: [
        {
          id: uid(), role: 'system', content: 'Coach has been tracking your Credit Card Payoff trajectory', timestamp: new Date(now.getTime() - 120000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "**Credit Card Payoff — Trajectory Deviation**\n\nHey Olivia, I've been continuously monitoring your Credit Card Payoff goal since you set it up 10 weeks ago. Over the last 3 weeks, your trajectory has shifted — here's what the trend shows:\n\n**3-Week Trajectory**\n• **Week 1:** Payment of $400 (target $420) — minor, confidence held at 76%\n• **Week 2:** Payment of $380 + $180 new charge — confidence dropped to 64%\n• **Week 3:** Payment of $360 + $160 new charge — confidence now at 58%\n\nThis isn't a single missed payment — it's a pattern shift I wanted to flag before it compounds further.\n\n**Where This Puts You**\n• **Current balance:** $1,260 remaining (was tracking to $980 by now)\n• **Original payoff date:** 4 months from now\n• **Projected at current trend:** ~5.5 months (6 weeks late)\n• **Extra interest cost if trend continues:** ~$48\n\n**Why This Matters for Your Priorities**\nYour Preferences tab says you want to redirect this cash flow into down payment savings. Every week the card carries a balance costs ~$5.57 in interest — that's money not going toward your house.\n\n**Your Options**\n\n• **Option A — Catch up:** Bump payment to $520 for 2 months. Gets confidence back to 78% and restores your original timeline.\n\n• **Option B — Adjust the goal:** Extend deadline by 2 months in My Goals. Monthly target drops to $350, giving you breathing room. I'll recalibrate the trajectory monitoring accordingly.\n\nBoth paths get you to debt-free. Want me to update your goal in My Goals?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'goal-risk', label: 'Credit Card trajectory deviation' }],
          memoryProposal: { id: uid(), content: 'Credit card spending increased — 3-week trend of under-target payments', category: 'ABOUT_ME' },
          provenance: 'Payment history from your SoFi Credit Card account over the last 3 weeks. Confidence score recalculated weekly from actual vs. target contributions. Goal target from My Goals. Priority reference from Preferences tab.',
          suggestions: ['Catch up (Option A)', 'Adjust goal in My Goals', 'Show me the full trajectory'],
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{ ...EMERGENCY_FUND_GOAL }, { ...CREDIT_CARD_GOAL }],
    },
    {
      id: 'milestone-celebration',
      title: 'Milestone & Next Goal',
      subtitle: '75% milestone triggers celebration and next-goal suggestion',
      icon: 'party-popper',
      messages: [
        {
          id: uid(), role: 'system', content: 'Your Emergency Fund hit a milestone!', timestamp: new Date(now.getTime() - 120000), isProactive: true,
        },
        {
          id: uid(), role: 'ai', content: "**Emergency Fund — 75% milestone reached**\n\nOlivia, you just hit 75% of your Emergency Fund goal. That's $9,000 out of $12,000.\n\n**Your Journey**\n• **25% ($3,000)** — reached 60 days ago\n• **50% ($6,000)** — reached 20 days ago\n• **75% ($9,000)** — reached today\n• **100% ($12,000)** — on track for ~6 months from now\n\n**What's Working**\nYour SoFi Money Vault contributions have been $460/month — $10 above your $450 target, every single month. That consistency is exactly why you're 2 weeks ahead of schedule.\n\n**The Home Stretch**\n• **Remaining:** $3,000\n• **At your current pace:** ~6.5 months to go\n• **Interest earned so far:** ~$150 at 4.00% APY\n• **What $12,000 covers:** ~3 months of essential expenses at your spending level\n\n**💡 What's Next?**\nYou've mentioned saving for a down payment a few times. Once this goal completes, I can set up a new goal linked to a dedicated SoFi Money Vault — that $460/month flows straight into your next priority without missing a beat.\n\nWant me to set up the down payment goal now so it's ready when your emergency fund completes?",
          timestamp: new Date(now.getTime() - 60000),
          chips: [{ type: 'milestone', label: '75% milestone reached!' }],
          provenance: 'Vault balance and contributions from your SoFi Money account. Milestone calculated from actual deposits vs. goal target in My Goals. Down payment intent referenced 3 times across About Me and chat history.',
          suggestions: ['Set up down payment goal now', 'Wait until emergency fund completes', 'Show My Goals'],
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
      id: 'cross-product',
      title: 'Cross-Product Allocation',
      subtitle: "Bonus split across goals linked to Banking, Invest, and Credit",
      icon: 'layers',
      messages: [
        { id: uid(), role: 'user', content: 'I just got a $3,000 bonus at work. What should I do with it?', timestamp: new Date(now.getTime() - 120000) },
        {
          id: uid(), role: 'ai', content: "**Your $3,000 Bonus — Optimized Across Your SoFi Products**\n\nCongrats, Olivia! I've mapped this against your active goals — here's how I'd split it:\n\n**1. Credit Card Payoff — $1,260 → SoFi Credit Card**\n• Clears your entire remaining balance — goal completes!\n• Eliminates 22.99% APR — the math typically favors paying off high-rate debt before investing\n• Frees up $380/month for your next priority\n\n**2. Emergency Fund — $1,200 → SoFi Money Vault**\n• Jumps from $8,400 → $9,600 (80%), 6 weeks ahead of schedule\n• Goes straight into your linked Vault at 4.00% APY\n\n**3. Long-Term Growth — $540 → SoFi Invest**\n• Seeds your investment portfolio\n• With debt eliminated and emergency fund nearly complete, this is the right time\n• Diversified index portfolio — matches your risk preference\n• Want me to set this up as a tracked \"Start Investing\" goal?\n\n**The Big Picture**\nThis single move touches 3 SoFi products, completes 1 goal, accelerates another, and opens a new one. Plus, the $380/month freed from Credit Card payments can flow directly into your down payment goal.\n\nWant me to execute all three moves?",
          timestamp: new Date(now.getTime() - 60000),
          memoryProposal: { id: uid(), content: 'Received $3,000 work bonus, interested in optimized allocation', category: 'ABOUT_ME' },
          provenance: 'SoFi Money, Credit Card, and Invest account data (real-time). Goal progress from My Goals. APR and APY rates as of today. Risk preference from My Preferences.',
          suggestions: ['Execute all three', 'Add investing as a tracked goal too', 'Adjust the split'],
        },
      ],
      memories: [...SHARED_MEMORIES],
      goals: [{ ...EMERGENCY_FUND_GOAL }, { ...CREDIT_CARD_GOAL }],
    },
  ];
}

export const SCENARIOS = buildScenarios();

export const SCENARIO_ORDER = [
  'cold-start', 'returning-member', 'memory-lifecycle',
  'goal-discovery', 'proactive-risk', 'milestone-celebration',
  'cross-product',
];
