import Joi from 'joi'                                         

export const appointmentCreateSchema = Joi.object({           
  patientId: Joi.string().length(24).required(),              
  practitionerId: Joi.string().length(24).required(),        
  start: Joi.date().iso().required(),                       
  end: Joi.date().iso().required(),                   
  reason: Joi.string().trim().allow('', null),
  notes: Joi.string().trim().allow('', null)
}).custom((value, helpers) => {   // custom rule: end > start
  if (new Date(value.end) <= new Date(value.start)) {
    return helpers.error('any.invalid')
  }
  return value
}, 'end after start')

export function validateAppointmentCreate(body){
  return appointmentCreateSchema.validate(body, { abortEarly: false })
}