import '../setup.js'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { expect } from 'chai'
import app from '../../src/app.js'
import User from '../../src/models/User.js'
import Role from '../../src/models/Role.js'

// describe = créer un groupe de tests
describe('Auth Integration Tests', function() {
    // Donner 20 secondes maximum pour tous ces tests
    this.timeout(20000)
    
    // Variable pour stocker le rôle "patient"
    let patientRole

    // beforeEach = action à faire AVANT CHAQUE test
    beforeEach(async function() {
        this.timeout(20000)
        
        // Créer ou récupérer le rôle "patient" dans la base de données
        // (évite les erreurs de duplication)
        patientRole = await Role.findOneAndUpdate(
            { name: 'patient' },                                    // Chercher : rôle avec nom "patient"
            { $setOnInsert: { name: 'patient', isActive: true } },  // Si pas trouvé : créer avec ces valeurs
            { upsert: true, new: true }                             // upsert=créer si absent, new=retourner le nouveau
        )
    })

    describe('POST /api/auth/register', () => {
        
        // TEST 1 : Créer un nouvel utilisateur
        it('should register a new user', async function() {
            this.timeout(20000)
            
            // Envoyer une requête POST à /api/auth/register
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',           // Prénom
                    lastName: 'Doe',             // Nom
                    email: 'john@example.com',   // Email
                    password: 'password123'      // Mot de passe
                })

            // VÉRIFICATIONS :
            // 1. Le code de réponse doit être 201 (créé avec succès)
            expect(res.status).to.equal(201)
            
            // 2. La réponse doit contenir un "id"
            expect(res.body).to.have.property('id')
            
            // 3. L'email doit être correct
            expect(res.body.email).to.equal('john@example.com')
            
            // 4. Le rôle doit être "patient"
            expect(res.body.role).to.equal('patient')
        })

        // TEST 2 : Refuser un email déjà utilisé
        it('should reject duplicate email', async function() {
            this.timeout(20000)
            
            // ÉTAPE 1 : Créer un premier utilisateur dans la base de données
            await User.create({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',       // Email déjà utilisé
                password: 'hashed',              // Mot de passe crypté
                roleId: patientRole._id          // Lien vers le rôle patient
            })

            // ÉTAPE 2 : Essayer de créer un deuxième utilisateur avec le MÊME email
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'jane@example.com',   // Email déjà pris !
                    password: 'password123'
                })

            // VÉRIFICATIONS :
            // 1. Le code doit être 409 (conflit)
            expect(res.status).to.equal(409)
            
            // 2. Le message doit dire "already in use" (déjà utilisé)
            expect(res.body.message).to.include('already in use')
        })
    })
    
    describe('POST /api/auth/login', () => {
        
        // TEST 3 : Se connecter avec des identifiants corrects
        it('should login with valid credentials', async function() {
            this.timeout(20000)
            
            // ÉTAPE 1 : Créer d'abord un utilisateur
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                })

            // ÉTAPE 2 : Essayer de se connecter avec cet utilisateur
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',    // Email correct
                    password: 'password123'       // Mot de passe correct
                })

            // VÉRIFICATIONS :
            // 1. Le code doit être 200 (succès)
            expect(res.status).to.equal(200)
            
            // 2. La réponse doit contenir un "token" (clé d'accès)
            expect(res.body).to.have.property('tokens')
            expect(res.body.tokens).to.have.property('accessToken')
            expect(res.body.tokens.accessToken).to.be.a('string')
            expect(res.body.tokens).to.have.property('refreshToken')
        })

        // TEST 4 : Refuser des identifiants incorrects
        it('should reject invalid credentials', async function() {
            this.timeout(20000)
            
            // ÉTAPE 1 : Créer un utilisateur
            await request(app)
                .post('/api/auth/register')
                .send({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123'
                })

            // ÉTAPE 2 : Essayer de se connecter avec un MAUVAIS mot de passe
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'wrongpassword'    // Mot de passe incorrect !
                })

            // VÉRIFICATIONS :
            // 1. Le code doit être 401 (non autorisé)
            expect(res.status).to.equal(401)
            
            // 2. Le message doit dire "Invalid credentials" (identifiants invalides)
            expect(res.body.message).to.include('Invalid credentials')
        })
    })
})