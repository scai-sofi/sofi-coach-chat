import './_group.css';
import {
  V, PhoneFrame, StatusBar, PacificAppBar, PacificInputBar, SuggestionPill,
  CloseIconSvg, ClockIconSvg, MoreIconSvg, MemoryMenuIconSvg,
} from './_shared';

export function ToggleHeader() {
  return (
    <PhoneFrame>
      <StatusBar />

      <PacificAppBar
        leftIcon={<CloseIconSvg size={24} />}
        title="SoFi Coach"
        rightIcons={[
          <ClockIconSvg size={20} />,
          <MemoryTogglePill active={false} />,
          <MoreIconSvg size={20} />,
        ]}
      />

      {/* Memory-off banner (slides in when toggle is off) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingInline: 16,
        paddingBlock: 10,
        backgroundColor: V.surfaceTint,
        borderBottom: `0.75px solid ${V.surfaceEdge}`,
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: V.contentBone600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <EyeOffSvg size={14} color={V.whiteOnDark} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: V.contentPrimary, display: 'block', lineHeight: '20px' }}>
            Memory is off
          </span>
          <span style={{ fontSize: 12, fontWeight: 400, color: V.contentSecondary, lineHeight: '16px' }}>
            This conversation won't be remembered
          </span>
        </div>
        <span style={{
          fontSize: 13,
          fontWeight: 500,
          color: V.contentBrand,
          cursor: 'pointer',
          padding: '4px 8px',
          lineHeight: '16px',
        }}>
          Turn on
        </span>
      </div>

      {/* Chat content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 16, gap: 12 }}>
        {/* AI bubble */}
        <div style={{
          backgroundColor: V.surfaceElevated,
          borderRadius: 20,
          borderTopLeftRadius: 4,
          padding: 16,
          maxWidth: '85%',
          boxShadow: V.dropShadow2,
        }}>
          <span style={{ fontSize: 16, fontWeight: 400, color: V.contentPrimary, lineHeight: '22px' }}>
            Hi! I'm your SoFi Coach. Memory is currently off — I won't remember anything from this chat. How can I help?
          </span>
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: 16, paddingLeft: 4 }}>
          <ActionIconPlaceholder />
          <ActionIconPlaceholder />
          <ActionIconPlaceholder />
        </div>

        {/* User bubble */}
        <div style={{
          alignSelf: 'flex-end',
          backgroundColor: V.contentBone600,
          borderRadius: 20,
          borderTopRightRadius: 4,
          padding: '10px 16px',
          maxWidth: '85%',
        }}>
          <span style={{ fontSize: 16, fontWeight: 400, color: V.whiteOnDark, lineHeight: '22px' }}>
            What's the best savings account right now?
          </span>
        </div>

        {/* Suggestion pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <SuggestionPill text="Compare rates" />
          <SuggestionPill text="APY breakdown" />
        </div>
      </div>

      <PacificInputBar />
    </PhoneFrame>
  );
}

function MemoryTogglePill({ active }: { active: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 8px',
      borderRadius: 12,
      backgroundColor: active ? 'rgba(0,162,199,0.08)' : V.surfaceTint,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}>
      {active ? (
        <MemoryMenuIconSvg size={14} color={V.contentBrand} />
      ) : (
        <EyeOffSvg size={14} color={V.contentSecondary} />
      )}
      <span style={{
        fontSize: 11,
        fontWeight: 500,
        color: active ? V.contentBrand : V.contentSecondary,
        lineHeight: '14px',
      }}>
        {active ? 'On' : 'Off'}
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

function ActionIconPlaceholder() {
  return (
    <div style={{
      width: 20,
      height: 20,
      borderRadius: 4,
      opacity: 0.4,
    }}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke={V.contentBone600} strokeWidth="1.5" />
      </svg>
    </div>
  );
}
