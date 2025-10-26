import { Router } from 'express'
import { requireAuth } from '../middlewares/auth/requireAuth.js'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles.js'
import {uploadDocument} from '../controllers/document/uploadDocument.js'
import {listDocuments} from '../controllers/document/listDocuments.js'
import {downloadDocument} from '../controllers/document/downloadDocument.js'

const router = Router()

router.post('/upload', requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient'), upload.single('file'), uploadDocument)
router.get('/patient/:patientId', requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient'), listDocuments)
router.get('/:documentId', requireRole(['admin', 'doctor', 'nurse', 'patient']), getDocument)
router.get('/:documentId/download', requireAuth(true), authorizeRoles('admin', 'doctor', 'nurse', 'patient'), downloadDocument)
router.delete('/:documentId', requireRole(['admin', 'doctor', 'nurse']), deleteDocument)

export default router