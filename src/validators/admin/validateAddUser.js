import Joi from 'joi'

const addUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().trim().lowercase().required(),
})

export function validateAddUser(body) {
    return addUserSchema.validate(body, { abortEarly: false }) // when true, stops validation on the first error, otherwise returns all the errors found. 
}
