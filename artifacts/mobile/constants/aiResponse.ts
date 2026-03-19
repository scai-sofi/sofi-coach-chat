import { Message, Memory, Goal, AutoSaveMemory, AutoCreateGoal, AutoUpdateGoal, MemoryProposal, GoalProposal, InsightToAction, MessageChip, SafetyTier } from './types';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

interface StoreState {
  memories: Memory[];
  goals: Goal[];
  temporaryChat: boolean;
}

export function generateAIResponse(userInput: string, store: StoreState): Partial<Message> {
  const input = userInput.toLowerCase().trim();
  const prefersDetail = store.memories.some(m => m.content.toLowerCase().includes('detailed breakdown'));

  if (input.includes('outdated') || input.includes('that dining thing')) {
    return {
      content: "Updated! I've changed your dining preference to reflect that you've shifted to cooking more at home. That's great for both your budget and your emergency fund goal!\n\nI noticed you mentioned the shift in habits — would you also like me to remember that cooking at home is now a priority?",
      chips: [{ type: 'memory-updated', label: 'Memory updated' }],
      memoryProposal: { id: uid(), content: 'Cooking at home is now a priority over dining out', category: 'PREFERENCE' },
    };
  }

  if (input.includes('help me pay off') || input.includes('pay off credit')) {
    return {
      content: "Let's tackle that credit card debt! Here's what I can see:\n\n**Current Balance:** $4,200\n**Interest Rate:** 22.99% APR\n\n**Option A: Aggressive (6 months)**\n$720/month → paid off by July\n\n**Option B: Balanced (12 months)**\n$380/month → paid off by January",
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
      content: "Here's my recommended priority order based on your situation:\n\n**1. Credit Card (22.99% APR)** — highest interest, pay this first\n**2. Emergency Fund** — you're at 70%, keep building\n**3. Wedding Savings** — start after emergency fund hits 90%\n\nThe math is clear: every dollar to your credit card saves you 23¢/year in interest.",
      suggestions: ['Sounds good, set it up', 'What about investing?', 'Show me the numbers'],
    };
  }

  if (input.includes('sounds good') || input.includes("let's go") || input.includes('let\'s go')) {
    return {
      content: "Great! Let's get you set up. What would you like to focus on first?\n\nI can help you with any of these:",
      suggestions: ['Building an emergency fund', 'Paying off debt', 'Saving for a big purchase', 'Spending smarter'],
    };
  }

  if (input.includes('building an emergency fund')) {
    return {
      content: "Smart choice! An emergency fund is the foundation of financial security.\n\nBased on your Bay Area expenses, I'd recommend targeting **3-6 months of essential expenses** — roughly **$12,000-$15,000**.\n\nLet's start with $12,000. At $450/month, you'd reach it in about 8 months. I can set up automatic transfers from your checking to your SoFi Savings account.",
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
      content: "Good call on tackling debt! Let me help you create a payoff plan.\n\nTell me about your debt — or I can pull it from your SoFi accounts. I'll figure out the optimal payoff strategy.",
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
      content: "Great! What are you saving for? Whether it's a vacation, a car, or something else, I can help you create a savings plan with a timeline and automatic contributions.\n\nWhat's the target amount and when do you need it by?",
      memoryProposal: { id: uid(), content: 'Interested in saving for a specific purchase', category: 'GOAL_RELATED' },
    };
  }

  if (input.includes('spend smarter')) {
    return {
      content: "I can definitely help with that! First, how would you prefer to receive spending insights?\n\nSome people like a quick summary, others prefer a detailed breakdown with categories and trends.",
      suggestions: ['Quick summary is fine', 'Detailed breakdown please'],
    };
  }

  if (input.includes('quick summary')) {
    return {
      content: "Got it! I'll keep your financial updates concise and to the point. You can always ask for more detail on anything.\n\nHere's this week's quick take: You've spent $892 so far, which is 5% under your weekly average. Nice work!",
      autoSaveMemory: { content: 'Prefers quick financial summaries over detailed breakdowns', category: 'PREFERENCE' },
    };
  }

  if (input.includes('detailed breakdown')) {
    return {
      content: "Perfect! I'll always give you the full picture with numbers, trends, and comparisons. I know you appreciate the details.\n\nHere's this week's detailed breakdown:\n\n**Total Spent:** $892 (↓5% vs. weekly avg)\n• Groceries: $165 (on budget)\n• Dining: $95 (↓18%)\n• Transport: $52 (stable)\n• Shopping: $580 (one-time monitor purchase)",
      autoSaveMemory: { content: 'Prefers detailed financial breakdowns with numbers and trends', category: 'PREFERENCE' },
    };
  }

  if (input.includes('set up option a')) {
    return {
      content: "Setting up your aggressive credit card payoff plan:\n\n**Plan:** $720/month for 6 months\n**From:** SoFi Checking\n**To:** SoFi Credit Card\n**First payment:** This Friday\n\nI've created your goal and will track your progress. You can check it anytime in your Goals dashboard.",
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
      content: "Setting up your balanced credit card payoff plan:\n\n**Plan:** $380/month for 12 months\n**From:** SoFi Checking\n**To:** SoFi Credit Card\n**First payment:** This Friday\n\nGoal created! I'll send you weekly progress updates since that's your preference.",
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
      content: "Done! I've updated your Credit Card Payoff goal:\n\n• **This month's payment:** $520 (was $380)\n• **Confidence:** Restored to 78%\n• **Status:** Back on track\n\nI'll send you a reminder before the payment date.",
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
      content: "Updated your Credit Card Payoff timeline:\n\n• **New deadline:** Extended by 2 months\n• **Monthly payment:** Reduced to $350\n• **Confidence:** 72%\n\nThis gives you more breathing room while still making solid progress.",
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
      content: "All set! Here's what I've done:\n\n**Credit Card:** $1,260 payment scheduled — this completes your payoff!\n**Savings:** $1,200 transferred — Emergency Fund now at $9,600 (80%)\n**Invest:** $540 allocated to Conservative portfolio\n\nCongratulations on eliminating your credit card debt! That 22.99% APR is history.",
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
      content: "I'll connect you with a SoFi Certified Financial Planner. They offer free 30-minute consultations for SoFi members.\n\n**What to expect:**\n• Review of your complete financial picture\n• Personalized investment strategy\n• Tax-optimization recommendations\n\nI'll share your relevant financial context (with your permission) so the planner can hit the ground running.",
      chips: [{ type: 'handoff', label: 'Connecting to specialist' }],
      safetyTier: 'handoff' as SafetyTier,
      safetyMessage: 'Complex — human advisor recommended',
    };
  }

  if (input.includes('what can you help') || input.includes('what do you do')) {
    return {
      content: "I can help you with four key areas:\n\n**1. Spending Insights**\nTrack spending, identify trends, find savings opportunities\n\n**2. Goal Setting & Tracking**\nCreate financial goals, monitor progress, celebrate milestones\n\n**3. Product Guidance**\nHelp you use SoFi's products (checking, savings, invest, credit, loans)\n\n**4. Financial Planning**\nBudgeting advice, debt strategies, and connecting you with human advisors for complex topics",
      suggestions: ['Show my spending', 'Help me set a goal', 'What products do I have?', 'I need financial advice'],
    };
  }

  if (input.includes('dining trend')) {
    if (prefersDetail) {
      return {
        content: "Here's your detailed dining trend analysis:\n\n**This Month:** $485 (↓12% from last month)\n**3-Month Average:** $530/month\n**6-Month Average:** $610/month\n**Trend:** Consistently decreasing!\n\n**Weekly Breakdown:**\n• Week 1: $145 (high — birthday dinner)\n• Week 2: $95\n• Week 3: $120\n• Week 4: $125 (so far)\n\n**Top Merchants:**\n1. DoorDash: $180 (37%)\n2. Local restaurants: $165 (34%)\n3. Coffee shops: $140 (29%)\n\nYour shift to cooking at home is clearly showing in the numbers. At this rate, you'll save ~$1,500/year compared to your peak spending.",
        provenance: 'Analysis based on SoFi Checking and Credit Card transactions. Categories are auto-classified.',
      };
    }
    return {
      content: "Your dining spending is trending down — $485 this month, down 12% from last month. The shift to cooking at home is working!\n\nAt this rate, you'll save about $1,500 compared to your peak spending.",
      provenance: 'Based on your SoFi transaction data.',
    };
  }

  if (input.includes('show goal') || input.includes('goals progress')) {
    const goalSummaries = store.goals
      .filter(g => g.status !== 'PAUSED' && g.status !== 'COMPLETED')
      .map(g => {
        const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
        return `• **${g.title}:** $${g.currentAmount.toLocaleString()} of $${g.targetAmount.toLocaleString()} (${pct}%) — ${g.status === 'AT_RISK' ? 'At risk' : 'On track'}`;
      }).join('\n');

    return {
      content: goalSummaries
        ? `Here's where your goals stand:\n\n${goalSummaries}\n\nTap the Goals icon in the menu for the full dashboard with progress rings and milestones.`
        : "You don't have any active goals yet. Want me to help you set one up?",
      suggestions: ['Open goals dashboard', 'Help me set a goal'],
    };
  }

  if (input.includes('snapshot') || input.includes('overview') || input.includes('financial snapshot')) {
    return {
      content: "**Your Financial Snapshot**\n\n**Accounts:**\n• Checking: $3,847.52\n• Savings: $8,400.00\n• Invest: $2,150.00\n• Credit Card: -$1,260 balance\n\n**Net Worth: $13,137.52**\n(Up $840 from last month)\n\n**Goals:**\n• Emergency Fund: 70% complete\n• Credit Card Payoff: 70% complete\n\n**Monthly Cash Flow:**\n• Income: $6,200\n• Expenses: $4,680\n• Surplus: $1,520",
      suggestions: ['Tell me about my spending', 'How can I grow my net worth?', 'Show my goals'],
    };
  }

  if (input.includes('what do you know') || input.includes('know about me')) {
    const memoryList = store.memories
      .filter(m => m.status === 'ACTIVE')
      .map(m => `• ${m.content}`)
      .join('\n');

    return {
      content: memoryList
        ? `Here's what I've learned about you:\n\n${memoryList}\n\nYou can edit or remove any of these in the Memory Center — tap the brain icon in the menu.`
        : "I don't have any saved memories yet. As we chat, I'll learn your preferences and financial context to give you more personalized advice.",
    };
  }

  if (input.includes('how does my memory work') || input.includes('how does memory work')) {
    return {
      content: "Great question! Here's how my memory works:\n\n**Automatic Learning**\nAs we chat, I pick up on your preferences and financial context. I'll always ask before saving something important.\n\n**You're in Control**\nYou can view, edit, or delete anything I remember in the Memory Center (brain icon in the menu).\n\n**Temporary Chat**\nUse the shield button to chat without me remembering anything — perfect for sensitive topics.\n\n**What I Remember:**\n• Your preferences (detail level, notification frequency)\n• Financial attitudes (risk tolerance, spending priorities)\n• Life context (location, household size)\n• Goals and constraints",
      suggestions: ['Show me my memories', 'Start a temporary chat', 'What do you know about me?'],
    };
  }

  if (input.includes('cancel') && input.includes('subscription')) {
    return {
      content: "I can help you review that subscription. However, actually canceling it requires going to the service provider's website or app.\n\nHere's what I found:\n• **Service:** StreamMax Premium\n• **Cost:** $14.99/month\n• **Last used:** 6 weeks ago\n• **Annual cost:** $179.88\n\nWould you like me to remember to check back on this next month?",
      memoryProposal: { id: uid(), content: 'Reviewing unused subscriptions for potential cancellation', category: 'FINANCIAL_ATTITUDE' },
    };
  }

  return {
    content: "That's a great question! I'm here to help with your finances — from tracking spending to setting goals and managing your SoFi products.\n\nHere are some things you can try:",
    suggestions: ['What\'s my financial snapshot?', 'Help me set a goal', 'Show my spending breakdown', 'What can you help with?'],
  };
}
