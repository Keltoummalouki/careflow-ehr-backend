import Appointment from '../../models/Appointment.js'          
import { validateAppointmentCreate } from '../../validators/appointments/appointmentCreate.js' 
import { hasConflict } from '../../controllers/availability/hasConflict.js'


export async function createAppointment(req, res){
    try {
        const { error, value } = validateAppointmentCreate(req.body)
        if (error) return res.status(400).json({ message: 'Invalid data', details: error.details.map(d=>d.message) })

        const start = new Date(value.start) // parse start
        const end = new Date(value.end) // parse end

        const conflict = await hasConflict(value.practitionerId, start, end) // check overlap
        if (conflict) return res.status(409).json({ message: 'Time conflict' })

        const appointment = await Appointment.create({...value, start, end})
        return res.status(201).json({ appointment: appointment })
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message }) 
    }
}