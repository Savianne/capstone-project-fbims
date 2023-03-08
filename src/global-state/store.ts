import { configureStore } from '@reduxjs/toolkit'
//Reducers
import counterReducer from './action-creators/counterSlice';
import navBarToggleReducer from './action-creators/navBarToggleSlice';
import sideBarToggleReducer from './action-creators/sideBarToggleSlice';
import switchThemeModeReducer from './action-creators/themeModeSwitcherSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    navBarToggle: navBarToggleReducer,
    switchThemeModeReducer,
    sideBarToggleReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch