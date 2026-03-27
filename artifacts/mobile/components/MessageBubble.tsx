import React, { useState, useEffect, useRef, useCallback, ComponentProps } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Animated as RNAnimated, Easing, Keyboard } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Svg, { Path, G } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import type { AppTheme } from '@/constants/theme';
import { Fonts } from '@/constants/fonts';
import { Message, MessageChip, SafetyTier } from '@/constants/types';
import { useCoach } from '@/context/CoachContext';
import { useToast } from '@/components/Toast';
import { FlipIcon } from '@/components/icons';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
type IconName = FeatherIconName | 'brain';

function BrainIcon({ size = 12, color = '#000', strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 18v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function AppIcon({ name, size = 12, color = '#000', style }: { name: IconName; size?: number; color?: string; style?: any }) {
  if (name === 'brain') return <BrainIcon size={size} color={color} strokeWidth={2} />;
  return <Feather name={name} size={size} color={color} style={style} />;
}

function getChipStyles(c: AppTheme): Record<string, { bg: string; color: string; icon: IconName }> {
  return {
    'memory-saved': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'brain' },
    'memory-updated': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'brain' },
    'conflict-resolved': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'user' },
    'goal-created': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'target' },
    'goal-progress': { bg: c.surfaceTint, color: c.contentPrimary, icon: 'target' },
    'goal-risk': { bg: c.dangerChipBg, color: c.dangerChipText, icon: 'alert-triangle' },
    'milestone': { bg: c.successBg, color: c.successDark, icon: 'star' },
    'handoff': { bg: c.infoBg, color: c.info, icon: 'arrow-up-right' },
    'alert': { bg: c.dangerChipBg, color: c.dangerChipText, icon: 'alert-triangle' },
  };
}

const BOTTOM_CHIP_TYPES = new Set(['memory-saved', 'memory-updated', 'conflict-resolved', 'goal-created']);

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

  const isNavigable = (chip.type === 'memory-saved' || chip.type === 'memory-updated' || chip.type === 'conflict-resolved');
  const hasMemoryIds = isNavigable && chip.memoryIds && chip.memoryIds.length > 0;

  const handlePress = () => {
    if (!hasMemoryIds) return;
    const ids = chip.memoryIds!;
    const anyAlive = memories.some(m => ids.includes(m.id) && m.status !== 'DELETED');
    if (anyAlive) {
      navigateToMemory(ids);
    } else {
      showToast({ message: 'This chat memory has been deleted.' });
    }
  };

  const animStyle = { opacity: fadeAnim, transform: [{ translateY: slideAnim }] };

  const chipContent = (
    <>
      <AppIcon name={style.icon} size={12} color={style.color} />
      <Text style={[styles.chipText, { color: style.color }]}>{chip.label}</Text>
      <Feather name="chevron-right" size={12} color={style.color} />
    </>
  );

  if (hasMemoryIds) {
    return (
      <RNAnimated.View style={animStyle}>
        <Pressable onPress={handlePress} style={[styles.chip, { backgroundColor: style.bg, borderColor: colors.surfaceEdgeLight }]}>
          {chipContent}
        </Pressable>
      </RNAnimated.View>
    );
  }

  return (
    <RNAnimated.View style={animStyle}>
      <View style={[styles.chip, { backgroundColor: style.bg, borderColor: colors.surfaceEdgeLight }]}>
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


function MorphingProposalCard({
  isExiting,
  confirmedLabel,
  finalIcon,
  memoryIds,
  children,
}: {
  isExiting: boolean;
  confirmedLabel: string;
  finalIcon: IconName;
  memoryIds?: string[];
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const { memories, navigateToMemory } = useCoach();
  const { showToast } = useToast();

  const collapse = useRef(new RNAnimated.Value(0)).current;
  const flipAnim = useRef(new RNAnimated.Value(0)).current;
  const labelSlide = useRef(new RNAnimated.Value(0)).current;
  const labelOpacity = useRef(new RNAnimated.Value(0)).current;
  const chevronOpacity = useRef(new RNAnimated.Value(0)).current;
  const [phase, setPhase] = useState<'pending' | 'morphing' | 'check' | 'done'>('pending');
  const prevExiting = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const allAnims = [collapse, flipAnim, labelSlide, labelOpacity, chevronOpacity];

  const frontRotateY = flipAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const backRotateY = flipAnim.interpolate({ inputRange: [0, 360], outputRange: ['180deg', '540deg'] });
  const frontFaceOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 269, 270, 360],
    outputRange: [1, 1, 0, 0, 1, 1],
  });
  const backFaceOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 269, 270, 360],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      allAnims.forEach(a => a.stopAnimation());
    };
  }, allAnims);

  useEffect(() => {
    if (isExiting && !prevExiting.current) {
      setPhase('morphing');

      RNAnimated.timing(collapse, {
        toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false,
      }).start(() => {
        if (!mountedRef.current) return;
        setPhase('check');

        timerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setPhase('done');
        }, 2000);
      });
    }
    prevExiting.current = isExiting;
  }, [isExiting, ...allAnims]);

  const handleChipPress = () => {
    if (!memoryIds || memoryIds.length === 0) return;
    const anyAlive = memories.some(m => memoryIds.includes(m.id) && m.status !== 'DELETED');
    if (anyAlive) {
      navigateToMemory(memoryIds);
    } else {
      showToast({ message: 'This chat memory has been deleted.' });
    }
  };

  if (phase === 'pending') {
    return (
      <View style={[styles.proposalCard, { backgroundColor: colors.surfaceTint, borderColor: colors.surfaceEdgeLight }]}>
        {children}
      </View>
    );
  }

  const paddingH = collapse.interpolate({ inputRange: [0, 1], outputRange: [12, 10] });
  const paddingV = collapse.interpolate({ inputRange: [0, 1], outputRange: [12, 6] });
  const contentOpacity = collapse.interpolate({ inputRange: [0, 0.25], outputRange: [1, 0], extrapolate: 'clamp' });
  const contentMaxH = collapse.interpolate({ inputRange: [0, 0.6, 1], outputRange: [200, 40, 0] });
  const contentMaxW = collapse.interpolate({ inputRange: [0, 1], outputRange: [500, 0] });

  const isDone = phase === 'done';
  const showStaticChip = phase === 'check' || phase === 'done';

  const chipRow = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 14, height: 14, justifyContent: 'center', alignItems: 'center' }}>
        {showStaticChip ? (
          <AppIcon name={finalIcon} size={12} color={colors.contentPrimary} />
        ) : (
          <>
            <RNAnimated.View style={{
              position: 'absolute',
              opacity: frontFaceOpacity,
              transform: [{ perspective: 400 }, { rotateY: frontRotateY }],
            }}>
              <AppIcon name={finalIcon} size={12} color={colors.contentPrimary} />
            </RNAnimated.View>
            <RNAnimated.View style={{
              position: 'absolute',
              opacity: backFaceOpacity,
              transform: [{ perspective: 400 }, { rotateY: backRotateY }],
            }}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M20 6L9 17L4 12" stroke={colors.contentPrimary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </RNAnimated.View>
          </>
        )}
      </View>
      {showStaticChip ? (
        <Text style={[styles.chipText, { color: colors.contentPrimary }]}>
          {confirmedLabel}
        </Text>
      ) : (
        <RNAnimated.View style={{ opacity: labelOpacity }}>
          <Text style={[styles.chipText, { color: colors.contentPrimary }]}>
            {confirmedLabel}
          </Text>
        </RNAnimated.View>
      )}
      {showStaticChip ? (
        memoryIds && memoryIds.length > 0 ? (
          <Feather name="chevron-right" size={12} color={colors.contentPrimary} />
        ) : null
      ) : (
        <RNAnimated.View style={{ opacity: chevronOpacity }}>
          <Feather name="chevron-right" size={12} color={colors.contentPrimary} />
        </RNAnimated.View>
      )}
    </View>
  );

  const morphCard = (
    <RNAnimated.View style={[
      styles.morphCard,
      {
        backgroundColor: colors.surfaceTint,
        borderColor: colors.surfaceEdgeLight,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
      },
    ]}>
      {phase === 'morphing' && (
        <RNAnimated.View style={{
          opacity: contentOpacity,
          maxHeight: contentMaxH,
          maxWidth: contentMaxW,
          overflow: 'hidden',
        }}>
          {children}
        </RNAnimated.View>
      )}
      {chipRow}
    </RNAnimated.View>
  );

  if (phase === 'done' && memoryIds && memoryIds.length > 0) {
    return (
      <Pressable onPress={handleChipPress}>
        {morphCard}
      </Pressable>
    );
  }

  return morphCard;
}

function MemoryProposalCard({ message }: { message: Message }) {
  const { confirmMemory, dismissMemoryProposal } = useCoach();
  const { colors } = useTheme();
  const proposal = message.memoryProposal;
  if (!proposal) return null;

  const isConfirmed = proposal.confirmed === true;
  const isDismissed = proposal.dismissed === true;
  const isExiting = isConfirmed || isDismissed;
  const exitLabel = isConfirmed ? 'Saved to chat memory' : 'Skipped';

  return (
    <MorphingProposalCard
      isExiting={isExiting}
      confirmedLabel={exitLabel}
      finalIcon="brain"
      memoryIds={proposal.confirmedMemoryId ? [proposal.confirmedMemoryId] : undefined}
    >
      <View style={styles.proposalHeader}>
        <View style={styles.proposalIcon}><BrainIcon size={12} color={colors.contentPrimary} /></View>
        <Text style={[styles.proposalText, { color: colors.contentPrimary }]}>
          Want me to remember: <Text style={styles.proposalQuote}>"{proposal.content}"</Text>?
        </Text>
      </View>
      <View style={styles.proposalButtonsIndented}>
        <Pressable style={[styles.confirmBtn, { backgroundColor: colors.contentPrimary }]} onPress={() => confirmMemory(message.id)} disabled={isExiting}>
          <Text style={[styles.confirmBtnText, { color: colors.contentPrimaryInverse }]}>Remember</Text>
        </Pressable>
        <Pressable style={[styles.dismissBtn, { borderColor: colors.surfaceEdge }]} onPress={() => dismissMemoryProposal(message.id)} disabled={isExiting}>
          <Text style={[styles.dismissBtnText, { color: colors.contentSecondary }]}>Not now</Text>
        </Pressable>
      </View>
    </MorphingProposalCard>
  );
}

function Member360ConflictCard({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { resolveMember360Conflict } = useCoach();
  const conflict = message.member360Conflict;
  if (!conflict) return null;

  const isResolved = !!conflict.resolved;
  const resolvedLabel = conflict.resolved === 'user' ? 'Profile updated' : 'Skipped';

  return (
    <MorphingProposalCard
      isExiting={isResolved}
      confirmedLabel={resolvedLabel}
      finalIcon="user"
      memoryIds={conflict.resolvedMemoryId ? [conflict.resolvedMemoryId] : undefined}
    >
      <View style={styles.proposalHeader}>
        <Feather name="user" size={12} color={colors.contentPrimary} style={styles.proposalIcon} />
        <Text style={[styles.proposalText, { color: colors.contentPrimary }]}>
          Update your profile to <Text style={styles.proposalQuote}>"{conflict.userValue}"</Text>?
        </Text>
      </View>
      <View style={styles.proposalButtonsIndented}>
        <Pressable
          style={[styles.confirmBtn, { backgroundColor: colors.contentPrimary }]}
          onPress={() => resolveMember360Conflict(message.id, 'user')}
          disabled={isResolved}
        >
          <Text style={[styles.confirmBtnText, { color: colors.contentPrimaryInverse }]}>Update</Text>
        </Pressable>
        <Pressable
          style={[styles.dismissBtn, { borderColor: colors.surfaceEdge }]}
          onPress={() => resolveMember360Conflict(message.id, 'profile')}
          disabled={isResolved}
        >
          <Text style={[styles.dismissBtnText, { color: colors.contentSecondary }]}>Not now</Text>
        </Pressable>
      </View>
    </MorphingProposalCard>
  );
}

function GoalProposalCard({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { confirmGoal, dismissGoalProposal } = useCoach();
  const proposal = message.goalProposal;
  if (!proposal) return null;

  const isConfirmed = proposal.confirmed === true;
  const isDismissed = proposal.dismissed === true;
  const isExiting = isConfirmed || isDismissed;
  const exitLabel = isConfirmed ? 'Goal created' : 'Skipped';
  const monthStr = proposal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const showApproval = message.safetyTier === 'actionable';

  return (
    <MorphingProposalCard
      isExiting={isExiting}
      confirmedLabel={exitLabel}
      finalIcon="target"
    >
      <View style={styles.proposalHeader}>
        <Feather name="target" size={12} color={colors.contentSecondary} style={styles.proposalIcon} />
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
        <Pressable style={[styles.confirmBtn, { backgroundColor: colors.contentPrimary }]} onPress={() => confirmGoal(message.id)} disabled={isExiting}>
          <Text style={[styles.confirmBtnText, { color: colors.contentPrimaryInverse }]}>Set up goal</Text>
        </Pressable>
        <Pressable style={[styles.dismissBtn, { borderColor: colors.surfaceEdge }]} onPress={() => dismissGoalProposal(message.id)} disabled={isExiting}>
          <Text style={[styles.dismissBtnText, { color: colors.contentSecondary }]}>Just chatting</Text>
        </Pressable>
      </View>
    </MorphingProposalCard>
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

function CopyIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G transform="translate(3, 3)">
        <Path
          d="M3.125 10.625H8.125C9.50571 10.625 10.625 9.50571 10.625 8.125V3.125C10.625 1.74429 9.50571 0.625 8.125 0.625H3.125C1.74429 0.625 0.625 1.74429 0.625 3.125V8.125C0.625 9.50571 1.74429 10.625 3.125 10.625Z"
          stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round"
        />
      </G>
      <G transform="translate(8, 8)">
        <Path
          d="M0.625 9.16667H6.66667C8.04738 9.16667 9.16667 8.04738 9.16667 6.66667V0.625"
          stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

function ThumbUpIcon({ size = 20, color, filled }: { size?: number; color: string; filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G transform="translate(2.5, 8.33)">
        <Path
          d={filled
            ? "M0.625 9.79167V0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625Z"
            : "M0.625 0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625"}
          stroke={color} strokeWidth={1.25} strokeLinejoin="round"
          strokeLinecap={filled ? undefined : "round"}
          fill={filled ? color : 'none'}
        />
      </G>
      <G transform="translate(7.5, 3.33)">
        <Path
          d="M0.625 6.83183V12.2917C0.625 13.2121 1.37118 13.9583 2.29165 13.9583L6.73975 13.9584C7.81584 13.9584 8.77119 13.2698 9.11148 12.2489L10.533 7.98428C10.5939 7.80151 10.625 7.61012 10.625 7.41746C10.625 6.42751 9.82249 5.625 8.83254 5.625H6.8093C5.99609 5.625 5.39939 4.86076 5.59663 4.07183L6.16235 1.80894C6.31269 1.20756 5.85785 0.625 5.23795 0.625C4.95517 0.625 4.68699 0.750606 4.50596 0.967847L1.3976 4.69789C0.898387 5.29694 0.625 6.05204 0.625 6.83183Z"
          stroke={color} strokeWidth={1.25}
          fill={filled ? color : 'none'}
        />
      </G>
    </Svg>
  );
}

function ThumbDownIcon({ size = 20, color, filled }: { size?: number; color: string; filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G transform="rotate(180, 10, 10)">
        <G transform="translate(2.5, 8.33)">
          <Path
            d={filled
              ? "M0.625 9.79167V0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625Z"
              : "M0.625 0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625"}
            stroke={color} strokeWidth={1.25} strokeLinejoin="round"
            strokeLinecap={filled ? undefined : "round"}
            fill={filled ? color : 'none'}
          />
        </G>
        <G transform="translate(7.5, 3.33)">
          <Path
            d="M0.625 6.83183V12.2917C0.625 13.2121 1.37118 13.9583 2.29165 13.9583L6.73975 13.9584C7.81584 13.9584 8.77119 13.2698 9.11148 12.2489L10.533 7.98428C10.5939 7.80151 10.625 7.61012 10.625 7.41746C10.625 6.42751 9.82249 5.625 8.83254 5.625H6.8093C5.99609 5.625 5.39939 4.86076 5.59663 4.07183L6.16235 1.80894C6.31269 1.20756 5.85785 0.625 5.23795 0.625C4.95517 0.625 4.68699 0.750606 4.50596 0.967847L1.3976 4.69789C0.898387 5.29694 0.625 6.05204 0.625 6.83183Z"
            stroke={color} strokeWidth={1.25}
            fill={filled ? color : 'none'}
          />
        </G>
      </G>
    </Svg>
  );
}

function ReactionButton({
  active,
  onToggle,
  icon: IconComponent,
  tintColor,
  tiltDeg = 0,
}: {
  active: boolean;
  onToggle: () => void;
  icon: React.ComponentType<{ size?: number; color: string; filled: boolean }>;
  tintColor: string;
  tiltDeg?: number;
}) {
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const rotateAnim = useRef(new RNAnimated.Value(0)).current;
  const prevActive = useRef(active);

  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;

    if (active) {
      scaleAnim.setValue(0.5);
      rotateAnim.setValue(0);
      RNAnimated.parallel([
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 300,
          useNativeDriver: true,
        }),
        RNAnimated.sequence([
          RNAnimated.timing(rotateAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          RNAnimated.spring(rotateAnim, {
            toValue: 0,
            friction: 5,
            tension: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      RNAnimated.sequence([
        RNAnimated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 80,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active, scaleAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${tiltDeg}deg`],
  });

  return (
    <Pressable style={styles.actionBtn} onPress={onToggle}>
      <RNAnimated.View style={{ transform: [{ scale: scaleAnim }, { rotate }] }}>
        <IconComponent size={20} color={tintColor} filled={active} />
      </RNAnimated.View>
    </Pressable>
  );
}

function CopyButton({ color, text }: { color: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Pressable style={styles.actionBtn} onPress={handleCopy}>
      <FlipIcon
        front={<CopyIcon size={20} color={color} />}
        back={
          <View style={styles.actionIconWrap}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        }
        flipped={copied}
        size={20}
        duration={350}
      />
    </Pressable>
  );
}

function ActionFooter({ message }: { message: Message }) {
  const { colors } = useTheme();
  const [thumbUp, setThumbUp] = useState(false);
  const [thumbDown, setThumbDown] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);

  return (
    <View>
      <View style={styles.actionRow}>
        <CopyButton color={colors.contentBone600} text={message.content || ''} />
        <ReactionButton
          active={thumbUp}
          onToggle={() => { setThumbUp(!thumbUp); if (thumbDown) setThumbDown(false); }}
          icon={ThumbUpIcon}
          tintColor={colors.contentBone600}
          tiltDeg={-12}
        />
        <ReactionButton
          active={thumbDown}
          onToggle={() => { setThumbDown(!thumbDown); if (thumbUp) setThumbUp(false); }}
          icon={ThumbDownIcon}
          tintColor={colors.contentBone600}
          tiltDeg={12}
        />
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

function AnimatedSlot({ animate, delay = 100, duration = 300, soft = false, children }: {
  animate: boolean; delay?: number; duration?: number; soft?: boolean; children: React.ReactNode;
}) {
  if (!animate) return <>{children}</>;
  return soft
    ? <SoftReveal delay={delay}>{children}</SoftReveal>
    : <FadeInView delay={delay} duration={duration}>{children}</FadeInView>;
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

  const allChips = message.chips ?? [];
  const topChips = allChips.filter(c => !BOTTOM_CHIP_TYPES.has(c.type));
  const bottomChips = allChips.filter(c => BOTTOM_CHIP_TYPES.has(c.type));

  const showSafety = !streaming && message.safetyTier && !(
    message.safetyTier === 'actionable' && message.goalProposal
  );

  return (
    <View style={styles.aiRow}>
      {topChips.length > 0 && (
        <View style={styles.chipsRow}>
          {topChips.map((chip, i) => <ChipBadge key={i} chip={chip} animate={chipAnimate} />)}
        </View>
      )}

      <View style={styles.aiContent}>
        {streaming && message.content ? (
          <StreamingContent content={message.content} />
        ) : message.content ? (
          renderContent(message.content)
        ) : null}
      </View>

      {showSafety && (
        <AnimatedSlot animate={animate} delay={50} duration={250}>
          <SafetyBadge tier={message.safetyTier!} />
        </AnimatedSlot>
      )}

      {!streaming && message.memoryProposal && (
        <AnimatedSlot animate={animate}>
          <MemoryProposalCard message={message} />
        </AnimatedSlot>
      )}
      {!streaming && message.member360Conflict && (
        <AnimatedSlot animate={animate}>
          <Member360ConflictCard message={message} />
        </AnimatedSlot>
      )}
      {!streaming && message.goalProposal && (
        <AnimatedSlot animate={animate}>
          <GoalProposalCard message={message} />
        </AnimatedSlot>
      )}
      {bottomChips.length > 0 && !streaming && (
        <View style={styles.chipsRow}>
          {bottomChips.map((chip, i) => <ChipBadge key={`bottom-${i}`} chip={chip} animate={chipAnimate} />)}
        </View>
      )}

      {!streaming && (
        <ActionFooter message={message} />
      )}

      {!streaming && isLatest && message.suggestions && (
        <AnimatedSlot animate={animate} delay={200} duration={350}>
          <SuggestionPills suggestions={message.suggestions} onTap={(s) => sendMessage(s)} />
        </AnimatedSlot>
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
  systemText: { fontSize: 14, fontFamily: Fonts.medium, lineHeight: 20 },
  userRow: { alignItems: 'flex-end', paddingLeft: 60 },
  userBubble: {
    borderRadius: 24, paddingTop: 11, paddingBottom: 12,
    paddingHorizontal: 16, maxWidth: 298,
  },
  userText: { fontSize: 16, fontFamily: Fonts.regular, lineHeight: 20 },
  aiRow: { gap: 16, marginTop: 4 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 0.75,
  },
  chipText: { fontSize: 12, fontFamily: Fonts.medium, lineHeight: 16, letterSpacing: 0.1 },
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
    borderWidth: 0.75, borderRadius: 16, padding: 12,
  },
  morphCard: {
    borderWidth: 0.75, borderRadius: 16, alignSelf: 'flex-start',
  },
  proposalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 10 },
  proposalIcon: { marginTop: 2 },
  proposalContentWrap: { flex: 1 },
  proposalText: { fontSize: 12, fontFamily: Fonts.medium, lineHeight: 16, letterSpacing: 0.1, flex: 1 },
  proposalQuote: { fontFamily: Fonts.regular },
  proposalDetail: { fontSize: 12, fontFamily: Fonts.regular, marginTop: 2, lineHeight: 16 },
  proposalButtons: { flexDirection: 'row', gap: 8 },
  proposalButtonsIndented: { flexDirection: 'row', gap: 8, marginLeft: 18 },
  confirmBtn: {
    borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  confirmBtnText: { fontSize: 12, fontFamily: Fonts.medium },
  dismissBtn: {
    borderWidth: 0.75, borderRadius: 9999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  dismissBtnText: { fontSize: 12, fontFamily: Fonts.medium },
  approvalHint: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 8, marginBottom: 4, paddingLeft: 2,
  },
  approvalHintText: {
    fontSize: 12, fontFamily: Fonts.medium, lineHeight: 16,
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
