import User from '../../models/User.js'
import Role from '../../models/Role.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Dto from '../admin/Dto.js'

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email?.toLowerCase().trim() })
      .populate('roleId', 'name') // ensure role name is available

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // role name (fallbacks to string role if present)
    const roleName = user.roleId?.name || user.role || 'patient'

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
      user: Dto({ ...user.toObject(), roleId: { name: roleName } }),
      token: accessToken, // alias to satisfy older tests
      tokens: { accessToken, refreshToken }
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}