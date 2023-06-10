import { createSlice } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState: { state: string } = {
    state: 'inactive'
}; 

export const addEventFormSlice = createSlice({
  name: 'addEventForm',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    displayForm: (state) => {
      state.state = 'ondisplay'
    },
    removeForm: (state) => {
      state.state = 'remove'
    },
    openForm: (state) => {
      state.state = 'open'
    }, 
    closeForm: (state) => {
      state.state = 'close'
    },
  },
})

export const { displayForm, closeForm, openForm, removeForm } = addEventFormSlice.actions


export default addEventFormSlice.reducer