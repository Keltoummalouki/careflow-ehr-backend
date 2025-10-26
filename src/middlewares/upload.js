import multer from 'multer'
import { fileValidation } from '../validators/document/documentValidators.js'

// Configuration de multer pour stocker en mémoire
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  // Validation du type MIME
  if (!fileValidation.allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(`Invalid file type. Allowed types: ${fileValidation.allowedMimeTypes.join(', ')}`),
      false
    )
  }
  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileValidation.maxFileSize // 20 MB
  }
})