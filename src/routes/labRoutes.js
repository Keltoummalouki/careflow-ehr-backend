import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth.js'
import { requireRole } from '../middlewares/auth/requireRole.js'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles.js'
import { createLabOrder } from '../controllers/lab/createLabOrder.js'
import { getLabOrderById } from '../controllers/lab/getLabOrderById.js'
import { updateLabOrderStatus } from '../controllers/lab/updateLabOrderStatus.js'
import { uploadLabResults } from '../controllers/lab/uploadLabResults.js'
import { downloadLabReport , uploadLabReport, upload } from '../controllers/lab/labReport.js'
import { listLabOrdersByPatient } from '../controllers/lab/listLabOrdersByPatient.js'
import { listLabOrders } from '../controllers/lab/listLabOrders.js'

const router = Router()

router.post('/', requireAuth(true), authorizeRoles('admin', 'doctor'), createLabOrder)
router.get('/', requireRole(['admin', 'lab_tech']), listLabOrders)
router.get('/patient/:patientId', requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient', 'lab_tech'), listLabOrdersByPatient)
router.get('/:labOrderId', requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient', 'lab_tech'), getLabOrderById)
router.patch('/:labOrderId/status', requireRole(['admin', 'lab_tech']), updateLabOrderStatus)
router.post('/:labOrderId/results', requireAuth(true), authorizeRoles('admin', 'lab_tech'), uploadLabResults)
router.post('/:labOrderId/report', requireRole(['admin', 'lab_tech']), upload.single('report'), uploadLabReport)
router.get('/:labOrderId/report', requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient', 'lab_tech'), downloadLabReport)

export default router