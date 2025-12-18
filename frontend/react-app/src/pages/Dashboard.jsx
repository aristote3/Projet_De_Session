import React, { useEffect } from 'react'
import { Row, Col, Card, Statistic, Typography, List, Avatar } from 'antd'
import {
  AppstoreOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchResources } from '../store/slices/resourcesSlice'
import { useResourcePolling } from '../hooks/useResourcePolling'
import { fetchBookings } from '../store/slices/bookingsSlice'

const { Title } = Typography

const Dashboard = () => {
  const dispatch = useDispatch()
  const { items: resources, loading: resourcesLoading } = useSelector((state) => state.resources)
  const { items: bookings, loading: bookingsLoading } = useSelector((state) => state.bookings)

  useEffect(() => {
    dispatch(fetchBookings())
  }, [dispatch])

  // Polling automatique toutes les 30 secondes pour mettre à jour les ressources en temps réel
  useResourcePolling(30, true)

  const stats = [
    {
      title: 'Ressources',
      value: resources.length,
      icon: <AppstoreOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'Réservations',
      value: bookings.length,
      icon: <BookOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Approuvées',
      value: bookings.filter(b => b.status === 'approved').length,
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'En attente',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      color: '#faad14',
    },
  ]

  const recentBookings = bookings.slice(0, 5)

  return (
    <div>
      <Title level={2}>Tableau de bord</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Ressources récentes" loading={resourcesLoading}>
            <List
              dataSource={resources.slice(0, 5)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<AppstoreOutlined />} />}
                    title={item.name}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Réservations récentes" loading={bookingsLoading}>
            <List
              dataSource={recentBookings}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<BookOutlined />} />}
                    title={`${item.resource?.name || 'Ressource'} - ${item.start_time}`}
                    description={`Statut: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

