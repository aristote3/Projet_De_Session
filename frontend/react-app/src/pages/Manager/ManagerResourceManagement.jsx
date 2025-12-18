import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Typography, Button, Table, Tag, Modal, Space, Input, Select, Switch, message, InputNumber, TimePicker, Divider, Tabs, Form } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, AppstoreOutlined, SettingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchResources, deleteResource, createResource, updateResource } from '../../store/slices/resourcesSlice'
import { useResourcePolling } from '../../hooks/useResourcePolling'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Search } = Input
const { TextArea } = Input

const ManagerResourceManagement = () => {
  const dispatch = useDispatch()
  const { items: resources, loading } = useSelector((state) => state.resources)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Polling automatique toutes les 30 secondes pour mettre à jour les ressources en temps réel
  useResourcePolling(30, true)

  const handleAdd = () => {
    setEditingResource(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (resource) => {
    setEditingResource(resource)
    form.setFieldsValue({
      ...resource,
      // Mapper la catégorie backend vers frontend pour l'affichage
      category: mapCategoryFromBackend(resource.category),
      opening_hours_start: resource.opening_hours_start ? dayjs(resource.opening_hours_start, 'HH:mm') : null,
      opening_hours_end: resource.opening_hours_end ? dayjs(resource.opening_hours_end, 'HH:mm') : null,
      booking_rules: resource.booking_rules || {
        maxDuration: 24,
        bufferMinutes: 0,
        requireApproval: false,
        allowedUserGroups: [],
        maxAdvanceDays: 90,
      },
    })
    setIsModalVisible(true)
  }

  // Mapping des catégories frontend vers backend
  const mapCategoryToBackend = (category) => {
    const categoryMap = {
      'Salle de réunion': 'salle',
      'Salle de conférence': 'salle',
      'Équipement': 'equipement',
      'Véhicule': 'vehicule',
      'Service': 'service',
      'Personnel': 'service',
      'Créneau horaire': 'service',
    }
    return categoryMap[category] || 'salle'
  }

  // Mapping inverse pour l'affichage
  const mapCategoryFromBackend = (category) => {
    const reverseMap = {
      'salle': 'Salle de réunion',
      'equipement': 'Équipement',
      'vehicule': 'Véhicule',
      'service': 'Service',
    }
    return reverseMap[category] || category
  }

  const handleSave = async (values) => {
    try {
      // Préparer les données pour l'API
      const resourceData = {
        name: values.name,
        category: mapCategoryToBackend(values.category),
        description: values.description || null,
        capacity: values.capacity || 1,
        image_url: values.image_url || null,
        status: values.status || 'available',
        pricing_type: values.pricing_type || 'gratuit',
        price: values.price || 0,
        equipments: values.equipments || null,
        // Formater les horaires en format H:i
        opening_hours_start: values.opening_hours_start 
          ? values.opening_hours_start.format('HH:mm') 
          : '08:00',
        opening_hours_end: values.opening_hours_end 
          ? values.opening_hours_end.format('HH:mm') 
          : '18:00',
      }

      if (editingResource) {
        // Mise à jour
        await dispatch(updateResource({ id: editingResource.id, data: resourceData })).unwrap()
        message.success('Ressource modifiée avec succès')
      } else {
        // Création
        await dispatch(createResource(resourceData)).unwrap()
        message.success('Ressource créée avec succès')
      }

      setIsModalVisible(false)
      setEditingResource(null)
      form.resetFields()
      // Rafraîchir la liste
      dispatch(fetchResources())
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      // Gérer spécifiquement les erreurs 403
      if (error?.response?.status === 403 || error?.message?.includes('permission')) {
        message.error('Vous n\'avez pas la permission d\'effectuer cette action. Seuls les managers et administrateurs peuvent gérer les ressources.')
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la sauvegarde'
        message.error(errorMessage)
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'available' ? 'maintenance' : 'available'
      const resource = resources.find(r => r.id === id)
      if (resource) {
        await dispatch(updateResource({ 
          id, 
          data: { ...resource, status: newStatus } 
        })).unwrap()
        message.success(`Ressource ${newStatus === 'available' ? 'activée' : 'mise en maintenance'}`)
        dispatch(fetchResources())
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      // Gérer spécifiquement les erreurs 403
      if (error?.response?.status === 403 || error?.message?.includes('permission')) {
        message.error('Vous n\'avez pas la permission de modifier le statut de cette ressource.')
      } else {
        message.error('Erreur lors de la mise à jour du statut')
      }
    }
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: 'Êtes-vous sûr de vouloir supprimer cette ressource ?',
      okText: 'Supprimer',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(deleteResource(id)).unwrap()
          message.success('Ressource supprimée')
          dispatch(fetchResources())
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          // Gérer spécifiquement les erreurs 403
          if (error?.response?.status === 403 || error?.message?.includes('permission')) {
            message.error('Vous n\'avez pas la permission de supprimer cette ressource.')
          } else {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression'
            message.error(errorMessage)
          }
        }
      },
    })
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchText || 
      resource.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || resource.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{mapCategoryFromBackend(category) || 'Non spécifié'}</Tag>,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space>
          <Tag color={status === 'available' ? 'green' : status === 'busy' ? 'orange' : 'red'}>
            {status === 'available' ? 'Disponible' : status === 'busy' ? 'Occupé' : 'Indisponible'}
          </Tag>
          <Switch
            size="small"
            checked={status === 'available'}
            onChange={() => handleToggleStatus(record.id, status)}
          />
        </Space>
      ),
    },
    {
      title: 'Capacité',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (capacity) => capacity ? `${capacity} personnes` : '-',
    },
    {
      title: 'Horaires',
      key: 'hours',
      render: (_, record) => {
        if (record.opening_hours_start && record.opening_hours_end) {
          return `${record.opening_hours_start} - ${record.opening_hours_end}`
        }
        return '-'
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Modifier
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'basic',
      label: 'Informations de base',
      children: (
        <>
          <Form.Item
            name="name"
            label="Nom de la ressource"
            rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
          >
            <Input placeholder="Ex: Salle de réunion A" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Catégorie"
            rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
          >
            <Select placeholder="Sélectionner une catégorie">
              <Select.Option value="Salle de réunion">Salle de réunion</Select.Option>
              <Select.Option value="Salle de conférence">Salle de conférence</Select.Option>
              <Select.Option value="Équipement">Équipement</Select.Option>
              <Select.Option value="Véhicule">Véhicule</Select.Option>
              <Select.Option value="Service">Service</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} placeholder="Description de la ressource..." />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacité (personnes)"
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nombre de personnes" />
          </Form.Item>

          <Form.Item
            name="image_url"
            label="URL de l'image"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'availability',
      label: 'Disponibilité',
      children: (
        <>
          <Form.Item
            name="status"
            label="Statut"
            initialValue="available"
          >
            <Select>
              <Select.Option value="available">Disponible</Select.Option>
              <Select.Option value="busy">Occupé</Select.Option>
              <Select.Option value="maintenance">En maintenance</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Heures d'ouverture">
            <Space>
              <Form.Item name="opening_hours_start" noStyle>
                <TimePicker format="HH:mm" placeholder="Début" />
              </Form.Item>
              <span>-</span>
              <Form.Item name="opening_hours_end" noStyle>
                <TimePicker format="HH:mm" placeholder="Fin" />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item
            name="visible"
            label="Visible pour les utilisateurs"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Oui" unCheckedChildren="Non" />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'rules',
      label: 'Règles de réservation',
      children: (
        <>
          <Form.Item
            name={['booking_rules', 'maxDuration']}
            label="Durée maximum (heures)"
            tooltip="Durée maximum d'une réservation pour cette ressource"
          >
            <InputNumber min={1} max={168} style={{ width: '100%' }} suffix="heures" />
          </Form.Item>

          <Form.Item
            name={['booking_rules', 'bufferMinutes']}
            label="Tampon entre réservations (minutes)"
            tooltip="Temps minimum entre deux réservations consécutives"
          >
            <InputNumber min={0} style={{ width: '100%' }} suffix="minutes" />
          </Form.Item>

          <Form.Item
            name={['booking_rules', 'requireApproval']}
            label="Nécessite une approbation"
            valuePropName="checked"
            tooltip="Si activé, toutes les réservations nécessiteront votre approbation"
          >
            <Switch checkedChildren="Oui" unCheckedChildren="Non" />
          </Form.Item>

          <Form.Item
            name={['booking_rules', 'maxAdvanceDays']}
            label="Jours d'avance maximum"
            tooltip="Nombre maximum de jours à l'avance pour réserver"
          >
            <InputNumber min={1} max={365} style={{ width: '100%' }} suffix="jours" />
          </Form.Item>

          <Form.Item
            name={['booking_rules', 'allowedUserGroups']}
            label="Groupes d'utilisateurs autorisés"
            tooltip="Laissez vide pour autoriser tous les utilisateurs"
          >
            <Select mode="tags" placeholder="Ajouter des groupes (ex: Équipe A, VIP)">
              {/* TODO: Récupérer les groupes depuis l'API */}
            </Select>
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Gestion des ressources</Title>
          <Text type="secondary">Créez et gérez les ressources que vos utilisateurs peuvent réserver</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
          Créer une ressource
        </Button>
      </div>

      {/* Filtres */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Rechercher une ressource..."
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
              <Select.Option value="available">Disponible</Select.Option>
              <Select.Option value="busy">Occupé</Select.Option>
              <Select.Option value="maintenance">Maintenance</Select.Option>
              <Select.Option value="unavailable">Indisponible</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Statistiques */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Space>
              <AppstoreOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div>
                <Text type="secondary">Total</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>{resources.length}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Space>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <Text type="secondary">Disponibles</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {resources.filter(r => r.status === 'available').length}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Space>
              <CloseCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <div>
                <Text type="secondary">Indisponibles</Text>
                <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {resources.filter(r => r.status !== 'available').length}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tableau des ressources */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredResources}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* Modal pour créer/modifier */}
      <Modal
        title={editingResource ? 'Modifier la ressource' : 'Nouvelle ressource'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingResource(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            status: 'available',
            visible: true,
            booking_rules: {
              maxDuration: 24,
              bufferMinutes: 0,
              requireApproval: false,
              maxAdvanceDays: 90,
              allowedUserGroups: [],
            },
          }}
        >
          <Tabs items={tabItems} />

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingResource ? 'Modifier' : 'Créer'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false)
                setEditingResource(null)
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

export default ManagerResourceManagement

