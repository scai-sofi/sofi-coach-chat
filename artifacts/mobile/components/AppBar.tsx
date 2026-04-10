import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { ChevronLeftIcon } from '@/components/icons';

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

// Pacific App Bar — 44pt bar height, bottom strokeEdge divider, 44×44 touch targets
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
            <Pressable style={styles.iconBtn} onPress={props.onBack} hitSlop={4}>
              <ChevronLeftIcon size={24} color={colors.contentPrimary} />
            </Pressable>
          </View>

          {/* Center — absolutely positioned for true screen-center alignment */}
          <View style={styles.centerAbsolute} pointerEvents="none">
            <Text style={[styles.title, { color: colors.contentPrimary }]} numberOfLines={1}>
              {props.title}
            </Text>
          </View>

          <View style={styles.rightZone}>
            {actions.map((action, i) => (
              <Pressable key={i} style={styles.iconBtn} onPress={action.onPress} hitSlop={action.hitSlop ?? 4}>
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
            <Pressable style={styles.iconBtn} onPress={standardProps.leftAction.onPress} hitSlop={standardProps.leftAction.hitSlop ?? 4}>
              {standardProps.leftAction.icon}
            </Pressable>
          )}
          {standardProps.leftExtra}
        </View>

        {/* Center — absolutely positioned for true screen-center alignment */}
        <View style={styles.centerAbsolute} pointerEvents="none">
          <Text style={[styles.title, { color: colors.contentPrimary }]} numberOfLines={1}>
            {standardProps.title}
          </Text>
          {standardProps.subtitle}
        </View>

        <View style={styles.rightZone}>
          {standardProps.rightActions?.map((action, i) => (
            <Pressable key={i} style={styles.iconBtn} onPress={action.onPress} hitSlop={action.hitSlop ?? 4}>
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
        <Pressable style={styles.iconBtn} onPress={props.rightAction.onPress} hitSlop={4}>
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
    justifyContent: 'space-between',
  },

  // Spans the full bar width, always centered to the screen regardless of icon count.
  // Padding clears up to 2 icon buttons (44pt each) on either side.
  centerAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 100,
  },

  leftZone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 4,
    minWidth: 100,
  },
  rightZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
    minWidth: 100,
  },

  // 44×44 touch target — Pacific/WCAG minimum interactive size.
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 4,
    height: 52,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    flex: 1,
  },
});
