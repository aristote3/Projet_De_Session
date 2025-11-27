import React, { useEffect, useState } from 'react'
import { Card, Typography, Modal, Button, Tag } from 'antd'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBookings } from '../store/slices/bookingsSlice'
import { fetchResources } from '../store/slices/resourcesSlice'
import BookingForm from '../components/Bookings/BookingForm'
import dayjs from 'dayjs'

const { Title } = Typography

const CalendarView = () => {
  const dispatch = useDispatch()
  const { items: bookings, loading } = useSelector((state) => state.bookings)
  const { items: resources } = useSelector((state) => state.resources)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    dispatch(fetchBookings())
    dispatch(fetchResources())
  }, [dispatch])

  // Combiner date + start_time/end_time pour créer des dates ISO complètes pour FullCalendar
  const events = bookings.map(booking => {
    // Format: date = "2024-01-15", start_time = "10:00", end_time = "12:00"
    const startDateTime = booking.date && booking.start_time 
      ? `${booking.date}T${booking.start_time}:00` 
      : booking.start_time
    const endDateTime = booking.date && booking.end_time 
      ? `${booking.date}T${booking.end_time}:00` 
      : booking.end_time

    return {
      id: booking.id,
      title: `${booking.resource?.name || 'Ressource'} - ${booking.user?.name || 'Utilisateur'}`,
      start: startDateTime,
      end: endDateTime,
      backgroundColor: booking.status === 'approved' ? '#52c41a' : 
                       booking.status === 'pending' ? '#faad14' : '#ff4d4f',
      borderColor: booking.status === 'approved' ? '#52c41a' : 
                   booking.status === 'pending' ? '#faad14' : '#ff4d4f',
      extendedProps: booking,
    }
  })

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr)
    setIsModalVisible(true)
  }

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event.extendedProps)
    setIsModalVisible(true)
  }

  return (
    <div>
      <Title level={2}>Calendrier des réservations</Title>
      <Card>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          locale="fr"
          height="auto"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
        />
      </Card>
      <Modal
        title={selectedEvent ? "Détails de la réservation" : "Nouvelle réservation"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setSelectedEvent(null)
          setSelectedDate(null)
        }}
        footer={null}
        width={600}
      >
        {selectedEvent ? (
          <div>
            <p><strong>Ressource:</strong> {selectedEvent.resource?.name}</p>
            <p><strong>Utilisateur:</strong> {selectedEvent.user?.name}</p>
            <p><strong>Début:</strong> {dayjs(selectedEvent.start_time).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Fin:</strong> {dayjs(selectedEvent.end_time).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Statut:</strong> <Tag color={selectedEvent.status === 'approved' ? 'green' : selectedEvent.status === 'pending' ? 'orange' : 'red'}>{selectedEvent.status}</Tag></p>
          </div>
        ) : (
          <BookingForm
            initialDate={selectedDate}
            resources={resources}
            onSuccess={() => {
              setIsModalVisible(false)
              dispatch(fetchBookings())
            }}
          />
        )}
      </Modal>
    </div>
  )
}

export default CalendarView

