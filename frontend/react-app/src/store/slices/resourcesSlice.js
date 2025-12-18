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
  async (resourceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/resources', resourceData)
      return response.data
    } catch (error) {
      // Gérer spécifiquement les erreurs 403 (non autorisé)
      if (error.response?.status === 403) {
        return rejectWithValue('Vous n\'avez pas la permission de créer des ressources. Seuls les managers et administrateurs peuvent créer des ressources.')
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de la création de la ressource')
    }
  }
)

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/resources/${id}`, data)
      return response.data
    } catch (error) {
      // Gérer spécifiquement les erreurs 403 (non autorisé)
      if (error.response?.status === 403) {
        return rejectWithValue('Vous n\'avez pas la permission de modifier des ressources. Seuls les managers et administrateurs peuvent modifier des ressources.')
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de la modification de la ressource')
    }
  }
)

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/resources/${id}`)
      return id
    } catch (error) {
      // Gérer spécifiquement les erreurs 403 (non autorisé)
      if (error.response?.status === 403) {
        return rejectWithValue('Vous n\'avez pas la permission de supprimer des ressources. Seuls les managers et administrateurs peuvent supprimer des ressources.')
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Erreur lors de la suppression de la ressource')
    }
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
      .addCase(createResource.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.loading = false
        const resource = action.payload.data || action.payload
        state.items.push(resource)
      })
      .addCase(createResource.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(updateResource.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateResource.fulfilled, (state, action) => {
        state.loading = false
        const resource = action.payload.data || action.payload
        const index = state.items.findIndex(item => item.id === resource.id)
        if (index !== -1) {
          state.items[index] = resource
        }
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(deleteResource.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(item => item.id !== action.payload)
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export default resourcesSlice.reducer

