import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

function SignalIcon() {
  return (
    <Svg width={17} height={11} viewBox="0 0 17 11" fill="none">
      <Rect x={0} y={7} width={3} height={4} rx={0.5} fill={Colors.contentStatusbar} />
      <Rect x={4.5} y={4.5} width={3} height={6.5} rx={0.5} fill={Colors.contentStatusbar} />
      <Rect x={9} y={2} width={3} height={9} rx={0.5} fill={Colors.contentStatusbar} />
      <Rect x={13.5} y={0} width={3} height={11} rx={0.5} fill={Colors.contentStatusbar} />
    </Svg>
  );
}

function WifiIcon() {
  return (
    <Svg width={16} height={12} viewBox="0 0 16 12" fill="none">
      <Path
        d="M8 2.4C10.2 2.4 12.2 3.2 13.7 4.6L15.3 3C13.3 1.1 10.8 0 8 0C5.2 0 2.7 1.1 0.7 3L2.3 4.6C3.8 3.2 5.8 2.4 8 2.4ZM8 6.4C9.2 6.4 10.3 6.9 11.1 7.6L8 11L4.9 7.6C5.7 6.9 6.8 6.4 8 6.4Z"
        fill={Colors.contentStatusbar}
      />
    </Svg>
  );
}

function BatteryIcon() {
  return (
    <Svg width={25} height={12} viewBox="0 0 25 12" fill="none">
      <Rect x={0.5} y={0.5} width={21} height={11} rx={2} stroke={Colors.contentStatusbar} strokeOpacity={0.35} />
      <Rect x={2} y={2} width={18} height={7} rx={1} fill={Colors.contentStatusbar} />
      <Path d="M23 4V8C23.8 7.7 24.5 7 24.5 6C24.5 5 23.8 4.3 23 4Z" fill={Colors.contentStatusbar} fillOpacity={0.4} />
    </Svg>
  );
}

function StatusBar() {
  return (
    <View style={statusStyles.bar}>
      <View style={statusStyles.left}>
        <Text style={statusStyles.time}>9:41</Text>
      </View>
      <View style={statusStyles.notch} />
      <View style={statusStyles.right}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </View>
    </View>
  );
}

const statusStyles = StyleSheet.create({
  bar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 28,
    backgroundColor: Colors.surfaceBase,
  },
  left: {
    width: 54,
  },
  notch: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  time: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.contentStatusbar,
    letterSpacing: 0.5,
  },
});

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const { width: winW, height: winH } = useWindowDimensions();
  const DEVICE_W = 390;
  const DEVICE_H = 844;
  const padding = 32;
  const scaleX = (winW - padding * 2) / DEVICE_W;
  const scaleY = (winH - padding * 2) / DEVICE_H;
  const scale = Math.min(scaleX, scaleY, 1);

  return (
    <View style={frameStyles.outerWrap}>
      <View style={{
        width: DEVICE_W,
        height: DEVICE_H,
        borderRadius: 40,
        backgroundColor: Colors.surfaceBase,
        overflow: 'hidden',
        position: 'relative',
        transform: [{ scale }],
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 1,
        shadowRadius: 60,
        elevation: 20,
      }}>
        <View style={frameStyles.dynamicIsland} />
        <StatusBar />
        <View style={frameStyles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const frameStyles = StyleSheet.create({
  outerWrap: {
    flex: 1,
    backgroundColor: Colors.frameBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dynamicIsland: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    width: 120,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#000',
    zIndex: 100,
  },
  content: {
    flex: 1,
  },
});
