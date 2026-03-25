import { useState } from 'react';
import './_group.css';
import {
  V, PhoneFrame, StatusBar, PacificAppBar, EmptyChatCard,
  CloseIconSvg, ClockIconSvg, MoreIconSvg,
} from './_shared';

export function WelcomeEntry() {
  const [showIncognito, setShowIncognito] = useState(false);

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

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        paddingTop: 100,
        width: 358,
        marginInline: 'auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 78,
            height: 78,
            borderRadius: 210,
            background: 'linear-gradient(135deg, rgba(0,162,199,0.15) 0%, rgba(196,168,130,0.25) 50%, rgba(0,162,199,0.2) 100%)',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.4)',
          }} />
          <div style={{
            width: 96,
            height: 16,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,162,199,0.12) 0%, transparent 70%)',
          }} />
        </div>

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

      <div style={{ flex: 1 }} />

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

      <div style={{ paddingInline: 16, paddingTop: 16, paddingBottom: 0 }}>
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

          <div
            onClick={() => setShowIncognito(true)}
            style={{
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
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = V.surfaceTint; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = V.surfaceElevated; }}
          >
            <GlyphHideStroke size={14.5} color={V.contentPrimary} />
          </div>
        </div>
      </div>

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

      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
        <div style={{
          width: 134,
          height: 5,
          borderRadius: 100,
          backgroundColor: '#000000',
        }} />
      </div>

      <div
        onClick={() => setShowIncognito(false)}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: V.scrimBackdrop,
          opacity: showIncognito ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: showIncognito ? 'auto' : 'none',
          zIndex: 90,
        }}
      />

      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        transform: showIncognito ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: V.surfaceBase,
        borderTopLeftRadius: showIncognito ? 0 : 16,
        borderTopRightRadius: showIncognito ? 0 : 16,
      }}>
        <StatusBar />

        <PacificAppBar
          leftIcon={
            <div onClick={() => setShowIncognito(false)} style={{ cursor: 'pointer' }}>
              <CloseIconSvg size={24} />
            </div>
          }
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
