import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Vérifier le rôle si requis
  if (requiredRole && user?.role !== requiredRole) {
    // Les admins ont accès à tout sauf les routes manager spécifiques
    if (user?.role === 'admin' && requiredRole !== 'manager') {
      // Admin peut accéder à tout sauf les routes manager
      return children
    }
    // Rediriger selon le rôle de l'utilisateur
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (user?.role === 'manager') {
      return <Navigate to="/manager" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute

