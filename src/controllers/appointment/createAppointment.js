import Appointment from '../../models/Appointment.js'
import Patient from '../../models/Patient.js'
import { validateAppointmentCreate } from '../../validators/appointments/appointmentCreate.js'
import { hasConflict } from '../availability/hasConflict.js'

export async function createAppointment(req, res){
    try {
        const { error, value } = validateAppointmentCreate(req.body)
        if (error) return res.status(400).json({ message: 'Invalid data', details: error.details.map(d=>d.message) })

        // Vérifier que le patient existe et récupérer son _id
        const patient = await Patient.findOne({ userId: value.patientId })
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found' })
        }

        const start = new Date(value.start)
        const end = new Date(value.end)

        const conflict = await hasConflict(value.practitionerId, start, end)
        if (conflict) return res.status(409).json({ message: 'Time conflict' })

        // Utiliser patient._id au lieu de value.patientId
        const appointment = await Appointment.create({
            patientId: patient._id, // Utiliser l'ID du document Patient
            practitionerId: value.practitionerId,
            start,
            end,
            reason: value.reason,
            notes: value.notes
        })
        
        return res.status(201).json({ appointment })
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}