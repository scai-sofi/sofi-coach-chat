import { pacificLight, pacificDark, pacificPrimitives } from '../../constants/pacificTokens';

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
}

export const lightTheme: AppTheme = {
  surfaceBase:          pacificLight.surfaceBase,
  surfaceElevated:      pacificLight.surfaceElevatedDefault,
  surfaceTint:          pacificLight.surfaceElevatedDisabled,
  surfaceEdge:          pacificLight.strokeDividePrimary,
  surfaceEdgeLight:     pacificLight.surfaceElevatedHover,
  surfaceMuted:         pacificLight.surfaceInfoLabel,

  contentPrimary:        pacificLight.contentPrimaryDefault,
  contentPrimaryInverse: pacificLight.contentPrimaryInverse,
  contentSecondary:      pacificLight.contentSecondary,
  contentBone600:        pacificLight.contentIndicatorUnselected,
  contentStatusbar:      pacificLight.contentStatusBar,
  contentMuted:          pacificPrimitives.bone300,
  contentDimmed:         pacificLight.contentDisabled2,
  contentDisabled:       pacificLight.contentDisabled,
  contentDisabled2:      pacificLight.contentDisabled2,

  danger:          pacificLight.contentDanger,
  dangerLight:     pacificLight.contentDanger,
  dangerChipText:  pacificLight.contentDangerEmphasized,
  dangerChipBg:    pacificLight.surfaceDangerDefault,

  success:         pacificLight.contentSuccess,
  successDark:     pacificLight.buttonSuccess,
  successBg:       pacificLight.surfaceSuccessDefault,
  successBorder:   pacificLight.strokePositiveDefault,
  successBgLight:  pacificLight.surfaceSuccessDefault,

  warning:    pacificLight.contentCaution,
  warningBg:  pacificLight.surfaceCautionDefault,

  info:    pacificLight.contentBrand,
  infoBg:  pacificLight.surfaceTipDefault,

  progressTrack:  pacificLight.surfaceSwitchUnselectedHover,
  frameBg:        pacificLight.surfaceSwitchUnselectedHover,

  contentBrand: pacificLight.contentBrand,

  surfaceToast: pacificLight.surfaceToast,
  toastText:    pacificLight.contentOnDark,
  toastAction:  pacificLight.buttonBrandDefaultInverse,

  shadowColor:    'rgba(10,10,10,0.16)',
  shadowEdge:     'rgba(10,10,10,0.06)',
  scrimBackdrop:  pacificLight.surfaceScrim,
  scrimHeavy:     pacificLight.surfaceScrim,

  whiteOnDark:     pacificLight.contentOnDark,
  selectionColor:  pacificLight.contentIndicatorUnselected,
  shimmerBase:     pacificPrimitives.bone300,
  shimmerTarget:   pacificLight.contentBrand,

  borderSubtle:    pacificLight.surfaceElevatedPressed,
  borderMedium:    'rgba(10,10,10,0.20)',
  inverseAlpha60:  'rgba(255,255,255,0.6)',
  inverseAlpha20:  'rgba(255,255,255,0.2)',

  chipUnselectedBg:      pacificLight.surfaceElevatedDefault,
  chipUnselectedBorder:  pacificLight.strokeIndicatorUnselectedDefault,
  chipSelectedBg:        pacificLight.surfaceElevatedSelected,
};

export const darkTheme: AppTheme = {
  surfaceBase:          pacificDark.surfaceBase,
  surfaceElevated:      pacificDark.surfaceElevatedDefault,
  surfaceTint:          pacificDark.surfaceInfoDefault,
  surfaceEdge:          'rgba(250,248,245,0.10)',
  surfaceEdgeLight:     'rgba(250,248,245,0.05)',
  surfaceMuted:         pacificDark.surfaceInfoDefault,

  contentPrimary:        pacificDark.contentPrimaryDefault,
  contentPrimaryInverse: pacificDark.contentPrimaryInverse,
  contentSecondary:      pacificDark.contentSecondary,
  contentBone600:        pacificPrimitives.bone400,
  contentStatusbar:      pacificDark.contentStatusBar,
  contentMuted:          pacificPrimitives.bone650,
  contentDimmed:         pacificPrimitives.bone650,
  contentDisabled:       pacificDark.contentDisabled,
  contentDisabled2:      pacificPrimitives.bone650,

  danger:          pacificDark.contentDanger,
  dangerLight:     pacificPrimitives.red550,
  dangerChipText:  pacificDark.contentDanger,
  dangerChipBg:    pacificDark.surfaceDangerDefault,

  success:         pacificDark.contentSuccess,
  successDark:     pacificDark.contentSuccess,
  successBg:       pacificDark.surfaceSuccessDefault,
  successBorder:   pacificDark.surfaceSuccessDefault,
  successBgLight:  pacificDark.surfaceSuccessDefault,

  warning:    pacificDark.contentCaution,
  warningBg:  pacificDark.surfaceCautionDefault,

  info:    pacificDark.contentTip,
  infoBg:  pacificDark.surfaceTipDefault,

  progressTrack:  pacificDark.buttonNeutralDisabled,
  frameBg:        pacificDark.surfaceInfoDefault,

  contentBrand: pacificDark.contentBrand,

  surfaceToast: pacificDark.surfaceToast,
  toastText:    pacificDark.contentPrimaryDefault,
  toastAction:  pacificDark.buttonBrandDefaultInverse,

  shadowColor:    'rgba(0,0,0,0.40)',
  shadowEdge:     'rgba(0,0,0,0.20)',
  scrimBackdrop:  pacificDark.surfaceScrim,
  scrimHeavy:     pacificDark.surfaceScrim,

  whiteOnDark:     pacificDark.contentOnDark,
  selectionColor:  pacificPrimitives.bone400,
  shimmerBase:     pacificPrimitives.yellow600,
  shimmerTarget:   pacificDark.contentBrand,

  borderSubtle:    pacificDark.surfaceElevatedPressed,
  borderMedium:    'rgba(250,248,245,0.20)',
  inverseAlpha60:  'rgba(0,0,0,0.6)',
  inverseAlpha20:  'rgba(0,0,0,0.2)',

  chipUnselectedBg:      pacificDark.surfaceElevatedDefault,
  chipUnselectedBorder:  pacificPrimitives.bone650,
  chipSelectedBg:        pacificDark.surfaceElevatedSelected,
};
