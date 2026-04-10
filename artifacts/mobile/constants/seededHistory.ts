import { SCENARIOS } from './scenarios';
import { PERSONA_GOALS } from './personaGoals';
import type { ChatSession } from '@/context/CoachContext';
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
  ],
  'persona-jordan': [
    {
      scenarioId: 'cold-start',
      title: 'First chat with Coach',
      daysAgoCreated: 14,
      daysAgoUpdated: 14,
      goals: PERSONA_GOALS['persona-jordan'],
    },
  ],
  'persona-david': [
    {
      scenarioId: 'returning-member',
      title: 'Monthly portfolio review',
      daysAgoCreated: 4,
      daysAgoUpdated: 4,
      goals: PERSONA_GOALS['persona-david'],
    },
    {
      scenarioId: 'memory-lifecycle',
      title: 'Updating my financial preferences',
      daysAgoCreated: 25,
      daysAgoUpdated: 25,
      // David's goals are on the returning-member session; no duplicate here
      goals: [],
    },
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
