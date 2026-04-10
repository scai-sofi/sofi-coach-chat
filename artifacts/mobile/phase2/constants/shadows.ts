import { ViewStyle } from 'react-native';

// Pacific dropShadow-down-2 token
// @ts-expect-error boxShadow works across all platforms
export const shadowDownTwo: ViewStyle = {
  boxShadow: '0px 0px 1px 0px rgba(10,10,10,0.16), 0px 2px 8px 0px rgba(10,10,10,0.04), 0px 4px 16px 0px rgba(10,10,10,0.02)',
};
