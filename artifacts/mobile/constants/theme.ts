import { pacificLight, pacificDark, pacificPrimitives } from './pacificTokens';

export interface AppTheme {
  surfaceBase: string;
  surfaceElevated: string;
  surfaceTint: string;
  surfaceEdge: string;
  surfaceEdgeLight: string;
  surfaceMuted: string;
  contentPrimary: string;
  contentPrimaryInverse: string;
  contentSecondary: string;
  contentBone600: string;
  contentStatusbar: string;
  contentMuted: string;
  contentDimmed: string;
  contentDisabled: string;
  contentDisabled2: string;
  danger: string;
  dangerLight: string;
  dangerChipText: string;
  dangerChipBg: string;
  success: string;
  successDark: string;
  successBg: string;
  successBorder: string;
  successBgLight: string;
  warning: string;
  warningBg: string;
  info: string;
  infoBg: string;
  progressTrack: string;
  frameBg: string;
  contentBrand: string;
  surfaceToast: string;
  toastText: string;
  toastAction: string;
  shadowColor: string;
  shadowEdge: string;
  scrimBackdrop: string;
  scrimHeavy: string;
  whiteOnDark: string;
  selectionColor: string;
  shimmerBase: string;
  shimmerTarget: string;
  borderSubtle: string;
  borderMedium: string;
  inverseAlpha60: string;
  inverseAlpha20: string;
  chipUnselectedBg: string;
  chipUnselectedBorder: string;
  chipSelectedBg: string;
  surfaceTip: string;
  contentTip: string;
}

export const lightTheme: AppTheme = {
  // Backgrounds
  surfaceBase:          pacificLight.surfaceBase,             // bone50   #faf8f5
  surfaceElevated:      pacificLight.surfaceElevatedDefault,  // bone0    #ffffff
  surfaceTint:          pacificLight.surfaceElevatedDisabled, // bone150  #f0eeeb
  surfaceEdge:          pacificLight.strokeDividePrimary,     // rgba(10,10,10,0.10)
  surfaceEdgeLight:     pacificLight.surfaceElevatedHover,    // rgba(10,10,10,0.04)
  surfaceMuted:         pacificLight.surfaceInfoLabel,        // bone100  #f5f3f0

  // Content
  contentPrimary:        pacificLight.contentPrimaryDefault,  // bone850  #1a1919
  contentPrimaryInverse: pacificLight.contentPrimaryInverse,  // bone0    #ffffff
  contentSecondary:      pacificLight.contentSecondary,       // bone550  #706f6e
  contentBone600:        pacificLight.contentIndicatorUnselected, // bone600 #5c5b5a
  contentStatusbar:      pacificLight.contentStatusBar,       // bone1000 #0a0a0a
  contentMuted:          pacificPrimitives.bone300,           // #cccac8 — no exact semantic, closest neutral
  contentDimmed:         pacificLight.contentDisabled2,       // bone350  #bdbbb9
  contentDisabled:       pacificLight.contentDisabled,        // bone250  #dbdad7
  contentDisabled2:      pacificLight.contentDisabled2,       // bone350  #bdbbb9

  // Danger / Error
  danger:          pacificLight.contentDanger,          // red600  #fa2d25
  dangerLight:     pacificLight.contentDanger,          // red600  #fa2d25 (was Tailwind #ef4444)
  dangerChipText:  pacificLight.contentDangerEmphasized,// red650  #cd251e (was Tailwind #dc2626)
  dangerChipBg:    pacificLight.surfaceDangerDefault,   // red50   #ffe5e5 (was Tailwind #fee2e2)

  // Success
  success:         pacificLight.contentSuccess,         // green550 #1bc245 (was Tailwind #22c55e)
  successDark:     pacificLight.buttonSuccess,          // green600 #19a623 (was Tailwind #16a34a)
  successBg:       pacificLight.surfaceSuccessDefault,  // green50  #ebf9ee (was Tailwind #dcfce7)
  successBorder:   pacificLight.strokePositiveDefault,  // green550 #1bc245 (was Tailwind #bbf7d0)
  successBgLight:  pacificLight.surfaceSuccessDefault,  // green50  #ebf9ee (was Tailwind #f0fdf4)

  // Warning / Caution
  warning:    pacificLight.contentCaution,      // yellow600 #8c6914 (was Tailwind #b45309)
  warningBg:  pacificLight.surfaceCautionDefault,// yellow50  #fff5e5 (was Tailwind #fef3c7)

  // Info / Tip
  info:    pacificLight.contentBrand,     // blue550  #00a2c7 (was Tailwind #2563eb)
  infoBg:  pacificLight.surfaceTipDefault,// blue50   #edf8fc (was Tailwind #dbeafe)

  // Structural
  progressTrack:   pacificLight.surfaceSwitchUnselectedHover, // bone200 #e5e4e1 (was #e5e1da)
  frameBg:         pacificLight.surfaceSwitchUnselectedHover, // bone200 #e5e4e1 (was #e8e4de)

  // Brand
  contentBrand: pacificLight.contentBrand,   // blue550 #00a2c7

  // Toast
  surfaceToast: pacificLight.surfaceToast,   // bone950 #0f0f0f
  toastText:    pacificLight.contentOnDark,  // bone0   #ffffff
  toastAction:  pacificLight.buttonBrandDefaultInverse, // blue500 #32b7d9

  // Shadows / overlays
  shadowColor:    'rgba(10,10,10,0.16)',
  shadowEdge:     'rgba(10,10,10,0.06)',
  scrimBackdrop:  pacificLight.surfaceScrim, // rgba(10,10,10,0.50)
  scrimHeavy:     pacificLight.surfaceScrim, // rgba(10,10,10,0.50)

  // Misc
  whiteOnDark:     pacificLight.contentOnDark,           // #ffffff
  selectionColor:  pacificLight.contentIndicatorUnselected, // bone600 #5c5b5a
  shimmerBase:     pacificPrimitives.bone300,            // #cccac8 — warm neutral shimmer base
  shimmerTarget:   pacificLight.contentBrand,            // blue550 #00a2c7

  // Borders (semi-transparent)
  borderSubtle:    pacificLight.surfaceElevatedPressed,  // rgba(10,10,10,0.08)
  borderMedium:    'rgba(10,10,10,0.20)',
  inverseAlpha60:  'rgba(255,255,255,0.6)',
  inverseAlpha20:  'rgba(255,255,255,0.2)',

  // Chips
  chipUnselectedBg:      pacificLight.surfaceElevatedDefault, // bone0   #ffffff
  chipUnselectedBorder:  pacificLight.strokeIndicatorUnselectedDefault, // bone250 #dbdad7
  chipSelectedBg:        pacificLight.surfaceElevatedSelected, // bone850 #1a1919

  // Tip
  surfaceTip:  pacificLight.surfaceTipDefault, // blue50  #edf8fc
  contentTip:  pacificLight.contentTip,        // blue650 #006280
};

export const darkTheme: AppTheme = {
  // Backgrounds
  surfaceBase:          pacificDark.surfaceBase,             // bone1000 #0a0a0a
  surfaceElevated:      pacificDark.surfaceElevatedDefault,  // bone850  #1a1919
  surfaceTint:          pacificDark.surfaceInfoDefault,      // bone800  #242323
  surfaceEdge:          'rgba(250,248,245,0.10)',
  surfaceEdgeLight:     'rgba(250,248,245,0.05)',
  surfaceMuted:         pacificDark.surfaceInfoDefault,      // bone800  #242323

  // Content
  contentPrimary:        pacificDark.contentPrimaryDefault,  // bone50   #faf8f5
  contentPrimaryInverse: pacificDark.contentPrimaryInverse,  // bone1000 #0a0a0a
  contentSecondary:      pacificDark.contentSecondary,       // bone500  #858482
  contentBone600:        pacificPrimitives.bone400,          // #adacaa  — no semantic, raw primitive
  contentStatusbar:      pacificDark.contentStatusBar,       // bone0    #ffffff
  contentMuted:          pacificPrimitives.bone650,          // #4d4c4b  — no semantic, raw primitive
  contentDimmed:         pacificPrimitives.bone650,          // #4d4c4b  (was #585756, off-palette)
  contentDisabled:       pacificDark.contentDisabled,        // bone700  #3d3d3c (was #3a3938, off-palette)
  contentDisabled2:      pacificPrimitives.bone650,          // #4d4c4b  (was #585756, off-palette)

  // Danger / Error
  danger:          pacificDark.contentDanger,          // red600 #fa2d25
  dangerLight:     pacificPrimitives.red550,           // #fb4a43 contentChart5
  dangerChipText:  pacificDark.contentDanger,          // red600 #fa2d25
  dangerChipBg:    pacificDark.surfaceDangerDefault,   // red850 #352120

  // Success
  success:         pacificDark.contentSuccess,         // green550 #1bc245
  successDark:     pacificDark.contentSuccess,         // green550 #1bc245
  successBg:       pacificDark.surfaceSuccessDefault,  // green900 #102916
  successBorder:   pacificDark.surfaceSuccessDefault,  // green900 #102916
  successBgLight:  pacificDark.surfaceSuccessDefault,  // green900 #102916

  // Warning / Caution
  warning:    pacificDark.contentCaution,       // yellow350 #ffcc00
  warningBg:  pacificDark.surfaceCautionDefault,// yellow800 #353320

  // Info / Tip
  info:    pacificDark.contentTip,        // blue450 #65cae5
  infoBg:  pacificDark.surfaceTipDefault, // blue900 #002638

  // Structural
  progressTrack:  pacificDark.buttonNeutralDisabled,          // bone700 #3d3d3c
  frameBg:        pacificDark.surfaceInfoDefault,             // bone800 #242323

  // Brand
  contentBrand: pacificDark.contentBrand, // blue500 #32b7d9

  // Toast
  surfaceToast: pacificDark.surfaceToast,  // bone700 #3d3d3c
  toastText:    pacificDark.contentPrimaryDefault, // bone50 #faf8f5
  toastAction:  pacificDark.buttonBrandDefaultInverse, // blue500 #32b7d9

  // Shadows / overlays
  shadowColor:    'rgba(0,0,0,0.40)',
  shadowEdge:     'rgba(0,0,0,0.20)',
  scrimBackdrop:  pacificDark.surfaceScrim, // rgba(10,10,10,0.70)
  scrimHeavy:     pacificDark.surfaceScrim, // rgba(10,10,10,0.70)

  // Misc
  whiteOnDark:     pacificDark.contentOnDark,                // #ffffff
  selectionColor:  pacificPrimitives.bone400,                // #adacaa
  shimmerBase:     pacificPrimitives.yellow600,              // #8c6914 contentCaution — warm shimmer
  shimmerTarget:   pacificDark.contentBrand,                 // blue500 #32b7d9

  // Borders (semi-transparent)
  borderSubtle:    pacificDark.surfaceElevatedPressed,       // rgba(255,255,255,0.08)
  borderMedium:    'rgba(250,248,245,0.20)',
  inverseAlpha60:  'rgba(0,0,0,0.6)',
  inverseAlpha20:  'rgba(0,0,0,0.2)',

  // Chips
  chipUnselectedBg:      pacificDark.surfaceElevatedDefault,          // bone850 #1a1919
  chipUnselectedBorder:  pacificPrimitives.bone650,                   // #4d4c4b
  chipSelectedBg:        pacificDark.surfaceElevatedSelected,         // bone0   #ffffff

  // Tip
  surfaceTip:  pacificDark.surfaceTipDefault, // blue900 #002638 (was #0d2a33, off-palette)
  contentTip:  pacificDark.contentTip,        // blue450 #65cae5 (was #5cc8e4, off-palette)
};
