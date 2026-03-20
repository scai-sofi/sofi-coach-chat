import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, G } from 'react-native-svg';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';

function DemoIcon({ size = 20, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1C6.44772 1 6 1.44772 6 2C6 2.55228 6.44772 3 7 3V7.382L2.55279 16.2764C1.96298 17.456 2.82236 18.8333 4.13877 18.9836L4.23607 18.9917H15.7639L15.8612 18.9836C17.1776 18.8333 18.037 17.456 17.4472 16.2764L13 7.382V3C13.5523 3 14 2.55228 14 2C14 1.44772 13.5523 1 13 1H7ZM11 3H9V8C9 8.17943 8.9532 8.35591 8.86401 8.5122L8.78885 8.62918L4.76816 16.6756C4.67615 16.8516 4.72822 17 4.85 17H15.15C15.2718 17 15.3239 16.8516 15.2318 16.6756L11.2111 8.62918L11.136 8.5122C11.0532 8.36635 11.0065 8.20258 11.001 8.03356L11 8V3Z"
        fill={color}
      />
      <Path
        d="M7.5 14C7.5 13.4477 7.94772 13 8.5 13H11.5C12.0523 13 12.5 13.4477 12.5 14C12.5 14.5523 12.0523 15 11.5 15H8.5C7.94772 15 7.5 14.5523 7.5 14Z"
        fill={color}
      />
    </Svg>
  );
}

function CloseIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  const s = size * 0.614;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.93 4.93C5.32 4.54 5.95 4.54 6.34 4.93L12 10.59L17.66 4.93C18.05 4.54 18.68 4.54 19.07 4.93C19.46 5.32 19.46 5.95 19.07 6.34L13.41 12L19.07 17.66C19.46 18.05 19.46 18.68 19.07 19.07C18.68 19.46 18.05 19.46 17.66 19.07L12 13.41L6.34 19.07C5.95 19.46 5.32 19.46 4.93 19.07C4.54 18.68 4.54 18.05 4.93 17.66L10.59 12L4.93 6.34C4.54 5.95 4.54 5.32 4.93 4.93Z"
        fill={color}
      />
    </Svg>
  );
}

function ClockIcon({ size = 20, color = Colors.contentPrimary }: { size?: number; color?: string }) {
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

function MoreIcon({ size = 20, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
        fill={color}
      />
      <Path
        d="M7 10C7 10.6904 6.44036 11.25 5.75 11.25C5.05964 11.25 4.5 10.6904 4.5 10C4.5 9.30964 5.05964 8.75 5.75 8.75C6.44036 8.75 7 9.30964 7 10Z"
        fill={color}
      />
      <Path
        d="M11.25 10C11.25 10.6904 10.6904 11.25 10 11.25C9.30964 11.25 8.75 10.6904 8.75 10C8.75 9.30964 9.30964 8.75 10 8.75C10.6904 8.75 11.25 9.30964 11.25 10Z"
        fill={color}
      />
      <Path
        d="M15.5 10C15.5 10.6904 14.9404 11.25 14.25 11.25C13.5596 11.25 13 10.6904 13 10C13 9.30964 13.5596 8.75 14.25 8.75C14.9404 8.75 15.5 9.30964 15.5 10Z"
        fill={color}
      />
    </Svg>
  );
}

export function ChatHeader() {
  const insets = useSafeAreaInsets();
  const { setActivePanel, clearConversation, chatMode, startLiveChat, messages, saveAndClose, sessionTitle } = useCoach();
  const [menuOpen, setMenuOpen] = useState(false);

  const topPad = insets.top;

  const hasActiveChat = messages.length > 0 || chatMode === 'demo';

  return (
    <View style={[styles.headerWrap, { paddingTop: topPad }]}>
      <View style={styles.titleBar}>
        <View style={styles.leftZone}>
          <Pressable style={styles.iconBtn} onPress={() => {
            if (!hasActiveChat) {
              setActivePanel('scenarios');
            } else {
              saveAndClose();
            }
          }}>
            {!hasActiveChat ? (
              <DemoIcon size={20} color={Colors.contentPrimary} />
            ) : (
              <CloseIcon size={24} color={Colors.contentPrimary} />
            )}
          </Pressable>
        </View>
        <View style={styles.centerZone}>
          <Text style={styles.title} numberOfLines={1}>{sessionTitle}</Text>
          {chatMode === 'demo' && (
            <View style={styles.agentStatus}>
              <View style={styles.agentStatusDot} />
              <Text style={styles.agentStatusText}>Demo</Text>
            </View>
          )}
        </View>
        <View style={styles.rightZone}>
          <Pressable style={styles.iconBtn} onPress={() => setActivePanel('history')}>
            <ClockIcon size={20} color={Colors.contentPrimary} />
          </Pressable>
          {hasActiveChat && (
            <Pressable style={styles.iconBtn} onPress={() => setMenuOpen(!menuOpen)}>
              <MoreIcon size={20} color={Colors.contentPrimary} />
            </Pressable>
          )}
        </View>
      </View>

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
    overflow: 'hidden',
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
