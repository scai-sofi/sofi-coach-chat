import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { ChevronLeftIcon } from './icons';

interface AppBarAction {
  icon: React.ReactNode;
  onPress: () => void;
  hitSlop?: number;
}

interface AppBarBaseProps {
  backgroundColor?: string;
}

interface StandardAppBarProps extends AppBarBaseProps {
  variant?: 'standard';
  title: string;
  subtitle?: React.ReactNode;
  leftAction?: AppBarAction;
  leftExtra?: React.ReactNode;
  rightActions?: AppBarAction[];
}

interface BackAppBarProps extends AppBarBaseProps {
  variant: 'back';
  title: string;
  onBack: () => void;
  rightAction?: AppBarAction;
  rightActions?: AppBarAction[];
}

interface SheetAppBarProps extends AppBarBaseProps {
  variant: 'sheet';
  title: string;
  rightAction?: AppBarAction;
}

export type AppBarProps = StandardAppBarProps | BackAppBarProps | SheetAppBarProps;

export function AppBar(props: AppBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bgColor = props.backgroundColor ?? colors.surfaceBase;

  if (props.variant === 'sheet') {
    return <SheetHeader {...props} />;
  }

  if (props.variant === 'back') {
    const actions = props.rightActions ?? (props.rightAction ? [props.rightAction] : []);
    return (
      <View style={[styles.headerWrap, { paddingTop: insets.top, backgroundColor: bgColor }]}>
        <View style={styles.titleBar}>
          <View style={styles.leftZone}>
            <Pressable style={styles.iconBtn} onPress={props.onBack} hitSlop={8}>
              <ChevronLeftIcon size={24} color={colors.contentPrimary} />
            </Pressable>
          </View>
          <View style={styles.centerZone}>
            <Text style={[styles.title, { color: colors.contentPrimary }]} numberOfLines={1}>{props.title}</Text>
          </View>
          <View style={styles.rightZone}>
            {actions.map((action, i) => (
              <Pressable key={i} style={styles.iconBtn} onPress={action.onPress} hitSlop={action.hitSlop ?? 8}>
                {action.icon}
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }

  const standardProps = props as StandardAppBarProps;
  return (
    <View style={[styles.headerWrap, { paddingTop: insets.top, backgroundColor: bgColor }]}>
      <View style={styles.titleBar}>
        <View style={styles.leftZone}>
          {standardProps.leftAction && (
            <Pressable style={styles.iconBtn} onPress={standardProps.leftAction.onPress} hitSlop={standardProps.leftAction.hitSlop}>
              {standardProps.leftAction.icon}
            </Pressable>
          )}
          {standardProps.leftExtra}
        </View>
        <View style={styles.centerZone}>
          <Text style={[styles.title, { color: colors.contentPrimary }]} numberOfLines={1}>{standardProps.title}</Text>
          {standardProps.subtitle}
        </View>
        <View style={styles.rightZone}>
          {standardProps.rightActions?.map((action, i) => (
            <Pressable key={i} style={styles.iconBtn} onPress={action.onPress} hitSlop={action.hitSlop}>
              {action.icon}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function SheetHeader(props: SheetAppBarProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.sheetHeader}>
      <Text style={[styles.sheetTitle, { color: colors.contentPrimary }]}>{props.title}</Text>
      {props.rightAction && (
        <Pressable style={styles.sheetCloseBtn} onPress={props.rightAction.onPress} hitSlop={8}>
          {props.rightAction.icon}
        </Pressable>
      )}
    </View>
  );
}

export function useAppBarHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + 44;
}

const styles = StyleSheet.create({
  headerWrap: {
    zIndex: 40,
  },
  titleBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftZone: {
    width: 104,
    paddingLeft: 16,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  centerZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rightZone: {
    width: 104,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
  },
  iconBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    textAlign: 'center',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  sheetCloseBtn: {
    padding: 4,
    borderRadius: 9999,
  },
});
