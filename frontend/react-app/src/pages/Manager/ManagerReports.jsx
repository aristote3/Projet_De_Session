import React, { useEffect, useState } from 'react'
import { Card, Typography, Row, Col, Statistic, Table, DatePicker, Space, Button, Tag, Progress, Divider } from 'antd'
import { BookOutlined, AppstoreOutlined, UserOutlined, DownloadOutlined, CalendarOutlined, RiseOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookings } from '../../store/slices/bookingsSlice'
import { fetchResources } from '../../store/slices/resourcesSlice'
import { fetchUsers } from '../../store/slices/usersSlice'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const ManagerReports = () => {
  const dispatch = useDispatch()
  const { items: bookings } = useSelector((state) => state.bookings)
  const { items: resources } = useSelector((state) => state.resources)
  const { items: users } = useSelector((state) => state.users)
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [reportType, setReportType] = useState('usage')

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchResources())
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const filtered = bookings.filter(b => 
        dayjs(b.start_time).isAfter(dateRange[0].subtract(1, 'day')) &&
        dayjs(b.start_time).isBefore(dateRange[1].add(1, 'day'))
      )
      setFilteredBookings(filtered)
    } else {
      setFilteredBookings(bookings)
    }
  }, [bookings, dateRange])

  // Statistiques d'utilisation
  const approvedBookings = filteredBookings.filter(b => b.status === 'approved')
  const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled')
  const totalHours = approvedBookings.reduce((sum, b) => {
    const duration = dayjs(b.end_time).diff(dayjs(b.start_time), 'hour', true)
    return sum + duration
  }, 0)

  // Ressources les plus demandées
  const resourceUsage = {}
  approvedBookings.forEach(booking => {
    const resourceId = booking.resource_id || booking.resource?.id
    const resourceName = booking.resource?.name || 'Ressource inconnue'
    if (!resourceUsage[resourceId]) {
      resourceUsage[resourceId] = { name: resourceName, count: 0, hours: 0 }
    }
    resourceUsage[resourceId].count++
    const duration = dayjs(booking.end_time).diff(dayjs(booking.start_time), 'hour', true)
    resourceUsage[resourceId].hours += duration
  })

  const topResources = Object.values(resourceUsage)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Heures de pointe
  const peakHours = {}
  approvedBookings.forEach(booking => {
    const hour = dayjs(booking.start_time).hour()
    peakHours[hour] = (peakHours[hour] || 0) + 1
  })
  const topPeakHours = Object.entries(peakHours)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))

  // Activité utilisateur
  const userActivity = {}
  approvedBookings.forEach(booking => {
    const userId = booking.user_id || booking.user?.id
    const userName = booking.user?.name || 'Utilisateur inconnu'
    if (!userActivity[userId]) {
      userActivity[userId] = { name: userName, bookings: 0, hours: 0 }
    }
    userActivity[userId].bookings++
    const duration = dayjs(booking.end_time).diff(dayjs(booking.start_time), 'hour', true)
    userActivity[userId].hours += duration
  })
  const topUsers = Object.values(userActivity)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 10)

  const resourceColumns = [
    { title: 'Ressource', dataIndex: 'name', key: 'name' },
    { title: 'Nombre de réservations', dataIndex: 'count', key: 'count' },
    { 
      title: 'Heures totales', 
      dataIndex: 'hours', 
      key: 'hours',
      render: (hours) => `${hours.toFixed(1)}h`
    },
  ]

  // Rapport des réservations et annulations
  const bookingColumns = [
    { title: 'Ressource', dataIndex: ['resource', 'name'], key: 'resource' },
    { title: 'Utilisateur', dataIndex: ['user', 'name'], key: 'user' },
    { 
      title: 'Date', 
      dataIndex: 'start_time',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
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

  const handleExport = () => {
    // TODO: Implémenter l'export des rapports
    console.log('Export des rapports', { filteredBookings, topResources })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Rapports opérationnels</Title>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="DD/MM/YYYY"
          />
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            Exporter
          </Button>
        </Space>
      </div>

      {/* Statistiques générales */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Réservations approuvées"
              value={approvedBookings.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Réservations annulées"
              value={cancelledBookings.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Heures totales"
              value={totalHours.toFixed(1)}
              suffix="h"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Taux d'annulation"
              value={filteredBookings.length > 0 
                ? ((cancelledBookings.length / filteredBookings.length) * 100).toFixed(1)
                : 0
              }
              suffix="%"
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Sélection du type de rapport */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button 
            type={reportType === 'usage' ? 'primary' : 'default'}
            onClick={() => setReportType('usage')}
          >
            Utilisation
          </Button>
          <Button 
            type={reportType === 'users' ? 'primary' : 'default'}
            onClick={() => setReportType('users')}
          >
            Activité utilisateurs
          </Button>
          <Button 
            type={reportType === 'peak' ? 'primary' : 'default'}
            onClick={() => setReportType('peak')}
          >
            Heures de pointe
          </Button>
        </Space>
      </Card>

      {/* Rapport d'utilisation */}
      {reportType === 'usage' && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Ressources les plus demandées">
              <Table
                columns={resourceColumns}
                dataSource={topResources.map((r, idx) => ({ ...r, key: idx }))}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Statistiques d'utilisation">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Text strong>Taux d'utilisation des ressources</Text>
                  <div style={{ marginTop: 8 }}>
                    <Progress
                      percent={resources.length > 0 
                        ? Math.round((approvedBookings.length / (resources.length * 30)) * 100)
                        : 0
                      }
                      strokeColor="#1890ff"
                    />
                  </div>
                </div>
                <Divider />
                <div>
                  <Text strong>Réservations par jour (moyenne)</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 18 }}>
                      {dateRange && dateRange[0] && dateRange[1]
                        ? (approvedBookings.length / (dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day') + 1)).toFixed(1)
                        : '0'
                      }
                    </Text>
                  </div>
                </div>
                <div>
                  <Text strong>Heures par réservation (moyenne)</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 18 }}>
                      {approvedBookings.length > 0
                        ? (totalHours / approvedBookings.length).toFixed(1)
                        : '0'
                      }h
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Rapport activité utilisateurs */}
      {reportType === 'users' && (
        <Card title="Activité des utilisateurs">
          <Table
            columns={[
              { title: 'Utilisateur', dataIndex: 'name', key: 'name' },
              { title: 'Réservations', dataIndex: 'bookings', key: 'bookings', sorter: (a, b) => a.bookings - b.bookings },
              { title: 'Heures totales', dataIndex: 'hours', key: 'hours', render: (h) => `${h.toFixed(1)}h`, sorter: (a, b) => a.hours - b.hours },
            ]}
            dataSource={topUsers.map((u, idx) => ({ ...u, key: idx }))}
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* Rapport heures de pointe */}
      {reportType === 'peak' && (
        <Card title="Heures de pointe">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {topPeakHours.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>{item.hour}:00 - {item.hour + 1}:00</Text>
                  <Text strong>{item.count} réservations</Text>
                </div>
                <Progress
                  percent={Math.round((item.count / (topPeakHours[0]?.count || 1)) * 100)}
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </div>
            ))}
          </Space>
        </Card>
      )}

      {/* Rapport des réservations */}
      <Card title="Détail des réservations" style={{ marginTop: 16 }}>
        <Table
          columns={bookingColumns}
          dataSource={filteredBookings}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>
    </div>
  )
}

export default ManagerReports

