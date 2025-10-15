import {Router} from 'express'
import {register} from '../controllers/auth/registerController.js'
import {login} from '../controllers/auth/loginController.js'  
import {logout} from '../controllers/auth/logoutController.js'

const router = Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

export default router