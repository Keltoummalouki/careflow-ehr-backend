import Joi from 'joi'

export const appointmentStatusSchema = Joi.object({          
  status: Joi.string().valid('scheduled','completed','cancelled').required()
})

export function validateAppointmentStatus(body){
  return appointmentStatusSchema.validate(body, { abortEarly: false })
}