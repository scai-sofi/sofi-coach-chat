import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Message, MessageChip, SafetyTier } from '@/constants/types';
import { useCoach } from '@/context/CoachContext';

const CHIP_STYLES: Record<string, { bg: string; color: string; icon: string }> = {
  'memory-saved': { bg: Colors.surfaceTint, color: Colors.contentPrimary, icon: 'cpu' },
  'memory-updated': { bg: Colors.surfaceTint, color: Colors.contentPrimary, icon: 'cpu' },
  'goal-progress': { bg: Colors.surfaceTint, color: Colors.contentPrimary, icon: 'target' },
  'goal-risk': { bg: Colors.dangerChipBg, color: Colors.dangerChipText, icon: 'alert-triangle' },
  'milestone': { bg: Colors.successBg, color: Colors.successDark, icon: 'star' },
  'handoff': { bg: Colors.infoBg, color: Colors.info, icon: 'arrow-up-right' },
  'alert': { bg: Colors.dangerChipBg, color: Colors.dangerChipText, icon: 'alert-triangle' },
};

const SAFETY_STYLES: Record<SafetyTier, { bg: string; color: string; icon: string; text: string }> = {
  informational: { bg: Colors.surfaceMuted, color: Colors.contentSecondary, icon: 'shield', text: 'Informational' },
  suggestive: { bg: Colors.surfaceMuted, color: Colors.contentSecondary, icon: 'shield', text: 'Suggestion' },
  actionable: { bg: Colors.warningBg, color: Colors.warning, icon: 'shield', text: 'Actionable — needs your approval' },
  handoff: { bg: Colors.infoBg, color: Colors.info, icon: 'arrow-up-right', text: 'Complex — human advisor recommended' },
};

function Divider() {
  return <View style={styles.divider} />;
}

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let prevWasHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      prevWasHeader = false;
      continue;
    }

    const parts: React.ReactNode[] = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    let keyIdx = 0;

    const isStandaloneBold = line.trim().startsWith('**') || /^\d+\.\s*\*\*/.test(line.trim());
    const isBullet = line.trim().startsWith('•');

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<Text key={keyIdx++}>{line.slice(lastIndex, match.index)}</Text>);
      }
      parts.push(
        <Text key={keyIdx++} style={{
          fontFamily: Fonts.medium,
          fontSize: isStandaloneBold ? 18 : 16,
          letterSpacing: isStandaloneBold ? -0.2 : 0,
        }}>
          {match[1]}
        </Text>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      parts.push(<Text key={keyIdx++}>{line.slice(lastIndex)}</Text>);
    }

    if (isStandaloneBold && elements.length > 0 && !prevWasHeader) {
      elements.push(<Divider key={`div-${i}`} />);
    }

    elements.push(
      <Text key={`line-${i}`} style={[
        styles.aiText,
        isBullet && styles.bulletText,
        isStandaloneBold && parts.length === 1 && styles.headerText,
      ]}>
        {parts}
      </Text>
    );

    prevWasHeader = isStandaloneBold;
  }

  return elements;
}

function ChipBadge({ chip }: { chip: MessageChip }) {
  const style = CHIP_STYLES[chip.type] || CHIP_STYLES['memory-saved'];
  return (
    <View style={[styles.chip, { backgroundColor: style.bg }]}>
      <Feather name={style.icon as any} size={11} color={style.color} />
      <Text style={[styles.chipText, { color: style.color }]}>{chip.label}</Text>
    </View>
  );
}

function SafetyBadge({ tier }: { tier: SafetyTier }) {
  const style = SAFETY_STYLES[tier];
  return (
    <View style={[styles.safetyBadge, { backgroundColor: style.bg }]}>
      <Feather name={style.icon as any} size={10} color={style.color} />
      <Text style={[styles.safetyText, { color: style.color }]}>{style.text}</Text>
    </View>
  );
}

function MemoryProposalCard({ message }: { message: Message }) {
  const { confirmMemory, dismissMemoryProposal } = useCoach();
  const proposal = message.memoryProposal;
  if (!proposal) return null;

  if (proposal.confirmed) {
    return (
      <View style={[styles.proposalCard, styles.confirmedCard]}>
        <Feather name="check-circle" size={14} color={Colors.successDark} />
        <Text style={styles.confirmedText}>Saved to memory</Text>
      </View>
    );
  }

  return (
    <View style={[styles.proposalCard, { paddingBottom: 16 }]}>
      <View style={styles.proposalHeader}>
        <Feather name="cpu" size={14} color={Colors.contentSecondary} style={{ marginTop: 2 }} />
        <Text style={styles.proposalText}>
          Want me to remember: <Text style={{ fontFamily: Fonts.italic }}>"{proposal.content}"</Text>?
        </Text>
      </View>
      <View style={[styles.proposalButtons, { marginLeft: 16 }]}>
        <Pressable style={styles.confirmBtn} onPress={() => confirmMemory(message.id)}>
          <Text style={styles.confirmBtnText}>Remember</Text>
        </Pressable>
        <Pressable style={styles.dismissBtn} onPress={() => dismissMemoryProposal(message.id)}>
          <Text style={styles.dismissBtnText}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}

function GoalProposalCard({ message }: { message: Message }) {
  const { confirmGoal, dismissGoalProposal } = useCoach();
  const proposal = message.goalProposal;
  if (!proposal) return null;

  if (proposal.confirmed) {
    return (
      <View style={[styles.proposalCard, styles.confirmedCard]}>
        <Feather name="check-circle" size={14} color={Colors.successDark} />
        <Text style={[styles.confirmedText, { color: Colors.contentPrimary }]}>Goal created — check your goals panel</Text>
      </View>
    );
  }

  const monthStr = proposal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return (
    <View style={styles.proposalCard}>
      <View style={styles.proposalHeader}>
        <Feather name="target" size={14} color={Colors.contentSecondary} style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.proposalText}>{proposal.title}</Text>
          <Text style={styles.proposalDetail}>
            Target: ${proposal.targetAmount.toLocaleString()} · ${proposal.monthlyContribution}/mo · {monthStr} · Linked: {proposal.linkedAccount}
          </Text>
        </View>
      </View>
      <View style={styles.proposalButtons}>
        <Pressable style={styles.confirmBtn} onPress={() => confirmGoal(message.id)}>
          <Text style={styles.confirmBtnText}>Set up goal</Text>
        </Pressable>
        <Pressable style={styles.dismissBtn} onPress={() => dismissGoalProposal(message.id)}>
          <Text style={styles.dismissBtnText}>Just chatting</Text>
        </Pressable>
      </View>
    </View>
  );
}

function InsightToActionCard({ message }: { message: Message }) {
  const { acceptInsightToAction, saveInsightMemoryOnly, dismissInsightToAction } = useCoach();
  const insight = message.insightToAction;
  if (!insight || insight.dismissed) return null;

  if (insight.accepted) {
    return (
      <View style={[styles.proposalCard, styles.confirmedCard]}>
        <Feather name="check-circle" size={14} color={Colors.successDark} />
        <Text style={[styles.confirmedText, { color: Colors.contentPrimary }]}>All set — saved to memory & goal created</Text>
      </View>
    );
  }

  if (insight.memoryOnly) {
    return (
      <View style={[styles.proposalCard, styles.confirmedCard]}>
        <Feather name="cpu" size={14} color={Colors.contentSecondary} />
        <Text style={styles.confirmedText}>Saved to memory</Text>
      </View>
    );
  }

  const gp = insight.goalProposal;
  const months = Math.ceil(gp.targetAmount / gp.monthlyContribution);
  return (
    <View style={styles.proposalCard}>
      <View style={[styles.proposalHeader, { gap: 10 }]}>
        <View style={styles.insightIcon}>
          <Feather name="target" size={14} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.proposalText, { fontSize: 14, lineHeight: 18 }]}>{gp.title}</Text>
          <Text style={styles.proposalDetail}>
            ${gp.targetAmount.toLocaleString()} · ${gp.monthlyContribution}/mo · ~{months} months
          </Text>
        </View>
      </View>
      <View style={[styles.proposalButtons, { marginTop: 12 }]}>
        <Pressable style={[styles.confirmBtn, { paddingHorizontal: 14, paddingVertical: 7 }]} onPress={() => acceptInsightToAction(message.id)}>
          <Text style={[styles.confirmBtnText, { fontSize: 13 }]}>Set up goal</Text>
        </Pressable>
        <Pressable onPress={() => saveInsightMemoryOnly(message.id)} style={{ paddingHorizontal: 14, paddingVertical: 7 }}>
          <Text style={{ fontSize: 13, fontFamily: Fonts.medium, color: Colors.contentSecondary }}>Just remember</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SuggestionPills({ suggestions, onTap }: { suggestions: string[]; onTap: (s: string) => void }) {
  return (
    <View style={styles.suggestions}>
      {suggestions.map((s, i) => (
        <Pressable key={i} style={styles.suggestionPill} onPress={() => onTap(s)}>
          <Text style={styles.suggestionText}>{s}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const iconCopy = require('@/assets/images/icon-copy.png');
const iconThumbsUp = require('@/assets/images/icon-thumbs-up.png');
const iconThumbsUpFilled = require('@/assets/images/icon-thumbs-up-filled.png');
const iconThumbsDown = require('@/assets/images/icon-thumbs-down.png');
const iconThumbsDownFilled = require('@/assets/images/icon-thumbs-down-filled.png');

function ActionFooter({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const [thumbUp, setThumbUp] = useState(false);
  const [thumbDown, setThumbDown] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);

  return (
    <View>
      <View style={styles.actionRow}>
        <Pressable style={styles.actionBtn} onPress={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          {copied ? (
            <View style={styles.actionIconWrap}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M20 6L9 17L4 12" stroke={Colors.contentBone600} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          ) : (
            <Image source={iconCopy} style={styles.actionIcon} />
          )}
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setThumbUp(!thumbUp)}>
          <Image source={thumbUp ? iconThumbsUpFilled : iconThumbsUp} style={styles.actionIcon} />
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setThumbDown(!thumbDown)}>
          <Image source={thumbDown ? iconThumbsDownFilled : iconThumbsDown} style={styles.actionIcon} />
        </Pressable>
        {message.provenance && (
          <Pressable style={[styles.actionBtn, { marginLeft: 4, flexDirection: 'row', gap: 4 }]} onPress={() => setShowProvenance(!showProvenance)}>
            <Text style={{ fontSize: 12, color: Colors.contentSecondary, fontFamily: Fonts.regular }}>Why this?</Text>
            <Feather name={showProvenance ? 'chevron-up' : 'chevron-down'} size={12} color={Colors.contentSecondary} />
          </Pressable>
        )}
      </View>
      {showProvenance && message.provenance && (
        <View style={styles.provenanceCard}>
          <Text style={styles.provenanceText}>{message.provenance}</Text>
        </View>
      )}
    </View>
  );
}

export function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const { sendMessage } = useCoach();

  if (message.role === 'system') {
    return (
      <View style={styles.systemRow}>
        <View style={[styles.systemPill, message.isProactive && styles.systemProactive]}>
          {message.isProactive && <Feather name="star" size={13} color="#fff" />}
          <Text style={[styles.systemText, message.isProactive && { color: '#fff' }]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiRow}>
      {message.chips && message.chips.length > 0 && (
        <View style={styles.chipsRow}>
          {message.chips.map((chip, i) => <ChipBadge key={i} chip={chip} />)}
        </View>
      )}

      <View style={styles.aiContent}>
        {renderContent(message.content)}
      </View>

      {message.safetyTier && <SafetyBadge tier={message.safetyTier} />}

      {message.memoryProposal && <MemoryProposalCard message={message} />}
      {message.goalProposal && <GoalProposalCard message={message} />}
      {message.insightToAction && <InsightToActionCard message={message} />}

      <ActionFooter message={message} />

      {isLatest && message.suggestions && (
        <SuggestionPills suggestions={message.suggestions} onTap={(s) => sendMessage(s)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  systemRow: { alignItems: 'center', paddingVertical: 8 },
  systemPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999,
    backgroundColor: Colors.surfaceTint,
  },
  systemProactive: { backgroundColor: Colors.contentPrimary },
  systemText: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.contentSecondary, lineHeight: 18 },
  userRow: { alignItems: 'flex-end', paddingLeft: 60 },
  userBubble: {
    backgroundColor: Colors.contentBone600,
    borderRadius: 24, paddingTop: 11, paddingBottom: 12,
    paddingHorizontal: 16, maxWidth: 298,
  },
  userText: { fontSize: 16, color: '#fff', fontFamily: Fonts.regular, lineHeight: 20 },
  aiRow: { gap: 16 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999,
  },
  chipText: { fontSize: 12, fontFamily: Fonts.medium, letterSpacing: 0.1 },
  aiContent: { paddingHorizontal: 4, gap: 8 },
  aiText: { fontSize: 16, color: Colors.contentPrimary, fontFamily: Fonts.regular, lineHeight: 20 },
  headerText: { fontSize: 18, fontFamily: Fonts.medium, letterSpacing: -0.2, lineHeight: 24 },
  bulletText: { paddingLeft: 8 },
  divider: {
    height: 0.75,
    backgroundColor: 'rgba(10,10,10,0.1)',
    marginVertical: 4,
  },
  safetyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
    alignSelf: 'flex-start', marginLeft: 4,
  },
  safetyText: { fontSize: 10, fontFamily: Fonts.medium, lineHeight: 12 },
  proposalCard: {
    backgroundColor: Colors.surfaceTint,
    borderWidth: 1, borderColor: 'rgba(10,10,10,0.05)',
    borderRadius: 16, padding: 12,
  },
  confirmedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  confirmedText: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.contentSecondary, lineHeight: 18 },
  proposalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  proposalText: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.contentPrimary, lineHeight: 18, flex: 1 },
  proposalDetail: { fontSize: 12, color: Colors.contentSecondary, fontFamily: Fonts.regular, marginTop: 2, lineHeight: 16 },
  proposalButtons: { flexDirection: 'row', gap: 8 },
  confirmBtn: {
    backgroundColor: Colors.contentPrimary, borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  confirmBtnText: { color: '#fff', fontSize: 12, fontFamily: Fonts.medium },
  dismissBtn: {
    borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)', borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  dismissBtnText: { color: Colors.contentSecondary, fontSize: 12, fontFamily: Fonts.medium },
  insightIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.contentPrimary,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 4,
  },
  actionBtn: { padding: 4 },
  actionIcon: { width: 20, height: 20 },
  actionIconWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  provenanceCard: {
    marginHorizontal: 4, paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 16, backgroundColor: Colors.surfaceTint, marginTop: 4,
  },
  provenanceText: { fontSize: 12, color: Colors.contentSecondary, lineHeight: 16, fontFamily: Fonts.regular },
  suggestions: {
    alignItems: 'flex-end', gap: 8,
  },
  suggestionPill: {
    borderWidth: 0.75, borderColor: Colors.contentBone600,
    borderRadius: 24, paddingTop: 11, paddingBottom: 12, paddingHorizontal: 16,
  },
  suggestionText: { fontSize: 16, color: Colors.contentPrimary, fontFamily: Fonts.regular, lineHeight: 20 },
});
