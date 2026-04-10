// Static light-mode color snapshot for phase2 components that don't use the theme hook.
// Sourced from Pacific Design System tokens (pacificLight).
import { pacificLight, pacificPrimitives } from '../../constants/pacificTokens';

export default {
  surfaceBase:      pacificLight.surfaceBase,
  surfaceElevated:  pacificLight.surfaceElevatedDefault,
  surfaceTint:      pacificLight.surfaceElevatedDisabled,
  surfaceEdge:      pacificLight.strokeDividePrimary,
  surfaceEdgeLight: pacificLight.surfaceElevatedHover,
  surfaceMuted:     pacificLight.surfaceInfoLabel,

  contentPrimary:    pacificLight.contentPrimaryDefault,
  contentSecondary:  pacificLight.contentSecondary,
  contentBone600:    pacificLight.contentIndicatorUnselected,
  contentStatusbar:  pacificLight.contentStatusBar,
  contentMuted:      pacificPrimitives.bone300,
  contentDimmed:     pacificLight.contentDisabled2,

  danger:         pacificLight.contentDanger,
  dangerLight:    pacificLight.contentDanger,
  dangerChipText: pacificLight.contentDangerEmphasized,
  dangerChipBg:   pacificLight.surfaceDangerDefault,

  success:        pacificLight.contentSuccess,
  successDark:    pacificLight.buttonSuccess,
  successBg:      pacificLight.surfaceSuccessDefault,
  successBorder:  pacificLight.strokePositiveDefault,
  successBgLight: pacificLight.surfaceSuccessDefault,

  warning:    pacificLight.contentCaution,
  warningBg:  pacificLight.surfaceCautionDefault,

  info:    pacificLight.contentBrand,
  infoBg:  pacificLight.surfaceTipDefault,

  progressTrack:  pacificLight.surfaceSwitchUnselectedHover,
  frameBg:        pacificLight.surfaceSwitchUnselectedHover,

  contentBrand: pacificLight.contentBrand,
};
