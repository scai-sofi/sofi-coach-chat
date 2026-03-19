import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useCoach } from '@/context/CoachContext';
import { MemoryCategory, MEMORY_CATEGORY_LABELS, MEMORY_CATEGORY_ORDER, Memory } from '@/constants/types';

const ADD_CATEGORIES: { value: MemoryCategory; label: string }[] = [
  { value: 'PREFERENCE', label: 'Preferences' },
  { value: 'FINANCIAL_ATTITUDE', label: 'Attitudes' },
  { value: 'GOAL_RELATED', label: 'Goals' },
  { value: 'LIFE_CONTEXT', label: 'Life Context' },
  { value: 'CONSTRAINT', label: 'Constraints' },
  { value: 'EXPLICIT_FACT', label: 'Facts' },
];

function MemoryCard({ memory }: { memory: Memory }) {
  const { editMemory, pauseMemory, deleteMemory } = useCoach();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(memory.content);

  const sourceLabel = memory.source === 'EXPLICIT' ? 'You said' : 'AI inferred';
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
            <Feather name="edit-2" size={13} color={Colors.contentSecondary} />
          </Pressable>
          <Pressable style={styles.memActionBtn} onPress={() => pauseMemory(memory.id)}>
            <Feather name={memory.status === 'PAUSED' ? 'play' : 'pause'} size={13} color={Colors.contentSecondary} />
          </Pressable>
          <Pressable style={styles.memActionBtn} onPress={() => deleteMemory(memory.id)}>
            <Feather name="trash-2" size={13} color={Colors.dangerLight} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function MemoryCenter() {
  const { memories, setActivePanel, addMemory } = useCoach();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCat, setFilterCat] = useState<MemoryCategory | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addText, setAddText] = useState('');
  const [addCategory, setAddCategory] = useState<MemoryCategory>('EXPLICIT_FACT');

  const visibleMemories = useMemo(() => {
    return memories.filter(m => {
      if (m.status === 'DELETED') return false;
      if (filterCat && m.category !== filterCat) return false;
      if (search && !m.content.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [memories, filterCat, search]);

  const activeCount = memories.filter(m => m.status !== 'DELETED').length;

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

  const handleSave = () => {
    if (!addText.trim()) return;
    addMemory(addText.trim(), addCategory);
    setAddText('');
    setShowAdd(false);
  };

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => setActivePanel('none')}>
          <Feather name="chevron-left" size={22} color={Colors.contentPrimary} />
        </Pressable>
        <View style={styles.headerTitle}>
          <Feather name="cpu" size={18} color={Colors.contentPrimary} />
          <Text style={styles.headerText}>Memory Center</Text>
        </View>
        <Pressable
          style={[styles.addBtn, showAdd && styles.addBtnActive]}
          onPress={() => setShowAdd(!showAdd)}
        >
          <Feather name="plus" size={18} color={showAdd ? '#fff' : Colors.contentPrimary} />
        </Pressable>
      </View>

      {showAdd && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.addInput}
            placeholder="What should the coach remember?"
            placeholderTextColor={Colors.contentSecondary}
            value={addText}
            onChangeText={setAddText}
            multiline
            autoFocus
          />
          <View style={styles.addControls}>
            <View style={styles.catPicker}>
              {ADD_CATEGORIES.map(c => (
                <Pressable
                  key={c.value}
                  onPress={() => setAddCategory(c.value)}
                  style={[styles.catChipSmall, addCategory === c.value && styles.catChipActive]}
                >
                  <Text style={[styles.catChipSmallText, addCategory === c.value && { color: '#fff' }]}>
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.addBtnRow}>
              <Pressable onPress={() => { setAddText(''); setShowAdd(false); }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, !addText.trim() && { opacity: 0.3 }]}
                onPress={handleSave}
                disabled={!addText.trim()}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Feather name="search" size={13} color={Colors.contentSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={Colors.contentSecondary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable style={styles.clearBtn} onPress={() => setSearch('')}>
                <Feather name="x" size={14} color={Colors.contentSecondary} />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.filterBtn, (showFilters || filterCat) && styles.filterBtnActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Feather name="sliders" size={16} color={(showFilters || filterCat) ? '#fff' : Colors.contentSecondary} />
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

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        {!search && !filterCat && (
          <Text style={styles.helpText}>
            These are facts the coach remembers about you. Edit or delete anything at any time.
          </Text>
        )}

        {visibleMemories.length === 0 ? (
          <View style={styles.empty}>
            <Feather name={search || filterCat ? 'search' : 'cpu'} size={32} color={Colors.contentMuted} />
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
            <View key={cat} style={styles.group}>
              {!filterCat && (
                <Text style={styles.groupHeader}>{MEMORY_CATEGORY_LABELS[cat as MemoryCategory]}</Text>
              )}
              {mems.map(m => <MemoryCard key={m.id} memory={m} />)}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {(search || filterCat) ? `${visibleMemories.length} of ${activeCount} memories` : `${activeCount} active ${activeCount === 1 ? 'memory' : 'memories'}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: Colors.surfaceBase },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(10,10,10,0.1)',
  },
  backBtn: { padding: 4, borderRadius: 999 },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  headerText: { fontSize: 16, fontFamily: 'Inter_500Medium', color: Colors.contentPrimary },
  addBtn: { padding: 6, borderRadius: 999 },
  addBtnActive: { backgroundColor: Colors.contentPrimary },
  addForm: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(10,10,10,0.1)',
  },
  addInput: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)',
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: Colors.contentPrimary,
    fontFamily: 'Inter_400Regular', lineHeight: 20, minHeight: 60, textAlignVertical: 'top',
  },
  addControls: { marginTop: 10 },
  catPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catChipSmall: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    backgroundColor: Colors.surfaceTint,
  },
  catChipActive: { backgroundColor: Colors.contentPrimary },
  catChipSmallText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.contentSecondary },
  addBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },
  cancelText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.contentSecondary, paddingHorizontal: 12, paddingVertical: 6 },
  saveBtn: { backgroundColor: Colors.contentPrimary, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_500Medium' },
  searchSection: { paddingHorizontal: 16, paddingVertical: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  searchInputWrap: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)', justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 16 },
  searchInput: { paddingLeft: 40, paddingRight: 36, fontSize: 16, color: Colors.contentPrimary, fontFamily: 'Inter_400Regular', height: '100%' },
  clearBtn: { position: 'absolute', right: 14, padding: 2, borderRadius: 999 },
  filterBtn: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterBtnActive: { backgroundColor: Colors.contentPrimary },
  filterRow: { marginTop: 10, flexDirection: 'row' },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    backgroundColor: Colors.surfaceTint, marginRight: 6,
  },
  filterChipActive: { backgroundColor: Colors.contentPrimary },
  filterChipText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.contentSecondary },
  filterCount: { fontSize: 11, color: 'rgba(112,111,110,0.6)' },
  content: { flex: 1, paddingHorizontal: 16 },
  helpText: { fontSize: 13, color: Colors.contentSecondary, lineHeight: 18, paddingVertical: 8 },
  group: { marginTop: 12 },
  groupHeader: {
    fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.contentSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  memCard: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)',
    padding: 12, marginBottom: 8,
  },
  memContent: { fontSize: 15, color: Colors.contentPrimary, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  memMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  memMetaText: { fontSize: 12, color: Colors.contentSecondary, flex: 1 },
  memActions: { flexDirection: 'row', gap: 0 },
  memActionBtn: { padding: 6, borderRadius: 999 },
  editInput: {
    fontSize: 15, color: Colors.contentPrimary, fontFamily: 'Inter_400Regular', lineHeight: 20,
    borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)', borderRadius: 8, padding: 8, minHeight: 50,
    textAlignVertical: 'top',
  },
  editButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
  saveMiniBtn: { backgroundColor: Colors.contentPrimary, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  saveMiniText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_500Medium' },
  cancelMiniBtn: { borderWidth: 1, borderColor: 'rgba(10,10,10,0.1)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  cancelMiniText: { color: Colors.contentSecondary, fontSize: 13, fontFamily: 'Inter_500Medium' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.contentSecondary, textAlign: 'center', maxWidth: 260 },
  clearFilters: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.contentPrimary },
  footer: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(10,10,10,0.1)',
    alignItems: 'center',
  },
  footerText: { fontSize: 12, color: Colors.contentSecondary },
});
