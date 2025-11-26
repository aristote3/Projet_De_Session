import React, { useState } from 'react'
import { Card, Typography, Form, Switch, Input, Button, Space, Divider, Alert, message } from 'antd'
import { SettingOutlined, BellOutlined, SaveOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const { Title, Text } = Typography
const { TextArea } = Input

const ManagerSettings = () => {
  const { user } = useSelector((state) => state.auth)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async (values) => {
    setLoading(true)
    try {
      // TODO: Implémenter la sauvegarde des paramètres
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Paramètres sauvegardés avec succès')
      console.log('Settings saved:', values)
    } catch (error) {
      message.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Title level={2}>Paramètres opérationnels</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Configurez les règles locales et les notifications pour votre équipe
      </Text>

      <Alert
        message="Paramètres limités"
        description="En tant que gérant, vous pouvez configurer uniquement les paramètres opérationnels de votre département. Les paramètres système globaux sont réservés aux administrateurs."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          notifications: {
            newBooking: true,
            cancellation: true,
            conflict: true,
            maintenance: true,
          },
          rules: {
            autoApprove: false,
            requireApproval: true,
            maxAdvanceDays: 30,
          },
        }}
      >
        {/* Notifications */}
        <Card 
          title={
            <Space>
              <BellOutlined />
              <span>Notifications et alertes</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Form.Item label="Recevoir des notifications pour :">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item name={['notifications', 'newBooking']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Nouvelles réservations</Text>
              </Form.Item>
              <Form.Item name={['notifications', 'cancellation']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Annulations de réservations</Text>
              </Form.Item>
              <Form.Item name={['notifications', 'conflict']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Conflits de réservation</Text>
              </Form.Item>
              <Form.Item name={['notifications', 'maintenance']} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                <Text style={{ marginLeft: 12 }}>Ressources en maintenance</Text>
              </Form.Item>
            </Space>
          </Form.Item>

          <Divider />

          <Form.Item label="Email de notification" name="notificationEmail">
            <Input 
              type="email" 
              placeholder={user?.email || "votre@email.com"}
              disabled
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Les notifications seront envoyées à cette adresse
            </Text>
          </Form.Item>
        </Card>

        {/* Règles de réservation */}
        <Card 
          title={
            <Space>
              <SettingOutlined />
              <span>Règles de réservation locales</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Form.Item 
            label="Approbation automatique" 
            name={['rules', 'autoApprove']}
            valuePropName="checked"
            tooltip="Si activé, les réservations seront automatiquement approuvées sans validation manuelle"
          >
            <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
          </Form.Item>

          <Form.Item 
            label="Nécessite une approbation" 
            name={['rules', 'requireApproval']}
            valuePropName="checked"
            tooltip="Si activé, toutes les réservations nécessiteront votre approbation"
          >
            <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
          </Form.Item>

          <Form.Item 
            label="Jours d'avance maximum" 
            name={['rules', 'maxAdvanceDays']}
            tooltip="Nombre maximum de jours à l'avance pour effectuer une réservation"
          >
            <Input type="number" min={1} max={365} suffix="jours" />
          </Form.Item>

          <Form.Item 
            label="Notes pour l'équipe" 
            name="teamNotes"
            tooltip="Instructions ou notes visibles par votre équipe"
          >
            <TextArea 
              rows={4} 
              placeholder="Ajoutez des notes ou instructions pour votre équipe..."
            />
          </Form.Item>
        </Card>

        {/* Actions */}
        <Card>
          <Space>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              htmlType="submit"
              loading={loading}
            >
              Enregistrer les paramètres
            </Button>
            <Button onClick={() => form.resetFields()}>
              Réinitialiser
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  )
}

export default ManagerSettings

