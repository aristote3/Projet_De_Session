import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Typography, 
  Space, 
  Alert,
  Table,
  Tag,
  Statistic,
  Row,
  Col,
  Divider,
  message as antMessage,
  Modal,
  Checkbox
} from 'antd'
import { 
  SendOutlined, 
  SoundOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons'
import { useTheme } from '../../contexts/ThemeContext'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import api from '../../utils/api'

dayjs.locale('fr')

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const ManagerBroadcast = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [sentMessages, setSentMessages] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const { isDarkMode, theme } = useTheme()

  useEffect(() => {
    fetchUsers()
    fetchSentMessages()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', { params: { role: 'user', status: 'active' } })
      setUsers(response.data.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchSentMessages = async () => {
    try {
      const response = await api.get('/messages/sent')
      setSentMessages(response.data.data || [])
    } catch (error) {
      console.error('Error fetching sent messages:', error)
    }
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    setLastResult(null)

    try {
      const payload = {
        subject: values.subject,
        content: values.content,
        channel: values.channel,
      }

      // Add specific user IDs if not sending to all
      if (selectedUsers.length > 0 && selectedUsers.length < users.length) {
        payload.user_ids = selectedUsers
      }

      const response = await api.post('/messages/broadcast', payload)
      
      setLastResult(response.data.delivery)
      antMessage.success(response.data.message)
      form.resetFields()
      setSelectedUsers([])
      fetchSentMessages()
    } catch (error) {
      antMessage.error('Erreur lors de l\'envoi du message')
      console.error('Broadcast error:', error)
    } finally {
      setLoading(false)
    }
  }

  const userColumns = [
    {
      title: 'Sélectionner',
      dataIndex: 'id',
      key: 'select',
      width: 80,
      render: (id) => (
        <Checkbox
          checked={selectedUsers.includes(id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, id])
            } else {
              setSelectedUsers(selectedUsers.filter(u => u !== id))
            }
          }}
        />
      )
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Téléphone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || <Text type="secondary">Non renseigné</Text>
    },
  ]

  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Sujet',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => subject || <Text type="secondary">Sans sujet</Text>
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'broadcast' ? 'gold' : 'blue'}>
          {type === 'broadcast' ? 'Diffusion' : 'Direct'}
        </Tag>
      )
    },
    {
      title: 'Destinataires',
      dataIndex: 'broadcast_recipients_count',
      key: 'recipients',
      render: (count) => count || 1
    },
    {
      title: 'Canal',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel) => {
        const icons = {
          app: <MessageOutlined />,
          email: <MailOutlined />,
          sms: <MobileOutlined />,
          all: <SoundOutlined />
        }
        return (
          <Space>
            {icons[channel]}
            {channel === 'all' ? 'Tous' : channel.toUpperCase()}
          </Space>
        )
      }
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: theme.colorText }}>
          <SoundOutlined style={{ marginRight: 12 }} />
          Diffusion de Messages
        </Title>
        <Text type="secondary">Envoyez un message à tous vos utilisateurs</Text>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <SendOutlined />
                <span>Nouveau message</span>
              </Space>
            }
            style={{ 
              background: isDarkMode ? theme.colorBgContainer : '#fff',
              marginBottom: 24
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ channel: 'app' }}
            >
              <Form.Item
                name="subject"
                label="Sujet (optionnel)"
              >
                <Input 
                  placeholder="Ex: Information importante" 
                  prefix={<MailOutlined style={{ color: theme.colorTextSecondary }} />}
                />
              </Form.Item>

              <Form.Item
                name="content"
                label="Message"
                rules={[{ required: true, message: 'Veuillez entrer votre message' }]}
              >
                <TextArea 
                  rows={6} 
                  placeholder="Tapez votre message ici..."
                  showCount
                  maxLength={5000}
                />
              </Form.Item>

              <Form.Item
                name="channel"
                label="Canal d'envoi"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="app">
                    <Space>
                      <MessageOutlined />
                      Application uniquement
                    </Space>
                  </Option>
                  <Option value="email">
                    <Space>
                      <MailOutlined />
                      Email uniquement
                    </Space>
                  </Option>
                  <Option value="sms">
                    <Space>
                      <MobileOutlined />
                      SMS uniquement
                    </Space>
                  </Option>
                  <Option value="all">
                    <Space>
                      <SoundOutlined />
                      Tous les canaux (App + Email + SMS)
                    </Space>
                  </Option>
                </Select>
              </Form.Item>

              <Alert
                message={
                  selectedUsers.length === 0 
                    ? `Le message sera envoyé à tous les ${users.length} utilisateurs`
                    : `Le message sera envoyé à ${selectedUsers.length} utilisateur(s) sélectionné(s)`
                }
                type="info"
                showIcon
                icon={<TeamOutlined />}
                style={{ marginBottom: 16 }}
              />

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SendOutlined />}
                  size="large"
                  block
                >
                  Envoyer le message
                </Button>
              </Form.Item>
            </Form>

            {lastResult && (
              <Alert
                message="Résultat de l'envoi"
                description={
                  <Row gutter={16} style={{ marginTop: 12 }}>
                    <Col span={6}>
                      <Statistic
                        title="Total"
                        value={lastResult.total}
                        prefix={<TeamOutlined />}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="App"
                        value={lastResult.app}
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<CheckCircleOutlined />}
                      />
                    </Col>
                    {lastResult.email && (
                      <Col span={6}>
                        <Statistic
                          title="Email"
                          value={`${lastResult.email.sent}/${lastResult.email.sent + lastResult.email.failed}`}
                          valueStyle={{ color: lastResult.email.failed > 0 ? '#faad14' : '#52c41a' }}
                        />
                      </Col>
                    )}
                    {lastResult.sms && (
                      <Col span={6}>
                        <Statistic
                          title="SMS"
                          value={`${lastResult.sms.sent}/${lastResult.sms.sent + lastResult.sms.failed + lastResult.sms.no_phone}`}
                          valueStyle={{ color: lastResult.sms.failed > 0 ? '#faad14' : '#52c41a' }}
                        />
                      </Col>
                    )}
                  </Row>
                }
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Sélection des destinataires</span>
                {selectedUsers.length > 0 && (
                  <Tag color="blue">{selectedUsers.length} sélectionné(s)</Tag>
                )}
              </Space>
            }
            extra={
              <Space>
                <Button 
                  size="small" 
                  onClick={() => setSelectedUsers(users.map(u => u.id))}
                >
                  Tout sélectionner
                </Button>
                <Button 
                  size="small" 
                  onClick={() => setSelectedUsers([])}
                >
                  Désélectionner
                </Button>
              </Space>
            }
            style={{ 
              background: isDarkMode ? theme.colorBgContainer : '#fff',
              marginBottom: 24
            }}
          >
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
              scroll={{ y: 300 }}
            />
          </Card>

          <Card
            title={
              <Space>
                <HistoryOutlined />
                <span>Messages envoyés</span>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => setShowHistory(true)}>
                Voir tout
              </Button>
            }
            style={{ background: isDarkMode ? theme.colorBgContainer : '#fff' }}
          >
            <Table
              columns={historyColumns.slice(0, 3)}
              dataSource={sentMessages.slice(0, 5)}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* History Modal */}
      <Modal
        title="Historique des messages"
        open={showHistory}
        onCancel={() => setShowHistory(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={historyColumns}
          dataSource={sentMessages}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  )
}

export default ManagerBroadcast

