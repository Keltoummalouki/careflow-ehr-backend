export function authorizeRoles(...allowed) { // accepte list -> roles autorisés  
    return (req, res, next) => {
        const role = req.auth?.role || req.user?.roleId?.name // read role
        if(!role || !allowed.includes(role)) {
            return res.status(403).json({message: 'Forbidden'})
        }
        next()
    }
}