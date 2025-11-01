export default function Dto(u) {
  return {
    id: u._id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.roleId?.name ?? u.role ?? 'patient', // robust role resolution
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt
  }
}