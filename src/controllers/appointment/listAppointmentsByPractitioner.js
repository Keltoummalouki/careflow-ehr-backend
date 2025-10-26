import mongoose from 'mongoose'                              
import Appointment from '../../models/Appointment.js'          

export async function listAppointmentsByPractitioner(req, res) { 
  try {
    const { practitionerId } = req.params
    if (!mongoose.isValidObjectId(practitionerId)) return res.status(400).json({ message: 'Invalid practitionerId' })
    const items = await Appointment.find({ practitionerId }).sort({ start: 1 })
    return res.status(200).json({ appointments: items })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}