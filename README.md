# CareFlow EHR

## Description
CareFlow EHR est une application de gestion de dossiers médicaux électroniques (EHR) permettant aux professionnels de santé de gérer les patients, les rendez-vous et les informations médicales de manière sécurisée et efficace.

---

## Technologies utilisées
- **Backend :** Node.js, Express.js  
- **Base de données :** MongoDB  
- **Langages :** JavaScript, JSON  
- **Versionning :** Git  
- **Méthodologie :** Agile  

---

## Fonctionnalités principales (MVP)
- Authentification des utilisateurs (login/signup)  
- Gestion des patients (CRUD)  
- Gestion des rendez-vous  
- Gestion des dossiers médicaux  
- API REST sécurisée  

---

## Installation
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/careflow-ehr.git
````

2. Se déplacer dans le dossier du projet :

   ```bash
   cd careflow-ehr
   ```
3. Installer les dépendances :

   ```bash
   npm install
   ```
4. Configurer les variables d’environnement dans un fichier `.env` :

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
5. Démarrer le serveur :

   ```bash
   npm start
   ```

---

## Structure du projet

```
careflow-ehr/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/ (optionnel)
│
└── README.md
```

---

## 🔌 API Documentation

### Collection Postman disponible

Une collection Postman complète avec **48 endpoints** est disponible dans le dossier `postman/`.

📁 **Fichiers disponibles :**
- `CareFlow-EHR.postman_collection.json` - Collection complète
- `CareFlow-EHR.postman_environment.json` - Variables d'environnement
- `README.md` - Documentation complète
- `QUICK_START.md` - Guide de démarrage rapide (5 minutes)

🚀 **Démarrage rapide :**
```bash
# 1. Importer les fichiers dans Postman
# 2. Sélectionner l'environnement "CareFlow EHR - Local"
# 3. Démarrer le serveur
npm start
# 4. Tester les endpoints !
```

📖 **Consultez** [`postman/QUICK_START.md`](./postman/QUICK_START.md) pour un guide complet.

### API Endpoints (exemples)

#### Authentification
* `POST /api/auth/register` — Créer un nouvel utilisateur
* `POST /api/auth/login` — Authentifier un utilisateur
* `POST /api/auth/logout` — Déconnexion
* `POST /api/auth/refresh` — Rafraîchir le token
* `POST /api/auth/password/forgot` — Mot de passe oublié
* `POST /api/auth/password/reset` — Réinitialiser le mot de passe

#### Patients
* `GET /api/patients` — Lister tous les patients
* `POST /api/patients` — Créer un patient
* `GET /api/patients/:id` — Obtenir un patient
* `PUT /api/patients/:id` — Mettre à jour un patient
* `DELETE /api/patients/:id` — Archiver un patient

#### Rendez-vous
* `GET /api/appointments/availability` — Vérifier disponibilité
* `POST /api/appointments` — Créer un rendez-vous
* `GET /api/appointments/patient/:id` — Rendez-vous par patient
* `PUT /api/appointments/:id` — Reprogrammer
* `PATCH /api/appointments/:id/status` — Changer le statut

#### Consultations
* `GET /api/consultations` — Lister toutes les consultations
* `POST /api/consultations` — Créer une consultation
* `GET /api/consultations/patient/:id` — Consultations par patient
* `PUT /api/consultations/:id` — Mettre à jour
* `DELETE /api/consultations/:id` — Supprimer

#### Documents
* `POST /api/documents/upload` — Uploader un document
* `GET /api/documents/patient/:id` — Documents par patient
* `GET /api/documents/:id/download` — URL de téléchargement
* `DELETE /api/documents/:id` — Supprimer un document

#### Ordonnances de laboratoire
* `POST /api/lab-orders` — Créer une ordonnance
* `GET /api/lab-orders/patient/:id` — Ordonnances par patient
* `POST /api/lab-orders/:id/results` — Uploader résultats
* `POST /api/lab-orders/:id/report` — Uploader rapport PDF

#### Prescriptions
* `POST /api/prescriptions` — Créer une prescription
* `GET /api/prescriptions/patient/:id` — Prescriptions par patient
* `PATCH /api/prescriptions/:id/dispense` — Dispenser

#### Administration
* `GET /api/admin/users` — Lister tous les utilisateurs
* `POST /api/admin/users` — Créer un utilisateur
* `PATCH /api/admin/users/:id/suspend` — Suspendre
* `PATCH /api/admin/users/:id/activate` — Activer

**Total : 48 endpoints documentés dans la collection Postman**

---

## Contribuer

Les contributions sont les bienvenues !

1. Forker le dépôt
2. Créer une branche (`git checkout -b feature/nom-feature`)
3. Committer vos changements (`git commit -m 'Ajouter une nouvelle fonctionnalité'`)
4. Pusher la branche (`git push origin feature/nom-feature`)
5. Ouvrir une Pull Request

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## Contact

Pour toute question ou suggestion : [keltoummalouki@gmail.com](mailto:keltoummalouki@gmail.com)

```
```
