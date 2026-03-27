import { useState } from 'react';

export interface Memory {
  id: string;
  content: string;
  category: 'ABOUT_ME' | 'PREFERENCES' | 'PRIORITIES';
  date: string;
  status: 'ACTIVE' | 'PAUSED';
}

export const CATEGORY_LABELS: Record<string, string> = {
  ABOUT_ME: 'About me',
  PREFERENCES: 'Preferences',
  PRIORITIES: 'Priorities',
};

export const CATEGORY_ORDER = ['ABOUT_ME', 'PREFERENCES', 'PRIORITIES'] as const;

export const SAMPLE_MEMORIES: Memory[] = [
  { id: '1', content: 'Lives in Austin, TX. Moved from Chicago two years ago for work.', category: 'ABOUT_ME', date: 'Mar 15', status: 'ACTIVE' },
  { id: '2', content: 'Works at Stripe as a senior software engineer. Total comp around $280k.', category: 'ABOUT_ME', date: 'Mar 12', status: 'ACTIVE' },
  { id: '5', content: 'Has a SoFi Money account and SoFi Invest account. Considering opening a credit card.', category: 'ABOUT_ME', date: 'Mar 5', status: 'PAUSED' },
  { id: '3', content: 'Prefers concise bullet-point summaries over long explanations.', category: 'PREFERENCES', date: 'Mar 10', status: 'ACTIVE' },
  { id: '6', content: 'Risk tolerance is moderate — open to index funds but not individual stocks.', category: 'PREFERENCES', date: 'Mar 3', status: 'ACTIVE' },
  { id: '4', content: 'Wants to max out 401k contributions this year ($23,500 limit).', category: 'PRIORITIES', date: 'Mar 8', status: 'ACTIVE' },
];

export function ChevronLeftSvg({ size = 24, color = 'var(--sofi-content-primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L9.41421 12L16.7071 19.2929C17.0976 19.6834 17.0976 20.3166 16.7071 20.7071C16.3166 21.0976 15.6834 21.0976 15.2929 20.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289Z" fill={color}/>
    </svg>
  );
}

export function PlusSvg({ size = 20, color = 'var(--sofi-content-primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H9V4C9 3.44772 9.44772 3 10 3Z" fill={color}/>
    </svg>
  );
}

export function MoreSvg({ size = 20, color = 'var(--sofi-content-primary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill={color}/>
      <path d="M7 10C7 10.6904 6.44036 11.25 5.75 11.25C5.05964 11.25 4.5 10.6904 4.5 10C4.5 9.30964 5.05964 8.75 5.75 8.75C6.44036 8.75 7 9.30964 7 10Z" fill={color}/>
      <path d="M11.25 10C11.25 10.6904 10.6904 11.25 10 11.25C9.30964 11.25 8.75 10.6904 8.75 10C8.75 9.30964 9.30964 8.75 10 8.75C10.6904 8.75 11.25 9.30964 11.25 10Z" fill={color}/>
      <path d="M15.5 10C15.5 10.6904 14.9404 11.25 14.25 11.25C13.5596 11.25 13 10.6904 13 10C13 9.30964 13.5596 8.75 14.25 8.75C14.9404 8.75 15.5 9.30964 15.5 10Z" fill={color}/>
    </svg>
  );
}

export function SearchSvg({ size = 16, color = 'var(--sofi-content-secondary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM1 7a6 6 0 1 1 10.72 3.66l2.81 2.81a.75.75 0 1 1-1.06 1.06l-2.81-2.81A6 6 0 0 1 1 7Z" fill={color}/>
    </svg>
  );
}

export function FilterSvg({ size = 18, color = 'var(--sofi-content-primary)', active = false }: { size?: number; color?: string; active?: boolean }) {
  return (
    <svg width={size} height={size * 12 / 18} viewBox="0 0 18 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 1a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm3 5a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm4 4a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H7Z" fill={color}/>
    </svg>
  );
}

export function PencilSvg({ size = 13, color = 'var(--sofi-content-secondary)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.93934 0.75C8.41956 0.269784 9.07087 0 9.75 0C10.4291 0 11.0804 0.269783 11.5607 0.75L12.25 1.43934C12.7302 1.91956 13 2.57087 13 3.25C13 3.92913 12.7302 4.58044 12.25 5.06066L5.58452 11.7261C5.28634 12.0243 4.91036 12.2327 4.49947 12.3275L1.74336 12.9636C1.6384 12.9878 1.53103 13 1.42332 13C0.637241 13 0 12.3628 0 11.5767C0 11.469 0.0122281 11.3616 0.0364494 11.2566L0.672473 8.50053C0.767295 8.08964 0.97568 7.71366 1.27386 7.41548L7.93934 0.75ZM7.375 3.43566L2.33452 8.47614C2.23513 8.57553 2.16567 8.70086 2.13406 8.83782L1.52562 11.4744L4.16218 10.8659C4.29914 10.8343 4.42447 10.7649 4.52386 10.6655L9.56434 5.625L7.375 3.43566ZM10.625 4.56434L8.43566 2.375L9 1.81066C9.19891 1.61175 9.4687 1.5 9.75 1.5C10.0313 1.5 10.3011 1.61175 10.5 1.81066L11.1893 2.5C11.3883 2.69891 11.5 2.9687 11.5 3.25C11.5 3.5313 11.3883 3.80109 11.1893 4L10.625 4.56434Z" fill={color}/>
    </svg>
  );
}

export function PauseSvg({ size = 13, color = 'var(--sofi-content-secondary)' }: { size?: number; color?: string }) {
  const w = size * (9.83333 / 12.1667);
  return (
    <svg width={w} height={size} viewBox="0 0 9.83333 12.1667" fill="none">
      <path d="M8.41667 0.75H7.08333C6.71514 0.75 6.41667 1.04848 6.41667 1.41667V10.75C6.41667 11.1182 6.71514 11.4167 7.08333 11.4167H8.41667C8.78486 11.4167 9.08333 11.1182 9.08333 10.75V1.41667C9.08333 1.04848 8.78486 0.75 8.41667 0.75Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.75 0.75H1.41667C1.04848 0.75 0.75 1.04848 0.75 1.41667V10.75C0.75 11.1182 1.04848 11.4167 1.41667 11.4167H2.75C3.11819 11.4167 3.41667 11.1182 3.41667 10.75V1.41667C3.41667 1.04848 3.11819 0.75 2.75 0.75Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PlaySvg({ size = 13, color = 'var(--sofi-content-secondary)' }: { size?: number; color?: string }) {
  const w = size * (11 / 13);
  return (
    <svg width={w} height={size} viewBox="0 0 11 13" fill="none">
      <path d="M1.75 1.51795V11.482C1.75 11.7784 2.07378 11.9568 2.32283 11.7916L9.82717 6.80959C10.0506 6.66148 10.0506 6.33852 9.82717 6.19041L2.32283 1.20836C2.07378 1.04318 1.75 1.22159 1.75 1.51795Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function DeleteSvg({ size = 14.5, color = 'var(--sofi-danger)' }: { size?: number; color?: string }) {
  const aspect = 11.5 / 14.5;
  return (
    <svg width={size * aspect} height={size} viewBox="0 0 11.5 14.5" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.83594 1.5C2.83594 0.671571 3.50751 0 4.33594 0L7.16797 0C7.9964 0 8.66797 0.671582 8.66797 1.50001V2.24702H10.75C11.1642 2.24702 11.5 2.58281 11.5 2.99702C11.5 3.41123 11.1642 3.74702 10.75 3.74702H0.750003C0.33579 3.74702 0 3.41124 0 2.99702C0 2.58281 0.335783 2.24702 0.749997 2.24702L2.83594 2.24701V1.5ZM4.33594 2.24701L7.16797 2.24702V1.50001L4.33594 1.5V2.24701ZM1.5 4.50001C1.91421 4.50001 2.25 4.8358 2.25 5.25001V11.75C2.25 12.4404 2.80964 13 3.5 13H8C8.69036 13 9.25 12.4404 9.25 11.75V5.25001C9.25 4.8358 9.58579 4.50001 10 4.50001C10.4142 4.50001 10.75 4.8358 10.75 5.25001V11.75C10.75 13.2688 9.51878 14.5 8 14.5H3.5C1.98122 14.5 0.75 13.2688 0.75 11.75V5.25001C0.75 4.8358 1.08579 4.50001 1.5 4.50001Z" fill={color}/>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.33325 5.08296C4.74747 5.08296 5.08325 5.41875 5.08325 5.83296V10.914C5.08325 11.3283 4.74747 11.664 4.33325 11.664C3.91904 11.664 3.58325 11.3283 3.58325 10.914V5.83296C3.58325 5.41875 3.91904 5.08296 4.33325 5.08296ZM7.1665 5.08296C7.58072 5.08296 7.9165 5.41875 7.9165 5.83296V10.914C7.9165 11.3283 7.58072 11.664 7.1665 11.664C6.75229 11.664 6.4165 11.3283 6.4165 10.914V5.83296C6.4165 5.41875 6.75229 5.08296 7.1665 5.08296Z" fill={color}/>
    </svg>
  );
}

export function AppBarHeader({ onPlusPress }: { onPlusPress?: () => void }) {
  return (
    <div style={{
      paddingTop: 54,
      background: 'var(--sofi-surface-base)',
      zIndex: 40,
    }}>
      <div style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{ width: 104, paddingLeft: 16, paddingRight: 4, display: 'flex', flexShrink: 0 }}>
          <button style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 12, padding: 0 }}>
            <ChevronLeftSvg size={24} />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <span style={{ fontSize: 16, fontWeight: 500, lineHeight: '20px', color: 'var(--sofi-content-primary)', textAlign: 'center', whiteSpace: 'nowrap' }}>Chat memory</span>
        </div>
        <div style={{ width: 104, paddingRight: 16, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20, flexShrink: 0 }}>
          {onPlusPress && (
            <button onClick={onPlusPress} style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 12, padding: 0 }}>
              <PlusSvg size={20} />
            </button>
          )}
          <button style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 12, padding: 0 }}>
            <MoreSvg size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchBarUI({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
      <div style={{
        flex: 1,
        height: 48,
        borderRadius: 24,
        border: '0.75px solid var(--sofi-surface-edge)',
        background: 'var(--sofi-surface-elevated)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
      }}>
        <SearchSvg size={16} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--sofi-content-primary)',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '20px',
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}

function PillFilter({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        borderRadius: 24,
        border: selected ? '1px solid var(--sofi-chip-selected-bg)' : '1px solid var(--sofi-chip-unselected-border)',
        background: selected ? 'var(--sofi-chip-selected-bg)' : 'var(--sofi-chip-unselected-bg)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', color: selected ? 'var(--sofi-content-primary-inverse)' : 'var(--sofi-content-bone600)' }}>
        {label}
      </span>
    </button>
  );
}

export function FilterChips({ filterCat, setFilterCat }: { filterCat: string | null; setFilterCat: (c: string | null) => void }) {
  return (
    <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8, overflow: 'auto' }}>
      <PillFilter label="All" selected={filterCat === null} onClick={() => setFilterCat(null)} />
      {CATEGORY_ORDER.map(cat => (
        <PillFilter
          key={cat}
          label={CATEGORY_LABELS[cat]}
          selected={filterCat === cat}
          onClick={() => setFilterCat(filterCat === cat ? null : cat)}
        />
      ))}
    </div>
  );
}

export function useMemoryState() {
  const [memories, setMemories] = useState<Memory[]>(SAMPLE_MEMORIES);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const visible = memories.filter(m => {
    if (filterCat && m.category !== filterCat) return false;
    if (search && !m.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped: Record<string, Memory[]> = {};
  for (const cat of CATEGORY_ORDER) {
    const items = visible.filter(m => m.category === cat);
    if (items.length > 0) grouped[cat] = items;
  }

  const catCounts: Record<string, number> = {};
  memories.forEach(m => { catCounts[m.category] = (catCounts[m.category] || 0) + 1; });

  const deleteMemory = (id: string) => setMemories(prev => prev.filter(m => m.id !== id));
  const togglePause = (id: string) => setMemories(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'PAUSED' ? 'ACTIVE' as const : 'PAUSED' as const } : m));

  return { memories, search, setSearch, filterCat, setFilterCat, visible, grouped, catCounts, deleteMemory, togglePause };
}
