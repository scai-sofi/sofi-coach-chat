import './_group.css';
import {
  V, PhoneFrame, StatusBar, PacificAppBar, EmptyChatCard,
  DemoIconSvg, ClockIconSvg,
} from './_shared';
import orbComboImg from './orb-combo.png';

export function CurrentWelcome() {
  return (
    <PhoneFrame>
      <StatusBar />

      <PacificAppBar
        leftIcon={<DemoIconSvg size={20} />}
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
      }}>
        <img
          src={orbComboImg}
          alt="Coach orb"
          style={{ width: 96, height: 120, objectFit: 'contain' }}
        />

        <p style={{
          fontSize: 24,
          fontWeight: 500,
          color: V.contentPrimary,
          lineHeight: '28px',
          letterSpacing: '-0.5px',
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
          margin: 0,
          paddingInline: 16,
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
        paddingBottom: 16,
        paddingTop: 40,
      }}>
        <EmptyChatCard label="Support" text="I need help with my SoFi account." wide={true} />
        <div style={{ display: 'flex', gap: 12 }}>
          <EmptyChatCard label="Credit score" text="Why did my credit score change?" wide={false} />
          <EmptyChatCard label="Spending" text="Review monthly spending." wide={false} />
        </div>
      </div>

      <div style={{ backgroundColor: 'transparent' }}>
        <div style={{ paddingInline: 16, paddingBottom: 8 }}>
          <div style={{
            minHeight: 48,
            borderRadius: 24,
            border: `0.75px solid ${V.surfaceEdge}`,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 20,
            paddingRight: 8,
            paddingBlock: 8,
            backgroundColor: V.surfaceElevated,
          }}>
            <span style={{ flex: 1, fontSize: 16, fontWeight: 400, color: V.contentSecondary, lineHeight: '20px' }}>
              Message
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 8, paddingInline: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 400, color: V.contentSecondary, lineHeight: '16px' }}>
            AI can make mistakes. <span style={{ textDecoration: 'underline' }}>Learn more</span>{'   '}<span style={{ textDecoration: 'underline' }}>Privacy policy</span>
          </span>
        </div>
      </div>

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
