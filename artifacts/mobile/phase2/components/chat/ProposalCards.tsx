import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';
import { Message } from '../../constants/types';
import { useCoach } from '../../context/CoachContext';
import { MorphingProposalCard } from './MorphingProposalCard';

export function MemoryProposalCard({ message }: { message: Message }) {
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
      finalIcon="bookmark"
      memoryIds={proposal.confirmedMemoryId ? [proposal.confirmedMemoryId] : undefined}
    >
      <View style={styles.proposalHeader}>
        <View style={styles.proposalIcon}><Feather name="bookmark" size={12} color={colors.contentPrimary} /></View>
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

export function Member360ConflictCard({ message }: { message: Message }) {
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

export function GoalProposalCard({ message }: { message: Message }) {
  const { colors } = useTheme();
  const { confirmGoal, dismissGoalProposal } = useCoach();
  const proposal = message.goalProposal;
  if (!proposal) return null;

  const isConfirmed = proposal.confirmed === true;
  const isDismissed = proposal.dismissed === true;
  const isExiting = isConfirmed || isDismissed;
  const exitLabel = isConfirmed ? 'Goal created' : 'Skipped';
  const monthStr = proposal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const showApproval = !!proposal;

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

const styles = StyleSheet.create({
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
});
