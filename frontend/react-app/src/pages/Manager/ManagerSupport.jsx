import React, { useState, useEffect } from 'react'
import { Card, Typography, Form, Input, Button, Space, message, List, Avatar, Tag, Divider, Row, Col, Select, Alert } from 'antd'
import { CustomerServiceOutlined, SendOutlined, MessageOutlined, MailOutlined, PhoneOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import api from '../../utils/api'

const { Title, Text } = Typography
const { TextArea } = Input

const ManagerSupport = () => {
  const { user } = useSelector((state) => state.auth)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [announcementForm] = Form.useForm()
  const [announcementLoading, setAnnouncementLoading] = useState(false)

  const [supportTickets, setSupportTickets] = useState([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/support/tickets', {
          params: {
            user_id: user?.id,
          }
        })
        const ticketsData = (response.data.data || []).map(ticket => ({
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.created_at,
          lastMessage: ticket.message.substring(0, 100) + '...',
        }))
        setSupportTickets(ticketsData)
      } catch (error) {
        console.error('Erreur lors du chargement des tickets:', error)
      }
    }

    if (user) {
      fetchTickets()
    }
  }, [user])

  const handleSubmitTicket = async (values) => {
    setLoading(true)
    try {
      await api.post('/support/tickets', {
        subject: values.subject,
        message: values.message,
        category: values.category || 'other',
        priority: values.priority || 'medium',
      })
      message.success('Ticket de support créé avec succès. Notre équipe vous répondra sous peu.')
      form.resetFields()
      // Recharger les tickets
      const response = await api.get('/support/tickets', {
        params: { user_id: user?.id }
      })
      const ticketsData = (response.data.data || []).map(ticket => ({
        id: ticket.id,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.created_at,
        lastMessage: ticket.message.substring(0, 100) + '...',
      }))
      setSupportTickets(ticketsData)
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création du ticket'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSendAnnouncement = async (values) => {
    setAnnouncementLoading(true)
    try {
      await api.post('/messages/broadcast', {
        subject: values.subject,
        content: values.content,
        channel: 'all',
      })
      message.success('Annonce envoyée à tous vos utilisateurs')
      announcementForm.resetFields()
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'annonce'
      message.error(errorMessage)
    } finally {
      setAnnouncementLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colorMap = {
      open: 'orange',
      in_progress: 'blue',
      resolved: 'green',
      closed: 'default',
    }
    return colorMap[status] || 'default'
  }

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'red',
      medium: 'orange',
      low: 'blue',
    }
    return colorMap[priority] || 'default'
  }

  return (
    <div>
      <Title level={2}>Support et communication</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Contactez le support de la plateforme ou communiquez avec vos utilisateurs
      </Text>

      <Row gutter={[24, 24]}>
        {/* Contacter le support */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CustomerServiceOutlined />
                <span>Contacter le support</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitTicket}
            >
              <Form.Item
                name="subject"
                label="Sujet"
                rules={[{ required: true, message: 'Veuillez entrer un sujet' }]}
              >
                <Input placeholder="Résumez votre problème..." />
              </Form.Item>

              <Form.Item
                name="priority"
                label="Priorité"
                initialValue="medium"
              >
                <Select>
                  <Select.Option value="low">Basse</Select.Option>
                  <Select.Option value="medium">Moyenne</Select.Option>
                  <Select.Option value="high">Haute</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Veuillez entrer un message' }]}
              >
                <TextArea rows={6} placeholder="Décrivez votre problème en détail..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} block>
                  Envoyer le ticket
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Autres moyens de contact :</Text>
              <Space>
                <MailOutlined />
                <Text>support@youmanage.com</Text>
              </Space>
              <Space>
                <PhoneOutlined />
                <Text>+33 1 23 45 67 89</Text>
              </Space>
              <Space>
                <QuestionCircleOutlined />
                <Button type="link" href="/help" target="_blank">
                  Centre d'aide
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* Envoyer une annonce */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <MessageOutlined />
                <span>Envoyer une annonce</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Alert
              message="Annonce aux utilisateurs"
              description="Envoyez un message à tous les utilisateurs de votre organisation."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form
              form={announcementForm}
              layout="vertical"
              onFinish={handleSendAnnouncement}
            >
              <Form.Item
                name="subject"
                label="Sujet"
                rules={[{ required: true, message: 'Veuillez entrer un sujet' }]}
              >
                <Input placeholder="Sujet de l'annonce..." />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Veuillez entrer un message' }]}
              >
                <TextArea rows={6} placeholder="Contenu de l'annonce..." />
              </Form.Item>

              <Form.Item
                name="channels"
                label="Canaux"
                initialValue={['email', 'in_app']}
              >
                <Select mode="multiple">
                  <Select.Option value="email">Email</Select.Option>
                  <Select.Option value="in_app">Dans l'application</Select.Option>
                  <Select.Option value="sms">SMS</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={announcementLoading} block>
                  Envoyer l'annonce
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Tickets de support */}
      <Card title="Mes tickets de support">
        {supportTickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">Aucun ticket de support</Text>
          </div>
        ) : (
          <List
            dataSource={supportTickets}
            renderItem={(ticket) => (
              <List.Item
                actions={[
                  <Button type="link">Voir</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<CustomerServiceOutlined />} />}
                  title={
                    <Space>
                      <Text strong>{ticket.subject}</Text>
                      <Tag color={getStatusColor(ticket.status)}>
                        {ticket.status === 'open' ? 'Ouvert' : 
                         ticket.status === 'in_progress' ? 'En cours' :
                         ticket.status === 'resolved' ? 'Résolu' : 'Fermé'}
                      </Tag>
                      <Tag color={getPriorityColor(ticket.priority)}>
                        {ticket.priority === 'high' ? 'Haute' :
                         ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">{ticket.lastMessage}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}

export default ManagerSupport

