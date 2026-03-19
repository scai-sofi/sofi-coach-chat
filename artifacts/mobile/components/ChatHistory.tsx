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

function ChevronLeftIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L9.41421 12L16.7071 19.2929C17.0976 19.6834 17.0976 20.3166 16.7071 20.7071C16.3166 21.0976 15.6834 21.0976 15.2929 20.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289Z"
        fill={color}
      />
    </Svg>
  );
}

function NewChatIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 15V12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12V15C20 17.2091 18.2091 19 16 19H8.32812C8.06302 19.0001 7.80856 19.1055 7.62109 19.293L5.51758 21.3965C5.13114 21.7829 4.60702 22 4.06055 22C2.92256 21.9999 2.00006 21.0774 2 19.9395V9C2 6.79086 3.79086 5 6 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H6C4.89543 7 4 7.89543 4 9V19.9395C4.00006 19.9729 4.02714 19.9999 4.06055 20C4.07658 20 4.09215 19.9937 4.10352 19.9824L6.20703 17.8789C6.76957 17.3164 7.53258 17.0001 8.32812 17H16C17.1046 17 18 16.1046 18 15ZM18 9V7H16C15.4477 7 15 6.55228 15 6C15 5.44772 15.4477 5 16 5H18V3C18 2.44772 18.4477 2 19 2C19.5523 2 20 2.44772 20 3V5H22C22.5523 5 23 5.44772 23 6C23 6.55228 22.5523 7 22 7H20V9C20 9.55228 19.5523 10 19 10C18.4477 10 18 9.55228 18 9Z"
        fill={color}
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
          <ChevronLeftIcon size={24} color={Colors.contentPrimary} />
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
