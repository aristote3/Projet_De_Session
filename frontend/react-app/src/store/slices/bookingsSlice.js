import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api'

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params = {}) => {
    const response = await axios.get(`${API_URL}/bookings`, { params })
    return response.data
  }
)

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData) => {
    const response = await axios.post(`${API_URL}/bookings`, bookingData)
    return response.data
  }
)

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/bookings/${id}`, data)
    return response.data
  }
)

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id) => {
    const response = await axios.delete(`${API_URL}/bookings/${id}`)
    return response.data
  }
)

export const approveBooking = createAsyncThunk(
  'bookings/approveBooking',
  async (id) => {
    const response = await axios.post(`${API_URL}/bookings/${id}/approve`)
    return response.data
  }
)

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data || action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
  },
})

export default bookingsSlice.reducer

