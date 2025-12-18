import React, { useEffect, useState } from 'react'
import { Table, Typography, Button, Tag, Space, Modal, Form, Input, Select, message, Card, Row, Col, Statistic, InputNumber, DatePicker, Divider } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, DollarOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import api from '../../utils/api'

const { Title, Text } = Typography
const { Search } = Input
const { TextArea } = Input

const AdminClientManagement = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/dashboard')
      const clientsData = response.data.data.clients || []
      setClients(clientsData)
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error)
      message.error('Erreur lors du chargement des clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleAdd = () => {
    setEditingClient(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    form.setFieldsValue({
      name: client.name || client.manager + ' Organization',
      manager: client.manager || client.name,
      email: client.email,
      phone: client.phone || '',
      subscription: client.subscription || 'Basic',
      status: client.status || 'active',
      quota: client.quota || {
        maxUsers: 50,
        maxResources: 20,
        maxBookings: 500,
      },
      billing: client.billing || {
        plan: client.subscription || 'Basic',
        price: 99,
        billingCycle: 'monthly',
      },
    })
    setIsModalVisible(true)
  }

  const handleSave = async (values) => {
    setLoading(true)
    try {
      if (editingClient) {
        // Mise à jour du client
        await api.put(`/users/${editingClient.id}`, {
          name: values.manager,
          email: values.email,
          role: 'manager',
          status: values.status || 'active',
          quota: values.quota?.maxUsers || null,
        })
        message.success('Client modifié avec succès')
      } else {
        // Création d'un nouveau client (manager)
        // Générer un mot de passe temporaire
        const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
        
        await api.post('/users', {
          name: values.manager,
          email: values.email,
          password: tempPassword,
          role: 'manager',
          status: values.status || 'active',
          quota: values.quota?.maxUsers || null,
        })
        message.success('Client créé avec succès')
      }
      
      setIsModalVisible(false)
      setEditingClient(null)
      form.resetFields()
      
      // Recharger la liste des clients
      await fetchClients()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.email?.[0] || 'Erreur lors de la sauvegarde'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = (id) => {
    Modal.confirm({
      title: 'Suspendre le client',
      content: 'Êtes-vous sûr de vouloir suspendre ce client ?',
      onOk: async () => {
        try {
          await api.put(`/users/${id}`, { status: 'inactive' })
          message.success('Client suspendu')
          await fetchClients()
        } catch (error) {
          console.error('Erreur:', error)
          message.error('Erreur lors de la suspension')
        }
      },
    })
  }

  const handleActivate = (id) => {
    Modal.confirm({
      title: 'Activer le client',
      content: 'Êtes-vous sûr de vouloir activer ce client ?',
      onOk: async () => {
        try {
          await api.put(`/users/${id}`, { status: 'active' })
          message.success('Client activé')
          await fetchClients()
        } catch (error) {
          console.error('Erreur:', error)
          message.error('Erreur lors de l\'activation')
        }
      },
    })
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Supprimer le client',
      content: 'Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce client ?',
      okText: 'Supprimer',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.delete(`/users/${id}`)
          message.success('Client supprimé')
          await fetchClients()
        } catch (error) {
          console.error('Erreur:', error)
          message.error('Erreur lors de la suppression')
        }
      },
    })
  }

  const handleResetAccess = (id) => {
    Modal.confirm({
      title: 'Réinitialiser l\'accès',
      content: 'Un email avec un nouveau mot de passe sera envoyé au manager. Continuer ?',
      onOk: async () => {
        try {
          const response = await api.post(`/users/${id}/reset-password`, {
            send_email: false, // Pour l'instant, on retourne juste le mot de passe
          })
          message.success(`Mot de passe réinitialisé. Nouveau mot de passe: ${response.data.temp_password}`)
        } catch (error) {
          console.error('Erreur:', error)
          message.error('Erreur lors de la réinitialisation')
        }
      },
    })
  }

  const handleImpersonate = async (client) => {
    Modal.confirm({
      title: 'Impersonifier le client',
      content: `Vous allez vous connecter en tant que ${client.manager || client.name} (${client.name}). Continuer ?`,
      onOk: async () => {
        try {
          const response = await api.post(`/users/${client.id}/impersonate`)
          const { token, redirect_url } = response.data
          
          // Stocker le token d'impersonation temporairement
          localStorage.setItem('impersonation_token', token)
          localStorage.setItem('original_token', localStorage.getItem('token'))
          
          // Mettre à jour le token dans l'API
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          localStorage.setItem('token', token)
          
          message.success(`Connecté en tant que ${client.manager || client.name}`)
          
          // Rediriger vers le dashboard approprié
          if (redirect_url) {
            window.location.href = redirect_url
          } else {
            navigate('/manager')
          }
        } catch (error) {
          console.error('Erreur:', error)
          const errorMessage = error.response?.data?.message || 'Erreur lors de l\'impersonation'
          message.error(errorMessage)
        }
      },
    })
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = !searchText || 
      (client.name && client.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (client.manager && client.manager.toLowerCase().includes(searchText.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || (client.status === statusFilter)
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      title: 'Client',
      key: 'client',
      render: (_, record) => (
        <Space>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.manager}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Abonnement',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (subscription) => {
        const colorMap = {
          Basic: 'blue',
          Premium: 'gold',
          Enterprise: 'purple',
        }
        return <Tag color={colorMap[subscription]}>{subscription}</Tag>
      },
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? 'Actif' : 'Inactif'}
        </Tag>
      ),
    },
    {
      title: 'Utilisation',
      key: 'usage',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>
            {record.users || 0}/{record.quota?.maxUsers || 'N/A'} utilisateurs
          </Text>
          <Text style={{ fontSize: 12 }}>
            {record.resources || 0}/{record.quota?.maxResources || 'N/A'} ressources
          </Text>
        </Space>
      ),
    },
    {
      title: 'Revenus',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => revenue ? `${revenue.toLocaleString()} €` : '0 €',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/admin/clients/${record.id}`)}>
            Voir
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Modifier
          </Button>
          {record.status === 'active' ? (
            <Button size="small" danger icon={<StopOutlined />} onClick={() => handleSuspend(record.id)}>
              Suspendre
            </Button>
          ) : (
            <Button size="small" icon={<CheckCircleOutlined />} onClick={() => handleActivate(record.id)}>
              Activer
            </Button>
          )}
          <Button size="small" type="link" onClick={() => handleImpersonate(record)}>
            Impersonate
          </Button>
          <Button size="small" type="link" onClick={() => handleResetAccess(record.id)}>
            Réinitialiser accès
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.revenue, 0),
    totalUsers: clients.reduce((sum, c) => sum + c.users, 0),
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Gestion des clients</Title>
          <Text type="secondary">Gérer tous les clients (managers) de la plateforme</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
          Onboarder un nouveau client
        </Button>
      </div>

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total clients"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Clients actifs"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Revenus totaux"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="€"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Utilisateurs totaux"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtres */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Rechercher un client..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filtrer par statut"
              style={{ width: '100%' }}
              size="large"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Select.Option value="all">Tous les statuts</Select.Option>
              <Select.Option value="active">Actif</Select.Option>
              <Select.Option value="inactive">Inactif</Select.Option>
              <Select.Option value="suspended">Suspendu</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Tableau des clients */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredClients}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal pour ajouter/modifier */}
      <Modal
        title={editingClient ? 'Modifier le client' : 'Onboarder un nouveau client'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingClient(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Nom de l'entreprise"
                rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
              >
                <Input placeholder="Nom de l'entreprise" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="manager"
                label="Nom du gérant"
                rules={[{ required: true, message: 'Veuillez entrer le nom du gérant' }]}
              >
                <Input placeholder="Nom du gérant" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Veuillez entrer l\'email' },
                  { type: 'email', message: 'Email invalide' },
                ]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Téléphone"
              >
                <Input placeholder="+33 1 23 45 67 89" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="subscription"
                label="Plan d'abonnement"
                rules={[{ required: true, message: 'Veuillez sélectionner un plan' }]}
              >
                <Select placeholder="Sélectionner un plan">
                  <Select.Option value="Basic">Basic (99€/mois)</Select.Option>
                  <Select.Option value="Premium">Premium (299€/mois)</Select.Option>
                  <Select.Option value="Enterprise">Enterprise (Sur mesure)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Statut"
                initialValue="active"
              >
                <Select>
                  <Select.Option value="active">Actif</Select.Option>
                  <Select.Option value="inactive">Inactif</Select.Option>
                  <Select.Option value="suspended">Suspendu</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Quotas</Divider>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={['quota', 'maxUsers']}
                label="Utilisateurs maximum"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['quota', 'maxResources']}
                label="Ressources maximum"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name={['quota', 'maxBookings']}
                label="Réservations maximum"
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Facturation</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name={['billing', 'price']}
                label="Prix mensuel (€)"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={['billing', 'billingCycle']}
                label="Cycle de facturation"
              >
                <Select>
                  <Select.Option value="monthly">Mensuel</Select.Option>
                  <Select.Option value="yearly">Annuel</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingClient ? 'Modifier' : 'Créer'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false)
                setEditingClient(null)
                form.resetFields()
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

export default AdminClientManagement

