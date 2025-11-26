import React, { useState, useEffect } from 'react'
import { Card, Typography, Table, Tag, Button, Space, Input, Select, DatePicker, Row, Col, Statistic, Modal, Form, message, Tabs, List, Avatar, Divider, Alert } from 'antd'
import { SearchOutlined, ReloadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, PlusOutlined, FileTextOutlined, QuestionCircleOutlined, BookOutlined, UserAddOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Search } = Input
const { TextArea } = Input
const { RangePicker } = DatePicker

const AdminSupport = () => {
  const [tickets, setTickets] = useState([])
  const [faqs, setFaqs] = useState([])
  const [documentation, setDocumentation] = useState([])
  const [loading, setLoading] = useState(false)
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false)
  const [isFaqModalVisible, setIsFaqModalVisible] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketForm] = Form.useForm()
  const [faqForm] = Form.useForm()
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    // TODO: Fetch from API
    setTickets([
      {
        id: 1,
        clientId: 1,
        clientName: 'Acme Corporation',
        subject: 'Problème de connexion API',
        message: 'Nous rencontrons des erreurs lors de l\'appel à l\'API de réservation...',
        status: 'open',
        priority: 'high',
        category: 'technical',
        createdAt: '2024-12-10T10:00:00',
        updatedAt: '2024-12-10T14:30:00',
        assignedTo: 'Admin Support',
      },
      {
        id: 2,
        clientId: 2,
        clientName: 'TechStart Inc',
        subject: 'Question sur la facturation',
        message: 'Comment puis-je modifier mon plan d\'abonnement ?',
        status: 'in_progress',
        priority: 'medium',
        category: 'billing',
        createdAt: '2024-12-09T15:20:00',
        updatedAt: '2024-12-10T09:15:00',
        assignedTo: 'Admin Support',
      },
      {
        id: 3,
        clientId: 3,
        clientName: 'Global Services',
        subject: 'Demande de fonctionnalité',
        message: 'Serait-il possible d\'ajouter une fonctionnalité d\'export Excel ?',
        status: 'closed',
        priority: 'low',
        category: 'feature_request',
        createdAt: '2024-12-08T11:00:00',
        updatedAt: '2024-12-09T16:00:00',
        assignedTo: 'Admin Support',
      },
    ])

    setFaqs([
      {
        id: 1,
        question: 'Comment créer un nouveau client ?',
        answer: 'Allez dans Gestion des clients > Onboarder un nouveau client. Remplissez le formulaire et validez.',
        category: 'onboarding',
        views: 245,
        helpful: 12,
      },
      {
        id: 2,
        question: 'Comment modifier un plan d\'abonnement ?',
        answer: 'Dans Gestion des clients, sélectionnez le client, puis modifiez son plan dans la section Facturation.',
        category: 'billing',
        views: 189,
        helpful: 8,
      },
      {
        id: 3,
        question: 'Comment réinitialiser le mot de passe d\'un manager ?',
        answer: 'Dans Gestion des clients, sélectionnez le client et cliquez sur "Réinitialiser l\'accès".',
        category: 'account',
        views: 156,
        helpful: 5,
      },
    ])

    setDocumentation([
      { id: 1, title: 'Guide de démarrage', category: 'getting_started', views: 1200 },
      { id: 2, title: 'API Documentation', category: 'api', views: 890 },
      { id: 3, title: 'Gestion des clients', category: 'admin', views: 650 },
      { id: 4, title: 'Configuration de la plateforme', category: 'configuration', views: 420 },
    ])
  }, [])

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setIsTicketModalVisible(true)
  }

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    // TODO: API call
    message.success('Statut mis à jour')
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t))
  }

  const handleAssignTicket = (ticketId, assignee) => {
    // TODO: API call
    message.success('Ticket assigné')
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, assignedTo: assignee } : t))
  }

  const handleAddFaq = () => {
    faqForm.resetFields()
    setIsFaqModalVisible(true)
  }

  const handleSaveFaq = async (values) => {
    setLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('FAQ ajoutée')
      setIsFaqModalVisible(false)
      faqForm.resetFields()
    } catch (error) {
      message.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = (action, ticketIds) => {
    Modal.confirm({
      title: `Effectuer l'action: ${action}`,
      content: `Êtes-vous sûr de vouloir ${action} ${ticketIds.length} ticket(s) ?`,
      onOk: () => {
        message.success('Action effectuée')
        // TODO: API call
      },
    })
  }

  const getStatusColor = (status) => {
    const colorMap = {
      open: 'red',
      in_progress: 'orange',
      closed: 'green',
      pending: 'blue',
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    return matchesStatus && matchesPriority
  })

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    closedTickets: tickets.filter(t => t.status === 'closed').length,
    highPriorityTickets: tickets.filter(t => t.priority === 'high' && t.status !== 'closed').length,
  }

  const ticketColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Sujet',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag>{category === 'technical' ? 'Technique' : category === 'billing' ? 'Facturation' : category === 'feature_request' ? 'Fonctionnalité' : category}</Tag>
      ),
    },
    {
      title: 'Priorité',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? 'Haute' : priority === 'medium' ? 'Moyenne' : 'Basse'}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'open' ? 'Ouvert' : status === 'in_progress' ? 'En cours' : status === 'closed' ? 'Fermé' : status}
        </Tag>
      ),
    },
    {
      title: 'Assigné à',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Créé le',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewTicket(record)}>
            Voir
          </Button>
          {record.status !== 'closed' && (
            <Button size="small" onClick={() => handleUpdateTicketStatus(record.id, 'closed')}>
              Fermer
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'tickets',
      label: 'Tickets de support',
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Total tickets"
                  value={stats.totalTickets}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Ouverts"
                  value={stats.openTickets}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="En cours"
                  value={stats.inProgressTickets}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Fermés"
                  value={stats.closedTickets}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
          </Card>

          {stats.highPriorityTickets > 0 && (
            <Alert
              message={`${stats.highPriorityTickets} ticket(s) haute priorité en attente`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <Space>
                <Select
                  placeholder="Filtrer par statut"
                  style={{ width: 150 }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                >
                  <Select.Option value="all">Tous les statuts</Select.Option>
                  <Select.Option value="open">Ouvert</Select.Option>
                  <Select.Option value="in_progress">En cours</Select.Option>
                  <Select.Option value="closed">Fermé</Select.Option>
                </Select>
                <Select
                  placeholder="Filtrer par priorité"
                  style={{ width: 150 }}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                >
                  <Select.Option value="all">Toutes les priorités</Select.Option>
                  <Select.Option value="high">Haute</Select.Option>
                  <Select.Option value="medium">Moyenne</Select.Option>
                  <Select.Option value="low">Basse</Select.Option>
                </Select>
              </Space>
              <Button icon={<ReloadOutlined />} onClick={() => message.info('Actualisation...')}>
                Actualiser
              </Button>
            </div>
            <Table
              columns={ticketColumns}
              dataSource={filteredTickets}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'faq',
      label: 'FAQ',
      children: (
        <Card
          title="Foire aux questions"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFaq}>
              Ajouter une FAQ
            </Button>
          }
        >
          <List
            dataSource={faqs}
            renderItem={(faq) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<QuestionCircleOutlined />} />}
                  title={faq.question}
                  description={
                    <div>
                      <Text>{faq.answer}</Text>
                      <div style={{ marginTop: 8 }}>
                        <Space>
                          <Tag>{faq.category}</Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {faq.views} vues • {faq.helpful} utiles
                          </Text>
                        </Space>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
    {
      key: 'documentation',
      label: 'Documentation',
      children: (
        <Card title="Documentation">
          <List
            dataSource={documentation}
            renderItem={(doc) => (
              <List.Item
                actions={[
                  <Button type="link" icon={<EyeOutlined />}>
                    Voir ({doc.views})
                  </Button>,
                  <Button type="link">Modifier</Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<BookOutlined />} />}
                  title={doc.title}
                  description={<Tag>{doc.category}</Tag>}
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
    {
      key: 'onboarding',
      label: 'Onboarding',
      children: (
        <Card
          title="Onboarding des clients"
          extra={
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => message.info('Redirection vers la création de client...')}>
              Nouveau client
            </Button>
          }
        >
          <Alert
            message="Guide d'onboarding"
            description="Utilisez le formulaire de création de client pour onboarder de nouveaux managers. Assurez-vous de configurer les quotas et le plan d'abonnement appropriés."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <div>
            <Title level={4}>Étapes d'onboarding</Title>
            <ol>
              <li>Créer le compte manager via "Gestion des clients"</li>
              <li>Configurer le plan d'abonnement et les quotas</li>
              <li>Envoyer les identifiants de connexion</li>
              <li>Programmer une session d'introduction (optionnel)</li>
              <li>Suivre l'activité initiale du client</li>
            </ol>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Support et assistance</Title>
          <Text type="secondary">Gérer les tickets, FAQ, documentation et onboarding</Text>
        </div>
      </div>

      <Tabs items={tabItems} />

      {/* Modal Ticket */}
      <Modal
        title={`Ticket #${selectedTicket?.id}`}
        open={isTicketModalVisible}
        onCancel={() => {
          setIsTicketModalVisible(false)
          setSelectedTicket(null)
        }}
        footer={[
          <Button key="close" onClick={() => setIsTicketModalVisible(false)}>
            Fermer
          </Button>,
          selectedTicket?.status !== 'closed' && (
            <Button key="closeTicket" onClick={() => {
              handleUpdateTicketStatus(selectedTicket.id, 'closed')
              setIsTicketModalVisible(false)
            }}>
              Fermer le ticket
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedTicket && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Client: </Text>
                <Text>{selectedTicket.clientName}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Statut: </Text>
                <Tag color={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Tag>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Text strong>Priorité: </Text>
                <Tag color={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Assigné à: </Text>
                <Text>{selectedTicket.assignedTo}</Text>
              </Col>
            </Row>
            <Divider />
            <div>
              <Text strong>Sujet: </Text>
              <Text>{selectedTicket.subject}</Text>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text strong>Message: </Text>
              <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                <Text>{selectedTicket.message}</Text>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Créé le: {dayjs(selectedTicket.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal FAQ */}
      <Modal
        title="Ajouter une FAQ"
        open={isFaqModalVisible}
        onCancel={() => {
          setIsFaqModalVisible(false)
          faqForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={faqForm}
          layout="vertical"
          onFinish={handleSaveFaq}
        >
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true }]}
          >
            <Input placeholder="Comment...?" />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Réponse"
            rules={[{ required: true }]}
          >
            <TextArea rows={6} placeholder="Réponse détaillée..." />
          </Form.Item>
          <Form.Item
            name="category"
            label="Catégorie"
            rules={[{ required: true }]}
          >
            <Select placeholder="Sélectionner une catégorie">
              <Select.Option value="onboarding">Onboarding</Select.Option>
              <Select.Option value="billing">Facturation</Select.Option>
              <Select.Option value="technical">Technique</Select.Option>
              <Select.Option value="account">Compte</Select.Option>
              <Select.Option value="features">Fonctionnalités</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Ajouter
              </Button>
              <Button onClick={() => {
                setIsFaqModalVisible(false)
                faqForm.resetFields()
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

export default AdminSupport

