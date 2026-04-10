import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard } from 'react-native';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { AppBar, useAppBarHeight } from './AppBar';
import { OverflowMenu } from './OverflowMenu';
import {
  ClockIcon,
  MoreIcon,
  ChatNewIcon,
  MemoryMenuIcon,
  SettingsMenuIcon,
  PencilMenuIcon,
  DeleteMenuIcon,
  CloseIcon,
  DemoIcon,
} from './icons';

export function ChatHeader() {
  const { colors } = useTheme();
  const { goBack, navigate } = usePhase2Nav();
  const { setActivePanel, clearConversation, chatMode, startLiveChat, messages, saveAndClose, sessionTitle } = useCoach();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerHeight = useAppBarHeight();

  const hasActiveChat = messages.length > 0 || chatMode === 'demo';

  const dismissChat = () => {
    Keyboard.dismiss();
    setMenuOpen(false);
    if (hasActiveChat) {
      saveAndClose();
    }
    setActivePanel('none');
    goBack();
  };

  const subtitle = chatMode === 'demo' ? (
    <View style={styles.agentStatus}>
      <View style={[styles.agentStatusDot, { backgroundColor: colors.contentBrand }]} />
      <Text style={[styles.agentStatusText, { color: colors.contentBrand }]}>Demo</Text>
    </View>
  ) : undefined;

  const rightActions = [
    {
      icon: <MemoryMenuIcon size={20} color={colors.contentPrimary} />,
      onPress: () => { Keyboard.dismiss(); navigate('about-me'); },
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
      label: 'Chat history',
      icon: <ClockIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('history'); setMenuOpen(false); },
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
      label: 'Chat history',
      icon: <ClockIcon size={24} color={colors.contentPrimary} />,
      onPress: () => { setActivePanel('history'); setMenuOpen(false); },
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
          icon: <CloseIcon size={24} color={colors.contentPrimary} />,
          onPress: dismissChat,
        }}
        leftExtra={
          <Pressable onPress={() => { Keyboard.dismiss(); setActivePanel('flows'); }} hitSlop={8} style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
            <DemoIcon size={24} color={colors.contentPrimary} />
          </Pressable>
        }
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
});
