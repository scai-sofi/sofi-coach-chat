import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
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
    <Svg width={size} height={size} viewBox="0 0 21 20" fill="none">
      <Path
        d="M16 13V10C16 9.44772 16.4477 9 17 9C17.5523 9 18 9.44772 18 10V13C18 15.2091 16.2091 17 14 17H6.32812C6.06302 17.0001 5.80856 17.1055 5.62109 17.293L3.51758 19.3965C3.13114 19.7829 2.60702 20 2.06055 20C0.922564 19.9999 6.18439e-05 19.0774 0 17.9395V7C0 4.79086 1.79086 3 4 3H11C11.5523 3 12 3.44772 12 4C12 4.55228 11.5523 5 11 5H4C2.89543 5 2 5.89543 2 7V17.9395C2.00006 17.9729 2.02714 17.9999 2.06055 18C2.07658 18 2.09215 17.9937 2.10352 17.9824L4.20703 15.8789C4.76957 15.3164 5.53258 15.0001 6.32812 15H14C15.1046 15 16 14.1046 16 13ZM16 7V5H14C13.4477 5 13 4.55228 13 4C13 3.44772 13.4477 3 14 3H16V1C16 0.447715 16.4477 0 17 0C17.5523 0 18 0.447715 18 1V3H20C20.5523 3 21 3.44772 21 4C21 4.55228 20.5523 5 20 5H18V7C18 7.55228 17.5523 8 17 8C16.4477 8 16 7.55228 16 7Z"
        fill={color}
      />
    </Svg>
  );
}

function FpoIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2.6C0 1.16406 1.16406 0 2.6 0H4.2002C4.75248 0 5.2002 0.447715 5.2002 1C5.2002 1.55228 4.75248 2 4.2002 2H2.6C2.26863 2 2 2.26863 2 2.6V8H9.00059C9.33196 8 9.60059 7.73137 9.60059 7.4V2.6C9.60059 2.26871 9.33194 2 9.00049 2C8.66904 2 8.40039 2.26871 8.40039 2.6V5.8C8.40039 6.35228 7.95268 6.8 7.40039 6.8C6.84811 6.8 6.40039 6.35228 6.40039 5.8V2.6C6.40039 1.16398 7.56463 0 9.00049 0C10.4363 0 11.6006 1.16398 11.6006 2.6V7.4C11.6006 8.83594 10.4365 10 9.00059 10H2V17C2 17.5523 1.55228 18 1 18C0.447715 18 0 17.5523 0 17V2.6ZM15.4004 2C15.0692 2 14.8008 2.26845 14.8008 2.59961V15.4004C14.8008 15.7315 15.0692 16 15.4004 16C15.7315 16 16 15.7315 16 15.4004V2.59961C16 2.26845 15.7315 2 15.4004 2ZM12.8008 2.59961C12.8008 1.16388 13.9647 0 15.4004 0C16.8361 0 18 1.16388 18 2.59961V15.4004C18 16.8361 16.8361 18 15.4004 18C13.9647 18 12.8008 16.8361 12.8008 15.4004V2.59961ZM7.40039 11.2C7.95268 11.2 8.40039 11.6477 8.40039 12.2V17C8.40039 17.5523 7.95268 18 7.40039 18C6.84811 18 6.40039 17.5523 6.40039 17V12.2C6.40039 11.6477 6.84811 11.2 7.40039 11.2Z"
        fill={color}
      />
    </Svg>
  );
}

function PencilMenuIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.0858 1C11.7261 0.35971 12.5945 0 13.5 0C14.4055 0 15.2739 0.359711 15.9142 1L17 2.08579C17.6403 2.72608 18 3.59449 18 4.5C18 5.40551 17.6403 6.27392 17 6.91421L7.61893 16.2953C7.21549 16.6987 6.70536 16.9788 6.1484 17.1025L2.31349 17.9547C2.17808 17.9848 2.03979 18 1.90109 18C0.851145 18 0 17.1489 0 16.0989C0 15.9602 0.0151805 15.8219 0.0452704 15.6865L0.897472 11.8516C1.02124 11.2946 1.30127 10.7845 1.70471 10.3811L9.54257 2.54321L11.0858 1ZM10.25 4.66421L3.11893 11.7953C2.98445 11.9298 2.8911 12.0998 2.84985 12.2855L2.03136 15.9686L5.71454 15.1502C5.90019 15.1089 6.07023 15.0156 6.20471 14.8811L13.3358 7.75L10.25 4.66421ZM14.75 6.33579L11.6642 3.25L12.5 2.41421C12.7652 2.149 13.1249 2 13.5 2C13.8751 2 14.2348 2.149 14.5 2.41421L15.5858 3.5C15.851 3.76522 16 4.12493 16 4.5C16 4.87507 15.851 5.23478 15.5858 5.5L14.75 6.33579Z"
        fill={color}
      />
    </Svg>
  );
}

function DeleteMenuIcon({ size = 24, color = Colors.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2C4 0.89543 4.89543 0 6 0H10C11.1046 0 12 0.89543 12 2V3H15C15.5523 3 16 3.44772 16 4C16 4.55228 15.5523 5 15 5H1C0.447715 5 0 4.55228 0 4C0 3.44772 0.447715 3 1 3H4V2ZM6 3H10V2H6V3ZM2 5.99699C2.55228 5.99699 3 6.44471 3 6.99699V16C3 17.1046 3.89543 18 5 18H11C12.1046 18 13 17.1046 13 16V6.99699C13 6.44471 13.4477 5.99699 14 5.99699C14.5523 5.99699 15 6.44471 15 6.99699V16C15 18.2091 13.2091 20 11 20H5C2.79086 20 1 18.2091 1 16V6.99699C1 6.44471 1.44772 5.99699 2 5.99699ZM6 7C6.55228 7 7 7.44772 7 8V15C7 15.5523 6.55228 16 6 16C5.44772 16 5 15.5523 5 15V8C5 7.44772 5.44772 7 6 7ZM10 7C10.5523 7 11 7.44772 11 8V15C11 15.5523 10.5523 16 10 16C9.44771 16 9 15.5523 9 15V8C9 7.44772 9.44771 7 10 7Z"
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
                style={styles.iconBtn}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <MoreIcon size={20} color={menuOpen ? '#BDBBB9' : Colors.contentPrimary} />
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
                <FpoIcon size={24} color={Colors.contentPrimary} />
              </Pressable>
              <Pressable style={styles.menuItem} onPress={() => { setActivePanel('goals'); setMenuOpen(false); }}>
                <Text style={styles.menuText}>Goals</Text>
                <FpoIcon size={24} color={Colors.contentPrimary} />
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
