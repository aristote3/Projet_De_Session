import React, { useEffect, useState } from 'react'
import { Form, Select, DatePicker, Button, Space, Switch, Input, Alert, message } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createBooking, updateBooking } from '../../store/slices/bookingsSlice'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

const BookingForm = ({ resources, initialDate, onSuccess, booking, initialResourceId }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: existingBookings } = useSelector((state) => state.bookings)
  const [validationErrors, setValidationErrors] = useState([])

  const validationSchema = Yup.object({
    resource_id: Yup.number().required('La ressource est requise'),
    start_time: Yup.string().required('La date de début est requise'),
    end_time: Yup.string().required('La date de fin est requise'),
  })

  const validateBooking = (values) => {
    const errors = []
    const now = dayjs()
    const startTime = dayjs(values.start_time)
    const endTime = dayjs(values.end_time)

    // Validation de base
    if (startTime.isBefore(now)) {
      errors.push('La date de début doit être dans le futur')
    }

    if (endTime.isBefore(startTime)) {
      errors.push('La date de fin doit être après la date de début')
    }

    // Vérifier les conflits (sauf pour la réservation en cours de modification)
    if (values.resource_id && values.start_time && values.end_time) {
      const conflicts = existingBookings.filter(b => {
        if (booking && b.id === booking.id) return false // Exclure la réservation en cours de modification
        if (b.resource_id !== values.resource_id && b.resource?.id !== values.resource_id) return false
        if (b.status === 'cancelled' || b.status === 'rejected') return false

        const bStart = dayjs(b.start_time)
        const bEnd = dayjs(b.end_time)

        return (
          (startTime.isAfter(bStart) && startTime.isBefore(bEnd)) ||
          (endTime.isAfter(bStart) && endTime.isBefore(bEnd)) ||
          (startTime.isBefore(bStart) && endTime.isAfter(bEnd))
        )
      })

      if (conflicts.length > 0) {
        errors.push('Cette ressource est déjà réservée pour cette période')
      }
    }

    // TODO: Vérifier les quotas (ex: max 5 réservations/jour)
    const todayBookings = existingBookings.filter(b => {
      if (booking && b.id === booking.id) return false
      return dayjs(b.start_time).isSame(dayjs(values.start_time), 'day') &&
             (b.user_id === user?.id || b.user?.id === user?.id) &&
             b.status !== 'cancelled'
    })
    if (todayBookings.length >= 5) {
      errors.push('Vous avez atteint la limite de 5 réservations par jour')
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const getInitialValues = () => {
    if (booking) {
      return {
        resource_id: booking.resource_id || booking.resource?.id,
        start_time: dayjs(booking.start_time).format('YYYY-MM-DD HH:mm'),
        end_time: dayjs(booking.end_time).format('YYYY-MM-DD HH:mm'),
        is_recurring: booking.is_recurring || false,
        recurring_frequency: booking.recurring_frequency || 'weekly',
        recurring_until: booking.recurring_until ? dayjs(booking.recurring_until).format('YYYY-MM-DD') : null,
        notes: booking.notes || '',
      }
    }
    return {
      resource_id: initialResourceId ? parseInt(initialResourceId) : null,
      start_time: initialDate ? dayjs(initialDate).format('YYYY-MM-DD HH:mm') : '',
      end_time: '',
      is_recurring: false,
      recurring_frequency: 'weekly',
      recurring_until: null,
      notes: '',
    }
  }

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: async (values) => {
      if (!validateBooking(values)) {
        return
      }

      try {
        if (booking) {
          await dispatch(updateBooking({ id: booking.id, data: values }))
        } else {
          await dispatch(createBooking(values))
        }
        onSuccess()
      } catch (error) {
        message.error('Erreur lors de la création de la réservation')
      }
    },
  })

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      formik.setFieldValue('start_time', dates[0].format('YYYY-MM-DD HH:mm'))
      formik.setFieldValue('end_time', dates[1].format('YYYY-MM-DD HH:mm'))
    }
  }

  return (
    <Form layout="vertical" onFinish={formik.handleSubmit}>
      {validationErrors.length > 0 && (
        <Alert
          message="Erreurs de validation"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form.Item label="Ressource" required>
        <Select
          name="resource_id"
          value={formik.values.resource_id}
          onChange={(value) => {
            formik.setFieldValue('resource_id', value)
            setValidationErrors([])
          }}
          placeholder="Sélectionner une ressource"
          disabled={!!booking && booking.status === 'approved'}
        >
          {resources
            .filter(r => r.status === 'available' || booking?.resource_id === r.id)
            .map((resource) => (
              <Option key={resource.id} value={resource.id}>
                {resource.name} {resource.status !== 'available' && '(Indisponible)'}
              </Option>
            ))}
        </Select>
        {formik.touched.resource_id && formik.errors.resource_id && (
          <div style={{ color: 'red' }}>{formik.errors.resource_id}</div>
        )}
      </Form.Item>

      <Form.Item label="Date et heure" required>
        <RangePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          value={
            formik.values.start_time && formik.values.end_time
              ? [dayjs(formik.values.start_time), dayjs(formik.values.end_time)]
              : null
          }
          onChange={handleDateRangeChange}
          style={{ width: '100%' }}
          disabledDate={(current) => current && current < dayjs().startOf('day')}
        />
        {formik.touched.start_time && formik.errors.start_time && (
          <div style={{ color: 'red' }}>{formik.errors.start_time}</div>
        )}
      </Form.Item>

      <Form.Item label="Notes (optionnel)">
        <TextArea
          rows={4}
          value={formik.values.notes}
          onChange={(e) => formik.setFieldValue('notes', e.target.value)}
          placeholder="Ajoutez des notes ou détails pour cette réservation..."
        />
      </Form.Item>

      <Form.Item label="Réservation récurrente">
        <Switch
          checked={formik.values.is_recurring}
          onChange={(checked) => formik.setFieldValue('is_recurring', checked)}
        />
      </Form.Item>

      {formik.values.is_recurring && (
        <>
          <Form.Item label="Fréquence">
            <Select
              value={formik.values.recurring_frequency}
              onChange={(value) => formik.setFieldValue('recurring_frequency', value)}
            >
              <Option value="daily">Quotidienne</Option>
              <Option value="weekly">Hebdomadaire</Option>
              <Option value="monthly">Mensuelle</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Jusqu'à">
            <DatePicker
              value={formik.values.recurring_until ? dayjs(formik.values.recurring_until) : null}
              onChange={(date) => formik.setFieldValue('recurring_until', date ? date.format('YYYY-MM-DD') : null)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Réserver
          </Button>
          <Button onClick={onSuccess}>Annuler</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default BookingForm

