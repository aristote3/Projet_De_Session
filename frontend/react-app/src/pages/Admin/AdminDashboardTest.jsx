import React, { useEffect, useState } from 'react'
import { Card, Typography, Alert, Button } from 'antd'
import { useSelector } from 'react-redux'

const { Title } = Typography

const AdminDashboardTest = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    setDebugInfo({
      isAuthenticated,
      userRole: user?.role,
      userEmail: user?.email,
      timestamp: new Date().toISOString(),
    })
  }, [isAuthenticated, user])

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Test Page Admin</Title>
      
      <Alert
        message="Informations de débogage"
        description={
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        }
        type="info"
        style={{ marginBottom: 24 }}
      />

      {!isAuthenticated && (
        <Alert
          message="Non authentifié"
          description="Tu n'es pas connecté. Va sur /login et connecte-toi avec admin@example.com"
          type="warning"
          style={{ marginBottom: 24 }}
        />
      )}

      {isAuthenticated && user?.role !== 'admin' && (
        <Alert
          message="Rôle incorrect"
          description={`Tu es connecté mais ton rôle est "${user?.role}" au lieu de "admin"`}
          type="error"
          style={{ marginBottom: 24 }}
        />
      )}

      {isAuthenticated && user?.role === 'admin' && (
        <Alert
          message="✅ Authentification OK"
          description="Tu es bien connecté en tant qu'admin. Le problème vient du composant AdminDashboard."
          type="success"
          style={{ marginBottom: 24 }}
        />
      )}

      <Card title="Test de rendu">
        <p>Si tu vois ce message, le composant se charge correctement.</p>
        <p>Le problème vient probablement du composant AdminDashboard principal.</p>
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Button onClick={() => window.location.href = '/admin'}>
          Aller à la vraie page admin
        </Button>
        <Button onClick={() => {
          localStorage.setItem('auth', JSON.stringify({
            user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
            isAuthenticated: true,
            token: 'dev-token'
          }))
          window.location.reload()
        }}>
          Forcer connexion admin
        </Button>
      </Card>
    </div>
  )
}

export default AdminDashboardTest

