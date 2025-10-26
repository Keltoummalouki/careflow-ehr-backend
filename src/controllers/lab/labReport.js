import LabOrder from '../../models/LabOrder.js'
import { labOrderIdSchema } from '../../validators/labo/labOrderValidators.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'

// Configuration multer pour stockage temporaire
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = './uploads/lab-reports'
    try {
      await fs.mkdir(uploadDir, { recursive: true })
      cb(null, uploadDir)
    } catch (error) {
      cb(error)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `lab-report-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'text/csv']
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only PDF and CSV files are allowed.'))
  }
}

export const upload = multer({ // Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB
  }
})

export async function uploadLabReport(req, res) {
  try {
    // Validation des paramètres
    const { error, value } = labOrderIdSchema.validate(req.params)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { labOrderId } = value

    // Vérifier qu'un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // Récupérer l'ordre de laboratoire
    const labOrder = await LabOrder.findById(labOrderId)
    if (!labOrder) {
      // Supprimer le fichier uploadé
      await fs.unlink(req.file.path)
      return res.status(404).json({ message: 'Lab order not found' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    if (!['admin', 'lab_tech'].includes(userRole)) {
      await fs.unlink(req.file.path)
      return res.status(403).json({ message: 'You are not authorized to upload lab reports' })
    }

    // TODO: Upload vers S3/MinIO
    // Pour l'instant, stocker le chemin local
    const reportUrl = `/uploads/lab-reports/${req.file.filename}`

    // Si un ancien rapport existe, le supprimer
    if (labOrder.reportUrl) {
      try {
        const oldPath = `.${labOrder.reportUrl}`
        await fs.unlink(oldPath)
      } catch (err) {
        console.error('Error deleting old report:', err)
      }
    }

    // Mettre à jour l'ordre avec l'URL du rapport
    labOrder.reportUrl = reportUrl
    await labOrder.save()

    return res.status(200).json({
      message: 'Lab report uploaded successfully',
      reportUrl,
      labOrder: {
        _id: labOrder._id,
        status: labOrder.status,
        reportUrl: labOrder.reportUrl
      }
    })

  } catch (err) {
    // En cas d'erreur, supprimer le fichier uploadé
    if (req.file) {
      try {
        await fs.unlink(req.file.path)
      } catch (unlinkErr) {
        console.error('Error deleting uploaded file:', unlinkErr)
      }
    }
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export async function downloadLabReport(req, res) {
  try {
    // Validation
    const { error, value } = labOrderIdSchema.validate(req.params)
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    const { labOrderId } = value

    // Récupérer l'ordre de laboratoire
    const labOrder = await LabOrder.findById(labOrderId)
      .populate('patientId', 'firstName lastName')

    if (!labOrder) {
      return res.status(404).json({ message: 'Lab order not found' })
    }

    // Vérifier qu'un rapport existe
    if (!labOrder.reportUrl) {
      return res.status(404).json({ message: 'No report available for this lab order' })
    }

    // Vérifier les autorisations
    const userRole = req.user.role
    const userId = req.user.sub

    // Si patient, vérifier qu'il s'agit bien de son ordre
    if (userRole === 'patient' && labOrder.patientId._id.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to download this report' })
    }

    // TODO: Générer une URL présignée S3/MinIO (10 min de validité)
    // Pour l'instant, servir le fichier local
    const filePath = path.join('.', labOrder.reportUrl)

    // Vérifier que le fichier existe
    try {
      await fs.access(filePath)
    } catch (err) {
      return res.status(404).json({ message: 'Report file not found on server' })
    }

    // Déterminer le nom du fichier à télécharger
    const patientName = `${labOrder.patientId.firstName}_${labOrder.patientId.lastName}`
    const filename = `lab_report_${patientName}_${labOrder._id}.pdf`

    // Envoyer le fichier
    return res.download(filePath, filename)

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}