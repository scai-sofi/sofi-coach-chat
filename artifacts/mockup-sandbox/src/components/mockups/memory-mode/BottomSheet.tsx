import './_group.css';
import {
  V, PhoneFrame, StatusBar, PacificAppBar,
  DemoIconSvg, ClockIconSvg, ChatNewIconSvg, MemoryMenuIconSvg,
} from './_shared';

export function BottomSheet() {
  return (
    <PhoneFrame>
      <StatusBar />

      <PacificAppBar
        leftIcon={<DemoIconSvg size={20} />}
        title="SoFi Coach"
        rightIcons={[
          <ClockIconSvg size={20} />,
          <ChatNewIconSvg size={20} />,
        ]}
      />

      {/* Dimmed chat background behind sheet */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, opacity: 0.3 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: V.surfaceTint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill={V.contentMuted} />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12Z" fill={V.contentMuted} />
            <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill={V.contentMuted} />
          </svg>
        </div>
        <span style={{ fontSize: 24, fontWeight: 500, color: V.contentPrimary, lineHeight: '28px', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 8 }}>
          {"I'm Coach.\nHow can I help?"}
        </span>
        <span style={{ fontSize: 14, fontWeight: 400, color: V.contentSecondary, lineHeight: '20px', textAlign: 'center' }}>
          Your financial coach is ready to help.
        </span>
      </div>

      {/* Scrim overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: V.scrimBackdrop,
        zIndex: 10,
      }} />

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: V.surfaceElevated,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 20,
        boxShadow: '0px -6px 16px rgba(10,10,10,0.16)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: V.contentMuted }} />
        </div>

        {/* Sheet header */}
        <div style={{ padding: '8px 20px 16px' }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: V.contentPrimary, display: 'block', lineHeight: '20px', marginBottom: 4 }}>
            New conversation
          </span>
          <span style={{ fontSize: 14, fontWeight: 400, color: V.contentSecondary, lineHeight: '20px' }}>
            Choose how you'd like to chat
          </span>
        </div>

        {/* Option cards */}
        <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ChatOptionCard
            icon={<MemoryMenuIconSvg size={22} color={V.contentBrand} />}
            iconBg="rgba(0,162,199,0.08)"
            title="With memory"
            description="Coach remembers your preferences and goals across sessions"
            selected={false}
          />
          <ChatOptionCard
            icon={<EyeOffSvg size={22} color={V.contentPrimary} />}
            iconBg={V.surfaceTint}
            title="Without memory"
            description="Nothing from this chat will be saved — perfect for sensitive questions"
            selected={true}
          />
        </div>

        {/* CTA button */}
        <div style={{ padding: '0 16px 34px' }}>
          <button style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 9999,
            backgroundColor: V.contentPrimary,
            color: V.contentPrimaryInverse,
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            lineHeight: '20px',
            fontFamily: 'inherit',
          }}>
            Start chat
          </button>
        </div>
      </div>
    </PhoneFrame>
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
      border: `1.5px solid ${selected ? V.contentPrimary : V.surfaceEdge}`,
      backgroundColor: selected ? V.surfaceMuted : V.surfaceElevated,
      cursor: 'pointer',
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
        <span style={{ fontSize: 16, fontWeight: 500, color: V.contentPrimary, display: 'block', lineHeight: '20px' }}>
          {title}
        </span>
        <span style={{ fontSize: 13, fontWeight: 400, color: V.contentSecondary, lineHeight: '18px' }}>
          {description}
        </span>
      </div>
      {/* Radio */}
      <div style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        border: `1.5px solid ${selected ? V.contentPrimary : V.contentDimmed}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && (
          <div style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: V.contentPrimary,
          }} />
        )}
      </div>
    </div>
  );
}

function EyeOffSvg({ size = 20, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
