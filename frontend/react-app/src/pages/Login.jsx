import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/slices/authSlice'
import api from '../utils/api'

const { Title, Text } = Typography

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  React.useEffect(() => {
    if (isAuthenticated) {
      // Rediriger selon le rôle
      if (user?.role === 'admin') {
        navigate('/admin')
      } else if (user?.role === 'manager') {
        navigate('/manager')
      } else {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, navigate, user])

  const goToHome = () => {
    navigate('/home')
  }

  const onFinish = async (values) => {
    setLoading(true)
    setError(null)

    try {
      // Appel API réel
      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      })

      const { user, token } = response.data.data

      // Sauvegarder dans Redux
      dispatch(
        login({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token,
        })
      )

      // Rediriger selon le rôle
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'manager') {
        navigate('/manager')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      // Gérer les erreurs de l'API
      if (err.response?.status === 401) {
        setError('Identifiants invalides. Veuillez vérifier votre email et mot de passe.')
      } else if (err.response?.status === 403) {
        setError('Votre compte est désactivé. Contactez un administrateur.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.message === 'Network Error') {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.')
      } else {
        setError('Erreur de connexion. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        background: '#020617', 
      }}
    >
      {/* Neon grid effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: '50px 50px',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          animation: 'moveGrid 35s linear infinite',
          zIndex: -2,
        }}
      />

      {/* Pulsing energy orb */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(0,140,255,0.25), rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          animation: 'pulse 6s ease-in-out infinite',
          zIndex: -1,
        }}
      />

      {/* Mini CSS animation keyframes */}
      <style>
        {`
        @keyframes pulse {
          0%, 100% { opacity: .3; }
          50% { opacity: .8; }
        }
        @keyframes moveGrid {
          from { transform: translateY(0px); }
          to { transform: translateY(50px); }
        }
        .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .ant-input {
          color: #ffffff !important;
        }
        .ant-input-password input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .ant-input-password input {
          color: #ffffff !important;
        }
        `}
      </style>

      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 16,
          boxShadow: '0 0 25px rgba(0,150,255,0.25)',
          paddingTop: 10,
        }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: '100%', marginTop: 10 }}
        >
          <div style={{ textAlign: 'center' }}>
            <Title
              level={2}
              style={{
                marginBottom: 4,
                color: '#38bdf8',
                textShadow: '0 0 12px #0ea5e9',
                fontWeight: 700,
              }}
            >
              YouManage
            </Title>
            <Text style={{ color: '#cbd5e1' }}>
              Portail d'authentification sécurisé
            </Text>
          </div>

          <Button
            type="link"
            onClick={goToHome}
            style={{
              padding: 0,
              marginBottom: -8,
              color: '#93c5fd',
            }}
          >
            ← Retour à l'accueil
          </Button>

          {error && (
            <Alert
              message="Erreur"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{
                background: 'rgba(255,0,0,0.1)',
                borderColor: 'rgba(255,0,0,0.2)',
              }}
            />
          )}

          <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message:
                    "Veuillez entrer votre email ou nom d'utilisateur!",
                },
                {
                  type: 'email',
                  message: 'Email invalide!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#60a5fa' }} />}
                placeholder="Email ou nom d'utilisateur"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer votre mot de passe!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#60a5fa' }} />}
                placeholder="Mot de passe"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                icon={<LoginOutlined />}
                style={{
                  height: 48,
                  fontWeight: 'bold',
                  background:
                    'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)',
                  border: 'none',
                }}
              >
                Se connecter
              </Button>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                  Pas encore de compte ?{' '}
                </Text>
                <Button
                  type="link"
                  onClick={() => navigate('/register')}
                  style={{
                    padding: 0,
                    height: 'auto',
                    fontWeight: 500,
                    color: '#38bdf8',
                    textShadow: '0 0 8px rgba(56,189,248,0.5)',
                  }}
                >
                  S'inscrire
                </Button>
              </div>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>
              <strong>Comptes créés:</strong>
              <br />
              Admin: aristotebubala4@gmail.com / admin123
              <br />
              Admin: admin@youmanage.com / admin123
              <br />
              Admin: admin@example.com / password123
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default Login