import LabOrder from '../../models/LabOrder.js'
import Joi from 'joi'

const listLabOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('ordered', 'sample_collected', 'processing', 'completed', 'cancelled'),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
})

export async function listLabOrders(req, res) {
  try {
    // Validation
    const { error, value } = listLabOrdersSchema.validate(req.query)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { page, limit, status, startDate, endDate } = value

    // Construire la requête
    const query = {}

    if (status) {
      query.status = status
    }

    if (startDate || endDate) {
      query.orderedAt = {}
      if (startDate) query.orderedAt.$gte = new Date(startDate)
      if (endDate) query.orderedAt.$lte = new Date(endDate)
    }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les ordres
    const [labOrders, total] = await Promise.all([
      LabOrder.find(query)
        .populate('patientId', 'firstName lastName dob gender')
        .populate('practitionerId', 'firstName lastName')
        .populate('consultationId', 'chiefComplaint')
        .populate('validatedBy', 'firstName lastName')
        .sort({ orderedAt: -1 })
        .skip(skip)
        .limit(limit),
      LabOrder.countDocuments(query)
    ])

    return res.status(200).json({
      labOrders,
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