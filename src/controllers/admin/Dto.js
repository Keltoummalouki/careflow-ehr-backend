export default function Dto(u) { // Data Transfer Object -> Transfer object without leaking sensitive information
    return {
        id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.roleId.name,
        isActive: u.isActive,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
    }
}