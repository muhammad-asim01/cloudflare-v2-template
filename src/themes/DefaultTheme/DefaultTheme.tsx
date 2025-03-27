
import {store} from '../../store/configureStore'
import { createTheme, ThemeOptions, ZIndex } from '@mui/material';


const configData = store.getState().config?.data?.data?.themeOptions;

declare module '@mui/material' {
  interface Theme {
    zIndex: ZIndex;
  }

  interface ThemeOptions {
    custom?: any;
  }
}

export const createLemonadeTheme = (options: ThemeOptions = {}) => {
  return createTheme(options);
};
const themeOptions = {
  colors: {
    primary: configData?.primary || '#FFCC00',
    secondary: configData?.secondary || '#3A39BB',
    primaryText: configData?.primary_text || '#636363',
    secondaryText: configData?.secondary_text || '#363636',
    metamask: configData?.meta_mask || '#FF8F44',
    mainBackground: configData?.main_background || '#202020',
    secondaryBackground: configData?.secondary_background || '#FFFFFF',
    primaryGradient: configData?.primary_gradient || '#6154DA',
    primaryGradientTwo: configData?.primary_gradient_two || '#6254DA',
    secondaryGradient: configData?.secondary_gradient || '#E59396',
    secondaryGradientTwo: configData?.secondary_gradient_two || '#E69598',
    linearGradientPrimaryOne: configData?.linear_gradient_primary_one || '#764CE2',
    linearGradientPrimaryTwo: configData?.linear_gradient_primary_two || '#7E4CD2',
    linearGradientSecondaryOne: configData?.linear_gradient_secondary_one || '#D9B4C7',
    linearGradientSecondaryTwo: configData?.linear_gradient_secondary_two ||'#BEA5C5'
  },
};
// const themeOptions = {
//   colors: {
//     primary: '#FFCC00',
//     secondary: '#3A39BB',
//     primaryText: '#636363',
//     secondaryText: '#363636',
//     metamask: '#FF8F44',
//     mainBackground: '#202020',
//   },
// };

const defaultTheme = createLemonadeTheme({
  custom: themeOptions,
});

export { themeOptions };
export default defaultTheme;