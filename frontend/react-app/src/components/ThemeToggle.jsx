import React from 'react'
import { Button, Tooltip } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Tooltip title={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
      <Button
        type="text"
        onClick={toggleTheme}
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        style={{
          fontSize: 20,
          width: 44,
          height: 44,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDarkMode ? '#fbbf24' : '#6366f1',
          background: isDarkMode ? 'rgba(251, 191, 36, 0.15)' : 'rgba(99, 102, 241, 0.1)',
          border: `2px solid ${isDarkMode ? '#fbbf24' : '#6366f1'}`,
          transition: 'all 0.3s ease',
        }}
      />
    </Tooltip>
  )
}

export default ThemeToggle

