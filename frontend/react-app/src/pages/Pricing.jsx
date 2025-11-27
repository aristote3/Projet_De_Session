import React, { useState } from 'react'
import { Typography, Row, Col, Card, Button, Space, Tag, Divider, Switch, List, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  CheckOutlined,
  CloseOutlined,
  CrownOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

const { Title, Paragraph, Text } = Typography

const Pricing = () => {
  const navigate = useNavigate()
  const { isDarkMode, theme } = useTheme()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      icon: <RocketOutlined style={{ fontSize: 32 }} />,
      price: 0,
      priceAnnual: 0,
      unit: '',
      description: 'Parfait pour démarrer',
      color: '#52c41a',
      popular: false,
      features: [
        { text: 'Jusqu\'à 3 ressources', included: true },
        { text: '50 réservations/mois', included: true },
        { text: '1 compte manager', included: true },
        { text: '25 utilisateurs max', included: true },
        { text: 'Notifications email', included: true },
        { text: 'Support par email', included: true },
        { text: 'Notifications SMS', included: false },
        { text: 'Rapports avancés', included: false },
        { text: 'Accès API', included: false },
        { text: 'Personnalisation', included: false },
      ],
      cta: 'Commencer gratuitement',
      ctaType: 'default',
    },
    {
      name: 'Pro',
      icon: <ThunderboltOutlined style={{ fontSize: 32 }} />,
      price: 4.99,
      priceAnnual: 3.99,
      unit: '/ressource/mois',
      description: 'Pour les équipes en croissance',
      color: '#1890ff',
      popular: true,
      features: [
        { text: 'Jusqu\'à 20 ressources', included: true },
        { text: 'Réservations illimitées', included: true },
        { text: '3 comptes manager', included: true },
        { text: '100 utilisateurs max', included: true },
        { text: 'Notifications email', included: true },
        { text: 'Notifications SMS', included: true },
        { text: 'Rapports avancés', included: true },
        { text: 'Support email + chat', included: true },
        { text: 'Accès API', included: false },
        { text: 'Personnalisation logo', included: true },
      ],
      cta: 'Choisir Pro',
      ctaType: 'primary',
    },
    {
      name: 'Business',
      icon: <StarOutlined style={{ fontSize: 32 }} />,
      price: 3.49,
      priceAnnual: 2.79,
      unit: '/ressource/mois',
      description: 'Pour les grandes organisations',
      color: '#722ed1',
      popular: false,
      features: [
        { text: 'Jusqu\'à 50 ressources', included: true },
        { text: 'Réservations illimitées', included: true },
        { text: '10 comptes manager', included: true },
        { text: '500 utilisateurs max', included: true },
        { text: 'Notifications email + SMS', included: true },
        { text: 'Rapports complets', included: true },
        { text: 'Support prioritaire', included: true },
        { text: 'Accès API complet', included: true, highlight: true },
        { text: 'Personnalisation complète', included: true },
        { text: 'SLA 99.5%', included: true },
      ],
      cta: 'Choisir Business',
      ctaType: 'primary',
    },
    {
      name: 'Entreprise',
      icon: <CrownOutlined style={{ fontSize: 32 }} />,
      price: 149,
      priceAnnual: 119,
      unit: '/mois',
      description: 'Ressources illimitées',
      color: '#faad14',
      popular: false,
      unlimited: true,
      features: [
        { text: 'Ressources ILLIMITÉES', included: true, highlight: true },
        { text: 'Réservations illimitées', included: true },
        { text: 'Managers illimités', included: true },
        { text: 'Utilisateurs illimités', included: true },
        { text: 'Toutes les notifications', included: true },
        { text: 'Rapports personnalisés', included: true },
        { text: 'Support dédié 24/7', included: true, highlight: true },
        { text: 'Accès API avancé', included: true },
        { text: 'Personnalisation sur mesure', included: true },
        { text: 'SLA 99.9%', included: true },
      ],
      cta: 'Contacter les ventes',
      ctaType: 'primary',
    },
  ]

  const faqs = [
    {
      question: 'Comment fonctionne la facturation par ressource?',
      answer: 'Vous payez uniquement pour le nombre de ressources que vous gérez. Par exemple, avec le plan Pro et 10 ressources, vous payez 10 × $4.99 = $49.90/mois.',
    },
    {
      question: 'Puis-je changer de plan à tout moment?',
      answer: 'Oui! Vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et sont proratisés.',
    },
    {
      question: 'Y a-t-il des frais cachés?',
      answer: 'Non, aucun frais caché. Le prix affiché est le prix que vous payez. Pas de commissions sur les réservations.',
    },
    {
      question: 'Qu\'est-ce que l\'accès API?',
      answer: 'L\'API vous permet d\'intégrer YouManage avec vos propres systèmes: site web, application mobile, CRM, ou outils d\'automatisation.',
    },
  ]

  const currentPrice = (plan) => isAnnual ? plan.priceAnnual : plan.price

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDarkMode ? '#020617' : '#fff',
      transition: 'background 0.3s ease',
    }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: isDarkMode ? '#0f172a' : '#fff',
          boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 24px',
          borderBottom: isDarkMode ? '1px solid #334155' : 'none',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/home')}
              style={{ color: isDarkMode ? '#e2e8f0' : undefined }}
            >
              Retour
            </Button>
            <div 
              style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                color: isDarkMode ? '#38bdf8' : '#1890ff',
                cursor: 'pointer',
              }} 
              onClick={() => navigate('/home')}
            >
              ✨ YouManage
            </div>
          </div>
          <Space>
            <ThemeToggle />
            <Button type="text" onClick={() => navigate('/login')} style={{ color: isDarkMode ? '#e2e8f0' : undefined }}>
              Se connecter
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Essai gratuit
            </Button>
          </Space>
        </div>
      </header>

      {/* Hero */}
      <section style={{ 
        padding: '80px 20px 40px',
        textAlign: 'center',
        background: isDarkMode ? '#020617' : '#fff',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title style={{ 
            fontSize: 48, 
            marginBottom: 16,
            color: isDarkMode ? '#e2e8f0' : undefined,
          }}>
            💎 Tarifs simples et transparents
          </Title>
          <Paragraph style={{ 
            fontSize: 18, 
            marginBottom: 32,
            color: isDarkMode ? '#94a3b8' : '#666',
          }}>
            Payez uniquement pour les ressources que vous gérez.<br />
            Pas de frais cachés. Pas de commissions.
          </Paragraph>

          {/* Annual Toggle */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '12px 24px',
            background: isDarkMode ? '#1e293b' : '#f5f5f5',
            borderRadius: 30,
          }}>
            <Text style={{ color: !isAnnual ? (isDarkMode ? '#38bdf8' : '#1890ff') : (isDarkMode ? '#94a3b8' : '#666') }}>
              Mensuel
            </Text>
            <Switch checked={isAnnual} onChange={setIsAnnual} />
            <Text style={{ color: isAnnual ? (isDarkMode ? '#38bdf8' : '#1890ff') : (isDarkMode ? '#94a3b8' : '#666') }}>
              Annuel
            </Text>
            {isAnnual && (
              <Tag color="green">Économisez 20%</Tag>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '40px 20px 80px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Row gutter={[24, 24]} justify="center">
            {plans.map((plan, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    height: '100%',
                    borderRadius: 16,
                    border: plan.popular 
                      ? `2px solid ${plan.color}` 
                      : `1px solid ${isDarkMode ? '#334155' : '#e5e5e5'}`,
                    background: isDarkMode ? '#1e293b' : '#fff',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: plan.color,
                      color: '#fff',
                      padding: '4px 16px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                      ⭐ POPULAIRE
                    </div>
                  )}

                  {plan.unlimited && (
                    <div style={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #faad14 0%, #fa8c16 100%)',
                      color: '#fff',
                      padding: '4px 16px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                      ♾️ ILLIMITÉ
                    </div>
                  )}

                  <div style={{ textAlign: 'center', marginBottom: 24, marginTop: plan.popular || plan.unlimited ? 8 : 0 }}>
                    <div style={{ color: plan.color, marginBottom: 8 }}>
                      {plan.icon}
                    </div>
                    <Title level={4} style={{ margin: 0, color: isDarkMode ? '#e2e8f0' : undefined }}>
                      {plan.name}
                    </Title>
                    <Text style={{ color: isDarkMode ? '#94a3b8' : '#666' }}>
                      {plan.description}
                    </Text>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    {plan.price === 0 ? (
                      <div>
                        <span style={{ fontSize: 48, fontWeight: 'bold', color: isDarkMode ? '#e2e8f0' : undefined }}>
                          Gratuit
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: 16, color: isDarkMode ? '#94a3b8' : '#666' }}>$</span>
                        <span style={{ fontSize: 48, fontWeight: 'bold', color: isDarkMode ? '#e2e8f0' : undefined }}>
                          {currentPrice(plan).toFixed(2)}
                        </span>
                        <span style={{ fontSize: 14, color: isDarkMode ? '#94a3b8' : '#666' }}>
                          {' '}{plan.unit}
                        </span>
                      </div>
                    )}
                    {plan.price > 0 && !plan.unlimited && (
                      <Text style={{ fontSize: 12, color: isDarkMode ? '#64748b' : '#999' }}>
                        CAD, facturé {isAnnual ? 'annuellement' : 'mensuellement'}
                      </Text>
                    )}
                  </div>

                  <Button
                    type={plan.ctaType}
                    block
                    size="large"
                    onClick={() => navigate('/register')}
                    style={{
                      marginBottom: 24,
                      height: 48,
                      borderRadius: 8,
                      ...(plan.popular && {
                        background: plan.color,
                        borderColor: plan.color,
                      }),
                    }}
                  >
                    {plan.cta}
                  </Button>

                  <List
                    size="small"
                    dataSource={plan.features}
                    renderItem={(feature) => (
                      <List.Item style={{ 
                        border: 'none', 
                        padding: '6px 0',
                      }}>
                        <Space>
                          {feature.included ? (
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          ) : (
                            <CloseOutlined style={{ color: isDarkMode ? '#475569' : '#d9d9d9' }} />
                          )}
                          <Text style={{ 
                            color: feature.included 
                              ? (isDarkMode ? '#e2e8f0' : '#333')
                              : (isDarkMode ? '#475569' : '#999'),
                            fontWeight: feature.highlight ? 600 : 400,
                          }}>
                            {feature.text}
                            {feature.highlight && ' ⭐'}
                          </Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ 
        padding: '60px 20px',
        background: isDarkMode ? '#0f172a' : '#f5f5f5',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ color: isDarkMode ? '#e2e8f0' : undefined }}>
            💡 Exemples de tarification
          </Title>
          <Paragraph style={{ color: isDarkMode ? '#94a3b8' : '#666', marginBottom: 32 }}>
            Estimez votre coût mensuel selon vos besoins
          </Paragraph>

          <Row gutter={[24, 24]}>
            {[
              { resources: 5, plan: 'Pro', price: 5 * (isAnnual ? 3.99 : 4.99) },
              { resources: 10, plan: 'Pro', price: 10 * (isAnnual ? 3.99 : 4.99) },
              { resources: 25, plan: 'Business', price: 25 * (isAnnual ? 2.79 : 3.49) },
              { resources: '100+', plan: 'Entreprise', price: isAnnual ? 119 : 149, unlimited: true },
            ].map((example, index) => (
              <Col xs={12} md={6} key={index}>
                <Card style={{ 
                  background: isDarkMode ? '#1e293b' : '#fff',
                  borderColor: isDarkMode ? '#334155' : undefined,
                }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: isDarkMode ? '#38bdf8' : '#1890ff' }}>
                    {example.resources}
                  </div>
                  <div style={{ color: isDarkMode ? '#94a3b8' : '#666', marginBottom: 8 }}>
                    ressources
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: isDarkMode ? '#e2e8f0' : undefined }}>
                    ${example.price.toFixed(2)}/mois
                  </div>
                  <Tag color={example.unlimited ? 'gold' : 'blue'}>
                    {example.plan}
                  </Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ 
        padding: '60px 20px',
        background: isDarkMode ? '#020617' : '#fff',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', color: isDarkMode ? '#e2e8f0' : undefined }}>
            ❓ Questions fréquentes
          </Title>
          
          <div style={{ marginTop: 32 }}>
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                style={{ 
                  marginBottom: 16,
                  background: isDarkMode ? '#1e293b' : '#f9f9f9',
                  borderColor: isDarkMode ? '#334155' : '#e5e5e5',
                }}
              >
                <Title level={5} style={{ margin: 0, color: isDarkMode ? '#e2e8f0' : undefined }}>
                  {faq.question}
                </Title>
                <Paragraph style={{ margin: '8px 0 0', color: isDarkMode ? '#94a3b8' : '#666' }}>
                  {faq.answer}
                </Paragraph>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
            Prêt à commencer?
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 32 }}>
            Essayez gratuitement pendant 14 jours. Aucune carte de crédit requise.
          </Paragraph>
          <Space size="large">
            <Button 
              size="large" 
              style={{ height: 50, paddingLeft: 32, paddingRight: 32 }}
              onClick={() => navigate('/register')}
            >
              Commencer gratuitement
            </Button>
            <Button 
              type="primary" 
              ghost 
              size="large"
              style={{ height: 50, paddingLeft: 32, paddingRight: 32, borderColor: '#fff', color: '#fff' }}
            >
              Contacter les ventes
            </Button>
          </Space>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: isDarkMode ? '#020617' : '#001529',
        color: 'rgba(255,255,255,0.65)',
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: isDarkMode ? '1px solid #334155' : 'none',
      }}>
        <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
          © 2025 YouManage - Tous les prix sont en dollars canadiens (CAD)
        </Text>
      </footer>
    </div>
  )
}

export default Pricing

