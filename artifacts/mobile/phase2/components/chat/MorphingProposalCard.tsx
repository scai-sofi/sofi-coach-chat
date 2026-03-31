import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';
import { useCoach } from '../../context/CoachContext';
import { useToast } from '../Toast';
import { AppIcon, IconName } from './ChipBadge';

export function MorphingProposalCard({
  isExiting,
  confirmedLabel,
  finalIcon,
  memoryIds,
  children,
}: {
  isExiting: boolean;
  confirmedLabel: string;
  finalIcon: IconName;
  memoryIds?: string[];
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const { memories, navigateToMemory } = useCoach();
  const { showToast } = useToast();

  const collapse = useRef(new RNAnimated.Value(0)).current;
  const flipAnim = useRef(new RNAnimated.Value(0)).current;
  const labelSlide = useRef(new RNAnimated.Value(0)).current;
  const labelOpacity = useRef(new RNAnimated.Value(0)).current;
  const chevronOpacity = useRef(new RNAnimated.Value(0)).current;
  const [phase, setPhase] = useState<'pending' | 'morphing' | 'check' | 'done'>('pending');
  const prevExiting = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const allAnims = [collapse, flipAnim, labelSlide, labelOpacity, chevronOpacity];

  const frontRotateY = flipAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  const backRotateY = flipAnim.interpolate({ inputRange: [0, 360], outputRange: ['180deg', '540deg'] });
  const frontFaceOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 269, 270, 360],
    outputRange: [1, 1, 0, 0, 1, 1],
  });
  const backFaceOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 269, 270, 360],
    outputRange: [0, 0, 1, 1, 0, 0],
  });

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      allAnims.forEach(a => a.stopAnimation());
    };
  }, allAnims);

  useEffect(() => {
    if (isExiting && !prevExiting.current) {
      setPhase('morphing');

      RNAnimated.timing(collapse, {
        toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: false,
      }).start(() => {
        if (!mountedRef.current) return;
        setPhase('check');

        timerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setPhase('done');
        }, 2000);
      });
    }
    prevExiting.current = isExiting;
  }, [isExiting, ...allAnims]);

  const handleChipPress = () => {
    if (!memoryIds || memoryIds.length === 0) return;
    const anyAlive = memories.some(m => memoryIds.includes(m.id) && m.status !== 'DELETED');
    if (anyAlive) {
      navigateToMemory(memoryIds);
    } else {
      showToast({ message: 'This chat memory has been deleted.' });
    }
  };

  if (phase === 'pending') {
    return (
      <View style={[styles.proposalCard, { backgroundColor: colors.surfaceTint, borderColor: colors.surfaceEdgeLight }]}>
        {children}
      </View>
    );
  }

  const paddingH = collapse.interpolate({ inputRange: [0, 1], outputRange: [12, 10] });
  const paddingV = collapse.interpolate({ inputRange: [0, 1], outputRange: [12, 6] });
  const contentOpacity = collapse.interpolate({ inputRange: [0, 0.25], outputRange: [1, 0], extrapolate: 'clamp' });
  const contentMaxH = collapse.interpolate({ inputRange: [0, 0.6, 1], outputRange: [200, 40, 0] });
  const contentMaxW = collapse.interpolate({ inputRange: [0, 1], outputRange: [500, 0] });

  const isDone = phase === 'done';
  const showStaticChip = phase === 'check' || phase === 'done';

  const chipRow = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 14, height: 14, justifyContent: 'center', alignItems: 'center' }}>
        {showStaticChip ? (
          <AppIcon name={finalIcon} size={12} color={colors.contentPrimary} />
        ) : (
          <>
            <RNAnimated.View style={{
              position: 'absolute',
              opacity: frontFaceOpacity,
              transform: [{ perspective: 400 }, { rotateY: frontRotateY }],
            }}>
              <AppIcon name={finalIcon} size={12} color={colors.contentPrimary} />
            </RNAnimated.View>
            <RNAnimated.View style={{
              position: 'absolute',
              opacity: backFaceOpacity,
              transform: [{ perspective: 400 }, { rotateY: backRotateY }],
            }}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M20 6L9 17L4 12" stroke={colors.contentPrimary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </RNAnimated.View>
          </>
        )}
      </View>
      {showStaticChip ? (
        <Text style={[styles.chipText, { color: colors.contentPrimary }]}>
          {confirmedLabel}
        </Text>
      ) : (
        <RNAnimated.View style={{ opacity: labelOpacity }}>
          <Text style={[styles.chipText, { color: colors.contentPrimary }]}>
            {confirmedLabel}
          </Text>
        </RNAnimated.View>
      )}
      {showStaticChip ? (
        memoryIds && memoryIds.length > 0 ? (
          <Feather name="chevron-right" size={12} color={colors.contentPrimary} />
        ) : null
      ) : (
        <RNAnimated.View style={{ opacity: chevronOpacity }}>
          <Feather name="chevron-right" size={12} color={colors.contentPrimary} />
        </RNAnimated.View>
      )}
    </View>
  );

  const morphCard = (
    <RNAnimated.View style={[
      styles.morphCard,
      {
        backgroundColor: colors.surfaceTint,
        borderColor: colors.surfaceEdgeLight,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
      },
    ]}>
      {phase === 'morphing' && (
        <RNAnimated.View style={{
          opacity: contentOpacity,
          maxHeight: contentMaxH,
          maxWidth: contentMaxW,
          overflow: 'hidden',
        }}>
          {children}
        </RNAnimated.View>
      )}
      {chipRow}
    </RNAnimated.View>
  );

  if (phase === 'done' && memoryIds && memoryIds.length > 0) {
    return (
      <Pressable onPress={handleChipPress}>
        {morphCard}
      </Pressable>
    );
  }

  return morphCard;
}

const styles = StyleSheet.create({
  proposalCard: {
    borderWidth: 0.75, borderRadius: 16, padding: 12,
  },
  morphCard: {
    borderWidth: 0.75, borderRadius: 16, alignSelf: 'flex-start',
  },
  chipText: { fontSize: 12, fontFamily: Fonts.medium, lineHeight: 16, letterSpacing: 0.1 },
});
