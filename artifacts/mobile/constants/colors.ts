// Static light-mode color snapshot for components that don't use the theme hook.
// Sourced from Pacific Design System tokens (pacificLight).
import { pacificLight, pacificPrimitives } from './pacificTokens';

export default {
  surfaceBase:      pacificLight.surfaceBase,             // bone50   #faf8f5
  surfaceElevated:  pacificLight.surfaceElevatedDefault,  // bone0    #ffffff
  surfaceTint:      pacificLight.surfaceElevatedDisabled, // bone150  #f0eeeb
  surfaceEdge:      pacificLight.strokeDividePrimary,     // rgba(10,10,10,0.10)
  surfaceEdgeLight: pacificLight.surfaceElevatedHover,    // rgba(10,10,10,0.04)
  surfaceMuted:     pacificLight.surfaceInfoLabel,        // bone100  #f5f3f0

  contentPrimary:    pacificLight.contentPrimaryDefault,     // bone850 #1a1919
  contentSecondary:  pacificLight.contentSecondary,          // bone550 #706f6e
  contentBone600:    pacificLight.contentIndicatorUnselected,// bone600 #5c5b5a
  contentStatusbar:  pacificLight.contentStatusBar,          // bone1000 #0a0a0a
  contentMuted:      pacificPrimitives.bone300,              // #cccac8
  contentDimmed:     pacificLight.contentDisabled2,          // bone350 #bdbbb9

  danger:         pacificLight.contentDanger,           // red600 #fa2d25
  dangerLight:    pacificLight.contentDanger,           // red600 #fa2d25  (was Tailwind #ef4444)
  dangerChipText: pacificLight.contentDangerEmphasized, // red650 #cd251e  (was Tailwind #dc2626)
  dangerChipBg:   pacificLight.surfaceDangerDefault,    // red50  #ffe5e5  (was Tailwind #fee2e2)

  success:        pacificLight.contentSuccess,          // green550 #1bc245 (was Tailwind #22c55e)
  successDark:    pacificLight.buttonSuccess,           // green600 #19a623 (was Tailwind #16a34a)
  successBg:      pacificLight.surfaceSuccessDefault,   // green50  #ebf9ee (was Tailwind #dcfce7)
  successBorder:  pacificLight.strokePositiveDefault,   // green550 #1bc245 (was Tailwind #bbf7d0)
  successBgLight: pacificLight.surfaceSuccessDefault,   // green50  #ebf9ee (was Tailwind #f0fdf4)

  warning:    pacificLight.contentCaution,       // yellow600 #8c6914 (was Tailwind #b45309)
  warningBg:  pacificLight.surfaceCautionDefault,// yellow50  #fff5e5 (was Tailwind #fef3c7)

  info:    pacificLight.contentBrand,     // blue550 #00a2c7 (was Tailwind #2563eb)
  infoBg:  pacificLight.surfaceTipDefault,// blue50  #edf8fc (was Tailwind #dbeafe)

  progressTrack:  pacificLight.surfaceSwitchUnselectedHover, // bone200 #e5e4e1 (was #e5e1da)
  frameBg:        pacificLight.surfaceSwitchUnselectedHover, // bone200 #e5e4e1 (was #e8e4de)

  contentBrand: pacificLight.contentBrand, // blue550 #00a2c7
  surfaceTip:   pacificLight.surfaceTipDefault, // blue50  #edf8fc
  contentTip:   pacificLight.contentTip,        // blue650 #006280
};
