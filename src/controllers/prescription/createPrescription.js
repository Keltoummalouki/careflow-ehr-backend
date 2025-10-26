import Prescription from '../../models/Prescription.js'
import Consultation from '../../models/Consultation.js'
import Patient from '../../models/Patient.js'
import Pharmacy from '../../models/Pharmacy.js'
import { createPrescriptionSchema } from '../../validators/prescription/prescription.js'

export async function createPrescription(req, res) {
  try {
    // Validation des données
    const { error, value } = createPrescriptionSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { 
      consultationId, 
      patientId, 
      pharmacyId, 
      medication, 
      dosage, 
      route, 
      frequency, 
      duration, 
      renewals, 
      status 
    } = value

    // Vérifier que la consultation existe
    const consultation = await Consultation.findById(consultationId)
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    // Vérifier que le patient existe
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Vérifier que la consultation appartient au patient
    if (consultation.patientId.toString() !== patientId) {
      return res.status(400).json({ message: 'Consultation does not belong to this patient' })
    }

    // Si une pharmacie est spécifiée, vérifier qu'elle existe et est active
    if (pharmacyId) {
      const pharmacy = await Pharmacy.findById(pharmacyId)
      if (!pharmacy) {
        return res.status(404).json({ message: 'Pharmacy not found' })
      }
      if (!pharmacy.isActive) {
        return res.status(400).json({ message: 'This pharmacy is not active' })
      }
    }

    // Vérifier que le praticien est autorisé
    const practitionerId = req.user.sub
    if (consultation.practitionerId.toString() !== practitionerId) {
      return res.status(403).json({ message: 'You are not authorized to create a prescription for this consultation' })
    }

    // Créer la prescription
    const prescription = await Prescription.create({
      consultationId,
      patientId,
      practitionerId,
      pharmacyId,
      medication,
      dosage,
      route,
      frequency,
      duration,
      renewals,
      status
    })

    // Populer les références
    await prescription.populate([
      { path: 'patientId', select: 'firstName lastName dob gender' },
      { path: 'practitionerId', select: 'firstName lastName' },
      { path: 'pharmacyId', select: 'name address phone' },
      { path: 'consultationId', select: 'chiefComplaint createdAt' }
    ])

    return res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}