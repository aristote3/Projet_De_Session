import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, Space, Typography, Avatar, Badge, Tooltip } from 'antd'
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'

const { Text } = Typography

// FAQ responses database
const faqResponses = {
  // Greetings
  greetings: {
    keywords: ['bonjour', 'salut', 'hello', 'hi', 'coucou', 'hey', 'bonsoir'],
    response: "👋 Bonjour ! Je suis l'assistant YouManage. Comment puis-je vous aider aujourd'hui ?",
  },
  
  // Booking related
  howToBook: {
    keywords: ['réserver', 'réservation', 'book', 'comment réserver', 'faire une réservation'],
    response: "📅 Pour faire une réservation :\n\n1. Allez dans 'Ressources'\n2. Choisissez une ressource disponible\n3. Cliquez sur 'Réserver'\n4. Sélectionnez la date et l'heure\n5. Confirmez votre réservation\n\nVoulez-vous voir les ressources disponibles ?",
    action: { label: 'Voir les ressources', path: '/resources' },
  },
  
  // View bookings
  viewBookings: {
    keywords: ['mes réservations', 'voir réservations', 'my bookings', 'liste réservations'],
    response: "📋 Pour voir vos réservations, accédez à la section 'Mes réservations' dans le menu. Vous y trouverez toutes vos réservations passées et à venir.",
    action: { label: 'Mes réservations', path: '/bookings' },
  },
  
  // Cancel booking
  cancelBooking: {
    keywords: ['annuler', 'cancel', 'supprimer réservation', 'annulation'],
    response: "❌ Pour annuler une réservation :\n\n1. Allez dans 'Mes réservations'\n2. Trouvez la réservation à annuler\n3. Cliquez sur le bouton 'Annuler'\n4. Confirmez l'annulation\n\n⚠️ Attention aux politiques d'annulation !",
    action: { label: 'Mes réservations', path: '/bookings' },
  },
  
  // Calendar
  calendar: {
    keywords: ['calendrier', 'calendar', 'planning', 'horaires', 'disponibilité'],
    response: "📆 Le calendrier vous montre toutes les réservations et disponibilités. Vous pouvez filtrer par ressource et naviguer entre les semaines.",
    action: { label: 'Voir le calendrier', path: '/calendar' },
  },
  
  // Resources
  resources: {
    keywords: ['ressources', 'resources', 'salles', 'équipements', 'room', 'salle'],
    response: "🏢 YouManage gère plusieurs types de ressources :\n\n• Salles de réunion\n• Équipements\n• Véhicules\n• Espaces de travail\n\nChaque ressource a ses propres disponibilités et règles de réservation.",
    action: { label: 'Explorer les ressources', path: '/resources' },
  },
  
  // Floor plan
  floorPlan: {
    keywords: ['plan', 'carte', 'map', 'floor', 'visualiser', 'localisation'],
    response: "🗺️ Le plan interactif vous permet de visualiser toutes les ressources sur une carte. Cliquez sur une ressource pour voir ses détails et la réserver directement.",
    action: { label: 'Voir le plan', path: '/floor-plan' },
  },
  
  // Account
  account: {
    keywords: ['compte', 'profil', 'account', 'profile', 'paramètres', 'settings'],
    response: "👤 Pour gérer votre compte :\n\n• Profil : modifier vos informations\n• Notifications : gérer les alertes\n• Mot de passe : sécurité du compte\n\nAccédez à ces options depuis le menu.",
    action: { label: 'Mon profil', path: '/profile' },
  },
  
  // Pricing
  pricing: {
    keywords: ['prix', 'tarif', 'coût', 'pricing', 'abonnement', 'forfait'],
    response: "💰 YouManage propose plusieurs forfaits :\n\n• Starter : Gratuit (jusqu'à 3 ressources)\n• Pro : $4.99/ressource/mois\n• Business : $3.49/ressource/mois\n• Entreprise : $149/mois (illimité)\n\nTous les prix sont en CAD.",
    action: { label: 'Voir les tarifs', path: '/pricing' },
  },
  
  // Contact/Support
  support: {
    keywords: ['aide', 'help', 'support', 'contact', 'problème', 'bug', 'assistance'],
    response: "🆘 Besoin d'aide ?\n\n• Email : support@youmanage.ca\n• Chat : disponible en heures ouvrables\n• FAQ : consultez notre centre d'aide\n\nDécrivez votre problème et nous vous répondrons rapidement !",
  },
  
  // Manager role
  manager: {
    keywords: ['manager', 'gérant', 'admin', 'gestion', 'gérer utilisateurs'],
    response: "👔 Le rôle Manager permet de :\n\n• Gérer les ressources\n• Approuver les réservations\n• Gérer les utilisateurs\n• Voir les rapports\n• Envoyer des messages\n\nDemandez ce rôle lors de l'inscription !",
  },
  
  // Thanks
  thanks: {
    keywords: ['merci', 'thanks', 'thank you', 'parfait', 'super', 'génial'],
    response: "😊 Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne journée !",
  },
  
  // Goodbye
  goodbye: {
    keywords: ['bye', 'au revoir', 'à bientôt', 'goodbye', 'ciao'],
    response: "👋 Au revoir ! À bientôt sur YouManage !",
  },
}

// Default response when no match found
const defaultResponse = {
  response: "🤔 Je ne suis pas sûr de comprendre. Voici ce que je peux vous aider avec :\n\n• Comment réserver une ressource\n• Voir mes réservations\n• Annuler une réservation\n• Voir le calendrier\n• Tarifs et abonnements\n• Support technique\n\nEssayez de reformuler votre question !",
}

// Quick action buttons
const quickActions = [
  { label: '📅 Réserver', query: 'comment réserver' },
  { label: '📋 Mes réservations', query: 'mes réservations' },
  { label: '📆 Calendrier', query: 'calendrier' },
  { label: '💰 Tarifs', query: 'tarifs' },
  { label: '❓ Aide', query: 'aide' },
]

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "👋 Bonjour ! Je suis l'assistant YouManage. Comment puis-je vous aider ?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const { isDarkMode, theme } = useTheme()
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findResponse = (query) => {
    const lowerQuery = query.toLowerCase()
    
    for (const [key, faq] of Object.entries(faqResponses)) {
      if (faq.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return faq
      }
    }
    
    return defaultResponse
  }

  const handleSend = (customQuery = null) => {
    const query = customQuery || inputValue.trim()
    if (!query) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: query,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(query)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.response,
        action: response.action,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 800 + Math.random() * 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAction = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Button */}
      <Tooltip title="Assistant YouManage" placement="left">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            fontSize: 24,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            background: isOpen 
              ? (isDarkMode ? '#ef4444' : '#ff4d4f')
              : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            border: 'none',
            transition: 'all 0.3s ease',
          }}
        />
      </Tooltip>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 500,
            maxHeight: 'calc(100vh - 140px)',
            background: isDarkMode ? '#1e293b' : '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999,
            border: `1px solid ${isDarkMode ? '#334155' : '#e5e5e5'}`,
            animation: 'slideUp 0.3s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Avatar 
              icon={<RobotOutlined />} 
              style={{ background: 'rgba(255,255,255,0.2)' }}
            />
            <div style={{ flex: 1 }}>
              <Text strong style={{ color: '#fff', display: 'block' }}>
                Assistant YouManage
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                {isTyping ? '⏳ En train d\'écrire...' : '🟢 En ligne'}
              </Text>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
              style={{ color: '#fff' }}
            />
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              background: isDarkMode ? '#0f172a' : '#f9fafb',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: message.type === 'user' 
                      ? '16px 16px 4px 16px' 
                      : '16px 16px 16px 4px',
                    background: message.type === 'user'
                      ? 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
                      : (isDarkMode ? '#1e293b' : '#fff'),
                    color: message.type === 'user' ? '#fff' : (isDarkMode ? '#e2e8f0' : '#333'),
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.5 }}>
                    {message.text}
                  </div>
                  {message.action && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleAction(message.action.path)}
                      style={{ marginTop: 8 }}
                    >
                      {message.action.label} →
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: 4, padding: '8px 12px' }}>
                <span style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: isDarkMode ? '#64748b' : '#ccc',
                  animation: 'bounce 1s infinite',
                }} />
                <span style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: isDarkMode ? '#64748b' : '#ccc',
                  animation: 'bounce 1s infinite 0.2s',
                }} />
                <span style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: isDarkMode ? '#64748b' : '#ccc',
                  animation: 'bounce 1s infinite 0.4s',
                }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div
            style={{
              padding: '8px 12px',
              borderTop: `1px solid ${isDarkMode ? '#334155' : '#f0f0f0'}`,
              background: isDarkMode ? '#1e293b' : '#fff',
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {quickActions.map((action, index) => (
              <Button
                key={index}
                size="small"
                onClick={() => handleSend(action.query)}
                style={{
                  borderRadius: 16,
                  fontSize: 12,
                  background: isDarkMode ? '#0f172a' : '#f5f5f5',
                  borderColor: isDarkMode ? '#334155' : '#e5e5e5',
                  color: isDarkMode ? '#e2e8f0' : '#666',
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: 12,
              borderTop: `1px solid ${isDarkMode ? '#334155' : '#f0f0f0'}`,
              background: isDarkMode ? '#1e293b' : '#fff',
              display: 'flex',
              gap: 8,
            }}
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              style={{
                borderRadius: 20,
                background: isDarkMode ? '#0f172a' : '#f5f5f5',
                borderColor: isDarkMode ? '#334155' : '#e5e5e5',
                color: isDarkMode ? '#e2e8f0' : undefined,
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              style={{ borderRadius: 20 }}
            />
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </>
  )
}

export default ChatBot

