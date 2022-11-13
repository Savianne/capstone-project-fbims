import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store';

import { DefaultTheme } from 'styled-components';

import { darkTheme, lightTheme } from '../../uicomponents/theme';

const initialState = {
    theme:  lightTheme
}

export const switchThemeModeSlice = createSlice({
    name: 'switchThemeMode',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
      activeLightTheme: (state) => {
        state.theme = lightTheme
      },
      activeDarkTheme: (state) => {
          state.theme = darkTheme
        },
    },
  });

  export const { activeLightTheme, activeDarkTheme } = switchThemeModeSlice.actions


export default switchThemeModeSlice.reducer