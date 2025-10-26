import Consultation from '../../models/Consultation.js'
import Patient from '../../models/Patient.js'
import { patientConsultationsSchema } from '../../validators/consultationValidators.js'

export async function listConsultationsByPatient(req, res) {
  try {
    // Validation
    const { error, value } = patientConsultationsSchema.validate({
      ...req.params,
      ...req.query
    })
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { patientId, page, limit, status } = value

    // Vérifier que le patient existe
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il demande ses propres consultations
    if (userRole === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view these consultations' })
    }

    // Construire la requête
    const query = { patientId }
    if (status) {
      query.status = status
    }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les consultations
    const [consultations, total] = await Promise.all([
      Consultation.find(query)
        .populate('practitionerId', 'firstName lastName')
        .populate('appointmentId', 'start end')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Consultation.countDocuments(query)
    ])

    return res.status(200).json({
      consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}