import { Message, Memory, Goal, AutoSaveMemory, AutoCreateGoal, AutoUpdateGoal, MemoryProposal, GoalProposal, InsightToAction, MessageChip, SafetyTier } from './types';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

interface StoreState {
  memories: Memory[];
  goals: Goal[];
  temporaryChat: boolean;
}

export function generateAIResponse(userInput: string, store: StoreState): Partial<Message> | null {
  const input = userInput.toLowerCase().trim();
  const prefersDetail = store.memories.some(m => m.content.toLowerCase().includes('detailed breakdown'));
  const hasGoals = store.goals.filter(g => g.status !== 'COMPLETED' && g.status !== 'PAUSED').length > 0;

  if (input.includes('outdated') || input.includes('that dining thing')) {
    return {
      content: "Updated! I've adjusted that memory to reflect your shift toward cooking at home. That's a great move for both your budget and your emergency fund goal.\n\nSince you're making this a habit, would you like me to also remember that cooking at home is a priority for you? That way I can factor it into future spending advice.",
      chips: [{ type: 'memory-updated', label: 'Memory updated' }],
      memoryProposal: { id: uid(), content: 'Cooking at home is now a priority over dining out', category: 'PREFERENCE' },
    };
  }

  if (input.includes('help me pay off') || input.includes('pay off credit')) {
    return {
      content: "Let's get a plan together for that. Here's what I'm seeing:\n\n• **Balance:** $4,200\n• **Interest rate:** 22.99% APR\n• **Minimum payment:** $84/month\n\nAt minimum payments only, you'd be paying for 7+ years and spend over $3,100 in interest. Let's do better.\n\n**Option A — Aggressive (6 months)**\n$720/month → paid off by July, saves ~$2,800 in interest\n\n**Option B — Balanced (12 months)**\n$380/month → paid off by January, saves ~$2,400 in interest\n\nWhich feels more doable for your monthly budget?",
      goalProposal: {
        id: uid(), type: 'DEBT_PAYOFF', title: 'Credit Card Payoff',
        targetAmount: 4200, targetDate: new Date(Date.now() + 180 * 86400000),
        monthlyContribution: 380, linkedAccount: 'SoFi Credit Card',
      },
      safetyTier: 'actionable' as SafetyTier,
      safetyMessage: 'Actionable — needs your approval',
      suggestions: ['Set up Option A', 'Set up Option B', 'Help me prioritize my debts'],
    };
  }

  if (input.includes('help me prioritize')) {
    return {
      content: "Here's how I'd rank your priorities based on the math:\n\n• **Credit Card (22.99% APR)** — highest interest rate, so every dollar here gives you a guaranteed 23% return. Pay this first.\n\n• **Emergency Fund** — you're at 70%, which is great. Keep building toward that $12,000 target for a solid safety net.\n\n• **Wedding Savings** — start ramping this up once your emergency fund hits 90%. You've got time until October 2027.\n\nThe key insight: eliminating high-interest debt before stacking savings is almost always the best move. Want me to set up a plan around this order?",
      suggestions: ['Sounds good, set it up', 'What about investing?', 'Show me the numbers'],
    };
  }

  if (input.includes('sounds good') || input.includes("let's go") || input.includes('let\'s go')) {
    return {
      content: "Let's do it! What would you like to tackle first?\n\nPick the one that feels most important right now — we can always layer in more goals later.",
      suggestions: ['Building an emergency fund', 'Paying off debt', 'Saving for a big purchase', 'Spending smarter'],
    };
  }

  if (input.includes('building an emergency fund')) {
    return {
      content: "Smart first move — an emergency fund is the foundation everything else builds on.\n\nFor your situation in the Bay Area with a household of two, I'd recommend targeting **3 to 6 months of essential expenses** — that's roughly **$12,000 to $15,000**.\n\nLet's start with $12,000. At $450/month into your SoFi Savings, you'd hit that target in about 8 months. I can set up automatic transfers so you don't have to think about it.\n\nWant me to create this goal and get the auto-transfers started?",
      insightToAction: {
        id: uid(),
        memory: { content: 'Building an emergency fund is a top priority', category: 'GOAL_RELATED', saved: false },
        goalProposal: {
          id: uid(), type: 'EMERGENCY_FUND', title: 'Emergency Fund',
          targetAmount: 12000, targetDate: new Date(Date.now() + 240 * 86400000),
          monthlyContribution: 450, linkedAccount: 'SoFi Savings',
        },
        dismissed: false,
      },
    };
  }

  if (input.includes('paying off debt')) {
    return {
      content: "Great call — getting rid of debt frees up so much mental and financial space.\n\nTell me about what you're working with, or I can pull the details from your SoFi accounts. I'll map out the optimal payoff strategy — whether that's avalanche (highest interest first) or snowball (smallest balance first), depending on what motivates you.\n\nWhat do you have in mind?",
      insightToAction: {
        id: uid(),
        memory: { content: 'Paying off debt is a financial priority', category: 'GOAL_RELATED', saved: false },
        goalProposal: {
          id: uid(), type: 'DEBT_PAYOFF', title: 'Debt Payoff Plan',
          targetAmount: 4200, targetDate: new Date(Date.now() + 365 * 86400000),
          monthlyContribution: 350, linkedAccount: 'SoFi Credit Card',
        },
        dismissed: false,
      },
    };
  }

  if (input.includes('saving for') || input.includes('big purchase')) {
    return {
      content: "Love it — having a specific savings target makes all the difference. What are you saving for?\n\nWhether it's a vacation, a car, or your wedding coming up in October 2027, I can help you reverse-engineer a monthly savings plan with a clear timeline.\n\nWhat's the goal and roughly when do you need it by?",
      memoryProposal: { id: uid(), content: 'Interested in saving for a specific purchase', category: 'GOAL_RELATED' },
    };
  }

  if (input.includes('spend smarter') || input.includes('spending smarter')) {
    return {
      content: "I can definitely help with that. First question — how do you like to get your spending insights?\n\nSome people prefer a quick weekly pulse, others like a detailed breakdown with categories and trends. Either way works for me.",
      suggestions: ['Quick summary is fine', 'Detailed breakdown please'],
    };
  }

  if (input.includes('quick summary')) {
    return {
      content: "Got it — I'll keep things concise and to the point. You can always ask me to go deeper on anything.\n\nHere's your quick take for this week: you've spent $892 so far, which is about 5% under your weekly average. Nice work — you're trending in the right direction.",
      autoSaveMemory: { content: 'Prefers quick financial summaries over detailed breakdowns', category: 'PREFERENCE' },
    };
  }

  if (input.includes('detailed breakdown')) {
    return {
      content: "My kind of person — let's dig into the numbers.\n\nThis week you spent **$892** total, down 5% vs. your weekly average:\n• Groceries: $165 — on budget\n• Dining: $95 — down 18% from last week\n• Transport: $52 — stable\n• Shopping: $580 — one-time monitor purchase\n\nIf we exclude that monitor, your baseline spending is $312 — well below your typical $380. That's real progress.",
      autoSaveMemory: { content: 'Prefers detailed financial breakdowns with numbers and trends', category: 'PREFERENCE' },
    };
  }

  if (input.includes('set up option a')) {
    return {
      content: "Done — your aggressive payoff plan is set up:\n\n• **Plan:** $720/month for 6 months\n• **From:** SoFi Checking → SoFi Credit Card\n• **First payment:** This Friday\n\nI've created your goal and I'll track your progress automatically. You can check in anytime from the Goals dashboard — I'll also send you weekly updates since that's your preference.",
      autoCreateGoal: {
        type: 'DEBT_PAYOFF', title: 'Credit Card Payoff',
        targetAmount: 4200, targetDate: new Date(Date.now() + 180 * 86400000),
        monthlyContribution: 720, linkedAccount: 'SoFi Credit Card',
      },
      chips: [{ type: 'goal-progress', label: 'Goal created' }],
    };
  }

  if (input.includes('set up option b')) {
    return {
      content: "All set — your balanced payoff plan is ready:\n\n• **Plan:** $380/month for 12 months\n• **From:** SoFi Checking → SoFi Credit Card\n• **First payment:** This Friday\n\nThis gives you more monthly flexibility while still making strong progress. I'll send weekly check-ins so you always know where you stand.",
      autoCreateGoal: {
        type: 'DEBT_PAYOFF', title: 'Credit Card Payoff',
        targetAmount: 4200, targetDate: new Date(Date.now() + 365 * 86400000),
        monthlyContribution: 380, linkedAccount: 'SoFi Credit Card',
      },
      chips: [{ type: 'goal-progress', label: 'Goal created' }],
    };
  }

  if (input.includes('increase this month')) {
    return {
      content: "Done! Here's your updated Credit Card Payoff plan:\n\n• **This month's payment:** $520 (up from $380)\n• **Confidence score:** Back up to 78%\n• **Status:** On track again\n\nThat extra $140 this month makes a real difference. I'll send you a reminder a few days before the payment goes through.",
      autoUpdateGoal: {
        goalTitle: 'Credit Card Payoff',
        monthlyContribution: 520,
        confidenceScore: 0.78,
        status: 'ON_TRACK',
      },
      chips: [{ type: 'goal-progress', label: 'Goal updated' }],
    };
  }

  if (input.includes('extend deadline') || input.includes('extend my deadline')) {
    return {
      content: "Updated your Credit Card Payoff timeline:\n\n• **New deadline:** Extended by 2 months\n• **Monthly payment:** Reduced to $350\n• **Confidence score:** 72%\n\nThis gives you more breathing room month to month while still making solid progress. Sometimes a sustainable pace beats an aggressive one. I'll keep tracking and let you know if anything changes.",
      autoUpdateGoal: {
        goalTitle: 'Credit Card Payoff',
        monthlyContribution: 350,
        targetDate: new Date(Date.now() + 180 * 86400000),
        confidenceScore: 0.72,
      },
      chips: [{ type: 'goal-progress', label: 'Goal updated' }],
    };
  }

  if (input.includes('confirm transfer') || input.includes('set up all three')) {
    return {
      content: "All done! Here's the summary:\n\n• **Credit Card:** $1,260 payment scheduled — this completes your payoff! That 22.99% APR is officially history.\n• **Savings:** $1,200 transferred — Emergency Fund now at $9,600 (80% of goal)\n• **Invest:** $540 allocated to the Conservative portfolio (70% bonds, 30% index funds)\n\nCongrats — you just eliminated your most expensive debt, accelerated your safety net, and started investing. That's a great day.",
      autoUpdateGoal: {
        goalTitle: 'Credit Card Payoff',
        currentAmount: 4200,
        status: 'COMPLETED',
        confidenceScore: 1.0,
      },
      chips: [
        { type: 'milestone', label: 'Credit Card paid off!' },
        { type: 'goal-progress', label: 'Emergency Fund 80%' },
      ],
    };
  }

  if (input.includes('connect me') || input.includes('planner')) {
    return {
      content: "I'll set up a session with a SoFi Certified Financial Planner — it's completely free for SoFi members.\n\nHere's what you can expect:\n• A full review of your investment picture\n• Personalized rebalancing strategy based on your risk profile\n• Tax-optimization recommendations\n\nWith your permission, I'll share your relevant financial context so the planner can jump right in without starting from scratch. Want me to go ahead?",
      chips: [{ type: 'handoff', label: 'Connecting to specialist' }],
      safetyTier: 'handoff' as SafetyTier,
      safetyMessage: 'Complex — human advisor recommended',
    };
  }

  if (input.includes('what can you help') || input.includes('what do you do')) {
    return {
      content: "I can help across four main areas:\n\n• **Spending Insights** — track where your money goes, spot trends, and find opportunities to save\n\n• **Goals & Tracking** — set financial goals, monitor progress with milestones, and get nudges when something needs attention\n\n• **SoFi Products** — help you get the most out of checking, savings, investing, credit, and loans\n\n• **Financial Planning** — budgeting strategies, debt payoff plans, and connecting you with human advisors for complex topics\n\nWhat sounds most useful right now?",
      suggestions: ['Show my spending', 'Help me set a goal', 'What products do I have?', 'I need financial advice'],
    };
  }

  if (input.includes('dining trend')) {
    if (prefersDetail) {
      return {
        content: "Here's your full dining trend analysis:\n\n• **This month:** $485 (↓12% from last month)\n• **3-month average:** $530/month\n• **6-month average:** $610/month\n• **Trend:** Consistently decreasing\n\n**Weekly Breakdown**\n• Week 1: $145 (birthday dinner)\n• Week 2: $95\n• Week 3: $120\n• Week 4: $125 (so far)\n\n**Where It's Going**\n• DoorDash: $180 (37%)\n• Local restaurants: $165 (34%)\n• Coffee shops: $140 (29%)\n\nAt this rate, you'll save roughly $1,500/year compared to your peak. The shift to cooking at home is clearly showing in the numbers.",
        provenance: 'Analysis based on SoFi Checking and Credit Card transactions. Categories are auto-classified and some may need manual adjustment.',
      };
    }
    return {
      content: "Your dining spending is trending down nicely — $485 this month, which is 12% less than last month. The shift to cooking at home is paying off.\n\nAt this pace, you're on track to save about $1,500 a year compared to your peak dining spend. Want me to break it down further?",
      provenance: 'Based on your SoFi Checking and Credit Card transaction data.',
      suggestions: ['Show me the detailed breakdown', 'How does this help my goals?'],
    };
  }

  if (input.includes('show goal') || input.includes('goals progress')) {
    const goalSummaries = store.goals
      .filter(g => g.status !== 'PAUSED' && g.status !== 'COMPLETED')
      .map(g => {
        const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
        const statusLabel = g.status === 'AT_RISK' ? 'needs attention' : 'on track';
        return `• **${g.title}:** $${g.currentAmount.toLocaleString()} of $${g.targetAmount.toLocaleString()} (${pct}%) — ${statusLabel}`;
      }).join('\n');

    return {
      content: goalSummaries
        ? `Here's where your goals stand:\n\n${goalSummaries}\n\nYou can see the full dashboard with progress rings and milestones in the Goals panel — just tap "Goals" in the menu.`
        : "You don't have any active goals yet. Want me to help you set one up? We can start with something simple like an emergency fund or a savings target.",
      suggestions: hasGoals ? ['Open goals dashboard', 'Help me adjust a goal'] : ['Help me set a goal', 'What goals should I consider?'],
    };
  }

  if (input.includes('snapshot') || input.includes('overview') || input.includes('financial snapshot')) {
    return {
      content: "**Your Financial Snapshot**\n\n**Accounts**\n• Checking: $3,847.52\n• Savings: $8,400.00\n• Invest: $2,150.00\n• Credit Card: −$1,260 balance\n\nYour net worth is **$13,137.52**, up $840 from last month.\n\n**Goals**\n• Emergency Fund: 70% complete, on track\n• Credit Card Payoff: 70% complete, needs attention\n\n**Monthly Cash Flow**\n• Income: $6,200\n• Expenses: $4,680\n• Surplus: $1,520\n\nThat $1,520 surplus is your biggest lever right now. Want to talk about how to allocate it?",
      suggestions: ['Tell me about my spending', 'How can I grow my net worth?', 'Show my goals'],
    };
  }

  if (input.includes('what do you know') || input.includes('know about me')) {
    const grouped: Record<string, string[]> = {};
    store.memories
      .filter(m => m.status === 'ACTIVE')
      .forEach(m => {
        const labels: Record<string, string> = {
          PREFERENCE: 'Preferences', FINANCIAL_ATTITUDE: 'Financial Attitudes',
          LIFE_CONTEXT: 'Life Context', CONSTRAINT: 'Constraints',
          GOAL_RELATED: 'Goals', EXPLICIT_FACT: 'Facts',
        };
        const cat = labels[m.category] || m.category;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(`• ${m.content}`);
      });

    const memoryList = Object.entries(grouped)
      .map(([cat, items]) => `**${cat}**\n${items.join('\n')}`)
      .join('\n\n');

    return {
      content: memoryList
        ? `Here's what I've learned about you so far:\n\n${memoryList}\n\nYou can edit or remove any of these anytime — just tap the brain icon in the menu to open the Memory Center.`
        : "I don't have any saved memories yet. As we chat, I'll start picking up on your preferences and financial context to make my advice more personal.\n\nYou can also tell me things directly — like \"remember that I'm saving for a house\" — and I'll save it right away.",
    };
  }

  if (input.includes('how does my memory work') || input.includes('how does memory work')) {
    return {
      content: "Great question! Here's the short version:\n\nI learn as we talk — picking up on your preferences, habits, and context. I'll always ask before saving something new.\n\nEverything I remember is visible in the Memory Center (brain icon in the menu). You can view, edit, pause, or delete anything at any time.\n\nYou can also use **Temporary Chat Mode** — tap the shield button in the input bar to chat without me remembering anything. Useful for sensitive topics or just exploring.\n\nI track things like preferences, financial attitudes, life context, constraints, and goal-related notes — all organized by category so it's easy to manage.",
      suggestions: ['Show me my memories', 'Start a temporary chat', 'What do you know about me?'],
    };
  }

  if (input.includes('cancel') && input.includes('subscription')) {
    return {
      content: "I can help you think through that, but the actual cancellation needs to happen on the provider's end.\n\nHere's what I found:\n• **Service:** StreamMax Premium\n• **Monthly cost:** $14.99\n• **Last used:** 6 weeks ago\n• **Annual cost:** $179.88\n\nThat $180/year could cover almost half a month's emergency fund contribution. Want me to flag this for a check-in next month in case you decide to keep it?",
      memoryProposal: { id: uid(), content: 'Reviewing unused subscriptions for potential cancellation', category: 'FINANCIAL_ATTITUDE' },
    };
  }

  if (input.includes('how can i save') || input.includes('save more')) {
    return {
      content: "Based on your recent spending, here are the biggest opportunities:\n\n• **Dining Out** — save ~$150/month. You're already trending down here. Keeping the cooking-at-home momentum could free up $150+ monthly.\n\n• **Subscriptions** — save ~$45/month. I've spotted a couple of services with low usage. Worth reviewing.\n\n• **Automate your surplus** — you have $1,520/month after expenses. Setting up auto-transfers on payday means the money moves before you miss it.\n\nThe biggest win is usually the simplest: automate first, optimize second. Want me to help set up automatic savings transfers?",
      suggestions: ['Set up auto-transfers', 'Show me my subscriptions', 'What about my groceries?'],
    };
  }

  if (input.includes('remember') && (input.includes('that') || input.includes('i '))) {
    const factContent = userInput.replace(/remember\s*(that\s*)?/i, '').trim();
    if (factContent.length > 5) {
      return {
        content: `Got it — saved! I'll keep "${factContent}" in mind going forward. You can always update or remove this in the Memory Center.`,
        chips: [{ type: 'memory-saved', label: 'Saved to memory' }],
        autoSaveMemory: { content: factContent, category: 'EXPLICIT_FACT' },
      };
    }
  }

  if (input.includes('what about investing') || input.includes('should i invest')) {
    return {
      content: "Investing is a great long-term wealth builder — but timing matters.\n\nBefore investing, make sure you have:\n• High-interest debt paid off (or a plan to)\n• At least 3 months of emergency savings\n• A comfortable monthly budget with room to invest consistently\n\nYou're close on both your debt payoff and emergency fund, so you're almost at the ideal starting point.\n\nWhen you're ready, SoFi Invest offers options from conservative (mostly bonds) to aggressive (mostly stocks). Given your risk-averse preference, I'd suggest starting with the Conservative portfolio.\n\nKeep in mind: all investing involves risk, and past performance doesn't guarantee future results. Want to explore your options?",
      suggestions: ['Tell me about conservative portfolios', 'How much should I invest monthly?', 'I\'ll wait until my debt is paid off'],
    };
  }

  return null;
}
