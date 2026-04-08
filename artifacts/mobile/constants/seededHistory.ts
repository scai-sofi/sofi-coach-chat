import { SCENARIOS } from './scenarios';
import type { ChatSession } from '@/context/CoachContext';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

interface SeededSessionDef {
  scenarioId: string;
  title: string;
  daysAgoCreated: number;
  daysAgoUpdated: number;
}

const PERSONA_SEEDED_SESSIONS: Record<string, SeededSessionDef[]> = {
  'persona-maya': [
    { scenarioId: 'cold-start', title: 'Getting started with Coach', daysAgoCreated: 2, daysAgoUpdated: 2 },
  ],
  'persona-marcus': [
    { scenarioId: 'returning-member', title: 'Weekly spending review', daysAgoCreated: 3, daysAgoUpdated: 3 },
    { scenarioId: 'proactive-risk', title: 'Credit card payoff alert', daysAgoCreated: 10, daysAgoUpdated: 10 },
    { scenarioId: 'cross-product', title: 'Splitting my work bonus', daysAgoCreated: 21, daysAgoUpdated: 21 },
  ],
  'persona-jordan': [
    { scenarioId: 'goal-discovery', title: 'Building my debt payoff plan', daysAgoCreated: 5, daysAgoUpdated: 5 },
    { scenarioId: 'cold-start', title: 'First chat with Coach', daysAgoCreated: 14, daysAgoUpdated: 14 },
  ],
  'persona-david': [
    { scenarioId: 'returning-member', title: 'Monthly portfolio review', daysAgoCreated: 4, daysAgoUpdated: 4 },
    { scenarioId: 'milestone-celebration', title: 'Emergency fund hit 75%!', daysAgoCreated: 12, daysAgoUpdated: 12 },
    { scenarioId: 'memory-lifecycle', title: 'Updating my financial preferences', daysAgoCreated: 25, daysAgoUpdated: 25 },
  ],
};

export function buildSeededHistory(personaId: string): ChatSession[] {
  const defs = PERSONA_SEEDED_SESSIONS[personaId];
  if (!defs || defs.length === 0) return [];

  return defs.map(def => {
    const scenario = SCENARIOS.find(s => s.id === def.scenarioId);
    if (!scenario) return null;
    return {
      id: `seeded-${def.scenarioId}-${uid()}`,
      title: def.title,
      messages: [...scenario.messages],
      memories: [...scenario.memories],
      goals: [...scenario.goals],
      createdAt: daysAgo(def.daysAgoCreated),
      updatedAt: daysAgo(def.daysAgoUpdated),
      scenarioId: def.scenarioId,
    };
  }).filter(Boolean) as ChatSession[];
}
