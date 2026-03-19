import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

const SUGGESTIONS = [
  {
    label: 'Support',
    text: 'I need help with my SoFi account.',
    type: 'full' as const,
  },
  {
    label: 'Credit score',
    text: 'Why did my credit score change?',
    type: 'half' as const,
  },
  {
    label: 'Spending',
    text: 'Review monthly spending.',
    type: 'half' as const,
  },
];

export function EmptyChat() {
  const { sendMessage } = useCoach();

  const fullCard = SUGGESTIONS.find(s => s.type === 'full')!;
  const halfCards = SUGGESTIONS.filter(s => s.type === 'half');

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.orbSection}>
        <View style={styles.orbCombo}>
          <Image
            source={require('@/assets/images/orb-combo.png')}
            style={styles.orbComboImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.greeting}>
          {"I'm Coach.\nHow can I help?"}
        </Text>
      </View>

      <View style={styles.suggestionsSection}>
        <Pressable
          style={styles.fullCard}
          onPress={() => sendMessage(fullCard.text)}
        >
          <Text style={styles.cardLabel}>{fullCard.label.toUpperCase()}</Text>
          <Text style={styles.cardText}>{fullCard.text}</Text>
        </Pressable>

        <View style={styles.halfRow}>
          {halfCards.map((card, i) => (
            <Pressable
              key={i}
              style={styles.halfCard}
              onPress={() => sendMessage(card.text)}
            >
              <Text style={styles.cardLabel}>{card.label.toUpperCase()}</Text>
              <Text style={styles.halfCardText} numberOfLines={2}>
                {card.text}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const cardShadow = {
  shadowColor: 'rgba(10,10,10,0.16)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 4,
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  orbSection: {
    alignItems: 'center',
    gap: 24,
    paddingTop: 100,
  },
  orbCombo: {
    alignItems: 'center',
    gap: 12,
  },
  orbComboImage: {
    width: 96,
    height: 120,
  },
  greeting: {
    fontSize: 24,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  suggestionsSection: {
    gap: 12,
    paddingBottom: 16,
    paddingTop: 40,
  },
  fullCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 4,
    ...cardShadow,
  },
  halfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    height: 92,
    ...cardShadow,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.contentSecondary,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  cardText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.contentPrimary,
    lineHeight: 20,
  },
  halfCardText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.contentPrimary,
    lineHeight: 20,
    marginTop: 4,
  },
});
