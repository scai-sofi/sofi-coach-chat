import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { ChatSession } from '@/context/CoachContext';

function NewChatIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8v6M9 11h6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
  const insets = useSafeAreaInsets();
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

  const topPad = Platform.OS === 'web' ? 54 : insets.top;

  return (
    <Animated.View style={[styles.container, { paddingTop: topPad }, animStyle]}>
      <View style={styles.titleBar}>
        <Pressable style={styles.backBtn} onPress={handleClose} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={Colors.contentPrimary} />
        </Pressable>
        <View style={styles.titleCenter}>
          <Text style={styles.title}>Chat history</Text>
        </View>
        <Pressable style={styles.newChatBtn} onPress={handleNewChat} hitSlop={8}>
          <NewChatIcon size={24} color={Colors.contentPrimary} />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchPill}>
          <Feather name="search" size={16} color={Colors.contentSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.contentSecondary}
            value={search}
            onChangeText={setSearch}
            cursorColor="#5c5b5a"
            selectionColor="rgba(92,91,90,0.3)"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No chat history yet</Text>
          </View>
        ) : (
          groups.map(group => (
            <View key={group.label} style={styles.group}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              <View style={styles.card}>
                {group.sessions.map((session, idx) => (
                  <View key={session.id}>
                    {idx > 0 && <View style={styles.divider} />}
                    <Pressable
                      style={styles.sessionRow}
                      onPress={() => handleLoadSession(session.id)}
                    >
                      <Text style={styles.sessionTitle} numberOfLines={1}>{session.title}</Text>
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
    backgroundColor: Colors.surfaceBase,
  },
  titleBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
  },
  newChatBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPill: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: 'rgba(10,10,10,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    paddingVertical: 0,
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
    color: Colors.contentSecondary,
    lineHeight: 18,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 0.75,
    borderColor: 'rgba(10,10,10,0.06)',
    overflow: 'hidden',
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
    color: Colors.contentPrimary,
    lineHeight: 20,
    flex: 1,
  },
  divider: {
    height: 0.75,
    backgroundColor: 'rgba(10,10,10,0.08)',
    marginHorizontal: 16,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.contentSecondary,
    lineHeight: 20,
  },
});
