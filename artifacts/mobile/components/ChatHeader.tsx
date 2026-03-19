import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useCoach } from '@/context/CoachContext';

export function ChatHeader() {
  const insets = useSafeAreaInsets();
  const { setActivePanel, clearConversation, temporaryChat, setTemporaryChat } = useCoach();
  const [menuOpen, setMenuOpen] = useState(false);

  const topPad = Platform.OS === 'web' ? 54 : insets.top;

  return (
    <View style={[styles.headerWrap, { paddingTop: topPad }]}>
      <View style={styles.titleBar}>
        <View style={styles.leftZone}>
          <Pressable style={styles.iconBtn} onPress={() => {}}>
            <Feather name="x" size={18} color={Colors.contentPrimary} />
          </Pressable>
        </View>
        <View style={styles.centerZone}>
          <Feather name="star" size={14} color={Colors.contentPrimary} style={{ marginRight: 4 }} />
          <Text style={styles.title}>Coach</Text>
        </View>
        <View style={styles.rightZone}>
          <Pressable style={styles.iconBtn} onPress={() => setActivePanel('scenarios')}>
            <Feather name="layers" size={20} color={Colors.contentSecondary} />
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
        <View style={styles.menu}>
          <Pressable style={styles.menuItem} onPress={() => { clearConversation(); setMenuOpen(false); }}>
            <Text style={styles.menuText}>New chat</Text>
            <Feather name="message-circle" size={20} color={Colors.contentPrimary} />
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable style={styles.menuItem} onPress={() => { setActivePanel('memory'); setMenuOpen(false); }}>
            <Text style={styles.menuText}>Coach memory</Text>
            <Feather name="cpu" size={20} color={Colors.contentPrimary} />
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable style={styles.menuItem} onPress={() => { setActivePanel('goals'); setMenuOpen(false); }}>
            <Text style={styles.menuText}>Goals</Text>
            <Feather name="target" size={20} color={Colors.contentPrimary} />
          </Pressable>
          <View style={styles.menuDivider} />
          <Pressable style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => { clearConversation(); setMenuOpen(false); }}>
            <Text style={[styles.menuText, { color: Colors.danger }]}>Delete</Text>
            <Feather name="trash-2" size={20} color={Colors.danger} />
          </Pressable>
        </View>
      )}

      {menuOpen && <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />}
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
    width: 80,
    paddingLeft: 16,
    flexDirection: 'row',
  },
  centerZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightZone: {
    width: 80,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  iconBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.contentPrimary,
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
    fontFamily: 'Inter_500Medium',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 50,
  },
  menuItem: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.contentPrimary,
  },
  menuDivider: {
    height: 0.75,
    backgroundColor: 'rgba(10,10,10,0.1)',
  },
});
