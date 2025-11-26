import React, { useState, useEffect } from 'react'
import { Card, Typography, Row, Col, Statistic, Table, Tag, Button, Space, DatePicker, Select, Progress, Divider, Tabs } from 'antd'
import { BookOutlined, AppstoreOutlined, UserOutlined, DollarOutlined, RiseOutlined, DownloadOutlined, BarChartOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const Reports = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()])
  const [reportType, setReportType] = useState('overview')
  const [clientUsage, setClientUsage] = useState([])
  const [revenueData, setRevenueData] = useState([])

  useEffect(() => {
    // TODO: Fetch from API
    setClientUsage([
      {
        id: 1,
        clientName: 'Acme Corporation',
        totalBookings: 1234,
        activeUsers: 45,
        resourcesUsed: 12,
        revenue: 12500,
        utilizationRate: 87,
        growth: 15.5,
      },
      {
        id: 2,
        clientName: 'TechStart Inc',
        totalBookings: 856,
        activeUsers: 23,
        resourcesUsed: 8,
        revenue: 7800,
        utilizationRate: 72,
        growth: 8.2,
      },
      {
        id: 3,
        clientName: 'Global Services',
        totalBookings: 2890,
        activeUsers: 120,
        resourcesUsed: 35,
        revenue: 45000,
        utilizationRate: 94,
        growth: 22.3,
      },
    ])

    setRevenueData([
      { month: 'Juin', revenue: 45200, bookings: 1200, clients: 3 },
      { month: 'Juillet', revenue: 48900, bookings: 1350, clients: 3 },
      { month: 'Août', revenue: 52100, bookings: 1420, clients: 4 },
      { month: 'Septembre', revenue: 56700, bookings: 1580, clients: 4 },
      { month: 'Octobre', revenue: 61200, bookings: 1720, clients: 5 },
      { month: 'Novembre', revenue: 65300, bookings: 1890, clients: 5 },
    ])
  }, [])

  const stats = {
    totalBookings: clientUsage.reduce((sum, c) => sum + c.totalBookings, 0),
    totalRevenue: clientUsage.reduce((sum, c) => sum + c.revenue, 0),
    totalUsers: clientUsage.reduce((sum, c) => sum + c.activeUsers, 0),
    avgUtilization: Math.round(clientUsage.reduce((sum, c) => sum + c.utilizationRate, 0) / clientUsage.length),
    totalClients: clientUsage.length,
    growthRate: 18.5,
  }

  const clientUsageColumns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Réservations',
      dataIndex: 'totalBookings',
      key: 'totalBookings',
      sorter: (a, b) => a.totalBookings - b.totalBookings,
    },
    {
      title: 'Utilisateurs actifs',
      dataIndex: 'activeUsers',
      key: 'activeUsers',
    },
    {
      title: 'Taux d\'utilisation',
      dataIndex: 'utilizationRate',
      key: 'utilizationRate',
      render: (rate) => (
        <Space>
          <Progress percent={rate} size="small" style={{ width: 100 }} />
          <Text>{rate}%</Text>
        </Space>
      ),
      sorter: (a, b) => a.utilizationRate - b.utilizationRate,
    },
    {
      title: 'Revenus',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${revenue.toLocaleString()}€`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Croissance',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth) => (
        <Tag color={growth > 0 ? 'green' : 'red'}>
          {growth > 0 ? '+' : ''}{growth}%
        </Tag>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'overview',
      label: 'Vue d\'ensemble',
      children: (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Réservations totales"
                  value={stats.totalBookings}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Revenus totaux"
                  value={stats.totalRevenue}
                  prefix={<DollarOutlined />}
                  suffix="€"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Utilisateurs actifs"
                  value={stats.totalUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Taux d'utilisation moyen"
                  value={stats.avgUtilization}
                  suffix="%"
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Évolution des revenus (6 derniers mois)">
            <Row gutter={[8, 16]}>
              {revenueData.map((data, index) => {
                const maxRevenue = Math.max(...revenueData.map(d => d.revenue))
                const percentage = (data.revenue / maxRevenue) * 100
                return (
                  <Col span={24} key={index}>
                    <div style={{ marginBottom: 4 }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Text strong>{data.month}</Text>
                        <Space>
                          <Text>{data.revenue.toLocaleString()}€</Text>
                          <Text type="secondary">({data.bookings} réservations)</Text>
                        </Space>
                      </Space>
                    </div>
                    <Progress percent={percentage} strokeColor="#1890ff" showInfo={false} />
                  </Col>
                )
              })}
            </Row>
          </Card>
        </>
      ),
    },
    {
      key: 'clients',
      label: 'Usage par client',
      children: (
        <Card
          title="Utilisation par client"
          extra={
            <Space>
              <RangePicker value={dateRange} onChange={setDateRange} />
              <Button icon={<DownloadOutlined />}>
                Exporter
              </Button>
            </Space>
          }
        >
          <Table
            columns={clientUsageColumns}
            dataSource={clientUsage}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'revenue',
      label: 'Analyse des revenus',
      children: (
        <Card title="Analyse détaillée des revenus">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="MRR (Revenus mensuels récurrents)"
                  value={revenueData[revenueData.length - 1]?.revenue || 0}
                  prefix={<DollarOutlined />}
                  suffix="€"
                  valueStyle={{ fontSize: 24 }}
                />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">
                    Croissance: <Text strong style={{ color: '#52c41a' }}>+{stats.growthRate}%</Text>
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="ARR (Revenus annuels récurrents)"
                  value={(revenueData[revenueData.length - 1]?.revenue || 0) * 12}
                  prefix={<DollarOutlined />}
                  suffix="€"
                  valueStyle={{ fontSize: 24 }}
                />
              </Card>
            </Col>
          </Row>
          <Divider />
          <Card title="Top clients par revenus">
            <Table
              columns={[
                { title: 'Client', dataIndex: 'clientName', key: 'clientName' },
                { 
                  title: 'Revenus', 
                  dataIndex: 'revenue', 
                  key: 'revenue',
                  render: (revenue) => `${revenue.toLocaleString()}€`,
                  sorter: (a, b) => a.revenue - b.revenue,
                },
                {
                  title: 'Part',
                  key: 'share',
                  render: (_, record) => {
                    const share = (record.revenue / stats.totalRevenue * 100).toFixed(1)
                    return (
                      <Space>
                        <Progress percent={parseFloat(share)} size="small" style={{ width: 100 }} />
                        <Text>{share}%</Text>
                      </Space>
                    )
                  },
                },
              ]}
              dataSource={clientUsage.sort((a, b) => b.revenue - a.revenue)}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Card>
      ),
    },
    {
      key: 'growth',
      label: 'Croissance',
      children: (
        <Card title="Métriques de croissance">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="Nouveaux clients ce mois"
                  value={1}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="Taux de rétention"
                  value={95}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="Croissance des réservations"
                  value={stats.growthRate}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Statistic
                  title="Croissance des revenus"
                  value={18.2}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Rapports globaux</Title>
          <Text type="secondary">Analytics et métriques de la plateforme</Text>
        </div>
        <Space>
          <RangePicker value={dateRange} onChange={setDateRange} />
          <Button type="primary" icon={<DownloadOutlined />}>
            Exporter le rapport
          </Button>
        </Space>
      </div>

      <Tabs items={tabItems} activeKey={reportType} onChange={setReportType} />
    </div>
  )
}

export default Reports

