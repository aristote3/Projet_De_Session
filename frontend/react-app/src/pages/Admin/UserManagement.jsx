import React, { useEffect } from 'react'
import { Table, Typography, Tag, Avatar, Space } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers } from '../../store/slices/usersSlice'

const { Title } = Typography

const UserManagement = () => {
  const dispatch = useDispatch()
  const { items: users, loading } = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const columns = [
    {
      title: 'Utilisateur',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag>,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Gestion des utilisateurs</Title>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default UserManagement

