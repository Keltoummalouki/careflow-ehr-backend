import mongoose from 'mongoose'
import Patient from '../../models/Patient.js'
import { validatePatientUpdate } from '../../validators/patient/patientUpdate.js'

export async function updatePatient(req,res){
    try {
        const { patientId } = req.params
        if(!mongoose.isValidObjectId(patientId))
            return res.status(400).json({message : 'Invalid patientId'})

        const { error , value } = validatePatientUpdate(req.body)
        if (error) return res.status(400).json({ message: 'Invalid data', details: error.details.map(d=>d.message) })

        const updated = await Patient.findByIdAndUpdate(patientId, value, {new: true}) // new doc
        if(!updated) return res.status(404).json({message: 'Patient not found '})
        return res.status(200).json({patient: updated})
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}