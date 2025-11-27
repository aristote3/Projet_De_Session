import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import { useSelector } from 'react-redux'
import AppHeader from './components/Layout/AppHeader'
import AppSider from './components/Layout/AppSider'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/User/UserDashboard'
import UserBookings from './pages/User/UserBookings'
import UserProfile from './pages/User/UserProfile'
import UserNotifications from './pages/User/UserNotifications'
import CalendarView from './pages/CalendarView'
import Resources from './pages/Resources'
import Bookings from './pages/Bookings'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminClientManagement from './pages/Admin/AdminClientManagement'
import AdminBilling from './pages/Admin/AdminBilling'
import AdminPlatformSettings from './pages/Admin/AdminPlatformSettings'
import AdminMonitoring from './pages/Admin/AdminMonitoring'
import AdminSupport from './pages/Admin/AdminSupport'
import AdminFeatures from './pages/Admin/AdminFeatures'
import UserManagement from './pages/Admin/UserManagement'
import Reports from './pages/Admin/Reports'
import ManagerDashboard from './pages/Manager/ManagerDashboard'
import ManagerResourceManagement from './pages/Manager/ManagerResourceManagement'
import ManagerUserManagement from './pages/Manager/ManagerUserManagement'
import ManagerBookingManagement from './pages/Manager/ManagerBookingManagement'
import ManagerBusinessSettings from './pages/Manager/ManagerBusinessSettings'
import ManagerReports from './pages/Manager/ManagerReports'
import ManagerSettings from './pages/Manager/ManagerSettings'
import ManagerSupport from './pages/Manager/ManagerSupport'
import './App.css'

const { Content } = Layout

function App() {
  const [collapsed, setCollapsed] = React.useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Fonction pour déterminer la route par défaut selon le rôle
  const getDefaultRoute = () => {
    if (!isAuthenticated) return '/home'
    if (user?.role === 'admin') return '/admin'
    if (user?.role === 'manager') return '/manager'
    return '/dashboard'
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        
        {/* Page d'accueil publique */}
        <Route path="/home" element={<Home />} />
        
        {/* Page de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Page d'inscription */}
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées de l'application */}
        {isAuthenticated && (
          <Route
            path="/*"
            element={
      <Layout style={{ minHeight: '100vh' }}>
        <AppSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <AppHeader />
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 8, marginLeft: collapsed ? 96 : 266 }}>
            <Routes>
                      {/* Routes User - Utilisateurs normaux voient UserDashboard */}
                      <Route path="/dashboard" element={<ProtectedRoute>{user?.role === 'user' ? <UserDashboard /> : <Dashboard />}</ProtectedRoute>} />
                      <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
                      <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                      {/* Routes spécifiques User */}
                      {user?.role === 'user' && (
                        <>
                          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                          <Route path="/notifications" element={<ProtectedRoute><UserNotifications /></ProtectedRoute>} />
                        </>
                      )}
                      {/* Routes Admin - SaaS Platform Owner */}
                      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin"><AdminClientManagement /></ProtectedRoute>} />
                      <Route path="/admin/clients/new" element={<ProtectedRoute requiredRole="admin"><AdminClientManagement /></ProtectedRoute>} />
                      <Route path="/admin/billing" element={<ProtectedRoute requiredRole="admin"><AdminBilling /></ProtectedRoute>} />
                      <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
                      <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><Reports /></ProtectedRoute>} />
                      <Route path="/admin/platform-settings" element={<ProtectedRoute requiredRole="admin"><AdminPlatformSettings /></ProtectedRoute>} />
                      <Route path="/admin/monitoring" element={<ProtectedRoute requiredRole="admin"><AdminMonitoring /></ProtectedRoute>} />
                      <Route path="/admin/support" element={<ProtectedRoute requiredRole="admin"><AdminSupport /></ProtectedRoute>} />
                      <Route path="/admin/features" element={<ProtectedRoute requiredRole="admin"><AdminFeatures /></ProtectedRoute>} />
                      {/* Routes Manager - Client Tenant Owner */}
                      <Route path="/manager" element={<ProtectedRoute requiredRole="manager"><ManagerDashboard /></ProtectedRoute>} />
                      <Route path="/manager/resources" element={<ProtectedRoute requiredRole="manager"><ManagerResourceManagement /></ProtectedRoute>} />
                      <Route path="/manager/users" element={<ProtectedRoute requiredRole="manager"><ManagerUserManagement /></ProtectedRoute>} />
                      <Route path="/manager/bookings" element={<ProtectedRoute requiredRole="manager"><ManagerBookingManagement /></ProtectedRoute>} />
                      <Route path="/manager/business" element={<ProtectedRoute requiredRole="manager"><ManagerBusinessSettings /></ProtectedRoute>} />
                      <Route path="/manager/reports" element={<ProtectedRoute requiredRole="manager"><ManagerReports /></ProtectedRoute>} />
                      <Route path="/manager/settings" element={<ProtectedRoute requiredRole="manager"><ManagerSettings /></ProtectedRoute>} />
                      <Route path="/manager/support" element={<ProtectedRoute requiredRole="manager"><ManagerSupport /></ProtectedRoute>} />
                      <Route path="*" element={<Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'manager' ? '/manager' : '/dashboard'} replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
            }
          />
        )}
        
        {/* Redirection si non authentifié et essaie d'accéder à une route protégée */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/home" replace />} />
        )}
      </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
