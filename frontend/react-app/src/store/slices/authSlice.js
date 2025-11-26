import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
}

// Récupérer l'état depuis localStorage si disponible
const savedAuth = localStorage.getItem('auth')
if (savedAuth) {
  try {
    const parsed = JSON.parse(savedAuth)
    initialState.user = parsed.user
    initialState.isAuthenticated = parsed.isAuthenticated
    initialState.token = parsed.token
  } catch (e) {
    console.error('Error parsing saved auth:', e)
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.token = action.payload.token || null
      // Sauvegarder dans localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: action.payload,
        isAuthenticated: true,
        token: state.token,
      }))
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('auth', JSON.stringify({
        user: action.payload,
        isAuthenticated: true,
        token: state.token,
      }))
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      localStorage.removeItem('auth')
    },
  },
})

export const { login, setUser, logout } = authSlice.actions
export default authSlice.reducer

