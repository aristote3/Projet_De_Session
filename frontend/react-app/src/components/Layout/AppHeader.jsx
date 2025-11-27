import React from 'react'
import { Layout, Avatar, Dropdown, Space, Badge } from 'antd'
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { useTheme } from '../../contexts/ThemeContext'
import ThemeToggle from '../ThemeToggle'
import api from '../../utils/api'

const { Header } = Layout

const AppHeader = () => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDarkMode, theme } = useTheme()

  const handleLogout = async () => {
    try {
      // Appeler l'API pour déconnecter (invalider le token)
      await api.post('/auth/logout')
    } catch (err) {
      // Même en cas d'erreur, on déconnecte localement
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      // Déconnecter localement dans tous les cas
      dispatch(logout())
      navigate('/login')
    }
  }

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: 'Paramètres',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      onClick: handleLogout,
    },
  ]

  return (
    <Header
      style={{
        padding: '0 24px',
        background: isDarkMode ? theme.colorBgContainer : '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        borderBottom: isDarkMode ? '1px solid #334155' : 'none',
      }}
    >
      <div 
        style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: theme.colorPrimary,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textShadow: isDarkMode ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none',
        }}
        onClick={() => navigate('/home')}
        onMouseEnter={(e) => e.target.style.opacity = '0.7'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        YouManage
      </div>
      <Space size="large">
        <ThemeToggle />
        <Badge count={5}>
          <BellOutlined style={{ fontSize: '20px', cursor: 'pointer', color: theme.colorText }} />
        </Badge>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ 
                background: isDarkMode ? '#1e40af' : '#1890ff',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 500, color: theme.colorText }}>{user?.name || 'Utilisateur'}</span>
              <span style={{ fontSize: 12, color: theme.colorTextSecondary }}>
                {user?.role === 'admin' ? 'Administrateur' : user?.role === 'manager' ? 'Gérant' : 'Utilisateur'}
              </span>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  )
}

export default AppHeader

