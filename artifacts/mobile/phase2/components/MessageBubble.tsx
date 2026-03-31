import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { Message } from '../constants/types';
import { useCoach } from '../context/CoachContext';

import { renderContent } from './chat/MarkdownRenderer';
import { ChipBadge, BOTTOM_CHIP_TYPES } from './chat/ChipBadge';
import { MemoryProposalCard, Member360ConflictCard, GoalProposalCard } from './chat/ProposalCards';
import { ActionFooter } from './chat/ActionFooter';
import { SuggestionPills } from './chat/SuggestionPills';
import { StreamingContent, AnimatedSlot } from './chat/AnimationWrappers';

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
  aiContent: { gap: 8 },
});
