import mongoose from 'mongoose'                              
import Appointment from '../../models/Appointment.js'          

export async function listAppointmentsByPatient(req, res) {   
  try {
    const { patientId } = req.params
    if (!mongoose.isValidObjectId(patientId)) return res.status(400).json({ message: 'Invalid patientId' })
    const items = await Appointment.find({ patientId }).sort({ start: 1 })
    return res.status(200).json({ appointments: items })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}