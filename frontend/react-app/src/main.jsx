import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import frFR from 'antd/locale/fr_FR'
import App from './App'
import { store } from './store/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={frFR}>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
