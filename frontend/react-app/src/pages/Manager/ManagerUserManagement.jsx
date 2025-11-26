import React, { useEffect, useState } from 'react'
import { Table, Typography, Button, Tag, Space, Modal, Form, Input, Select, message, Card, Row, Col, Statistic, Avatar, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, MailOutlined, CheckCircleOutlined, StopOutlined, UserAddOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers } from '../../store/slices/usersSlice'

const { Title, Text } = Typography
const { Search } = Input

const ManagerUserManagement = () => {
  const dispatch = useDispatch()
  const { items: users, loading } = useSelector((state) => state.users)
  const { user: currentUser } = useSelector((state) => state.auth)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleInvite = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      group: user.group,
    })
    setIsModalVisible(true)
  }

  const handleSave = async (values) => {
    try {
      // TODO: API call to save user
      await new Promise(resolve => setTimeout(resolve, 1000))
      message.success(editingUser ? 'Utilisateur modifié avec succès' : 'Invitation envoyée avec succès')
      setIsModalVisible(false)
      setEditingUser(null)
      form.resetFields()
      dispatch(fetchUsers())
    } catch (error) {
      message.error('Erreur lors de la sauvegarde')
    }
  }

  const handleDeactivate = (id) => {
    // TODO: API call to deactivate
    message.success('Compte désactivé')
    dispatch(fetchUsers())
  }

  const handleActivate = (id) => {
    // TODO: API call to activate
    message.success('Compte activé')
    dispatch(fetchUsers())
  }

  const handleResetPassword = (id) => {
    Modal.confirm({
      title: 'Réinitialiser le mot de passe',
      content: 'Un email avec un nouveau mot de passe sera envoyé à cet utilisateur.',
      onOk: () => {
        // TODO: API call
        message.success('Email de réinitialisation envoyé')
      },
    })
  }

  // Filtrer les utilisateurs (seulement ceux du tenant du manager)
  const tenantUsers = users.filter(u => u.role !== 'admin' && u.id !== currentUser?.id)
  
  const filteredUsers = tenantUsers.filter(user => {
    const matchesSearch = !searchText || 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const columns = [
    {
      title: 'Utilisateur',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colorMap = {
          manager: 'blue',
          user: 'green',
          staff: 'orange',
        }
        const textMap = {
          manager: 'Gérant',
          user: 'Utilisateur',
          staff: 'Personnel',
        }
        return <Tag color={colorMap[role]}>{textMap[role] || role}</Tag>
      },
      filters: [
        { text: 'Utilisateur', value: 'user' },
        { text: 'Personnel', value: 'staff' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Groupe',
      dataIndex: 'group',
      key: 'group',
      render: (group) => group ? <Tag>{group}</Tag> : '-',
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
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Modifier
          </Button>
          {record.status === 'active' ? (
            <Popconfirm
              title="Désactiver le compte"
              description="L'utilisateur ne pourra plus se connecter."
              onConfirm={() => handleDeactivate(record.id)}
            >
              <Button size="small" danger icon={<StopOutlined />}>
                Désactiver
              </Button>
            </Popconfirm>
          ) : (
            <Button size="small" icon={<CheckCircleOutlined />} onClick={() => handleActivate(record.id)}>
              Activer
            </Button>
          )}
          <Button size="small" type="link" onClick={() => handleResetPassword(record.id)}>
            Réinitialiser MDP
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    total: tenantUsers.length,
    active: tenantUsers.filter(u => u.status === 'active').length,
    users: tenantUsers.filter(u => u.role === 'user').length,
    staff: tenantUsers.filter(u => u.role === 'staff').length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Gestion des utilisateurs</Title>
          <Text type="secondary">Invitez et gérez les utilisateurs de votre organisation</Text>
        </div>
        <Button type="primary" icon={<UserAddOutlined />} size="large" onClick={handleInvite}>
          Inviter un utilisateur
        </Button>
      </div>

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total utilisateurs"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Actifs"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Utilisateurs"
              value={stats.users}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Personnel"
              value={stats.staff}
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
              placeholder="Rechercher un utilisateur..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filtrer par rôle"
              style={{ width: '100%' }}
              size="large"
              value={roleFilter}
              onChange={setRoleFilter}
            >
              <Select.Option value="all">Tous les rôles</Select.Option>
              <Select.Option value="user">Utilisateur</Select.Option>
              <Select.Option value="staff">Personnel</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* Modal pour inviter/modifier */}
      <Modal
        title={editingUser ? 'Modifier l\'utilisateur' : 'Inviter un utilisateur'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingUser(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Nom complet"
            rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nom complet" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Veuillez entrer l\'email' },
              { type: 'email', message: 'Email invalide' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email@example.com" disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="role"
              label="Rôle"
              rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
              initialValue="user"
            >
              <Select>
                <Select.Option value="user">Utilisateur</Select.Option>
                <Select.Option value="staff">Personnel</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="group"
            label="Groupe (optionnel)"
            tooltip="Groupe d'utilisateurs pour contrôler l'accès aux ressources"
          >
            <Input placeholder="Ex: Équipe A, VIP, etc." />
          </Form.Item>

          {editingUser && (
            <Form.Item
              name="status"
              label="Statut"
            >
              <Select>
                <Select.Option value="active">Actif</Select.Option>
                <Select.Option value="inactive">Inactif</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Modifier' : 'Envoyer l\'invitation'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false)
                setEditingUser(null)
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

export default ManagerUserManagement

