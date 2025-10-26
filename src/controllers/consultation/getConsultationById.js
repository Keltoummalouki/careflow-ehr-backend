import Consultation from '../../models/Consultation.js'
import { consultationIdSchema } from '../../validators/consultationValidators.js'

export async function getConsultationById(req, res) {
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
      .populate('patientId', 'firstName lastName dob gender')
      .populate('practitionerId', 'firstName lastName')
      .populate('appointmentId', 'start end status')

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il s'agit bien de sa consultation
    if (userRole === 'patient' && consultation.patientId._id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view this consultation' })
    }

    return res.status(200).json({
      consultation
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}