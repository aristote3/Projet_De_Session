import React, { useEffect, useState } from 'react'
import { Table, Typography, Button, Tag, Space, Modal, message } from 'antd'
import { PlusOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookings, approveBooking, cancelBooking } from '../store/slices/bookingsSlice'
import { fetchResources } from '../store/slices/resourcesSlice'
import BookingForm from '../components/Bookings/BookingForm'
import UserBookings from './User/UserBookings'
import dayjs from 'dayjs'

const { Title } = Typography

const Bookings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: bookings, loading } = useSelector((state) => state.bookings)
  const { items: resources } = useSelector((state) => state.resources)
  const [isModalVisible, setIsModalVisible] = useState(false)

  // Si l'utilisateur est un user normal, utiliser UserBookings
  if (user?.role === 'user') {
    return <UserBookings />
  }

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

  const handleCancel = (id) => {
    Modal.confirm({
      title: 'Confirmer l\'annulation',
      content: 'Êtes-vous sûr de vouloir annuler cette réservation ?',
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

  const columns = [
    {
      title: 'Ressource',
      dataIndex: ['resource', 'name'],
      key: 'resource',
    },
    {
      title: 'Utilisateur',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Début',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Fin',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          approved: 'green',
          pending: 'orange',
          rejected: 'red',
          cancelled: 'default',
        }
        return <Tag color={colorMap[status]}>{status}</Tag>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id)}
            >
              Approuver
            </Button>
          )}
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>Gestion des réservations</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Nouvelle réservation
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Nouvelle réservation"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <BookingForm
          resources={resources}
          onSuccess={() => {
            setIsModalVisible(false)
            dispatch(fetchBookings())
            dispatch(fetchResources())
          }}
        />
      </Modal>
    </div>
  )
}

export default Bookings

