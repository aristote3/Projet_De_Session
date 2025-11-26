import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Typography, Button, Image, Tag, Modal, Space, Empty, Spin, Alert } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, InfoCircleOutlined, BookOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchResources, deleteResource } from '../store/slices/resourcesSlice'
import ResourceForm from '../components/Resources/ResourceForm'

const { Title, Text } = Typography
const { Meta } = Card

const Resources = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: resources, loading } = useSelector((state) => state.resources)
  const { user } = useSelector((state) => state.auth)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)

  // Vérifier si l'utilisateur peut gérer les ressources (admin ou manager)
  const canManageResources = user?.role === 'admin' || user?.role === 'manager'

  useEffect(() => {
    dispatch(fetchResources())
  }, [dispatch])

  const handleAdd = () => {
    setEditingResource(null)
    setIsModalVisible(true)
  }

  const handleEdit = (resource) => {
    setEditingResource(resource)
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: 'Êtes-vous sûr de vouloir supprimer cette ressource ?',
      onOk: () => dispatch(deleteResource(id)),
    })
  }

  const getResourceImage = (resource) => {
    if (resource.image_url) return resource.image_url
    
    const imageMap = {
      'Salle de réunion': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      'Salle de conférence': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      'Équipement': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      'Véhicule': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      'Salle de sport': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      'Laboratoire': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    }
    
    return imageMap[resource.category] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
  }

  // Filtrer les ressources selon le groupe de l'utilisateur (si applicable)
  // Le backend devrait filtrer, mais on peut aussi filtrer côté client si nécessaire
  const filteredResources = resources.filter((resource) => {
    // Si l'utilisateur est admin ou manager, voir toutes les ressources
    if (canManageResources) return true
    
    // Pour les users, ne montrer que les ressources disponibles et visibles
    return resource.status === 'available' && resource.visible !== false
  })

  const handleBookResource = (resource) => {
    // Rediriger vers la page de réservation avec la ressource pré-sélectionnée
    navigate(`/bookings?resource=${resource.id}`)
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>Ressources disponibles</Title>
          {user?.group && (
            <Text type="secondary" style={{ fontSize: 14 }}>
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              Emprise: {user.group}
            </Text>
          )}
        </div>
        {canManageResources && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
            Ajouter une ressource
          </Button>
        )}
      </div>

      {!canManageResources && (
        <Alert
          message="Ressources accessibles"
          description="Vous pouvez consulter les ressources disponibles selon votre emprise. Seuls les administrateurs et gérants peuvent ajouter ou modifier des ressources."
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : filteredResources.length === 0 ? (
        <Empty 
          description="Aucune ressource disponible" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredResources.map((resource) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={resource.id}>
              <Card
                hoverable
                style={{ 
                  height: '100%',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                cover={
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <Image
                      alt={resource.name}
                      src={getResourceImage(resource)}
                      height={200}
                      width="100%"
                      style={{ objectFit: 'cover' }}
                      preview={false}
                    />
                  </div>
                }
                actions={
                  canManageResources
                    ? [
                        <EditOutlined 
                          key="edit" 
                          onClick={() => handleEdit(resource)}
                          style={{ fontSize: 18, color: '#1890ff' }}
                        />,
                        <DeleteOutlined 
                          key="delete" 
                          onClick={() => handleDelete(resource.id)}
                          style={{ fontSize: 18, color: '#ff4d4f' }}
                        />,
                      ]
                    : user?.role === 'user'
                    ? [
                        <Button
                          key="book"
                          type="primary"
                          icon={<BookOutlined />}
                          onClick={() => handleBookResource(resource)}
                          style={{ width: '100%', margin: '8px' }}
                        >
                          Réserver
                        </Button>
                      ]
                    : []
                }
              >
                <Meta
                  title={
                    <div style={{ 
                      fontSize: 16, 
                      fontWeight: 600,
                      marginBottom: 8,
                      color: '#262626'
                    }}>
                      {resource.name}
                    </div>
                  }
                  description={
                    <div>
                      <Text 
                        type="secondary" 
                        style={{ 
                          display: 'block',
                          marginBottom: 12,
                          fontSize: 13,
                          lineHeight: '1.6',
                          minHeight: 40
                        }}
                      >
                        {resource.description || 'Aucune description disponible'}
                      </Text>
                      <Space wrap>
                        <Tag color="blue" style={{ marginBottom: 4 }}>
                          {resource.category || 'Non spécifié'}
                        </Tag>
                        {resource.status && (
                          <Tag 
                            color={
                              resource.status === 'available' ? 'green' :
                              resource.status === 'busy' ? 'orange' : 'red'
                            }
                            style={{ marginBottom: 4 }}
                          >
                            {resource.status === 'available' ? 'Disponible' :
                             resource.status === 'busy' ? 'Occupé' : 'Maintenance'}
                          </Tag>
                        )}
                        {resource.opening_hours_start && resource.opening_hours_end && (
                          <Tag icon={<ClockCircleOutlined />} style={{ marginBottom: 4 }}>
                            {resource.opening_hours_start} - {resource.opening_hours_end}
                          </Tag>
                        )}
                        {resource.capacity && resource.capacity > 1 && (
                          <Tag style={{ marginBottom: 4 }}>
                            Capacité: {resource.capacity}
                          </Tag>
                        )}
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={editingResource ? "Modifier la ressource" : "Nouvelle ressource"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingResource(null)
        }}
        footer={null}
        width={600}
      >
        <ResourceForm
          resource={editingResource}
          onSuccess={() => {
            setIsModalVisible(false)
            setEditingResource(null)
            dispatch(fetchResources())
          }}
        />
      </Modal>
    </div>
  )
}

export default Resources

