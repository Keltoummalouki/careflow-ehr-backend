import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles'
import { createPatient } from '../controllers/patient/createPatient'
import { updatePatient } from '../controllers/patient/updatePatient'
import { getPatientById } from '../controllers/patient/getPatientById'
import { listPatients } from '../controllers/patient/listPatients'
import { archivePatient } from '../controllers/patient/archivePatient'

const router = Router()

router.get('/', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), listPatients)

router.get('/:patientId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), getPatientById)

router.post('/', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), createPatient)

router.put('/:patientId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), updatePatient)

router.delete('/:patientId', requireAuth(true), authorizeRoles('admin','doctor','nurse','secretary'), archivePatient)

export default router