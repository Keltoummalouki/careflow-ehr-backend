import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import { validateLogin } from '../../validators/auth/loginValidator.js'

export async function login(req, res) {
  try {
    const { error, value } = validateLogin(req.body)
    if (error) {
      return res.status(400).json({
        message: 'Invalid data',
        details: error.details.map(d => d.message),
      })
    }

    const { email, password } = value

    const user = await User.findOne({ email: email.toLowerCase() }).populate('roleId')
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    if (!user.isActive) return res.status(403).json({ message: 'Account disabled' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

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
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: roleName,
        isActive: user.isActive,
      },
      tokens: { accessToken, refreshToken },
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}