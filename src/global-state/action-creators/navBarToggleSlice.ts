import { createSlice } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState: { state: string } = {
    state: 'open'
}; 

export const navBarToggleSlice = createSlice({
  name: 'navBarToggle',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openNav: (state) => {
      state.state = 'open'
    },
    closeNav: (state) => {
        state.state = 'close'
      },
  },
})

export const { openNav, closeNav } = navBarToggleSlice.actions


export default navBarToggleSlice.reducer