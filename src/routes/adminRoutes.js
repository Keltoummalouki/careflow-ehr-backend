import { Router } from "express";
import { requireAuth } from '../middlewares/auth/requireAuth.js'
import { authorizeRoles } from '../middlewares/auth/authorizeRoles.js'
import { addUser } from "../controllers/admin/createUser.js";
import { getAllUsers } from "../controllers/admin/getAllUsers.js";
import { suspendUser, activateUser } from "../controllers/admin/IsActive.js";

const router = Router()

router.get('/users' , requireAuth(true), authorizeRoles('admin'), getAllUsers)
router.post('/users' , requireAuth(true), authorizeRoles('admin'), addUser)
router.patch('/users/:userId/suspend' , requireAuth(true), authorizeRoles('admin'), suspendUser)
router.patch('/users/:userId/activate' , requireAuth(true), authorizeRoles('admin'), activateUser)

export default router;