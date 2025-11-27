import React, { useState } from 'react'
import { Typography, Row, Col, Card, Button, Space, Tag, Input, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  TagOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

dayjs.locale('fr')

const { Title, Paragraph, Text } = Typography
const { Search } = Input

const News = () => {
  const navigate = useNavigate()
  const { isDarkMode, theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample news articles
  const articles = [
    {
      id: 1,
      title: 'Nouveau: Mode sombre disponible!',
      excerpt: 'Découvrez notre nouveau mode sombre pour une expérience visuelle plus confortable. Basculez entre les thèmes en un clic depuis n\'importe quelle page.',
      content: 'Nous sommes ravis d\'annoncer le lancement de notre mode sombre tant attendu...',
      image: '🌙',
      category: 'Nouveautés',
      author: 'Équipe YouManage',
      date: '2025-11-27',
      readTime: 3,
      featured: true,
    },
    {
      id: 2,
      title: 'Plan interactif des ressources',
      excerpt: 'Visualisez toutes vos ressources sur un plan interactif. Cliquez pour voir les disponibilités et réserver instantanément.',
      content: 'Le nouveau plan interactif vous permet de visualiser...',
      image: '🗺️',
      category: 'Fonctionnalités',
      author: 'Équipe YouManage',
      date: '2025-11-25',
      readTime: 4,
      featured: true,
    },
    {
      id: 3,
      title: 'Messagerie et diffusion pour managers',
      excerpt: 'Les managers peuvent maintenant envoyer des messages à tous leurs utilisateurs par SMS, email ou notification in-app.',
      content: 'La nouvelle fonctionnalité de diffusion permet aux managers...',
      image: '📢',
      category: 'Fonctionnalités',
      author: 'Équipe YouManage',
      date: '2025-11-24',
      readTime: 5,
    },
    {
      id: 4,
      title: '5 astuces pour optimiser vos réservations',
      excerpt: 'Découvrez nos conseils pour tirer le meilleur parti de YouManage et gagner du temps dans la gestion de vos ressources.',
      content: 'Astuce 1: Utilisez les filtres pour trouver rapidement...',
      image: '💡',
      category: 'Astuces',
      author: 'Équipe YouManage',
      date: '2025-11-22',
      readTime: 6,
    },
    {
      id: 5,
      title: 'Demande de rôle Manager simplifiée',
      excerpt: 'Les utilisateurs peuvent maintenant demander le rôle Manager directement lors de l\'inscription. Les admins approuvent en un clic.',
      content: 'Le nouveau flux d\'inscription permet aux utilisateurs...',
      image: '👥',
      category: 'Mises à jour',
      author: 'Équipe YouManage',
      date: '2025-11-20',
      readTime: 3,
    },
    {
      id: 6,
      title: 'Templates d\'emails améliorés',
      excerpt: 'Nos emails de confirmation et de rappel ont été redesignés pour une meilleure lisibilité et une expérience plus professionnelle.',
      content: 'Les nouveaux templates d\'emails incluent...',
      image: '📧',
      category: 'Mises à jour',
      author: 'Équipe YouManage',
      date: '2025-11-18',
      readTime: 2,
    },
  ]

  const categories = [
    { key: 'all', label: 'Tous', color: 'default' },
    { key: 'Nouveautés', label: 'Nouveautés', color: 'green' },
    { key: 'Fonctionnalités', label: 'Fonctionnalités', color: 'blue' },
    { key: 'Mises à jour', label: 'Mises à jour', color: 'purple' },
    { key: 'Astuces', label: 'Astuces', color: 'orange' },
  ]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticles = articles.filter(a => a.featured)

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.key === category)
    return cat ? cat.color : 'default'
  }

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
        padding: '60px 20px 40px',
        textAlign: 'center',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title style={{ 
            fontSize: 48, 
            marginBottom: 16,
            color: isDarkMode ? '#e2e8f0' : undefined,
          }}>
            📰 Actualités
          </Title>
          <Paragraph style={{ 
            fontSize: 18, 
            marginBottom: 32,
            color: isDarkMode ? '#94a3b8' : '#666',
          }}>
            Restez informé des dernières nouveautés, fonctionnalités et astuces YouManage
          </Paragraph>

          {/* Search */}
          <Search
            placeholder="Rechercher un article..."
            allowClear
            size="large"
            style={{ maxWidth: 500 }}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Categories */}
      <section style={{ 
        padding: '24px 20px',
        background: isDarkMode ? '#020617' : '#fff',
        borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f0f0f0'}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Space wrap>
            {categories.map(cat => (
              <Button
                key={cat.key}
                type={selectedCategory === cat.key ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  borderRadius: 20,
                  ...(selectedCategory !== cat.key && isDarkMode && {
                    background: '#1e293b',
                    borderColor: '#334155',
                    color: '#e2e8f0',
                  }),
                }}
              >
                {cat.label}
              </Button>
            ))}
          </Space>
        </div>
      </section>

      {/* Featured Articles */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <section style={{ 
          padding: '40px 20px',
          background: isDarkMode ? '#0f172a' : '#f9fafb',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Title level={3} style={{ marginBottom: 24, color: isDarkMode ? '#e2e8f0' : undefined }}>
              ⭐ À la une
            </Title>
            <Row gutter={[24, 24]}>
              {featuredArticles.map((article, index) => (
                <Col xs={24} md={12} key={article.id}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      background: isDarkMode ? '#1e293b' : '#fff',
                      borderColor: isDarkMode ? '#334155' : undefined,
                      borderRadius: 16,
                      overflow: 'hidden',
                    }}
                    bodyStyle={{ padding: 24 }}
                  >
                    <div style={{ 
                      fontSize: 64, 
                      textAlign: 'center', 
                      marginBottom: 16,
                      background: isDarkMode ? '#0f172a' : '#f0f9ff',
                      borderRadius: 12,
                      padding: 24,
                    }}>
                      {article.image}
                    </div>
                    <Tag color={getCategoryColor(article.category)}>{article.category}</Tag>
                    <Title level={4} style={{ marginTop: 12, color: isDarkMode ? '#e2e8f0' : undefined }}>
                      {article.title}
                    </Title>
                    <Paragraph style={{ color: isDarkMode ? '#94a3b8' : '#666' }}>
                      {article.excerpt}
                    </Paragraph>
                    <Space style={{ color: isDarkMode ? '#64748b' : '#999' }}>
                      <CalendarOutlined /> {dayjs(article.date).format('DD MMM YYYY')}
                      <span>•</span>
                      <ClockCircleOutlined /> {article.readTime} min
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section style={{ 
        padding: '40px 20px',
        background: isDarkMode ? '#020617' : '#fff',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={3} style={{ marginBottom: 24, color: isDarkMode ? '#e2e8f0' : undefined }}>
            {selectedCategory === 'all' ? '📚 Tous les articles' : `📂 ${selectedCategory}`}
          </Title>

          {filteredArticles.length === 0 ? (
            <Empty 
              description={
                <Text style={{ color: isDarkMode ? '#94a3b8' : undefined }}>
                  Aucun article trouvé
                </Text>
              }
            />
          ) : (
            <Row gutter={[24, 24]}>
              {filteredArticles.map((article) => (
                <Col xs={24} sm={12} lg={8} key={article.id}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      background: isDarkMode ? '#1e293b' : '#fff',
                      borderColor: isDarkMode ? '#334155' : undefined,
                      borderRadius: 12,
                    }}
                    bodyStyle={{ padding: 20 }}
                  >
                    <div style={{ 
                      fontSize: 48, 
                      textAlign: 'center', 
                      marginBottom: 16,
                      background: isDarkMode ? '#0f172a' : '#f5f5f5',
                      borderRadius: 8,
                      padding: 16,
                    }}>
                      {article.image}
                    </div>
                    <Space style={{ marginBottom: 8 }}>
                      <Tag color={getCategoryColor(article.category)}>{article.category}</Tag>
                    </Space>
                    <Title level={5} style={{ margin: '8px 0', color: isDarkMode ? '#e2e8f0' : undefined }}>
                      {article.title}
                    </Title>
                    <Paragraph 
                      ellipsis={{ rows: 2 }}
                      style={{ color: isDarkMode ? '#94a3b8' : '#666', marginBottom: 12 }}
                    >
                      {article.excerpt}
                    </Paragraph>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: `1px solid ${isDarkMode ? '#334155' : '#f0f0f0'}`,
                      paddingTop: 12,
                      marginTop: 12,
                    }}>
                      <Text style={{ fontSize: 12, color: isDarkMode ? '#64748b' : '#999' }}>
                        <CalendarOutlined /> {dayjs(article.date).format('DD/MM/YYYY')}
                      </Text>
                      <Button type="link" size="small" icon={<ArrowRightOutlined />}>
                        Lire
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
            📬 Restez informé
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 32 }}>
            Inscrivez-vous à notre newsletter pour recevoir les dernières actualités
          </Paragraph>
          <Space.Compact style={{ width: '100%', maxWidth: 400 }}>
            <Input 
              placeholder="Votre email" 
              size="large"
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button type="primary" size="large" style={{ background: '#fff', color: '#1890ff', borderRadius: '0 8px 8px 0' }}>
              S'inscrire
            </Button>
          </Space.Compact>
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
          © 2025 YouManage - Système de Gestion de Réservations
        </Text>
      </footer>
    </div>
  )
}

export default News

