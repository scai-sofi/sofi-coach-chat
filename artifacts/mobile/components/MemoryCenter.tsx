import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { MemoryCategory, MEMORY_CATEGORY_LABELS, MEMORY_CATEGORY_ORDER, Memory } from '@/constants/types';

function ChevronLeftIcon({ size = 24, color = Colors.contentPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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
        d="M11.333 2a1.886 1.886 0 012.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2z"
        stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function PauseIcon({ size = 16, color = Colors.contentSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x={4} y={3} width={2.5} height={10} rx={0.5} fill={color} />
      <Rect x={9.5} y={3} width={2.5} height={10} rx={0.5} fill={color} />
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
        d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z"
        stroke={color} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function MemoryCard({ memory }: { memory: Memory }) {
  const { editMemory, pauseMemory, deleteMemory } = useCoach();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(memory.content);

  const sourceLabel = memory.source === 'EXPLICIT' ? 'You created' : 'AI inferred';
  const dateLabel = memory.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={[styles.memCard, memory.status === 'PAUSED' && { opacity: 0.5 }]}>
      {editing ? (
        <View>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            multiline
            autoFocus
          />
          <View style={styles.editButtons}>
            <Pressable style={styles.saveMiniBtn} onPress={() => { editMemory(memory.id, editText); setEditing(false); }}>
              <Text style={styles.saveMiniText}>Save</Text>
            </Pressable>
            <Pressable style={styles.cancelMiniBtn} onPress={() => { setEditText(memory.content); setEditing(false); }}>
              <Text style={styles.cancelMiniText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.memContent}>{memory.content}</Text>
      )}
      <View style={styles.memMeta}>
        <Text style={styles.memMetaText}>{sourceLabel} · {dateLabel}</Text>
        <View style={styles.memActions}>
          <Pressable style={styles.memActionBtn} onPress={() => setEditing(true)}>
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
    </View>
  );
}

export function MemoryCenter() {
  const insets = useSafeAreaInsets();
  const { memories, setActivePanel } = useCoach();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCat, setFilterCat] = useState<MemoryCategory | null>(null);

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

  return (
    <View style={styles.panel}>
      <View style={[styles.appBar, { paddingTop: insets.top }]}>
        <View style={styles.titleBar}>
          <View style={styles.leftControls}>
            <Pressable style={styles.iconBtn} onPress={() => setActivePanel('none')}>
              <ChevronLeftIcon size={24} color={Colors.contentPrimary} />
            </Pressable>
          </View>
          <View style={styles.titleArea}>
            <Text style={styles.titleText} numberOfLines={1}>Coach memory</Text>
          </View>
          <View style={styles.rightControls} />
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <View style={styles.searchIconWrap}>
              <SearchIcon size={16} color={Colors.contentSecondary} />
            </View>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
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
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
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
                {mems.map(m => <MemoryCard key={m.id} memory={m} />)}
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 0.75,
    borderColor: 'rgba(10,10,10,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconWrap: {
    paddingLeft: 14,
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.contentPrimary,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    paddingRight: 14,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: Colors.contentPrimary },
  filterRow: { marginTop: 10, flexDirection: 'row' },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: Colors.surfaceTint,
    marginRight: 6,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
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
    borderWidth: 1,
    borderColor: 'rgba(10,10,10,0.1)',
    borderRadius: 12,
    padding: 12,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  editButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
  saveMiniBtn: {
    backgroundColor: Colors.contentPrimary,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveMiniText: { color: '#fff', fontSize: 13, fontFamily: Fonts.medium },
  cancelMiniBtn: {
    borderWidth: 1,
    borderColor: 'rgba(10,10,10,0.1)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelMiniText: { color: Colors.contentSecondary, fontSize: 13, fontFamily: Fonts.medium },
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
