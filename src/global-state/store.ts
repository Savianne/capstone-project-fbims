import { configureStore } from '@reduxjs/toolkit'
//Reducers
import counterReducer from './action-creators/counterSlice';
import navBarToggleReducer from './action-creators/navBarToggleSlice';
import sideBarToggleReducer from './action-creators/sideBarToggleSlice';
import switchThemeModeReducer from './action-creators/themeModeSwitcherSlice';
import addEventFormReducer from './action-creators/createEventFormSlice';
import setAdminReducer from "./action-creators/setAdminSlice";

//API
import { api } from './api/api';

export const store = configureStore({
  reducer: {
    api: api.reducer,
    setAdmin: setAdminReducer,
    counter: counterReducer,
    navBarToggle: navBarToggleReducer,
    switchThemeModeReducer,
    sideBarToggleReducer,
    addEventFormReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch