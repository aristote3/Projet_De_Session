import React, { useState, useEffect } from 'react'
import { Card, Typography, Table, Tag, Button, Space, Input, Select, DatePicker, Row, Col, Statistic, Timeline, Alert, Tabs } from 'antd'
import { SearchOutlined, ReloadOutlined, DownloadOutlined, WarningOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

const AdminMonitoring = () => {
  const [auditLogs, setAuditLogs] = useState([])
  const [errorLogs, setErrorLogs] = useState([])
  const [securityEvents, setSecurityEvents] = useState([])
  const [apiUsage, setApiUsage] = useState([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'days'), dayjs()])
  const [logType, setLogType] = useState('audit')

  useEffect(() => {
    // TODO: Fetch logs from API
    setAuditLogs([
      {
        id: 1,
        timestamp: '2024-12-10T10:30:00',
        user: 'admin@youmanage.com',
        action: 'create',
        resource: 'client',
        resourceId: 123,
        details: 'Client "Acme Corp" créé',
        ip: '192.168.1.1',
      },
      {
        id: 2,
        timestamp: '2024-12-10T09:15:00',
        user: 'manager@acme.com',
        action: 'update',
        resource: 'booking',
        resourceId: 456,
        details: 'Réservation modifiée',
        ip: '192.168.1.2',
      },
    ])

    setErrorLogs([
      {
        id: 1,
        timestamp: '2024-12-10T11:00:00',
        level: 'error',
        message: 'Database connection timeout',
        stack: 'Error: Connection timeout...',
        user: 'system',
        endpoint: '/api/bookings',
      },
      {
        id: 2,
        timestamp: '2024-12-10T10:45:00',
        level: 'warning',
        message: 'API rate limit exceeded',
        stack: null,
        user: 'client-123',
        endpoint: '/api/resources',
      },
    ])

    setSecurityEvents([
      {
        id: 1,
        timestamp: '2024-12-10T12:00:00',
        type: 'failed_login',
        user: 'unknown@example.com',
        ip: '192.168.1.100',
        details: '5 tentatives de connexion échouées',
        severity: 'high',
      },
      {
        id: 2,
        timestamp: '2024-12-10T11:30:00',
        type: 'suspicious_activity',
        user: 'manager@acme.com',
        ip: '192.168.1.50',
        details: 'Accès depuis une nouvelle localisation',
        severity: 'medium',
      },
    ])

    setApiUsage([
      {
        id: 1,
        endpoint: '/api/bookings',
        method: 'GET',
        requests: 1250,
        avgResponseTime: 120,
        errorRate: 0.5,
        date: '2024-12-10',
      },
      {
        id: 2,
        endpoint: '/api/resources',
        method: 'GET',
        requests: 890,
        avgResponseTime: 95,
        errorRate: 0.2,
        date: '2024-12-10',
      },
    ])
  }, [])

  const getLogLevelColor = (level) => {
    const colorMap = {
      error: 'red',
      warning: 'orange',
      info: 'blue',
      success: 'green',
    }
    return colorMap[level] || 'default'
  }

  const getSeverityColor = (severity) => {
    const colorMap = {
      high: 'red',
      medium: 'orange',
      low: 'blue',
    }
    return colorMap[severity] || 'default'
  }

  const auditColumns = [
    {
      title: 'Date/Heure',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    },
    {
      title: 'Utilisateur',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={action === 'create' ? 'green' : action === 'update' ? 'blue' : action === 'delete' ? 'red' : 'default'}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Ressource',
      key: 'resource',
      render: (_, record) => `${record.resource} #${record.resourceId}`,
    },
    {
      title: 'Détails',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
  ]

  const errorColumns = [
    {
      title: 'Date/Heure',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Niveau',
      dataIndex: 'level',
      key: 'level',
      render: (level) => <Tag color={getLogLevelColor(level)}>{level.toUpperCase()}</Tag>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
    },
    {
      title: 'Utilisateur',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" onClick={() => message.info(record.stack || 'Pas de stack trace')}>
          Voir détails
        </Button>
      ),
    },
  ]

  const securityColumns = [
    {
      title: 'Date/Heure',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color="red">{type.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Utilisateur',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: 'Détails',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Sévérité',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Tag color={getSeverityColor(severity)}>{severity.toUpperCase()}</Tag>
      ),
    },
  ]

  const apiUsageColumns = [
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
    },
    {
      title: 'Méthode',
      dataIndex: 'method',
      key: 'method',
      render: (method) => (
        <Tag color={method === 'GET' ? 'blue' : method === 'POST' ? 'green' : method === 'PUT' ? 'orange' : 'red'}>
          {method}
        </Tag>
      ),
    },
    {
      title: 'Requêtes',
      dataIndex: 'requests',
      key: 'requests',
      sorter: (a, b) => a.requests - b.requests,
    },
    {
      title: 'Temps réponse moyen (ms)',
      dataIndex: 'avgResponseTime',
      key: 'avgResponseTime',
      sorter: (a, b) => a.avgResponseTime - b.avgResponseTime,
    },
    {
      title: 'Taux d\'erreur (%)',
      dataIndex: 'errorRate',
      key: 'errorRate',
      render: (rate) => (
        <Tag color={rate > 1 ? 'red' : rate > 0.5 ? 'orange' : 'green'}>
          {rate}%
        </Tag>
      ),
    },
  ]

  const stats = {
    totalLogs: auditLogs.length + errorLogs.length,
    errors: errorLogs.filter(e => e.level === 'error').length,
    securityAlerts: securityEvents.filter(e => e.severity === 'high').length,
    totalApiRequests: apiUsage.reduce((sum, u) => sum + u.requests, 0),
  }

  const tabItems = [
    {
      key: 'audit',
      label: 'Logs d\'audit',
      children: (
        <Card>
          <Table
            columns={auditColumns}
            dataSource={auditLogs}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      ),
    },
    {
      key: 'errors',
      label: 'Logs d\'erreurs',
      children: (
        <Card>
          <Table
            columns={errorColumns}
            dataSource={errorLogs}
            rowKey="id"
            pagination={{ pageSize: 20 }}
          />
        </Card>
      ),
    },
    {
      key: 'security',
      label: 'Événements de sécurité',
      children: (
        <Card>
          <Table
            columns={securityColumns}
            dataSource={securityEvents}
            rowKey="id"
            pagination={{ pageSize: 20 }}
          />
        </Card>
      ),
    },
    {
      key: 'api',
      label: 'Utilisation API',
      children: (
        <Card>
          <Table
            columns={apiUsageColumns}
            dataSource={apiUsage}
            rowKey="id"
            pagination={{ pageSize: 20 }}
          />
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Monitoring et logs</Title>
          <Text type="secondary">Surveillance système, logs et métriques de performance</Text>
        </div>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button icon={<ReloadOutlined />} onClick={() => message.info('Actualisation...')}>
            Actualiser
          </Button>
          <Button icon={<DownloadOutlined />}>
            Exporter
          </Button>
        </Space>
      </div>

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total logs"
              value={stats.totalLogs}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Erreurs"
              value={stats.errors}
              valueStyle={{ color: '#f5222d' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Alertes sécurité"
              value={stats.securityAlerts}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Requêtes API"
              value={stats.totalApiRequests}
              valueStyle={{ color: '#52c41a' }}
              prefix={<InfoCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Alertes critiques */}
      {stats.errors > 0 && (
        <Alert
          message="Erreurs détectées"
          description={`${stats.errors} erreur(s) dans les logs. Vérifiez l'onglet "Logs d'erreurs".`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {stats.securityAlerts > 0 && (
        <Alert
          message="Alertes de sécurité"
          description={`${stats.securityAlerts} alerte(s) de sécurité détectée(s).`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Tabs items={tabItems} />
    </div>
  )
}

export default AdminMonitoring


