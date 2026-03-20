import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

export function InputBar() {
  const [text, setText] = useState('');
  const [keyboardUp, setKeyboardUp] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const { sendMessage, isTyping, setInputFocused } = useCoach();

  useEffect(() => {
    if (isTyping) {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [isTyping]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => setKeyboardUp(true));
    const hideSub = Keyboard.addListener('keyboardWillHide', () => setKeyboardUp(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleSend = () => {
    if (!text.trim() || isTyping) return;
    sendMessage(text.trim());
    setText('');
  };

  return (
    <View style={[styles.footer, { paddingBottom: keyboardUp ? 4 : Math.max(insets.bottom, 8) }]}>
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
              <Svg width={11.5} height={14.5} viewBox="0 0 11.5 14.5" fill="none">
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.21967 0.21967C5.51256 -0.0732233 5.98744 -0.0732233 6.28033 0.21967L11.2803 5.21967C11.5732 5.51256 11.5732 5.98744 11.2803 6.28033C10.9874 6.57322 10.5126 6.57322 10.2197 6.28033L6.5 2.56066V13.75C6.5 14.1642 6.16421 14.5 5.75 14.5C5.33579 14.5 5 14.1642 5 13.75V2.56066L1.28033 6.28033C0.987437 6.57322 0.512563 6.57322 0.21967 6.28033C-0.0732233 5.98744 -0.0732233 5.51256 0.21967 5.21967L5.21967 0.21967Z"
                  fill="#fff"
                />
              </Svg>
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
    paddingVertical: 4,
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
