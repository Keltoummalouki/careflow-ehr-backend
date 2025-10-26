import LabOrder from '../../models/LabOrder.js'
import Patient from '../../models/Patient.js'
import { patientLabOrdersSchema } from '../../validators/labo/labOrderValidators.js'

export async function listLabOrdersByPatient(req, res) {
  try {
    // Validation
    const { error, value } = patientLabOrdersSchema.validate({
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

    // Si patient, vérifier qu'il demande ses propres ordres
    if (userRole === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view these lab orders' })
    }

    // Construire la requête
    const query = { patientId }
    if (status) {
      query.status = status
    }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les ordres
    const [labOrders, total] = await Promise.all([
      LabOrder.find(query)
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