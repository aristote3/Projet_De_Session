import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async () => {
    const response = await api.get('/resources')
    return response.data
  }
)

export const createResource = createAsyncThunk(
  'resources/createResource',
  async (resourceData) => {
    const response = await api.post('/resources', resourceData)
    return response.data
  }
)

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, data }) => {
    const response = await api.put(`/resources/${id}`, data)
    return response.data
  }
)

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (id) => {
    await api.delete(`/resources/${id}`)
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
        const resource = action.payload.data || action.payload
        state.items.push(resource)
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        const resource = action.payload.data || action.payload
        const index = state.items.findIndex(item => item.id === resource.id)
        if (index !== -1) {
          state.items[index] = resource
        }
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  },
})

export default resourcesSlice.reducer

