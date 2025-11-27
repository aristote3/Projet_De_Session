import React, { useState } from 'react'
import { Button, Typography, Row, Col, Card, Space, Divider, Collapse, Carousel } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  CalendarOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  MenuOutlined,
  DownOutlined,
  RightOutlined,
  CheckOutlined,
  UserOutlined,
  GlobalOutlined,
  ApiOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const Home = () => {
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const { isDarkMode, theme } = useTheme()

  const products = [
    {
      image: '/images/gestion-ressources.jpg',
      title: 'GESTION DE RESSOURCES',
      description: 'Gérez efficacement tous vos types de ressources : salles de réunion, salles de conférence, espaces de coworking, laboratoires, studios, équipements audiovisuels, véhicules de service, matériel informatique, machines-outils, espaces de stockage, terrains de sport, piscines, courts de tennis, et bien plus encore.',
      link: '/resources',
    },
    {
      image: '/images/reserver-maintenant.jpeg',
      title: 'RÉSERVATION DE SERVICES',
      description: 'Organisez la réservation de services variés : consultations professionnelles, prestations de maintenance, services de nettoyage, interventions techniques, formations, coaching, services de traduction, services de livraison, créneaux de consultation médicale, services vétérinaires, et tous vos services personnalisés.',
      link: '/services',
    },
    {
      image: '/images/crenneaux.jpeg',
      title: 'GESTION DE CRÉNEAUX',
      description: 'Optimisez l\'utilisation de vos créneaux horaires : plages de disponibilité, horaires d\'ouverture, créneaux de consultation, sessions de formation, périodes de maintenance, créneaux de support client, disponibilités d\'experts, horaires de livraison, et toute autre gestion temporelle.',
      link: '/slots',
    },
  ]

  const features = [
    {
      icon: <GlobalOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: 'Intégrations',
      description: 'YouManage s\'intègre avec les passerelles de paiement, les constructeurs de sites web, les réseaux sociaux, le e-commerce, l\'email, les calendriers, la comptabilité et plus encore.',
    },
    {
      icon: <PlayCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: 'Canaux de Distribution',
      description: 'Soyez trouvé par plus de prospects sur les principaux canaux de distribution et OTA qui vous aident à optimiser les revenus, stimuler les réservations et maximiser la rentabilité.',
    },
    {
      icon: <ApiOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: 'API Développeur',
      description: 'Avec l\'API YouManage, les développeurs peuvent étendre les capacités de la plateforme de réservation et l\'intégrer avec des services externes et des processus métier.',
    },
  ]

  const stats = [
    { number: '37', unit: 'milliards', label: 'de revenus de réservation clients' },
    { number: '104', unit: 'millions', label: 'de réservations traitées' },
    { number: '42', unit: 'mille', label: 'd\'utilisateurs actifs' },
  ]

  const testimonials = [
    {
      text: 'YouManage est l\'une des meilleures solutions de gestion de ressources que j\'ai connues jusqu\'à présent. Pourquoi ? Parce qu\'ils ont réussi. C\'est aussi simple que ça. 9/10. Non seulement ils ont les outils de base comme la création ou l\'importation d\'une base de données clients, la création d\'horaires et la gestion d\'un calendrier, mais YouManage dispose également d\'une section très complète pour la gestion des ressources.',
      author: '- Getapp',
    },
    {
      text: 'L\'application est un mélange quasi parfait de simplicité et de fonctionnalité robuste. YouManage offre un ensemble de fonctionnalités assez substantiel. Ses capacités les plus remarquables concernent sa gestion flexible des ressources, bien qu\'il soit également remarquablement flexible dans les options de planification, crée d\'excellents rapports et prend en charge les utilisateurs internationaux.',
      author: '- Merchant Maverick',
    },
  ]

  const faqItems = [
    {
      key: '1',
      label: 'Qu\'est-ce que YouManage ?',
      children: (
        <div>
          <p>YouManage est une plateforme générique de réservation permettant aux organisations de gérer la réservation de ressources (salles, équipements, services, créneaux). Le système offre une interface intuitive pour les utilisateurs et des outils d'administration complets pour les gestionnaires.</p>
          <p>Que vous gériez des salles de réunion, des équipements techniques, des véhicules, des espaces de coworking, des laboratoires, des services de consultation, ou tout autre type de ressource, YouManage s'adapte à vos besoins spécifiques.</p>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Quels types de ressources puis-je gérer avec YouManage ?',
      children: (
        <div>
          <p>YouManage vous permet de gérer une grande variété de ressources :</p>
          <ul>
            <li><strong>Espaces</strong> : salles de réunion, salles de conférence, espaces de coworking, laboratoires, studios, amphithéâtres, salles de sport, piscines, terrains</li>
            <li><strong>Équipements</strong> : matériel audiovisuel, machines-outils, équipements informatiques, véhicules de service, matériel médical, instruments de mesure</li>
            <li><strong>Services</strong> : consultations, formations, maintenance, nettoyage, livraison, support technique, services vétérinaires</li>
            <li><strong>Créneaux</strong> : horaires de disponibilité, plages de consultation, sessions de formation, périodes de maintenance</li>
          </ul>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Quels sont les avantages de YouManage ?',
      children: (
        <div>
          <p>YouManage vous permet de :</p>
          <ul>
            <li>Centraliser la gestion de toutes vos ressources en un seul endroit</li>
            <li>Éviter les doubles réservations et les conflits automatiquement</li>
            <li>Optimiser l'utilisation de vos ressources avec des rapports détaillés</li>
            <li>Gérer les permissions et les approbations selon vos règles métier</li>
            <li>Automatiser les rappels et notifications</li>
            <li>Offrir une interface intuitive à vos utilisateurs</li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: isDarkMode ? '#020617' : '#fff', transition: 'background 0.3s ease' }}>
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
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
          <div 
            style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: isDarkMode ? '#38bdf8' : '#1890ff', 
              cursor: 'pointer',
              textShadow: isDarkMode ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none',
            }} 
            onClick={() => navigate('/home')}
          >
            ✨ YouManage
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'nowrap' }}>
            <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('/home'); }}
                style={{ color: isDarkMode ? '#e2e8f0' : '#000', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}
              >
                Accueil
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}
                style={{ color: isDarkMode ? '#e2e8f0' : '#000', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}
              >
                Tarifs
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate('/news'); }}
                style={{ color: isDarkMode ? '#e2e8f0' : '#000', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}
              >
                Actualités
              </a>
            </Space>
            <Space style={{ flexShrink: 0 }}>
              <ThemeToggle />
              <Button 
                type="text" 
                onClick={() => navigate('/login')}
                style={{ color: isDarkMode ? '#e2e8f0' : undefined }}
              >
                Se connecter
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                Essai gratuit
              </Button>
            </Space>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          padding: '100px 20px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={1} style={{ color: 'white', fontSize: 48, marginBottom: 24 }}>
            Plateforme de réservation pour gérer toutes vos ressources
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 40 }}>
            YouManage est une plateforme générique de réservation permettant aux organisations de gérer la réservation de ressources (salles, équipements, services, créneaux). Le système offre une interface intuitive pour les utilisateurs et des outils d'administration complets pour les gestionnaires. Gérez efficacement vos espaces, matériels, véhicules, services et créneaux horaires en un seul endroit.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{ height: 50, paddingLeft: 40, paddingRight: 40, fontSize: 16, background: '#fff', color: '#1890ff', border: 'none' }}
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/register')}
          >
            Essayer gratuitement
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section style={{ padding: '80px 20px', background: isDarkMode ? '#0f172a' : '#f5f5f5', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            {products.map((product, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  hoverable
                  cover={
                    <div
                      style={{
                        height: 250,
                        backgroundImage: product.image && product.image.startsWith('/') 
                          ? `url(${product.image})` 
                          : `linear-gradient(135deg, #1890ff 0%, #096dd9 100%)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 'bold',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {product.image && product.image.startsWith('/') ? (
                        <>
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))',
                            }}
                          />
                          <div
                            style={{
                              position: 'relative',
                              zIndex: 1,
                              textAlign: 'center',
                              padding: '20px',
                            }}
                          >
                            <span style={{ 
                              textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
                              fontSize: 20,
                              fontWeight: 'bold',
                              letterSpacing: '1px',
                            }}>
                              {product.title}
                            </span>
                          </div>
                        </>
                      ) : (
                        product.title
                      )}
                    </div>
                  }
                  style={{ height: '100%', borderRadius: 8, overflow: 'hidden' }}
                >
                  <Title level={4}>{product.title}</Title>
                  <Paragraph type="secondary">{product.description}</Paragraph>
                  <Button type="link" icon={<ArrowRightOutlined />}>
                    EN SAVOIR PLUS
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section 1 */}
      <section style={{ padding: '80px 20px', background: isDarkMode ? '#020617' : '#fff', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2} style={{ color: isDarkMode ? '#e2e8f0' : undefined }}>Gérez tous vos types de ressources</Title>
              <Paragraph style={{ fontSize: 16, marginBottom: 24, color: isDarkMode ? '#94a3b8' : undefined }}>
                Que vous gériez des salles de réunion, des équipements techniques, des véhicules de service, des espaces de coworking, des laboratoires, des studios, des terrains de sport, ou tout autre type de ressource, YouManage s'adapte à vos besoins. Centralisez la gestion de vos espaces physiques, matériels, services et créneaux horaires.
              </Paragraph>
              <Paragraph style={{ fontSize: 16, marginBottom: 24, color: isDarkMode ? '#94a3b8' : undefined }}>
                Optimisez l'utilisation de vos ressources avec des outils intelligents : vérification automatique de disponibilité, gestion des conflits, listes d'attente, approbations multi-niveaux, et rapports détaillés d'utilisation avec YouManage.
              </Paragraph>
              <Button type="link" size="large" onClick={() => navigate('/login')}>
                Commencer →
              </Button>
            </Col>
            <Col xs={24} lg={12}>
              <div
                style={{
                  height: 400,
                  backgroundImage: 'url(/images/tableau_bord.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ 
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                    fontWeight: 'bold',
                    zIndex: 1,
                    position: 'relative',
                  }}>
                    Aperçu du Tableau de bord
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section 2 */}
      <section style={{ padding: '80px 20px', background: isDarkMode ? '#0f172a' : '#f5f5f5', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12} order={2} order-lg={1}>
              <div
                style={{
                  height: 400,
                  backgroundImage: 'url(/images/payement-calendrier.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ 
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                    fontWeight: 'bold',
                    zIndex: 1,
                    position: 'relative',
                  }}>
                    Calendrier & Paiements
                  </span>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12} order={1} order-lg={2}>
              <Title level={2} style={{ color: isDarkMode ? '#e2e8f0' : undefined }}>Suivez toutes vos réservations en temps réel</Title>
              <Paragraph style={{ fontSize: 16, marginBottom: 24, color: isDarkMode ? '#94a3b8' : undefined }}>
                Visualisez en un coup d'œil l'état de toutes vos ressources : quelles salles sont occupées, quels équipements sont disponibles, quels véhicules sont en service, quels créneaux sont libres. Votre tableau de bord se met à jour automatiquement à chaque réservation, annulation ou modification.
              </Paragraph>
              <Paragraph style={{ fontSize: 16, marginBottom: 24, color: isDarkMode ? '#94a3b8' : undefined }}>
                Gérez les réservations de multiples façons : en ligne 24/7, par téléphone, en personne, ou via l'application mobile. Le système gère automatiquement les conflits, les chevauchements et les disponibilités selon vos règles métier personnalisées.
              </Paragraph>
              <Button type="link" size="large" onClick={() => navigate('/login')}>
                Commencer →
              </Button>
            </Col>
          </Row>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 20px', background: isDarkMode ? '#020617' : '#fff', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              borderRadius: 8,
              padding: 40,
              color: 'white',
            }}
          >
            <Title level={2} style={{ color: 'white', textAlign: 'center', marginBottom: 40 }}>
              Tarification simple. Pas de frais cachés.
            </Title>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4} style={{ color: 'white' }}>Pas de frais pour les clients</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  YouManage ne facture pas de frais supplémentaires à vos clients. Le prix que vous fixez est le prix que votre client paie.
                </Text>
              </div>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
              <div>
                <Title level={4} style={{ color: 'white' }}>Pas de commissions, pas de frais sur les réservations</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  YouManage ne facture pas de commissions ni de frais fixes sur les réservations.
                </Text>
              </div>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
              <div>
                <Title level={4} style={{ color: 'white' }}>Pas de contrat d'engagement</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Profitez de la liberté d'un contrat sans engagement avec la commodité d'un abonnement mensuel.
                </Text>
              </div>
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Button
                  type="primary"
                  size="large"
                  style={{ background: '#fff', color: '#1890ff', border: 'none', height: 50, paddingLeft: 40, paddingRight: 40 }}
                  onClick={() => navigate('/login')}
                >
                  Commencer →
                </Button>
              </div>
            </Space>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          padding: '80px 20px',
          color: 'white',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ color: 'white', marginBottom: 60 }}>
            Une solution pour tous les types d'organisations
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 60 }}>
            YouManage est utilisé par des entreprises de toutes tailles, des établissements d'enseignement, des administrations publiques, des hôpitaux, des associations, et bien d'autres organisations. Que vous gériez 10 ressources ou 10 000, notre plateforme s'adapte à vos besoins et évolue avec vous.
          </Paragraph>
          <Row gutter={[48, 48]}>
            {stats.map((stat, index) => (
              <Col xs={24} md={8} key={index}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={1} style={{ color: 'white', fontSize: 64, margin: 0 }}>
                    {stat.number}
                  </Title>
                  <Title level={3} style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0' }}>
                    {stat.unit}
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                    {stat.label}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Expand Business Section */}
      <section style={{ padding: '80px 20px', background: isDarkMode ? '#0f172a' : '#f5f5f5', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ color: isDarkMode ? '#e2e8f0' : undefined }}>Adaptez YouManage à votre organisation</Title>
          <Paragraph style={{ fontSize: 16, marginBottom: 60, color: isDarkMode ? '#94a3b8' : undefined }}>
            Que vous soyez une entreprise, une école, un hôpital, une collectivité, une association ou toute autre organisation, YouManage s'adapte à votre contexte. Configurez vos ressources, définissez vos règles d'utilisation, gérez les permissions et automatisez vos processus de réservation.
          </Paragraph>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card style={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  borderRadius: 8,
                  background: isDarkMode ? '#1e293b' : '#fff',
                  borderColor: isDarkMode ? '#334155' : undefined,
                }}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {feature.icon}
                    <Title level={4} style={{ color: isDarkMode ? '#e2e8f0' : undefined }}>{feature.title}</Title>
                    <Paragraph style={{ color: isDarkMode ? '#94a3b8' : undefined }}>{feature.description}</Paragraph>
                    <Button type="link">En savoir plus →</Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '80px 20px', background: isDarkMode ? '#020617' : '#fff', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={2} style={{ color: isDarkMode ? '#e2e8f0' : undefined }}>Témoignages de nos utilisateurs</Title>
            <Paragraph style={{ fontSize: 16, color: isDarkMode ? '#94a3b8' : undefined }}>
              Des organisations de tous secteurs font confiance à YouManage pour gérer leurs ressources efficacement.
            </Paragraph>
          </div>
          <Carousel autoplay>
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <Card style={{ 
                  textAlign: 'center', 
                  padding: 40,
                  background: isDarkMode ? '#1e293b' : '#fff',
                  borderColor: isDarkMode ? '#334155' : undefined,
                }}>
                  <Paragraph style={{ fontSize: 18, fontStyle: 'italic', marginBottom: 24, color: isDarkMode ? '#e2e8f0' : undefined }}>
                    "{testimonial.text}"
                  </Paragraph>
                  <Text strong style={{ color: isDarkMode ? '#38bdf8' : undefined }}>{testimonial.author}</Text>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          padding: '80px 20px',
          color: 'white',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ color: 'white' }}>
            Commencez à gérer vos ressources dès aujourd'hui
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 40 }}>
            Découvrez comment YouManage peut transformer la gestion de vos ressources. Que vous ayez besoin de gérer des salles, équipements, véhicules, services ou créneaux, notre plateforme vous offre tous les outils nécessaires.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{ height: 50, paddingLeft: 40, paddingRight: 40, fontSize: 16, background: '#fff', color: '#1890ff', border: 'none' }}
            onClick={() => navigate('/register')}
          >
            Essayer gratuitement
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 20px', background: isDarkMode ? '#0f172a' : '#f5f5f5', transition: 'background 0.3s ease' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40, color: isDarkMode ? '#e2e8f0' : undefined }}>
            FAQ
          </Title>
          <Collapse
            items={faqItems}
            style={{ 
              background: isDarkMode ? '#1e293b' : '#fff',
              borderColor: isDarkMode ? '#334155' : undefined,
            }}
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} style={{ color: isDarkMode ? '#94a3b8' : undefined }} />}
          />
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: isDarkMode ? '#020617' : '#001529',
          color: 'rgba(255,255,255,0.65)',
          padding: '60px 20px 20px',
          borderTop: isDarkMode ? '1px solid #334155' : 'none',
          transition: 'background 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[48, 48]}>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
                Produits
              </Title>
              <Space direction="vertical" size="small">
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Planification de rendez-vous</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Classes & Cours</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Visites & Activités</a>
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
                Entreprise
              </Title>
              <Space direction="vertical" size="small">
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>À propos</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Actualités</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Nous contacter</a>
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
                Technique
              </Title>
              <Space direction="vertical" size="small">
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Intégrations</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>API</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Support</a>
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
                Industries
              </Title>
              <Space direction="vertical" size="small">
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Salon</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Yoga</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Visites</a>
              </Space>
            </Col>
          </Row>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '40px 0 20px' }} />
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
            <Text>© 2025 YouManage - Système de Gestion de Réservations</Text>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
