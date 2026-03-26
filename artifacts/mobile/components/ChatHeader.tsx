import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { AppBar, useAppBarHeight } from '@/components/AppBar';
import { OverflowMenu } from '@/components/OverflowMenu';
import {
  DemoIcon,
  CloseIcon,
  ClockIcon,
  MoreIcon,
  ChatNewIcon,
  MemoryMenuIcon,
  GoalsMenuIcon,
  SettingsMenuIcon,
  PencilMenuIcon,
  DeleteMenuIcon,
  FlipIcon,
} from '@/components/icons';

export function ChatHeader() {
  const { colors } = useTheme();
  const { setActivePanel, clearConversation, chatMode, startLiveChat, messages, saveAndClose, sessionTitle, goals } = useCoach();
  const draftGoalCount = goals.filter(g => g.status === 'DRAFT').length;
  const [menuOpen, setMenuOpen] = useState(false);
  const headerHeight = useAppBarHeight();

  const hasActiveChat = messages.length > 0 || chatMode === 'demo';

  const subtitle = chatMode === 'demo' ? (
    <View style={styles.agentStatus}>
      <View style={[styles.agentStatusDot, { backgroundColor: colors.contentBrand }]} />
      <Text style={[styles.agentStatusText, { color: colors.contentBrand }]}>Demo</Text>
    </View>
  ) : undefined;

  const rightActions = [
    {
      icon: <ClockIcon size={20} color={colors.contentPrimary} />,
      onPress: () => { Keyboard.dismiss(); setActivePanel('history'); },
    },
    {
      icon: <MoreIcon size={20} color={menuOpen ? colors.contentDimmed : colors.contentPrimary} />,
      onPress: () => { Keyboard.dismiss(); setMenuOpen(!menuOpen); },
    },
  ];

  const menuItems = hasActiveChat ? [
    {
      label: 'New chat',
      icon: <ChatNewIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { startLiveChat(); setMenuOpen(false); },
    },
    {
      label: 'Chat memory',
      icon: <MemoryMenuIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('memory'); setMenuOpen(false); },
    },
    {
      label: 'Goals',
      icon: <GoalsMenuIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('goals'); setMenuOpen(false); },
      badge: draftGoalCount > 0 ? (
        <View style={[styles.goalsBadge, { backgroundColor: colors.contentBrand }]}>
          <Text style={[styles.goalsBadgeText, { color: colors.whiteOnDark }]}>{draftGoalCount}</Text>
        </View>
      ) : undefined,
    },
    {
      label: 'Settings',
      icon: <SettingsMenuIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('settings'); setMenuOpen(false); },
    },
    {
      label: 'Rename',
      icon: <PencilMenuIcon size={24} color={colors.contentPrimary} />,
      onPress: () => setMenuOpen(false),
    },
    {
      label: 'Delete',
      icon: <DeleteMenuIcon size={24} color={colors.danger} />,
      onPress: () => { clearConversation(); setMenuOpen(false); },
      danger: true,
    },
  ] : [
    {
      label: 'Chat memory',
      icon: <MemoryMenuIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('memory'); setMenuOpen(false); },
    },
    {
      label: 'Goals',
      icon: <GoalsMenuIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('goals'); setMenuOpen(false); },
      badge: draftGoalCount > 0 ? (
        <View style={[styles.goalsBadge, { backgroundColor: colors.contentBrand }]}>
          <Text style={[styles.goalsBadgeText, { color: colors.whiteOnDark }]}>{draftGoalCount}</Text>
        </View>
      ) : undefined,
    },
    {
      label: 'Settings',
      icon: <SettingsMenuIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('settings'); setMenuOpen(false); },
    },
  ];

  return (
    <>
      <AppBar
        title={sessionTitle}
        subtitle={subtitle}
        leftAction={{
          icon: <FlipIcon
            front={<DemoIcon size={20} color={colors.contentPrimary} />}
            back={<CloseIcon size={24} color={colors.contentPrimary} />}
            flipped={hasActiveChat}
            size={24}
          />,
          onPress: () => {
            Keyboard.dismiss();
            if (!hasActiveChat) {
              setActivePanel('scenarios');
            } else {
              saveAndClose();
            }
          },
        }}
        rightActions={rightActions}
      />

      {menuOpen && (
        <OverflowMenu
          items={menuItems}
          topOffset={headerHeight}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  agentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agentStatusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  agentStatusText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  goalsBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginRight: 8,
  },
  goalsBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    lineHeight: 14,
  },
});
