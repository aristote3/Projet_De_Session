import React, { useState, useEffect } from 'react'
import { Card, Typography, Form, Input, Button, Space, Upload, Avatar, message, Divider, Switch, Row, Col } from 'antd'
import { UserOutlined, CameraOutlined, SaveOutlined, LockOutlined, BellOutlined, MailOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../../store/slices/authSlice'

const { Title, Text } = Typography

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null)

  useEffect(() => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      notifications: {
        email: user?.notification_preferences?.email !== false,
        sms: user?.notification_preferences?.sms || false,
        push: user?.notification_preferences?.push !== false,
        bookingConfirmation: user?.notification_preferences?.bookingConfirmation !== false,
        bookingReminder: user?.notification_preferences?.bookingReminder !== false,
        bookingCancellation: user?.notification_preferences?.bookingCancellation !== false,
      },
    })
  }, [user, form])

  const handleSaveProfile = async (values) => {
    setLoading(true)
    try {
      // TODO: API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch(setUser({
        ...user,
        ...values,
        avatar: avatarUrl,
      }))
      
      message.success('Profil mis à jour avec succès')
    } catch (error) {
      message.error('Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Mot de passe modifié avec succès')
      passwordForm.resetFields()
    } catch (error) {
      message.error('Erreur lors du changement de mot de passe')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // TODO: Upload to server and get URL
      const url = URL.createObjectURL(info.file.originFileObj)
      setAvatarUrl(url)
      message.success('Photo de profil mise à jour')
    }
  }

  const uploadProps = {
    name: 'avatar',
    listType: 'picture-card',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('Vous ne pouvez télécharger que des fichiers JPG/PNG!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('L\'image doit faire moins de 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    onChange: handleAvatarChange,
  }

  return (
    <div>
      <Title level={2}>Mon profil</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Gérez vos informations personnelles et vos préférences
      </Text>

      <Row gutter={[24, 24]}>
        {/* Informations personnelles */}
        <Col xs={24} lg={16}>
          <Card title="Informations personnelles" style={{ marginBottom: 24 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveProfile}
              initialValues={{
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
              }}
            >
              <Form.Item
                name="name"
                label="Nom complet"
                rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Votre nom" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Veuillez entrer votre email' },
                  { type: 'email', message: 'Email invalide' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="votre@email.com" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Téléphone"
              >
                <Input placeholder="+33 1 23 45 67 89" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  Enregistrer les modifications
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Photo de profil */}
          <Card title="Photo de profil">
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Avatar
                size={120}
                src={avatarUrl}
                icon={<UserOutlined />}
              />
              <Upload {...uploadProps}>
                <Button icon={<CameraOutlined />}>
                  Changer la photo
                </Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                JPG ou PNG, max 2MB
              </Text>
            </Space>
          </Card>
        </Col>

        {/* Préférences de notification */}
        <Col xs={24} lg={8}>
          <Card title={
            <Space>
              <BellOutlined />
              <span>Notifications</span>
            </Space>
          }>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveProfile}
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
                  <Form.Item name={['notifications', 'push']} valuePropName="checked" style={{ marginBottom: 0 }}>
                    <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" />
                    <Text style={{ marginLeft: 12 }}>Notifications push</Text>
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
                </Space>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Enregistrer
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Changement de mot de passe */}
      <Card title={
        <Space>
          <LockOutlined />
          <span>Changer le mot de passe</span>
        </Space>
      } style={{ marginTop: 24 }}>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mot de passe actuel"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe actuel' }]}
          >
            <Input.Password placeholder="Mot de passe actuel" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nouveau mot de passe"
            rules={[
              { required: true, message: 'Veuillez entrer un nouveau mot de passe' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
            ]}
          >
            <Input.Password placeholder="Nouveau mot de passe" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmer le nouveau mot de passe"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Veuillez confirmer le mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirmer le mot de passe" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<LockOutlined />} loading={loading}>
              Changer le mot de passe
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default UserProfile

