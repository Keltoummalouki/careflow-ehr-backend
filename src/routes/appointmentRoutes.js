import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth.js'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles.js'
import {createAppointment} from '../controllers/appointment/createAppointment.js'
import {updateAppointmentStatus} from '../controllers/appointment/updateAppointmentStatus.js'
import {rescheduleAppointment} from '../controllers/appointment/rescheduleAppointment.js'
import {listAppointmentsByPractitioner} from '../controllers/appointment/listAppointmentsByPractitioner.js'
import {listAppointmentsByPatient} from '../controllers/appointment/listAppointmentsByPatient.js'
import {availability} from '../controllers/appointment/availability.js'


const router = Router()

router.post('/', 
    // requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'),
    createAppointment)

router.put('/:appointmentId', 
    // requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), 
    rescheduleAppointment)

router.patch('/:appointmentId/status', 
    // requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), 
    updateAppointmentStatus)

router.get('/practitioner/:practitionerId', 
    // requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), 
    listAppointmentsByPractitioner)

router.get('/patient/:patientId', 
    // requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), 
    listAppointmentsByPatient)

router.get('/availability', 
    // requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary','patient'), 
    availability)

export default router