import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, Space, Progress, List, Avatar, Alert, Divider, Timeline, Badge } from 'antd'
import {
  TeamOutlined,
  DollarOutlined,
  AppstoreOutlined,
  BookOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  RiseOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  GlobalOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  EyeOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentActivity, setRecentActivity] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [topClients, setTopClients] = useState([])
  const [systemHealth, setSystemHealth] = useState({})

  useEffect(() => {
    // TODO: Fetch clients (managers) from API
    // Simulated data for now
    setClients([
      {
        id: 1,
        name: 'Acme Corporation',
        manager: 'John Doe',
        email: 'john@acme.com',
        subscription: 'Premium',
        status: 'active',
        users: 45,
        resources: 12,
        bookings: 234,
        revenue: 12500,
        createdAt: '2024-01-15',
        growth: 15.5,
        lastActivity: '2024-12-10T14:30:00',
      },
      {
        id: 2,
        name: 'TechStart Inc',
        manager: 'Jane Smith',
        email: 'jane@techstart.com',
        subscription: 'Basic',
        status: 'active',
        users: 23,
        resources: 8,
        bookings: 156,
        revenue: 7800,
        createdAt: '2024-02-20',
        growth: 8.2,
        lastActivity: '2024-12-10T12:15:00',
      },
      {
        id: 3,
        name: 'Global Services',
        manager: 'Bob Johnson',
        email: 'bob@globalservices.com',
        subscription: 'Enterprise',
        status: 'active',
        users: 120,
        resources: 35,
        bookings: 890,
        revenue: 45000,
        createdAt: '2023-11-10',
        growth: 22.3,
        lastActivity: '2024-12-10T16:45:00',
      },
      {
        id: 4,
        name: 'StartupHub',
        manager: 'Alice Brown',
        email: 'alice@startuphub.com',
        subscription: 'Premium',
        status: 'active',
        users: 67,
        resources: 18,
        bookings: 412,
        revenue: 18900,
        createdAt: '2024-03-05',
        growth: 31.7,
        lastActivity: '2024-12-10T15:20:00',
      },
      {
        id: 5,
        name: 'Digital Workspace',
        manager: 'Charlie Wilson',
        email: 'charlie@digital.com',
        subscription: 'Basic',
        status: 'active',
        users: 34,
        resources: 10,
        bookings: 201,
        revenue: 9200,
        createdAt: '2024-04-12',
        growth: -2.1,
        lastActivity: '2024-12-09T10:00:00',
      },
    ])

    // Recent activity
    setRecentActivity([
      { id: 1, type: 'client_created', client: 'StartupHub', time: '2024-12-10T16:00:00', icon: <TeamOutlined />, color: 'green' },
      { id: 2, type: 'subscription_upgraded', client: 'TechStart Inc', time: '2024-12-10T15:30:00', icon: <RiseOutlined />, color: 'blue' },
      { id: 3, type: 'payment_received', client: 'Acme Corporation', amount: 299, time: '2024-12-10T14:00:00', icon: <DollarOutlined />, color: 'gold' },
      { id: 4, type: 'support_ticket', client: 'Global Services', time: '2024-12-10T13:15:00', icon: <MailOutlined />, color: 'orange' },
      { id: 5, type: 'client_created', client: 'Digital Workspace', time: '2024-12-10T12:00:00', icon: <TeamOutlined />, color: 'green' },
    ])

    // Revenue data for last 6 months
    setRevenueData([
      { month: 'Juin', revenue: 45200, bookings: 1200 },
      { month: 'Juillet', revenue: 48900, bookings: 1350 },
      { month: 'Août', revenue: 52100, bookings: 1420 },
      { month: 'Septembre', revenue: 56700, bookings: 1580 },
      { month: 'Octobre', revenue: 61200, bookings: 1720 },
      { month: 'Novembre', revenue: 65300, bookings: 1890 },
    ])

    // Top clients by revenue
    setTopClients(clients.sort((a, b) => b.revenue - a.revenue).slice(0, 5))

    // System health
    setSystemHealth({
      uptime: 99.9,
      responseTime: 120,
      errorRate: 0.2,
      activeUsers: 289,
      apiRequests: 12500,
    })
  }, [])

  // Calculate platform-wide stats
  const totalClients = clients.length
  const activeClients = clients.filter(c => c.status === 'active').length
  const totalUsers = clients.reduce((sum, c) => sum + c.users, 0)
  const totalResources = clients.reduce((sum, c) => sum + c.resources, 0)
  const totalBookings = clients.reduce((sum, c) => sum + c.bookings, 0)
  const totalRevenue = clients.reduce((sum, c) => sum + c.revenue, 0)
  const mrr = totalRevenue // Monthly Recurring Revenue (simplified)
  const newClientsThisMonth = clients.filter(c => dayjs(c.createdAt).isAfter(dayjs().startOf('month'))).length
  const avgRevenuePerClient = totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0
  const revenueGrowth = revenueData.length > 1 
    ? ((revenueData[revenueData.length - 1].revenue - revenueData[revenueData.length - 2].revenue) / revenueData[revenueData.length - 2].revenue * 100).toFixed(1)
    : 0

  const stats = [
    {
      title: 'Clients actifs',
      value: activeClients,
      icon: <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#1890ff',
      suffix: `/${totalClients} total`,
      trend: newClientsThisMonth > 0 ? { value: `+${newClientsThisMonth} ce mois`, isPositive: true } : null,
    },
    {
      title: 'Utilisateurs totaux',
      value: totalUsers,
      icon: <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a',
      trend: { value: `+${Math.round(totalUsers * 0.12)} ce mois`, isPositive: true },
    },
    {
      title: 'Ressources totales',
      value: totalResources,
      icon: <AppstoreOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      color: '#faad14',
    },
    {
      title: 'MRR (Revenus mensuels)',
      value: mrr,
      icon: <DollarOutlined style={{ fontSize: 24, color: '#f5222d' }} />,
      color: '#f5222d',
      suffix: '€',
      trend: { value: `+${revenueGrowth}%`, isPositive: parseFloat(revenueGrowth) > 0 },
    },
    {
      title: 'Réservations totales',
      value: totalBookings,
      icon: <BookOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#722ed1',
    },
    {
      title: 'Revenu moyen/client',
      value: avgRevenuePerClient,
      icon: <TrophyOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
      color: '#13c2c2',
      suffix: '€',
    },
  ]

  const clientColumns = [
    {
      title: 'Client',
      key: 'client',
      render: (_, record) => (
        <Space>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.manager}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Abonnement',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (subscription) => {
        const colorMap = {
          Basic: 'blue',
          Premium: 'gold',
          Enterprise: 'purple',
        }
        return <Tag color={colorMap[subscription]}>{subscription}</Tag>
      },
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? 'Actif' : 'Inactif'}
        </Tag>
      ),
    },
    {
      title: 'Utilisateurs',
      dataIndex: 'users',
      key: 'users',
      sorter: (a, b) => a.users - b.users,
    },
    {
      title: 'Ressources',
      dataIndex: 'resources',
      key: 'resources',
      sorter: (a, b) => a.resources - b.resources,
    },
    {
      title: 'Revenus',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{revenue.toLocaleString()} €</Text>
          {record.growth && (
            <Text style={{ fontSize: 11, color: record.growth > 0 ? '#52c41a' : '#f5222d' }}>
              {record.growth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {' '}
              {Math.abs(record.growth)}%
            </Text>
          )}
        </Space>
      ),
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Dernière activité',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (time) => time ? (
        <Space>
          <Badge status="success" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(time).fromNow()}
          </Text>
        </Space>
      ) : <Text type="secondary">-</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/admin/clients/${record.id}`)}>
            Voir
          </Button>
          <Button size="small" type="link" onClick={() => navigate(`/admin/clients/${record.id}/impersonate`)}>
            Impersonate
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Tableau de bord plateforme</Title>
          <Text type="secondary">Vue d'ensemble globale de tous les clients (SaaS)</Text>
        </div>
        <Button type="primary" onClick={() => navigate('/admin/clients/new')}>
          Onboarder un nouveau client
        </Button>
      </div>

      {/* Statistiques globales */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
              {stat.trend && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  <span style={{ color: stat.trend.isPositive ? '#52c41a' : '#f5222d' }}>
                    {stat.trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}
                    {stat.trend.value}
                  </span>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Graphiques et tendances */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                <span>Évolution des revenus (6 derniers mois)</span>
              </Space>
            }
          >
            <Row gutter={[8, 16]}>
              {revenueData.map((data, index) => {
                const maxRevenue = Math.max(...revenueData.map(d => d.revenue))
                const percentage = (data.revenue / maxRevenue) * 100
                return (
                  <Col span={24} key={index}>
                    <div style={{ marginBottom: 4 }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text strong>{data.month}</Text>
                        <Text>{data.revenue.toLocaleString()}€</Text>
                      </Space>
                    </div>
                    <Progress 
                      percent={percentage} 
                      strokeColor="#1890ff"
                      showInfo={false}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {data.bookings} réservations
                    </Text>
                  </Col>
                )
              })}
            </Row>
            <Divider />
            <Row>
              <Col span={12}>
                <Statistic
                  title="Revenus totaux"
                  value={revenueData.reduce((sum, d) => sum + d.revenue, 0)}
                  suffix="€"
                  valueStyle={{ fontSize: 20 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Croissance"
                  value={revenueGrowth}
                  suffix="%"
                  prefix={parseFloat(revenueGrowth) > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  valueStyle={{ color: parseFloat(revenueGrowth) > 0 ? '#52c41a' : '#f5222d', fontSize: 20 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                <span>Top 5 clients par revenus</span>
              </Space>
            }
          >
            <List
              dataSource={topClients}
              renderItem={(client, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#1890ff' }}>
                        {index + 1}
                      </Avatar>
                    }
                    title={client.name}
                    description={
                      <Space>
                        <Text type="secondary">{client.manager}</Text>
                        <Tag color={client.subscription === 'Enterprise' ? 'purple' : client.subscription === 'Premium' ? 'gold' : 'blue'}>
                          {client.subscription}
                        </Tag>
                      </Space>
                    }
                  />
                  <div>
                    <Text strong style={{ fontSize: 16 }}>{client.revenue.toLocaleString()}€</Text>
                    {client.growth && (
                      <div style={{ fontSize: 12, color: client.growth > 0 ? '#52c41a' : '#f5222d' }}>
                        {client.growth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        {' '}
                        {Math.abs(client.growth)}%
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Santé système et activité récente */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ThunderboltOutlined />
                <span>Santé du système</span>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Uptime"
                  value={systemHealth.uptime}
                  suffix="%"
                  valueStyle={{ color: systemHealth.uptime > 99 ? '#52c41a' : '#faad14' }}
                />
                <Progress 
                  percent={systemHealth.uptime} 
                  strokeColor={systemHealth.uptime > 99 ? '#52c41a' : '#faad14'}
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Temps de réponse"
                  value={systemHealth.responseTime}
                  suffix="ms"
                  valueStyle={{ color: systemHealth.responseTime < 200 ? '#52c41a' : '#faad14' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Taux d'erreur"
                  value={systemHealth.errorRate}
                  suffix="%"
                  valueStyle={{ color: systemHealth.errorRate < 1 ? '#52c41a' : '#f5222d' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Utilisateurs actifs"
                  value={systemHealth.activeUsers}
                  prefix={<UserOutlined />}
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <GlobalOutlined /> {systemHealth.apiRequests.toLocaleString()} requêtes API aujourd'hui
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Activité récente</span>
              </Space>
            }
            extra={
              <Button type="link" size="small" icon={<ReloadOutlined />}>
                Actualiser
              </Button>
            }
          >
            <Timeline
              items={recentActivity.map(activity => ({
                color: activity.color,
                children: (
                  <div>
                    <Space>
                      {activity.icon}
                      <Text strong>{activity.client}</Text>
                    </Space>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {activity.type === 'client_created' && 'Nouveau client créé'}
                        {activity.type === 'subscription_upgraded' && 'Abonnement mis à niveau'}
                        {activity.type === 'payment_received' && `Paiement reçu: ${activity.amount}€`}
                        {activity.type === 'support_ticket' && 'Nouveau ticket de support'}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
                      {dayjs(activity.time).fromNow()}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Liste des clients enrichie */}
      <Card 
        title={
          <Space>
            <TeamOutlined />
            <span>Tous les clients (Managers)</span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => navigate('/admin/clients')}>
              Voir tous
            </Button>
            <Button type="primary" icon={<TeamOutlined />} onClick={() => navigate('/admin/clients/new')}>
              Nouveau client
            </Button>
          </Space>
        }
      >
        <Table
          columns={clientColumns}
          dataSource={clients}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: true }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Alertes système enrichies */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Alertes et notifications système">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Alert
                message="Clients approchant leurs limites"
                description="2 clients approchent de leur limite de ressources. Considérez une mise à niveau."
                type="warning"
                showIcon
                action={
                  <Button size="small" onClick={() => navigate('/admin/clients')}>
                    Voir
                  </Button>
                }
              />
              <Alert
                message="Système opérationnel"
                description={`Uptime: ${systemHealth.uptime}% | Temps de réponse: ${systemHealth.responseTime}ms | Taux d'erreur: ${systemHealth.errorRate}%`}
                type="success"
                showIcon
              />
              {systemHealth.errorRate > 1 && (
                <Alert
                  message="Taux d'erreur élevé"
                  description="Le taux d'erreur dépasse 1%. Vérifiez les logs système."
                  type="error"
                  showIcon
                  action={
                    <Button size="small" onClick={() => navigate('/admin/monitoring')}>
                      Voir logs
                    </Button>
                  }
                />
              )}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Actions rapides">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                block 
                type="primary" 
                icon={<TeamOutlined />}
                onClick={() => navigate('/admin/clients/new')}
              >
                Onboarder un client
              </Button>
              <Button 
                block 
                icon={<DollarOutlined />}
                onClick={() => navigate('/admin/billing')}
              >
                Gérer la facturation
              </Button>
              <Button 
                block 
                icon={<BarChartOutlined />}
                onClick={() => navigate('/admin/reports')}
              >
                Voir les rapports
              </Button>
              <Button 
                block 
                icon={<ThunderboltOutlined />}
                onClick={() => navigate('/admin/monitoring')}
              >
                Monitoring système
              </Button>
              <Button 
                block 
                icon={<MailOutlined />}
                onClick={() => navigate('/admin/support')}
              >
                Support clients
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
