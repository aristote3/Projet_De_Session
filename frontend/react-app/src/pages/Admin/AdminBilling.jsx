import React, { useState, useEffect } from 'react'
import { Card, Typography, Table, Tag, Button, Space, Modal, Form, Input, Select, InputNumber, DatePicker, message, Row, Col, Statistic, Divider, Tabs, Popconfirm } from 'antd'
import { DollarOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import api from '../../utils/api'

const { Title, Text } = Typography
const { TextArea } = Input

const AdminBilling = () => {
  const [plans, setPlans] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false)
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planForm] = Form.useForm()
  const [invoiceForm] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch plans
      const plansResponse = await api.get('/billing/plans')
      const plansData = (plansResponse.data.data || []).map(plan => ({
        ...plan,
        billingCycle: plan.billing_cycle || plan.billingCycle,
        features: Array.isArray(plan.features) ? plan.features : (plan.features ? [plan.features] : []),
      }))
      setPlans(plansData)

      // Fetch subscriptions
      const subscriptionsResponse = await api.get('/billing/subscriptions')
      setSubscriptions(subscriptionsResponse.data.data || [])

      // Fetch invoices
      const invoicesResponse = await api.get('/billing/invoices')
      setInvoices(invoicesResponse.data.data || [])

      // Fetch clients for invoice form
      const clientsResponse = await api.get('/admin/dashboard')
      setClients(clientsResponse.data.data.clients || [])
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      message.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddPlan = () => {
    setEditingPlan(null)
    planForm.resetFields()
    setIsPlanModalVisible(true)
  }

  const handleEditPlan = (plan) => {
    setEditingPlan(plan)
    planForm.setFieldsValue({
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billing_cycle || plan.billingCycle,
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      status: plan.status,
    })
    setIsPlanModalVisible(true)
  }

  const handleSavePlan = async (values) => {
    setLoading(true)
    try {
      if (editingPlan) {
        await api.put(`/billing/plans/${editingPlan.id}`, {
          name: values.name,
          price: values.price,
          billing_cycle: values.billingCycle,
          features: values.features ? values.features.split('\n').filter(f => f.trim()) : [],
          status: values.status || 'active',
        })
        message.success('Plan modifié')
      } else {
        await api.post('/billing/plans', {
          name: values.name,
          price: values.price,
          billing_cycle: values.billingCycle,
          features: values.features ? values.features.split('\n').filter(f => f.trim()) : [],
          status: values.status || 'active',
        })
        message.success('Plan créé')
      }
      
      setIsPlanModalVisible(false)
      setEditingPlan(null)
      planForm.resetFields()
      await fetchData()
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async (values) => {
    setLoading(true)
    try {
      await api.post('/billing/invoices', {
        user_id: values.clientId,
        subscription_id: values.subscriptionId || null,
        amount: values.amount,
        issue_date: values.issueDate.format('YYYY-MM-DD'),
        due_date: values.dueDate.format('YYYY-MM-DD'),
        items: values.items || [],
        notes: values.notes || null,
      })
      message.success('Facture créée')
      setIsInvoiceModalVisible(false)
      invoiceForm.resetFields()
      await fetchData()
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = (invoiceId) => {
    Modal.confirm({
      title: 'Rembourser',
      content: 'Êtes-vous sûr de vouloir rembourser cette facture ?',
      onOk: async () => {
        try {
          await api.post(`/billing/invoices/${invoiceId}/refund`)
          message.success('Remboursement effectué')
          await fetchData()
        } catch (error) {
          console.error('Erreur:', error)
          message.error('Erreur lors du remboursement')
        }
      },
    })
  }

  const handleApplyDiscount = (subscriptionId) => {
    Modal.confirm({
      title: 'Appliquer une réduction',
      content: 'Entrez le montant ou le pourcentage de réduction',
      onOk: async () => {
        try {
          // TODO: Créer un modal pour saisir le type et la valeur de la réduction
          await api.post(`/billing/subscriptions/${subscriptionId}/discount`, {
            discount_type: 'percentage',
            discount_value: 10,
          })
          message.success('Réduction appliquée')
          await fetchData()
        } catch (error) {
          console.error('Erreur:', error)
          message.error('Erreur lors de l\'application de la réduction')
        }
      },
    })
  }

  const stats = {
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pendingRevenue: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    mrr: subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.price, 0),
  }

  const planColumns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Prix',
      key: 'price',
      render: (_, record) => `${record.price}€/${record.billingCycle === 'monthly' ? 'mois' : 'an'}`,
    },
    {
      title: 'Fonctionnalités',
      key: 'features',
      render: (_, record) => {
        const features = Array.isArray(record.features) ? record.features : []
        return (
          <Space direction="vertical" size={0}>
            {features.length > 0 ? features.map((f, i) => (
              <Text key={i} style={{ fontSize: 12 }}>• {f}</Text>
            )) : <Text type="secondary" style={{ fontSize: 12 }}>Aucune</Text>}
          </Space>
        )
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditPlan(record)}>
            Modifier
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={async () => {
            Modal.confirm({
              title: 'Supprimer le plan',
              content: 'Êtes-vous sûr de vouloir supprimer ce plan ?',
              okText: 'Supprimer',
              okType: 'danger',
              onOk: async () => {
                try {
                  await api.delete(`/billing/plans/${record.id}`)
                  message.success('Plan supprimé')
                  await fetchData()
                } catch (error) {
                  console.error('Erreur:', error)
                  message.error('Erreur lors de la suppression')
                }
              },
            })
          }}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ]

  const subscriptionColumns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Plan',
      dataIndex: 'planName',
      key: 'planName',
      render: (plan) => <Tag color="blue">{plan}</Tag>,
    },
    {
      title: 'Prix',
      key: 'price',
      render: (_, record) => `${record.price}€/${record.billingCycle === 'monthly' ? 'mois' : 'an'}`,
    },
    {
      title: 'Prochaine facturation',
      dataIndex: 'nextBilling',
      key: 'nextBilling',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleApplyDiscount(record.id)}>
            Réduction
          </Button>
          <Button size="small" onClick={() => message.info('Fonctionnalité à venir')}>
            Modifier
          </Button>
        </Space>
      ),
    },
  ]

  const invoiceColumns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount}€`,
    },
    {
      title: 'Date d\'émission',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Date d\'échéance',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status === 'paid' ? 'Payée' : status === 'pending' ? 'En attente' : 'Impayée'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<DownloadOutlined />}>
            Télécharger
          </Button>
          {record.status === 'paid' && (
            <Button size="small" onClick={() => handleRefund(record.id)}>
              Rembourser
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'plans',
      label: 'Plans tarifaires',
      children: (
        <Card
          title="Plans tarifaires"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlan}>
              Créer un plan
            </Button>
          }
        >
          <Table
            columns={planColumns}
            dataSource={plans}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'subscriptions',
      label: 'Abonnements',
      children: (
        <Card title="Abonnements actifs">
          <Table
            columns={subscriptionColumns}
            dataSource={subscriptions}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'invoices',
      label: 'Factures',
      children: (
        <Card
          title="Factures"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsInvoiceModalVisible(true)}>
              Créer une facture
            </Button>
          }
        >
          <Table
            columns={invoiceColumns}
            dataSource={invoices}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Facturation et paiements</Title>
          <Text type="secondary">Gérer les plans, abonnements et factures</Text>
        </div>
      </div>

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="MRR"
              value={stats.mrr}
              prefix={<DollarOutlined />}
              suffix="€"
              valueStyle={{ color: '#1890ff' }}
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
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="En attente"
              value={stats.pendingRevenue}
              prefix={<DollarOutlined />}
              suffix="€"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Abonnements actifs"
              value={stats.activeSubscriptions}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs items={tabItems} />

      {/* Modal Plan */}
      <Modal
        title={editingPlan ? 'Modifier le plan' : 'Créer un plan'}
        open={isPlanModalVisible}
        onCancel={() => {
          setIsPlanModalVisible(false)
          setEditingPlan(null)
          planForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={planForm}
          layout="vertical"
          onFinish={handleSavePlan}
        >
          <Form.Item
            name="name"
            label="Nom du plan"
            rules={[{ required: true }]}
          >
            <Input placeholder="Basic, Premium, Enterprise..." />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="price"
                label="Prix"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} addonAfter="€" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="billingCycle"
                label="Cycle"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="monthly">Mensuel</Select.Option>
                  <Select.Option value="yearly">Annuel</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="features"
            label="Fonctionnalités"
          >
            <TextArea rows={4} placeholder="Une fonctionnalité par ligne" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Statut"
            initialValue="active"
          >
            <Select>
              <Select.Option value="active">Actif</Select.Option>
              <Select.Option value="inactive">Inactif</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPlan ? 'Modifier' : 'Créer'}
              </Button>
              <Button onClick={() => {
                setIsPlanModalVisible(false)
                setEditingPlan(null)
                planForm.resetFields()
              }}>
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Facture */}
      <Modal
        title="Créer une facture"
        open={isInvoiceModalVisible}
        onCancel={() => {
          setIsInvoiceModalVisible(false)
          invoiceForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={invoiceForm}
          layout="vertical"
          onFinish={handleCreateInvoice}
        >
          <Form.Item
            name="clientId"
            label="Client"
            rules={[{ required: true }]}
          >
            <Select placeholder="Sélectionner un client">
              {clients.map(client => (
                <Select.Option key={client.id} value={client.id}>
                  {client.name || client.manager + ' Organization'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Montant"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter="€" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="issueDate"
                label="Date d'émission"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dueDate"
                label="Date d'échéance"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Créer
              </Button>
              <Button onClick={() => {
                setIsInvoiceModalVisible(false)
                invoiceForm.resetFields()
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

export default AdminBilling


