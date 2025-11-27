import React, { useState } from 'react'
import { Typography, Space, Card, Row, Col, Statistic, Tag } from 'antd'
import { 
  EnvironmentOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ToolOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'
import FloorMap from '../components/FloorMap/FloorMap'

const { Title, Text } = Typography

const FloorPlan = () => {
  const [selectedResource, setSelectedResource] = useState(null)
  const { isDarkMode, theme } = useTheme()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: theme.colorText }}>
          <EnvironmentOutlined style={{ marginRight: 12 }} />
          Plan des Ressources
        </Title>
        <Text type="secondary">
          Visualisez et réservez vos espaces directement sur le plan
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ background: isDarkMode ? theme.colorBgContainer : '#fff' }}>
            <Statistic
              title="Total"
              value={12}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: theme.colorPrimary }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: isDarkMode ? theme.colorBgContainer : '#fff' }}>
            <Statistic
              title="Disponibles"
              value={8}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: isDarkMode ? theme.colorBgContainer : '#fff' }}>
            <Statistic
              title="Occupés"
              value={3}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: isDarkMode ? theme.colorBgContainer : '#fff' }}>
            <Statistic
              title="Maintenance"
              value={1}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#eab308' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Floor Map Component */}
      <FloorMap 
        onResourceSelect={setSelectedResource}
        showBookingInfo={true}
      />

      {/* Instructions */}
      <Card 
        style={{ 
          marginTop: 16, 
          background: isDarkMode ? 'rgba(14, 165, 233, 0.1)' : '#e0f2fe',
          border: 'none'
        }}
      >
        <Space direction="vertical" size={8}>
          <Text strong style={{ color: theme.colorPrimary }}>💡 Comment utiliser le plan ?</Text>
          <Text style={{ color: theme.colorTextSecondary }}>
            • Cliquez sur une ressource pour voir ses détails et la réserver
          </Text>
          <Text style={{ color: theme.colorTextSecondary }}>
            • Utilisez les boutons + et - pour zoomer sur le plan
          </Text>
          <Text style={{ color: theme.colorTextSecondary }}>
            • Les couleurs indiquent la disponibilité en temps réel
          </Text>
        </Space>
      </Card>
    </div>
  )
}

export default FloorPlan

