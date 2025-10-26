import MedicalDocument from '../../models/MedicalDocument.js'
import Patient from '../../models/Patient.js'
import { listDocumentsSchema } from '../../validators/document/documentValidators.js'

export async function listDocuments(req, res) {
  try {
    // Validation
    const { error, value } = listDocumentsSchema.validate({
      ...req.params,
      ...req.query
    })
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { patientId, page, limit, category, tags } = value

    // Vérifier que le patient existe
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il demande ses propres documents
    if (userRole === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view these documents' })
    }

    // Construire la requête
    const query = { patientId }
    
    if (category) {
      query.category = category
    }

    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim())
      query.tags = { $in: tagsArray }
    }

    // Pagination
    const skip = (page - 1) * limit

    // Récupérer les documents
    const [documents, total] = await Promise.all([
      MedicalDocument.find(query)
        .populate('uploadedBy', 'firstName lastName')
        .populate('consultationId', 'chiefComplaint createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      MedicalDocument.countDocuments(query)
    ])

    return res.status(200).json({
      documents,
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