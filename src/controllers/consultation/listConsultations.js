import Consultation from '../../models/Consultation.js'
import Joi from 'joi'

const listConsultationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('draft', 'completed', 'cancelled'),
  practitionerId: Joi.string().hex().length(24),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
})

export async function listConsultations(req, res) {
  try {
    // Validation
    const { error, value } = listConsultationsSchema.validate(req.query)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { page, limit, status, practitionerId, startDate, endDate } = value

    // Construire la requête
    const query = {}

    if (status) {
      query.status = status
    }

    // Si praticien demande ses consultations ou admin filtre par praticien
    if (practitionerId) {
      query.practitionerId = practitionerId
    } else if (req.user && (req.user.role === 'doctor' || req.user.role === 'nurse')) {
      // Par défaut, les praticiens voient leurs propres consultations
      query.practitionerId = req.user.sub
    }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les consultations
    const [consultations, total] = await Promise.all([
      Consultation.find(query)
        .populate('patientId', 'firstName lastName dob gender')
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