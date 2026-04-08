import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants/fonts';
import { useCoach } from '../context/CoachContext';
import { usePhase2Nav } from '../context/Phase2NavContext';
import { MEMORY_CATEGORY_LABELS } from '../constants/types';
import { AppBar } from '../components/AppBar';

const cardShadowStyle: ViewStyle = {
  // @ts-expect-error boxShadow works across all platforms
  boxShadow: '0px 0px 1px 0px rgba(10,10,10,0.16), 0px 2px 8px 0px rgba(10,10,10,0.04), 0px 4px 16px 0px rgba(10,10,10,0.02)',
};

function sourceLabel(source: string): string {
  if (source === 'EXPLICIT') return 'You told Coach';
  if (source === 'IMPLICIT_CONFIRMED') return 'Coach inferred';
  if (source === 'MEMBER_360') return 'From your profile';
  return 'You added manually';
}

const MODE_LABELS: Record<string, string> = {
  'full': 'Learn as we go',
  'ask-first': 'I\u2019ll decide',
  'off': 'Just answers',
};

export default function CoachMemoryScreen() {
  const { colors } = useTheme();
  const { goBack } = usePhase2Nav();
  const { memories, memoryMode, deleteMemory, pauseMemory, restoreMemory, editMemory } = useCoach();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const activeMemories = memories.filter(m => m.status === 'ACTIVE' || m.status === 'PAUSED');
  const isMemoryOff = memoryMode === 'off';

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditText(content);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      editMemory(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBase }]}>
      <AppBar variant="back" title="Coach Memory" onBack={() => goBack()} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.modeCard, cardShadowStyle, { backgroundColor: colors.surfaceElevated }]}>
          <View style={styles.modeRow}>
            <Feather name="shield" size={18} color={colors.contentSecondary} />
            <View style={styles.modeTextArea}>
              <Text style={[styles.modeTitle, { color: colors.contentPrimary }]}>Trust spectrum</Text>
              <Text style={[styles.modeValue, { color: colors.contentSecondary }]}>
                {MODE_LABELS[memoryMode] || memoryMode}
              </Text>
            </View>
          </View>
        </View>

        {isMemoryOff && (
          <View style={[styles.emptyCard, cardShadowStyle, { backgroundColor: colors.surfaceElevated }]}>
            <Feather name="book-open" size={24} color={colors.contentMuted} />
            <Text style={[styles.emptyTitle, { color: colors.contentPrimary }]}>Memory is off</Text>
            <Text style={[styles.emptyDesc, { color: colors.contentSecondary }]}>
              Coach isn't saving conversational memories. Change your trust spectrum setting to enable memory.
            </Text>
          </View>
        )}

        {!isMemoryOff && memoryMode === 'ask-first' && (
          <View style={[styles.hintCard, { backgroundColor: colors.surfaceTint }]}>
            <Feather name="info" size={14} color={colors.contentSecondary} />
            <Text style={[styles.hintText, { color: colors.contentSecondary }]}>
              New memories are proposed inline during chat. Approve them there to see them here.
            </Text>
          </View>
        )}

        {!isMemoryOff && activeMemories.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.contentPrimary }]}>
              Saved memories ({activeMemories.length})
            </Text>
            <View style={[styles.card, cardShadowStyle, { backgroundColor: colors.surfaceElevated }]}>
              {activeMemories.map((mem, i) => (
                <React.Fragment key={mem.id}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: colors.surfaceEdge }]} />}
                  <View style={styles.memoryRow}>
                    <View style={styles.memoryTextArea}>
                      {editingId === mem.id ? (
                        <View style={styles.editArea}>
                          <TextInput
                            style={[styles.editInput, { color: colors.contentPrimary, borderColor: colors.surfaceEdge }]}
                            value={editText}
                            onChangeText={setEditText}
                            multiline
                            autoFocus
                          />
                          <View style={styles.editActions}>
                            <Pressable onPress={saveEdit} style={[styles.editBtn, { backgroundColor: colors.contentPrimary }]}>
                              <Text style={[styles.editBtnText, { color: colors.contentPrimaryInverse }]}>Save</Text>
                            </Pressable>
                            <Pressable onPress={cancelEdit} style={styles.editBtn}>
                              <Text style={[styles.editBtnText, { color: colors.contentSecondary }]}>Cancel</Text>
                            </Pressable>
                          </View>
                        </View>
                      ) : (
                        <>
                          <Text
                            style={[
                              styles.memoryContent,
                              { color: colors.contentPrimary },
                              mem.status === 'PAUSED' && { opacity: 0.5 },
                            ]}
                          >
                            {mem.content}
                          </Text>
                          <Text style={[styles.memoryMeta, { color: colors.contentSecondary }]}>
                            {MEMORY_CATEGORY_LABELS[mem.category]} · {sourceLabel(mem.source)}
                            {mem.status === 'PAUSED' ? ' · Paused' : ''}
                          </Text>
                        </>
                      )}
                    </View>
                    {editingId !== mem.id && (
                      <View style={styles.actionRow}>
                        <Pressable
                          onPress={() => startEdit(mem.id, mem.content)}
                          hitSlop={8}
                          style={styles.actionBtn}
                        >
                          <Feather name="edit-2" size={16} color={colors.contentSecondary} />
                        </Pressable>
                        <Pressable
                          onPress={() => mem.status === 'PAUSED' ? restoreMemory(mem.id) : pauseMemory(mem.id)}
                          hitSlop={8}
                          style={styles.actionBtn}
                        >
                          <Feather
                            name={mem.status === 'PAUSED' ? 'play' : 'pause'}
                            size={16}
                            color={colors.contentSecondary}
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => deleteMemory(mem.id)}
                          hitSlop={8}
                          style={styles.actionBtn}
                        >
                          <Feather name="trash-2" size={16} color={colors.contentSecondary} />
                        </Pressable>
                      </View>
                    )}
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {!isMemoryOff && activeMemories.length === 0 && (
          <View style={[styles.emptyCard, cardShadowStyle, { backgroundColor: colors.surfaceElevated }]}>
            <Feather name="book-open" size={24} color={colors.contentMuted} />
            <Text style={[styles.emptyTitle, { color: colors.contentPrimary }]}>No memories yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.contentSecondary }]}>
              Start chatting with Coach to build your memory. Things you share in conversation will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
  },
  modeCard: {
    borderRadius: 16,
    padding: 16,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeTextArea: {
    flex: 1,
    gap: 1,
  },
  modeTitle: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  modeValue: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  section: {
    marginTop: 24,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  memoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  memoryTextArea: {
    flex: 1,
    gap: 4,
  },
  memoryContent: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  memoryMeta: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    lineHeight: 16,
  },
  editArea: {
    gap: 8,
  },
  editInput: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 44,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 22,
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    textAlign: 'center',
  },
});
