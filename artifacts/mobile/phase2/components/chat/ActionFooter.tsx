import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, Easing } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Svg, { Path, G } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';
import { Message } from '../../constants/types';
import { FlipIcon } from '../icons';

function CopyIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G transform="translate(3, 3)">
        <Path
          d="M3.125 10.625H8.125C9.50571 10.625 10.625 9.50571 10.625 8.125V3.125C10.625 1.74429 9.50571 0.625 8.125 0.625H3.125C1.74429 0.625 0.625 1.74429 0.625 3.125V8.125C0.625 9.50571 1.74429 10.625 3.125 10.625Z"
          stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round"
        />
      </G>
      <G transform="translate(8, 8)">
        <Path
          d="M0.625 9.16667H6.66667C8.04738 9.16667 9.16667 8.04738 9.16667 6.66667V0.625"
          stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

function ThumbUpIcon({ size = 20, color, filled }: { size?: number; color: string; filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G transform="translate(2.5, 8.33)">
        <Path
          d={filled
            ? "M0.625 9.79167V0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625Z"
            : "M0.625 0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625"}
          stroke={color} strokeWidth={1.25} strokeLinejoin="round"
          strokeLinecap={filled ? undefined : "round"}
          fill={filled ? color : 'none'}
        />
      </G>
      <G transform="translate(7.5, 3.33)">
        <Path
          d="M0.625 6.83183V12.2917C0.625 13.2121 1.37118 13.9583 2.29165 13.9583L6.73975 13.9584C7.81584 13.9584 8.77119 13.2698 9.11148 12.2489L10.533 7.98428C10.5939 7.80151 10.625 7.61012 10.625 7.41746C10.625 6.42751 9.82249 5.625 8.83254 5.625H6.8093C5.99609 5.625 5.39939 4.86076 5.59663 4.07183L6.16235 1.80894C6.31269 1.20756 5.85785 0.625 5.23795 0.625C4.95517 0.625 4.68699 0.750606 4.50596 0.967847L1.3976 4.69789C0.898387 5.29694 0.625 6.05204 0.625 6.83183Z"
          stroke={color} strokeWidth={1.25}
          fill={filled ? color : 'none'}
        />
      </G>
    </Svg>
  );
}

function ThumbDownIcon({ size = 20, color, filled }: { size?: number; color: string; filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G transform="rotate(180, 10, 10)">
        <G transform="translate(2.5, 8.33)">
          <Path
            d={filled
              ? "M0.625 9.79167V0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625Z"
              : "M0.625 0.625H3.125V8.125C3.125 9.04548 2.37881 9.79167 1.45833 9.79167H0.625"}
            stroke={color} strokeWidth={1.25} strokeLinejoin="round"
            strokeLinecap={filled ? undefined : "round"}
            fill={filled ? color : 'none'}
          />
        </G>
        <G transform="translate(7.5, 3.33)">
          <Path
            d="M0.625 6.83183V12.2917C0.625 13.2121 1.37118 13.9583 2.29165 13.9583L6.73975 13.9584C7.81584 13.9584 8.77119 13.2698 9.11148 12.2489L10.533 7.98428C10.5939 7.80151 10.625 7.61012 10.625 7.41746C10.625 6.42751 9.82249 5.625 8.83254 5.625H6.8093C5.99609 5.625 5.39939 4.86076 5.59663 4.07183L6.16235 1.80894C6.31269 1.20756 5.85785 0.625 5.23795 0.625C4.95517 0.625 4.68699 0.750606 4.50596 0.967847L1.3976 4.69789C0.898387 5.29694 0.625 6.05204 0.625 6.83183Z"
            stroke={color} strokeWidth={1.25}
            fill={filled ? color : 'none'}
          />
        </G>
      </G>
    </Svg>
  );
}

function ReactionButton({
  active,
  onToggle,
  icon: IconComponent,
  tintColor,
  tiltDeg = 0,
}: {
  active: boolean;
  onToggle: () => void;
  icon: React.ComponentType<{ size?: number; color: string; filled: boolean }>;
  tintColor: string;
  tiltDeg?: number;
}) {
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;
  const rotateAnim = useRef(new RNAnimated.Value(0)).current;
  const prevActive = useRef(active);

  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;

    if (active) {
      scaleAnim.setValue(0.5);
      rotateAnim.setValue(0);
      RNAnimated.parallel([
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 300,
          useNativeDriver: true,
        }),
        RNAnimated.sequence([
          RNAnimated.timing(rotateAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          RNAnimated.spring(rotateAnim, {
            toValue: 0,
            friction: 5,
            tension: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      RNAnimated.sequence([
        RNAnimated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 80,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active, scaleAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${tiltDeg}deg`],
  });

  return (
    <Pressable style={styles.actionBtn} onPress={onToggle}>
      <RNAnimated.View style={{ transform: [{ scale: scaleAnim }, { rotate }] }}>
        <IconComponent size={20} color={tintColor} filled={active} />
      </RNAnimated.View>
    </Pressable>
  );
}

function CopyButton({ color, text }: { color: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const cleaned = text.replace(/\*\*/g, '');
    await Clipboard.setStringAsync(cleaned);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Pressable style={styles.actionBtn} onPress={handleCopy}>
      <FlipIcon
        front={<CopyIcon size={20} color={color} />}
        back={
          <View style={styles.actionIconWrap}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        }
        flipped={copied}
        size={20}
        duration={350}
      />
    </Pressable>
  );
}

export function ActionFooter({ message }: { message: Message }) {
  const { colors } = useTheme();
  const [thumbUp, setThumbUp] = useState(false);
  const [thumbDown, setThumbDown] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);

  return (
    <View>
      <View style={styles.actionRow}>
        <CopyButton color={colors.contentBone600} text={message.content || ''} />
        <ReactionButton
          active={thumbUp}
          onToggle={() => { setThumbUp(!thumbUp); if (thumbDown) setThumbDown(false); }}
          icon={ThumbUpIcon}
          tintColor={colors.contentBone600}
          tiltDeg={-12}
        />
        <ReactionButton
          active={thumbDown}
          onToggle={() => { setThumbDown(!thumbDown); if (thumbUp) setThumbUp(false); }}
          icon={ThumbDownIcon}
          tintColor={colors.contentBone600}
          tiltDeg={12}
        />
        {message.provenance && (
          <Pressable style={[styles.actionBtn, { marginLeft: 4, flexDirection: 'row', gap: 4 }]} onPress={() => setShowProvenance(!showProvenance)}>
            <Text style={{ fontSize: 12, color: colors.contentSecondary, fontFamily: Fonts.regular }}>Why this?</Text>
            <Feather name={showProvenance ? 'chevron-up' : 'chevron-down'} size={12} color={colors.contentSecondary} />
          </Pressable>
        )}
      </View>
      {showProvenance && message.provenance && (
        <View style={[styles.provenanceCard, { backgroundColor: colors.surfaceTint }]}>
          <Text style={[styles.provenanceText, { color: colors.contentSecondary }]}>{message.provenance}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  actionBtn: { padding: 4 },
  actionIconWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  provenanceCard: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 16, marginTop: 4,
  },
  provenanceText: { fontSize: 12, lineHeight: 16, fontFamily: Fonts.regular },
});
