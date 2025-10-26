import MedicalDocument from '../../models/MedicalDocument.js'
import minioService from '../../services/minioService.js'
import { documentIdSchema } from '../../validators/document/documentValidators.js'

export async function deleteDocument(req, res) {
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
    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Seuls admin et l'uploader peuvent supprimer
    if (userRole !== 'admin' && document.uploadedBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this document' })
    }

    // Supprimer de MinIO
    try {
      await minioService.deleteFile(document.storageKey)
    } catch (minioErr) {
      console.error('Error deleting file from MinIO:', minioErr)
      // Continuer même si la suppression MinIO échoue
    }

    // Supprimer de MongoDB
    await document.deleteOne()

    return res.status(200).json({
      message: 'Document deleted successfully'
    })

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}