import Joi from 'joi'

export const patientUpdateSchema = Joi.object({       
  firstName: Joi.string().trim().min(1),
  lastName: Joi.string().trim().min(1),
  dob: Joi.date().iso(),
  gender: Joi.string().valid('male','female','other'),
  allergies: Joi.array().items(Joi.string().trim()),
  medicalHistory: Joi.array().items(Joi.string().trim()),
  contact: Joi.object({
    phone: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    address: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
  }),
  insurance: Joi.object({
    provider: Joi.string().allow('', null),
    policyNumber: Joi.string().allow('', null),
  }),
  isActive: Joi.boolean()
})

export function validatePatientUpdate(body){
  return patientUpdateSchema.validate(body, { abortEarly: false })
}