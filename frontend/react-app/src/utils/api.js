import axios from 'axios'

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api'

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth')
    if (auth) {
      try {
        const { token } = JSON.parse(auth)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (e) {
        console.error('Error parsing auth token:', e)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Permission refusée - ne pas rediriger, juste logger
      console.warn('Accès refusé:', error.response?.data?.message || 'Vous n\'avez pas la permission d\'effectuer cette action')
      // L'erreur sera gérée par le composant qui a fait l'appel
    }
    return Promise.reject(error)
  }
)

export default api

