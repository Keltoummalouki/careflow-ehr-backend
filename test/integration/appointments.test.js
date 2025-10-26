import '../setup.js'
import request from 'supertest'
import { expect } from 'chai'
import app from '../../src/app.js'
import User from '../../src/models/User.js'
import Patient from '../../src/models/Patient.js'
import Role from '../../src/models/Role.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

describe('Appointments Integration Tests', function() {
    this.timeout(20000)
    let doctorToken, doctorId, patientId

    beforeEach(async function() {
        this.timeout(20000)
        
        const doctorRole = await Role.create({ name: 'doctor', isActive: true })
        const doctor = await User.create({
            firstName: 'Dr',
            lastName: 'Smith',
            email: 'doctor@example.com',
            password: await bcrypt.hash('password123', 10),
            roleId: doctorRole._id
        })
        doctorId = doctor._id.toString()

        doctorToken = jwt.sign(
            { sub: doctorId, role: 'doctor' },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        )

        const patient = await Patient.create({
            firstName: 'Jane',
            lastName: 'Doe',
            dob: new Date('1990-01-01'),
            gender: 'female'
        })
        patientId = patient._id.toString()
    })

    describe('POST /api/appointments', () => {
        it('should create an appointment', async function() {
            this.timeout(20000)
            const res = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({
                    patientId,
                    practitionerId: doctorId,
                    start: '2025-10-23T10:00:00Z',
                    end: '2025-10-23T11:00:00Z',
                    reason: 'Consultation'
                })

            expect(res.status).to.equal(201)
            expect(res.body.appointment).to.have.property('_id')
            expect(res.body.appointment.status).to.equal('scheduled')
        })

        it('should reject conflicting appointments', async function() {
            this.timeout(20000)
            await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({
                    patientId,
                    practitionerId: doctorId,
                    start: '2025-10-23T10:00:00Z',
                    end: '2025-10-23T11:00:00Z',
                    reason: 'First'
                })

            const res = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${doctorToken}`)
                .send({
                    patientId,
                    practitionerId: doctorId,
                    start: '2025-10-23T10:30:00Z',
                    end: '2025-10-23T11:30:00Z',
                    reason: 'Conflict'
                })

            expect(res.status).to.equal(409)
            expect(res.body.message).to.include('conflict')
        })
    })
})