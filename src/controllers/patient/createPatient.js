import { validatePatientCreate } from "../../validators/patient/patientCreate.js"
import Patient from "../../models/Patient.js"

export async function createPatient(req, res){
    try {
        const { error, value } = validatePatientCreate(req.body) 
        if (error) return res.status(400).json({ message: 'Invalid data', details: error.details.map(d=>d.message) })

        const profile = await Patient.create({...value, createdBy: req.auth.userId})
        return res.status(201).json({ profile })                
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}