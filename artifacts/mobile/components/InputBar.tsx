import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Pressable, Text, StyleSheet, Keyboard } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { View } from 'react-native';

export function InputBar() {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const { sendMessage, isTyping, setInputFocused, messages } = useCoach();
  const hasActiveChat = messages.length > 0;
  const restPadding = Math.max(insets.bottom, 8);
  const bottomPad = useSharedValue(restPadding);

  useEffect(() => {
    if (isTyping) {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [isTyping]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => {
      bottomPad.value = withTiming(4, { duration: 250, easing: Easing.out(Easing.cubic) });
    });
    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      bottomPad.value = withTiming(restPadding, { duration: 300, easing: Easing.out(Easing.cubic) });
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, [restPadding]);

  const footerAnimStyle = useAnimatedStyle(() => ({
    paddingBottom: bottomPad.value,
  }));

  const handleSend = () => {
    if (!text.trim() || isTyping) return;
    sendMessage(text.trim());
    setText('');
  };

  return (
    <Animated.View style={[styles.footer, footerAnimStyle, { backgroundColor: colors.surfaceBase }]}>
      <View style={styles.inputRow}>
        <View style={[styles.inputPill, { backgroundColor: colors.surfaceElevated, borderColor: colors.surfaceEdge }]}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.contentPrimary }]}
            placeholder="Message"
            placeholderTextColor={colors.contentSecondary}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={2000}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            cursorColor={colors.contentBone600}
            selectionColor={colors.selectionColor}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {text.trim() ? (
            <Pressable style={[styles.sendBtn, { backgroundColor: colors.contentBone600 }, isTyping && { opacity: 0.4 }]} onPress={handleSend} disabled={isTyping}>
              <Svg width={11.5} height={14.5} viewBox="0 0 11.5 14.5" fill="none">
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.21967 0.21967C5.51256 -0.0732233 5.98744 -0.0732233 6.28033 0.21967L11.2803 5.21967C11.5732 5.51256 11.5732 5.98744 11.2803 6.28033C10.9874 6.57322 10.5126 6.57322 10.2197 6.28033L6.5 2.56066V13.75C6.5 14.1642 6.16421 14.5 5.75 14.5C5.33579 14.5 5 14.1642 5 13.75V2.56066L1.28033 6.28033C0.987437 6.57322 0.512563 6.57322 0.21967 6.28033C-0.0732233 5.98744 -0.0732233 5.51256 0.21967 5.21967L5.21967 0.21967Z"
                  fill={colors.whiteOnDark}
                />
              </Svg>
            </Pressable>
          ) : null}
        </View>
      </View>
      {!hasActiveChat && (
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { color: colors.contentSecondary }]}>
            AI can make mistakes.{' '}
            <Text style={styles.disclaimerLink}>Learn more</Text>
            {'   '}
            <Text style={styles.disclaimerLink}>Privacy policy</Text>
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backfaceVisibility: 'hidden',
  },
  inputRow: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 8,
  },
  inputPill: {
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 0.75,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
    backfaceVisibility: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimer: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  disclaimerText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 16,
    textAlign: 'center',
  },
  disclaimerLink: {
    textDecorationLine: 'underline',
  },
});
