import MedicalDocument from '../../models/MedicalDocument.js'
import minioService from '../../services/minioService.js'
import { documentIdSchema } from '../../validators/document/documentValidators.js'
import Patient from '../../models/Patient.js' 

export async function downloadDocument(req, res) {
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
      .populate('patientId', 'userId') // on a besoin de lier au User

    if (!document) {
      return res.status(404).json({ message: 'Document not found' })
    }

    // Autorisations (skip si pas d'auth)
    const userRole = req.user?.role
    const userId = req.user?.sub

    if (userRole === 'patient') {
      const selfPatient = await Patient.findOne({ userId })
      if (!selfPatient || selfPatient._id.toString() !== document.patientId._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to download this document' })
      }
    }

    // Générer une URL présignée (valide 10 minutes)
    const presignedUrl = await minioService.getPresignedDownloadUrl(
      document.storageKey,
      600 // 10 minutes
    )

    return res.status(200).json({
      message: 'Download URL generated successfully',
      downloadUrl: presignedUrl,
      expiresIn: 600, // seconds
      document: {
        _id: document._id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        category: document.category
      }
    })

  } catch (err) {
    console.error('Error generating download URL:', err)
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}