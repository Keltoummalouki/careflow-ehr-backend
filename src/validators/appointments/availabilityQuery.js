import Joi from 'joi'

export const availabilityQuerySchema = Joi.object({           // query params
  practitionerId: Joi.string().length(24).required(),         // doctor id
  date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(), // YYYY-MM-DD
  slotMinutes: Joi.number().integer().min(5).max(120).default(30) // slot size
})

export function validateAvailabilityQuery(q){
  return availabilityQuerySchema.validate(q, { abortEarly: false })
}