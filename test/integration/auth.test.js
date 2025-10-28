import '../setup.js'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { expect } from 'chai'
import app from '../../src/app.js'
import User from '../../src/models/User.js'
import Role from '../../src/models/Role.js'

describe('Auth Integration Tests', function() {
    this.timeout(20000)
    let patientRole

    beforeEach(async function() {
        this.timeout(20000)
        // create-or-get the patient role to avoid duplicate key errors between tests
        patientRole = await Role.findOneAndUpdate(
            { name: 'patient' },
            { $setOnInsert: { name: 'patient', isActive: true } },
            { upsert: true, new: true }
        )
    })

    describe('POST /api/auth/register', () => {
        it('should register a new user', async function() {
            this.timeout(20000)
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                })

            expect(res.status).to.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body.email).to.equal('john@example.com')
            expect(res.body.role).to.equal('patient')
        })

        it('should reject duplicate email', async function() {
            this.timeout(20000)
            await User.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                password: 'hashed',
                roleId: patientRole._id
            })

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'jane@example.com',
                    password: 'password123'
                })

            expect(res.status).to.equal(409)
            expect(res.body.message).to.include('already in use')
        })
    })

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async function() {
            this.timeout(20000)
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                })

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                })

            expect(res.status).to.equal(200)
            expect(res.body).to.have.property('tokens')
            expect(res.body.tokens).to.have.property('accessToken')
            expect(res.body.tokens).to.have.property('refreshToken')
        })

        it('should reject invalid credentials', async function() {
            this.timeout(20000)
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'wrongpassword'
                })

            expect(res.status).to.equal(401)
        })
    })
})