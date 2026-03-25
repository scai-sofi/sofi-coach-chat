import './_group.css';
import {
  V, PhoneFrame, StatusBar, PacificAppBar,
  CloseIconSvg, ClockIconSvg, MoreIconSvg,
} from './_shared';

export function IncognitoChat() {
  return (
    <PhoneFrame>
      <StatusBar />

      <PacificAppBar
        leftIcon={<CloseIconSvg size={24} />}
        title="Coach"
        subtitle={
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: V.contentSecondary,
            lineHeight: '16px',
            letterSpacing: '0.1px',
          }}>
            Incognito chat
          </span>
        }
        rightIcons={[
          <ClockIconSvg size={20} />,
          <MoreIconSvg size={20} />,
        ]}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          width: 358,
        }}>
          <GlyphHideStrokeLarge size={40} color={V.contentPrimary} />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: 24,
              fontWeight: 500,
              color: V.contentPrimary,
              lineHeight: '28px',
              letterSpacing: '-0.5px',
              margin: 0,
            }}>
              You're in incognito mode
            </p>
            <p style={{
              fontSize: 14,
              fontWeight: 400,
              color: V.contentSecondary,
              lineHeight: '20px',
              letterSpacing: '0px',
              margin: 0,
            }}>
              Nothing in this conversation will be saved or used in future conversations
            </p>
          </div>
        </div>
      </div>

      <div style={{ paddingInline: 16, paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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

          <div style={{
            width: 32,
            height: 32,
            borderRadius: 100,
            border: `0.75px solid ${V.surfaceEdge}`,
            backgroundColor: '#f0eeeb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <GlyphHideStroke size={14.5} color={V.contentPrimary} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 21, paddingBottom: 8 }}>
        <div style={{
          width: 134,
          height: 5,
          borderRadius: 100,
          backgroundColor: V.contentStatusbar,
        }} />
      </div>
    </PhoneFrame>
  );
}

function GlyphHideStroke({ size = 14.5, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: 'scaleY(-1)' }}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlyphHideStrokeLarge({ size = 40, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: 'scaleY(-1)' }}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
