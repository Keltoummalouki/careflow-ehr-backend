import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import BlacklistedToken from '../../models/blacklistedToken.js'
import Joi from 'joi'

const refreshSchema = Joi.object({
    refreshToken: Joi.string().min(10).required()
})

export async function refreshToken(req, res) {
    try {
        const { error, value } = refreshSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Invalid data',
                details: error.details.map(d => d.message)
            })
        }

        const { refreshToken } = value

        const blacklisted = await BlacklistedToken.findOne({ token: refreshToken })
        if (blacklisted) {
            return res.status(401).json({ message: 'Token has been revoked' })
        }

        let decoded
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' })
        }

        const user = await User.findById(decoded.sub).populate('roleId')
        if (!user || !user.isActive) {
            return res.status(403).json({ message: 'Account disabled' })
        }

        const roleName = user.roleId?.name || 'patient'
        const newAccessToken = jwt.sign(
            { sub: user._id.toString(), role: roleName },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        )

        return res.status(200).json({
            accessToken: newAccessToken
        })

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}