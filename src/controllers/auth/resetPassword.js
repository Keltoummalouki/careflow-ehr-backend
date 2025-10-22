// crypto Used for generating tokens or encrypting data.
import crypto from 'crypto' // It help to encrypt, hash, or create random values —> for security.
// bcrypt used for hashing passwords.
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import { validateForgotPassword } from '../../validators/auth/forgotPassword.js'
import { validateResetPassword } from '../../validators/auth/resetPassword.js'

export async function forgotPassword(req,res){
    try {
        const { error, value } = validateForgotPassword(req.body)
        if(error){
            return res.status(400).json( {message: 'Invalid data', details: error.details.map(d=>d.message)} )
        }

        const email = value.email.toLowerCase()
        const user = await User.findOne({ email })

        if(!user) return res.status(200).json({ message: 'Email sent' })

        const plainToken = crypto.randomBytes(32).toString('hex')
        const hashed = crypto.createHash('sha256').update(plainToken).digest('hex')

        user.passwordResetToken = hashed
        user.passwordResetExpire = new Date(Date.now() + 15 * 60 * 1000)

        await user.save()

        return res.status(200).json({
            message: 'Reset token generated',
            resetToken: plainToken,
            expiresInMinutes: 15
        })

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}


export async function resetPassword(req,res){
    try {
        const { error, value } = validateResetPassword(req.body)
        if(error){
            return res.status(400).json( {message: 'Invalid data', details: error.details.map(d=>d.message)} )
        }

        const { token, password } = value

        const hashed = crypto.createHash('sha256').update(token).digest('hex') 
        const user = await User.findOne({ 
            passwordResetToken: hashed,
            passwordResetExpire: { $gt : new Date() }
        }).populate('roleId')

        if(!user) {
            return res.status(400).json({ message: 'Invalid or expired token' })
        }

        const hash = await bcrypt.hash(password, 10)
        user.password = hash
        user.passwordResetToken = null
        user.passwordResetExpire = null
        await user.save()

        const roleName = user.roleId?.name || 'patient'
        const accessToken = jwt.sign(
            { sub: user._id.toString(), role: roleName },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            { sub: user._id.toString() },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            message: 'Password reset successful',
            user: {
                id: user._id,
                email: user.email,
                role: roleName,
                isActive: user.isActive
            },
            tokens: { accessToken, refreshToken }
        })

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}