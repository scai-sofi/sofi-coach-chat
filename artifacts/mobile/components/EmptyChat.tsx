import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/colors';

export function EmptyChat() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Feather name="cpu" size={24} color={Colors.contentSecondary} />
      </View>
      <Text style={styles.title}>Start a conversation</Text>
      <Text style={styles.subtitle}>
        Type a message or try one of these topics to explore the experience.
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
  title: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.contentPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.contentSecondary,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 4,
  },
});
