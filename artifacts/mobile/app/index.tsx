import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Keyboard, Pressable, Platform, UIManager } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
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
import { Message } from '@/constants/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ChatScreen() {
  const { messages, isTyping, activePanel, activeScenario, setActivePanel } = useCoach();
  const listRef = useRef<FlatList>(null);
  const prevMsgCount = useRef(messages.length);
  const prevScenario = useRef(activeScenario);
  const lastUserMsgIndex = useRef<number | null>(null);

  useEffect(() => {
    if (activeScenario !== prevScenario.current) {
      prevScenario.current = activeScenario;
      prevMsgCount.current = messages.length;
      lastUserMsgIndex.current = null;
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
          <ScenarioFab />
          <InputBar />
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
});
