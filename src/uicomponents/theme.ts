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
        disabled: '#e0dfdf'
    },
    // borderColor: '#E2E1E1',
    borderColor: "#e6e8ec",
    borderColorStrong: '#cdcdcd',
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
    // mainBackground: '#342A40',
    mainBackground: '#1a2035',
    background: {
        // primary: '#1a2035',
        primary: '#343541',
        // light: 'rgba(21, 169, 253, 0.09)',
        // light: '#263d4b',
        light: '#3e8cba2e',
        lighter: '#34384f',
        transparent: 'transparent',
    },
    textColor: {
        strong: '#fff',
        light: '#E2E1E1',
        disabled: '#504f4f'
    },
    // borderColor: '#34354100',
    borderColor: '#37414b',
    borderColorStrong: '#8e8e8e',
    staticColor: {
        primary: '#15A9FD',
        secondary: '#D9D9D9',
        warning: '#FD9215',
        edit: '#00c13d',
        delete: '#FD1515',
        disabled: '#F1F1F1'
    },
    ripple: 'rgb(50 176 248 / 18%)',
};


export { lightTheme, darkTheme };