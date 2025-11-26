import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const goToHome = () => {
    navigate('/home')
  }

  const goToLogin = () => {
    navigate('/login')
  }

  const onFinish = async (values) => {
    setLoading(true)
    setError(null)

    try {
      // Simulation d'une inscription
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Ici, vous pouvez ajouter l'appel API pour l'inscription
      // const response = await axios.post('/api/register', values)

      setSuccess(true)
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.')
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
              Créer un nouveau compte
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

          {success && (
            <Alert
              message="Inscription réussie !"
              description="Redirection vers la page de connexion..."
              type="success"
              showIcon
              style={{
                background: 'rgba(0,255,0,0.1)',
                borderColor: 'rgba(0,255,0,0.2)',
              }}
            />
          )}

          <Form name="register" onFinish={onFinish} autoComplete="off" size="large">
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer votre nom!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#60a5fa' }} />}
                placeholder="Nom complet"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer votre email!',
                },
                {
                  type: 'email',
                  message: 'Email invalide!',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#60a5fa' }} />}
                placeholder="Email"
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
                {
                  min: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères!',
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

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Veuillez confirmer votre mot de passe!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Les mots de passe ne correspondent pas!'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#60a5fa' }} />}
                placeholder="Confirmer le mot de passe"
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
                icon={<UserAddOutlined />}
                style={{
                  height: 48,
                  fontWeight: 'bold',
                  background:
                    'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)',
                  border: 'none',
                }}
              >
                S'inscrire
              </Button>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                  Déjà un compte ?{' '}
                </Text>
                <Button
                  type="link"
                  onClick={goToLogin}
                  style={{
                    padding: 0,
                    height: 'auto',
                    fontWeight: 500,
                    color: '#38bdf8',
                    textShadow: '0 0 8px rgba(56,189,248,0.5)',
                  }}
                >
                  Se connecter
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default Register

