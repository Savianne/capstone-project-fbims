// my-theme.ts
import { DefaultTheme } from 'styled-components';

const lightTheme: DefaultTheme = {
    mode: 'light',
    mainBackground: '#F9F9F9',
    background: {
        primary: '#FFFFFF',
        // light: '#d7f0ff5e',
        light: '#e6f2fa',
        lighter: '#F9F9F9',
        transparent: 'transparent',
    },
    textColor: {
        strong: '#000000',
        light: '#817B7B',
        disabled: '#B4AFAF'
    },
    borderColor: '#E2E1E1',
    staticColor: {
        primary: '#15A9FD',
        secondary: '#D9D9D9',
        warning: '#FD9215',
        edit: '#15FD56',
        delete: '#FD1515',
        disabled: '#F1F1F1'
    },
    ripple: 'rgb(50 176 248 / 18%)',
};

const darkTheme: DefaultTheme = {
    mode: 'dark',
    mainBackground: '#342A40',
    background: {
        primary: '#302A34',
        // light: 'rgba(21, 169, 253, 0.09)',
        light: '#263d4b',
        lighter: '#F9F9F9',
        transparent: 'transparent',
    },
    textColor: {
        strong: '#fff',
        light: '#E2E1E1',
        disabled: '#D0CCCC'
    },
    borderColor: '#373839',
    staticColor: {
        primary: '#15A9FD',
        secondary: '#D9D9D9',
        warning: '#FD9215',
        edit: '#15FD56',
        delete: '#FD1515',
        disabled: '#F1F1F1'
    },
    ripple: 'rgb(50 176 248 / 18%)',
};


export { lightTheme, darkTheme };