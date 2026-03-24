import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard } from 'react-native';
import Colors from '@/constants/colors';
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
} from '@/components/icons';

export function ChatHeader() {
  const { setActivePanel, clearConversation, chatMode, startLiveChat, messages, saveAndClose, sessionTitle } = useCoach();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerHeight = useAppBarHeight();

  const hasActiveChat = messages.length > 0 || chatMode === 'demo';

  const subtitle = chatMode === 'demo' ? (
    <View style={styles.agentStatus}>
      <View style={styles.agentStatusDot} />
      <Text style={styles.agentStatusText}>Demo</Text>
    </View>
  ) : undefined;

  const rightActions = [
    {
      icon: <ClockIcon size={20} color={Colors.contentPrimary} />,
      onPress: () => { Keyboard.dismiss(); setActivePanel('history'); },
    },
    ...(hasActiveChat ? [{
      icon: <MoreIcon size={20} color={menuOpen ? Colors.contentDimmed : Colors.contentPrimary} />,
      onPress: () => { Keyboard.dismiss(); setMenuOpen(!menuOpen); },
    }] : []),
  ];

  const menuItems = [
    {
      label: 'New chat',
      icon: <ChatNewIcon size={24} color={Colors.contentPrimary} />,
      onPress: () => { startLiveChat(); setMenuOpen(false); },
    },
    {
      label: 'Chat memory',
      icon: <MemoryMenuIcon size={24} color={Colors.contentPrimary} />,
      onPress: () => { setActivePanel('memory'); setMenuOpen(false); },
    },
    {
      label: 'Goals',
      icon: <GoalsMenuIcon size={24} color={Colors.contentPrimary} />,
      onPress: () => { setActivePanel('goals'); setMenuOpen(false); },
    },
    {
      label: 'Settings',
      icon: <SettingsMenuIcon size={24} color={Colors.contentPrimary} />,
      onPress: () => { setActivePanel('settings'); setMenuOpen(false); },
    },
    {
      label: 'Rename',
      icon: <PencilMenuIcon size={24} color={Colors.contentPrimary} />,
      onPress: () => setMenuOpen(false),
    },
    {
      label: 'Delete',
      icon: <DeleteMenuIcon size={24} color={Colors.danger} />,
      onPress: () => { clearConversation(); setMenuOpen(false); },
      danger: true,
    },
  ];

  return (
    <>
      <AppBar
        title={sessionTitle}
        subtitle={subtitle}
        leftAction={{
          icon: !hasActiveChat
            ? <DemoIcon size={20} color={Colors.contentPrimary} />
            : <CloseIcon size={24} color={Colors.contentPrimary} />,
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
    backgroundColor: Colors.contentBrand,
  },
  agentStatusText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.contentBrand,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
});
