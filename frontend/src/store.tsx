import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import counterReducer from './pages/exampleRudexAxios/createSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>() 

export default store