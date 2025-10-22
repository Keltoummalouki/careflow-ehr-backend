import Joi from 'joi'

const resetPasswordSchema = Joi.object({
    token: Joi.string().min(10).required(),
    password: Joi.string().min(6).max(128).required()
})

export function validateResetPassword(body) {
    return resetPasswordSchema.validate(body, { abortEarly: false }) // when true, stops validation on the first error, otherwise returns all the errors found. 
}