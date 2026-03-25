import './_group.css';

export function BottomSheet() {
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
          <DemoIcon />
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--sofi-content-primary)' }}>SoFi Coach</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockIcon />
          <NewChatIcon />
        </div>
      </div>

      {/* Chat area - dimmed behind sheet */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: 16, opacity: 0.3 }}>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'var(--sofi-surface-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ fontSize: 28 }}>💬</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--sofi-content-primary)', display: 'block', marginBottom: 8 }}>
            Start a conversation
          </span>
          <span style={{ fontSize: 14, color: 'var(--sofi-content-secondary)', lineHeight: '20px' }}>
            Your financial coach is ready to help.
          </span>
        </div>
      </div>

      {/* Scrim overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.35)',
        zIndex: 10,
      }} />

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--sofi-surface-elevated)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 20,
        boxShadow: '0px -4px 24px rgba(10,10,10,0.12)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--sofi-content-muted)' }} />
        </div>

        <div style={{ padding: '8px 24px 16px' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--sofi-content-primary)', display: 'block', marginBottom: 4, lineHeight: '28px' }}>
            New conversation
          </span>
          <span style={{ fontSize: 14, color: 'var(--sofi-content-secondary)', lineHeight: '20px' }}>
            Choose how you'd like to chat
          </span>
        </div>

        {/* Option cards */}
        <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Standard chat */}
          <ChatOptionCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" />
                <rect x="3" y="8" width="18" height="14" rx="2" />
                <circle cx="9" cy="15" r="1.5" fill="var(--sofi-content-brand)" stroke="none" />
                <circle cx="15" cy="15" r="1.5" fill="var(--sofi-content-brand)" stroke="none" />
              </svg>
            }
            iconBg="rgba(0,162,199,0.1)"
            title="With memory"
            description="Coach remembers your preferences and goals across sessions"
            selected={false}
          />

          {/* Incognito chat */}
          <ChatOptionCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            }
            iconBg="var(--sofi-surface-tint)"
            title="Without memory"
            description="Nothing from this chat will be saved — perfect for sensitive questions"
            selected={true}
          />
        </div>

        {/* CTA */}
        <div style={{ padding: '0 16px 34px' }}>
          <button style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 28,
            backgroundColor: 'var(--sofi-content-primary)',
            color: 'var(--sofi-surface-base)',
            fontSize: 16,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            lineHeight: '20px',
          }}>
            Start chat
          </button>
        </div>
      </div>

      {/* Annotation */}
      <div style={{
        position: 'absolute',
        top: 110,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--sofi-content-brand)',
        color: 'white',
        fontSize: 11,
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 6,
        lineHeight: '14px',
        zIndex: 30,
        whiteSpace: 'nowrap',
      }}>
        Choice at conversation start ↓
      </div>
    </div>
  );
}

function ChatOptionCard({ icon, iconBg, title, description, selected }: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  selected: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      borderRadius: 16,
      border: `2px solid ${selected ? 'var(--sofi-content-primary)' : 'var(--sofi-surface-edge)'}`,
      backgroundColor: selected ? 'var(--sofi-surface-muted)' : 'var(--sofi-surface-elevated)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--sofi-content-primary)', display: 'block', lineHeight: '20px' }}>
          {title}
        </span>
        <span style={{ fontSize: 13, color: 'var(--sofi-content-secondary)', lineHeight: '18px' }}>
          {description}
        </span>
      </div>
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        border: `2px solid ${selected ? 'var(--sofi-content-primary)' : 'var(--sofi-content-dimmed)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && (
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: 'var(--sofi-content-primary)',
          }} />
        )}
      </div>
    </div>
  );
}

function DemoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
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

function NewChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sofi-content-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
