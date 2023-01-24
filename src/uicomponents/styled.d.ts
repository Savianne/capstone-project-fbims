// import original module declarations
import 'styled-components';
import IPalete from './types/IPalete';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    mode: string,
    mainBackground: string,
    background: {
        primary: string,
        light: string,
        lighter: string,
        transparent: string,
    },
    textColor: {
        strong: string,
        light: string,
        disabled: string,
    },
    borderColor: string,
    borderColorStrong: string,
    staticColor: {
        primary: string,
        secondary: string,
        warning: string,
        edit: string,
        delete: string,
        disabled: string
    },
    ripple: string
  }
}