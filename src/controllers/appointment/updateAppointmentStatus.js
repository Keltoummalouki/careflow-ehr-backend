import mongoose from 'mongoose'                              
import Appointment from '../../models/Appointment.js'          
import { validateAppointmentStatus } from '../../validators/appointments/appointmentStatus.js'


export async function updateAppointmentStatus(req, res) { 
  try {
    const { appointmentId } = req.params
    if (!mongoose.isValidObjectId(appointmentId)) return res.status(400).json({ message: 'Invalid appointmentId' })
    const { error, value } = validateAppointmentStatus(req.body)
    if (error) return res.status(400).json({ message: 'Invalid data', details: error.details.map(d=>d.message) })

    const appt = await Appointment.findByIdAndUpdate(appointmentId, { status: value.status }, { new: true })
    if (!appt) return res.status(404).json({ message: 'Appointment not found' })
    return res.status(200).json({ appointment: appt })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}