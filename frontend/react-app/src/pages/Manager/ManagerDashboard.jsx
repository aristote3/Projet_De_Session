import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, Table, Tag, Alert, Space, Progress } from 'antd'
import {
  BookOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookings } from '../../store/slices/bookingsSlice'
import { fetchResources } from '../../store/slices/resourcesSlice'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const ManagerDashboard = () => {
  const dispatch = useDispatch()
  const { items: bookings } = useSelector((state) => state.bookings)
  const { items: resources } = useSelector((state) => state.resources)
  const { user } = useSelector((state) => state.auth)
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [conflicts, setConflicts] = useState([])
  const [maintenanceResources, setMaintenanceResources] = useState([])

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchResources())
  }, [dispatch])

  useEffect(() => {
    // Filtrer les réservations à venir (prochaines 7 jours)
    const nextWeek = dayjs().add(7, 'days')
    const upcoming = bookings
      .filter(b => dayjs(b.start_time).isAfter(dayjs()) && dayjs(b.start_time).isBefore(nextWeek))
      .sort((a, b) => dayjs(a.start_time).unix() - dayjs(b.start_time).unix())
      .slice(0, 10)
    setUpcomingBookings(upcoming)

    // Détecter les conflits potentiels (réservations en attente pour la même ressource au même moment)
    const conflictsList = []
    bookings.forEach(booking => {
      if (booking.status === 'pending') {
        const conflict = bookings.find(b => 
          b.id !== booking.id &&
          b.resource_id === booking.resource_id &&
          b.status === 'approved' &&
          dayjs(b.start_time).isSame(dayjs(booking.start_time), 'day')
        )
        if (conflict) {
          conflictsList.push(booking)
        }
      }
    })
    setConflicts(conflictsList)

    // Ressources en maintenance
    const maintenance = resources.filter(r => r.status === 'maintenance' || r.status === 'unavailable')
    setMaintenanceResources(maintenance)
  }, [bookings, resources])

  // Statistiques opérationnelles
  const todayBookings = bookings.filter(b => dayjs(b.start_time).isSame(dayjs(), 'day'))
  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const activeBookings = bookings.filter(b => 
    b.status === 'approved' && 
    dayjs(b.start_time).isBefore(dayjs()) && 
    dayjs(b.end_time).isAfter(dayjs())
  )
  const availableResources = resources.filter(r => r.status === 'available').length
  const occupiedResources = resources.filter(r => r.status === 'busy').length

  // Calcul utilisation de la semaine
  const weekStart = dayjs().startOf('week')
  const weekEnd = dayjs().endOf('week')
  const weekBookings = bookings.filter(b => 
    dayjs(b.start_time).isAfter(weekStart) && 
    dayjs(b.start_time).isBefore(weekEnd) &&
    b.status === 'approved'
  )
  const utilizationRate = resources.length > 0 
    ? Math.round((weekBookings.length / (resources.length * 7)) * 100)
    : 0

  const stats = [
    {
      title: 'Réservations aujourd\'hui',
      value: todayBookings.length,
      icon: <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: 'En attente d\'approbation',
      value: pendingBookings.length,
      icon: <ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      color: '#faad14',
    },
    {
      title: 'Ressources disponibles',
      value: `${availableResources}/${resources.length}`,
      icon: <AppstoreOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: 'Utilisation cette semaine',
      value: `${utilizationRate}%`,
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#722ed1',
    },
  ]

  const upcomingColumns = [
    { title: 'Ressource', dataIndex: ['resource', 'name'], key: 'resource' },
    { title: 'Utilisateur', dataIndex: ['user', 'name'], key: 'user' },
    { 
      title: 'Date/Heure', 
      key: 'datetime',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(record.start_time).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(record.start_time).format('HH:mm')} - {dayjs(record.end_time).format('HH:mm')}
          </Text>
        </Space>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          approved: 'green',
          pending: 'orange',
          rejected: 'red',
          cancelled: 'default',
        }
        const textMap = {
          approved: 'Approuvée',
          pending: 'En attente',
          rejected: 'Refusée',
          cancelled: 'Annulée',
        }
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
      },
    },
  ]

  return (
    <div>
      <Title level={2}>Tableau de bord opérationnel</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Vue d'ensemble de la gestion opérationnelle de votre département
      </Text>

      {/* Alertes */}
      {(conflicts.length > 0 || maintenanceResources.length > 0) && (
        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size="middle">
          {conflicts.length > 0 && (
            <Alert
              message={`${conflicts.length} conflit(s) de réservation détecté(s)`}
              description="Des réservations en attente entrent en conflit avec des réservations approuvées."
              type="warning"
              icon={<ExclamationCircleOutlined />}
              showIcon
              closable
            />
          )}
          {maintenanceResources.length > 0 && (
            <Alert
              message={`${maintenanceResources.length} ressource(s) en maintenance`}
              description="Certaines ressources sont actuellement indisponibles."
              type="info"
              icon={<WarningOutlined />}
              showIcon
              closable
            />
          )}
        </Space>
      )}

      {/* Statistiques */}
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

      <Row gutter={[16, 16]}>
        {/* Réservations à venir */}
        <Col xs={24} lg={16}>
          <Card 
            title="Réservations à venir (7 prochains jours)"
            extra={<Text type="secondary">{upcomingBookings.length} réservation(s)</Text>}
          >
            <Table
              columns={upcomingColumns}
              dataSource={upcomingBookings}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>

        {/* État des ressources */}
        <Col xs={24} lg={8}>
          <Card title="État des ressources">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Disponibles</Text>
                  <Text strong>{availableResources}</Text>
                </div>
                <Progress 
                  percent={resources.length > 0 ? Math.round((availableResources / resources.length) * 100) : 0} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Occupées</Text>
                  <Text strong>{occupiedResources}</Text>
                </div>
                <Progress 
                  percent={resources.length > 0 ? Math.round((occupiedResources / resources.length) * 100) : 0} 
                  strokeColor="#faad14"
                  showInfo={false}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>En maintenance</Text>
                  <Text strong>{maintenanceResources.length}</Text>
                </div>
                <Progress 
                  percent={resources.length > 0 ? Math.round((maintenanceResources.length / resources.length) * 100) : 0} 
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
              </div>
            </Space>
          </Card>

          {/* Réservations actives */}
          <Card title="Réservations en cours" style={{ marginTop: 16 }}>
            <Statistic
              title="Actuellement actives"
              value={activeBookings.length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ManagerDashboard

