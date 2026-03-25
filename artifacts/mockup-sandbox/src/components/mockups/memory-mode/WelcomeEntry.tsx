import './_group.css';
import {
  V, PhoneFrame, StatusBar, PacificAppBar, EmptyChatCard,
  CloseIconSvg, ClockIconSvg, SendArrowSvg,
} from './_shared';

export function WelcomeEntry() {
  return (
    <PhoneFrame>
      <StatusBar />

      <PacificAppBar
        leftIcon={<CloseIconSvg size={24} />}
        title="Coach"
        rightIcons={[
          <ClockIconSvg size={20} />,
        ]}
      />

      {/* Top section — Orb + greeting */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        paddingTop: 100,
        width: 358,
        marginInline: 'auto',
      }}>
        {/* Orb placeholder — 78px glass orb circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 78,
            height: 78,
            borderRadius: 210,
            background: 'linear-gradient(135deg, rgba(0,162,199,0.15) 0%, rgba(196,168,130,0.25) 50%, rgba(0,162,199,0.2) 100%)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.4)',
          }} />
          {/* Caustic shadow */}
          <div style={{
            width: 96,
            height: 16,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,162,199,0.12) 0%, transparent 70%)',
          }} />
        </div>

        {/* Greeting */}
        <p style={{
          fontSize: 24,
          fontWeight: 500,
          color: V.contentPrimary,
          lineHeight: '28px',
          letterSpacing: '-0.5px',
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
          margin: 0,
          width: '100%',
        }}>
          {"I'm Coach.\nHow can I help?"}
        </p>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Suggestion cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        paddingInline: 16,
        width: '100%',
      }}>
        <EmptyChatCard label="Support" text="I need help with my SoFi account." wide={true} />
        <div style={{ display: 'flex', gap: 12 }}>
          <EmptyChatCard label="Credit score" text="Why did my credit score change?" wide={false} />
          <EmptyChatCard label="Spending" text="Review monthly spending." wide={false} />
        </div>
      </div>

      {/* Input area with incognito button — matching Figma exactly */}
      <div style={{ paddingInline: 16, paddingTop: 16, paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Input pill — 318px width in Figma (flex to fill minus button) */}
          <div style={{
            flex: 1,
            height: 48,
            borderRadius: 24,
            border: `0.75px solid ${V.surfaceEdge}`,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 8,
            backgroundColor: V.surfaceElevated,
          }}>
            <span style={{
              flex: 1,
              fontSize: 16,
              fontWeight: 400,
              color: V.contentSecondary,
              lineHeight: '20px',
            }}>
              Message
            </span>
          </div>

          {/* Incognito / eye-hide button — the entry point */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 100,
            border: `0.75px solid ${V.surfaceEdge}`,
            backgroundColor: V.surfaceElevated,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}>
            <GlyphHideStroke size={14.5} color={V.contentPrimary} />
          </div>
        </div>
      </div>

      {/* Disclaimer links */}
      <div style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingInline: 16,
      }}>
        <span style={{ fontSize: 12, fontWeight: 400, color: V.contentSecondary, lineHeight: '16px', letterSpacing: '0.1px' }}>
          AI can make mistakes.
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: V.contentSecondary, lineHeight: '16px', letterSpacing: '0.1px', textDecoration: 'underline' }}>
          Learn more
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: V.contentSecondary, lineHeight: '16px', letterSpacing: '0.1px', textDecoration: 'underline' }}>
          Privacy policy
        </span>
      </div>

      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
        <div style={{
          width: 134,
          height: 5,
          borderRadius: 100,
          backgroundColor: '#000000',
        }} />
      </div>
    </PhoneFrame>
  );
}

function GlyphHideStroke({ size = 14.5, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
