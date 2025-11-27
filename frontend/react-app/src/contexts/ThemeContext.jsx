import React, { createContext, useContext, useState, useEffect } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'

const ThemeContext = createContext()

// Color palettes for both themes
const lightTheme = {
  colorPrimary: '#0ea5e9',
  colorBgBase: '#ffffff',
  colorBgContainer: '#ffffff',
  colorBgLayout: '#f5f5f5',
  colorText: '#1f2937',
  colorTextSecondary: '#6b7280',
  colorBorder: '#e5e7eb',
  colorBorderSecondary: '#f3f4f6',
  borderRadius: 8,
}

const darkTheme = {
  colorPrimary: '#38bdf8',
  colorBgBase: '#0f172a',
  colorBgContainer: '#1e293b',
  colorBgLayout: '#020617',
  colorText: '#f1f5f9',
  colorTextSecondary: '#94a3b8',
  colorBorder: '#334155',
  colorBorderSecondary: '#1e293b',
  borderRadius: 8,
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('youmanage-theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('youmanage-theme', isDarkMode ? 'dark' : 'light')
    document.body.classList.toggle('dark-mode', isDarkMode)
    document.body.classList.toggle('light-mode', !isDarkMode)
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  const currentTheme = isDarkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme: currentTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: currentTheme,
          components: {
            Layout: {
              siderBg: isDarkMode ? '#0f172a' : '#001529',
              headerBg: isDarkMode ? '#1e293b' : '#ffffff',
              bodyBg: isDarkMode ? '#020617' : '#f5f5f5',
            },
            Menu: {
              darkItemBg: isDarkMode ? '#0f172a' : '#001529',
              darkItemSelectedBg: isDarkMode ? '#1e40af' : '#1677ff',
            },
            Card: {
              colorBgContainer: isDarkMode ? '#1e293b' : '#ffffff',
            },
            Table: {
              colorBgContainer: isDarkMode ? '#1e293b' : '#ffffff',
            },
            Modal: {
              contentBg: isDarkMode ? '#1e293b' : '#ffffff',
              headerBg: isDarkMode ? '#1e293b' : '#ffffff',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext

