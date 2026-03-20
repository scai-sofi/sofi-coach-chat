import React, { useState, useEffect, useRef, ComponentProps } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Animated as RNAnimated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Message, MessageChip, SafetyTier } from '@/constants/types';
import { useCoach } from '@/context/CoachContext';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

const CHIP_STYLES: Record<string, { bg: string; color: string; icon: FeatherIconName }> = {
  'memory-saved': { bg: Colors.surfaceTint, color: Colors.contentPrimary, icon: 'cpu' },
  'memory-updated': { bg: Colors.surfaceTint, color: Colors.contentPrimary, icon: 'cpu' },
  'goal-progress': { bg: Colors.surfaceTint, color: Colors.contentPrimary, icon: 'target' },
  'goal-risk': { bg: Colors.dangerChipBg, color: Colors.dangerChipText, icon: 'alert-triangle' },
  'milestone': { bg: Colors.successBg, color: Colors.successDark, icon: 'star' },
  'handoff': { bg: Colors.infoBg, color: Colors.info, icon: 'arrow-up-right' },
  'alert': { bg: Colors.dangerChipBg, color: Colors.dangerChipText, icon: 'alert-triangle' },
};

const SAFETY_STYLES: Record<SafetyTier, { bg: string; color: string; icon: FeatherIconName; text: string }> = {
  informational: { bg: Colors.surfaceMuted, color: Colors.contentSecondary, icon: 'shield', text: 'Informational' },
  suggestive: { bg: Colors.surfaceMuted, color: Colors.contentSecondary, icon: 'shield', text: 'Suggestion' },
  actionable: { bg: Colors.warningBg, color: Colors.warning, icon: 'shield', text: 'Actionable — needs your approval' },
  handoff: { bg: Colors.infoBg, color: Colors.info, icon: 'arrow-up-right', text: 'Complex — human advisor recommended' },
};

type ContentBlock =
  | { type: 'text'; text: string; paragraphGap: boolean }
  | { type: 'bullet'; text: string; paragraphGap: boolean }
  | { type: 'header'; text: string }
  | { type: 'divider' };

function normalizeLine(raw: string): string {
  let line = raw.trim();

  line = line.replace(/\*{3}(.+?)\*{3}/g, '**$1**');
  line = line.replace(/_{3}(.+?)_{3}/g, '**$1**');
  line = line.replace(/_{2}(.+?)_{2}/g, '**$1**');

  line = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  line = line.replace(/`([^`]+)`/g, '$1');

  return line;
}

function classifyLine(line: string): { isHeader: boolean; isList: boolean; isRule: boolean; displayText: string } {
  const hashMatch = line.match(/^#{1,6}\s+(.*)/);
  if (hashMatch) {
    const content = hashMatch[1].trim();
    return { isHeader: true, isList: false, isRule: false, displayText: `**${content.replace(/^\*\*|\*\*$/g, '')}**` };
  }

  const blockquoteMatch = line.match(/^>\s?(.*)/);
  const effective = blockquoteMatch ? blockquoteMatch[1] : line;

  const isRule = /^[-*_]{3,}\s*$/.test(effective);
  if (isRule) return { isHeader: false, isList: false, isRule: true, displayText: effective };

  const isNumbered = /^\d+\.\s/.test(effective);
  const isStandaloneBold = /^\*\*[^*]+\*\*\s*$/.test(effective) && !isNumbered;
  const isHeader = isStandaloneBold;

  const isBullet = effective.startsWith('•') || effective.startsWith('- ') || effective === '-';
  const isList = isBullet || isNumbered;

  return { isHeader, isList, isRule: false, displayText: effective };
}

function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let prevWasBullet = false;
  let prevWasBlank = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    if (/^`{3}/.test(rawLine.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) {
      const codeLine = rawLine.replace(/\t/g, '  ');
      blocks.push({ type: 'text', text: codeLine, paragraphGap: false });
      prevWasBlank = false;
      prevWasBullet = false;
      continue;
    }

    const normalized = normalizeLine(rawLine);

    if (normalized === '') {
      if (blocks.length > 0) prevWasBlank = true;
      continue;
    }

    const { isHeader, isList, isRule, displayText: classified } = classifyLine(normalized);

    if (isRule) {
      prevWasBlank = true;
      prevWasBullet = false;
      continue;
    }

    const paragraphGap = blocks.length > 0 && !isHeader && (
      prevWasBlank
      || (isList && !prevWasBullet)
      || (!isList && prevWasBullet)
    );

    let displayText = classified;
    if (displayText.startsWith('- ')) {
      displayText = '• ' + displayText.slice(2);
    }
    if (/^\d+\.\s/.test(displayText) && isList) {
      displayText = displayText.replace(/^\d+\.\s*/, '• ');
    }
    displayText = displayText.replace(/^(•\s*){2,}/, '• ');

    if (isHeader) {
      if (!displayText.startsWith('**')) {
        displayText = `**${displayText}**`;
      }
      const hasNonHeaderContent = blocks.some(b => b.type !== 'header' && b.type !== 'divider');
      if (hasNonHeaderContent) {
        blocks.push({ type: 'divider' });
      }
      blocks.push({ type: 'header', text: displayText });
    } else if (isList) {
      blocks.push({ type: 'bullet', text: displayText, paragraphGap });
    } else {
      blocks.push({ type: 'text', text: displayText, paragraphGap });
    }

    prevWasBullet = isList;
    prevWasBlank = false;
  }

  return blocks;
}

function formatInlineStyles(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const inlineRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Text key={keyIdx++}>{text.slice(lastIndex, match.index)}</Text>);
    }
    parts.push(
      <Text key={keyIdx++} style={{ fontFamily: Fonts.medium, lineHeight: 20 }}>
        {match[1]}
      </Text>
    );
    lastIndex = match.index + match[0].length;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) {
    const cleaned = remaining.replace(/\*+/g, '');
    if (cleaned) parts.push(<Text key={keyIdx++}>{cleaned}</Text>);
  }

  return parts.length > 0 ? parts : [<Text key={0}>{text}</Text>];
}

function BlockDivider() {
  return <View style={styles.divider} />;
}

function TextBlock({ block }: { block: Extract<ContentBlock, { type: 'text' }> }) {
  return (
    <Text style={[styles.aiText, block.paragraphGap && { marginTop: 8 }]}>
      {formatInlineStyles(block.text)}
    </Text>
  );
}

function BulletBlock({ block }: { block: Extract<ContentBlock, { type: 'bullet' }> }) {
  return (
    <Text style={[styles.aiText, styles.bulletText, block.paragraphGap && { marginTop: 8 }]}>
      {formatInlineStyles(block.text)}
    </Text>
  );
}

function HeaderBlock({ block }: { block: Extract<ContentBlock, { type: 'header' }> }) {
  const cleanText = block.text.replace(/^\d+\.\s*/, '');
  return (
    <Text style={[styles.aiText, styles.headerText]}>
      {formatInlineStyles(cleanText)}
    </Text>
  );
}

function renderBlock(block: ContentBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'divider':
      return <BlockDivider key={`div-${index}`} />;
    case 'header':
      return <HeaderBlock key={`hdr-${index}`} block={block} />;
    case 'bullet':
      return <BulletBlock key={`blt-${index}`} block={block} />;
    case 'text':
      return <TextBlock key={`txt-${index}`} block={block} />;
    default:
      return null;
  }
}

function renderContent(content: string): React.ReactNode[] {
  const blocks = parseContentBlocks(content);
  return blocks.map((block, i) => renderBlock(block, i));
}

function ChipBadge({ chip }: { chip: MessageChip }) {
  const style = CHIP_STYLES[chip.type] || CHIP_STYLES['memory-saved'];
  return (
    <View style={[styles.chip, { backgroundColor: style.bg }]}>
      <Feather name={style.icon} size={11} color={style.color} />
      <Text style={[styles.chipText, { color: style.color }]}>{chip.label}</Text>
    </View>
  );
}

function SafetyBadge({ tier }: { tier: SafetyTier }) {
  const style = SAFETY_STYLES[tier];
  return (
    <View style={[styles.safetyBadge, { backgroundColor: style.bg }]}>
      <Feather name={style.icon} size={10} color={style.color} />
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
  const { acceptInsightToAction, saveInsightMemoryOnly } = useCoach();
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
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <View style={styles.suggestions}>
      {suggestions.slice(0, 3).map((s, i) => (
        <Pressable key={i} style={styles.suggestionPill} onPress={() => onTap(s)}>
          <Text style={styles.suggestionText} numberOfLines={1}>{s}</Text>
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

function StreamingContent({ content }: { content: string }) {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(6)).current;
  const prevBlockCount = useRef(0);
  const blockFades = useRef<RNAnimated.Value[]>([]);

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const blocks = parseContentBlocks(content);

  if (blocks.length > prevBlockCount.current) {
    for (let i = prevBlockCount.current; i < blocks.length; i++) {
      const val = new RNAnimated.Value(0);
      blockFades.current.push(val);
      RNAnimated.timing(val, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    prevBlockCount.current = blocks.length;
  }

  return (
    <RNAnimated.View style={[styles.aiContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {blocks.map((block, i) => {
        const blockOpacity = blockFades.current[i] || new RNAnimated.Value(1);
        return (
          <RNAnimated.View key={i} style={{ opacity: blockOpacity }}>
            {block.type === 'divider' ? (
              <BlockDivider />
            ) : block.type === 'header' ? (
              <HeaderBlock block={block} />
            ) : block.type === 'bullet' ? (
              <BulletBlock block={block} />
            ) : (
              <TextBlock block={block} />
            )}
          </RNAnimated.View>
        );
      })}
    </RNAnimated.View>
  );
}

function FadeInView({ delay = 0, duration = 300, children }: { delay?: number; duration?: number; children: React.ReactNode }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(8)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
        RNAnimated.timing(translateY, { toValue: 0, duration, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [opacity, translateY, delay, duration]);

  return (
    <RNAnimated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </RNAnimated.View>
  );
}

export function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const { sendMessage } = useCoach();
  const wasStreamingRef = useRef(message.isStreaming === true);
  const [justFinished, setJustFinished] = useState(false);

  useEffect(() => {
    if (wasStreamingRef.current && !message.isStreaming) {
      setJustFinished(true);
    }
    wasStreamingRef.current = message.isStreaming === true;
  }, [message.isStreaming]);

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

  const streaming = message.isStreaming === true;
  const animate = justFinished;

  return (
    <View style={styles.aiRow}>
      {message.chips && message.chips.length > 0 && (
        <View style={styles.chipsRow}>
          {message.chips.map((chip, i) => <ChipBadge key={i} chip={chip} />)}
        </View>
      )}

      <View style={styles.aiContent}>
        {streaming && message.content ? (
          <StreamingContent content={message.content} />
        ) : message.content ? (
          renderContent(message.content)
        ) : null}
      </View>

      {!streaming && message.safetyTier && (
        animate ? (
          <FadeInView delay={50} duration={250}>
            <SafetyBadge tier={message.safetyTier} />
          </FadeInView>
        ) : (
          <SafetyBadge tier={message.safetyTier} />
        )
      )}

      {!streaming && message.memoryProposal && (
        animate ? (
          <FadeInView delay={100} duration={300}>
            <MemoryProposalCard message={message} />
          </FadeInView>
        ) : (
          <MemoryProposalCard message={message} />
        )
      )}
      {!streaming && message.goalProposal && (
        animate ? (
          <FadeInView delay={100} duration={300}>
            <GoalProposalCard message={message} />
          </FadeInView>
        ) : (
          <GoalProposalCard message={message} />
        )
      )}
      {!streaming && message.insightToAction && (
        animate ? (
          <FadeInView delay={100} duration={300}>
            <InsightToActionCard message={message} />
          </FadeInView>
        ) : (
          <InsightToActionCard message={message} />
        )
      )}

      {!streaming && (
        animate ? (
          <FadeInView delay={200} duration={300}>
            <ActionFooter message={message} />
          </FadeInView>
        ) : (
          <ActionFooter message={message} />
        )
      )}

      {!streaming && isLatest && message.suggestions && (
        animate ? (
          <FadeInView delay={400} duration={350}>
            <SuggestionPills suggestions={message.suggestions} onTap={(s) => sendMessage(s)} />
          </FadeInView>
        ) : (
          <SuggestionPills suggestions={message.suggestions} onTap={(s) => sendMessage(s)} />
        )
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
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999,
  },
  chipText: { fontSize: 12, fontFamily: Fonts.medium, letterSpacing: 0.1 },
  aiContent: { gap: 8 },
  aiText: { fontSize: 16, color: Colors.contentPrimary, fontFamily: Fonts.regular, lineHeight: 20, paddingHorizontal: 4 },
  headerText: { fontSize: 18, fontFamily: Fonts.medium, letterSpacing: -0.2, lineHeight: 24 },
  bulletText: {},
  divider: {
    height: 0.75,
    backgroundColor: 'rgba(10,10,10,0.1)',
    marginVertical: 16,
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
  },
  actionBtn: { padding: 4 },
  actionIcon: { width: 20, height: 20 },
  actionIconWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  provenanceCard: {
    paddingHorizontal: 12, paddingVertical: 10,
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
