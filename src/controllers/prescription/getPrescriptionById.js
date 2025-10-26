import Prescription from '../../models/Prescription.js'
import { prescriptionIdSchema } from '../../validators/prescription/prescription.js'

export async function getPrescriptionById(req, res) {
  try {
    // Validation
    const { error, value } = prescriptionIdSchema.validate(req.params)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { prescriptionId } = value

    // Récupérer la prescription
    const prescription = await Prescription.findById(prescriptionId)
      .populate('patientId', 'firstName lastName dob gender')
      .populate('practitionerId', 'firstName lastName')
      .populate('pharmacyId', 'name address city phone email')
      .populate('consultationId', 'chiefComplaint diagnosis createdAt')

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il s'agit bien de sa prescription
    if (userRole === 'patient' && prescription.patientId._id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view this prescription' })
    }

    return res.status(200).json({
      prescription
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}