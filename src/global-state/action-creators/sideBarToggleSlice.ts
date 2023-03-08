import { createSlice } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState: { state: string } = {
    state: 'open'
}; 

export const sideBarToggleSlice = createSlice({
  name: 'sideBarToggle',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openSideBar: (state) => {
      state.state = 'open'
    },
    closeSideBar: (state) => {
        state.state = 'close'
      },
  },
})

export const { openSideBar, closeSideBar } = sideBarToggleSlice.actions


export default sideBarToggleSlice.reducer