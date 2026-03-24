import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { ChatSession } from '@/context/CoachContext';
import { AppBar } from '@/components/AppBar';
import { ChatNewIcon } from '@/components/icons';
import { SearchBar } from '@/components/SearchBar';

function groupByMonth(sessions: ChatSession[]): { label: string; sessions: ChatSession[] }[] {
  const groups: Record<string, ChatSession[]> = {};
  const order: string[] = [];

  const sorted = [...sessions].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  for (const session of sorted) {
    const date = new Date(session.updatedAt);
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[label]) {
      groups[label] = [];
      order.push(label);
    }
    groups[label].push(session);
  }

  return order.map(label => ({ label, sessions: groups[label] }));
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_DURATION = 300;
const SLIDE_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export function ChatHistory({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  const { chatHistory, loadSession, saveAndClose } = useCoach();
  const [search, setSearch] = useState('');

  const slideX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    slideX.value = withTiming(0, { duration: SLIDE_DURATION, easing: SLIDE_EASING });
  }, []);

  const handleClose = () => {
    slideX.value = withTiming(SCREEN_WIDTH, { duration: SLIDE_DURATION, easing: SLIDE_EASING }, () => {
      runOnJS(onClose)();
    });
  };

  const handleLoadSession = (id: string) => {
    slideX.value = withTiming(SCREEN_WIDTH, { duration: SLIDE_DURATION, easing: SLIDE_EASING }, () => {
      runOnJS(loadSession)(id);
      runOnJS(onClose)();
    });
  };

  const handleNewChat = () => {
    slideX.value = withTiming(SCREEN_WIDTH, { duration: SLIDE_DURATION, easing: SLIDE_EASING }, () => {
      runOnJS(saveAndClose)();
      runOnJS(onClose)();
    });
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const filtered = useMemo(() => {
    if (!search.trim()) return chatHistory;
    const q = search.toLowerCase();
    return chatHistory.filter(s => s.title.toLowerCase().includes(q));
  }, [chatHistory, search]);

  const groups = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surfaceBase }, animStyle]}>
      <AppBar
        variant="back"
        title="Chat history"
        onBack={handleClose}
        rightAction={{
          icon: <ChatNewIcon size={24} color={colors.contentPrimary} />,
          onPress: handleNewChat,
        }}
      />

      <SearchBar value={search} onChangeText={setSearch} />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.contentSecondary }]}>No chat history yet</Text>
          </View>
        ) : (
          groups.map(group => (
            <View key={group.label} style={styles.group}>
              <Text style={[styles.groupLabel, { color: colors.contentSecondary }]}>{group.label}</Text>
              <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdgeLight }]}>
                {group.sessions.map((session, idx) => (
                  <View key={session.id}>
                    {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.surfaceEdgeLight }]} />}
                    <Pressable
                      style={styles.sessionRow}
                      onPress={() => handleLoadSession(session.id)}
                    >
                      <Text style={[styles.sessionTitle, { color: colors.contentPrimary }]} numberOfLines={1}>{session.title}</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  group: {
    marginBottom: 8,
  },
  groupLabel: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    lineHeight: 18,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0.75,
  },
  sessionRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    flex: 1,
  },
  divider: {
    height: 0.75,
    marginHorizontal: 16,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
});
