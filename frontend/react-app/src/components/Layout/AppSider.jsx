import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTheme } from '../../contexts/ThemeContext'
import {
  DashboardOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  BookOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  BellOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  SoundOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'

const { Sider } = Layout

const AppSider = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { isDarkMode, theme } = useTheme()
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tableau de bord',
    },
    {
      key: '/calendar',
      icon: <CalendarOutlined />,
      label: 'Calendrier',
    },
    {
      key: '/resources',
      icon: <AppstoreOutlined />,
      label: 'Ressources',
    },
    {
      key: '/floor-plan',
      icon: <EnvironmentOutlined />,
      label: 'Plan interactif',
    },
    {
      key: '/bookings',
      icon: <BookOutlined />,
      label: user?.role === 'user' ? 'Mes réservations' : 'Réservations',
    },
    {
      key: '/messages',
      icon: <MessageOutlined />,
      label: 'Messages',
    },
    // Menu spécifique User
    ...(user?.role === 'user'
      ? [
          {
            key: '/notifications',
            icon: <BellOutlined />,
            label: 'Notifications',
          },
          {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Mon profil',
          },
        ]
      : []),
    // Menu Admin - SaaS Platform Owner
    ...(isAdmin
      ? [
          {
            type: 'divider',
          },
          {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Tableau de bord plateforme',
          },
          {
            key: '/admin/clients',
            icon: <TeamOutlined />,
            label: 'Gestion clients',
          },
          {
            key: '/admin/billing',
            icon: <DollarOutlined />,
            label: 'Facturation',
          },
          {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Utilisateurs système',
          },
          {
            key: '/admin/pending-requests',
            icon: <ClockCircleOutlined />,
            label: 'Demandes en attente',
          },
          {
            key: '/admin/reports',
            icon: <BarChartOutlined />,
            label: 'Rapports globaux',
          },
          {
            key: '/admin/platform-settings',
            icon: <GlobalOutlined />,
            label: 'Configuration plateforme',
          },
          {
            key: '/admin/monitoring',
            icon: <ThunderboltOutlined />,
            label: 'Monitoring',
          },
          {
            key: '/admin/support',
            icon: <CustomerServiceOutlined />,
            label: 'Support',
          },
          {
            key: '/admin/features',
            icon: <RocketOutlined />,
            label: 'Feature flags',
          },
        ]
      : []),
    // Menu Manager - Client Tenant Owner
    ...(isManager
      ? [
          {
            type: 'divider',
          },
          {
            key: '/manager',
            icon: <DashboardOutlined />,
            label: 'Tableau de bord',
          },
          {
            key: '/manager/resources',
            icon: <AppstoreOutlined />,
            label: 'Gestion ressources',
          },
          {
            key: '/manager/users',
            icon: <UserOutlined />,
            label: 'Gestion utilisateurs',
          },
          {
            key: '/manager/bookings',
            icon: <BookOutlined />,
            label: 'Gestion réservations',
          },
          {
            key: '/manager/business',
            icon: <ShopOutlined />,
            label: 'Configuration business',
          },
          {
            key: '/manager/reports',
            icon: <BarChartOutlined />,
            label: 'Rapports',
          },
          {
            key: '/manager/settings',
            icon: <SettingOutlined />,
            label: 'Paramètres',
          },
          {
            key: '/manager/broadcast',
            icon: <SoundOutlined />,
            label: 'Diffusion messages',
          },
          {
            key: '/manager/support',
            icon: <CustomerServiceOutlined />,
            label: 'Support',
          },
        ]
      : []),
  ]

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme={isDarkMode ? 'dark' : 'light'}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: isDarkMode ? '#0f172a' : '#ffffff',
        borderRight: `1px solid ${isDarkMode ? '#334155' : '#f0f0f0'}`,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          height: 64,
          margin: 16,
          background: isDarkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(24, 144, 255, 0.1)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: collapsed ? 14 : 18,
          color: isDarkMode ? '#38bdf8' : '#1890ff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: `1px solid ${isDarkMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(24, 144, 255, 0.2)'}`,
          textShadow: isDarkMode ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none',
        }}
        onClick={() => navigate('/home')}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDarkMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(24, 144, 255, 0.2)'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDarkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(24, 144, 255, 0.1)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {!collapsed ? '✨ YouManage' : '✨'}
      </div>
      <Menu
        mode="inline"
        theme={isDarkMode ? 'dark' : 'light'}
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ 
          borderRight: 0,
          background: 'transparent',
        }}
      />
    </Sider>
  )
}

export default AppSider

