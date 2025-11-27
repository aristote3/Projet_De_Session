import React, { useState, useEffect } from 'react'
import { 
  Card, 
  List, 
  Avatar, 
  Badge, 
  Typography, 
  Space, 
  Tag, 
  Empty, 
  Spin, 
  Button,
  Drawer,
  Input,
  message as antMessage,
  Divider
} from 'antd'
import { 
  MailOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  SendOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useTheme } from '../contexts/ThemeContext'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import api from '../utils/api'

dayjs.extend(relativeTime)
dayjs.locale('fr')

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replying, setReplying] = useState(false)
  const { isDarkMode, theme } = useTheme()
  const user = useSelector((state) => state.auth.user)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await api.get('/messages')
      setMessages(response.data.data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      antMessage.error('Erreur lors du chargement des messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMessageClick = async (msg) => {
    setSelectedMessage(msg)
    setDrawerVisible(true)
    
    // Mark as read
    if (!msg.is_read) {
      try {
        await api.post(`/messages/${msg.id}/read`)
        setMessages(prev => 
          prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m)
        )
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    }
  }

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedMessage) return
    
    setReplying(true)
    try {
      await api.post('/messages/send', {
        recipient_id: selectedMessage.sender_id,
        subject: `Re: ${selectedMessage.subject || 'Sans sujet'}`,
        content: replyContent,
        channel: 'app'
      })
      antMessage.success('Réponse envoyée !')
      setReplyContent('')
      setDrawerVisible(false)
      fetchMessages()
    } catch (error) {
      antMessage.error('Erreur lors de l\'envoi')
    } finally {
      setReplying(false)
    }
  }

  const getMessageIcon = (msg) => {
    if (msg.type === 'broadcast') {
      return <SoundOutlined style={{ color: '#faad14' }} />
    }
    return <MailOutlined style={{ color: theme.colorPrimary }} />
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <div>
          <Title level={2} style={{ margin: 0, color: theme.colorText }}>
            Messages
            {unreadCount > 0 && (
              <Badge 
                count={unreadCount} 
                style={{ marginLeft: 12, backgroundColor: '#f5222d' }} 
              />
            )}
          </Title>
          <Text type="secondary">Vos messages et notifications</Text>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchMessages}
          loading={loading}
        >
          Actualiser
        </Button>
      </div>

      <Card 
        style={{ 
          background: isDarkMode ? theme.colorBgContainer : '#fff',
          borderColor: theme.colorBorder
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : messages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Aucun message"
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item
                onClick={() => handleMessageClick(msg)}
                style={{ 
                  cursor: 'pointer',
                  padding: '16px 12px',
                  borderRadius: 8,
                  marginBottom: 8,
                  background: msg.is_read 
                    ? 'transparent' 
                    : (isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)'),
                  border: msg.is_read 
                    ? 'none' 
                    : `1px solid ${isDarkMode ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)'}`,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = msg.is_read 
                    ? 'transparent' 
                    : (isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)')
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!msg.is_read}>
                      <Avatar 
                        icon={getMessageIcon(msg)} 
                        style={{ 
                          background: isDarkMode ? '#1e40af' : '#e6f7ff'
                        }}
                      />
                    </Badge>
                  }
                  title={
                    <Space>
                      <Text strong style={{ color: theme.colorText }}>
                        {msg.sender?.name || 'Système'}
                      </Text>
                      {msg.type === 'broadcast' && (
                        <Tag color="gold" icon={<SoundOutlined />}>
                          Diffusion
                        </Tag>
                      )}
                      {!msg.is_read && (
                        <Tag color="blue">Nouveau</Tag>
                      )}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      {msg.subject && (
                        <Text strong style={{ color: theme.colorTextSecondary }}>
                          {msg.subject}
                        </Text>
                      )}
                      <Text 
                        type="secondary" 
                        ellipsis 
                        style={{ 
                          maxWidth: '100%',
                          color: theme.colorTextSecondary 
                        }}
                      >
                        {msg.content.substring(0, 100)}...
                      </Text>
                      <Space size={16}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {dayjs(msg.created_at).fromNow()}
                        </Text>
                        {msg.is_read && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <CheckCircleOutlined /> Lu
                          </Text>
                        )}
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Message Detail Drawer */}
      <Drawer
        title={
          <Space>
            {selectedMessage?.type === 'broadcast' ? (
              <SoundOutlined style={{ color: '#faad14' }} />
            ) : (
              <MailOutlined style={{ color: theme.colorPrimary }} />
            )}
            <span>Message de {selectedMessage?.sender?.name}</span>
          </Space>
        }
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{
          body: { 
            background: isDarkMode ? theme.colorBgContainer : '#fff',
            padding: 24
          },
          header: {
            background: isDarkMode ? theme.colorBgContainer : '#fff',
            borderBottom: `1px solid ${theme.colorBorder}`
          }
        }}
      >
        {selectedMessage && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Text strong>{selectedMessage.sender?.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(selectedMessage.created_at).format('DD MMMM YYYY à HH:mm')}
                  </Text>
                </div>
              </Space>
            </div>

            {selectedMessage.subject && (
              <div>
                <Text type="secondary">Sujet:</Text>
                <Title level={5} style={{ margin: '4px 0', color: theme.colorText }}>
                  {selectedMessage.subject}
                </Title>
              </div>
            )}

            <Divider style={{ margin: '12px 0' }} />

            <div 
              style={{ 
                background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                padding: 16,
                borderRadius: 8
              }}
            >
              <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap', color: theme.colorText }}>
                {selectedMessage.content}
              </Paragraph>
            </div>

            {selectedMessage.type !== 'broadcast' && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                
                <div>
                  <Text strong style={{ color: theme.colorText }}>Répondre</Text>
                  <TextArea
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Tapez votre réponse..."
                    style={{ 
                      marginTop: 8,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
                      borderColor: theme.colorBorder,
                      color: theme.colorText
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleReply}
                    loading={replying}
                    style={{ marginTop: 12 }}
                    disabled={!replyContent.trim()}
                  >
                    Envoyer
                  </Button>
                </div>
              </>
            )}
          </Space>
        )}
      </Drawer>
    </div>
  )
}

export default Messages

