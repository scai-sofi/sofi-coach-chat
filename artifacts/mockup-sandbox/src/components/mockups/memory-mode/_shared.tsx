import React from 'react';

export const V = {
  surfaceBase: '#faf8f5',
  surfaceElevated: '#ffffff',
  surfaceTint: '#f0ede8',
  surfaceEdge: 'rgba(10,10,10,0.10)',
  surfaceEdgeLight: 'rgba(10,10,10,0.05)',
  surfaceMuted: '#f5f3f0',
  contentPrimary: '#1a1919',
  contentPrimaryInverse: '#ffffff',
  contentSecondary: '#706f6e',
  contentBone600: '#5c5b5a',
  contentStatusbar: '#0a0a0a',
  contentMuted: '#d0ccc5',
  contentDimmed: '#bdbbb9',
  contentBrand: '#00a2c7',
  danger: '#fa2d25',
  whiteOnDark: '#ffffff',
  scrimBackdrop: 'rgba(0,0,0,0.35)',
  shadowColor: 'rgba(10,10,10,0.16)',
  dropShadow2: '0px 2px 8px rgba(10,10,10,0.04)',
};

export function CloseIconSvg({ size = 24, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.93 4.93C5.32 4.54 5.95 4.54 6.34 4.93L12 10.59L17.66 4.93C18.05 4.54 18.68 4.54 19.07 4.93C19.46 5.32 19.46 5.95 19.07 6.34L13.41 12L19.07 17.66C19.46 18.05 19.46 18.68 19.07 19.07C18.68 19.46 18.05 19.46 17.66 19.07L12 13.41L6.34 19.07C5.95 19.46 5.32 19.46 4.93 19.07C4.54 18.68 4.54 18.05 4.93 17.66L10.59 12L4.93 6.34C4.54 5.95 4.54 5.32 4.93 4.93Z" fill={color} />
    </svg>
  );
}

export function MoreIconSvg({ size = 20, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill={color} />
      <path d="M7 10C7 10.6904 6.44036 11.25 5.75 11.25C5.05964 11.25 4.5 10.6904 4.5 10C4.5 9.30964 5.05964 8.75 5.75 8.75C6.44036 8.75 7 9.30964 7 10Z" fill={color} />
      <path d="M11.25 10C11.25 10.6904 10.6904 11.25 10 11.25C9.30964 11.25 8.75 10.6904 8.75 10C8.75 9.30964 9.30964 8.75 10 8.75C10.6904 8.75 11.25 9.30964 11.25 10Z" fill={color} />
      <path d="M15.5 10C15.5 10.6904 14.9404 11.25 14.25 11.25C13.5596 11.25 13 10.6904 13 10C13 9.30964 13.5596 8.75 14.25 8.75C14.9404 8.75 15.5 9.30964 15.5 10Z" fill={color} />
    </svg>
  );
}

export function ClockIconSvg({ size = 20, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM9.99878 4.5C10.5511 4.5 10.9988 4.94772 10.9988 5.5V8.84582C10.9988 9.20313 11.1894 9.5333 11.4989 9.71191L13.531 10.8848C14.0093 11.1609 14.1733 11.7724 13.8972 12.2508C13.6211 12.7291 13.0095 12.8931 12.5312 12.617L10.4991 11.4441C9.57072 10.9082 8.99878 9.91776 8.99878 8.84582V5.5C8.99878 4.94772 9.44649 4.5 9.99878 4.5Z" fill={color} />
    </svg>
  );
}

export function DemoIconSvg({ size = 20, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 1C6.44772 1 6 1.44772 6 2C6 2.55228 6.44772 3 7 3V7.382L2.55279 16.2764C1.96298 17.456 2.82236 18.8333 4.13877 18.9836L4.23607 18.9917H15.7639L15.8612 18.9836C17.1776 18.8333 18.037 17.456 17.4472 16.2764L13 7.382V3C13.5523 3 14 2.55228 14 2C14 1.44772 13.5523 1 13 1H7ZM11 3H9V8C9 8.17943 8.9532 8.35591 8.86401 8.5122L8.78885 8.62918L4.76816 16.6756C4.67615 16.8516 4.72822 17 4.85 17H15.15C15.2718 17 15.3239 16.8516 15.2318 16.6756L11.2111 8.62918L11.136 8.5122C11.0532 8.36635 11.0065 8.20258 11.001 8.03356L11 8V3Z" fill={color} />
      <path d="M7.5 14C7.5 13.4477 7.94772 13 8.5 13H11.5C12.0523 13 12.5 13.4477 12.5 14C12.5 14.5523 12.0523 15 11.5 15H8.5C7.94772 15 7.5 14.5523 7.5 14Z" fill={color} />
    </svg>
  );
}

export function MemoryMenuIconSvg({ size = 24, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M9 2C9 1.44772 9.44772 1 10 1C10.5523 1 11 1.44772 11 2V4H13V2C13 1.44772 13.4477 1 14 1C14.5523 1 15 1.44772 15 2V4H18C19.1046 4 20 4.89543 20 6V9H22C22.5523 9 23 9.44772 23 10C23 10.5523 22.5523 11 22 11H20V13H22C22.5523 13 23 13.4477 23 14C23 14.5523 22.5523 15 22 15H20V18C20 19.1046 19.1046 20 18 20H15V22C15 22.5523 14.5523 23 14 23C13.4477 23 13 22.5523 13 22V20H11V22C11 22.5523 10.5523 23 10 23C9.44772 23 9 22.5523 9 22V20H6C4.89543 20 4 19.1046 4 18V15H2C1.44772 15 1 14.5523 1 14C1 13.4477 1.44772 13 2 13H4V11H2C1.44772 11 1 10.5523 1 10C1 9.44772 1.44772 9 2 9H4V6C4 4.89543 4.89543 4 6 4H9V2ZM6 6H18V18H6V6ZM9 9H15V15H9V9ZM11 11V13H13V11H11Z" fill={color} />
    </svg>
  );
}

export function SendArrowSvg() {
  return (
    <svg width={11.5} height={14.5} viewBox="0 0 11.5 14.5" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.21967 0.21967C5.51256 -0.0732233 5.98744 -0.0732233 6.28033 0.21967L11.2803 5.21967C11.5732 5.51256 11.5732 5.98744 11.2803 6.28033C10.9874 6.57322 10.5126 6.57322 10.2197 6.28033L6.5 2.56066V13.75C6.5 14.1642 6.16421 14.5 5.75 14.5C5.33579 14.5 5 14.1642 5 13.75V2.56066L1.28033 6.28033C0.987437 6.57322 0.512563 6.57322 0.21967 6.28033C-0.0732233 5.98744 -0.0732233 5.51256 0.21967 5.21967L5.21967 0.21967Z" fill={V.whiteOnDark} />
    </svg>
  );
}

export function ChatNewIconSvg({ size = 24, color = V.contentPrimary }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 15V12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12V15C20 17.2091 18.2091 19 16 19H8.32812C8.06302 19.0001 7.80856 19.1055 7.62109 19.293L5.51758 21.3965C5.13114 21.7829 4.60702 22 4.06055 22C2.92256 21.9999 2.00006 21.0774 2 19.9395V9C2 6.79086 3.79086 5 6 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H6C4.89543 7 4 7.89543 4 9V19.9395C4.00006 19.9729 4.02714 19.9999 4.06055 20C4.07658 20 4.09215 19.9937 4.10352 19.9824L6.20703 17.8789C6.76957 17.3164 7.53258 17.0001 8.32812 17H16C17.1046 17 18 16.1046 18 15ZM18 9V7H16C15.4477 7 15 6.55228 15 6C15 5.44772 15.4477 5 16 5H18V3C18 2.44772 18.4477 2 19 2C19.5523 2 20 2.44772 20 3V5H22C22.5523 5 23 5.44772 23 6C23 6.55228 22.5523 7 22 7H20V9C20 9.55228 19.5523 10 19 10C18.4477 10 18 9.55228 18 9Z" fill={color} />
    </svg>
  );
}

export function PacificAppBar({ leftIcon, title, subtitle, rightIcons }: {
  leftIcon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  rightIcons?: React.ReactNode[];
}) {
  return (
    <div style={{
      height: 44,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <div style={{
        width: 104,
        paddingLeft: 16,
        paddingRight: 4,
        display: 'flex',
        flexDirection: 'row',
      }}>
        {leftIcon && (
          <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer' }}>
            {leftIcon}
          </div>
        )}
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: V.contentPrimary, lineHeight: '20px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </span>
        {subtitle}
      </div>
      <div style={{
        width: 104,
        paddingRight: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 20,
      }}>
        {rightIcons?.map((icon, i) => (
          <div key={i} style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer' }}>
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PacificInputBar({ hasText = false }: { hasText?: boolean }) {
  return (
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
          {hasText && (
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 100,
              backgroundColor: V.contentBone600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SendArrowSvg />
            </div>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center', paddingTop: 4, paddingBottom: 8, paddingInline: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 400, color: V.contentSecondary, lineHeight: '16px' }}>
          AI can make mistakes. <span style={{ textDecoration: 'underline' }}>Learn more</span>{'   '}<span style={{ textDecoration: 'underline' }}>Privacy policy</span>
        </span>
      </div>
    </div>
  );
}

export function SuggestionPill({ text }: { text: string }) {
  return (
    <div style={{
      padding: '8px 14px',
      borderRadius: 9999,
      border: `1px solid ${V.contentBone600}`,
      cursor: 'pointer',
    }}>
      <span style={{ fontSize: 14, fontWeight: 400, color: V.contentPrimary, lineHeight: '20px' }}>{text}</span>
    </div>
  );
}

export function EmptyChatCard({ label, text, wide = true }: { label: string; text: string; wide?: boolean }) {
  return (
    <div style={{
      flex: wide ? undefined : 1,
      borderRadius: 16,
      padding: 16,
      gap: 4,
      backgroundColor: V.surfaceElevated,
      boxShadow: `0px 2px 8px ${V.contentStatusbar}0A`,
      display: 'flex',
      flexDirection: 'column',
      ...(wide ? {} : { height: 92 }),
    }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: V.contentSecondary, lineHeight: '16px', letterSpacing: '0.6px' }}>
        {label.toUpperCase()}
      </span>
      <span style={{ fontSize: 16, fontWeight: 400, color: V.contentPrimary, lineHeight: '20px', ...(wide ? {} : { marginTop: 4 }) }}>
        {text}
      </span>
    </div>
  );
}

export function StatusBar() {
  return (
    <div style={{
      height: 54,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: 8,
      backgroundColor: V.surfaceBase,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: V.contentPrimary }}>9:41</span>
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: V.surfaceBase,
      fontFamily: "'TTNorms', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {children}
    </div>
  );
}
