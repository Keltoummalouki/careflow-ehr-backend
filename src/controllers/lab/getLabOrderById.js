import LabOrder from '../../models/LabOrder.js'
import { labOrderIdSchema } from '../../validators/labOrderValidators.js'

export async function getLabOrderById(req, res) {
  try {
    // Validation
    const { error, value } = labOrderIdSchema.validate(req.params)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { labOrderId } = value

    // Récupérer l'ordre de laboratoire
    const labOrder = await LabOrder.findById(labOrderId)
      .populate('patientId', 'firstName lastName dob gender')
      .populate('practitionerId', 'firstName lastName')
      .populate('consultationId', 'chiefComplaint diagnosis createdAt')
      .populate('validatedBy', 'firstName lastName')

    if (!labOrder) {
      return res.status(404).json({ message: 'Lab order not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il s'agit bien de son ordre
    if (userRole === 'patient' && labOrder.patientId._id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view this lab order' })
    }

    return res.status(200).json({
      labOrder
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}