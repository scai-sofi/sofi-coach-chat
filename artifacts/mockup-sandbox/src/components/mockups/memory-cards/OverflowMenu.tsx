import './_group.css';
import { useState, useRef, useEffect, useCallback } from 'react';

const MEMORIES = [
  { id: '1', content: 'Lives in Austin, TX. Moved from Chicago two years ago for work.', category: 'About me', date: 'Mar 15', status: 'ACTIVE' as const },
  { id: '2', content: 'Works at Stripe as a senior software engineer. Total comp around $280k.', category: 'About me', date: 'Mar 12', status: 'ACTIVE' as const },
  { id: '3', content: 'Prefers concise bullet-point summaries over long explanations.', category: 'Preferences', date: 'Mar 10', status: 'ACTIVE' as const },
  { id: '4', content: 'Wants to max out 401k contributions this year ($23,500 limit).', category: 'Priorities', date: 'Mar 8', status: 'ACTIVE' as const },
  { id: '5', content: 'Has a SoFi Money account and SoFi Invest account. Considering opening a credit card.', category: 'About me', date: 'Mar 5', status: 'PAUSED' as const },
  { id: '6', content: 'Risk tolerance is moderate — open to index funds but not individual stocks.', category: 'Preferences', date: 'Mar 3', status: 'ACTIVE' as const },
];

function MenuCard({ memory, onDelete }: { memory: typeof MEMORIES[0]; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPaused = memory.status === 'PAUSED';

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleAction = useCallback((action: string) => {
    setMenuOpen(false);
    if (action === 'delete') {
      onDelete(memory.id);
    } else {
      setShowToast(action === 'edit' ? 'Editing…' : isPaused ? 'Chat memory resumed.' : 'Chat memory paused.');
      setTimeout(() => setShowToast(null), 1500);
    }
  }, [memory.id, isPaused, onDelete]);

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
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <p style={{
            color: 'var(--sofi-content-primary)',
            fontSize: 16,
            lineHeight: '20px',
            margin: 0,
            fontWeight: 400,
            flex: 1,
          }}>
            {memory.content}
          </p>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              marginTop: -2,
              marginRight: -4,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sofi-surface-tint)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="12" cy="5" r="1"/>
              <circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 12,
        }}>
          <span style={{
            color: 'var(--sofi-content-secondary)',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '20px',
          }}>
            {isPaused ? 'Paused · not used in chat' : memory.date}
          </span>
        </div>
      </div>

      {menuOpen && (
        <div ref={menuRef} style={{
          position: 'absolute',
          top: 8,
          right: 32,
          background: 'var(--sofi-surface-elevated)',
          borderRadius: 14,
          border: '1px solid var(--sofi-border-medium)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          padding: '4px 0',
          zIndex: 20,
          minWidth: 180,
          overflow: 'hidden',
          animation: 'menuFadeIn 0.15s ease-out',
        }}>
          <button
            onClick={() => handleAction('edit')}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sofi-content-primary)',
              fontSize: 15,
              fontWeight: 400,
              textAlign: 'left',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sofi-surface-tint)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <svg width="15" height="15" viewBox="0 0 13 13" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.93934 0.75C8.41956 0.269784 9.07087 0 9.75 0C10.4291 0 11.0804 0.269783 11.5607 0.75L12.25 1.43934C12.7302 1.91956 13 2.57087 13 3.25C13 3.92913 12.7302 4.58044 12.25 5.06066L5.58452 11.7261C5.28634 12.0243 4.91036 12.2327 4.49947 12.3275L1.74336 12.9636C1.6384 12.9878 1.53103 13 1.42332 13C0.637241 13 0 12.3628 0 11.5767C0 11.469 0.0122281 11.3616 0.0364494 11.2566L0.672473 8.50053C0.767295 8.08964 0.97568 7.71366 1.27386 7.41548L7.93934 0.75Z" fill="var(--sofi-content-secondary)"/></svg>
            Edit
          </button>
          <button
            onClick={() => handleAction('pause')}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sofi-content-primary)',
              fontSize: 15,
              fontWeight: 400,
              textAlign: 'left',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sofi-surface-tint)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            {isPaused ? (
              <svg width="15" height="15" viewBox="0 0 11 13" fill="none"><path d="M1.75 1.518V11.482C1.75 11.778 2.074 11.957 2.323 11.792L9.827 6.81C10.051 6.661 10.051 6.339 9.827 6.19L2.323 1.208C2.074 1.043 1.75 1.222 1.75 1.518Z" stroke="var(--sofi-content-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="14" height="15" viewBox="0 0 10 12" fill="none"><rect x="0.75" y="0.75" width="2.5" height="10.5" rx="0.5" stroke="var(--sofi-content-secondary)" strokeWidth="1.5"/><rect x="6.75" y="0.75" width="2.5" height="10.5" rx="0.5" stroke="var(--sofi-content-secondary)" strokeWidth="1.5"/></svg>
            )}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <div style={{ height: 1, background: 'var(--sofi-border-subtle)', margin: '4px 0' }} />
          <button
            onClick={() => handleAction('delete')}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--sofi-danger)',
              fontSize: 15,
              fontWeight: 400,
              textAlign: 'left',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--sofi-surface-tint)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <svg width="14" height="15" viewBox="0 0 11.5 14.5" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2.836 1.5C2.836 0.672 3.508 0 4.336 0H7.168C7.996 0 8.668 0.672 8.668 1.5V2.247H10.75C11.164 2.247 11.5 2.583 11.5 2.997C11.5 3.411 11.164 3.747 10.75 3.747H0.75C0.336 3.747 0 3.411 0 2.997C0 2.583 0.336 2.247 0.75 2.247H2.836V1.5ZM4.336 2.247H7.168V1.5H4.336V2.247ZM1.5 4.5C1.914 4.5 2.25 4.836 2.25 5.25V11.75C2.25 12.44 2.81 13 3.5 13H8C8.69 13 9.25 12.44 9.25 11.75V5.25C9.25 4.836 9.586 4.5 10 4.5C10.414 4.5 10.75 4.836 10.75 5.25V11.75C10.75 13.269 9.519 14.5 8 14.5H3.5C1.981 14.5 0.75 13.269 0.75 11.75V5.25C0.75 4.836 1.086 4.5 1.5 4.5Z" fill="var(--sofi-danger)"/><path fillRule="evenodd" clipRule="evenodd" d="M4.333 5.083C4.747 5.083 5.083 5.419 5.083 5.833V10.914C5.083 11.328 4.747 11.664 4.333 11.664C3.919 11.664 3.583 11.328 3.583 10.914V5.833C3.583 5.419 3.919 5.083 4.333 5.083ZM7.167 5.083C7.581 5.083 7.917 5.419 7.917 5.833V10.914C7.917 11.328 7.581 11.664 7.167 11.664C6.752 11.664 6.417 11.328 6.417 10.914V5.833C6.417 5.419 6.752 5.083 7.167 5.083Z" fill="var(--sofi-danger)"/></svg>
            Delete
          </button>
        </div>
      )}

      {showToast && (
        <div style={{
          position: 'absolute',
          bottom: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--sofi-surface-toast)',
          color: 'var(--sofi-content-primary)',
          padding: '8px 16px',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}>
          {showToast}
        </div>
      )}
    </div>
  );
}

export function OverflowMenu() {
  const [memories, setMemories] = useState(MEMORIES);
  const [filter, setFilter] = useState<string | null>(null);
  const categories = ['About me', 'Preferences', 'Priorities'];

  const filtered = filter ? memories.filter(m => m.category === filter) : memories;

  const handleDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'var(--sofi-surface-base)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes menuFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div style={{
        padding: '54px 16px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          <span style={{ color: 'var(--sofi-content-primary)', fontSize: 18, fontWeight: 700, lineHeight: '24px' }}>Chat memory</span>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </div>

      <div style={{
        padding: '4px 16px 8px',
        display: 'flex',
        gap: 6,
        flexShrink: 0,
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(filter === cat ? null : cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 500,
              border: filter === cat ? 'none' : '1px solid var(--sofi-chip-unselected-border)',
              background: filter === cat ? 'var(--sofi-chip-selected-bg)' : 'var(--sofi-chip-unselected-bg)',
              color: filter === cat ? 'var(--sofi-surface-base)' : 'var(--sofi-content-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {filtered.map(memory => (
          <MenuCard key={memory.id} memory={memory} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
