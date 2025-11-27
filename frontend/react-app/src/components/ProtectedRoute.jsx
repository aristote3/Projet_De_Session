import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si aucun rôle requis, autoriser l'accès
  if (!requiredRole) {
    return children
  }

  // Vérifier le rôle requis
  const userRole = user?.role

  // Admin a accès à toutes les routes admin
  if (requiredRole === 'admin' && userRole === 'admin') {
    return children
  }

  // Manager a accès aux routes manager
  if (requiredRole === 'manager' && userRole === 'manager') {
    return children
  }

  // Si le rôle ne correspond pas, rediriger vers le dashboard approprié
  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />
  } else if (userRole === 'manager') {
    return <Navigate to="/manager" replace />
  } else {
    return <Navigate to="/dashboard" replace />
  }
}

export default ProtectedRoute

