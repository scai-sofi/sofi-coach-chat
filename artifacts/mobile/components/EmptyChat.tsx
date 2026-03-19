import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

export function EmptyChat() {
  const { chatMode } = useCoach();
  const isLive = chatMode === 'live';

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, isLive && styles.iconCircleLive]}>
        <Feather name={isLive ? 'zap' : 'cpu'} size={24} color={isLive ? '#16a34a' : Colors.contentSecondary} />
      </View>
      <Text style={styles.title}>{isLive ? 'Live Coach' : 'Start a conversation'}</Text>
      <Text style={styles.subtitle}>
        {isLive
          ? 'Ask me anything about budgeting, saving, investing, or your financial goals.'
          : 'Type a message or try one of these topics to explore the experience.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleLive: {
    backgroundColor: '#dcfce7',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.contentSecondary,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 4,
  },
});
