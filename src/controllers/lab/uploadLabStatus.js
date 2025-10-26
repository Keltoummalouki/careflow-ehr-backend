import LabOrder from '../../models/LabOrder.js'
import { labOrderIdSchema, updateLabOrderSchema } from '../../validators/labOrderValidators.js'

export async function updateLabOrderStatus(req, res) {
  try {
    // Validation des paramètres
    const { error: paramsError, value: paramsValue } = labOrderIdSchema.validate(req.params)
    if (paramsError) {
      return res.status(400).json({
        message: 'Validation error',
        details: paramsError.details.map(d => d.message)
      })
    }

    // Validation du body
    const { error: bodyError, value: bodyValue } = updateLabOrderSchema.validate(req.body)
    if (bodyError) {
      return res.status(400).json({
        message: 'Validation error',
        details: bodyError.details.map(d => d.message)
      })
    }

    const { labOrderId } = paramsValue
    const { status } = bodyValue

    // Récupérer l'ordre de laboratoire
    const labOrder = await LabOrder.findById(labOrderId)
    if (!labOrder) {
      return res.status(404).json({ message: 'Lab order not found' })
    }

    // Vérifier les autorisations (seul lab_tech et admin peuvent modifier le statut)
    const userRole = req.user.role
    if (!['admin', 'lab_tech'].includes(userRole)) {
      return res.status(403).json({ message: 'You are not authorized to update this lab order' })
    }

    // Valider la transition de statut
    const validTransitions = {
      ordered: ['sample_collected', 'cancelled'],
      sample_collected: ['processing', 'cancelled'],
      processing: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    }

    if (!validTransitions[labOrder.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${labOrder.status} to ${status}` 
      })
    }

    // Mettre à jour le statut
    labOrder.status = status
    
    // Si complété, enregistrer la date
    if (status === 'completed') {
      labOrder.completedAt = new Date()
    }

    await labOrder.save()

    // Populer les références
    await labOrder.populate([
      { path: 'patientId', select: 'firstName lastName dob gender' },
      { path: 'practitionerId', select: 'firstName lastName' }
    ])

    return res.status(200).json({
      message: 'Lab order status updated successfully',
      labOrder
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}