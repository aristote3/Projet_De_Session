import React from 'react'
import { Layout, Avatar, Dropdown, Space, Badge } from 'antd'
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'

const { Header } = Layout

const AppHeader = () => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
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
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div 
        style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#1890ff',
          cursor: 'pointer',
          transition: 'opacity 0.3s'
        }}
        onClick={() => navigate('/home')}
        onMouseEnter={(e) => e.target.style.opacity = '0.7'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        YouManage
      </div>
      <Space size="large">
        <Badge count={5}>
          <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Badge>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 500 }}>{user?.name || 'Utilisateur'}</span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
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

