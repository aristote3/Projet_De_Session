import React, { useState, useEffect, useRef } from 'react'
import { Card, Tooltip, Tag, Space, Typography, Badge, Button, Spin, Empty, Drawer, Descriptions, Alert } from 'antd'
import { 
  EnvironmentOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined
} from '@ant-design/icons'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import dayjs from 'dayjs'

const { Text, Title } = Typography

// Room shapes for the floor plan
const roomShapes = {
  rectangle: (x, y, width, height) => `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`,
  roundedRect: (x, y, width, height, radius = 10) => 
    `M ${x + radius} ${y} L ${x + width - radius} ${y} Q ${x + width} ${y} ${x + width} ${y + radius} 
     L ${x + width} ${y + height - radius} Q ${x + width} ${y + height} ${x + width - radius} ${y + height} 
     L ${x + radius} ${y + height} Q ${x} ${y + height} ${x} ${y + height - radius} 
     L ${x} ${y + radius} Q ${x} ${y} ${x + radius} ${y} Z`,
  circle: (cx, cy, radius) => `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`,
}

const FloorMap = ({ onResourceSelect, showBookingInfo = true }) => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [hoveredRoom, setHoveredRoom] = useState(null)
  const { isDarkMode, theme } = useTheme()
  const navigate = useNavigate()
  const svgRef = useRef(null)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await api.get('/resources')
      // Add position data for floor plan visualization
      const resourcesWithPositions = (response.data.data || []).map((resource, index) => ({
        ...resource,
        // Generate positions in a grid layout
        position: resource.position || generatePosition(index, resource.type),
        size: resource.size || getDefaultSize(resource.type),
      }))
      setResources(resourcesWithPositions)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generate positions based on resource type
  const generatePosition = (index, type) => {
    const cols = 4
    const rowHeight = 120
    const colWidth = 180
    const padding = 40

    const row = Math.floor(index / cols)
    const col = index % cols

    return {
      x: padding + col * colWidth,
      y: padding + row * rowHeight,
    }
  }

  // Get default size based on resource type
  const getDefaultSize = (type) => {
    const sizes = {
      room: { width: 150, height: 100 },
      desk: { width: 80, height: 60 },
      equipment: { width: 60, height: 60 },
      vehicle: { width: 100, height: 60 },
      default: { width: 120, height: 80 },
    }
    return sizes[type] || sizes.default
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return { fill: isDarkMode ? '#166534' : '#dcfce7', stroke: '#22c55e', text: '#22c55e' }
      case 'occupied':
        return { fill: isDarkMode ? '#991b1b' : '#fee2e2', stroke: '#ef4444', text: '#ef4444' }
      case 'maintenance':
        return { fill: isDarkMode ? '#854d0e' : '#fef3c7', stroke: '#eab308', text: '#eab308' }
      default:
        return { fill: isDarkMode ? '#374151' : '#f3f4f6', stroke: '#9ca3af', text: '#6b7280' }
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircleOutlined style={{ color: '#22c55e' }} />
      case 'occupied':
        return <CloseCircleOutlined style={{ color: '#ef4444' }} />
      case 'maintenance':
        return <ToolOutlined style={{ color: '#eab308' }} />
      default:
        return <ClockCircleOutlined style={{ color: '#6b7280' }} />
    }
  }

  const handleRoomClick = (resource) => {
    setSelectedResource(resource)
    if (showBookingInfo) {
      setDrawerVisible(true)
    }
    if (onResourceSelect) {
      onResourceSelect(resource)
    }
  }

  const handleBookNow = () => {
    if (selectedResource) {
      navigate(`/resources`, { state: { selectedResource: selectedResource.id } })
    }
  }

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
  }

  // Calculate SVG viewBox based on resources
  const getViewBox = () => {
    if (resources.length === 0) return '0 0 800 600'
    
    const maxX = Math.max(...resources.map(r => (r.position?.x || 0) + (r.size?.width || 150)))
    const maxY = Math.max(...resources.map(r => (r.position?.y || 0) + (r.size?.height || 100)))
    
    return `0 0 ${maxX + 80} ${maxY + 80}`
  }

  if (loading) {
    return (
      <Card style={{ background: isDarkMode ? theme.colorBgContainer : '#fff', textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: 16 }}>Chargement du plan...</Text>
      </Card>
    )
  }

  if (resources.length === 0) {
    return (
      <Card style={{ background: isDarkMode ? theme.colorBgContainer : '#fff' }}>
        <Empty description="Aucune ressource disponible" />
      </Card>
    )
  }

  return (
    <>
      <Card
        title={
          <Space>
            <EnvironmentOutlined />
            <span>Plan interactif</span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ZoomOutOutlined />} onClick={() => handleZoom(-0.1)} disabled={zoom <= 0.5} />
            <Text>{Math.round(zoom * 100)}%</Text>
            <Button icon={<ZoomInOutlined />} onClick={() => handleZoom(0.1)} disabled={zoom >= 2} />
            <Button icon={<ReloadOutlined />} onClick={fetchResources} />
          </Space>
        }
        style={{ 
          background: isDarkMode ? theme.colorBgContainer : '#fff',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Legend */}
        <div style={{ 
          padding: '12px 16px', 
          borderBottom: `1px solid ${theme.colorBorder}`,
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <Space>
            <Badge color="#22c55e" />
            <Text>Disponible</Text>
          </Space>
          <Space>
            <Badge color="#ef4444" />
            <Text>Occupé</Text>
          </Space>
          <Space>
            <Badge color="#eab308" />
            <Text>Maintenance</Text>
          </Space>
        </div>

        {/* SVG Floor Plan */}
        <div 
          style={{ 
            overflow: 'auto',
            background: isDarkMode ? '#0f172a' : '#f8fafc',
            padding: 16
          }}
        >
          <svg
            ref={svgRef}
            viewBox={getViewBox()}
            style={{
              width: '100%',
              height: 400,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.3s ease'
            }}
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path 
                  d="M 20 0 L 0 0 0 20" 
                  fill="none" 
                  stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Resources/Rooms */}
            {resources.map((resource) => {
              const { x, y } = resource.position || { x: 0, y: 0 }
              const { width, height } = resource.size || { width: 120, height: 80 }
              const colors = getStatusColor(resource.status)
              const isHovered = hoveredRoom === resource.id
              const isSelected = selectedResource?.id === resource.id

              return (
                <g
                  key={resource.id}
                  onClick={() => handleRoomClick(resource)}
                  onMouseEnter={() => setHoveredRoom(resource.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Room Shape */}
                  <path
                    d={roomShapes.roundedRect(x, y, width, height, 8)}
                    fill={colors.fill}
                    stroke={isSelected ? theme.colorPrimary : colors.stroke}
                    strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
                    style={{
                      transition: 'all 0.2s ease',
                      filter: isHovered ? 'brightness(1.1)' : 'none',
                    }}
                  />

                  {/* Room Name */}
                  <text
                    x={x + width / 2}
                    y={y + height / 2 - 8}
                    textAnchor="middle"
                    fill={isDarkMode ? '#e2e8f0' : '#1f2937'}
                    fontSize="12"
                    fontWeight="600"
                  >
                    {resource.name.length > 15 ? resource.name.substring(0, 15) + '...' : resource.name}
                  </text>

                  {/* Status Badge */}
                  <text
                    x={x + width / 2}
                    y={y + height / 2 + 10}
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize="10"
                    fontWeight="500"
                  >
                    {resource.status === 'available' ? '✓ Disponible' : 
                     resource.status === 'occupied' ? '✗ Occupé' : 
                     resource.status === 'maintenance' ? '⚙ Maintenance' : resource.status}
                  </text>

                  {/* Type Icon */}
                  <text
                    x={x + 10}
                    y={y + 18}
                    fontSize="14"
                  >
                    {resource.type === 'room' ? '🏢' : 
                     resource.type === 'desk' ? '🖥️' : 
                     resource.type === 'equipment' ? '🔧' : 
                     resource.type === 'vehicle' ? '🚗' : '📦'}
                  </text>

                  {/* Capacity Badge */}
                  {resource.capacity && (
                    <g>
                      <circle
                        cx={x + width - 15}
                        cy={y + 15}
                        r="12"
                        fill={isDarkMode ? '#1e40af' : '#dbeafe'}
                        stroke={theme.colorPrimary}
                        strokeWidth="1"
                      />
                      <text
                        x={x + width - 15}
                        y={y + 19}
                        textAnchor="middle"
                        fill={theme.colorPrimary}
                        fontSize="10"
                        fontWeight="600"
                      >
                        {resource.capacity}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </Card>

      {/* Resource Detail Drawer */}
      <Drawer
        title={
          <Space>
            {getStatusIcon(selectedResource?.status)}
            <span>{selectedResource?.name}</span>
          </Space>
        }
        placement="right"
        width={400}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{
          body: { background: isDarkMode ? theme.colorBgContainer : '#fff' },
          header: { background: isDarkMode ? theme.colorBgContainer : '#fff' }
        }}
      >
        {selectedResource && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Alert
              message={
                selectedResource.status === 'available' 
                  ? 'Disponible maintenant' 
                  : selectedResource.status === 'occupied'
                    ? 'Actuellement occupé'
                    : 'En maintenance'
              }
              type={
                selectedResource.status === 'available' 
                  ? 'success' 
                  : selectedResource.status === 'occupied'
                    ? 'error'
                    : 'warning'
              }
              showIcon
            />

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Type">
                <Tag>{selectedResource.type}</Tag>
              </Descriptions.Item>
              {selectedResource.capacity && (
                <Descriptions.Item label="Capacité">
                  {selectedResource.capacity} personnes
                </Descriptions.Item>
              )}
              {selectedResource.location && (
                <Descriptions.Item label="Emplacement">
                  {selectedResource.location}
                </Descriptions.Item>
              )}
              {selectedResource.price_per_hour && (
                <Descriptions.Item label="Tarif horaire">
                  {selectedResource.price_per_hour}€/h
                </Descriptions.Item>
              )}
              {selectedResource.description && (
                <Descriptions.Item label="Description">
                  {selectedResource.description}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedResource.amenities && selectedResource.amenities.length > 0 && (
              <div>
                <Text strong>Équipements:</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedResource.amenities.map((amenity, index) => (
                    <Tag key={index} style={{ marginBottom: 4 }}>{amenity}</Tag>
                  ))}
                </div>
              </div>
            )}

            {selectedResource.status === 'available' && (
              <Button
                type="primary"
                size="large"
                block
                onClick={handleBookNow}
              >
                Réserver maintenant
              </Button>
            )}
          </Space>
        )}
      </Drawer>
    </>
  )
}

export default FloorMap

