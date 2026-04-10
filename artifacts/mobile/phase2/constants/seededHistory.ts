import { SCENARIOS } from './scenarios';
import { PERSONA_GOALS } from './personaGoals';
import type { ChatSession } from '../context/CoachContext';
import type { Goal } from './types';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);

interface SeededSessionDef {
  scenarioId: string;
  title: string;
  daysAgoCreated: number;
  daysAgoUpdated: number;
  /** Goals to attach to this session. Overrides scenario.goals when provided. */
  goals?: Goal[];
}

const PERSONA_SEEDED_SESSIONS: Record<string, SeededSessionDef[]> = {
  'persona-maya': [
    {
      scenarioId: 'cold-start',
      title: 'Getting started with Coach',
      daysAgoCreated: 2,
      daysAgoUpdated: 2,
      goals: PERSONA_GOALS['persona-maya'],
    },
  ],
  'persona-marcus': [
    {
      scenarioId: 'returning-member',
      title: 'Weekly spending review',
      daysAgoCreated: 3,
      daysAgoUpdated: 3,
      goals: PERSONA_GOALS['persona-marcus'],
    },
    { scenarioId: 'proactive-risk', title: 'Credit card payoff alert', daysAgoCreated: 10, daysAgoUpdated: 10, goals: [] },
    { scenarioId: 'goal-discovery', title: 'Setting up a payoff plan', daysAgoCreated: 18, daysAgoUpdated: 18, goals: [] },
    { scenarioId: 'cross-product', title: 'Splitting my work bonus', daysAgoCreated: 28, daysAgoUpdated: 28, goals: [] },
  ],
  'persona-jordan': [
    {
      scenarioId: 'goal-discovery',
      title: 'Building my debt payoff plan',
      daysAgoCreated: 5,
      daysAgoUpdated: 5,
      goals: PERSONA_GOALS['persona-jordan'],
    },
    { scenarioId: 'proactive-risk', title: 'Spending alert on my card', daysAgoCreated: 12, daysAgoUpdated: 12, goals: [] },
    { scenarioId: 'cold-start', title: 'First chat with Coach', daysAgoCreated: 20, daysAgoUpdated: 20, goals: [] },
  ],
  'persona-david': [
    {
      scenarioId: 'returning-member',
      title: 'Monthly portfolio review',
      daysAgoCreated: 4,
      daysAgoUpdated: 4,
      goals: PERSONA_GOALS['persona-david'],
    },
    { scenarioId: 'milestone-celebration', title: 'Emergency fund hit 75%!', daysAgoCreated: 12, daysAgoUpdated: 12, goals: [] },
    { scenarioId: 'memory-lifecycle', title: 'Updating my financial preferences', daysAgoCreated: 20, daysAgoUpdated: 20, goals: [] },
    { scenarioId: 'cross-product', title: 'Allocating my year-end bonus', daysAgoCreated: 32, daysAgoUpdated: 32, goals: [] },
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
      goals: def.goals !== undefined ? [...def.goals] : [...scenario.goals],
      createdAt: daysAgo(def.daysAgoCreated),
      updatedAt: daysAgo(def.daysAgoUpdated),
      scenarioId: def.scenarioId,
    };
  }).filter(Boolean) as ChatSession[];
}
