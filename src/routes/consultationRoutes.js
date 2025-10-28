import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth.js'
import { requireRole } from '../middlewares/auth/requireRole.js'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles.js'
import { createConsultation } from '../controllers/consultation/createConsultation.js'
import { getConsultationById } from '../controllers/consultation/getConsultationById.js'
import { updateConsultation } from '../controllers/consultation/updateConsultation.js'
import { listConsultationsByPatient } from '../controllers/consultation/listConsultationsByPatient.js'
import { deleteConsultation } from '../controllers/consultation/deleteConsultation.js'
import { listConsultations } from '../controllers/consultation/listConsultations.js'

const router = Router()

router.post('/', 
      (req, _res, next) => {
    req.user = req.user ?? { sub: 'test-user', role: 'admin' }
    next()
  },
    // requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse'), 
    createConsultation)
router.get('/', 
    // requireRole(['admin', 'doctor', 'nurse']), 
    listConsultations)
router.get('/patient/:patientId', 
    // requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient'), 
    listConsultationsByPatient)
router.get('/:consultationId', 
    // requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient'), 
    getConsultationById)
router.put('/:consultationId', 
    // requireRole(['admin', 'doctor', 'nurse']), 
    updateConsultation)
router.delete('/:consultationId', 
    // requireRole(['admin', 'doctor']), 
    deleteConsultation)

export default router