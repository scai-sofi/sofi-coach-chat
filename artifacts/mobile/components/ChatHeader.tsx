import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
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

function ChatNewIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 15V12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12V15C20 17.2091 18.2091 19 16 19H8.32812C8.06302 19.0001 7.80856 19.1055 7.62109 19.293L5.51758 21.3965C5.13114 21.7829 4.60702 22 4.06055 22C2.92256 21.9999 2.00006 21.0774 2 19.9395V9C2 6.79086 3.79086 5 6 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H6C4.89543 7 4 7.89543 4 9V19.9395C4.00006 19.9729 4.02714 19.9999 4.06055 20C4.07658 20 4.09215 19.9937 4.10352 19.9824L6.20703 17.8789C6.76957 17.3164 7.53258 17.0001 8.32812 17H16C17.1046 17 18 16.1046 18 15ZM18 9V7H16C15.4477 7 15 6.55228 15 6C15 5.44772 15.4477 5 16 5H18V3C18 2.44772 18.4477 2 19 2C19.5523 2 20 2.44772 20 3V5H22C22.5523 5 23 5.44772 23 6C23 6.55228 22.5523 7 22 7H20V9C20 9.55228 19.5523 10 19 10C18.4477 10 18 9.55228 18 9Z"
        fill={color}
      />
    </Svg>
  );
}

function MemoryIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5C4 4.44772 4.44772 4 5 4H7C7.55228 4 8 4.44772 8 5V19C8 19.5523 7.55228 20 7 20H5C4.44772 20 4 19.5523 4 19V5Z"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <Path
        d="M10 7C10 6.44772 10.4477 6 11 6H13C13.5523 6 14 6.44772 14 7V19C14 19.5523 13.5523 20 13 20H11C10.4477 20 10 19.5523 10 19V7Z"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <Path
        d="M16 9C16 8.44772 16.4477 8 17 8H19C19.5523 8 20 8.44772 20 9V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V9Z"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

function PencilMenuIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.474 5.408l2.118 2.118m-.756-3.982L12.109 9.27a2.118 2.118 0 00-.58.849l-.755 2.647a.353.353 0 00.431.431l2.647-.755a2.118 2.118 0 00.849-.58l5.727-5.727a1.496 1.496 0 10-2.116-2.116z"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M19 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function DeleteMenuIcon({ size = 24, color = Colors.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function GoalsMenuIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color} strokeWidth={1.5}
      />
      <Path
        d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
        stroke={color} strokeWidth={1.5}
      />
      <Path
        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
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
  const headerHeight = topPad + 44;

  const hasActiveChat = messages.length > 0 || chatMode === 'demo';

  return (
    <>
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
              <Pressable
                style={[styles.iconBtn, menuOpen && styles.iconBtnPressed]}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <MoreIcon size={20} color={menuOpen ? '#FFFFFF' : Colors.contentPrimary} />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {menuOpen && (
        <View style={styles.menuOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={[styles.menuPositioner, { paddingTop: headerHeight }]}>
            <View style={styles.menu}>
              <Pressable style={styles.menuItem} onPress={() => { startLiveChat(); setMenuOpen(false); }}>
                <Text style={styles.menuText}>New chat</Text>
                <ChatNewIcon size={24} color={Colors.contentPrimary} />
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => { setActivePanel('memory'); setMenuOpen(false); }}>
                <Text style={styles.menuText}>Chat memory</Text>
                <MemoryIcon size={24} color={Colors.contentPrimary} />
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => { setActivePanel('goals'); setMenuOpen(false); }}>
                <Text style={styles.menuText}>Goals</Text>
                <GoalsMenuIcon size={24} color={Colors.contentPrimary} />
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
                <Text style={styles.menuText}>Rename</Text>
                <PencilMenuIcon size={24} color={Colors.contentPrimary} />
              </Pressable>
              <Pressable style={styles.menuItemLast} onPress={() => { clearConversation(); setMenuOpen(false); }}>
                <Text style={[styles.menuText, { color: Colors.danger }]}>Delete</Text>
                <DeleteMenuIcon size={24} color={Colors.danger} />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </>
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
  iconBtnPressed: {
    backgroundColor: Colors.contentPrimary,
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
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  menuPositioner: {
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menu: {
    width: 212,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 16,
    shadowColor: 'rgba(10,10,10,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.75,
    borderBottomColor: 'rgba(10,10,10,0.1)',
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
    color: Colors.contentPrimary,
    lineHeight: 20,
    flex: 1,
  },
});
