import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth.js'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles.js'
import { createPatient } from '../controllers/patient/createPatient.js'
import { updatePatient } from '../controllers/patient/updatePatient.js'
import { getPatientById } from '../controllers/patient/getPatientById.js'
import { listPatients } from '../controllers/patient/listPatients.js'
import { archivePatient } from '../controllers/patient/archivePatient.js'

const router = Router()

router.get('/', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), listPatients)

router.get('/:patientId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), getPatientById)

router.post('/', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), createPatient)

router.put('/:patientId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), updatePatient)

router.delete('/:patientId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), archivePatient)

export default router