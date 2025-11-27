import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Space, Tag, Typography, Modal, Input, message, Empty, Badge } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined, MailOutlined, ClockCircleOutlined, BankOutlined, PhoneOutlined, TeamOutlined, FileTextOutlined, GlobalOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
import api from '../../utils/api'

dayjs.extend(relativeTime)
dayjs.locale('fr')

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// Mapping des secteurs d'activité
const industryLabels = {
  technology: '🖥️ Technologie / IT',
  healthcare: '🏥 Santé',
  education: '🎓 Éducation',
  finance: '💰 Finance / Banque',
  retail: '🛒 Commerce / Retail',
  manufacturing: '🏭 Industrie / Fabrication',
  services: '💼 Services professionnels',
  government: '🏛️ Gouvernement / Public',
  nonprofit: '❤️ Association / ONG',
  other: '📋 Autre',
}

// Mapping des tailles d'entreprise
const companySizeLabels = {
  '1-10': '👤 1-10 employés',
  '11-50': '👥 11-50 employés',
  '51-200': '🏢 51-200 employés',
  '201-500': '🏬 201-500 employés',
  '500+': '🏙️ 500+ employés',
}

const PendingRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchPendingRequests = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/pending-requests')
      setRequests(response.data.data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error)
      message.error('Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const handleApprove = async (user) => {
    setActionLoading(true)
    try {
      await api.post(`/admin/users/${user.id}/approve`)
      message.success(`Le compte de ${user.name} a été approuvé !`)
      fetchPendingRequests()
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error)
      message.error('Erreur lors de l\'approbation du compte')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedUser) return
    
    setActionLoading(true)
    try {
      await api.post(`/admin/users/${selectedUser.id}/reject`, { reason: rejectReason })
      message.success(`La demande de ${selectedUser.name} a été refusée`)
      setRejectModalVisible(false)
      setSelectedUser(null)
      setRejectReason('')
      fetchPendingRequests()
    } catch (error) {
      console.error('Erreur lors du refus:', error)
      message.error('Erreur lors du refus de la demande')
    } finally {
      setActionLoading(false)
    }
  }

  const openRejectModal = (user) => {
    setSelectedUser(user)
    setRejectModalVisible(true)
  }

  const columns = [
    {
      title: 'Utilisateur',
      key: 'user',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <UserOutlined />
            <Text strong>{record.name}</Text>
          </Space>
          <Space>
            <MailOutlined style={{ color: '#8c8c8c' }} />
            <Text type="secondary">{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Rôle demandé',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color="gold" icon={<UserOutlined />}>
          {role === 'manager' ? 'Manager' : role}
        </Tag>
      ),
    },
    {
      title: 'Date de demande',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('DD/MM/YYYY HH:mm')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <ClockCircleOutlined /> {dayjs(date).fromNow()}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
            loading={actionLoading}
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
          >
            Approuver
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => openRejectModal(record)}
          >
            Refuser
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Demandes en attente
            {requests.length > 0 && (
              <Badge 
                count={requests.length} 
                style={{ marginLeft: 12, backgroundColor: '#faad14' }} 
              />
            )}
          </Title>
          <Text type="secondary">Gérez les demandes de comptes Manager</Text>
        </div>
        <Button onClick={fetchPendingRequests} loading={loading}>
          Actualiser
        </Button>
      </div>

      <Card>
        {requests.length === 0 && !loading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                Aucune demande en attente
                <br />
                <Text type="secondary">Les nouvelles demandes de comptes Manager apparaîtront ici</Text>
              </span>
            }
          />
        ) : (
          <Table
            columns={columns}
            dataSource={requests}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            expandable={{
              expandedRowRender: (record) => {
                const org = record.organization
                if (!org) {
                  return (
                    <Text type="secondary" italic>
                      Aucune information d'organisation fournie
                    </Text>
                  )
                }
                return (
                  <div style={{ padding: '16px 0' }}>
                    <Title level={5} style={{ marginBottom: 16 }}>
                      <BankOutlined style={{ marginRight: 8 }} />
                      Informations de l'organisation
                    </Title>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Space direction="vertical" size={4}>
                          <Text type="secondary"><BankOutlined /> Entreprise</Text>
                          <Text strong>{org.company_name || '-'}</Text>
                        </Space>
                      </Card>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Space direction="vertical" size={4}>
                          <Text type="secondary"><PhoneOutlined /> Téléphone</Text>
                          <Text strong>{org.phone || '-'}</Text>
                        </Space>
                      </Card>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Space direction="vertical" size={4}>
                          <Text type="secondary"><GlobalOutlined /> Secteur</Text>
                          <Text strong>{industryLabels[org.industry] || org.industry || '-'}</Text>
                        </Space>
                      </Card>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Space direction="vertical" size={4}>
                          <Text type="secondary"><TeamOutlined /> Taille</Text>
                          <Text strong>{companySizeLabels[org.company_size] || org.company_size || '-'}</Text>
                        </Space>
                      </Card>
                    </div>
                    {org.description && (
                      <Card size="small" style={{ marginTop: 16, background: '#fafafa' }}>
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <Text type="secondary"><FileTextOutlined /> Description / Projet</Text>
                          <Paragraph style={{ marginBottom: 0 }}>{org.description}</Paragraph>
                        </Space>
                      </Card>
                    )}
                  </div>
                )
              },
              rowExpandable: () => true,
            }}
          />
        )}
      </Card>

      <Modal
        title="Refuser la demande"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false)
          setSelectedUser(null)
          setRejectReason('')
        }}
        onOk={handleReject}
        okText="Confirmer le refus"
        cancelText="Annuler"
        okButtonProps={{ danger: true, loading: actionLoading }}
      >
        <p>
          Vous êtes sur le point de refuser la demande de <strong>{selectedUser?.name}</strong>.
        </p>
        <p>Raison du refus (optionnel) :</p>
        <TextArea
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Ex: Informations incomplètes, demande non conforme..."
        />
      </Modal>
    </div>
  )
}

export default PendingRequests

