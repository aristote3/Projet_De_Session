import React, { useState, useEffect } from 'react'
import { Card, Typography, Form, Input, Button, Switch, Select, InputNumber, message, Row, Col, Divider, Tabs, Space, Tag, Modal, Alert } from 'antd'
import { SaveOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons'
import api from '../../utils/api'

const { Title, Text } = Typography
const { TextArea } = Input

const AdminPlatformSettings = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    resourceCategories: ['Salle', 'Équipement', 'Service', 'Personnel'],
    defaultBookingRules: {
      maxDuration: 24,
      bufferMinutes: 15,
      requireApproval: false,
      maxAdvanceDays: 90,
    },
    notificationTemplates: {
      bookingConfirmation: 'Votre réservation a été confirmée',
      bookingReminder: 'Rappel : votre réservation approche',
      bookingCancelled: 'Votre réservation a été annulée',
    },
    branding: {
      platformName: 'YouManage',
      primaryColor: '#1890ff',
      logoUrl: '',
    },
    apiLimits: {
      rateLimit: 1000,
      rateLimitWindow: 60,
      maxRequestsPerMinute: 100,
    },
    maintenanceMode: false,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings/platform')
        const platformSettings = response.data.data || settings
        setSettings(platformSettings)
        form.setFieldsValue(platformSettings)
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error)
        form.setFieldsValue(settings)
      }
    }
    fetchSettings()
  }, [form])

  const handleSave = async (values) => {
    setLoading(true)
    try {
      await api.post('/settings/platform', values)
      message.success('Paramètres sauvegardés')
      setSettings(values)
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    Modal.confirm({
      title: 'Réinitialiser les paramètres',
      content: 'Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?',
      onOk: () => {
        form.setFieldsValue(settings)
        message.success('Paramètres réinitialisés')
      },
    })
  }

  const tabItems = [
    {
      key: 'categories',
      label: 'Catégories de ressources',
      children: (
        <Card>
          <Form.Item
            name="resourceCategories"
            label="Catégories par défaut"
            tooltip="Catégories disponibles pour tous les managers"
          >
            <Select mode="tags" placeholder="Ajouter une catégorie">
              {settings.resourceCategories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Text type="secondary">
            Ces catégories seront disponibles pour tous les managers lors de la création de ressources.
          </Text>
        </Card>
      ),
    },
    {
      key: 'rules',
      label: 'Règles de réservation',
      children: (
        <Card>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name={['defaultBookingRules', 'maxDuration']}
                label="Durée maximale (heures)"
                tooltip="Durée maximale d'une réservation"
              >
                <InputNumber min={1} max={168} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={['defaultBookingRules', 'bufferMinutes']}
                label="Tampon entre réservations (minutes)"
                tooltip="Temps minimum entre deux réservations"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name={['defaultBookingRules', 'maxAdvanceDays']}
                label="Jours d'avance maximum"
                tooltip="Nombre de jours à l'avance pour réserver"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={['defaultBookingRules', 'requireApproval']}
                label="Approbation requise par défaut"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: 'Templates de notifications',
      children: (
        <Card>
          <Form.Item
            name={['notificationTemplates', 'bookingConfirmation']}
            label="Confirmation de réservation"
          >
            <TextArea rows={3} placeholder="Template pour la confirmation..." />
          </Form.Item>

          <Form.Item
            name={['notificationTemplates', 'bookingReminder']}
            label="Rappel de réservation"
          >
            <TextArea rows={3} placeholder="Template pour le rappel..." />
          </Form.Item>

          <Form.Item
            name={['notificationTemplates', 'bookingCancelled']}
            label="Annulation de réservation"
          >
            <TextArea rows={3} placeholder="Template pour l'annulation..." />
          </Form.Item>

          <Text type="secondary">
            Variables disponibles: {'{userName}'}, {'{resourceName}'}, {'{startTime}'}, {'{endTime}'}
          </Text>
        </Card>
      ),
    },
    {
      key: 'branding',
      label: 'Branding',
      children: (
        <Card>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name={['branding', 'platformName']}
                label="Nom de la plateforme"
              >
                <Input placeholder="YouManage" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={['branding', 'primaryColor']}
                label="Couleur principale"
              >
                <Input type="color" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={['branding', 'logoUrl']}
            label="URL du logo"
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Card>
      ),
    },
    {
      key: 'api',
      label: 'Limites API',
      children: (
        <Card>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={['apiLimits', 'rateLimit']}
                label="Limite de taux"
                tooltip="Nombre de requêtes autorisées"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['apiLimits', 'rateLimitWindow']}
                label="Fenêtre (secondes)"
                tooltip="Période de temps pour la limite"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['apiLimits', 'maxRequestsPerMinute']}
                label="Max requêtes/minute"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: 'maintenance',
      label: 'Maintenance',
      children: (
        <Card>
          <Form.Item
            name="maintenanceMode"
            label="Mode maintenance"
            valuePropName="checked"
            tooltip="Active le mode maintenance pour toute la plateforme"
          >
            <Switch />
          </Form.Item>

          {settings.maintenanceMode && (
            <Alert
              message="Mode maintenance actif"
              description="La plateforme est actuellement en maintenance. Seuls les admins peuvent y accéder."
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}

          <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
            En mode maintenance, tous les utilisateurs (sauf admins) verront une page de maintenance.
          </Text>
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Configuration de la plateforme</Title>
          <Text type="secondary">Paramètres globaux affectant tous les managers</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Réinitialiser
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={settings}
      >
        <Card>
          <Tabs items={tabItems} />

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={loading}>
                Sauvegarder tous les paramètres
              </Button>
              <Button onClick={handleReset}>
                Réinitialiser
              </Button>
            </Space>
          </Form.Item>
        </Card>
      </Form>
    </div>
  )
}

export default AdminPlatformSettings

