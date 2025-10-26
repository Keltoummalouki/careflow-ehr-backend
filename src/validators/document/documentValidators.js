import Joi from 'joi'

export const uploadDocumentSchema = Joi.object({
  patientId: Joi.string().hex().length(24).required(),
  consultationId: Joi.string().hex().length(24),
  category: Joi.string().valid('imaging', 'report', 'prescription', 'lab_result', 'other').required(),
  tags: Joi.array().items(Joi.string().max(50)).max(10),
  description: Joi.string().max(500)
})

export const documentIdSchema = Joi.object({
  documentId: Joi.string().hex().length(24).required()
})

export const listDocumentsSchema = Joi.object({
  patientId: Joi.string().hex().length(24).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().valid('imaging', 'report', 'prescription', 'lab_result', 'other'),
  tags: Joi.string() // comma-separated tags
})

// Validation des fichiers
export const fileValidation = {
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  maxFileSize: 20 * 1024 * 1024, // 20 MB
  
  validateFile(file) {
    const errors = []
    
    if (!file) {
      errors.push('No file uploaded')
      return { isValid: false, errors }
    }
    
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`)
    }
    
    if (file.size > this.maxFileSize) {
      errors.push(`File too large. Maximum size: ${this.maxFileSize / (1024 * 1024)} MB`)
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}