import './_group.css';
import { useState, useRef, useCallback } from 'react';
import {
  type Memory,
  CATEGORY_LABELS,
  AppBarHeader,
  SearchBarUI,
  FilterChips,
  PencilSvg,
  PauseSvg,
  PlaySvg,
  DeleteSvg,
  useMemoryState,
} from './_shared';

function HybridCard({ memory, onDelete, onTogglePause }: { memory: Memory; onDelete: (id: string) => void; onTogglePause: (id: string) => void }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(memory.content);
  const startX = useRef(0);
  const currentX = useRef(0);
  const didSwipe = useRef(false);

  const ACTION_THRESHOLD = 56;
  const FULL_REVEAL = 128;
  const isPaused = memory.status === 'PAUSED';

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (editing) return;
    startX.current = e.clientX;
    currentX.current = 0;
    didSwipe.current = false;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [editing]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) didSwipe.current = true;
    const clamped = Math.min(0, Math.max(-FULL_REVEAL, dx));
    currentX.current = clamped;
    setDragX(clamped);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    if (currentX.current < -ACTION_THRESHOLD) {
      setDragX(-FULL_REVEAL);
    } else {
      setDragX(0);
    }
  }, []);

  const handleAction = (action: string) => {
    setDragX(0);
    if (action === 'delete') onDelete(memory.id);
    if (action === 'pause') onTogglePause(memory.id);
  };

  const handleEditClick = () => {
    if (dragX < 0) return;
    setEditing(true);
    setEditText(memory.content);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditText(memory.content);
  };

  if (editing) {
    return (
      <div style={{
        background: 'var(--sofi-surface-elevated)',
        borderRadius: 20,
        padding: 16,
        border: '0.75px solid var(--sofi-border-subtle)',
        boxShadow: '0 2px 8px var(--sofi-shadow-edge)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <textarea
          value={editText}
          onChange={(e) => { if (e.target.value.length <= 300) setEditText(e.target.value); }}
          autoFocus
          style={{
            color: 'var(--sofi-content-primary)',
            fontSize: 16,
            lineHeight: '20px',
            fontWeight: 400,
            background: 'none',
            border: 'none',
            outline: 'none',
            resize: 'none',
            minHeight: 60,
            width: '100%',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: editText.trim().length > 0 ? 'var(--sofi-content-dimmed)' : 'var(--sofi-content-disabled2)' }}>
            {editText.length}/300
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} style={{
              borderRadius: 12, padding: '8px 16px', border: 'none', cursor: 'pointer',
              background: editText.trim().length > 0 ? 'var(--sofi-content-brand)' : 'var(--sofi-surface-tint)',
              color: editText.trim().length > 0 ? 'var(--sofi-white)' : 'var(--sofi-content-disabled2)',
              fontSize: 14, fontWeight: 700, lineHeight: '20px',
            }}>Save</button>
            <button onClick={handleCancel} style={{
              borderRadius: 12, padding: '8px 16px', cursor: 'pointer',
              border: '1.5px solid var(--sofi-border-medium)', background: 'none',
              color: 'var(--sofi-content-primary)', fontSize: 14, fontWeight: 700, lineHeight: '20px',
            }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'stretch',
        opacity: dragX < 0 ? 1 : 0,
        pointerEvents: dragX < 0 ? 'auto' : 'none',
        transition: isDragging ? 'none' : 'opacity 0.2s ease',
      }}>
        <button
          onClick={() => handleAction('pause')}
          style={{
            width: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            background: '#f59e0b', border: 'none', cursor: 'pointer', color: '#000', fontSize: 11, fontWeight: 500, padding: 0,
          }}
        >
          {isPaused ? <PlaySvg size={14} color="#000" /> : <PauseSvg size={14} color="#000" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
        <button
          onClick={() => handleAction('delete')}
          style={{
            width: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            background: 'var(--sofi-danger)', border: 'none', cursor: 'pointer', color: 'var(--sofi-white)', fontSize: 11, fontWeight: 500, padding: 0,
          }}
        >
          <DeleteSvg size={14} color="white" />
          <span>Delete</span>
        </button>
      </div>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'relative',
          background: 'var(--sofi-surface-elevated)',
          borderRadius: 20,
          padding: 16,
          border: '0.75px solid var(--sofi-border-subtle)',
          boxShadow: '0 2px 8px var(--sofi-shadow-edge)',
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'grab',
          touchAction: 'pan-y',
          userSelect: 'none',
          opacity: isPaused ? 0.5 : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <p style={{ color: 'var(--sofi-content-primary)', fontSize: 16, lineHeight: '20px', fontWeight: 400 }}>
          {memory.content}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--sofi-content-secondary)', fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>
            {isPaused ? 'Paused · not used in chat' : memory.date}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); if (!didSwipe.current) handleEditClick(); }}
            style={{
              width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <PencilSvg size={13} color="var(--sofi-content-secondary)" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SwipeActions() {
  const { search, setSearch, showFilters, setShowFilters, filterCat, setFilterCat, grouped, catCounts, deleteMemory, togglePause } = useMemoryState();

  return (
    <div style={{ width: '100%', height: '100vh', background: 'var(--sofi-surface-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBarHeader onPlusPress={() => {}} />
      <SearchBarUI value={search} onChange={setSearch} filterActive={showFilters || !!filterCat} onFilterPress={() => setShowFilters(!showFilters)} />
      {(showFilters || filterCat) && <FilterChips filterCat={filterCat} setFilterCat={setFilterCat} catCounts={catCounts} />}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 40px' }}>
        {Object.entries(grouped).map(([cat, mems], idx) => (
          <div key={cat}>
            {!filterCat && (
              <div style={{ paddingTop: idx === 0 ? 12 : 24, paddingBottom: 12, paddingLeft: 4, paddingRight: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: 'var(--sofi-content-secondary)' }}>
                  {CATEGORY_LABELS[cat]}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mems.map(m => (
                <HybridCard key={m.id} memory={m} onDelete={deleteMemory} onTogglePause={togglePause} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
