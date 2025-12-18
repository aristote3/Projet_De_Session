import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchResources } from '../store/slices/resourcesSlice'

/**
 * Hook personnalisé pour rafraîchir automatiquement les ressources
 * @param {number} intervalSeconds - Intervalle en secondes (défaut: 30)
 * @param {boolean} enabled - Activer ou désactiver le polling (défaut: true)
 */
export const useResourcePolling = (intervalSeconds = 30, enabled = true) => {
  const dispatch = useDispatch()
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Rafraîchir immédiatement au montage
    dispatch(fetchResources())

    // Configurer le polling
    intervalRef.current = setInterval(() => {
      dispatch(fetchResources())
    }, intervalSeconds * 1000)

    // Nettoyer l'intervalle au démontage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [dispatch, intervalSeconds, enabled])

  // Fonction pour rafraîchir manuellement
  const refresh = () => {
    dispatch(fetchResources())
  }

  return { refresh }
}

