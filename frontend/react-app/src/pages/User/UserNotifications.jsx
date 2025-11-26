import React, { useEffect, useState } from 'react'
import { List, Typography, Tag, Space, Button, Empty, Card, Badge } from 'antd'
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, BookOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const UserNotifications = () => {
  const { user } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // TODO: Fetch notifications from API
    // Simulated data
    setNotifications([
      {
        id: 1,
        type: 'booking_confirmation',
        title: 'Réservation confirmée',
        message: 'Votre réservation pour "Salle de réunion A" le 15/12/2024 à 14:00 a été confirmée.',
        read: false,
        createdAt: '2024-12-10T10:30:00',
        bookingId: 123,
      },
      {
        id: 2,
        type: 'booking_reminder',
        title: 'Rappel de réservation',
        message: 'Vous avez une réservation dans 2 heures : "Salle de conférence B" à 16:00',
        read: false,
        createdAt: '2024-12-10T14:00:00',
        bookingId: 124,
      },
      {
        id: 3,
        type: 'booking_cancellation',
        title: 'Réservation annulée',
        message: 'Votre réservation pour "Équipement vidéo" le 12/12/2024 a été annulée par le gestionnaire.',
        read: true,
        createdAt: '2024-12-09T09:15:00',
        bookingId: 122,
      },
      {
        id: 4,
        type: 'booking_approval',
        title: 'Réservation approuvée',
        message: 'Votre demande de réservation pour "Salle de sport" a été approuvée.',
        read: true,
        createdAt: '2024-12-08T16:45:00',
        bookingId: 121,
      },
    ])
  }, [])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type) => {
    const iconMap = {
      booking_confirmation: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      booking_reminder: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      booking_cancellation: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      booking_approval: <CheckCircleOutlined style={{ color: '#1890ff' }} />,
    }
    return iconMap[type] || <BellOutlined />
  }

  const getNotificationColor = (type) => {
    const colorMap = {
      booking_confirmation: 'green',
      booking_reminder: 'orange',
      booking_cancellation: 'red',
      booking_approval: 'blue',
    }
    return colorMap[type] || 'default'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Mes notifications</Title>
          <Text type="secondary">Restez informé de vos réservations et des changements</Text>
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
                        {item.type.replace('booking_', '').replace('_', ' ')}
                      </Tag>
                      {!item.read && <Tag color="blue">Nouveau</Tag>}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text>{item.message}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(item.createdAt).format('DD/MM/YYYY à HH:mm')}
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

