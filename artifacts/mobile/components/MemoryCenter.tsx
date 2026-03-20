import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { MemoryCategory, MEMORY_CATEGORY_LABELS, MEMORY_CATEGORY_ORDER, Memory } from '@/constants/types';

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

function PencilIcon({ size = 16, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M9.886 2.276a1.6 1.6 0 012.263 0l1.575 1.575a1.6 1.6 0 010 2.263L6.14 13.698a.8.8 0 01-.382.21l-3.2.8a.8.8 0 01-.97-.97l.8-3.2a.8.8 0 01.21-.382L9.886 2.276zm1.131 1.131L3.72 10.704l-.48 1.92 1.92-.48 7.297-7.297-1.44-1.44z"
        fill={color}
      />
    </Svg>
  );
}

function PauseIcon({ size = 16, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x={4} y={2.667} width={2.167} height={10.667} rx={0.5} fill={color} />
      <Rect x={9.833} y={2.667} width={2.167} height={10.667} rx={0.5} fill={color} />
    </Svg>
  );
}

function PlayIcon({ size = 16, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M5 3l8 5-8 5V3z" fill={color} />
    </Svg>
  );
}

function DeleteIcon({ size = 16, color = Colors.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6.667 1.333A1.333 1.333 0 005.333 2.667V3.333H2.667a.667.667 0 000 1.334h.666v8A1.333 1.333 0 004.667 14h6.666a1.333 1.333 0 001.334-1.333v-8h.666a.667.667 0 000-1.334H10.667V2.667a1.333 1.333 0 00-1.334-1.334H6.667zm0 1.334h2.666v.666H6.667v-.666zm-2 2h6.666v8H4.667v-8z"
        fill={color}
      />
    </Svg>
  );
}

function MemoryCard({ memory, onEditStart }: { memory: Memory; onEditStart?: (y: number) => void }) {
  const { editMemory, pauseMemory, deleteMemory } = useCoach();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(memory.content);
  const cardRef = useRef<View>(null);
  const MAX_CHARS = 300;

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
    <View ref={cardRef} style={[styles.memCard, memory.status === 'PAUSED' && { opacity: 0.5 }]}>
      {editing ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={(t) => { if (t.length <= MAX_CHARS) setEditText(t); }}
            multiline
            autoFocus
            underlineColorAndroid="transparent"
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
            <Text style={styles.memMetaText}>{sourceLabel} · {dateLabel}</Text>
            <View style={styles.memActions}>
              <Pressable style={styles.memActionBtn} onPress={handleEdit}>
                <PencilIcon size={16} color={Colors.contentSecondary} />
              </Pressable>
              <Pressable style={styles.memActionBtn} onPress={() => pauseMemory(memory.id)}>
                {memory.status === 'PAUSED' ? (
                  <PlayIcon size={16} color={Colors.contentSecondary} />
                ) : (
                  <PauseIcon size={16} color={Colors.contentSecondary} />
                )}
              </Pressable>
              <Pressable style={styles.memActionBtn} onPress={() => deleteMemory(memory.id)}>
                <DeleteIcon size={16} color={Colors.danger} />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export function MemoryCenter() {
  const insets = useSafeAreaInsets();
  const { memories, setActivePanel } = useCoach();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCat, setFilterCat] = useState<MemoryCategory | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);

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
          <View style={styles.rightControls} />
        </View>
      </View>

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
          {visibleMemories.length === 0 ? (
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
            Object.entries(grouped).map(([cat, mems]) => (
              <View key={cat}>
                {!filterCat && (
                  <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>{MEMORY_CATEGORY_LABELS[cat as MemoryCategory]}</Text>
                  </View>
                )}
                <View style={styles.cardGroup}>
                  {mems.map(m => <MemoryCard key={m.id} memory={m} onEditStart={handleEditStart} />)}
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
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 60,
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
    shadowColor: 'rgba(10,10,10,0.16)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  editInput: {
    fontSize: 16,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    padding: 0,
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
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyText: {
    fontSize: 14,
    color: Colors.contentSecondary,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    maxWidth: 260,
  },
  clearFilters: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.contentPrimary },
});
