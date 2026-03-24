import React, { useState, useEffect, useRef, ComponentProps } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Animated as RNAnimated, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import type { AppTheme } from '@/constants/theme';
import { Fonts } from '@/constants/fonts';
import { Message, MessageChip, SafetyTier } from '@/constants/types';
import { useCoach } from '@/context/CoachContext';
import { useToast } from '@/components/Toast';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

function getChipStyles(c: AppTheme): Record<string, { bg: string; color: string; icon: FeatherIconName }> {
  return {
    'memory-saved': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'cpu' },
    'memory-updated': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'cpu' },
    'goal-progress': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'target' },
    'goal-risk': { bg: c.dangerChipBg, color: c.dangerChipText, icon: 'alert-triangle' },
    'milestone': { bg: c.successBg, color: c.successDark, icon: 'star' },
    'handoff': { bg: c.infoBg, color: c.info, icon: 'arrow-up-right' },
    'alert': { bg: c.dangerChipBg, color: c.dangerChipText, icon: 'alert-triangle' },
  };
}

function getSafetyStyles(c: AppTheme): Record<SafetyTier, { bg: string; color: string; icon: FeatherIconName; text: string }> {
  return {
    informational: { bg: c.surfaceMuted, color: c.contentSecondary, icon: 'shield', text: 'Informational' },
    suggestive: { bg: c.surfaceMuted, color: c.contentSecondary, icon: 'shield', text: 'Suggestion' },
    actionable: { bg: c.warningBg, color: c.warning, icon: 'shield', text: 'Actionable — needs your approval' },
    handoff: { bg: c.infoBg, color: c.info, icon: 'arrow-up-right', text: 'Complex — human advisor recommended' },
  };
}

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
  const isStandaloneBold = /^\*\*[^*]+\*\*[:\s]*$/.test(effective);

  const isBullet = effective.startsWith('•') || effective.startsWith('- ') || effective === '-' || /^\*\s+/.test(effective);

  let promotedHeader = false;
  if (!isStandaloneBold && isBullet) {
    const stripped = effective.replace(/^[•\-\*]\s*/, '');
    if (/^\*\*[^*]+\*\*[:\s]*$/.test(stripped)) {
      promotedHeader = true;
    }
  }

  const isHeader = isStandaloneBold || promotedHeader;
  const isList = !isHeader && (isBullet || isNumbered);

  let displayText = effective;
  if (promotedHeader) {
    displayText = effective.replace(/^[•\-\*]\s*/, '');
  }
  if (isList && /^\*\s+/.test(displayText)) {
    displayText = '• ' + displayText.replace(/^\*\s+/, '');
  }

  return { isHeader, isList, isRule: false, displayText };
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

    const normalized = normalizeLine(rawLine.replace(/^\s+/, ''));

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

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'bullet' && /^\*\*[^*]+\*\*[:\s]*$/.test(b.text.replace(/^•\s*/, ''))) {
      const headerText = b.text.replace(/^•\s*/, '');
      const hasNonHeaderContent = blocks.slice(0, i).some(bl => bl.type !== 'header' && bl.type !== 'divider');
      if (hasNonHeaderContent) {
        blocks.splice(i, 1, { type: 'divider' }, { type: 'header', text: headerText });
        i++;
      } else {
        blocks[i] = { type: 'header', text: headerText };
      }
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type !== 'header') continue;
    let next = i + 1;
    while (next < blocks.length && blocks[next].type === 'divider') next++;
    if (next < blocks.length && blocks[next].type === 'header') {
      const headerBlock = blocks[i] as { type: 'header'; text: string };
      blocks[i] = { type: 'text', text: headerBlock.text, paragraphGap: false };
      if (next === i + 2 && blocks[i + 1].type === 'divider') {
        blocks.splice(i + 1, 1);
      }
    }
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
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.surfaceEdge }]} />;
}

function TextBlock({ block }: { block: Extract<ContentBlock, { type: 'text' }> }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.aiText, { color: colors.contentPrimary }, block.paragraphGap && { marginTop: 8 }]}>
      {formatInlineStyles(block.text)}
    </Text>
  );
}

function BulletBlock({ block }: { block: Extract<ContentBlock, { type: 'bullet' }> }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.aiText, styles.bulletText, { color: colors.contentPrimary }, block.paragraphGap && { marginTop: 8 }]}>
      {formatInlineStyles(block.text)}
    </Text>
  );
}

function HeaderBlock({ block }: { block: Extract<ContentBlock, { type: 'header' }> }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.aiText, styles.headerText, { color: colors.contentPrimary }]}>
      {formatInlineStyles(block.text)}
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

function ChipBadge({ chip, animate = true }: { chip: MessageChip; animate?: boolean }) {
  const { colors } = useTheme();
  const chipStyles = getChipStyles(colors);
  const style = chipStyles[chip.type] || chipStyles['memory-saved'];
  const { memories, navigateToMemory } = useCoach();
  const { showToast } = useToast();

  const fadeAnim = useRef(new RNAnimated.Value(animate ? 0 : 1)).current;
  const slideAnim = useRef(new RNAnimated.Value(animate ? 6 : 0)).current;

  useEffect(() => {
    if (!animate) return;
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 350, delay: 100, useNativeDriver: true }),
      RNAnimated.spring(slideAnim, { toValue: 0, tension: 120, friction: 8, delay: 100, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, animate]);

  const isMemoryChip = chip.type === 'memory-saved' || chip.type === 'memory-updated';
  const hasMemoryIds = isMemoryChip && chip.memoryIds && chip.memoryIds.length > 0;

  const handlePress = () => {
    if (!hasMemoryIds) return;
    const ids = chip.memoryIds!;
    const anyAlive = memories.some(m => ids.includes(m.id) && m.status !== 'DELETED');
    if (anyAlive) {
      navigateToMemory(ids);
    } else {
      showToast({ message: 'This memory has been deleted.' });
    }
  };

  const animStyle = { opacity: fadeAnim, transform: [{ translateY: slideAnim }] };

  const chipContent = (
    <>
      <Feather name={style.icon} size={11} color={style.color} />
      <Text style={[styles.chipText, { color: style.color }]}>{chip.label}</Text>
      <Feather name="chevron-right" size={12} color={style.color} />
    </>
  );

  if (hasMemoryIds) {
    return (
      <RNAnimated.View style={animStyle}>
        <Pressable onPress={handlePress} style={[styles.chip, { backgroundColor: style.bg }]}>
          {chipContent}
        </Pressable>
      </RNAnimated.View>
    );
  }

  return (
    <RNAnimated.View style={animStyle}>
      <View style={[styles.chip, { backgroundColor: style.bg }]}>
        {chipContent}
      </View>
    </RNAnimated.View>
  );
}

function SafetyBadge({ tier }: { tier: SafetyTier }) {
  const { colors } = useTheme();
  const safetyStyles = getSafetyStyles(colors);
  const style = safetyStyles[tier];
  return (
    <View style={[styles.safetyBadge, { backgroundColor: style.bg }]}>
      <Feather name={style.icon} size={10} color={style.color} />
      <Text style={[styles.safetyText, { color: style.color }]}>{style.text}</Text>
    </View>
  );
}

function MemoryProposalCard({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { confirmMemory, dismissMemoryProposal } = useCoach();
  const proposal = message.memoryProposal;
  if (!proposal) return null;

  if (proposal.confirmed) {
    return (
      <View style={[styles.proposalCard, styles.confirmedCard, { backgroundColor: colors.surfaceTint, borderColor: colors.surfaceEdgeLight }]}>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path d="M20 6L9 17L4 12" stroke={colors.contentBone600} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={[styles.confirmedText, { color: colors.contentSecondary }]}>Saved to memory</Text>
      </View>
    );
  }

  return (
    <View style={[styles.proposalCard, { backgroundColor: colors.surfaceTint, borderColor: colors.surfaceEdgeLight }]}>
      <View style={styles.proposalHeader}>
        <Feather name="cpu" size={14} color={colors.contentSecondary} style={styles.proposalIcon} />
        <Text style={[styles.proposalText, { color: colors.contentPrimary }]}>
          Want me to remember: <Text style={styles.proposalQuote}>"{proposal.content}"</Text>?
        </Text>
      </View>
      <View style={styles.proposalButtonsIndented}>
        <Pressable style={[styles.confirmBtn, { backgroundColor: colors.contentPrimary }]} onPress={() => confirmMemory(message.id)}>
          <Text style={[styles.confirmBtnText, { color: colors.contentPrimaryInverse }]}>Remember</Text>
        </Pressable>
        <Pressable style={[styles.dismissBtn, { borderColor: colors.surfaceEdge }]} onPress={() => dismissMemoryProposal(message.id)}>
          <Text style={[styles.dismissBtnText, { color: colors.contentSecondary }]}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}

function GoalProposalCard({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { confirmGoal, dismissGoalProposal } = useCoach();
  const proposal = message.goalProposal;
  if (!proposal) return null;

  if (proposal.confirmed) {
    return (
      <View style={[styles.proposalCard, styles.confirmedCard, { backgroundColor: colors.surfaceTint, borderColor: colors.surfaceEdgeLight }]}>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path d="M20 6L9 17L4 12" stroke={colors.contentBone600} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={[styles.confirmedTextPrimary, { color: colors.contentPrimary }]}>Goal created — check your goals panel</Text>
      </View>
    );
  }

  const monthStr = proposal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const showApproval = message.safetyTier === 'actionable';
  return (
    <View style={[styles.proposalCard, { backgroundColor: colors.surfaceTint, borderColor: colors.surfaceEdgeLight }]}>
      <View style={styles.proposalHeader}>
        <Feather name="target" size={14} color={colors.contentSecondary} style={styles.proposalIcon} />
        <View style={styles.proposalContentWrap}>
          <Text style={[styles.proposalText, { color: colors.contentPrimary }]}>{proposal.title}</Text>
          <Text style={[styles.proposalDetail, { color: colors.contentSecondary }]}>
            Target: ${proposal.targetAmount.toLocaleString()} · ${proposal.monthlyContribution}/mo · {monthStr} · Linked: {proposal.linkedAccount}
          </Text>
        </View>
      </View>
      {showApproval && (
        <View style={styles.approvalHint}>
          <Feather name="shield" size={10} color={colors.contentSecondary} />
          <Text style={[styles.approvalHintText, { color: colors.contentSecondary }]}>Needs your approval</Text>
        </View>
      )}
      <View style={styles.proposalButtons}>
        <Pressable style={[styles.confirmBtn, { backgroundColor: colors.contentPrimary }]} onPress={() => confirmGoal(message.id)}>
          <Text style={[styles.confirmBtnText, { color: colors.contentPrimaryInverse }]}>Set up goal</Text>
        </Pressable>
        <Pressable style={[styles.dismissBtn, { borderColor: colors.surfaceEdge }]} onPress={() => dismissGoalProposal(message.id)}>
          <Text style={[styles.dismissBtnText, { color: colors.contentSecondary }]}>Just chatting</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SuggestionPills({ suggestions, onTap }: { suggestions: string[]; onTap: (s: string) => void }) {
  const { colors } = useTheme();
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <View style={styles.suggestions}>
      {suggestions.slice(0, 3).map((s, i) => (
        <Pressable key={i} style={[styles.suggestionPill, { borderColor: colors.contentBone600 }]} onPress={() => { Keyboard.dismiss(); onTap(s); }}>
          <Text style={[styles.suggestionText, { color: colors.contentPrimary }]} numberOfLines={1}>{s}</Text>
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
  const { colors } = useTheme();
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
                <Path d="M20 6L9 17L4 12" stroke={colors.contentBone600} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          ) : (
            <Image source={iconCopy} style={[styles.actionIcon, { tintColor: colors.contentBone600 }]} />
          )}
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setThumbUp(!thumbUp)}>
          <Image source={thumbUp ? iconThumbsUpFilled : iconThumbsUp} style={[styles.actionIcon, { tintColor: colors.contentBone600 }]} />
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => setThumbDown(!thumbDown)}>
          <Image source={thumbDown ? iconThumbsDownFilled : iconThumbsDown} style={[styles.actionIcon, { tintColor: colors.contentBone600 }]} />
        </Pressable>
        {message.provenance && (
          <Pressable style={[styles.actionBtn, { marginLeft: 4, flexDirection: 'row', gap: 4 }]} onPress={() => setShowProvenance(!showProvenance)}>
            <Text style={{ fontSize: 12, color: colors.contentSecondary, fontFamily: Fonts.regular }}>Why this?</Text>
            <Feather name={showProvenance ? 'chevron-up' : 'chevron-down'} size={12} color={colors.contentSecondary} />
          </Pressable>
        )}
      </View>
      {showProvenance && message.provenance && (
        <View style={[styles.provenanceCard, { backgroundColor: colors.surfaceTint }]}>
          <Text style={[styles.provenanceText, { color: colors.contentSecondary }]}>{message.provenance}</Text>
        </View>
      )}
    </View>
  );
}

function StreamingContent({ content }: { content: string }) {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(6)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      RNAnimated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const blocks = parseContentBlocks(content);

  return (
    <RNAnimated.View style={[styles.aiContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {blocks.map((block, i) => renderBlock(block, i))}
    </RNAnimated.View>
  );
}

function SoftReveal({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.spring(opacity, { toValue: 1, tension: 60, friction: 12, useNativeDriver: true }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [opacity, delay]);

  return (
    <RNAnimated.View style={{ opacity }}>
      {children}
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
  const { colors } = useTheme();
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
        <View style={[styles.systemPill, { backgroundColor: colors.surfaceTint }, message.isProactive && { backgroundColor: colors.contentPrimary }]}>
          {message.isProactive && <Feather name="star" size={13} color={colors.contentPrimaryInverse} />}
          <Text style={[styles.systemText, { color: colors.contentSecondary }, message.isProactive && { color: colors.contentPrimaryInverse }]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={[styles.userBubble, { backgroundColor: colors.contentBone600 }]}>
          <Text style={[styles.userText, { color: colors.contentPrimaryInverse }]}>{message.content}</Text>
        </View>
      </View>
    );
  }

  const streaming = message.isStreaming === true;
  const animate = justFinished;
  const chipAnimate = streaming || justFinished;

  return (
    <View style={styles.aiRow}>
      {message.chips && message.chips.length > 0 && (
        <View style={styles.chipsRow}>
          {message.chips.map((chip, i) => <ChipBadge key={i} chip={chip} animate={chipAnimate} />)}
        </View>
      )}

      <View style={styles.aiContent}>
        {streaming && message.content ? (
          <StreamingContent content={message.content} />
        ) : message.content ? (
          renderContent(message.content)
        ) : null}
      </View>

      {!streaming && message.safetyTier && !(
        message.safetyTier === 'actionable' && message.goalProposal
      ) && (
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
      {!streaming && (
        animate ? (
          <SoftReveal delay={200}>
            <ActionFooter message={message} />
          </SoftReveal>
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
  },
  systemText: { fontSize: 13, fontFamily: Fonts.medium, lineHeight: 18 },
  userRow: { alignItems: 'flex-end', paddingLeft: 60 },
  userBubble: {
    borderRadius: 24, paddingTop: 11, paddingBottom: 12,
    paddingHorizontal: 16, maxWidth: 298,
  },
  userText: { fontSize: 16, fontFamily: Fonts.regular, lineHeight: 20 },
  aiRow: { gap: 16 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999,
  },
  chipText: { fontSize: 12, fontFamily: Fonts.medium, letterSpacing: 0.1 },
  aiContent: { gap: 8 },
  aiText: { fontSize: 16, fontFamily: Fonts.regular, lineHeight: 20, paddingHorizontal: 4 },
  headerText: { fontSize: 18, fontFamily: Fonts.medium, letterSpacing: -0.2, lineHeight: 24 },
  bulletText: {},
  divider: {
    height: 0.75,
    marginVertical: 16,
  },
  safetyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
    alignSelf: 'flex-start', marginLeft: 4,
  },
  safetyText: { fontSize: 10, fontFamily: Fonts.medium, lineHeight: 12 },
  proposalCard: {
    borderWidth: 1, borderRadius: 16, padding: 12,
  },
  confirmedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  confirmedText: { fontSize: 13, fontFamily: Fonts.medium, lineHeight: 18 },
  confirmedTextPrimary: { fontSize: 13, fontFamily: Fonts.medium, lineHeight: 18 },
  proposalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  proposalIcon: { marginTop: 2 },
  proposalContentWrap: { flex: 1 },
  proposalText: { fontSize: 13, fontFamily: Fonts.medium, lineHeight: 18, flex: 1 },
  proposalQuote: { fontFamily: Fonts.regular },
  proposalDetail: { fontSize: 12, fontFamily: Fonts.regular, marginTop: 2, lineHeight: 16 },
  proposalButtons: { flexDirection: 'row', gap: 8 },
  proposalButtonsIndented: { flexDirection: 'row', gap: 8, marginLeft: 22 },
  confirmBtn: {
    borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  confirmBtnText: { fontSize: 12, fontFamily: Fonts.medium },
  dismissBtn: {
    borderWidth: 1, borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  dismissBtnText: { fontSize: 12, fontFamily: Fonts.medium },
  approvalHint: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 8, marginBottom: 4, paddingLeft: 2,
  },
  approvalHintText: {
    fontSize: 11, fontFamily: Fonts.medium, lineHeight: 14,
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  actionBtn: { padding: 4 },
  actionIcon: { width: 20, height: 20 },
  actionIconWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  provenanceCard: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 16, marginTop: 4,
  },
  provenanceText: { fontSize: 12, lineHeight: 16, fontFamily: Fonts.regular },
  suggestions: {
    alignItems: 'flex-end', gap: 8,
  },
  suggestionPill: {
    borderWidth: 0.75,
    borderRadius: 24, paddingTop: 11, paddingBottom: 12, paddingHorizontal: 16,
  },
  suggestionText: { fontSize: 16, fontFamily: Fonts.regular, lineHeight: 20 },
});
