import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Keyboard, Pressable } from 'react-native';
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

export default function ChatScreen() {
  const { messages, isTyping, activePanel, activeScenario, setActivePanel } = useCoach();
  const listRef = useRef<FlatList>(null);
  const prevMsgCount = useRef(messages.length);
  const prevScenario = useRef(activeScenario);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (activeScenario !== prevScenario.current) {
      prevScenario.current = activeScenario;
      prevMsgCount.current = messages.length;
      timer = setTimeout(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 100);
    } else if (messages.length > prevMsgCount.current) {
      prevMsgCount.current = messages.length;
      timer = setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [messages.length, activeScenario]);

  useEffect(() => {
    if (!isTyping) return;
    const timer = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 50);
    return () => clearTimeout(timer);
  }, [isTyping]);

  const showNonScenarioPanel = activePanel === 'memory' || activePanel === 'goals';
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (activePanel === 'history') {
      setShowHistory(true);
    }
  }, [activePanel]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <View style={styles.msgWrap}>
      <MessageBubble message={item} isLatest={index === messages.length - 1 && !isTyping} />
    </View>
  );

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ChatHeader />

        <View style={[styles.chatContent, showNonScenarioPanel && styles.chatHidden]}>
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
              contentContainerStyle={[styles.listContent]}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
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

        {showNonScenarioPanel && (
          <View style={styles.panelOverlay}>
            {activePanel === 'memory' && <MemoryCenter />}
            {activePanel === 'goals' && <GoalsDashboard />}
          </View>
        )}

        {activePanel === 'scenarios' && <ScenarioSwitcher />}
      </KeyboardAvoidingView>

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
  chatHidden: {
    display: 'none',
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
  panelOverlay: {
    flex: 1,
  },
});
