import './_group.css';
import {
  V, PhoneFrame, StatusBar, PacificAppBar, PacificInputBar, SuggestionPill, EmptyChatCard,
  CloseIconSvg, ClockIconSvg, MoreIconSvg, MemoryMenuIconSvg,
} from './_shared';

export function PillSelector() {
  return (
    <PhoneFrame>
      <StatusBar />

      <PacificAppBar
        leftIcon={<CloseIconSvg size={24} />}
        title="SoFi Coach"
        rightIcons={[
          <ClockIconSvg size={20} />,
          <MoreIconSvg size={20} />,
        ]}
      />

      {/* Segmented pill selector — sits below AppBar */}
      <div style={{
        marginInline: 16,
        marginTop: 4,
        marginBottom: 16,
        display: 'flex',
        backgroundColor: V.surfaceTint,
        borderRadius: 12,
        padding: 3,
        gap: 2,
      }}>
        <SegmentPill
          label="Memory"
          icon={<MemoryMenuIconSvg size={14} color={V.contentSecondary} />}
          active={false}
        />
        <SegmentPill
          label="Incognito"
          icon={<EyeOffSvg size={14} color={V.contentPrimary} />}
          active={true}
        />
      </div>

      {/* Status card when incognito is active */}
      <div style={{
        marginInline: 16,
        padding: '14px 16px',
        backgroundColor: V.surfaceElevated,
        borderRadius: 16,
        boxShadow: `0px 2px 8px ${V.contentStatusbar}0A`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: V.contentBone600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <EyeOffSvg size={18} color={V.whiteOnDark} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: V.contentPrimary, display: 'block', lineHeight: '20px' }}>
            Incognito mode active
          </span>
          <span style={{ fontSize: 13, fontWeight: 400, color: V.contentSecondary, lineHeight: '18px' }}>
            Nothing from this chat will be saved or used in future conversations.
          </span>
        </div>
      </div>

      {/* Empty state centered */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingInline: 32, gap: 12 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: V.surfaceTint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <EyeOffSvg size={28} color={V.contentMuted} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 500, color: V.contentPrimary, display: 'block', marginBottom: 8, lineHeight: '28px', letterSpacing: '-0.5px' }}>
            Private conversation
          </span>
          <span style={{ fontSize: 14, fontWeight: 400, color: V.contentSecondary, lineHeight: '20px' }}>
            Ask anything — your Coach is here to help without storing any details.
          </span>
        </div>
      </div>

      {/* Suggestion cards */}
      <div style={{ paddingInline: 16, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <EmptyChatCard label="Support" text="I need help with my SoFi account." wide={true} />
        <div style={{ display: 'flex', gap: 12 }}>
          <EmptyChatCard label="Credit score" text="Why did my credit score change?" wide={false} />
          <EmptyChatCard label="Spending" text="Review monthly spending." wide={false} />
        </div>
      </div>

      <PacificInputBar />
    </PhoneFrame>
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
      backgroundColor: active ? V.surfaceElevated : 'transparent',
      boxShadow: active ? '0px 1px 3px rgba(10,10,10,0.08)' : 'none',
      cursor: 'pointer',
    }}>
      {icon}
      <span style={{
        fontSize: 13,
        fontWeight: 500,
        color: active ? V.contentPrimary : V.contentSecondary,
        lineHeight: '16px',
      }}>
        {label}
      </span>
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
