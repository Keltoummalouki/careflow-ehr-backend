import { authorizeRoles } from './authorizeRoles.js'

export function requireRole(roles) {
    if (Array.isArray(roles)) return authorizeRoles(...roles)
    return authorizeRoles(roles)
}

