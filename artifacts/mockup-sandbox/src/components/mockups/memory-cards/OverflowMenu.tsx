import './_group.css';
import { useState, useRef, useEffect, useCallback } from 'react';
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

function MenuCard({ memory, onDelete, onTogglePause }: { memory: Memory; onDelete: (id: string) => void; onTogglePause: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPaused = memory.status === 'PAUSED';

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleAction = useCallback((action: string) => {
    setMenuOpen(false);
    if (action === 'delete') onDelete(memory.id);
    if (action === 'pause') onTogglePause(memory.id);
  }, [memory.id, onDelete, onTogglePause]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: 'var(--sofi-surface-elevated)',
        borderRadius: 20,
        padding: 16,
        border: '0.75px solid var(--sofi-border-subtle)',
        boxShadow: '0 2px 8px var(--sofi-shadow-edge)',
        opacity: isPaused ? 0.5 : 1,
        transition: 'opacity 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <p style={{ color: 'var(--sofi-content-primary)', fontSize: 16, lineHeight: '20px', fontWeight: 400, flex: 1 }}>
            {memory.content}
          </p>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginTop: -2, marginRight: -4,
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 4 16" fill="none">
              <circle cx="2" cy="2" r="1.5" fill="var(--sofi-content-secondary)"/>
              <circle cx="2" cy="8" r="1.5" fill="var(--sofi-content-secondary)"/>
              <circle cx="2" cy="14" r="1.5" fill="var(--sofi-content-secondary)"/>
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: 'var(--sofi-content-secondary)', fontSize: 14, fontWeight: 500, lineHeight: '20px' }}>
            {isPaused ? 'Paused · not used in chat' : memory.date}
          </span>
        </div>
      </div>

      {menuOpen && (
        <div ref={menuRef} style={{
          position: 'absolute', top: 8, right: 28, zIndex: 20, minWidth: 180,
          background: 'var(--sofi-surface-elevated)', borderRadius: 14,
          border: '1px solid var(--sofi-border-medium)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          padding: '4px 0', overflow: 'hidden',
          animation: 'menuFadeIn 0.15s ease-out',
        }}>
          <button onClick={() => handleAction('edit')} style={menuItemStyle()}>
            <PencilSvg size={15} />
            <span>Edit</span>
          </button>
          <button onClick={() => handleAction('pause')} style={menuItemStyle()}>
            {isPaused ? <PlaySvg size={15} /> : <PauseSvg size={15} />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          <div style={{ height: 1, background: 'var(--sofi-border-subtle)', margin: '4px 0' }} />
          <button onClick={() => handleAction('delete')} style={menuItemStyle(true)}>
            <DeleteSvg size={15} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

function menuItemStyle(danger = false): React.CSSProperties {
  return {
    width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
    background: 'none', border: 'none', cursor: 'pointer',
    color: danger ? 'var(--sofi-danger)' : 'var(--sofi-content-primary)',
    fontSize: 15, fontWeight: 400, textAlign: 'left' as const,
  };
}

export function OverflowMenu() {
  const { search, setSearch, showFilters, setShowFilters, filterCat, setFilterCat, grouped, catCounts, deleteMemory, togglePause } = useMemoryState();

  return (
    <div style={{ width: '100%', height: '100vh', background: 'var(--sofi-surface-base)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`@keyframes menuFadeIn { from { opacity: 0; transform: scale(0.95) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
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
                <MenuCard key={m.id} memory={m} onDelete={deleteMemory} onTogglePause={togglePause} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
