import Joi from 'joi'

const schema = Joi.object({
  refreshToken: Joi.string().min(10).required()
})

export function validateLogout(body){
  return schema.validate(body, { abortEarly: false }) // when true, stops validation on the first error, otherwise returns all the errors found. 
}