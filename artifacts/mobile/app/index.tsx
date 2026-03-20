import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Keyboard, Pressable, Platform, UIManager, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useCoach } from '@/context/CoachContext';
import { ChatHeader } from '@/components/ChatHeader';
import { MessageBubble } from '@/components/MessageBubble';
import { TypingIndicator } from '@/components/TypingIndicator';
import { InputBar } from '@/components/InputBar';
import { EmptyChat } from '@/components/EmptyChat';
import { MemoryCenter } from '@/components/MemoryCenter';
import { GoalsDashboard } from '@/components/GoalsDashboard';
import { ScenarioSwitcher } from '@/components/ScenarioSwitcher';
import { ScenarioFab } from '@/components/ScenarioFab';
import { ChatHistory } from '@/components/ChatHistory';
import { ScrollAnchor } from '@/components/ScrollAnchor';
import { Message } from '@/constants/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCROLL_THRESHOLD = 120;

export default function ChatScreen() {
  const { messages, isTyping, activePanel, activeScenario, setActivePanel } = useCoach();
  const listRef = useRef<FlatList>(null);
  const prevMsgCount = useRef(messages.length);
  const prevScenario = useRef(activeScenario);
  const lastUserMsgIndex = useRef<number | null>(null);

  const [showAnchor, setShowAnchor] = useState(false);
  const showAnchorRef = useRef(false);
  const anchorOpacity = useSharedValue(0);
  const anchorTranslateY = useSharedValue(8);
  const [inputBarHeight, setInputBarHeight] = useState(0);

  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const handleInputBarLayout = useCallback((e: LayoutChangeEvent) => {
    setInputBarHeight(e.nativeEvent.layout.height);
  }, []);

  const checkAnchorVisibility = useCallback(() => {
    const maxScroll = contentHeightRef.current - viewportHeightRef.current;
    const distanceFromBottom = maxScroll - scrollOffsetRef.current;
    const shouldShow = maxScroll > 0 && distanceFromBottom > SCROLL_THRESHOLD;

    if (shouldShow && !showAnchorRef.current) {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
      showAnchorRef.current = true;
      setShowAnchor(true);
      anchorOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
      anchorTranslateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) });
    } else if (!shouldShow && showAnchorRef.current) {
      showAnchorRef.current = false;
      anchorOpacity.value = withTiming(0, { duration: 150, easing: Easing.in(Easing.ease) });
      anchorTranslateY.value = withTiming(8, { duration: 150, easing: Easing.in(Easing.ease) });
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowAnchor(false), 160);
    }
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
    if (event.nativeEvent.contentSize?.height) {
      contentHeightRef.current = event.nativeEvent.contentSize.height;
    }
    if (event.nativeEvent.layoutMeasurement?.height) {
      viewportHeightRef.current = event.nativeEvent.layoutMeasurement.height;
    }
    checkAnchorVisibility();
  }, [checkAnchorVisibility]);

  const handleContentSizeChange = useCallback((_w: number, h: number) => {
    contentHeightRef.current = h;
    checkAnchorVisibility();
  }, [checkAnchorVisibility]);

  const handleListLayout = useCallback((e: LayoutChangeEvent) => {
    viewportHeightRef.current = e.nativeEvent.layout.height;
    checkAnchorVisibility();
  }, [checkAnchorVisibility]);

  const handleScrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

  const anchorAnimStyle = useAnimatedStyle(() => ({
    opacity: anchorOpacity.value,
    transform: [{ translateY: anchorTranslateY.value }],
  }));

  useEffect(() => {
    if (activeScenario !== prevScenario.current) {
      prevScenario.current = activeScenario;
      prevMsgCount.current = messages.length;
      lastUserMsgIndex.current = null;
      showAnchorRef.current = false;
      setShowAnchor(false);
      anchorOpacity.value = 0;
      anchorTranslateY.value = 8;
      const timer = setTimeout(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 100);
      return () => clearTimeout(timer);
    }

    if (messages.length > prevMsgCount.current) {
      const newMsg = messages[messages.length - 1];
      prevMsgCount.current = messages.length;

      if (newMsg?.role === 'user') {
        lastUserMsgIndex.current = messages.length - 1;
        const timer = setTimeout(() => {
          const targetIndex = lastUserMsgIndex.current;
          if (targetIndex !== null && targetIndex < messages.length) {
            try {
              listRef.current?.scrollToIndex({
                index: targetIndex,
                animated: true,
                viewPosition: 0,
                viewOffset: 0,
              });
            } catch {
              listRef.current?.scrollToEnd({ animated: true });
            }
          }
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [messages.length, activeScenario]);

  const handleScrollToIndexFailed = useCallback((info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const offset = info.averageItemLength * info.index;
    listRef.current?.scrollToOffset({ offset, animated: true });
    setTimeout(() => {
      try {
        listRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0,
        });
      } catch {}
    }, 200);
  }, []);

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (activePanel === 'history') {
      setShowHistory(true);
    }
  }, [activePanel]);

  const renderMessage = useCallback(({ item, index }: { item: Message; index: number }) => (
    <View style={styles.msgWrap}>
      <MessageBubble message={item} isLatest={index === messages.length - 1 && !isTyping} />
    </View>
  ), [messages.length, isTyping]);

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ChatHeader />

        <View style={styles.chatContent}>
          {messages.length === 0 ? (
            <Pressable style={styles.flex} onPress={() => {
              Keyboard.dismiss();
            }}>
              <EmptyChat />
            </Pressable>
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onScrollToIndexFailed={handleScrollToIndexFailed}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onContentSizeChange={handleContentSizeChange}
              onLayout={handleListLayout}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: undefined,
              }}
              ListFooterComponent={isTyping ? (
                <View style={styles.msgWrap}>
                  <TypingIndicator />
                </View>
              ) : null}
            />
          )}

          {showAnchor && messages.length > 0 && (
            <Animated.View
              style={[styles.anchorWrap, { bottom: inputBarHeight + 16 }, anchorAnimStyle]}
              accessibilityRole="button"
              accessibilityLabel="Scroll to bottom"
            >
              <ScrollAnchor onPress={handleScrollToBottom} />
            </Animated.View>
          )}

          <ScenarioFab />
          <View onLayout={handleInputBarLayout}>
            <InputBar />
          </View>
        </View>

        {activePanel === 'scenarios' && <ScenarioSwitcher />}
      </KeyboardAvoidingView>

      {activePanel === 'memory' && <MemoryCenter />}
      {activePanel === 'goals' && <GoalsDashboard />}

      {showHistory && (
        <ChatHistory onClose={() => {
          setShowHistory(false);
          setActivePanel('none');
        }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfaceBase,
  },
  flex: { flex: 1 },
  chatContent: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  msgWrap: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  anchorWrap: {
    position: 'absolute',
    right: 16,
    zIndex: 50,
  },
});
