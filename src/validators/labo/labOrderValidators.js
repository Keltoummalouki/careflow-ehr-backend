import Joi from 'joi'

const testSchema = Joi.object({
  code: Joi.string().required().max(50),
  name: Joi.string().required().max(200),
  category: Joi.string().max(100)
})

const resultSchema = Joi.object({
  testCode: Joi.string().required().max(50),
  testName: Joi.string().required().max(200),
  value: Joi.string().required().max(100),
  unit: Joi.string().max(50),
  referenceRange: Joi.string().max(100),
  isAbnormal: Joi.boolean().default(false),
  notes: Joi.string().max(500)
})

export const createLabOrderSchema = Joi.object({
  consultationId: Joi.string().hex().length(24),
  patientId: Joi.string().hex().length(24).required(),
  tests: Joi.array().items(testSchema).min(1).required(),
  status: Joi.string().valid('ordered', 'sample_collected', 'processing', 'completed', 'cancelled').default('ordered')
})

export const updateLabOrderSchema = Joi.object({
  status: Joi.string().valid('ordered', 'sample_collected', 'processing', 'completed', 'cancelled')
}).min(1)

export const uploadLabResultsSchema = Joi.object({
  results: Joi.array().items(resultSchema).min(1).required(),
  validatedBy: Joi.string().hex().length(24)
})

export const labOrderIdSchema = Joi.object({
  labOrderId: Joi.string().hex().length(24).required()
})

export const patientLabOrdersSchema = Joi.object({
  patientId: Joi.string().hex().length(24).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('ordered', 'sample_collected', 'processing', 'completed', 'cancelled')
})