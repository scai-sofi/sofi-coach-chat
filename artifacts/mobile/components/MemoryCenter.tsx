import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, Dimensions, Animated as RNAnimated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { useToast } from '@/components/Toast';
import { MemoryCategory, MEMORY_CATEGORY_LABELS, MEMORY_CATEGORY_ORDER, Memory } from '@/constants/types';

function GpuIcon({ size = 18, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2C9 1.44772 9.44772 1 10 1C10.5523 1 11 1.44772 11 2V4H13V2C13 1.44772 13.4477 1 14 1C14.5523 1 15 1.44772 15 2V4H18C19.1046 4 20 4.89543 20 6V9H22C22.5523 9 23 9.44772 23 10C23 10.5523 22.5523 11 22 11H20V13H22C22.5523 13 23 13.4477 23 14C23 14.5523 22.5523 15 22 15H20V18C20 19.1046 19.1046 20 18 20H15V22C15 22.5523 14.5523 23 14 23C13.4477 23 13 22.5523 13 22V20H11V22C11 22.5523 10.5523 23 10 23C9.44772 23 9 22.5523 9 22V20H6C4.89543 20 4 19.1046 4 18V15H2C1.44772 15 1 14.5523 1 14C1 13.4477 1.44772 13 2 13H4V11H2C1.44772 11 1 10.5523 1 10C1 9.44772 1.44772 9 2 9H4V6C4 4.89543 4.89543 4 6 4H9V2ZM6 6H18V18H6V6ZM9 9H15V15H9V9ZM11 11V13H13V11H11Z"
        fill={color}
      />
    </Svg>
  );
}

function ChevronLeftIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L9.41421 12L16.7071 19.2929C17.0976 19.6834 17.0976 20.3166 16.7071 20.7071C16.3166 21.0976 15.6834 21.0976 15.2929 20.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289Z"
        fill={color}
      />
    </Svg>
  );
}

function SearchIcon({ size = 16, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
        stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function FilterIcon({ size = 16, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M2 4h12M4 8h8M6 12h4" stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PencilIcon({ size = 13, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.93934 0.75C8.41956 0.269784 9.07087 0 9.75 0C10.4291 0 11.0804 0.269783 11.5607 0.75L12.25 1.43934C12.7302 1.91956 13 2.57087 13 3.25C13 3.92913 12.7302 4.58044 12.25 5.06066L5.58452 11.7261C5.28634 12.0243 4.91036 12.2327 4.49947 12.3275L1.74336 12.9636C1.6384 12.9878 1.53103 13 1.42332 13C0.637241 13 0 12.3628 0 11.5767C0 11.469 0.0122281 11.3616 0.0364494 11.2566L0.672473 8.50053C0.767295 8.08964 0.97568 7.71366 1.27386 7.41548L7.93934 0.75ZM7.375 3.43566L2.33452 8.47614C2.23513 8.57553 2.16567 8.70086 2.13406 8.83782L1.52562 11.4744L4.16218 10.8659C4.29914 10.8343 4.42447 10.7649 4.52386 10.6655L9.56434 5.625L7.375 3.43566ZM10.625 4.56434L8.43566 2.375L9 1.81066C9.19891 1.61175 9.4687 1.5 9.75 1.5C10.0313 1.5 10.3011 1.61175 10.5 1.81066L11.1893 2.5C11.3883 2.69891 11.5 2.9687 11.5 3.25C11.5 3.5313 11.3883 3.80109 11.1893 4L10.625 4.56434Z"
        fill={color}
      />
    </Svg>
  );
}

function PauseIcon({ size = 13, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  const w = size * (9.83333 / 12.1667);
  return (
    <Svg width={w} height={size} viewBox="0 0 9.83333 12.1667" fill="none">
      <Path
        d="M8.41667 0.75H7.08333C6.71514 0.75 6.41667 1.04848 6.41667 1.41667V10.75C6.41667 11.1182 6.71514 11.4167 7.08333 11.4167H8.41667C8.78486 11.4167 9.08333 11.1182 9.08333 10.75V1.41667C9.08333 1.04848 8.78486 0.75 8.41667 0.75Z"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M2.75 0.75H1.41667C1.04848 0.75 0.75 1.04848 0.75 1.41667V10.75C0.75 11.1182 1.04848 11.4167 1.41667 11.4167H2.75C3.11819 11.4167 3.41667 11.1182 3.41667 10.75V1.41667C3.41667 1.04848 3.11819 0.75 2.75 0.75Z"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlayIcon({ size = 13, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  const w = size * (11 / 13);
  return (
    <View style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingLeft: 1.5 }}>
      <Svg width={w} height={size} viewBox="0 0 11 13" fill="none">
        <Path
          d="M1.75 1.51795V11.482C1.75 11.7784 2.07378 11.9568 2.32283 11.7916L9.82717 6.80959C10.0506 6.66148 10.0506 6.33852 9.82717 6.19041L2.32283 1.20836C2.07378 1.04318 1.75 1.22159 1.75 1.51795Z"
          stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function DeleteIcon({ size = 14.5, color = Colors.danger }: { size?: number; color?: string }) {
  const aspect = 11.5 / 14.5;
  return (
    <Svg width={size * aspect} height={size} viewBox="0 0 11.5 14.5" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.83594 1.5C2.83594 0.671571 3.50751 0 4.33594 0L7.16797 0C7.9964 0 8.66797 0.671582 8.66797 1.50001V2.24702H10.75C11.1642 2.24702 11.5 2.58281 11.5 2.99702C11.5 3.41123 11.1642 3.74702 10.75 3.74702H0.750003C0.33579 3.74702 0 3.41124 0 2.99702C0 2.58281 0.335783 2.24702 0.749997 2.24702L2.83594 2.24701V1.5ZM4.33594 2.24701L7.16797 2.24702V1.50001L4.33594 1.5V2.24701ZM1.5 4.50001C1.91421 4.50001 2.25 4.8358 2.25 5.25001V11.75C2.25 12.4404 2.80964 13 3.5 13H8C8.69036 13 9.25 12.4404 9.25 11.75V5.25001C9.25 4.8358 9.58579 4.50001 10 4.50001C10.4142 4.50001 10.75 4.8358 10.75 5.25001V11.75C10.75 13.2688 9.51878 14.5 8 14.5H3.5C1.98122 14.5 0.75 13.2688 0.75 11.75V5.25001C0.75 4.8358 1.08579 4.50001 1.5 4.50001Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.33325 5.08296C4.74747 5.08296 5.08325 5.41875 5.08325 5.83296V10.914C5.08325 11.3283 4.74747 11.664 4.33325 11.664C3.91904 11.664 3.58325 11.3283 3.58325 10.914V5.83296C3.58325 5.41875 3.91904 5.08296 4.33325 5.08296ZM7.1665 5.08296C7.58072 5.08296 7.9165 5.41875 7.9165 5.83296V10.914C7.9165 11.3283 7.58072 11.664 7.1665 11.664C6.75229 11.664 6.4165 11.3283 6.4165 10.914V5.83296C6.4165 5.41875 6.75229 5.08296 7.1665 5.08296Z"
        fill={color}
      />
    </Svg>
  );
}

function MemoryCard({ memory, onEditStart, highlighted }: { memory: Memory; onEditStart?: (y: number) => void; highlighted?: boolean }) {
  const { editMemory, pauseMemory, deleteMemory, restoreMemory } = useCoach();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(memory.content);
  const cardRef = useRef<View>(null);
  const highlightAnim = useRef(new RNAnimated.Value(highlighted ? 1 : 0)).current;
  const MAX_CHARS = 300;

  useEffect(() => {
    if (highlighted) {
      highlightAnim.setValue(1);
      RNAnimated.timing(highlightAnim, { toValue: 0, duration: 2000, delay: 800, useNativeDriver: false }).start();
    }
  }, [highlighted, highlightAnim]);

  const sourceLabel = memory.source === 'EXPLICIT' ? 'You created' : 'AI inferred';
  const dateLabel = memory.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleEdit = () => {
    setEditing(true);
    if (cardRef.current && onEditStart) {
      cardRef.current.measureInWindow((_x, y, _w, h) => {
        onEditStart(y + h);
      });
    }
  };

  const handleSave = () => {
    Keyboard.dismiss();
    const trimmed = editText.trim();
    if (trimmed.length > 0 && trimmed.length <= MAX_CHARS) {
      editMemory(memory.id, trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setEditText(memory.content);
    setEditing(false);
  };

  return (
    <RNAnimated.View ref={cardRef} style={[styles.memCard, memory.status === 'PAUSED' && { opacity: 0.5 }, highlighted && { borderColor: highlightAnim.interpolate({ inputRange: [0, 1], outputRange: ['transparent', Colors.contentPrimary] }), borderWidth: 1.5 }]}>
      {editing ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={(t) => { if (t.length <= MAX_CHARS) setEditText(t); }}
            multiline
            autoFocus
            underlineColorAndroid="transparent"
            textAlignVertical="top"
            scrollEnabled={false}
          />
          <View style={styles.editToolRow}>
            <Text style={styles.editCharCount}>{editText.length}/{MAX_CHARS}</Text>
            <View style={styles.editButtonGroup}>
              <Pressable style={styles.editSaveBtn} onPress={handleSave}>
                <Text style={styles.editSaveText}>Save</Text>
              </Pressable>
              <Pressable style={styles.editCancelBtn} onPress={handleCancel}>
                <Text style={styles.editCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.memContent}>{memory.content}</Text>
          <View style={styles.memMeta}>
            <Text style={styles.memMetaText}>
              {memory.status === 'PAUSED' ? 'Paused · not used in chat' : `${sourceLabel} · ${dateLabel}`}
            </Text>
            <View style={styles.memActions}>
              <Pressable style={styles.memActionBtn} onPress={handleEdit}>
                <PencilIcon />
              </Pressable>
              <Pressable style={styles.memActionBtn} onPress={() => {
                const wasPaused = memory.status === 'PAUSED';
                pauseMemory(memory.id);
                showToast({
                  message: wasPaused ? 'Memory resumed.' : 'Memory paused.',
                  action: { label: 'Undo', onPress: () => pauseMemory(memory.id) },
                });
              }}>
                {memory.status === 'PAUSED' ? (
                  <PlayIcon />
                ) : (
                  <PauseIcon />
                )}
              </Pressable>
              <Pressable style={styles.memActionBtn} onPress={() => {
                deleteMemory(memory.id);
                showToast({
                  message: 'Memory deleted.',
                  action: { label: 'Undo', onPress: () => restoreMemory(memory.id) },
                });
              }}>
                <DeleteIcon />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </RNAnimated.View>
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

function PauseMenuIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="-3 -2 16 16" fill="none">
      <Path
        d="M8.41667 0.75H7.08333C6.71514 0.75 6.41667 1.04848 6.41667 1.41667V10.75C6.41667 11.1182 6.71514 11.4167 7.08333 11.4167H8.41667C8.78486 11.4167 9.08333 11.1182 9.08333 10.75V1.41667C9.08333 1.04848 8.78486 0.75 8.41667 0.75Z"
        stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M2.75 0.75H1.41667C1.04848 0.75 0.75 1.04848 0.75 1.41667V10.75C0.75 11.1182 1.04848 11.4167 1.41667 11.4167H2.75C3.11819 11.4167 3.41667 11.1182 3.41667 10.75V1.41667C3.41667 1.04848 3.11819 0.75 2.75 0.75Z"
        stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlayMenuIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 4.83167C6 3.94839 6.96725 3.40832 7.72111 3.89137L19.0711 11.0597C19.7889 11.5196 19.7889 12.5804 19.0711 13.0403L7.72111 20.2086C6.96725 20.6917 6 20.1516 6 19.2683V4.83167Z"
        fill={color}
      />
    </Svg>
  );
}

function DeleteMenuIcon({ size = 24, color = Colors.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6C4 5.44772 4.44772 5 5 5H8V4ZM10 5H14V4H10V5ZM6 7.99699C6.55228 7.99699 7 8.44471 7 8.99699V18C7 19.1046 7.89543 20 9 20H15C16.1046 20 17 19.1046 17 18V8.99699C17 8.44471 17.4477 7.99699 18 7.99699C18.5523 7.99699 19 8.44471 19 8.99699V18C19 20.2091 17.2091 22 15 22H9C6.79086 22 5 20.2091 5 18V8.99699C5 8.44471 5.44772 7.99699 6 7.99699ZM10 9C10.5523 9 11 9.44772 11 10V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V10C9 9.44772 9.44772 9 10 9ZM14 9C14.5523 9 15 9.44772 15 10V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V10C13 9.44772 13.4477 9 14 9Z"
        fill={color}
      />
    </Svg>
  );
}

export function MemoryCenter() {
  const insets = useSafeAreaInsets();
  const { memories, memoryMode, setActivePanel, pauseAllMemories, deleteAllMemories, highlightedMemoryId } = useCoach();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCat, setFilterCat] = useState<MemoryCategory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const { showToast } = useToast();

  const visibleMemories = useMemo(() => {
    return memories.filter(m => {
      if (m.status === 'DELETED') return false;
      if (filterCat && m.category !== filterCat) return false;
      if (search && !m.content.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [memories, filterCat, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    for (const cat of MEMORY_CATEGORY_ORDER) {
      const items = visibleMemories.filter(m => m.category === cat);
      if (items.length > 0) groups[cat] = items;
    }
    return groups;
  }, [visibleMemories]);

  const catCounts = useMemo(() => {
    const counts: Partial<Record<MemoryCategory, number>> = {};
    memories.filter(m => m.status !== 'DELETED').forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [memories]);

  const handleEditStart = useCallback((cardBottomY: number) => {
    const keyboardApproxHeight = 320;
    const screenHeight = Dimensions.get('window').height;
    const visibleBottom = screenHeight - keyboardApproxHeight;
    if (cardBottomY > visibleBottom) {
      const scrollBy = cardBottomY - visibleBottom + 60;
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: scrollOffsetRef.current + scrollBy,
          animated: true,
        });
      }, 350);
    }
  }, []);

  return (
    <View style={styles.panel}>
      <View style={[styles.appBar, { paddingTop: insets.top }]}>
        <View style={styles.titleBar}>
          <View style={styles.leftControls}>
            <Pressable style={styles.iconBtn} onPress={() => setActivePanel('none')} hitSlop={8}>
              <ChevronLeftIcon size={24} color={Colors.contentPrimary} />
            </Pressable>
          </View>
          <View style={styles.titleArea}>
            <Text style={styles.titleText} numberOfLines={1}>Coach memory</Text>
          </View>
          <View style={styles.rightControls}>
            {memories.filter(m => m.status !== 'DELETED').length > 0 && memoryMode !== 'off' && (
              <Pressable style={styles.iconBtn} onPress={() => setShowMoreMenu(!showMoreMenu)} hitSlop={8}>
                <MoreIcon size={20} color={showMoreMenu ? '#BDBBB9' : Colors.contentPrimary} />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {showMoreMenu && (
        <View style={styles.menuOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowMoreMenu(false)} />
          <View style={[styles.menuPositioner, { paddingTop: insets.top + 44 }]}>
            <View style={styles.menuShadow}>
              <View style={styles.menuInner}>
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    const activeCount = memories.filter(m => m.status === 'ACTIVE').length;
                    const pausedCount = memories.filter(m => m.status === 'PAUSED').length;
                    const allPaused = activeCount === 0 && pausedCount > 0;
                    pauseAllMemories();
                    setShowMoreMenu(false);
                    showToast({ message: allPaused ? 'All memories resumed.' : 'All memories paused.' });
                  }}
                >
                  <Text style={styles.menuText}>
                    {memories.filter(m => m.status === 'ACTIVE').length === 0 && memories.filter(m => m.status === 'PAUSED').length > 0
                      ? 'Resume all'
                      : 'Pause all'}
                  </Text>
                  {memories.filter(m => m.status === 'ACTIVE').length === 0 && memories.filter(m => m.status === 'PAUSED').length > 0
                    ? <PlayMenuIcon size={24} color={Colors.contentPrimary} />
                    : <PauseMenuIcon size={24} color={Colors.contentPrimary} />}
                </Pressable>
                <Pressable
                  style={styles.menuItemLast}
                  onPress={() => {
                    setShowMoreMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Text style={[styles.menuText, { color: Colors.danger }]}>Delete all</Text>
                  <DeleteMenuIcon size={24} color={Colors.danger} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}

      {showDeleteConfirm && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Delete all memories?</Text>
            <Text style={styles.confirmDesc}>
              {`This can't be undone. ${memories.filter(m => m.status !== 'DELETED').length} ${memories.filter(m => m.status !== 'DELETED').length === 1 ? 'memory' : 'memories'} will be permanently deleted.`}
            </Text>
            <View style={styles.confirmActions}>
              <Pressable style={styles.confirmCancelBtn} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmDeleteBtn} onPress={() => {
                deleteAllMemories();
                setShowDeleteConfirm(false);
                showToast({ message: 'All memories deleted.' });
              }}>
                <Text style={styles.confirmDeleteText}>Delete all</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.searchSection}>
          <View style={styles.searchInputWrap}>
            <SearchIcon size={16} color={Colors.contentSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={Colors.contentSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Pressable
            style={[styles.filterBtn, (showFilters || filterCat) && styles.filterBtnActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={16} color={(showFilters || filterCat) ? '#fff' : Colors.contentSecondary} />
          </Pressable>
        </View>

        {(showFilters || filterCat) && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterRowContent}>
            {MEMORY_CATEGORY_ORDER.filter(cat => (catCounts[cat] || 0) > 0).map(cat => (
              <Pressable
                key={cat}
                style={[styles.filterChip, filterCat === cat && styles.filterChipActive]}
                onPress={() => setFilterCat(filterCat === cat ? null : cat)}
              >
                <Text style={[styles.filterChipText, filterCat === cat && { color: '#fff' }]}>
                  {MEMORY_CATEGORY_LABELS[cat]}
                </Text>
                <Text style={[styles.filterCount, filterCat === cat && { color: 'rgba(255,255,255,0.6)' }]}>
                  {catCounts[cat] || 0}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <ScrollView
          ref={scrollRef}
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          keyboardShouldPersistTaps="handled"
          onScroll={(e) => { scrollOffsetRef.current = e.nativeEvent.contentOffset.y; }}
          scrollEventThrottle={16}
        >
          {memoryMode === 'off' ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Memory is off</Text>
              <Text style={styles.emptyText}>
                The coach won't save or use memories while memory is turned off. You can change this in Settings.
              </Text>
            </View>
          ) : visibleMemories.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {search || filterCat ? 'No memories match your search' : 'No memories yet. The coach will start learning as you chat.'}
              </Text>
              {(search || filterCat) && (
                <Pressable onPress={() => { setSearch(''); setFilterCat(null); }}>
                  <Text style={styles.clearFilters}>Clear filters</Text>
                </Pressable>
              )}
            </View>
          ) : (
            Object.entries(grouped).map(([cat, mems], idx) => (
              <View key={cat}>
                {!filterCat && (
                  <View style={[styles.subHeader, idx === 0 && { paddingTop: 12 }]}>
                    <Text style={styles.subHeaderText}>{MEMORY_CATEGORY_LABELS[cat as MemoryCategory]}</Text>
                  </View>
                )}
                <View style={styles.cardGroup}>
                  {mems.map(m => <MemoryCard key={m.id} memory={m} onEditStart={handleEditStart} highlighted={m.id === highlightedMemoryId} />)}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.surfaceBase, zIndex: 100 },
  appBar: { backgroundColor: Colors.surfaceBase },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  leftControls: {
    width: 100,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 4,
  },
  titleArea: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
    textAlign: 'center',
  },
  rightControls: {
    width: 100,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 150,
  },
  menuPositioner: {
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menuShadow: {
    width: 212,
    borderRadius: 20,
    shadowColor: 'rgba(10,10,10,0.16)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  menuInner: {
    backgroundColor: '#FFFFFF',
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
  iconBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  searchInputWrap: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(10,10,10,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: Colors.contentPrimary },
  filterRow: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, maxHeight: 40 },
  filterRowContent: { flexDirection: 'row', gap: 6 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceTint,
  },
  filterChipActive: { backgroundColor: Colors.contentPrimary },
  filterChipText: { fontSize: 12, fontFamily: Fonts.medium, color: Colors.contentSecondary },
  filterCount: { fontSize: 11, color: 'rgba(112,111,110,0.6)' },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: 16, paddingBottom: 40 },
  subHeader: {
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.contentSecondary,
    lineHeight: 20,
  },
  cardGroup: {
    gap: 12,
  },
  memCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(10,10,10,0.08)',
    shadowColor: 'rgba(10,10,10,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  memContent: {
    fontSize: 16,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  memMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memMetaText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.contentSecondary,
    lineHeight: 20,
  },
  memActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  memActionBtn: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editInput: {
    fontSize: 16,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    padding: 0,
    margin: 0,
    minHeight: 20,
    textAlignVertical: 'top',
  },
  editToolRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  editCharCount: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#BDBBB9',
    lineHeight: 20,
  },
  editButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editSaveBtn: {
    backgroundColor: '#00A2C7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editSaveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  editCancelBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(10,10,10,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editCancelText: {
    color: Colors.contentPrimary,
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    gap: 12,
    width: '100%',
    maxWidth: 340,
  },
  confirmTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.contentPrimary,
    lineHeight: 24,
  },
  confirmDesc: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.contentSecondary,
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 8,
  },
  confirmCancelBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(10,10,10,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmCancelText: {
    color: Colors.contentPrimary,
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  confirmDeleteBtn: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.contentPrimary,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.contentSecondary,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    maxWidth: 260,
  },
  clearFilters: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.contentPrimary },
});
