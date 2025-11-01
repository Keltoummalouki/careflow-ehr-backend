import Joi from 'joi'                                         

export const patientCreateSchema = Joi.object({               
  userId: Joi.string().hex().length(24).required(),          
  dob: Joi.date().iso().required(),                          
  gender: Joi.string().valid('male','female','other').required(), 
  allergies: Joi.array().items(Joi.string().trim()).default([]), 
  medicalHistory: Joi.array().items(Joi.string().trim()).default([]),
  contact: Joi.object({                                       
    phone: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    address: Joi.string().allow('', null),
    city: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
  }).default({}),
  insurance: Joi.object({                                    
    provider: Joi.string().allow('', null),
    policyNumber: Joi.string().allow('', null),
  }).default({})
})

export function validatePatientCreate(body){                  
  return patientCreateSchema.validate(body, { abortEarly: false })
}