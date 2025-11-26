import { configureStore } from '@reduxjs/toolkit'
import resourcesReducer from './slices/resourcesSlice'
import bookingsReducer from './slices/bookingsSlice'
import authReducer from './slices/authSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    bookings: bookingsReducer,
    auth: authReducer,
    users: usersReducer,
  },
})

