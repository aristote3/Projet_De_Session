import React, { useState, useEffect } from 'react'
import { Card, Typography, Table, Tag, Button, Space, Input, Select, DatePicker, Row, Col, Statistic, Timeline, Alert, Tabs, message } from 'antd'
import { SearchOutlined, ReloadOutlined, DownloadOutlined, WarningOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import api from '../../utils/api'

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
    const fetchLogs = async () => {
      try {
        setLoading(true)
        
        // Fetch audit trail
        if (logType === 'audit') {
          const response = await api.get('/admin/audit-trail', {
            params: {
              per_page: 50,
            }
          })

          const logs = response.data.data || []
          const auditLogsData = logs.map((log) => ({
            id: log.id,
            timestamp: log.created_at,
            user: log.user?.email || 'Unknown',
            action: log.action || 'unknown',
            resource: log.model_type || 'unknown',
            resourceId: log.model_id || 0,
            details: log.changes ? JSON.stringify(log.changes) : log.action,
            ip: log.ip_address || 'N/A',
          }))

          setAuditLogs(auditLogsData)
        }
        
        // Fetch error logs
        if (logType === 'errors') {
          const errorResponse = await api.get('/admin/error-logs', {
            params: {
              lines: 100,
            }
          })
          
          const errorLogsData = (errorResponse.data.data || []).map((log, index) => ({
            id: index,
            timestamp: log.timestamp,
            level: log.level,
            message: log.message,
            endpoint: log.message.match(/\[.*?\]/)?.[0] || 'N/A',
            user: 'System',
            stack: log.stack,
          }))
          
          setErrorLogs(errorLogsData)
        }
        
        // Fetch security events
        if (logType === 'security') {
          const securityResponse = await api.get('/admin/security-events', {
            params: {
              per_page: 50,
            }
          })
          
          const securityData = (securityResponse.data.data || []).map((event) => ({
            id: event.id,
            timestamp: event.timestamp,
            type: event.type,
            user: event.user,
            ip: event.ip,
            details: event.details,
            severity: event.severity,
          }))
          
          setSecurityEvents(securityData)
        }
        
        // Fetch API usage
        if (logType === 'api') {
          const apiResponse = await api.get('/admin/api-usage', {
            params: {
              start_date: dateRange[0].format('YYYY-MM-DD'),
              end_date: dateRange[1].format('YYYY-MM-DD'),
            }
          })
          
          const apiUsageData = (apiResponse.data.data || []).map((usage, index) => ({
            id: index,
            endpoint: usage.endpoint,
            method: usage.method,
            requests: usage.requests,
            avgResponseTime: usage.avgResponseTime,
            errorRate: usage.errorRate || 0,
          }))
          
          setApiUsage(apiUsageData)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors du chargement des logs:', error)
        // Fallback to empty arrays
        setAuditLogs([])
        setErrorLogs([])
        setSecurityEvents([])
        setApiUsage([])
        setLoading(false)
      }
    }

    fetchLogs()
  }, [dateRange, logType])

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
          <Button icon={<ReloadOutlined />} onClick={() => {
            setLogType(logType)
            message.info('Actualisation...')
          }}>
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


