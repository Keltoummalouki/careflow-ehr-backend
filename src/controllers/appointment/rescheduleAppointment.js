import mongoose from 'mongoose'                              
import Appointment from '../../models/Appointment.js'          
import { validateAppointmentCreate } from '../../validators/appointments/appointmentCreate.js'
import { hasConflict } from '../availability/hasConflict.js'


export async function rescheduleAppointment(req, res) {        
  try {
    const { appointmentId } = req.params
    if (!mongoose.isValidObjectId(appointmentId)) return res.status(400).json({ message: 'Invalid appointmentId' })
    const { error, value } = validateAppointmentCreate(req.body) // reuse validator for start/end
    if (error) return res.status(400).json({ message: 'Invalid data', details: error.details.map(d=>d.message) })

    const start = new Date(value.start)
    const end = new Date(value.end)

    const conflict = await hasConflict(value.practitionerId, start, end, appointmentId) // ignore self
    if (conflict) return res.status(409).json({ message: 'Time conflict' })

    const appt = await Appointment.findByIdAndUpdate(appointmentId, { ...value, start, end }, { new: true })
    if (!appt) return res.status(404).json({ message: 'Appointment not found' })
    return res.status(200).json({ appointment: appt })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}