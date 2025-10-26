import Joi from 'joi'

const hoursSchema = Joi.object({
  monday: Joi.string().max(50),
  tuesday: Joi.string().max(50),
  wednesday: Joi.string().max(50),
  thursday: Joi.string().max(50),
  friday: Joi.string().max(50),
  saturday: Joi.string().max(50),
  sunday: Joi.string().max(50)
})

export const createPharmacySchema = Joi.object({
  name: Joi.string().required().max(200),
  address: Joi.string().required().max(300),
  city: Joi.string().required().max(100),
  phone: Joi.string().required().pattern(/^[0-9\s\-\+\(\)]+$/).max(20),
  email: Joi.string().email().lowercase(),
  hours: hoursSchema,
  isActive: Joi.boolean().default(true)
})

export const updatePharmacySchema = Joi.object({
  name: Joi.string().max(200),
  address: Joi.string().max(300),
  city: Joi.string().max(100),
  phone: Joi.string().pattern(/^[0-9\s\-\+\(\)]+$/).max(20),
  email: Joi.string().email().lowercase(),
  hours: hoursSchema,
  isActive: Joi.boolean()
}).min(1)

export const pharmacyIdSchema = Joi.object({
  pharmacyId: Joi.string().hex().length(24).required()
})

export const listPharmaciesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  city: Joi.string().max(100),
  isActive: Joi.boolean()
})