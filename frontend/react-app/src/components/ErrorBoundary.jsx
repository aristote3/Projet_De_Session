import React from 'react'
import { Alert, Button, Card } from 'antd'
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour que le prochain rendu affiche l'UI de secours
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Enregistrer l'erreur dans un service de logging
    console.error('ErrorBoundary - Erreur capturée:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/home'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ maxWidth: 800, width: '100%' }}>
            <Alert
              message="Erreur de rendu"
              description={
                <div>
                  <p>Une erreur s'est produite lors du chargement de cette page.</p>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details style={{ marginTop: 16 }}>
                      <summary style={{ cursor: 'pointer', marginBottom: 8 }}>
                        Détails de l'erreur (développement)
                      </summary>
                      <pre style={{ 
                        background: '#f5f5f5', 
                        padding: 12, 
                        borderRadius: 4, 
                        overflow: 'auto',
                        fontSize: 12 
                      }}>
                        {this.state.error.toString()}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              }
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={this.handleReload}
              >
                Recharger la page
              </Button>
              <Button 
                icon={<HomeOutlined />} 
                onClick={this.handleGoHome}
              >
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

