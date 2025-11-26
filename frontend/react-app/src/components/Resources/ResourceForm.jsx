import React from 'react'
import { Form, Input, Select, Button, TimePicker, Space } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { createResource, updateResource } from '../../store/slices/resourcesSlice'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const ResourceForm = ({ resource, onSuccess }) => {
  const dispatch = useDispatch()

  const validationSchema = Yup.object({
    name: Yup.string().required('Le nom est requis'),
    description: Yup.string().required('La description est requise'),
    category: Yup.string().required('La catégorie est requise'),
    image_url: Yup.string().url('URL invalide'),
  })

  const formik = useFormik({
    initialValues: {
      name: resource?.name || '',
      description: resource?.description || '',
      category: resource?.category || '',
      image_url: resource?.image_url || '',
      opening_hours_start: resource?.opening_hours_start ? dayjs(resource.opening_hours_start, 'HH:mm') : null,
      opening_hours_end: resource?.opening_hours_end ? dayjs(resource.opening_hours_end, 'HH:mm') : null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const data = {
        ...values,
        opening_hours_start: values.opening_hours_start ? values.opening_hours_start.format('HH:mm') : null,
        opening_hours_end: values.opening_hours_end ? values.opening_hours_end.format('HH:mm') : null,
      }
      
      if (resource) {
        await dispatch(updateResource({ id: resource.id, data }))
      } else {
        await dispatch(createResource(data))
      }
      onSuccess()
    },
  })

  return (
    <Form layout="vertical" onFinish={formik.handleSubmit}>
      <Form.Item label="Nom" required>
        <Input
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <div style={{ color: 'red' }}>{formik.errors.name}</div>
        )}
      </Form.Item>

      <Form.Item label="Description" required>
        <TextArea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={4}
        />
        {formik.touched.description && formik.errors.description && (
          <div style={{ color: 'red' }}>{formik.errors.description}</div>
        )}
      </Form.Item>

      <Form.Item label="Catégorie" required>
        <Select
          name="category"
          value={formik.values.category}
          onChange={(value) => formik.setFieldValue('category', value)}
          onBlur={formik.handleBlur}
        >
          <Option value="Salle de réunion">Salle de réunion</Option>
          <Option value="Salle de conférence">Salle de conférence</Option>
          <Option value="Équipement">Équipement</Option>
          <Option value="Véhicule">Véhicule</Option>
          <Option value="Salle de sport">Salle de sport</Option>
          <Option value="Laboratoire">Laboratoire</Option>
        </Select>
        {formik.touched.category && formik.errors.category && (
          <div style={{ color: 'red' }}>{formik.errors.category}</div>
        )}
      </Form.Item>

      <Form.Item label="URL de l'image">
        <Input
          name="image_url"
          value={formik.values.image_url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="https://example.com/image.jpg"
        />
        {formik.touched.image_url && formik.errors.image_url && (
          <div style={{ color: 'red' }}>{formik.errors.image_url}</div>
        )}
      </Form.Item>

      <Form.Item label="Heures d'ouverture">
        <Space>
          <TimePicker
            format="HH:mm"
            value={formik.values.opening_hours_start}
            onChange={(time) => formik.setFieldValue('opening_hours_start', time)}
            placeholder="Début"
          />
          <span>-</span>
          <TimePicker
            format="HH:mm"
            value={formik.values.opening_hours_end}
            onChange={(time) => formik.setFieldValue('opening_hours_end', time)}
            placeholder="Fin"
          />
        </Space>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {resource ? 'Modifier' : 'Créer'}
          </Button>
          <Button onClick={onSuccess}>Annuler</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ResourceForm

