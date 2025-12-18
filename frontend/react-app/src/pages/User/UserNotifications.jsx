import React, { useEffect, useState } from 'react'
import { List, Typography, Tag, Space, Button, Empty, Card, Badge } from 'antd'
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, BookOutlined, MailOutlined, MessageOutlined, UserAddOutlined, WarningOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import api from '../../utils/api'

const { Title, Text } = Typography

const UserNotifications = () => {
  const { user } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications', {
        params: {
          per_page: 100,
        }
      })
      
      setNotifications(response.data.data || [])
      setUnreadCount(response.data.unread_count || 0)
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
      setNotifications([])
      setUnreadCount(0)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, read: true, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error)
    }
  }

  const getNotificationIcon = (type) => {
    const iconMap = {
      // Notifications utilisateur
      booking_confirmation: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      booking_reminder: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      booking_cancellation: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      booking_approval: <CheckCircleOutlined style={{ color: '#1890ff' }} />,
      // Notifications manager
      booking_pending: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      booking_conflict: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      resource_maintenance: <WarningOutlined style={{ color: '#faad14' }} />,
      new_user: <UserAddOutlined style={{ color: '#1890ff' }} />,
      // Notifications admin
      pending_request: <UserAddOutlined style={{ color: '#faad14' }} />,
      system_alert: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      new_client: <TeamOutlined style={{ color: '#52c41a' }} />,
      payment_received: <DollarOutlined style={{ color: '#52c41a' }} />,
    }
    return iconMap[type] || <BellOutlined />
  }

  const getNotificationColor = (type) => {
    const colorMap = {
      // Notifications utilisateur
      booking_confirmation: 'green',
      booking_reminder: 'orange',
      booking_cancellation: 'red',
      booking_approval: 'blue',
      // Notifications manager
      booking_pending: 'orange',
      booking_conflict: 'red',
      resource_maintenance: 'orange',
      new_user: 'blue',
      // Notifications admin
      pending_request: 'orange',
      system_alert: 'red',
      new_client: 'green',
      payment_received: 'green',
    }
    return colorMap[type] || 'default'
  }

  const getNotificationTypeLabel = (type) => {
    const labelMap = {
      booking_confirmation: 'Confirmation',
      booking_reminder: 'Rappel',
      booking_cancellation: 'Annulation',
      booking_approval: 'Approbation',
      booking_pending: 'En attente',
      booking_conflict: 'Conflit',
      resource_maintenance: 'Maintenance',
      new_user: 'Nouvel utilisateur',
      pending_request: 'Demande en attente',
      system_alert: 'Alerte système',
      new_client: 'Nouveau client',
      payment_received: 'Paiement',
    }
    return labelMap[type] || type.replace(/_/g, ' ')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Mes notifications</Title>
          <Text type="secondary">
            {user?.role === 'admin' 
              ? 'Restez informé des demandes, alertes système et activités de la plateforme'
              : user?.role === 'manager'
              ? 'Restez informé des réservations, conflits et activités de votre organisation'
              : 'Restez informé de vos réservations et des changements'}
          </Text>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Statistiques */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <div>
            <Text type="secondary">Non lues</Text>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
              {unreadCount}
            </div>
          </div>
          <div>
            <Text type="secondary">Total</Text>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>
              {notifications.length}
            </div>
          </div>
        </Space>
      </Card>

      {/* Liste des notifications */}
      {notifications.length === 0 ? (
        <Empty 
          description="Aucune notification"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Card>
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                style={{
                  backgroundColor: !item.read ? '#f0f7ff' : 'transparent',
                  padding: '16px',
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
                onClick={() => markAsRead(item.id)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.read}>
                      <div style={{ fontSize: 24 }}>
                        {getNotificationIcon(item.type)}
                      </div>
                    </Badge>
                  }
                  title={
                    <Space>
                      <Text strong={!item.read}>{item.title}</Text>
                      <Tag color={getNotificationColor(item.type)}>
                        {getNotificationTypeLabel(item.type)}
                      </Tag>
                      {!item.read && <Tag color="blue">Nouveau</Tag>}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text>{item.message}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.created_at || item.createdAt).format('DD/MM/YYYY à HH:mm')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  )
}

export default UserNotifications

