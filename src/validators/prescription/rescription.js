import Joi from 'joi'

export const createPrescriptionSchema = Joi.object({
  consultationId: Joi.string().hex().length(24).required(),
  patientId: Joi.string().hex().length(24).required(),
  pharmacyId: Joi.string().hex().length(24),
  medication: Joi.string().required().max(200),
  dosage: Joi.string().required().max(100),
  route: Joi.string().valid('oral', 'IV', 'IM', 'topical', 'subcutaneous', 'inhalation', 'other').required(),
  frequency: Joi.string().required().max(100),
  duration: Joi.string().max(100),
  renewals: Joi.number().integer().min(0).max(12).default(0),
  status: Joi.string().valid('draft', 'signed', 'sent', 'dispensed', 'cancelled').default('draft')
})

export const updatePrescriptionSchema = Joi.object({
  pharmacyId: Joi.string().hex().length(24),
  medication: Joi.string().max(200),
  dosage: Joi.string().max(100),
  route: Joi.string().valid('oral', 'IV', 'IM', 'topical', 'subcutaneous', 'inhalation', 'other'),
  frequency: Joi.string().max(100),
  duration: Joi.string().max(100),
  renewals: Joi.number().integer().min(0).max(12),
  status: Joi.string().valid('draft', 'signed', 'sent', 'dispensed', 'cancelled')
}).min(1)

export const dispensePrescriptionSchema = Joi.object({
  dispensedBy: Joi.string().required().max(100)
})

export const prescriptionIdSchema = Joi.object({
  prescriptionId: Joi.string().hex().length(24).required()
})

export const patientPrescriptionsSchema = Joi.object({
  patientId: Joi.string().hex().length(24).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('draft', 'signed', 'sent', 'dispensed', 'cancelled')
})

export const pharmacyPrescriptionsSchema = Joi.object({
  pharmacyId: Joi.string().hex().length(24).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('sent', 'dispensed').default('sent')
})