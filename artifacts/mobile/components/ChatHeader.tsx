import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { SCENARIOS } from '@/constants/scenarios';

function ClockIcon({ size = 20, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM9.99878 4.5C10.5511 4.5 10.9988 4.94772 10.9988 5.5V8.84582C10.9988 9.20313 11.1894 9.5333 11.4989 9.71191L13.531 10.8848C14.0093 11.1609 14.1733 11.7724 13.8972 12.2508C13.6211 12.7291 13.0095 12.8931 12.5312 12.617L10.4991 11.4441C9.57072 10.9082 8.99878 9.91776 8.99878 8.84582V5.5C8.99878 4.94772 9.44649 4.5 9.99878 4.5Z"
        fill={color}
      />
    </Svg>
  );
}

export function ChatHeader() {
  const insets = useSafeAreaInsets();
  const { setActivePanel, clearConversation, chatMode, activeScenario, startLiveChat, messages, saveAndClose } = useCoach();
  const [menuOpen, setMenuOpen] = useState(false);

  const topPad = Platform.OS === 'web' ? 54 : insets.top;

  const demoScenario = chatMode === 'demo' ? SCENARIOS.find(s => s.id === activeScenario) : null;
  const showMenu = messages.length > 0 || chatMode === 'demo';

  return (
    <View style={[styles.headerWrap, { paddingTop: topPad }]}>
      <View style={styles.titleBar}>
        <View style={styles.leftZone}>
          <Pressable style={styles.iconBtn} onPress={() => {
            if (messages.length === 0 && chatMode !== 'demo') {
              setActivePanel('scenarios');
            } else {
              saveAndClose();
            }
          }}>
            {messages.length === 0 && chatMode !== 'demo' ? (
              <Feather name="play-circle" size={20} color={Colors.contentSecondary} />
            ) : (
              <Feather name="x" size={14} color={Colors.contentPrimary} />
            )}
          </Pressable>
        </View>
        <View style={styles.centerZone}>
          <Text style={styles.title}>Coach</Text>
        </View>
        <View style={styles.rightZone}>
          <Pressable style={styles.iconBtn} onPress={() => setActivePanel('history')}>
            <ClockIcon size={20} color={Colors.contentPrimary} />
          </Pressable>
          {showMenu && (
            <Pressable style={styles.iconBtn} onPress={() => setMenuOpen(!menuOpen)}>
              <Feather name="more-horizontal" size={20} color={Colors.contentSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {demoScenario && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>Demo · {demoScenario.title}</Text>
          <Pressable onPress={() => startLiveChat()} hitSlop={8}>
            <Feather name="x" size={14} color={Colors.contentSecondary} />
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
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.contentSecondary,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  demoBanner: {
    backgroundColor: Colors.surfaceTint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  demoBannerText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.contentSecondary,
    lineHeight: 16,
    flex: 1,
    textAlign: 'left',
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
