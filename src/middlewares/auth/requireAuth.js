import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

export default function requireAuth(loadUserFromDb = false) {
    return async (req, res, next) => {
        const auth = req.headers.authorization || '' // read -> header Authorization
        const token = auth.startsWith('Bearer ') // check if form => Bearer xxx
        ? auth.slice(7) // Extraire just after Bearer
        : null

        if(!token){
            return res.status(401).json({message: 'Missing token'})
        }

        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET
            )

            if (loadUserFromDb) {
                const user = await User.findById(payload.sub).populate('roleId')

                if(!user || !user.isActive){
                    return res.status(403).json({message: 'Account disabled'})
                }

                req.user = user // attache objet user -> req
                req.auth = {
                    userId: user._id.toString(),
                    role: user.roleId?.name || payload.role
                }
            } else{
                req.auth = {
                    userId: payload.sub,
                    role: payload.role
                }
            }

            return next()
        } catch {
            return res.status(401).json({message: 'Invalid or Expired token'})
        }
    }
}

export { requireAuth }