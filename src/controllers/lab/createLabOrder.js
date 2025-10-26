import LabOrder from '../../models/LabOrder.js'
import Consultation from '../../models/Consultation.js'
import Patient from '../../models/Patient.js'
import { createLabOrderSchema } from '../../validators/labOrderValidators.js'

export async function createLabOrder(req, res) {
  try {
    // Validation des données
    const { error, value } = createLabOrderSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { consultationId, patientId, tests, status } = value

    // Vérifier que le patient existe
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Si une consultation est fournie, vérifier qu'elle existe
    if (consultationId) {
      const consultation = await Consultation.findById(consultationId)
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' })
      }

      // Vérifier que la consultation appartient au patient
      if (consultation.patientId.toString() !== patientId) {
        return res.status(400).json({ message: 'Consultation does not belong to this patient' })
      }
    }

    // Créer l'ordre de laboratoire
    const practitionerId = req.user.sub
    const labOrder = await LabOrder.create({
      consultationId,
      patientId,
      practitionerId,
      tests,
      status,
      orderedAt: new Date()
    })

    // Populer les références
    await labOrder.populate([
      { path: 'patientId', select: 'firstName lastName dob gender' },
      { path: 'practitionerId', select: 'firstName lastName' },
      { path: 'consultationId', select: 'chiefComplaint createdAt' }
    ])

    return res.status(201).json({
      message: 'Lab order created successfully',
      labOrder
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}