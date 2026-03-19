import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

export function InputBar() {
  const [text, setText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const { sendMessage, temporaryChat, setTemporaryChat, isTyping, messages, showOnboarding } = useCoach();

  const handleSend = () => {
    if (!text.trim() || isTyping) return;
    sendMessage(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  const toggleTempChat = () => {
    const newVal = !temporaryChat;
    setTemporaryChat(newVal);
    if (newVal && !hasShownTooltip) {
      setShowTooltip(true);
      setHasShownTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  const starterPrompts = ['What\'s my financial snapshot?', 'Help me set a goal', 'How does my memory work?', 'Show my spending breakdown'];

  const showStarters = messages.length === 0 && showOnboarding;

  return (
    <View style={[styles.footer, { paddingBottom: Platform.OS === 'web' ? 20 : Math.max(insets.bottom, 8) }]}>
      {showStarters && (
        <View style={styles.starters}>
          {starterPrompts.map((prompt, i) => (
            <Pressable key={i} style={styles.starterBtn} onPress={() => sendMessage(prompt)}>
              <Text style={styles.starterText}>{prompt}</Text>
            </Pressable>
          ))}
        </View>
      )}
      <View style={styles.inputRow}>
        <View style={styles.inputPill}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Message"
            placeholderTextColor={Colors.contentSecondary}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={2000}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          {text.trim() ? (
            <Pressable style={[styles.sendBtn, isTyping && { opacity: 0.4 }]} onPress={handleSend} disabled={isTyping}>
              <Feather name="arrow-up" size={14} color="#fff" />
            </Pressable>
          ) : (
            <View>
              {showTooltip && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>Chat without saving to memory</Text>
                </View>
              )}
              <Pressable style={styles.tempBtn} onPress={toggleTempChat}>
                <Feather name="shield-off" size={16} color={temporaryChat ? Colors.contentPrimary : Colors.contentSecondary} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          AI can make mistakes.{' '}
          <Text style={styles.disclaimerLink}>Learn more</Text>
          {'   '}
          <Text style={styles.disclaimerLink}>Privacy policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.surfaceBase,
  },
  starters: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    maxWidth: 300,
    alignSelf: 'center',
    width: '100%',
  },
  starterBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(10,10,10,0.1)',
  },
  starterText: {
    fontSize: 14,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    textAlign: 'left',
  },
  inputRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputPill: {
    minHeight: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: 'rgba(10,10,10,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    maxHeight: 96,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.contentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    position: 'absolute',
    bottom: 40,
    right: 0,
    backgroundColor: Colors.contentPrimary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 50,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: Fonts.regular,
    whiteSpace: 'nowrap',
  } as any,
  disclaimer: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
    paddingHorizontal: 16,
  },
  disclaimerText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: Colors.contentSecondary,
    lineHeight: 16,
    textAlign: 'center',
  },
  disclaimerLink: {
    textDecorationLine: 'underline',
  },
});
