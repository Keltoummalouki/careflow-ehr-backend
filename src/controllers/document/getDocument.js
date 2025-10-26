import MedicalDocument from '../../models/MedicalDocument.js'
import { documentIdSchema } from '../../validators/document/documentValidators.js'

export async function getDocument(req, res) {
  try {
    // Validation
    const { error, value } = documentIdSchema.validate(req.params)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { documentId } = value

    // Récupérer le document
    const document = await MedicalDocument.findById(documentId)
      .populate('patientId', 'firstName lastName dob gender')
      .populate('uploadedBy', 'firstName lastName')
      .populate('consultationId', 'chiefComplaint createdAt')

    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il s'agit bien de son document
    if (userRole === 'patient' && document.patientId._id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view this document' })
    }

    return res.status(200).json({
      document
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}