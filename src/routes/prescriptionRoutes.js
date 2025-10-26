import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth.js'
import { requireRole } from '../middlewares/auth/requireRole.js'
import { createPrescription } from '../controllers/prescription/createPrescription.js'
import { getPrescriptionById } from '../controllers/prescription/getPrescriptionById.js'
import { updatePrescription } from '../controllers/prescription/updatePrescription.js'
import { dispensePrescription } from '../controllers/prescription/dispensePrescription.js'
import { listPrescriptionsByPatient } from '../controllers/prescription/listPrescriptionsByPatient.js'
import { listPrescriptionsByPharmacy } from '../controllers/prescription/listPrescriptionsByPharmacy.js'

const router = Router()

router.use(requireAuth)

router.post('/', requireRole(['admin', 'doctor']), createPrescription)
router.get('/patient/:patientId', requireRole(['admin', 'doctor', 'nurse', 'patient']), listPrescriptionsByPatient)
router.get('/pharmacy/:pharmacyId', requireRole(['admin', 'pharmacist']), listPrescriptionsByPharmacy)
router.get('/:prescriptionId', requireRole(['admin', 'doctor', 'nurse', 'patient', 'pharmacist']), getPrescriptionById)
router.put('/:prescriptionId', requireRole(['admin', 'doctor']), updatePrescription)
router.patch('/:prescriptionId/dispense', requireRole(['admin', 'pharmacist']), dispensePrescription)

export default router