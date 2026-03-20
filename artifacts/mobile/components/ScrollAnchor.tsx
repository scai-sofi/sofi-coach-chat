import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ScrollAnchorProps {
  onPress: () => void;
}

export function ScrollAnchor({ onPress }: ScrollAnchorProps) {
  return (
    <Pressable style={[styles.button, Platform.OS === 'web' && styles.buttonWeb]} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Svg width={14.5} height={11.5} viewBox="0 0 14.5 11.5" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.28033 0.21967C6.57322 0.512563 6.57322 0.987437 6.28033 1.28033L2.56066 5H13.75C14.1642 5 14.5 5.33579 14.5 5.75C14.5 6.16421 14.1642 6.5 13.75 6.5H2.56066L6.28033 10.2197C6.57322 10.5126 6.57322 10.9874 6.28033 11.2803C5.98744 11.5732 5.51256 11.5732 5.21967 11.2803L0.21967 6.28033C-0.0732233 5.98744 -0.0732233 5.51256 0.21967 5.21967L5.21967 0.21967C5.51256 -0.0732233 5.98744 -0.0732233 6.28033 0.21967Z"
            fill="#1A1919"
          />
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(10,10,10,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonWeb: {
    boxShadow: '0px 0px 1px 0px rgba(10,10,10,0.16), 0px 2px 8px 0px rgba(10,10,10,0.04), 0px 4px 16px 0px rgba(10,10,10,0.02)',
  } as any,
  iconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-90deg' }],
  },
});
