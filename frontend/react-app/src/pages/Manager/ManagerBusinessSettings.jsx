import React, { useState, useEffect } from 'react'
import { Card, Typography, Form, Switch, Input, Button, Space, Divider, Alert, message, InputNumber, DatePicker, Select, Row, Col, Tabs, TimePicker, List, Modal } from 'antd'
import { SettingOutlined, BellOutlined, SaveOutlined, ClockCircleOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import api from '../../utils/api'

const { Title, Text } = Typography
const { TextArea } = Input
const { RangePicker } = DatePicker

const ManagerBusinessSettings = () => {
  const { user } = useSelector((state) => state.auth)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [holidays, setHolidays] = useState([])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings/business')
        const settings = response.data.data || {}
        form.setFieldsValue(settings)
        if (settings.holidays) {
          setHolidays(settings.holidays)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error)
      }
    }
    fetchSettings()
  }, [form])

  const handleSave = async (values) => {
    setLoading(true)
    try {
      await api.post('/settings/business', values)
      message.success('Paramètres business sauvegardés avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHoliday = () => {
    Modal.confirm({
      title: 'Ajouter un jour férié',
      content: (
        <DatePicker
          style={{ width: '100%', marginTop: 16 }}
          placeholder="Sélectionner une date"
        />
      ),
      onOk: () => {
        // TODO: Add holiday
        message.success('Jour férié ajouté')
      },
    })
  }

  const tabItems = [
    {
      key: 'hours',
      label: (
        <Space>
          <ClockCircleOutlined />
          <span>Heures d'ouverture</span>
        </Space>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            businessHours: {
              monday: { open: '09:00', close: '18:00', closed: false },
              tuesday: { open: '09:00', close: '18:00', closed: false },
              wednesday: { open: '09:00', close: '18:00', closed: false },
              thursday: { open: '09:00', close: '18:00', closed: false },
              friday: { open: '09:00', close: '18:00', closed: false },
              saturday: { open: '10:00', close: '16:00', closed: false },
              sunday: { open: null, close: null, closed: true },
            },
          }}
        >
          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => {
            const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index]
            return (
              <Form.Item key={dayKey} label={day}>
                <Space>
                  <Form.Item name={['businessHours', dayKey, 'closed']} valuePropName="checked" noStyle>
                    <Switch checkedChildren="Ouvert" unCheckedChildren="Fermé" />
                  </Form.Item>
                  <Form.Item
                    name={['businessHours', dayKey, 'open']}
                    noStyle
                    dependencies={[['businessHours', dayKey, 'closed']]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="Ouverture"
                      disabled={form.getFieldValue(['businessHours', dayKey, 'closed'])}
                    />
                  </Form.Item>
                  <span>-</span>
                  <Form.Item
                    name={['businessHours', dayKey, 'close']}
                    noStyle
                    dependencies={[['businessHours', dayKey, 'closed']]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder="Fermeture"
                      disabled={form.getFieldValue(['businessHours', dayKey, 'closed'])}
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
            )
          })}
        </Form>
      ),
    },
    {
      key: 'holidays',
      label: (
        <Space>
          <CalendarOutlined />
          <span>Jours fériés</span>
        </Space>
      ),
      children: (
        <div>
          <Button type="dashed" onClick={handleAddHoliday} block style={{ marginBottom: 16 }}>
            + Ajouter un jour férié
          </Button>
          {holidays.length === 0 ? (
            <Alert
              message="Aucun jour férié configuré"
              description="Les jours fériés empêchent les réservations pour ces dates."
              type="info"
            />
          ) : (
            <List
              dataSource={holidays}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button danger size="small">Supprimer</Button>
                  ]}
                >
                  {dayjs(item).format('DD MMMM YYYY')}
                </List.Item>
              )}
            />
          )}
        </div>
      ),
    },
    {
      key: 'policies',
      label: (
        <Space>
          <SettingOutlined />
          <span>Politiques de réservation</span>
        </Space>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            policies: {
              maxDailyBookingsPerUser: 5,
              maxAdvanceDays: 90,
              minAdvanceHours: 1,
              cancellationDeadlineHours: 24,
              requireApproval: true,
              autoApprove: false,
            },
          }}
        >
          <Form.Item
            name={['policies', 'maxDailyBookingsPerUser']}
            label="Réservations maximum par jour (par utilisateur)"
            tooltip="Nombre maximum de réservations qu'un utilisateur peut faire par jour"
          >
            <InputNumber min={1} max={50} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name={['policies', 'maxAdvanceDays']}
            label="Jours d'avance maximum"
            tooltip="Nombre maximum de jours à l'avance pour effectuer une réservation"
          >
            <InputNumber min={1} max={365} style={{ width: '100%' }} suffix="jours" />
          </Form.Item>

          <Form.Item
            name={['policies', 'minAdvanceHours']}
            label="Heures d'avance minimum"
            tooltip="Nombre minimum d'heures à l'avance pour effectuer une réservation"
          >
            <InputNumber min={0} max={168} style={{ width: '100%' }} suffix="heures" />
          </Form.Item>

          <Form.Item
            name={['policies', 'cancellationDeadlineHours']}
            label="Délai d'annulation (heures)"
            tooltip="Nombre d'heures avant le début de la réservation pour pouvoir annuler"
          >
            <InputNumber min={0} max={168} style={{ width: '100%' }} suffix="heures" />
          </Form.Item>

          <Divider />

          <Form.Item
            name={['policies', 'requireApproval']}
            label="Nécessite une approbation"
            valuePropName="checked"
            tooltip="Si activé, toutes les réservations nécessiteront votre approbation"
          >
            <Switch checkedChildren="Oui" unCheckedChildren="Non" />
          </Form.Item>

          <Form.Item
            name={['policies', 'autoApprove']}
            label="Approbation automatique"
            valuePropName="checked"
            tooltip="Si activé, les réservations seront automatiquement approuvées"
          >
            <Switch checkedChildren="Oui" unCheckedChildren="Non" />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'notifications',
      label: (
        <Space>
          <BellOutlined />
          <span>Notifications</span>
        </Space>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            notifications: {
              email: true,
              sms: false,
              bookingConfirmation: true,
              bookingReminder: true,
              bookingCancellation: true,
              approvalRequest: true,
              reminderHours: 24,
            },
          }}
        >
          <Form.Item label="Canaux de notification">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item name={['notifications', 'email']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Email</Text>
              </Form.Item>
              <Form.Item name={['notifications', 'sms']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>SMS</Text>
              </Form.Item>
            </Space>
          </Form.Item>

          <Divider />

          <Form.Item label="Types de notifications">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item name={['notifications', 'bookingConfirmation']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Confirmations de réservation</Text>
              </Form.Item>
              <Form.Item name={['notifications', 'bookingReminder']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Rappels avant réservation</Text>
              </Form.Item>
              <Form.Item name={['notifications', 'bookingCancellation']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Annulations</Text>
              </Form.Item>
              <Form.Item name={['notifications', 'approvalRequest']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Demandes d'approbation</Text>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item
            name={['notifications', 'reminderHours']}
            label="Heures avant rappel"
            tooltip="Nombre d'heures avant une réservation pour envoyer un rappel"
          >
            <InputNumber min={1} max={168} style={{ width: '100%' }} suffix="heures" />
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Configuration business</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Configurez les horaires, politiques et règles de réservation pour votre organisation
      </Text>

      <Tabs items={tabItems} />

      <Card style={{ marginTop: 24 }}>
        <Space>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            htmlType="submit"
            loading={loading}
            onClick={() => form.submit()}
          >
            Enregistrer tous les paramètres
          </Button>
          <Button onClick={() => form.resetFields()}>
            Réinitialiser
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default ManagerBusinessSettings

