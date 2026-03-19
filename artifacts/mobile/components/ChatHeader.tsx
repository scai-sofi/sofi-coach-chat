import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

export function ChatHeader() {
  const insets = useSafeAreaInsets();
  const { setActivePanel, clearConversation, temporaryChat, setTemporaryChat, chatMode, startLiveChat } = useCoach();
  const [menuOpen, setMenuOpen] = useState(false);

  const topPad = Platform.OS === 'web' ? 54 : insets.top;

  return (
    <View style={[styles.headerWrap, { paddingTop: topPad }]}>
      <View style={styles.titleBar}>
        <View style={styles.leftZone}>
          <Pressable style={styles.iconBtn} onPress={() => {}}>
            <Feather name="x" size={14} color={Colors.contentPrimary} />
          </Pressable>
        </View>
        <View style={styles.centerZone}>
          <Text style={styles.title}>Coach</Text>
          {chatMode === 'live' && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          )}
        </View>
        <View style={styles.rightZone}>
          <Pressable style={styles.iconBtn} onPress={() => setActivePanel('scenarios')}>
            <Feather name="clock" size={20} color={Colors.contentSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => setMenuOpen(!menuOpen)}>
            <Feather name="more-horizontal" size={20} color={Colors.contentSecondary} />
          </Pressable>
        </View>
      </View>

      {temporaryChat && (
        <View style={styles.tempBanner}>
          <Feather name="shield-off" size={12} color="#fff" />
          <Text style={styles.tempText}>Temporary chat — nothing will be remembered</Text>
          <Pressable onPress={() => setTemporaryChat(false)} hitSlop={8}>
            <Feather name="x" size={12} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      )}

      {menuOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <Pressable style={styles.menuItem} onPress={() => { startLiveChat(); setMenuOpen(false); }}>
              <Text style={styles.menuText}>New chat</Text>
              <Feather name="edit" size={20} color={Colors.contentPrimary} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={() => { setActivePanel('memory'); setMenuOpen(false); }}>
              <Text style={styles.menuText}>Chat memory</Text>
              <Feather name="cpu" size={20} color={Colors.contentPrimary} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={() => { setActivePanel('goals'); setMenuOpen(false); }}>
              <Text style={styles.menuText}>Goals</Text>
              <Feather name="target" size={20} color={Colors.contentPrimary} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
              <Text style={styles.menuText}>Rename</Text>
              <Feather name="edit-3" size={20} color={Colors.contentPrimary} />
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => { clearConversation(); setMenuOpen(false); }}>
              <Text style={[styles.menuText, { color: Colors.danger }]}>Delete</Text>
              <Feather name="trash-2" size={20} color={Colors.danger} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: Colors.surfaceBase,
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
  },
  centerZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightZone: {
    width: 104,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  iconBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
  },
  tempBanner: {
    backgroundColor: Colors.contentPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  tempText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  liveText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#16a34a',
    lineHeight: 14,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 16,
    width: 212,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 16,
    shadowColor: 'rgba(10,10,10,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 50,
    overflow: 'hidden',
  },
  menuItem: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
    flex: 1,
  },
  menuDivider: {
    height: 0.75,
    backgroundColor: 'rgba(10,10,10,0.1)',
  },
});
