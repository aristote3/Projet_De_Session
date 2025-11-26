import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
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
} from '@ant-design/icons'

const { Sider } = Layout

const AppSider = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
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
      key: '/bookings',
      icon: <BookOutlined />,
      label: user?.role === 'user' ? 'Mes réservations' : 'Réservations',
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
      theme="light"
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 64,
          margin: 16,
          background: 'rgba(24, 144, 255, 0.1)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#1890ff',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
        onClick={() => navigate('/home')}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(24, 144, 255, 0.2)'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {!collapsed && 'YouManage'}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  )
}

export default AppSider

