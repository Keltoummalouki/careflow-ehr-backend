import mongoose from 'mongoose'
import Patient from '../../models/Patient.js'

export async function getPatientById(req,res){
    try {
        const { patientId } = req.params
        if(!mongoose.isValidObjectId(patientId))
            return res.status(400).json({message : 'Invalid patientId'})

        const patient = await Patient.findById(patientId)
        if(!patient) return res.status(404).json({message: 'Patient not found '})
        return res.status(200).json({patient})
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}