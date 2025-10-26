import MedicalDocument from '../../models/MedicalDocument.js'
import Patient from '../../models/Patient.js'
import Consultation from '../../models/Consultation.js'
import minioService from '../../services/minioService.js'
import { uploadDocumentSchema, fileValidation } from '../../validators/document/documentValidators.js'

export async function uploadDocument(req, res) {
  try {
    // Vérifier qu'un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // Validation du fichier
    const fileValidationResult = fileValidation.validateFile(req.file)
    if (!fileValidationResult.isValid) {
      return res.status(400).json({
        message: 'File validation failed',
        errors: fileValidationResult.errors
      })
    }

    // Validation des données du body
    const { error, value } = uploadDocumentSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { patientId, consultationId, category, tags, description } = value

    // Vérifier que le patient existe
    const patient = await Patient.findById(patientId)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Si une consultation est fournie, vérifier qu'elle existe
    if (consultationId) {
      const consultation = await Consultation.findById(consultationId)
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' })
      }

      // Vérifier que la consultation appartient au patient
      if (consultation.patientId.toString() !== patientId) {
        return res.status(400).json({ message: 'Consultation does not belong to this patient' })
      }
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il upload pour lui-même
    if (userRole === 'patient' && patientId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to upload documents for this patient' })
    }

    // Préparer les métadonnées pour MinIO
    const metadata = {
      'X-Patient-Id': patientId,
      'X-Uploader-Id': userId,
      'X-Category': category,
      'X-Tags': tags ? tags.join(',') : ''
    }

    // Upload vers MinIO
    const uploadResult = await minioService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      metadata
    )

    // Créer l'enregistrement dans MongoDB
    const document = await MedicalDocument.create({
      patientId,
      uploadedBy: userId,
      consultationId,
      category,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      storageKey: uploadResult.objectName,
      tags,
      description
    })

    // Populer les références
    await document.populate([
      { path: 'patientId', select: 'firstName lastName' },
      { path: 'uploadedBy', select: 'firstName lastName' },
      { path: 'consultationId', select: 'chiefComplaint createdAt' }
    ])

    return res.status(201).json({
      message: 'Document uploaded successfully',
      document
    })

  } catch (err) {
    console.error('Error uploading document:', err)
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}