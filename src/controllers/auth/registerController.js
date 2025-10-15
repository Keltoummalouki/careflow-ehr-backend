import bcrypt from 'bcrypt'
import User from '../../models/User.js'
import Role from "../../models/Role.js"
import { validateRegister } from '../../validators/auth/registerValidator.js'

export async function register(req, res) {
    try {

        const {error, value} = validateRegister(req.body)

        if(error){
            return res.status(400).json({ message: 'Invalid data', details: error.details.map(d => d.message)})
        }

        const {firstName , lastName, email, password} = value

        const existing = await User.findOne({email: email.toLowerCase()})

        if(existing) {
            return res.status(409).json({message: 'Email already in use'})
        }

        let patientRole = await Role.findOne({name: 'patient'})

        if(!patientRole){
            patientRole = await Role.create({name: 'patient'})
        }

        const hashed = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstName , lastName, email : email.toLowerCase(), password: hashed, roleId: patientRole._id
        })

        return res.status(201).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: 'patient',
            isActive: user.isActive,
            createdAt: user.createdAt
        })

    } catch (err) {
        return res.status(500).json({message: 'Server error', error: err.message})
    }
}
