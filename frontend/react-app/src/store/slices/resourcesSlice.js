import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = '/api'

export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async () => {
    const response = await axios.get(`${API_URL}/resources`)
    return response.data
  }
)

export const createResource = createAsyncThunk(
  'resources/createResource',
  async (resourceData) => {
    const response = await axios.post(`${API_URL}/resources`, resourceData)
    return response.data
  }
)

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/resources/${id}`, data)
    return response.data
  }
)

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (id) => {
    await axios.delete(`${API_URL}/resources/${id}`)
    return id
  }
)

const resourcesSlice = createSlice({
  name: 'resources',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data || action.payload
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  },
})

export default resourcesSlice.reducer

