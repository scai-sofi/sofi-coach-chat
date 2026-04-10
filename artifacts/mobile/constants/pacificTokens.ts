// Pacific Design System — Color Tokens for React Native / Expo
// Source: sofi_design_system_tokens
//
// Usage:
//   import { useColorScheme } from 'react-native';
//   import { pacificLight, pacificDark } from './pacificTokens';
//   const colors = useColorScheme() === 'dark' ? pacificDark : pacificLight;
//   <View style={{ backgroundColor: colors.surfaceBase }} />

export interface PacificTokens {
  // Content
  contentPrimaryDefault: string;
  contentPrimaryInverse: string;
  contentOnLight: string;
  contentOnDark: string;
  contentDisabled: string;
  contentDisabled2: string;
  contentSecondary: string;
  contentHint: string;
  contentBrand: string;
  contentLinkPrimary: string;
  contentLinkSecondary: string;
  contentInfo: string;
  contentTip: string;
  contentSuccess: string;
  contentSuccessEmphasized: string;
  contentCaution: string;
  contentCautionOnDark: string;
  contentDanger: string;
  contentDangerEmphasized: string;
  contentPositive: string;
  contentNegative: string;
  contentIndicatorSelected: string;
  contentIndicatorCaution: string;
  contentIndicatorFair: string;
  contentIndicatorError: string;
  contentIndicatorErrorHover: string;
  contentIndicatorErrorPressed: string;
  contentIndicatorSelectedInverse: string;
  contentIndicatorUnselected: string;
  contentIndicatorHover: string;
  contentIndicatorDisabled: string;
  contentStatusBar: string;
  // Surface
  surfaceBase: string;
  surfaceElevatedDefault: string;
  surfaceElevatedUnselected: string;
  surfaceElevatedSelected: string;
  surfaceElevatedDisabled: string;
  surfaceElevatedDisabledEmphasized: string;
  surfaceElevatedHover: string;
  surfaceElevatedPressed: string;
  surfaceBottomSheet: string;
  surfaceIndicatorSelected: string;
  surfaceIndicatorSelectedSecondary: string;
  surfaceIndicatorSelectedBrand: string;
  surfaceIndicatorUnselected: string;
  surfaceIndicatorUnselectedHover: string;
  surfaceIndicatorDisabled: string;
  surfaceIndicatorRange: string;
  surfaceInfoLabel: string;
  surfaceInfoDefault: string;
  surfaceTipDefault: string;
  surfaceNeutral: string;
  surfaceScrim: string;
  surfaceToast: string;
  surfaceSuccessDefault: string;
  surfaceCautionDefault: string;
  surfaceCautionEmphasize: string;
  surfaceDangerDefault: string;
  surfaceDangerEmphasize: string;
  surfaceAlert: string;
  surfacePositiveDefault: string;
  surfacePositiveDiminish: string;
  surfaceNegativeDefault: string;
  surfaceNegativeDiminish: string;
  surfaceSub: string;
  surfaceSubDark: string;
  surfaceSwitchSelected: string;
  surfaceSwitchUnselected: string;
  surfaceSwitchUnselectedHover: string;
  // Stroke
  strokeBrand: string;
  strokeIndicatorHover: string;
  strokeIndicatorSelected: string;
  strokeIndicatorPressed: string;
  strokeIndicatorError: string;
  strokeIndicatorErrorHover: string;
  strokeIndicatorErrorPressed: string;
  strokeIndicatorUnselectedDefault: string;
  strokeIndicatorCaution: string;
  strokeOnDark: string;
  strokePositiveDefault: string;
  strokeNegativeDefault: string;
  strokeDividePrimary: string;
  strokeDivideSecondary: string;
  strokeEdge: string;
  // Button
  buttonBrandDefault: string;
  buttonBrandDefaultInverse: string;
  buttonBrandInverse: string;
  buttonBrandDisabled: string;
  buttonBrandDisabled2: string;
  buttonBrandHover: string;
  buttonBrandPressed: string;
  buttonDestructiveDefault: string;
  buttonDestructiveDisabled: string;
  buttonDestructiveDisabled2: string;
  buttonDestructiveHover: string;
  buttonDestructivePressed: string;
  buttonDestructiveInverse: string;
  buttonOnDark: string;
  buttonOnDarkInverse: string;
  buttonNeutralDefault: string;
  buttonNeutralDisabled: string;
  buttonNeutralHover: string;
  buttonNeutralPressed: string;
  buttonTip: string;
  buttonTipHover: string;
  buttonCaution: string;
  buttonCautionHover: string;
  buttonDangerEmphasized: string;
  buttonDangerEmphasizedHover: string;
  buttonSuccess: string;
  buttonSuccessHover: string;
}

export const pacificLight: PacificTokens = {
  // Content
  contentPrimaryDefault:            '#1a1919',
  contentPrimaryInverse:            '#ffffff',
  contentOnLight:                   '#1a1919',
  contentOnDark:                    '#ffffff',
  contentDisabled:                  '#dbdad7',
  contentDisabled2:                 '#bdbbb9',
  contentSecondary:                 '#706f6e',
  contentHint:                      '#dbdad7',
  contentBrand:                     '#00a2c7',
  contentLinkPrimary:               '#1a1919',
  contentLinkSecondary:             '#00a2c7',
  contentInfo:                      '#1a1919',
  contentTip:                       '#006280',
  contentSuccess:                   '#1bc245',
  contentSuccessEmphasized:         '#19a623',
  contentCaution:                   '#8c6914',
  contentCautionOnDark:             '#ffcc00',
  contentDanger:                    '#fa2d25',
  contentDangerEmphasized:          '#cd251e',
  contentPositive:                  '#1bc245',
  contentNegative:                  '#fa2d25',
  contentIndicatorSelected:         '#1a1919',
  contentIndicatorCaution:          '#8c6914',
  contentIndicatorFair:             '#fd972e',
  contentIndicatorError:            '#fa2d25',
  contentIndicatorErrorHover:       '#cd251e',
  contentIndicatorErrorPressed:     '#a01d18',
  contentIndicatorSelectedInverse:  '#ffffff',
  contentIndicatorUnselected:       '#5c5b5a',
  contentIndicatorHover:            '#1a1919',
  contentIndicatorDisabled:         '#dbdad7',
  contentStatusBar:                 '#0a0a0a',
  // Surface
  surfaceBase:                          '#faf8f5',
  surfaceElevatedDefault:               '#ffffff',
  surfaceElevatedUnselected:            '#ffffff',
  surfaceElevatedSelected:              '#1a1919',
  surfaceElevatedDisabled:              '#f0eeeb',
  surfaceElevatedDisabledEmphasized:    '#dbdad7',
  surfaceElevatedHover:                 'rgba(10,10,10,0.04)',
  surfaceElevatedPressed:               'rgba(10,10,10,0.08)',
  surfaceBottomSheet:                   '#faf8f5',
  surfaceIndicatorSelected:             '#1a1919',
  surfaceIndicatorSelectedSecondary:    '#706f6e',
  surfaceIndicatorSelectedBrand:        '#00a2c7',
  surfaceIndicatorUnselected:           '#dbdad7',
  surfaceIndicatorUnselectedHover:      '#cccac8',
  surfaceIndicatorDisabled:             '#f0eeeb',
  surfaceIndicatorRange:                '#f0eeeb',
  surfaceInfoLabel:                     '#f5f3f0',
  surfaceInfoDefault:                   '#f0eeeb',
  surfaceTipDefault:                    '#edf8fc',
  surfaceNeutral:                       '#00a2c7',
  surfaceScrim:                         'rgba(10,10,10,0.50)',
  surfaceToast:                         '#0f0f0f',
  surfaceSuccessDefault:                '#ebf9ee',
  surfaceCautionDefault:                '#fff5e5',
  surfaceCautionEmphasize:              '#ffcc00',
  surfaceDangerDefault:                 '#ffe5e5',
  surfaceDangerEmphasize:               '#cd251e',
  surfaceAlert:                         '#fa2d25',
  surfacePositiveDefault:               '#1bc245',
  surfacePositiveDiminish:              '#ebf9ee',
  surfaceNegativeDefault:               '#fa2d25',
  surfaceNegativeDiminish:              '#ffe5e5',
  surfaceSub:                           '#00a2c7',
  surfaceSubDark:                       '#004661',
  surfaceSwitchSelected:                '#ffffff',
  surfaceSwitchUnselected:              '#f0eeeb',
  surfaceSwitchUnselectedHover:         '#e5e4e1',
  // Stroke
  strokeBrand:                          '#00a2c7',
  strokeIndicatorHover:                 '#1a1919',
  strokeIndicatorSelected:              '#1a1919',
  strokeIndicatorPressed:               '#1a1919',
  strokeIndicatorError:                 '#fa2d25',
  strokeIndicatorErrorHover:            '#cd251e',
  strokeIndicatorErrorPressed:          '#a01d18',
  strokeIndicatorUnselectedDefault:     '#dbdad7',
  strokeIndicatorCaution:               '#8c6914',
  strokeOnDark:                         '#ffffff',
  strokePositiveDefault:                '#1bc245',
  strokeNegativeDefault:                '#fa2d25',
  strokeDividePrimary:                  'rgba(10,10,10,0.10)',
  strokeDivideSecondary:                'rgba(10,10,10,0.10)',
  strokeEdge:                           'rgba(10,10,10,0.10)',
  // Button
  buttonBrandDefault:           '#00a2c7',
  buttonBrandDefaultInverse:    '#32b7d9',
  buttonBrandInverse:           '#ffffff',
  buttonBrandDisabled:          '#f0eeeb',
  buttonBrandDisabled2:         '#bdbbb9',
  buttonBrandHover:             '#0080a3',
  buttonBrandPressed:           '#006280',
  buttonDestructiveDefault:     '#fa2d25',
  buttonDestructiveDisabled:    '#ffd7d6',
  buttonDestructiveDisabled2:   '#fda7a4',
  buttonDestructiveHover:       '#cd251e',
  buttonDestructivePressed:     '#a01d18',
  buttonDestructiveInverse:     '#ffffff',
  buttonOnDark:                 '#ffffff',
  buttonOnDarkInverse:          '#0a0a0a',
  buttonNeutralDefault:         '#1a1919',
  buttonNeutralDisabled:        '#dbdad7',
  buttonNeutralHover:           '#3d3d3c',
  buttonNeutralPressed:         '#0a0a0a',
  buttonTip:                    '#006280',
  buttonTipHover:               '#005471',
  buttonCaution:                '#8c6914',
  buttonCautionHover:           '#6c5518',
  buttonDangerEmphasized:       '#cd251e',
  buttonDangerEmphasizedHover:  '#a01d18',
  buttonSuccess:                '#19a623',
  buttonSuccessHover:           '#178a00',
};

export const pacificDark: PacificTokens = {
  // Content
  contentPrimaryDefault:            '#faf8f5',
  contentPrimaryInverse:            '#0a0a0a',
  contentOnLight:                   '#1a1919',
  contentOnDark:                    '#ffffff',
  contentDisabled:                  '#3d3d3c',
  contentDisabled2:                 '#1a1919',
  contentSecondary:                 '#858482',
  contentHint:                      '#858482',
  contentBrand:                     '#32b7d9',
  contentLinkPrimary:               '#faf8f5',
  contentLinkSecondary:             '#32b7d9',
  contentInfo:                      '#faf8f5',
  contentTip:                       '#65cae5',
  contentSuccess:                   '#1bc245',
  contentSuccessEmphasized:         '#1bc245',
  contentCaution:                   '#ffcc00',
  contentCautionOnDark:             '#ffcc00',
  contentDanger:                    '#fa2d25',
  contentDangerEmphasized:          '#fa2d25',
  contentPositive:                  '#1bc245',
  contentNegative:                  '#fa2d25',
  contentIndicatorSelected:         '#faf8f5',
  contentIndicatorCaution:          '#ffcc00',
  contentIndicatorFair:             '#feaa24',
  contentIndicatorError:            '#fa2d25',
  contentIndicatorErrorHover:       '#cd251e',
  contentIndicatorErrorPressed:     '#a01d18',
  contentIndicatorSelectedInverse:  '#0a0a0a',
  contentIndicatorUnselected:       '#999896',
  contentIndicatorHover:            '#faf8f5',
  contentIndicatorDisabled:         '#2e2e2d',
  contentStatusBar:                 '#ffffff',
  // Surface
  surfaceBase:                          '#0a0a0a',
  surfaceElevatedDefault:               '#1a1919',
  surfaceElevatedUnselected:            '#1a1919',
  surfaceElevatedSelected:              '#ffffff',
  surfaceElevatedDisabled:              '#2e2e2d',
  surfaceElevatedDisabledEmphasized:    '#4d4c4b',
  surfaceElevatedHover:                 'rgba(255,255,255,0.04)',
  surfaceElevatedPressed:               'rgba(255,255,255,0.08)',
  surfaceBottomSheet:                   '#1a1919',
  surfaceIndicatorSelected:             '#faf8f5',
  surfaceIndicatorSelectedSecondary:    '#858482',
  surfaceIndicatorSelectedBrand:        '#32b7d9',
  surfaceIndicatorUnselected:           '#2e2e2d',
  surfaceIndicatorUnselectedHover:      '#4d4c4b',
  surfaceIndicatorDisabled:             '#2e2e2d',
  surfaceIndicatorRange:                '#141414',
  surfaceInfoLabel:                     '#242323',
  surfaceInfoDefault:                   '#242323',
  surfaceTipDefault:                    '#002638',
  surfaceNeutral:                       '#32b7d9',
  surfaceScrim:                         'rgba(10,10,10,0.70)',
  surfaceToast:                         '#3d3d3c',
  surfaceSuccessDefault:                '#102916',
  surfaceCautionDefault:                '#353320',
  surfaceCautionEmphasize:              '#ffcc00',
  surfaceDangerDefault:                 '#352120',
  surfaceDangerEmphasize:               '#fa2d25',
  surfaceAlert:                         '#fa2d25',
  surfacePositiveDefault:               '#1bc245',
  surfacePositiveDiminish:              '#102916',
  surfaceNegativeDefault:               '#fa2d25',
  surfaceNegativeDiminish:              '#352120',
  surfaceSub:                           '#001722',
  surfaceSubDark:                       '#0a0a0a',
  surfaceSwitchSelected:                '#2e2e2d',
  surfaceSwitchUnselected:              '#242323',
  surfaceSwitchUnselectedHover:         '#1a1919',
  // Stroke
  strokeBrand:                          '#32b7d9',
  strokeIndicatorHover:                 '#faf8f5',
  strokeIndicatorSelected:              '#faf8f5',
  strokeIndicatorPressed:               '#faf8f5',
  strokeIndicatorError:                 '#fa2d25',
  strokeIndicatorErrorHover:            '#cd251e',
  strokeIndicatorErrorPressed:          '#a01d18',
  strokeIndicatorUnselectedDefault:     '#2e2e2d',
  strokeIndicatorCaution:               '#ffcc00',
  strokeOnDark:                         '#faf8f5',
  strokePositiveDefault:                '#1bc245',
  strokeNegativeDefault:                '#fa2d25',
  strokeDividePrimary:                  'rgba(10,10,10,0.10)',
  strokeDivideSecondary:                'rgba(255,255,255,0.07)',
  strokeEdge:                           'rgba(255,255,255,0.07)',
  // Button
  buttonBrandDefault:           '#32b7d9',
  buttonBrandDefaultInverse:    '#32b7d9',
  buttonBrandInverse:           '#0a0a0a',
  buttonBrandDisabled:          '#2e2e2d',
  buttonBrandDisabled2:         '#1a1919',
  buttonBrandHover:             '#00a2c7',
  buttonBrandPressed:           '#0080a3',
  buttonDestructiveDefault:     '#fa2d25',
  buttonDestructiveDisabled:    '#352120',
  buttonDestructiveDisabled2:   '#731511',
  buttonDestructiveHover:       '#cd251e',
  buttonDestructivePressed:     '#a01d18',
  buttonDestructiveInverse:     '#0a0a0a',
  buttonOnDark:                 '#ffffff',
  buttonOnDarkInverse:          '#0a0a0a',
  buttonNeutralDefault:         '#faf8f5',
  buttonNeutralDisabled:        '#3d3d3c',
  buttonNeutralHover:           '#cccac8',
  buttonNeutralPressed:         '#ffffff',
  buttonTip:                    '#0080a3',
  buttonTipHover:               '#006280',
  buttonCaution:                '#ffcc00',
  buttonCautionHover:           '#f2c102',
  buttonDangerEmphasized:       '#fa2d25',
  buttonDangerEmphasizedHover:  '#cd251e',
  buttonSuccess:                '#1bc245',
  buttonSuccessHover:           '#19a623',
};

// Primitive colors — raw values. Prefer semantic tokens above for all UI work.
export const pacificPrimitives = {
  // Bone (neutral) scale
  bone0: '#ffffff',   bone50: '#faf8f5',  bone100: '#f5f3f0', bone150: '#f0eeeb',
  bone200: '#e5e4e1', bone250: '#dbdad7', bone300: '#cccac8', bone350: '#bdbbb9',
  bone400: '#adacaa', bone450: '#999896', bone500: '#858482', bone550: '#706f6e',
  bone600: '#5c5b5a', bone650: '#4d4c4b', bone700: '#3d3d3c', bone750: '#2e2e2d',
  bone800: '#242323', bone850: '#1a1919', bone900: '#141414', bone950: '#0f0f0f',
  bone1000: '#0a0a0a',
  // Blue scale
  blue50: '#edf8fc',  blue100: '#e5f6fc', blue300: '#ade4f5', blue400: '#87d6ed',
  blue450: '#65cae5', blue500: '#32b7d9', blue550: '#00a2c7', blue600: '#0080a3',
  blue650: '#006280', blue700: '#005471', blue750: '#004661', blue800: '#003951',
  blue850: '#002c40', blue900: '#002638', blue950: '#001e2d', blue1000: '#001722',
  // Red scale
  red50: '#ffe5e5',   red150: '#ffd7d6',  red350: '#fda7a4',  red450: '#fc7c77',
  red550: '#fb4a43',  red600: '#fa2d25',  red650: '#cd251e',  red700: '#a01d18',
  red800: '#731511',  red850: '#352120',
  // Green scale
  green50: '#ebf9ee', green450: '#63d580', green550: '#1bc245', green600: '#19a623',
  green650: '#178a00', green700: '#157206', green900: '#102916',
  // Yellow scale
  yellow50: '#fff5e5',  yellow250: '#ffdc5c', yellow350: '#ffcc00', yellow400: '#f2c102',
  yellow600: '#8c6914', yellow650: '#6c5518', yellow800: '#353320',
  // Brand / marketing
  mktgEggplant: '#4c12a1', mktgInk: '#38256d', mktgBerry: '#cc1975',
  orangeFair: '#fd972e',   orangeFairOnDark: '#feaa24',
} as const;
