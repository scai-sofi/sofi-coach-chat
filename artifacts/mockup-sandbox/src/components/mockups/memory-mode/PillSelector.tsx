import './_group.css';

export function PillSelector() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--sofi-surface-base)',
      fontFamily: 'var(--sofi-font)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Status bar */}
      <div style={{
        height: 54,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 8,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--sofi-content-primary)' }}>9:41</span>
      </div>

      {/* App bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 16,
        height: 56,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CloseIcon />
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--sofi-content-primary)' }}>SoFi Coach</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockIcon />
          <MoreDotsIcon />
        </div>
      </div>

      {/* Segmented pill selector */}
      <div style={{
        marginInline: 16,
        marginTop: 4,
        marginBottom: 12,
        display: 'flex',
        backgroundColor: 'var(--sofi-surface-tint)',
        borderRadius: 12,
        padding: 3,
        gap: 2,
      }}>
        <SegmentPill label="Memory" icon={<BrainIcon active />} active={false} />
        <SegmentPill label="Incognito" icon={<IncognitoIcon active={false} />} active={true} />
      </div>

      {/* Incognito active indicator */}
      <div style={{
        marginInline: 16,
        padding: '14px 16px',
        backgroundColor: 'var(--sofi-surface-elevated)',
        borderRadius: 16,
        boxShadow: 'var(--sofi-shadow)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #5c5b5a 0%, #3d3d3c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--sofi-content-primary)', display: 'block', lineHeight: '20px' }}>
            Incognito mode active
          </span>
          <span style={{ fontSize: 13, color: 'var(--sofi-content-secondary)', lineHeight: '18px' }}>
            Nothing from this chat will be saved to your memory or used in future conversations.
          </span>
        </div>
      </div>

      {/* Empty state */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'var(--sofi-surface-tint)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--sofi-content-primary)', display: 'block', marginBottom: 6 }}>
            Private conversation
          </span>
          <span style={{ fontSize: 14, color: 'var(--sofi-content-secondary)', lineHeight: '20px' }}>
            Ask anything — your Coach is here to help without storing any details.
          </span>
        </div>

        {/* Suggestion pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          {['Compare credit cards', 'Tax question', 'Budget check'].map(s => (
            <div key={s} style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: '1px solid var(--sofi-content-bone600)',
              backgroundColor: 'transparent',
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--sofi-content-bone600)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        paddingInline: 16,
        paddingBlock: 12,
        borderTop: '1px solid var(--sofi-surface-edge)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 34,
      }}>
        <div style={{
          flex: 1,
          backgroundColor: 'var(--sofi-surface-elevated)',
          borderRadius: 24,
          padding: '10px 16px',
          border: '1px solid var(--sofi-surface-edge)',
        }}>
          <span style={{ fontSize: 15, color: 'var(--sofi-content-muted)' }}>Ask anything...</span>
        </div>
        <SendButton />
      </div>

      {/* Annotation */}
      <div style={{
        position: 'absolute',
        top: 112,
        right: 16,
        backgroundColor: 'var(--sofi-content-brand)',
        color: 'white',
        fontSize: 11,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 6,
        lineHeight: '14px',
      }}>
        ← Segmented control
      </div>
    </div>
  );
}

function SegmentPill({ label, icon, active }: { label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '8px 12px',
      borderRadius: 10,
      backgroundColor: active ? 'var(--sofi-surface-elevated)' : 'transparent',
      boxShadow: active ? '0px 1px 3px rgba(10,10,10,0.08)' : 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}>
      {icon}
      <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: active ? 'var(--sofi-content-primary)' : 'var(--sofi-content-secondary)',
      }}>
        {label}
      </span>
    </div>
  );
}

function BrainIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--sofi-content-secondary)' : 'var(--sofi-content-brand)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" />
      <rect x="3" y="8" width="18" height="14" rx="2" />
      <circle cx="9" cy="15" r="1.5" fill={active ? 'var(--sofi-content-secondary)' : 'var(--sofi-content-brand)'} stroke="none" />
      <circle cx="15" cy="15" r="1.5" fill={active ? 'var(--sofi-content-secondary)' : 'var(--sofi-content-brand)'} stroke="none" />
    </svg>
  );
}

function IncognitoIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--sofi-content-secondary)' : 'var(--sofi-content-primary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MoreDotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--sofi-content-primary)">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

function SendButton() {
  return (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'var(--sofi-content-bone600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </div>
  );
}
