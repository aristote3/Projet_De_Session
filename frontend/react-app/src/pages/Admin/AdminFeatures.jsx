import React, { useState, useEffect } from 'react'
import { Card, Typography, Table, Tag, Button, Space, Switch, Input, Select, Modal, Form, message, Row, Col, Statistic, Alert, Divider, Timeline, Badge } from 'antd'
import { ThunderboltOutlined, PlusOutlined, EditOutlined, DeleteOutlined, RocketOutlined, ExperimentOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import api from '../../utils/api'

const { Title, Text } = Typography
const { TextArea } = Input

const AdminFeatures = () => {
  const [features, setFeatures] = useState([])
  const [releases, setReleases] = useState([])
  const [loading, setLoading] = useState(false)
  const [isFeatureModalVisible, setIsFeatureModalVisible] = useState(false)
  const [isReleaseModalVisible, setIsReleaseModalVisible] = useState(false)
  const [editingFeature, setEditingFeature] = useState(null)
  const [featureForm] = Form.useForm()
  const [releaseForm] = Form.useForm()

  const fetchData = async () => {
    try {
      const response = await api.get('/features')
      const featuresData = (response.data.data || []).map(feature => ({
        ...feature,
        targetTenants: feature.target_tenants || feature.targetTenants,
        createdAt: feature.created_at || feature.createdAt,
      }))
      setFeatures(featuresData)
    } catch (error) {
      console.error('Erreur lors du chargement des fonctionnalités:', error)
      message.error('Erreur lors du chargement des fonctionnalités')
    }
  }

  useEffect(() => {
    fetchData()
    
    // Releases reste mocké pour l'instant (pas d'API encore)
    setReleases([
      {
        id: 1,
        version: '2.1.0',
        name: 'Améliorations majeures',
        description: 'Nouvelle interface, amélioration des performances',
        status: 'released',
        releaseDate: '2024-12-05',
        targetTenants: 'all',
        changelog: [
          'Nouvelle interface utilisateur',
          'Amélioration des performances de 40%',
          'Correction de bugs critiques',
        ],
      },
      {
        id: 2,
        version: '2.2.0',
        name: 'Fonctionnalités avancées',
        description: 'Export Excel, notifications SMS',
        status: 'scheduled',
        releaseDate: '2024-12-20',
        targetTenants: 'all',
        changelog: [
          'Export Excel disponible',
          'Notifications SMS (beta)',
          'Amélioration du système de réservation',
        ],
      },
      {
        id: 3,
        version: '2.0.5',
        name: 'Correctif de sécurité',
        description: 'Patch de sécurité important',
        status: 'released',
        releaseDate: '2024-11-28',
        targetTenants: 'all',
        changelog: [
          'Correction de vulnérabilité de sécurité',
          'Amélioration de l\'authentification',
        ],
      },
    ])
  }, [])

  const handleToggleFeature = async (featureId, enabled) => {
    try {
      await api.put(`/features/${featureId}`, {
        status: enabled ? 'enabled' : 'disabled',
      })
      message.success(`Fonctionnalité ${enabled ? 'activée' : 'désactivée'}`)
      await fetchData()
    } catch (error) {
      console.error('Erreur:', error)
      message.error('Erreur lors de la modification')
    }
  }

  const handleAddFeature = () => {
    setEditingFeature(null)
    featureForm.resetFields()
    setIsFeatureModalVisible(true)
  }

  const handleEditFeature = (feature) => {
    setEditingFeature(feature)
    featureForm.setFieldsValue({
      name: feature.name,
      key: feature.key,
      description: feature.description,
      status: feature.status,
      rollout: feature.rollout,
      targetTenants: feature.target_tenants || feature.targetTenants,
      config: feature.config || {},
    })
    setIsFeatureModalVisible(true)
  }

  const handleSaveFeature = async (values) => {
    setLoading(true)
    try {
      if (editingFeature) {
        await api.put(`/features/${editingFeature.id}`, {
          name: values.name,
          key: values.key,
          description: values.description,
          status: values.status || 'disabled',
          rollout: values.rollout || 0,
          target_tenants: values.targetTenants || 'all',
          config: values.config || {},
        })
        message.success('Fonctionnalité modifiée')
      } else {
        await api.post('/features', {
          name: values.name,
          key: values.key,
          description: values.description,
          status: values.status || 'disabled',
          rollout: values.rollout || 0,
          target_tenants: values.targetTenants || 'all',
          config: values.config || {},
        })
        message.success('Fonctionnalité créée')
      }
      
      setIsFeatureModalVisible(false)
      setEditingFeature(null)
      featureForm.resetFields()
      await fetchData()
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.key?.[0] || 'Erreur lors de la sauvegarde'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleRelease = () => {
    releaseForm.resetFields()
    setIsReleaseModalVisible(true)
  }

  const handleSaveRelease = async (values) => {
    setLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Release planifiée')
      setIsReleaseModalVisible(false)
      releaseForm.resetFields()
    } catch (error) {
      message.error('Erreur lors de la planification')
    } finally {
      setLoading(false)
    }
  }

  const handleDeployRelease = (releaseId) => {
    Modal.confirm({
      title: 'Déployer la release',
      content: 'Êtes-vous sûr de vouloir déployer cette release maintenant ?',
      onOk: () => {
        message.success('Release déployée')
        // TODO: API call
        setReleases(releases.map(r => r.id === releaseId ? { ...r, status: 'released', releaseDate: dayjs().format('YYYY-MM-DD') } : r))
      },
    })
  }

  const getFeatureStatusColor = (status) => {
    const colorMap = {
      enabled: 'green',
      beta: 'orange',
      disabled: 'default',
    }
    return colorMap[status] || 'default'
  }

  const getReleaseStatusColor = (status) => {
    const colorMap = {
      released: 'green',
      scheduled: 'blue',
      draft: 'default',
    }
    return colorMap[status] || 'default'
  }

  const stats = {
    enabledFeatures: features.filter(f => f.status === 'enabled').length,
    betaFeatures: features.filter(f => f.status === 'beta').length,
    scheduledReleases: releases.filter(r => r.status === 'scheduled').length,
    totalReleases: releases.length,
  }

  const featureColumns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Clé',
      dataIndex: 'key',
      key: 'key',
      render: (key) => <Text code>{key}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getFeatureStatusColor(status)}>
          {status === 'enabled' ? 'Activé' : status === 'beta' ? 'Beta' : 'Désactivé'}
        </Tag>
      ),
    },
    {
      title: 'Déploiement',
      dataIndex: 'rollout',
      key: 'rollout',
      render: (rollout) => `${rollout}%`,
    },
    {
      title: 'Cible',
      dataIndex: 'targetTenants',
      key: 'targetTenants',
      render: (target) => (
        <Tag>{target === 'all' ? 'Tous' : target === 'premium' ? 'Premium' : 'Aucun'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Switch
            checked={record.status === 'enabled' || record.status === 'beta'}
            onChange={(checked) => handleToggleFeature(record.id, checked)}
          />
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditFeature(record)}>
            Modifier
          </Button>
          <Button 
            size="small" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={async () => {
              Modal.confirm({
                title: 'Supprimer la fonctionnalité',
                content: 'Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?',
                okText: 'Supprimer',
                okType: 'danger',
                onOk: async () => {
                  try {
                    await api.delete(`/features/${record.id}`)
                    message.success('Fonctionnalité supprimée')
                    await fetchData()
                  } catch (error) {
                    console.error('Erreur:', error)
                    message.error('Erreur lors de la suppression')
                  }
                },
              })
            }}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Feature flags et releases</Title>
          <Text type="secondary">Gérer les fonctionnalités, déploiements et versions</Text>
        </div>
        <Space>
          <Button icon={<PlusOutlined />} onClick={handleAddFeature}>
            Nouvelle fonctionnalité
          </Button>
          <Button type="primary" icon={<RocketOutlined />} onClick={handleScheduleRelease}>
            Planifier une release
          </Button>
        </Space>
      </div>

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Fonctionnalités activées"
              value={stats.enabledFeatures}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="En beta"
              value={stats.betaFeatures}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Releases planifiées"
              value={stats.scheduledReleases}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total releases"
              value={stats.totalReleases}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined />
                <span>Feature flags</span>
              </Space>
            }
          >
            <Table
              columns={featureColumns}
              dataSource={features}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <RocketOutlined />
                <span>Releases</span>
              </Space>
          }
          >
            <Timeline
              items={releases.map(release => ({
                color: getReleaseStatusColor(release.status),
                children: (
                  <div>
                    <Space>
                      <Text strong>{release.version}</Text>
                      <Tag color={getReleaseStatusColor(release.status)}>
                        {release.status === 'released' ? 'Déployé' : release.status === 'scheduled' ? 'Planifié' : 'Brouillon'}
                      </Tag>
                    </Space>
                    <div style={{ marginTop: 4 }}>
                      <Text>{release.name}</Text>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {release.status === 'released' 
                          ? `Déployé le ${dayjs(release.releaseDate).format('DD/MM/YYYY')}`
                          : `Planifié pour le ${dayjs(release.releaseDate).format('DD/MM/YYYY')}`
                        }
                      </Text>
                    </div>
                    {release.status === 'scheduled' && (
                      <div style={{ marginTop: 8 }}>
                        <Button 
                          size="small" 
                          type="primary"
                          onClick={() => handleDeployRelease(release.id)}
                        >
                          Déployer maintenant
                        </Button>
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal Feature */}
      <Modal
        title={editingFeature ? 'Modifier la fonctionnalité' : 'Nouvelle fonctionnalité'}
        open={isFeatureModalVisible}
        onCancel={() => {
          setIsFeatureModalVisible(false)
          setEditingFeature(null)
          featureForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={featureForm}
          layout="vertical"
          onFinish={handleSaveFeature}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true }]}
          >
            <Input placeholder="Export Excel" />
          </Form.Item>
          <Form.Item
            name="key"
            label="Clé (identifiant unique)"
            rules={[{ required: true }]}
          >
            <Input placeholder="export_excel" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Description de la fonctionnalité..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Statut"
                initialValue="disabled"
              >
                <Select>
                  <Select.Option value="enabled">Activé</Select.Option>
                  <Select.Option value="beta">Beta</Select.Option>
                  <Select.Option value="disabled">Désactivé</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rollout"
                label="Déploiement (%)"
                initialValue={0}
              >
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="targetTenants"
            label="Cible"
            initialValue="none"
          >
            <Select>
              <Select.Option value="all">Tous les clients</Select.Option>
              <Select.Option value="premium">Clients Premium uniquement</Select.Option>
              <Select.Option value="none">Aucun</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingFeature ? 'Modifier' : 'Créer'}
              </Button>
              <Button onClick={() => {
                setIsFeatureModalVisible(false)
                setEditingFeature(null)
                featureForm.resetFields()
              }}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Release */}
      <Modal
        title="Planifier une release"
        open={isReleaseModalVisible}
        onCancel={() => {
          setIsReleaseModalVisible(false)
          releaseForm.resetFields()
        }}
        footer={null}
        width={700}
      >
        <Form
          form={releaseForm}
          layout="vertical"
          onFinish={handleSaveRelease}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="version"
                label="Version"
                rules={[{ required: true }]}
              >
                <Input placeholder="2.3.0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="releaseDate"
                label="Date de release"
                rules={[{ required: true }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="name"
            label="Nom de la release"
            rules={[{ required: true }]}
          >
            <Input placeholder="Améliorations majeures" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} placeholder="Description de la release..." />
          </Form.Item>
          <Form.Item
            name="changelog"
            label="Changelog (une ligne par élément)"
          >
            <TextArea rows={5} placeholder="Nouvelle fonctionnalité X&#10;Correction de bug Y&#10;..." />
          </Form.Item>
          <Form.Item
            name="targetTenants"
            label="Cible"
            initialValue="all"
          >
            <Select>
              <Select.Option value="all">Tous les clients</Select.Option>
              <Select.Option value="premium">Clients Premium uniquement</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Planifier
              </Button>
              <Button onClick={() => {
                setIsReleaseModalVisible(false)
                releaseForm.resetFields()
              }}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminFeatures

