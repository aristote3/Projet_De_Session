import React, { useEffect, useState } from 'react'
import { Table, Typography, Button, Tag, Space, Modal, message, Card, Row, Col, Statistic, Empty, Popconfirm } from 'antd'
import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookings, cancelBooking } from '../../store/slices/bookingsSlice'
import { fetchResources } from '../../store/slices/resourcesSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BookingForm from '../../components/Bookings/BookingForm'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const UserBookings = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { items: bookings, loading } = useSelector((state) => state.bookings)
  const { items: resources } = useSelector((state) => state.resources)
  const { user } = useSelector((state) => state.auth)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [filter, setFilter] = useState('all') // all, upcoming, past, pending

  useEffect(() => {
    dispatch(fetchBookings())
  }, [dispatch])

  // Si un paramètre resource est dans l'URL, ouvrir le modal de réservation
  useEffect(() => {
    const resourceId = searchParams.get('resource')
    if (resourceId && resources.length > 0) {
      setIsModalVisible(true)
    }
  }, [searchParams, resources])

  // Filtrer les réservations de l'utilisateur
  const userBookings = bookings.filter(b => 
    b.user_id === user?.id || b.user?.id === user?.id
  )

  // Filtrer selon le filtre sélectionné
  const filteredBookings = userBookings.filter(booking => {
    const now = dayjs()
    const startTime = dayjs(booking.start_time)
    
    switch (filter) {
      case 'upcoming':
        return startTime.isAfter(now) && booking.status !== 'cancelled'
      case 'past':
        return dayjs(booking.end_time).isBefore(now)
      case 'pending':
        return booking.status === 'pending'
      case 'confirmed':
        return booking.status === 'approved'
      default:
        return true
    }
  })

  const handleCancel = async (id) => {
    try {
      await dispatch(cancelBooking(id)).unwrap()
      message.success('Réservation annulée')
      // Rafraîchir les ressources pour mettre à jour leur statut
      dispatch(fetchResources())
      dispatch(fetchBookings())
    } catch (error) {
      message.error('Erreur lors de l\'annulation')
    }
  }

  const handleModify = (booking) => {
    // Vérifier si la modification est autorisée
    const now = dayjs()
    const startTime = dayjs(booking.start_time)
    const hoursUntilStart = startTime.diff(now, 'hour')

    // TODO: Vérifier les règles du manager (ex: min 24h avant)
    if (hoursUntilStart < 24) {
      message.warning('Vous ne pouvez modifier une réservation que 24 heures avant le début')
      return
    }

    if (booking.status !== 'approved' && booking.status !== 'pending') {
      message.warning('Cette réservation ne peut pas être modifiée')
      return
    }

    setEditingBooking(booking)
    setIsModalVisible(true)
  }

  const handlePrint = (booking) => {
    // TODO: Implémenter l'impression
    window.print()
  }

  const handleDownload = (booking) => {
    // TODO: Implémenter le téléchargement PDF
    message.info('Téléchargement de la confirmation...')
  }

  const columns = [
    {
      title: 'Ressource',
      dataIndex: ['resource', 'name'],
      key: 'resource',
      render: (name) => <Text strong>{name || 'N/A'}</Text>,
    },
    {
      title: 'Date',
      key: 'date',
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
      render: (status) => {
        const statusMap = {
          approved: { text: 'Confirmée', color: 'green', icon: <CheckCircleOutlined /> },
          pending: { text: 'En attente', color: 'orange', icon: <ClockCircleOutlined /> },
          rejected: { text: 'Refusée', color: 'red', icon: <CloseCircleOutlined /> },
          cancelled: { text: 'Annulée', color: 'default', icon: <CloseCircleOutlined /> },
        }
        const statusInfo = statusMap[status] || { text: status, color: 'default' }
        return (
          <Tag color={statusInfo.color} icon={statusInfo.icon}>
            {statusInfo.text}
          </Tag>
        )
      },
      filters: [
        { text: 'Confirmée', value: 'approved' },
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
      render: (notes) => notes ? <Text type="secondary" ellipsis>{notes}</Text> : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const now = dayjs()
        const startTime = dayjs(record.start_time)
        const canModify = startTime.isAfter(now) && (record.status === 'approved' || record.status === 'pending')
        const canCancel = startTime.isAfter(now) && record.status !== 'cancelled' && record.status !== 'rejected'

        return (
          <Space>
            {record.status === 'approved' && (
              <>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(record)}
                >
                  Télécharger
                </Button>
                <Button
                  size="small"
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrint(record)}
                >
                  Imprimer
                </Button>
              </>
            )}
            {canModify && (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleModify(record)}
              >
                Modifier
              </Button>
            )}
            {canCancel && (
              <Popconfirm
                title="Annuler la réservation"
                description="Êtes-vous sûr de vouloir annuler cette réservation ?"
                onConfirm={() => handleCancel(record.id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  Annuler
                </Button>
              </Popconfirm>
            )}
          </Space>
        )
      },
    },
  ]

  // Statistiques
  const stats = {
    total: userBookings.length,
    upcoming: userBookings.filter(b => dayjs(b.start_time).isAfter(dayjs()) && b.status !== 'cancelled').length,
    pending: userBookings.filter(b => b.status === 'pending').length,
    confirmed: userBookings.filter(b => b.status === 'approved').length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Mes réservations</Title>
          <Text type="secondary">Gérez vos réservations et consultez votre historique</Text>
        </div>
        <Button 
          type="primary" 
          icon={<BookOutlined />} 
          size="large"
          onClick={() => {
            setEditingBooking(null)
            setIsModalVisible(true)
          }}
        >
          Nouvelle réservation
        </Button>
      </div>

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
              title="À venir"
              value={stats.upcoming}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="En attente"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Confirmées"
              value={stats.confirmed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtres */}
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button 
            type={filter === 'all' ? 'primary' : 'default'}
            onClick={() => setFilter('all')}
          >
            Toutes
          </Button>
          <Button 
            type={filter === 'upcoming' ? 'primary' : 'default'}
            onClick={() => setFilter('upcoming')}
          >
            À venir
          </Button>
          <Button 
            type={filter === 'past' ? 'primary' : 'default'}
            onClick={() => setFilter('past')}
          >
            Passées
          </Button>
          <Button 
            type={filter === 'pending' ? 'primary' : 'default'}
            onClick={() => setFilter('pending')}
          >
            En attente
          </Button>
          <Button 
            type={filter === 'confirmed' ? 'primary' : 'default'}
            onClick={() => setFilter('confirmed')}
          >
            Confirmées
          </Button>
        </Space>
      </Card>

      {/* Tableau des réservations */}
      <Card>
        {filteredBookings.length === 0 ? (
          <Empty 
            description="Aucune réservation trouvée"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<BookOutlined />} onClick={() => setIsModalVisible(true)}>
              Créer une réservation
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredBookings}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        )}
      </Card>

      {/* Modal pour créer/modifier une réservation */}
      <Modal
        title={editingBooking ? 'Modifier la réservation' : 'Nouvelle réservation'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingBooking(null)
          // Nettoyer l'URL si on avait un paramètre resource
          if (searchParams.get('resource')) {
            navigate('/bookings')
          }
        }}
        footer={null}
        width={700}
      >
        <BookingForm
          booking={editingBooking}
          resources={resources}
          initialResourceId={searchParams.get('resource')}
          onSuccess={() => {
            setIsModalVisible(false)
            setEditingBooking(null)
            dispatch(fetchBookings())
            dispatch(fetchResources())
            message.success(editingBooking ? 'Réservation modifiée avec succès' : 'Réservation créée avec succès')
            if (searchParams.get('resource')) {
              navigate('/bookings')
            }
          }}
        />
      </Modal>
    </div>
  )
}

export default UserBookings

