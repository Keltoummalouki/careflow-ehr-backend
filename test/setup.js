import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Ensure test env + JWT secrets for login
process.env.NODE_ENV = 'test'
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test_access_secret'
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret'

// Start in-memory MongoDB and connect Mongoose BEFORE tests run
const mongoServer = await MongoMemoryServer.create()
const uri = mongoServer.getUri()

await mongoose.connect(uri) // wait until connected
process.env.MONGO_URI = uri
console.log('MongoMemoryServer connected')

// mocha hooks for cleanup between/after tests
export const mochaHooks = {
  async afterEach() {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections
      for (const key in collections) {
        await collections[key].deleteMany({})
      }
    }
  },

  async afterAll() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }
    if (mongoServer) {
      await mongoServer.stop()
    }
    console.log('MongoMemoryServer stopped')
  }
}