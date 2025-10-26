import Joi from 'joi'

const vitalSignsSchema = Joi.object({
  bloodPressure: Joi.object({
    systolic: Joi.number().min(50).max(250),
    diastolic: Joi.number().min(30).max(150)
  }),
  heartRate: Joi.number().min(30).max(250),
  temperature: Joi.number().min(35).max(42),
  weight: Joi.number().min(0.5).max(500),
  height: Joi.number().min(30).max(250),
  respiratoryRate: Joi.number().min(5).max(60),
  oxygenSaturation: Joi.number().min(0).max(100)
})

const diagnosisSchema = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().required()
})

const procedureSchema = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().required()
})

export const createConsultationSchema = Joi.object({
  appointmentId: Joi.string().hex().length(24).required(),
  patientId: Joi.string().hex().length(24).required(),
  vitalSigns: vitalSignsSchema,
  chiefComplaint: Joi.string().max(500),
  diagnosis: Joi.array().items(diagnosisSchema),
  procedures: Joi.array().items(procedureSchema),
  notes: Joi.string().max(2000),
  status: Joi.string().valid('draft', 'completed', 'cancelled').default('draft')
})

export const updateConsultationSchema = Joi.object({
  vitalSigns: vitalSignsSchema,
  chiefComplaint: Joi.string().max(500),
  diagnosis: Joi.array().items(diagnosisSchema),
  procedures: Joi.array().items(procedureSchema),
  notes: Joi.string().max(2000),
  status: Joi.string().valid('draft', 'completed', 'cancelled')
}).min(1)

export const consultationIdSchema = Joi.object({
  consultationId: Joi.string().hex().length(24).required()
})

export const patientConsultationsSchema = Joi.object({
  patientId: Joi.string().hex().length(24).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('draft', 'completed', 'cancelled')
})