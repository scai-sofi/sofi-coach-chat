import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

export function InputBar() {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const { sendMessage, isTyping, setInputFocused } = useCoach();

  const handleSend = () => {
    if (!text.trim() || isTyping) return;
    sendMessage(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.footerBg} />
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
            cursorColor="#5c5b5a"
            selectionColor="rgba(92,91,90,0.3)"
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {text.trim() ? (
            <Pressable style={[styles.sendBtn, isTyping && { opacity: 0.4 }]} onPress={handleSend} disabled={isTyping}>
              <Feather name="arrow-up" size={14} color="#fff" />
            </Pressable>
          ) : null}
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
    backgroundColor: 'transparent',
  },
  footerBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 24,
    backgroundColor: Colors.surfaceBase,
  },
  inputRow: {
    paddingHorizontal: 16,
    paddingTop: 0,
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
    minHeight: 32,
    maxHeight: 96,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: '#5c5b5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
