import Consultation from '../../models/Consultation.js'
import { consultationIdSchema, updateConsultationSchema } from '../../validators/consultation/consultationValidators.js'

export async function updateConsultation(req, res) {
  try {
    // Validation des paramètres
    const { error: paramsError, value: paramsValue } = consultationIdSchema.validate(req.params)
    if (paramsError) {
      return res.status(400).json({
        message: 'Validation error',
        details: paramsError.details.map(d => d.message)
      })
    }

    // Validation du body
    const { error: bodyError, value: bodyValue } = updateConsultationSchema.validate(req.body)
    if (bodyError) {
      return res.status(400).json({
        message: 'Validation error',
        details: bodyError.details.map(d => d.message)
      })
    }

    const { consultationId } = paramsValue
    const updates = bodyValue

    // Récupérer la consultation
    const consultation = await Consultation.findById(consultationId)
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    // Vérifier les autorisations (seul le praticien qui a créé peut modifier)
    const practitionerId = req.user.sub
    if (consultation.practitionerId.toString() !== practitionerId) {
      return res.status(403).json({ message: 'You are not authorized to update this consultation' })
    }

    // Ne pas permettre la modification si la consultation est complétée
    if (consultation.status === 'completed' && updates.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot modify a completed consultation' })
    }

    // Mettre à jour
    Object.assign(consultation, updates)
    await consultation.save()

    // Populer les références
    await consultation.populate([
      { path: 'patientId', select: 'firstName lastName dob gender' },
      { path: 'practitionerId', select: 'firstName lastName' }
    ])

    return res.status(200).json({
      message: 'Consultation updated successfully',
      consultation
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}