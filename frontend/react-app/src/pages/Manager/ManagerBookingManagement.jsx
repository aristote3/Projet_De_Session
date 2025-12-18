import React, { useEffect, useState } from 'react'
import { Table, Typography, Button, Tag, Space, Modal, message, Input, Select, DatePicker, Card, Row, Col, Statistic, Alert } from 'antd'
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined, SearchOutlined, BookOutlined, WarningOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookings, approveBooking, cancelBooking } from '../../store/slices/bookingsSlice'
import { fetchResources } from '../../store/slices/resourcesSlice'
import BookingForm from '../../components/Bookings/BookingForm'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Search } = Input
const { RangePicker } = DatePicker

const ManagerBookingManagement = () => {
  const dispatch = useDispatch()
  const { items: bookings, loading } = useSelector((state) => state.bookings)
  const { items: resources } = useSelector((state) => state.resources)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState(null)
  const [resourceFilter, setResourceFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchBookings())
  }, [dispatch])

  const handleApprove = async (id) => {
    try {
      await dispatch(approveBooking(id)).unwrap()
      message.success('Réservation approuvée')
      // Rafraîchir les ressources pour mettre à jour leur statut
      dispatch(fetchResources())
      dispatch(fetchBookings())
    } catch (error) {
      message.error('Erreur lors de l\'approbation')
    }
  }

  const handleReject = (id) => {
    Modal.confirm({
      title: 'Refuser la réservation',
      content: 'Êtes-vous sûr de vouloir refuser cette réservation ?',
      okText: 'Refuser',
      okType: 'danger',
      onOk: async () => {
        try {
          // TODO: Implémenter rejectBooking dans le slice
          message.success('Réservation refusée')
          dispatch(fetchResources())
          dispatch(fetchBookings())
        } catch (error) {
          message.error('Erreur lors du refus')
        }
      },
    })
  }

  const handleCancel = (id) => {
    Modal.confirm({
      title: 'Annuler la réservation',
      content: 'Êtes-vous sûr de vouloir annuler cette réservation ?',
      okText: 'Annuler',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(cancelBooking(id)).unwrap()
          message.success('Réservation annulée')
          // Rafraîchir les ressources pour mettre à jour leur statut
          dispatch(fetchResources())
          dispatch(fetchBookings())
        } catch (error) {
          message.error('Erreur lors de l\'annulation')
        }
      },
    })
  }

  const handleEdit = (booking) => {
    setEditingBooking(booking)
    setIsModalVisible(true)
  }

  const handleCreate = () => {
    setEditingBooking(null)
    setIsModalVisible(true)
  }

  // Détecter les conflits
  const conflicts = bookings.filter(booking => {
    if (booking.status !== 'pending' && booking.status !== 'approved') return false
    return bookings.some(b => 
      b.id !== booking.id &&
      (b.status === 'approved' || b.status === 'pending') &&
      (b.resource_id === booking.resource_id || b.resource?.id === booking.resource?.id) &&
      dayjs(b.start_time).isSame(dayjs(booking.start_time), 'day') &&
      (
        (dayjs(b.start_time).isBefore(dayjs(booking.end_time)) && dayjs(b.end_time).isAfter(dayjs(booking.start_time)))
      )
    )
  })

  // Filtrer les réservations
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchText || 
      booking.resource?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.user?.name?.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesDate = !dateRange || (
      dayjs(booking.start_time).isAfter(dateRange[0].subtract(1, 'day')) &&
      dayjs(booking.start_time).isBefore(dateRange[1].add(1, 'day'))
    )
    const matchesResource = resourceFilter === 'all' || 
      booking.resource_id === parseInt(resourceFilter) ||
      booking.resource?.id === parseInt(resourceFilter)
    return matchesSearch && matchesStatus && matchesDate && matchesResource
  })

  const columns = [
    {
      title: 'Ressource',
      dataIndex: ['resource', 'name'],
      key: 'resource',
      sorter: (a, b) => (a.resource?.name || '').localeCompare(b.resource?.name || ''),
    },
    {
      title: 'Utilisateur',
      dataIndex: ['user', 'name'],
      key: 'user',
      sorter: (a, b) => (a.user?.name || '').localeCompare(b.user?.name || ''),
    },
    {
      title: 'Date/Heure',
      key: 'datetime',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(record.start_time).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(record.start_time).format('HH:mm')} - {dayjs(record.end_time).format('HH:mm')}
          </Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.start_time).unix() - dayjs(b.start_time).unix(),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const isConflict = conflicts.some(c => c.id === record.id)
        const colorMap = {
          approved: 'green',
          pending: 'orange',
          rejected: 'red',
          cancelled: 'default',
        }
        const textMap = {
          approved: 'Approuvée',
          pending: 'En attente',
          rejected: 'Refusée',
          cancelled: 'Annulée',
        }
        return (
          <Space>
            <Tag color={colorMap[status]}>{textMap[status] || status}</Tag>
            {isConflict && <Tag color="red" icon={<WarningOutlined />}>Conflit</Tag>}
          </Space>
        )
      },
      filters: [
        { text: 'Approuvée', value: 'approved' },
        { text: 'En attente', value: 'pending' },
        { text: 'Refusée', value: 'rejected' },
        { text: 'Annulée', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes) => notes ? <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>{notes}</Text> : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Approuver
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                Refuser
              </Button>
            </>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Modifier
          </Button>
          {record.status !== 'cancelled' && (
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleCancel(record.id)}
            >
              Annuler
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // Statistiques
  const stats = {
    total: bookings.length,
    approved: bookings.filter(b => b.status === 'approved').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    conflicts: conflicts.length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Gestion des réservations</Title>
          <Text type="secondary">Vue complète de toutes les réservations de votre organisation</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Créer une réservation
        </Button>
      </div>

      {/* Alertes de conflits */}
      {conflicts.length > 0 && (
        <Alert
          message={`${conflicts.length} conflit(s) de réservation détecté(s)`}
          description="Des réservations se chevauchent. Veuillez les résoudre."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total"
              value={stats.total}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Approuvées"
              value={stats.approved}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="En attente"
              value={stats.pending}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Conflits"
              value={stats.conflicts}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtres */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Rechercher..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filtrer par statut"
              style={{ width: '100%' }}
              size="large"
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Select.Option value="all">Tous les statuts</Select.Option>
              <Select.Option value="approved">Approuvée</Select.Option>
              <Select.Option value="pending">En attente</Select.Option>
              <Select.Option value="rejected">Refusée</Select.Option>
              <Select.Option value="cancelled">Annulée</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filtrer par ressource"
              style={{ width: '100%' }}
              size="large"
              value={resourceFilter}
              onChange={setResourceFilter}
            >
              <Select.Option value="all">Toutes les ressources</Select.Option>
              {resources.map(r => (
                <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              size="large"
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
            />
          </Col>
        </Row>
      </Card>

      {/* Tableau des réservations */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBookings}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal pour créer/modifier */}
      <Modal
        title={editingBooking ? 'Modifier la réservation' : 'Créer une réservation'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingBooking(null)
        }}
        footer={null}
        width={700}
      >
        <BookingForm
          booking={editingBooking}
          resources={resources}
          onSuccess={() => {
            setIsModalVisible(false)
            setEditingBooking(null)
            dispatch(fetchBookings())
            dispatch(fetchResources())
            message.success(editingBooking ? 'Réservation modifiée avec succès' : 'Réservation créée avec succès')
          }}
        />
      </Modal>
    </div>
  )
}

export default ManagerBookingManagement

