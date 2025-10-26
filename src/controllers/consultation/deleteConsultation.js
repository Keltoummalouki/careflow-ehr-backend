import Consultation from '../../models/Consultation.js'
import { consultationIdSchema } from '../../validators/consultation/consultationValidators.js'

export async function deleteConsultation(req, res) {
  try {
    // Validation
    const { error, value } = consultationIdSchema.validate(req.params)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { consultationId } = value

    // Récupérer la consultation
    const consultation = await Consultation.findById(consultationId)
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    // Vérifier les autorisations (seuls admin et le praticien peuvent supprimer)
    const userRole = req.user.role
    const userId = req.user.sub

    if (userRole !== 'admin' && consultation.practitionerId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this consultation' })
    }

    // Ne pas permettre la suppression si complétée (seulement annulation)
    if (consultation.status === 'completed') {
      return res.status(400).json({ message: 'Cannot delete a completed consultation. Use status update to cancel.' })
    }

    // Supprimer
    await consultation.deleteOne()

    return res.status(200).json({
      message: 'Consultation deleted successfully'
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}