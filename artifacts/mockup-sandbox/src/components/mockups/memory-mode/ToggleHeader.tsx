import './_group.css';

export function ToggleHeader() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--sofi-surface-base)',
      fontFamily: 'var(--sofi-font)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Status bar */}
      <div style={{
        height: 54,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 8,
        backgroundColor: 'var(--sofi-surface-base)',
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--sofi-content-primary)' }}>9:41</span>
      </div>

      {/* App bar with memory toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: 16,
        height: 56,
        borderBottom: '1px solid var(--sofi-surface-edge)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CloseIcon />
          <div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--sofi-content-primary)', display: 'block', lineHeight: '20px' }}>
              SoFi Coach
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
              <span style={{ fontSize: 11, color: 'var(--sofi-content-secondary)', lineHeight: '14px' }}>Online</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Memory toggle — Claude style */}
          <MemoryToggle active={false} />
          <MoreDotsIcon />
        </div>
      </div>

      {/* Incognito banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingInline: 16,
        paddingBlock: 10,
        backgroundColor: '#f0ede8',
      }}>
        <IncognitoIcon />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--sofi-content-primary)', display: 'block', lineHeight: '16px' }}>
            Memory is off
          </span>
          <span style={{ fontSize: 12, color: 'var(--sofi-content-secondary)', lineHeight: '16px' }}>
            This conversation won't be remembered
          </span>
        </div>
        <button style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--sofi-content-brand)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
        }}>
          Turn on
        </button>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16, gap: 12 }}>
        {/* Welcome message */}
        <div style={{
          backgroundColor: 'var(--sofi-surface-elevated)',
          borderRadius: 20,
          borderTopLeftRadius: 4,
          padding: 16,
          maxWidth: '85%',
          boxShadow: 'var(--sofi-shadow)',
        }}>
          <span style={{ fontSize: 15, color: 'var(--sofi-content-primary)', lineHeight: '22px' }}>
            Hi! I'm your SoFi Coach. Memory is currently off — I won't remember anything from this chat. How can I help?
          </span>
        </div>

        {/* User message */}
        <div style={{
          alignSelf: 'flex-end',
          backgroundColor: 'var(--sofi-content-bone600)',
          borderRadius: 20,
          borderTopRightRadius: 4,
          padding: '10px 16px',
          maxWidth: '85%',
        }}>
          <span style={{ fontSize: 15, color: 'var(--sofi-white)', lineHeight: '22px' }}>
            What's the best savings account right now?
          </span>
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
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: 15, color: 'var(--sofi-content-muted)' }}>Ask anything...</span>
        </div>
        <SendButton />
      </div>

      {/* Annotation overlay */}
      <div style={{
        position: 'absolute',
        top: 64,
        right: 50,
        backgroundColor: 'var(--sofi-content-brand)',
        color: 'white',
        fontSize: 11,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 6,
        lineHeight: '14px',
        whiteSpace: 'nowrap',
      }}>
        ← Toggle in header
      </div>

      <div style={{
        position: 'absolute',
        top: 118,
        left: 16,
        backgroundColor: 'var(--sofi-content-brand)',
        color: 'white',
        fontSize: 11,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 6,
        lineHeight: '14px',
        whiteSpace: 'nowrap',
      }}>
        Contextual banner ↓
      </div>
    </div>
  );
}

function MemoryToggle({ active }: { active: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 10px',
      borderRadius: 20,
      backgroundColor: active ? 'rgba(0,162,199,0.1)' : 'var(--sofi-surface-tint)',
      cursor: 'pointer',
      border: `1px solid ${active ? 'rgba(0,162,199,0.3)' : 'transparent'}`,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--sofi-content-brand)' : 'var(--sofi-content-secondary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" />
        <rect x="3" y="8" width="18" height="14" rx="2" />
        {!active && <line x1="2" y1="2" x2="22" y2="22" stroke="var(--sofi-content-secondary)" strokeWidth="2.5" />}
      </svg>
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: active ? 'var(--sofi-content-brand)' : 'var(--sofi-content-secondary)',
        lineHeight: '14px',
      }}>
        {active ? 'On' : 'Off'}
      </span>
    </div>
  );
}

function IncognitoIcon() {
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'var(--sofi-content-bone600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    </div>
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
