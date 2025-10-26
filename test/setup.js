import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

let mongoServer

export const mochaHooks = {
    async beforeAll() {
        this.timeout(60000)
        
        // Déconnecter toute connexion existante
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect()
        }

        mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        })
        
        console.log('MongoDB Memory Server connected')
    },

    async afterAll() {
        this.timeout(60000)
        
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect()
        }
        
        if (mongoServer) {
            await mongoServer.stop()
        }
        
        console.log('MongoDB Memory Server stopped')
    },

    async afterEach() {
        if (mongoose.connection.readyState === 1) {
            const collections = mongoose.connection.collections
            for (const key in collections) {
                await collections[key].deleteMany({})
            }
        }
    }
}