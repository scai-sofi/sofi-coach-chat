import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, Dimensions, Animated as RNAnimated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import { useCoach } from '@/context/CoachContext';
import { useToast } from '@/components/Toast';
import { MemoryCategory, MEMORY_CATEGORY_LABELS, MEMORY_CATEGORY_ORDER, Memory } from '@/constants/types';
import { AppBar, useAppBarHeight } from '@/components/AppBar';
import { OverflowMenu } from '@/components/OverflowMenu';
import { MoreIcon, DeleteMenuIcon, PauseMenuIcon, PlayMenuIcon } from '@/components/icons';
import { SearchBar } from '@/components/SearchBar';
import { FilterChip } from '@/components/FilterChip';

function PencilIcon({ size = 13, color = '#706f6e' }: { size?: number; color?: string }) {
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

function PauseIcon({ size = 13, color = '#706f6e' }: { size?: number; color?: string }) {
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

function PlayIcon({ size = 13, color = '#706f6e' }: { size?: number; color?: string }) {
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

function DeleteIcon({ size = 14.5, color = '#fa2d25' }: { size?: number; color?: string }) {
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
  const { colors } = useTheme();
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
    <RNAnimated.View ref={cardRef} style={[
      styles.memCard,
      { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle, shadowColor: colors.shadowEdge },
      memory.status === 'PAUSED' && { opacity: 0.5 },
      highlighted && { borderColor: highlightAnim.interpolate({ inputRange: [0, 1], outputRange: ['transparent', colors.contentPrimary] }), borderWidth: 1.5 },
    ]}>
      {editing ? (
        <>
          <TextInput
            style={[styles.editInput, { color: colors.contentPrimary }]}
            value={editText}
            onChangeText={(t) => { if (t.length <= MAX_CHARS) setEditText(t); }}
            multiline
            autoFocus
            underlineColorAndroid="transparent"
            textAlignVertical="top"
            scrollEnabled={false}
          />
          <View style={styles.editToolRow}>
            <Text style={[styles.editCharCount, { color: colors.contentDimmed }]}>{editText.length}/{MAX_CHARS}</Text>
            <View style={styles.editButtonGroup}>
              <Pressable style={[styles.editSaveBtn, { backgroundColor: colors.contentBrand }]} onPress={handleSave}>
                <Text style={[styles.editSaveText, { color: colors.whiteOnDark }]}>Save</Text>
              </Pressable>
              <Pressable style={[styles.editCancelBtn, { borderColor: colors.borderMedium }]} onPress={handleCancel}>
                <Text style={[styles.editCancelText, { color: colors.contentPrimary }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.memContent, { color: colors.contentPrimary }]}>{memory.content}</Text>
          <View style={styles.memMeta}>
            <Text style={[styles.memMetaText, { color: colors.contentSecondary }]}>
              {memory.status === 'PAUSED' ? 'Paused · not used in chat' : `${sourceLabel} · ${dateLabel}`}
            </Text>
            <View style={styles.memActions}>
              <Pressable style={styles.memActionBtn} onPress={handleEdit}>
                <PencilIcon color={colors.contentSecondary} />
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
                  <PlayIcon color={colors.contentSecondary} />
                ) : (
                  <PauseIcon color={colors.contentSecondary} />
                )}
              </Pressable>
              <Pressable style={styles.memActionBtn} onPress={() => {
                deleteMemory(memory.id);
                showToast({
                  message: 'Memory deleted.',
                  action: { label: 'Undo', onPress: () => restoreMemory(memory.id) },
                });
              }}>
                <DeleteIcon color={colors.danger} />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </RNAnimated.View>
  );
}

export function MemoryCenter() {
  const { colors } = useTheme();
  const { memories, memoryMode, setActivePanel, pauseAllMemories, deleteAllMemories, highlightedMemoryId, addMemory } = useCoach();
  const headerHeight = useAppBarHeight();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCat, setFilterCat] = useState<MemoryCategory | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addText, setAddText] = useState('');
  const [addCategory, setAddCategory] = useState<MemoryCategory>('ABOUT_ME');
  const addInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const { showToast } = useToast();
  const ADD_MAX_CHARS = 300;

  const handleAddSave = () => {
    Keyboard.dismiss();
    const trimmed = addText.trim();
    if (trimmed.length > 0 && trimmed.length <= ADD_MAX_CHARS) {
      addMemory(trimmed, addCategory);
      showToast({ message: 'Memory added.' });
      setShowAddForm(false);
      setAddText('');
      setAddCategory('ABOUT_ME');
    }
  };

  const handleAddCancel = () => {
    Keyboard.dismiss();
    setShowAddForm(false);
    setAddText('');
    setAddCategory('ABOUT_ME');
  };

  const openAddForm = () => {
    setShowAddForm(true);
    setTimeout(() => {
      addInputRef.current?.focus();
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

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
    <View style={[styles.panel, { backgroundColor: colors.surfaceBase }]}>
      <AppBar
        variant="back"
        title="Coach memory"
        onBack={() => setActivePanel('none')}
        rightActions={memoryMode !== 'off' ? [
          ...(showAddForm ? [] : [{
            icon: <Feather name="plus" size={20} color={colors.contentPrimary} />,
            onPress: openAddForm,
          }]),
          ...(memories.filter(m => m.status !== 'DELETED').length > 0 ? [{
            icon: <MoreIcon size={20} color={showMoreMenu ? colors.contentDimmed : colors.contentPrimary} />,
            onPress: () => setShowMoreMenu(!showMoreMenu),
          }] : []),
        ] : undefined}
      />

      {showMoreMenu && (() => {
        const activeCount = memories.filter(m => m.status === 'ACTIVE').length;
        const pausedCount = memories.filter(m => m.status === 'PAUSED').length;
        const allPaused = activeCount === 0 && pausedCount > 0;
        return (
          <OverflowMenu
            items={[
              {
                label: allPaused ? 'Resume all' : 'Pause all',
                icon: allPaused
                  ? <PlayMenuIcon size={24} color={colors.contentPrimary} />
                  : <PauseMenuIcon size={24} color={colors.contentPrimary} />,
                onPress: () => {
                  pauseAllMemories();
                  setShowMoreMenu(false);
                  showToast({ message: allPaused ? 'All memories resumed.' : 'All memories paused.' });
                },
              },
              {
                label: 'Delete all',
                icon: <DeleteMenuIcon size={24} color={colors.danger} />,
                onPress: () => {
                  setShowMoreMenu(false);
                  setShowDeleteConfirm(true);
                },
                danger: true,
              },
            ]}
            topOffset={headerHeight}
            onClose={() => setShowMoreMenu(false)}
            zIndex={150}
          />
        );
      })()}

      {showDeleteConfirm && (
        <View style={[styles.confirmOverlay, { backgroundColor: colors.scrimHeavy }]}>
          <View style={[styles.confirmCard, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.confirmTitle, { color: colors.contentPrimary }]}>Delete all memories?</Text>
            <Text style={[styles.confirmDesc, { color: colors.contentSecondary }]}>
              {`This can't be undone. ${memories.filter(m => m.status !== 'DELETED').length} ${memories.filter(m => m.status !== 'DELETED').length === 1 ? 'memory' : 'memories'} will be permanently deleted.`}
            </Text>
            <View style={styles.confirmActions}>
              <Pressable style={[styles.confirmCancelBtn, { borderColor: colors.borderMedium }]} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={[styles.confirmCancelText, { color: colors.contentPrimary }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.confirmDeleteBtn, { backgroundColor: colors.danger }]} onPress={() => {
                deleteAllMemories();
                setShowDeleteConfirm(false);
                showToast({ message: 'All memories deleted.' });
              }}>
                <Text style={[styles.confirmDeleteText, { color: colors.whiteOnDark }]}>Delete all</Text>
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
        <SearchBar
          value={search}
          onChangeText={setSearch}
          variant="search-filter"
          filterActive={showFilters || !!filterCat}
          onFilterPress={() => setShowFilters(!showFilters)}
        />

        {(showFilters || filterCat) && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterRowContent}>
            {MEMORY_CATEGORY_ORDER.filter(cat => (catCounts[cat] || 0) > 0).map(cat => (
              <FilterChip
                key={cat}
                label={MEMORY_CATEGORY_LABELS[cat]}
                selected={filterCat === cat}
                onPress={() => setFilterCat(filterCat === cat ? null : cat)}
                count={catCounts[cat] || 0}
              />
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
          {showAddForm && (
            <View style={[styles.addCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle, shadowColor: colors.shadowEdge }]}>
              <Text style={[styles.addLabel, { color: colors.contentSecondary }]}>New memory</Text>
              <TextInput
                ref={addInputRef}
                style={[styles.editInput, { color: colors.contentPrimary }]}
                value={addText}
                onChangeText={(t) => { if (t.length <= ADD_MAX_CHARS) setAddText(t); }}
                multiline
                placeholder="What should your coach remember?"
                placeholderTextColor={colors.contentDimmed}
              />
              <View style={styles.addCatRow}>
                {MEMORY_CATEGORY_ORDER.map(cat => (
                  <FilterChip
                    key={cat}
                    label={MEMORY_CATEGORY_LABELS[cat]}
                    selected={addCategory === cat}
                    onPress={() => setAddCategory(cat)}
                  />
                ))}
              </View>
              <View style={styles.editToolRow}>
                <Text style={[styles.editCharCount, { color: addText.length > ADD_MAX_CHARS ? colors.danger : colors.contentDimmed }]}>
                  {addText.length}/{ADD_MAX_CHARS}
                </Text>
                <View style={styles.editButtonGroup}>
                  <Pressable
                    style={[styles.editSaveBtn, { backgroundColor: addText.trim().length > 0 ? colors.contentBrand : colors.surfaceTint }]}
                    onPress={handleAddSave}
                    disabled={addText.trim().length === 0}
                  >
                    <Text style={[styles.editSaveText, { color: addText.trim().length > 0 ? colors.whiteOnDark : colors.contentDimmed }]}>Save</Text>
                  </Pressable>
                  <Pressable style={[styles.editCancelBtn, { borderColor: colors.borderMedium }]} onPress={handleAddCancel}>
                    <Text style={[styles.editCancelText, { color: colors.contentPrimary }]}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {memoryMode === 'off' ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.contentPrimary }]}>Memory is off</Text>
              <Text style={[styles.emptyText, { color: colors.contentSecondary }]}>
                The coach won't save or use memories while memory is turned off. You can change this in Settings.
              </Text>
            </View>
          ) : visibleMemories.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.contentSecondary }]}>
                {search || filterCat ? 'No memories match your search' : 'No memories yet. The coach will start learning as you chat.'}
              </Text>
              {(search || filterCat) && (
                <Pressable onPress={() => { setSearch(''); setFilterCat(null); }}>
                  <Text style={[styles.clearFilters, { color: colors.contentPrimary }]}>Clear filters</Text>
                </Pressable>
              )}
            </View>
          ) : (
            Object.entries(grouped).map(([cat, mems], idx) => (
              <View key={cat}>
                {!filterCat && (
                  <View style={[styles.subHeader, idx === 0 && { paddingTop: 12 }]}>
                    <Text style={[styles.subHeaderText, { color: colors.contentSecondary }]}>{MEMORY_CATEGORY_LABELS[cat as MemoryCategory]}</Text>
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
  panel: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  filterRow: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, maxHeight: 44 },
  filterRowContent: { flexDirection: 'row', gap: 6 },
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
    lineHeight: 20,
  },
  cardGroup: {
    gap: 12,
  },
  memCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  memContent: {
    fontSize: 16,
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
    lineHeight: 20,
  },
  editButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editSaveBtn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editSaveText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  editCancelBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editCancelText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  confirmCard: {
    borderRadius: 20,
    padding: 24,
    gap: 12,
    width: '100%',
    maxWidth: 340,
  },
  confirmTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    lineHeight: 24,
  },
  confirmDesc: {
    fontSize: 14,
    fontFamily: Fonts.regular,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmCancelText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  confirmDeleteBtn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  confirmDeleteText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  addCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 0.75,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  addLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  addCatRow: {
    flexDirection: 'row',
    gap: 6,
  },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    maxWidth: 260,
  },
  clearFilters: { fontSize: 14, fontFamily: Fonts.medium },
});
