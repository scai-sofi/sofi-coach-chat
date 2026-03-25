import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';

export interface OverflowMenuItem {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
  badge?: React.ReactNode;
}

interface OverflowMenuProps {
  items: OverflowMenuItem[];
  topOffset: number;
  onClose: () => void;
  zIndex?: number;
}

export function OverflowMenu({ items, topOffset, onClose, zIndex = 50 }: OverflowMenuProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.menuOverlay, { zIndex }]}>
      <Pressable style={[StyleSheet.absoluteFill, { top: topOffset }]} onPress={onClose} />
      <View style={[styles.menuPositioner, { paddingTop: topOffset }]}>
        <View style={[styles.menuShadow, { boxShadow: '0px 6px 16px rgba(10,10,10,0.08)' }]}>
          <View style={[styles.menuInner, { backgroundColor: colors.surfaceElevated }]}>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <Pressable
                  key={index}
                  style={isLast ? styles.menuItemLast : [styles.menuItem, { borderBottomColor: colors.surfaceEdge }]}
                  onPress={item.onPress}
                >
                  <Text style={[styles.menuText, { color: colors.contentPrimary }, item.danger && { color: colors.danger }]}>{item.label}</Text>
                  {item.badge}
                  {item.icon}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuPositioner: {
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menuShadow: {
    width: 212,
    borderRadius: 20,
  },
  menuInner: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  menuItem: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.75,
  },
  menuItemLast: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    flex: 1,
  },
});
