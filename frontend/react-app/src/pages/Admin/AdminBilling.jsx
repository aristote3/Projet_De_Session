import React, { useState, useEffect } from 'react'
import { Card, Typography, Table, Tag, Button, Space, Modal, Form, Input, Select, InputNumber, DatePicker, message, Row, Col, Statistic, Divider, Tabs } from 'antd'
import { DollarOutlined, PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { TextArea } = Input

const AdminBilling = () => {
  const [plans, setPlans] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false)
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planForm] = Form.useForm()
  const [invoiceForm] = Form.useForm()

  useEffect(() => {
    // TODO: Fetch from API
    setPlans([
      {
        id: 1,
        name: 'Basic',
        price: 99,
        billingCycle: 'monthly',
        features: ['50 utilisateurs', '20 ressources', '500 réservations/mois'],
        status: 'active',
      },
      {
        id: 2,
        name: 'Premium',
        price: 299,
        billingCycle: 'monthly',
        features: ['100 utilisateurs', '50 ressources', '1000 réservations/mois'],
        status: 'active',
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 999,
        billingCycle: 'monthly',
        features: ['Illimité', 'Illimité', 'Illimité'],
        status: 'active',
      },
    ])

    setSubscriptions([
      {
        id: 1,
        clientId: 1,
        clientName: 'Acme Corporation',
        planId: 2,
        planName: 'Premium',
        price: 299,
        billingCycle: 'monthly',
        status: 'active',
        startDate: '2024-01-15',
        nextBilling: '2024-12-15',
        paymentMethod: 'card',
        autoRenew: true,
      },
      {
        id: 2,
        clientId: 2,
        clientName: 'TechStart Inc',
        planId: 1,
        planName: 'Basic',
        price: 99,
        billingCycle: 'monthly',
        status: 'active',
        startDate: '2024-02-20',
        nextBilling: '2024-12-20',
        paymentMethod: 'card',
        autoRenew: true,
      },
    ])

    setInvoices([
      {
        id: 1,
        clientId: 1,
        clientName: 'Acme Corporation',
        subscriptionId: 1,
        amount: 299,
        status: 'paid',
        issueDate: '2024-11-15',
        dueDate: '2024-11-15',
        paidDate: '2024-11-15',
      },
      {
        id: 2,
        clientId: 2,
        clientName: 'TechStart Inc',
        subscriptionId: 2,
        amount: 99,
        status: 'pending',
        issueDate: '2024-12-01',
        dueDate: '2024-12-20',
        paidDate: null,
      },
    ])
  }, [])

  const handleAddPlan = () => {
    setEditingPlan(null)
    planForm.resetFields()
    setIsPlanModalVisible(true)
  }

  const handleEditPlan = (plan) => {
    setEditingPlan(plan)
    planForm.setFieldsValue(plan)
    setIsPlanModalVisible(true)
  }

  const handleSavePlan = async (values) => {
    setLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success(editingPlan ? 'Plan modifié' : 'Plan créé')
      setIsPlanModalVisible(false)
      setEditingPlan(null)
      planForm.resetFields()
    } catch (error) {
      message.error('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async (values) => {
    setLoading(true)
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success('Facture créée')
      setIsInvoiceModalVisible(false)
      invoiceForm.resetFields()
    } catch (error) {
      message.error('Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = (invoiceId) => {
    Modal.confirm({
      title: 'Rembourser',
      content: 'Êtes-vous sûr de vouloir rembourser cette facture ?',
      onOk: () => {
        message.success('Remboursement effectué')
        // TODO: API call
      },
    })
  }

  const handleApplyDiscount = (subscriptionId) => {
    Modal.confirm({
      title: 'Appliquer une réduction',
      content: 'Entrez le montant ou le pourcentage de réduction',
      onOk: () => {
        message.success('Réduction appliquée')
        // TODO: API call
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
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.features.map((f, i) => (
            <Text key={i} style={{ fontSize: 12 }}>• {f}</Text>
          ))}
        </Space>
      ),
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
          <Button size="small" danger icon={<DeleteOutlined />}>
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
              {/* TODO: Load from API */}
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


