# 🚀 Guide de démarrage rapide - Collection Postman CareFlow EHR

## ⚡ Démarrage en 5 minutes

### 1️⃣ Importer la collection

1. Ouvrez **Postman**
2. Cliquez sur **Import** (en haut à gauche)
3. Importez les 2 fichiers :
   - `CareFlow-EHR.postman_collection.json`
   - `CareFlow-EHR.postman_environment.json`
4. Sélectionnez l'environnement **"CareFlow EHR - Local"** (en haut à droite)

### 2️⃣ Démarrer le serveur

```powershell
# Depuis le dossier racine du projet
npm start
# OU en mode dev
npm run dev
```

Le serveur démarre sur `http://localhost:5001`

### 3️⃣ Workflow de test complet

#### Étape 1 : S'inscrire et se connecter

```
Auth > Register
Auth > Login
```

✅ Le token est automatiquement sauvegardé

#### Étape 2 : Créer un patient

```
Patients > Create Patient
```

✅ L'ID du patient est automatiquement sauvegardé dans `{{patientId}}`

#### Étape 3 : Créer un rendez-vous

**Important** : Vous devez d'abord avoir un `practitionerId` (ID d'un médecin)

```
# Option 1 : Créer un utilisateur médecin via Admin
Admin > Create User (avec role: "doctor")

# Option 2 : Mettre manuellement un practitionerId
Environnement > practitionerId = "ID_D_UN_MEDECIN"
```

Puis :
```
Appointments > Check Availability
Appointments > Create Appointment
```

#### Étape 4 : Créer une consultation

```
Consultations > Create Consultation
```

#### Étape 5 : Uploader un document

```
Documents > Upload Document (multipart)
# Sélectionnez un fichier PDF, JPEG ou PNG
```

#### Étape 6 : Créer une ordonnance de laboratoire

```
Lab Orders > Create Lab Order
Lab Orders > Upload Lab Results (JSON)
```

#### Étape 7 : Créer une prescription

**⚠️ Important** : Nécessite un token d'authentification valide (middleware non commenté)

```
Prescriptions > Create Prescription
```

## 🎯 Scénarios de test préconfigurés

### Scénario 1 : Nouveau patient - Consultation complète

1. **Auth > Register** → Créer compte utilisateur
2. **Auth > Login** → Se connecter (token auto-sauvegardé)
3. **Patients > Create Patient** → Créer profil patient
4. **Appointments > Create Appointment** → Prendre RDV
5. **Appointments > Update Appointment Status** → Marquer comme "completed"
6. **Consultations > Create Consultation** → Créer consultation
7. **Lab Orders > Create Lab Order** → Commander analyses
8. **Prescriptions > Create Prescription** → Prescrire médicament

### Scénario 2 : Gestion documentaire

1. **Auth > Login** → Se connecter
2. **Documents > Upload Document** → Uploader un document
3. **Documents > List Documents by Patient** → Voir tous les documents
4. **Documents > Get Download URL** → Obtenir URL de téléchargement
5. Copier l'URL et ouvrir dans un navigateur pour télécharger

### Scénario 3 : Workflow laboratoire

1. **Auth > Login** (en tant que docteur)
2. **Lab Orders > Create Lab Order** → Commander analyses
3. **Lab Orders > Update Lab Order Status** → `sample_collected`
4. **Lab Orders > Upload Lab Results** → Uploader résultats JSON
5. **Lab Orders > Upload Lab Report** → Uploader PDF
6. **Lab Orders > Download Lab Report** → Télécharger le rapport

### Scénario 4 : Administration

1. **Auth > Login** (en tant qu'admin)
2. **Admin > Get All Users** → Voir tous les utilisateurs
3. **Admin > Create User** → Créer un médecin
4. **Admin > Suspend User** → Suspendre un compte
5. **Admin > Activate User** → Réactiver un compte

## 🔑 Variables clés

Après avoir exécuté les requêtes, ces variables sont automatiquement remplies :

| Variable | Provient de | Utilisé dans |
|----------|-------------|--------------|
| `authToken` | Auth > Login | Toutes les routes protégées |
| `userId` | Auth > Register | Patients > Create Patient |
| `patientId` | Patients > Create Patient | Appointments, Consultations, Documents, etc. |
| `appointmentId` | Appointments > Create Appointment | Consultations > Create |
| `consultationId` | Consultations > Create | Prescriptions, Lab Orders |
| `documentId` | Documents > Upload | Documents > Download, Delete |
| `labOrderId` | Lab Orders > Create | Lab Orders > Upload Results/Report |
| `prescriptionId` | Prescriptions > Create | Prescriptions > Update, Dispense |

## 📝 Valeurs par défaut à connaître

### Port du serveur
```
http://localhost:5001/api
```

### Rôles disponibles
- `patient` (par défaut à l'inscription)
- `doctor`
- `nurse`
- `admin`
- `secretary`
- `lab_tech`
- `pharmacist`

### Formats de date
```javascript
// Rendez-vous
"start": "2025-11-15T09:00:00.000Z"
"end": "2025-11-15T09:30:00.000Z"

// Date de naissance
"dob": "1990-05-15"

// Query parameter
"date": "2025-11-15"
```

### IDs MongoDB
Tous les IDs sont des ObjectId MongoDB (24 caractères hexadécimaux) :
```
"60d5ec49f1b2c8b1f8e4e1a1"
```

## ⚠️ Erreurs courantes et solutions

### ❌ Erreur : "Invalid patientId"
**Solution** : Exécutez d'abord `Patients > Create Patient`

### ❌ Erreur : "Appointment not found"
**Solution** : Exécutez d'abord `Appointments > Create Appointment`

### ❌ Erreur : "User not found" (lors de Create Patient)
**Solution** : Vérifiez que `{{userId}}` est bien rempli après Register

### ❌ Erreur : "No file uploaded"
**Solution** : Dans l'onglet Body > form-data, assurez-vous de sélectionner un fichier pour la clé "file"

### ❌ Erreur : "Validation error: end after start"
**Solution** : Vérifiez que `end` est après `start` dans les rendez-vous

### ❌ Erreur : 401 Unauthorized (Prescriptions)
**Solution** : Les routes prescriptions nécessitent TOUJOURS un token. Exécutez `Auth > Login` d'abord

## 🎨 Personnalisation

### Changer l'URL de base

1. Ouvrez l'environnement **CareFlow EHR - Local**
2. Modifiez `baseUrl` :
   ```
   http://localhost:VOTRE_PORT/api
   ```

### Ajouter un nouvel environnement (Production)

1. Dupliquez l'environnement Local
2. Renommez-le "CareFlow EHR - Production"
3. Changez le `baseUrl` vers votre serveur de production

### Remplir manuellement les variables

Si les scripts ne fonctionnent pas, vous pouvez remplir manuellement :

1. Cliquez sur l'icône "œil" 👁️ en haut à droite
2. Cliquez sur "Edit" à côté de votre environnement
3. Remplissez les valeurs dans la colonne "CURRENT VALUE"

## 📚 Ressources supplémentaires

- 📖 [README complet](./README.md) - Documentation détaillée
- 🔐 [Validators Joi](../src/validators/) - Schémas de validation
- 🛣️ [Routes](../src/routes/) - Définition des endpoints
- 🎮 [Controllers](../src/controllers/) - Logique métier

## 🆘 Besoin d'aide ?

1. Vérifiez que le serveur est démarré
2. Vérifiez que MongoDB est connecté
3. Vérifiez que MinIO est démarré (pour les documents)
4. Consultez les logs du serveur : `logs/app.log`
5. Utilisez les scripts de test dans `test/integration/`

## ✅ Checklist de démarrage

- [ ] Serveur démarré sur le port 5001
- [ ] MongoDB connecté
- [ ] MinIO démarré (pour documents)
- [ ] Collection Postman importée
- [ ] Environnement "CareFlow EHR - Local" sélectionné
- [ ] Inscription réussie (Register)
- [ ] Connexion réussie (Login) - Token sauvegardé
- [ ] Patient créé - ID sauvegardé
- [ ] Prêt à tester ! 🎉

---

**Temps de setup : ~5 minutes** ⏱️

Bon test ! 🚀
