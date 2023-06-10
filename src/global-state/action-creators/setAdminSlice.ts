import { createSlice } from '@reduxjs/toolkit'

export interface ICongregationInfo {
    name: string,
    address: string,
    mission: string,
    vision: string,
    avatar: string,
    logo: string,
    foundationDate: Date
}

export interface IAdminInfo {
    name: string,
    congregation: ICongregationInfo,
    email: string,
    cpNumber: string,
    avatar: string,
    role: "main-admin" | "admin"
}

// Define the initial state using that type
const initialState: { admin: null | IAdminInfo} = {
    admin: null
}; 

export const setAdminSlice = createSlice({
  name: 'setAdminInfo',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload
    },
  },
})

export const { setAdmin } = setAdminSlice.actions


export default setAdminSlice.reducer;