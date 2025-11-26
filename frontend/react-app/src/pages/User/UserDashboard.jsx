import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Typography, List, Avatar, Button, Tag, Space, Empty } from 'antd'
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookings } from '../../store/slices/bookingsSlice'
import { fetchResources } from '../../store/slices/resourcesSlice'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const UserDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items: bookings } = useSelector((state) => state.bookings)
  const { items: resources } = useSelector((state) => state.resources)
  const { user } = useSelector((state) => state.auth)
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [pastBookings, setPastBookings] = useState([])

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchResources())
  }, [dispatch])

  useEffect(() => {
    const now = dayjs()
    const upcoming = bookings
      .filter(b => 
        (b.user_id === user?.id || b.user?.id === user?.id) &&
        dayjs(b.start_time).isAfter(now) &&
        b.status === 'approved'
      )
      .sort((a, b) => dayjs(a.start_time).unix() - dayjs(b.start_time).unix())
      .slice(0, 5)

    const past = bookings
      .filter(b => 
        (b.user_id === user?.id || b.user?.id === user?.id) &&
        dayjs(b.end_time).isBefore(now)
      )
      .sort((a, b) => dayjs(b.start_time).unix() - dayjs(a.start_time).unix())
      .slice(0, 5)

    setUpcomingBookings(upcoming)
    setPastBookings(past)
  }, [bookings, user])

  // Filtrer les ressources disponibles pour l'utilisateur
  const availableResources = resources.filter(r => r.status === 'available')

  const stats = [
    {
      title: 'Réservations à venir',
      value: upcomingBookings.length,
      icon: <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'Ressources disponibles',
      value: availableResources.length,
      icon: <BookOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Réservations passées',
      value: pastBookings.length,
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      color: '#faad14',
    },
  ]

  return (
    <div>
      <Title level={2}>Mon tableau de bord</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Gérez vos réservations et découvrez les ressources disponibles
      </Text>

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 14 }}>{stat.title}</Text>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: stat.color, marginTop: 8 }}>
                    {stat.value}
                  </div>
                </div>
                {stat.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Réservations à venir */}
        <Col xs={24} lg={12}>
          <Card 
            title="Mes réservations à venir"
            extra={
              <Button type="link" onClick={() => navigate('/bookings')}>
                Voir toutes
              </Button>
            }
          >
            {upcomingBookings.length === 0 ? (
              <Empty 
                description="Aucune réservation à venir"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/bookings')}>
                  Créer une réservation
                </Button>
              </Empty>
            ) : (
              <List
                dataSource={upcomingBookings}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<BookOutlined />} />}
                      title={
                        <Space>
                          <Text strong>{item.resource?.name || 'Ressource'}</Text>
                          <Tag color="green">Confirmée</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">
                            {dayjs(item.start_time).format('dddd DD MMMM YYYY à HH:mm')}
                          </Text>
                          <Text type="secondary">
                            Jusqu'à {dayjs(item.end_time).format('HH:mm')}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Ressources disponibles */}
        <Col xs={24} lg={12}>
          <Card 
            title="Ressources disponibles"
            extra={
              <Button type="link" onClick={() => navigate('/resources')}>
                Voir toutes
              </Button>
            }
          >
            {availableResources.length === 0 ? (
              <Empty 
                description="Aucune ressource disponible"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <List
                dataSource={availableResources.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={() => navigate(`/bookings?resource=${item.id}`)}
                      >
                        Réserver
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<BookOutlined />} />}
                      title={item.name}
                      description={
                        <Space>
                          <Tag color="blue">{item.category}</Tag>
                          {item.capacity && <Text type="secondary">Capacité: {item.capacity}</Text>}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Réservations récentes */}
      {pastBookings.length > 0 && (
        <Card title="Mes réservations récentes" style={{ marginTop: 24 }}>
          <List
            dataSource={pastBookings}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<CheckCircleOutlined />} />}
                  title={item.resource?.name || 'Ressource'}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">
                        {dayjs(item.start_time).format('DD MMMM YYYY')}
                      </Text>
                      <Tag color="default">Terminée</Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Actions rapides */}
      <Card title="Actions rapides" style={{ marginTop: 24 }}>
        <Space wrap>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/bookings')}
          >
            Nouvelle réservation
          </Button>
          <Button 
            icon={<CalendarOutlined />}
            size="large"
            onClick={() => navigate('/calendar')}
          >
            Voir le calendrier
          </Button>
          <Button 
            icon={<BookOutlined />}
            size="large"
            onClick={() => navigate('/resources')}
          >
            Explorer les ressources
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default UserDashboard

