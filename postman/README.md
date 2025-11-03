# Collection Postman CareFlow EHR

Cette collection Postman contient tous les endpoints pour tester l'API CareFlow EHR.

## 📁 Fichiers

- `CareFlow-EHR.postman_collection.json` - Collection complète avec tous les endpoints
- `CareFlow-EHR.postman_environment.json` - Variables d'environnement pour tests locaux

## 🚀 Installation

### 1. Importer dans Postman

1. Ouvrez Postman
2. Cliquez sur **Import** en haut à gauche
3. Glissez-déposez les deux fichiers JSON ou cliquez sur **Upload Files**
4. Importez :
   - `CareFlow-EHR.postman_collection.json` (la collection)
   - `CareFlow-EHR.postman_environment.json` (l'environnement)

### 2. Sélectionner l'environnement

Dans le coin supérieur droit de Postman, sélectionnez **CareFlow EHR - Local** dans le menu déroulant des environnements.

## 🔧 Configuration

### Variables d'environnement

L'environnement contient les variables suivantes :

| Variable | Description | Défaut |
|----------|-------------|--------|
| `baseUrl` | URL de base de l'API | `http://localhost:5001/api` |
| `authToken` | Token d'authentification (auto-rempli) | - |
| `userId` | ID de l'utilisateur connecté | - |
| `patientId` | ID du patient | - |
| `practitionerId` | ID du praticien | - |
| `appointmentId` | ID du rendez-vous | - |
| `consultationId` | ID de la consultation | - |
| `documentId` | ID du document | - |
| `labOrderId` | ID de l'ordonnance de laboratoire | - |
| `pharmacyId` | ID de la pharmacie | - |
| `prescriptionId` | ID de la prescription | - |

**Note :** Les variables sont automatiquement remplies après les requêtes POST de création.

## 📝 Ordre d'exécution recommandé

### 1. Authentification

```
1. Auth > Register
2. Auth > Login (sauvegarde automatiquement le token)
```

### 2. Création d'un patient

```
3. Patients > Create Patient (utilise userId de register)
```

### 3. Gestion des rendez-vous

```
4. Appointments > Check Availability
5. Appointments > Create Appointment
6. Appointments > List Appointments by Patient
7. Appointments > Update Appointment Status
```

### 4. Consultations

```
8. Consultations > Create Consultation
9. Consultations > List Consultations by Patient
10. Consultations > Get Consultation by ID
```

### 5. Documents médicaux

```
11. Documents > Upload Document (multipart)
12. Documents > List Documents by Patient
13. Documents > Get Download URL (presigned)
```

### 6. Ordonnances de laboratoire

```
14. Lab Orders > Create Lab Order
15. Lab Orders > Update Lab Order Status
16. Lab Orders > Upload Lab Results (JSON)
17. Lab Orders > Upload Lab Report (PDF)
```

### 7. Prescriptions

```
18. Prescriptions > Create Prescription
19. Prescriptions > List Prescriptions by Patient
20. Prescriptions > Dispense Prescription
```

## 🔐 Authentification

### Routes publiques (sans token)
- `/auth/register`
- `/auth/login`
- `/auth/password/forgot`
- `/auth/password/reset`
- `/health`

### Routes protégées
Toutes les autres routes nécessitent un token JWT. Le token est automatiquement ajouté via l'authentification Bearer au niveau de la collection.

**Important pour Prescriptions** : Les routes `/prescriptions/*` utilisent le middleware `requireAuth` et nécessitent OBLIGATOIREMENT un token valide.

## 📋 Endpoints disponibles

### Auth (6 endpoints)
- Register
- Login (sauvegarde le token)
- Logout
- Refresh Token
- Forgot Password
- Reset Password

### Admin (4 endpoints)
- Get All Users
- Create User
- Suspend User
- Activate User

### Patients (5 endpoints)
- List Patients
- Create Patient
- Get Patient by ID
- Update Patient
- Archive Patient

### Appointments (6 endpoints)
- Check Availability
- Create Appointment
- List Appointments by Patient
- List Appointments by Practitioner
- Reschedule Appointment
- Update Appointment Status

### Consultations (6 endpoints)
- List All Consultations
- Create Consultation
- List Consultations by Patient
- Get Consultation by ID
- Update Consultation
- Delete Consultation

### Documents (6 endpoints)
- Upload Document (multipart)
- Upload Document from Path (DEV)
- List Documents by Patient
- Get Document by ID
- Get Download URL (presigned)
- Delete Document

### Lab Orders (8 endpoints)
- List All Lab Orders
- Create Lab Order
- List Lab Orders by Patient
- Get Lab Order by ID
- Update Lab Order Status
- Upload Lab Results (JSON)
- Upload Lab Report (PDF)
- Download Lab Report

### Prescriptions (6 endpoints)
- Create Prescription
- List Prescriptions by Patient
- List Prescriptions by Pharmacy
- Get Prescription by ID
- Update Prescription
- Dispense Prescription

### Health Check (1 endpoint)
- Health Check

**Total : 48 endpoints**

## 🎯 Exemples de données

### Créer un patient
```json
{
  "userId": "{{userId}}",
  "dob": "1990-05-15",
  "gender": "male",
  "allergies": ["penicillin", "peanuts"],
  "contact": {
    "phone": "+1234567890",
    "email": "patient@example.com"
  }
}
```

### Créer un rendez-vous
```json
{
  "patientId": "{{patientId}}",
  "practitionerId": "{{practitionerId}}",
  "start": "2025-11-15T09:00:00.000Z",
  "end": "2025-11-15T09:30:00.000Z",
  "reason": "Consultation de routine"
}
```

### Créer une consultation
```json
{
  "appointmentId": "{{appointmentId}}",
  "patientId": "{{patientId}}",
  "vitalSigns": {
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "heartRate": 72,
    "temperature": 36.8
  },
  "chiefComplaint": "Douleur thoracique",
  "status": "completed"
}
```

## 🔍 Tests automatisés

Certaines requêtes incluent des scripts de test Postman qui :
- Sauvegardent automatiquement le token après login
- Extraient et sauvegardent les IDs après création d'entités
- Facilitent l'enchaînement des requêtes

### Exemple : Login
Après un login réussi, le token est automatiquement sauvegardé dans `{{authToken}}`.

### Exemple : Create Patient
Après création d'un patient, son ID est sauvegardé dans `{{patientId}}`.

## 📊 Validation des données

Tous les endpoints respectent les validateurs Joi définis dans le backend :

### Categories de documents
- `imaging` - Imagerie médicale
- `report` - Rapports médicaux
- `prescription` - Prescriptions
- `lab_result` - Résultats de laboratoire
- `other` - Autres

### Status des rendez-vous
- `scheduled` - Programmé
- `completed` - Terminé
- `cancelled` - Annulé

### Status des consultations
- `draft` - Brouillon
- `completed` - Terminé
- `cancelled` - Annulé

### Status des ordonnances de laboratoire
- `ordered` - Commandé
- `sample_collected` - Échantillon collecté
- `processing` - En traitement
- `completed` - Terminé
- `cancelled` - Annulé

### Status des prescriptions
- `draft` - Brouillon
- `signed` - Signé
- `sent` - Envoyé
- `dispensed` - Dispensé
- `cancelled` - Annulé

### Routes d'administration des médicaments
- `oral` - Voie orale
- `IV` - Intraveineuse
- `IM` - Intramusculaire
- `topical` - Topique
- `subcutaneous` - Sous-cutanée
- `inhalation` - Inhalation
- `other` - Autre

## 🐛 Dépannage

### Le token n'est pas sauvegardé
- Vérifiez que vous avez bien sélectionné l'environnement "CareFlow EHR - Local"
- Vérifiez que la requête Login renvoie un code 200
- Ouvrez l'onglet "Tests" dans la requête pour voir les scripts

### Erreur 401 Unauthorized
- Vérifiez que vous êtes bien connecté (requête Login)
- Vérifiez que le token est présent dans `{{authToken}}`
- Le token peut avoir expiré, refaites un login

### Erreur 404 Not Found
- Vérifiez que le serveur est démarré (`npm start` ou `npm run dev`)
- Vérifiez l'URL de base dans les variables d'environnement
- Vérifiez que la route existe dans `src/routes/`

### Variables d'environnement vides
- Exécutez les requêtes de création (POST) qui remplissent automatiquement les variables
- Vous pouvez aussi remplir manuellement les variables dans l'environnement

## 📝 Notes importantes

1. **Authentification désactivée pour les tests** : Certaines routes ont l'authentification commentée dans le code (pour faciliter les tests). En production, décommentez les middlewares `requireAuth()` et `authorizeRoles()`.

2. **Upload de fichiers** : 
   - Types acceptés : PDF, JPEG, PNG
   - Taille maximale : 20 MB
   - Utilise MinIO pour le stockage

3. **Prescriptions** : Les routes prescriptions nécessitent TOUJOURS l'authentification (middleware `requireAuth` non commenté).

4. **URLs présignées** : Les URLs de téléchargement de documents sont valides pendant 10 minutes.

## 🔗 Liens utiles

- [Documentation Postman](https://learning.postman.com/docs/getting-started/introduction/)
- [Importer des collections](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/)
- [Variables d'environnement](https://learning.postman.com/docs/sending-requests/variables/)

## 📄 Licence

Ce projet fait partie de CareFlow EHR Backend.
