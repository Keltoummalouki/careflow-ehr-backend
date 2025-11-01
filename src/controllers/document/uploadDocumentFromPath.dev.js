import fs from 'fs/promises'
import path from 'path'
import Joi from 'joi'
import MedicalDocument from '../../models/MedicalDocument.js'
import Patient from '../../models/Patient.js'
import Consultation from '../../models/Consultation.js'
import minioService from '../../services/minioService.js'

const schema = Joi.object({
  // accepte un Patient._id ou un User._id (24 hex)
  patientId: Joi.string().hex().length(24).required(),
  consultationId: Joi.string().hex().length(24).optional(),
  category: Joi.string().valid('imaging','report','prescription','lab_result','other').required(),
  description: Joi.string().max(500).allow('', null),
  // chemin relatif sous le dossier autorisé
  filePath: Joi.string().required(),
  // facultatif: array de tags
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)).max(10),
    Joi.string().max(200) // ex: "cbc,fasting"
  ).optional()
})

// Dossier autorisé (crée-le manuellement)
const ALLOWED_ROOT = path.resolve(process.cwd(), 'documents', 'upload')

export async function uploadDocumentFromPathDev(req, res) {
  try {
    const { error, value } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { patientId, consultationId, category, description, filePath, tags } = value

    // Résoudre chemin et sécuriser (éviter sortie du dossier)
    const abs = path.resolve(ALLOWED_ROOT, filePath)
    if (!abs.startsWith(ALLOWED_ROOT)) {
      return res.status(400).json({ message: 'Invalid path (out of allowed root)' })
    }

    // Lire le fichier
    let buffer
    try {
      buffer = await fs.readFile(abs)
    } catch (e) {
      return res.status(404).json({ message: 'Local file not found', details: abs })
    }
    const originalName = path.basename(abs)
    const mimeType = 'application/octet-stream' // simple et suffisant pour le test

    // Résoudre patient: accepte Patient._id ou User._id
    let patient = await Patient.findById(patientId)
    if (!patient) patient = await Patient.findOne({ userId: patientId })
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    // Si consultation fournie, vérifier qu’elle existe et appartient au patient
    if (consultationId) {
      const consultation = await Consultation.findById(consultationId)
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' })
      }
      const ap = consultation.patientId?.toString()
      const pDoc = patient._id.toString()
      if (ap !== pDoc) {
        return res.status(400).json({ message: 'Consultation does not belong to this patient' })
      }
    }

    // Uploader (uploader = user connecté si dispo, sinon le userId du patient)
    const uploaderUserId = req.user?.sub || patient.userId?.toString()
    if (!uploaderUserId) {
      return res.status(400).json({ message: 'No uploader userId found (auth disabled and patient has no userId)' })
    }

    const tagArray = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined)

    const metadata = {
      'X-Patient-Id': patient._id.toString(),
      'X-Uploader-Id': uploaderUserId,
      'X-Category': category,
      'X-Tags': tagArray ? tagArray.join(',') : ''
    }

    const uploaded = await minioService.uploadFile(buffer, originalName, mimeType, metadata)

    const document = await MedicalDocument.create({
      patientId: patient._id,
      uploadedBy: uploaderUserId,
      consultationId,
      category,
      fileName: originalName,
      fileSize: buffer.length,
      mimeType,
      storageKey: uploaded.objectName,
      tags: tagArray,
      description
    })

    await document.populate([
      { path: 'patientId', select: 'userId' },
      { path: 'uploadedBy', select: 'firstName lastName email' },
      { path: 'consultationId', select: 'chiefComplaint createdAt' }
    ])

    return res.status(201).json({
      message: 'Document uploaded (dev path) successfully',
      document
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}