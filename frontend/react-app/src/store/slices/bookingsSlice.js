import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params = {}) => {
    const response = await api.get('/bookings', { params })
    return response.data
  }
)

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
  }
)

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, data }) => {
    const response = await api.put(`/bookings/${id}`, data)
    return response.data
  }
)

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id) => {
    const response = await api.delete(`/bookings/${id}`)
    return response.data
  }
)

export const approveBooking = createAsyncThunk(
  'bookings/approveBooking',
  async (id) => {
    const response = await api.post(`/bookings/${id}/approve`)
    return response.data
  }
)

export const rejectBooking = createAsyncThunk(
  'bookings/rejectBooking',
  async (id) => {
    const response = await api.post(`/bookings/${id}/reject`)
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
        const booking = action.payload.data || action.payload
        state.items.push(booking)
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const booking = action.payload.data || action.payload
        const index = state.items.findIndex(item => item.id === booking.id)
        if (index !== -1) {
          state.items[index] = booking
        }
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const booking = action.payload.data || action.payload
        const index = state.items.findIndex(item => item.id === booking.id)
        if (index !== -1) {
          state.items[index] = booking
        }
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        const booking = action.payload.data || action.payload
        const index = state.items.findIndex(item => item.id === booking.id)
        if (index !== -1) {
          state.items[index] = booking
        }
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        const booking = action.payload.data || action.payload
        const index = state.items.findIndex(item => item.id === booking.id)
        if (index !== -1) {
          state.items[index] = booking
        }
      })
  },
})

export default bookingsSlice.reducer

