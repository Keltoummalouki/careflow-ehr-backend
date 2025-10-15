import Joi from 'joi'

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
})

export function validateRegister(body) {
    return registerSchema.validate(body, { abortEarly: false }) // when true, stops validation on the first error, otherwise returns all the errors found. 
}
