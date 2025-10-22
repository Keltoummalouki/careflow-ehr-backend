import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles'


const router = Router()

router.post('/', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), createAppointment)

router.post('/', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), createAppointment)

router.patch('/:appointmentId/status', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), updateAppointmentStatus)

router.get('/practitioner/:practitionerId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), listAppointmentsByPractitioner)

router.get('/patient/:patientId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), listAppointmentsByPatient)

router.get('/availability', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary','patient'), availability)

export default router