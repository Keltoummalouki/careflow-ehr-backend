import Joi from 'joi'

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
})

export function validateForgotPassword(body) {
    return forgotPasswordSchema.validate(body, { abortEarly: false }) // when true, stops validation on the first error, otherwise returns all the errors found. 
}