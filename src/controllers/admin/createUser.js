import bcrypt from 'bcrypt'
import User from "../../models/User.js";
import Role from "../../models/Role.js";
import { validateAddUser } from "../../validators/admin/validateAddUser.js"
import Dto from './Dto.js'


export async function addUser(req, res) {
    try {

        const {error, value} = validateAddUser(req.body)

        if(error){
            return res.status(400).json({ 
                message: 'Invalid data', 
                details: error.details.map(d => d.message)})
        }

        const {firstName , lastName, email, password, role} = value

        const existing = await User.findOne({email: email.toLowerCase()})

        if(existing) {
            return res.status(409).json({message: 'Email already in use'})
        }

        const roleName = role
        const roleFind = await Role.findOne({ name: roleName })

        if(!roleFind){
            return res.status(400).json({ message: `Role not found: ${roleName}` })
        }

        const hashed = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstName , lastName, email : email.toLowerCase(), password: hashed, roleId: roleFind._id, isActive: true
        })

        const populated = await user.populate('roleId')  // get role name

        return res.status(201).json({
            user: Dto(populated) // send clean data
        })

    } catch (err) {
        return res.status(500).json({message: 'Server error', error: err.message})
    }
}
