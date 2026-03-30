import React, { useRef, useEffect } from 'react';
import { Animated as RNAnimated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function ChevronLeftIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L9.41421 12L16.7071 19.2929C17.0976 19.6834 17.0976 20.3166 16.7071 20.7071C16.3166 21.0976 15.6834 21.0976 15.2929 20.7071L7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289Z"
        fill={color}
      />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L12 14.5858L19.2929 7.29289C19.6834 6.90237 20.3166 6.90237 20.7071 7.29289C21.0976 7.68342 21.0976 8.31658 20.7071 8.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L3.29289 8.70711C2.90237 8.31658 2.90237 7.68342 3.29289 7.29289Z"
        fill={color}
      />
    </Svg>
  );
}

export function CloseIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.93 4.93C5.32 4.54 5.95 4.54 6.34 4.93L12 10.59L17.66 4.93C18.05 4.54 18.68 4.54 19.07 4.93C19.46 5.32 19.46 5.95 19.07 6.34L13.41 12L19.07 17.66C19.46 18.05 19.46 18.68 19.07 19.07C18.68 19.46 18.05 19.46 17.66 19.07L12 13.41L6.34 19.07C5.95 19.46 5.32 19.46 4.93 19.07C4.54 18.68 4.54 18.05 4.93 17.66L10.59 12L4.93 6.34C4.54 5.95 4.54 5.32 4.93 4.93Z"
        fill={color}
      />
    </Svg>
  );
}

export function MoreIcon({ size = 20, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
        fill={color}
      />
      <Path
        d="M7 10C7 10.6904 6.44036 11.25 5.75 11.25C5.05964 11.25 4.5 10.6904 4.5 10C4.5 9.30964 5.05964 8.75 5.75 8.75C6.44036 8.75 7 9.30964 7 10Z"
        fill={color}
      />
      <Path
        d="M11.25 10C11.25 10.6904 10.6904 11.25 10 11.25C9.30964 11.25 8.75 10.6904 8.75 10C8.75 9.30964 9.30964 8.75 10 8.75C10.6904 8.75 11.25 9.30964 11.25 10Z"
        fill={color}
      />
      <Path
        d="M15.5 10C15.5 10.6904 14.9404 11.25 14.25 11.25C13.5596 11.25 13 10.6904 13 10C13 9.30964 13.5596 8.75 14.25 8.75C14.9404 8.75 15.5 9.30964 15.5 10Z"
        fill={color}
      />
    </Svg>
  );
}

export function DemoIcon({ size = 20, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 3C8.44772 3 8 3.44772 8 4C8 4.55228 8.44772 5 9 5V9.382L4.55279 18.2764C3.96298 19.456 4.82236 20.8333 6.13877 20.9836L6.23607 20.9917H17.7639L17.8612 20.9836C19.1776 20.8333 20.037 19.456 19.4472 18.2764L15 9.382V5C15.5523 5 16 4.55228 16 4C16 3.44772 15.5523 3 15 3H9ZM13 5H11V10C11 10.1794 10.9532 10.3559 10.864 10.5122L10.7889 10.6292L6.76816 18.6756C6.67615 18.8516 6.72822 19 6.85 19H17.15C17.2718 19 17.3239 18.8516 17.2318 18.6756L13.2111 10.6292L13.136 10.5122C13.0532 10.3664 13.0065 10.2026 13.001 10.0336L13 10V5Z"
        fill={color}
      />
      <Path
        d="M9.5 16C9.5 15.4477 9.94772 15 10.5 15H13.5C14.0523 15 14.5 15.4477 14.5 16C14.5 16.5523 14.0523 17 13.5 17H10.5C9.94772 17 9.5 16.5523 9.5 16Z"
        fill={color}
      />
    </Svg>
  );
}

export function ClockIcon({ size = 20, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM9.99878 4.5C10.5511 4.5 10.9988 4.94772 10.9988 5.5V8.84582C10.9988 9.20313 11.1894 9.5333 11.4989 9.71191L13.531 10.8848C14.0093 11.1609 14.1733 11.7724 13.8972 12.2508C13.6211 12.7291 13.0095 12.8931 12.5312 12.617L10.4991 11.4441C9.57072 10.9082 8.99878 9.91776 8.99878 8.84582V5.5C8.99878 4.94772 9.44649 4.5 9.99878 4.5Z"
        fill={color}
      />
    </Svg>
  );
}

export function ChatNewIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 15V12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12V15C20 17.2091 18.2091 19 16 19H8.32812C8.06302 19.0001 7.80856 19.1055 7.62109 19.293L5.51758 21.3965C5.13114 21.7829 4.60702 22 4.06055 22C2.92256 21.9999 2.00006 21.0774 2 19.9395V9C2 6.79086 3.79086 5 6 5H13C13.5523 5 14 5.44772 14 6C14 6.55228 13.5523 7 13 7H6C4.89543 7 4 7.89543 4 9V19.9395C4.00006 19.9729 4.02714 19.9999 4.06055 20C4.07658 20 4.09215 19.9937 4.10352 19.9824L6.20703 17.8789C6.76957 17.3164 7.53258 17.0001 8.32812 17H16C17.1046 17 18 16.1046 18 15ZM18 9V7H16C15.4477 7 15 6.55228 15 6C15 5.44772 15.4477 5 16 5H18V3C18 2.44772 18.4477 2 19 2C19.5523 2 20 2.44772 20 3V5H22C22.5523 5 23 5.44772 23 6C23 6.55228 22.5523 7 22 7H20V9C20 9.55228 19.5523 10 19 10C18.4477 10 18 9.55228 18 9Z"
        fill={color}
      />
    </Svg>
  );
}

export function MemoryMenuIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C9.5 2 7.5 3.5 7 5.5C5 5.5 3 7.5 3 10C3 12 4 13.5 5.5 14.3C5 15.3 5 16.5 5.5 17.5C6.5 19.5 8.5 20 10 20H12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 2C14.5 2 16.5 3.5 17 5.5C19 5.5 21 7.5 21 10C21 12 20 13.5 18.5 14.3C19 15.3 19 16.5 18.5 17.5C17.5 19.5 15.5 20 14 20H12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 2V22" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 9C9.5 9 11 10 12 11.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 9C14.5 9 13 10 12 11.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GoalsMenuIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12Z"
        fill={color}
      />
      <Path
        d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
        fill={color}
      />
    </Svg>
  );
}

export function PencilMenuIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.0858 4C14.7261 3.35971 15.5945 3 16.5 3C17.4055 3 18.2739 3.35971 18.9142 4L20 5.08579C20.6403 5.72608 21 6.59449 21 7.5C21 8.40551 20.6403 9.27392 20 9.91421L10.6189 19.2953C10.2155 19.6987 9.70536 19.9788 9.1484 20.1025L5.31349 20.9547C5.17808 20.9848 5.03979 21 4.90109 21C3.85115 21 3 20.1489 3 19.0989C3 18.9602 3.01518 18.8219 3.04527 18.6865L3.89747 14.8516C4.02124 14.2946 4.30127 13.7845 4.70471 13.3811L12.5426 5.54321L14.0858 4ZM13.25 7.66421L6.11893 14.7953C5.98445 14.9298 5.8911 15.0998 5.84985 15.2855L5.03136 18.9686L8.71454 18.1502C8.90019 18.1089 9.07023 18.0156 9.20471 17.8811L16.3358 10.75L13.25 7.66421ZM17.75 9.33579L14.6642 6.25L15.5 5.41421C15.7652 5.149 16.1249 5 16.5 5C16.8751 5 17.2348 5.149 17.5 5.41421L18.5858 6.5C18.851 6.76522 19 7.12493 19 7.5C19 7.87507 18.851 8.23478 18.5858 8.5L17.75 9.33579Z"
        fill={color}
      />
    </Svg>
  );
}

export function SettingsMenuIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.77964 4.53073 9.68706 4.87519 9.51154 5.17884C9.33602 5.48248 9.08374 5.73464 8.78 5.91L8.35 6.16C8.04596 6.33554 7.70067 6.42795 7.34901 6.42795C6.99734 6.42795 6.65206 6.33554 6.348 6.16L6.2 6.08C5.74107 5.81526 5.19584 5.73567 4.6806 5.85777C4.16536 5.97987 3.71902 6.29399 3.43 6.74L3.21 7.12C2.92098 7.57905 2.82192 8.12445 2.92518 8.6501C3.02844 9.17574 3.32629 9.6441 3.76 9.96L3.89 10.05C4.19288 10.2145 4.44514 10.4568 4.62124 10.7508C4.79734 11.0449 4.89067 11.3804 4.89067 11.7225C4.89067 12.0646 4.79734 12.4001 4.62124 12.6942C4.44514 12.9882 4.19288 13.2305 3.89 13.395L3.76 13.485C3.32629 13.8009 3.02844 14.2693 2.92518 14.7949C2.82192 15.3206 2.92098 15.866 3.21 16.325L3.43 16.705C3.71902 17.151 4.16536 17.4651 4.6806 17.5872C5.19584 17.7093 5.74107 17.6297 6.2 17.365L6.348 17.284C6.65206 17.1085 6.99734 17.0161 7.34901 17.0161C7.70067 17.0161 8.04596 17.1085 8.35 17.284L8.78 17.534C9.08374 17.7094 9.33602 17.9615 9.51154 18.2652C9.68706 18.5688 9.77964 18.9133 9.78 19.264V19.444C9.78 19.9744 9.99072 20.4831 10.3658 20.8582C10.7409 21.2333 11.2496 21.444 11.78 21.444H12.22C12.7504 21.444 13.2591 21.2333 13.6342 20.8582C14.0093 20.4831 14.22 19.9744 14.22 19.444V19.264C14.2204 18.9133 14.3129 18.5688 14.4885 18.2652C14.664 17.9615 14.9163 17.7094 15.22 17.534L15.65 17.284C15.954 17.1085 16.2993 17.0161 16.651 17.0161C17.0027 17.0161 17.3479 17.1085 17.652 17.284L17.8 17.365C18.2589 17.6297 18.8042 17.7093 19.3194 17.5872C19.8346 17.4651 20.281 17.151 20.57 16.705L20.79 16.325C21.079 15.866 21.1781 15.3206 21.0748 14.7949C20.9716 14.2693 20.6737 13.8009 20.24 13.485L20.11 13.395C19.8071 13.2305 19.5549 12.9882 19.3788 12.6942C19.2027 12.4001 19.1093 12.0646 19.1093 11.7225C19.1093 11.3804 19.2027 11.0449 19.3788 10.7508C19.5549 10.4568 19.8071 10.2145 20.11 10.05L20.24 9.96C20.6737 9.6441 20.9716 9.17574 21.0748 8.6501C21.1781 8.12445 21.079 7.57905 20.79 7.12L20.57 6.74C20.281 6.29399 19.8346 5.97987 19.3194 5.85777C18.8042 5.73567 18.2589 5.81526 17.8 6.08L17.652 6.16C17.3479 6.33554 17.0027 6.42795 16.651 6.42795C16.2993 6.42795 15.954 6.33554 15.65 6.16L15.22 5.91C14.9163 5.73464 14.664 5.48248 14.4885 5.17884C14.3129 4.87519 14.2204 4.53073 14.22 4.18V4C14.22 3.46957 14.0093 2.96086 13.6342 2.58579C13.2591 2.21071 12.7504 2 12.22 2Z"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

export function PlusIcon({ size = 20, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H9V4C9 3.44772 9.44772 3 10 3Z"
        fill={color}
      />
    </Svg>
  );
}

export function DeleteMenuIcon({ size = 24, color = '#fa2d25' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6C4 5.44772 4.44772 5 5 5H8V4ZM10 5H14V4H10V5ZM6 7.99699C6.55228 7.99699 7 8.44471 7 8.99699V18C7 19.1046 7.89543 20 9 20H15C16.1046 20 17 19.1046 17 18V8.99699C17 8.44471 17.4477 7.99699 18 7.99699C18.5523 7.99699 19 8.44471 19 8.99699V18C19 20.2091 17.2091 22 15 22H9C6.79086 22 5 20.2091 5 18V8.99699C5 8.44471 5.44772 7.99699 6 7.99699ZM10 9C10.5523 9 11 9.44772 11 10V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V10C9 9.44772 9.44772 9 10 9ZM14 9C14.5523 9 15 9.44772 15 10V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V10C13 9.44772 13.4477 9 14 9Z"
        fill={color}
      />
    </Svg>
  );
}

export function PauseMenuIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 4H9C8.44772 4 8 4.44772 8 5V19C8 19.5523 8.44772 20 9 20H10C10.5523 20 11 19.5523 11 19V5C11 4.44772 10.5523 4 10 4Z"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <Path
        d="M15 4H14C13.4477 4 13 4.44772 13 5V19C13 19.5523 13.4477 20 14 20H15C15.5523 20 16 19.5523 16 19V5C16 4.44772 15.5523 4 15 4Z"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

export function PlayMenuIcon({ size = 24, color = '#1a1919' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 4.83167C6 3.94839 6.96725 3.40832 7.72111 3.89137L19.0711 11.0597C19.7889 11.5196 19.7889 12.5804 19.0711 13.0403L7.72111 20.2086C6.96725 20.6917 6 20.1516 6 19.2683V4.83167Z"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 16, color = '#706f6e' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM1 7a6 6 0 1 1 10.72 3.66l2.81 2.81a.75.75 0 1 1-1.06 1.06l-2.81-2.81A6 6 0 0 1 1 7Z"
        fill={color}
      />
    </Svg>
  );
}

export function FilterIcon({ size = 18, color = '#706f6e' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * 12 / 18} viewBox="0 0 18 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm3 5a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm4 4a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H7Z"
        fill={color}
      />
    </Svg>
  );
}

interface FlipIconProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
  size?: number;
  duration?: number;
}

export function FlipIcon({ front, back, flipped, size = 24, duration = 400 }: FlipIconProps) {
  const flipAnim = useRef(new RNAnimated.Value(flipped ? 180 : 0)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    RNAnimated.timing(flipAnim, {
      toValue: flipped ? 180 : 0,
      duration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [flipped, flipAnim, duration]);

  const frontRotateY = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backRotateY = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [1, 1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 89, 90, 180], outputRange: [0, 0, 1, 1] });

  return (
    <RNAnimated.View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <RNAnimated.View style={{
        position: 'absolute',
        opacity: frontOpacity,
        transform: [{ perspective: 400 }, { rotateY: frontRotateY }],
      }}>
        {front}
      </RNAnimated.View>
      <RNAnimated.View style={{
        position: 'absolute',
        opacity: backOpacity,
        transform: [{ perspective: 400 }, { rotateY: backRotateY }],
      }}>
        {back}
      </RNAnimated.View>
    </RNAnimated.View>
  );
}
