import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Role from '../models/Role.js'

dotenv.config()

const roles = [
    { name: 'admin', isActive: true },
    { name: 'doctor', isActive: true },
    { name: 'nurse', isActive: true },
    { name: 'secretary', isActive: true },
    { name: 'patient', isActive: true }
]

async function initRoles() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')

        for (const role of roles) {
            await Role.updateOne(
                { name: role.name },
                { $set: role },
                { upsert: true }
            )
            console.log(`Role ${role.name} initialized`)
        }

        console.log('All roles initialized successfully')
        process.exit(0)
    } catch (error) {
        console.error('Error initializing roles:', error)
        process.exit(1)
    }
}

initRoles()